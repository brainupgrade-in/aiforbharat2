import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import path from 'path';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import jwt from 'jsonwebtoken';

const required = ['JWT_SECRET', 'HASURA_URL', 'DR_MODEL_URL', 'IMAGE_DIR'];
for (const k of required) {
  if (!process.env[k]) { console.error(`missing env: ${k}`); process.exit(1); }
}

const HASURA_URL   = process.env.HASURA_URL;
const DR_MODEL_URL = process.env.DR_MODEL_URL;
const IMAGE_DIR    = process.env.IMAGE_DIR;
const MAX_BYTES    = Number(process.env.MAX_IMAGE_BYTES || 20 * 1024 * 1024);
const REQ_TIMEOUT  = Number(process.env.REQUEST_TIMEOUT_MS || 60_000);

function authClaims(req) {
  const m = /^Bearer\s+(.+)$/.exec(req.headers.authorization || '');
  if (!m) { const e = new Error('missing token'); e.statusCode = 401; throw e; }
  try {
    const claims = jwt.verify(m[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
    return { token: m[1], userId: claims.sub };
  } catch {
    const e = new Error('invalid token'); e.statusCode = 401; throw e;
  }
}

async function callDrModel(buffer, filename, mimetype) {
  const fd = new FormData();
  fd.append('image', new Blob([buffer], { type: mimetype }), filename || 'fundus.jpg');
  const r = await fetch(DR_MODEL_URL, {
    method: 'POST',
    body: fd,
    signal: AbortSignal.timeout(REQ_TIMEOUT),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    const err = new Error(`dr-model ${r.status}: ${text.slice(0, 200)}`);
    err.statusCode = 502;
    throw err;
  }
  return r.json();
}

async function hasuraQuery(userToken, query, variables) {
  const r = await fetch(HASURA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`,
    },
    body: JSON.stringify({ query, variables }),
    signal: AbortSignal.timeout(REQ_TIMEOUT),
  });
  const data = await r.json();
  if (data.errors) {
    const err = new Error('hasura error: ' + JSON.stringify(data.errors).slice(0, 200));
    err.statusCode = 500;
    throw err;
  }
  return data.data;
}

function buildRecommendations(prediction) {
  if (prediction.has_dr) {
    const msgs = [
      'Schedule an appointment with an ophthalmologist',
      'Monitor blood glucose closely; aim for HbA1c < 7%',
      'Re-screen every 6 months until stable',
    ];
    if (prediction.risk_level === 'high') {
      msgs.unshift('Urgent: visit an eye specialist within 1-2 weeks');
    }
    return msgs;
  }
  return [
    'No DR detected. Continue annual DR screening',
    'Maintain blood glucose, blood pressure, and cholesterol targets',
    'Continue healthy diet and regular exercise',
  ];
}

const app = Fastify({ logger: { level: process.env.LOG_LEVEL || 'info' } });
await app.register(cors, { origin: true });
await app.register(multipart, { limits: { fileSize: MAX_BYTES, files: 1 } });

app.get('/api/scan/health', async () => ({ ok: true }));

app.post('/api/scan', async (req, reply) => {
  let auth;
  try { auth = authClaims(req); }
  catch (e) { return reply.code(e.statusCode).send({ error: e.message }); }

  const file = await req.file();
  if (!file) return reply.code(400).send({ error: 'no image uploaded' });
  if (!file.mimetype.startsWith('image/')) {
    return reply.code(400).send({ error: 'expected image/* content type' });
  }

  const buffer = await file.toBuffer();
  if (buffer.length === 0) return reply.code(400).send({ error: 'empty image' });

  const scanId = randomUUID();
  const ext = file.mimetype === 'image/png' ? 'png' : 'jpg';
  const imageKey = `${auth.userId}/${scanId}.${ext}`;
  const fullPath = path.join(IMAGE_DIR, imageKey);

  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, buffer);

  let prediction;
  try {
    prediction = await callDrModel(buffer, file.filename, file.mimetype);
  } catch (e) {
    req.log.error({ err: e.message }, 'dr-model call failed');
    await fs.unlink(fullPath).catch(() => {});
    return reply.code(e.statusCode || 502).send({ error: 'classifier unavailable', details: e.message });
  }

  const mutation = `
    mutation InsertScan(
      $image_key: String!
      $classification: String!
      $confidence: numeric!
      $risk_level: String!
      $findings: jsonb
      $recommendations: jsonb
    ) {
      insert_retina_scan_one(object: {
        image_key: $image_key
        classification: $classification
        confidence: $confidence
        risk_level: $risk_level
        findings: $findings
        recommendations: $recommendations
      }) {
        id
        image_key
        classification
        confidence
        risk_level
        findings
        recommendations
        created_at
      }
    }
  `;

  let row;
  try {
    const data = await hasuraQuery(auth.token, mutation, {
      image_key: imageKey,
      classification: prediction.classification,
      confidence: prediction.confidence,
      risk_level: prediction.risk_level,
      findings: prediction.probs,
      recommendations: buildRecommendations(prediction),
    });
    row = data.insert_retina_scan_one;
  } catch (e) {
    req.log.error({ err: e.message }, 'hasura insert failed');
    await fs.unlink(fullPath).catch(() => {});
    return reply.code(e.statusCode || 500).send({ error: 'persistence failed', details: e.message });
  }

  return {
    ...row,
    has_dr: prediction.has_dr,
    p_any_dr: prediction.p_any_dr,
    threshold: prediction.threshold,
    inference_ms: prediction.inference_ms,
  };
});

app.get('/api/scan/:id/image', async (req, reply) => {
  let auth;
  try { auth = authClaims(req); }
  catch (e) { return reply.code(e.statusCode).send({ error: e.message }); }

  const data = await hasuraQuery(auth.token,
    `query($id: uuid!) { retina_scan_by_pk(id: $id) { image_key user_id } }`,
    { id: req.params.id }
  ).catch((e) => { reply.code(500).send({ error: e.message }); return null; });
  if (!data) return;
  const scan = data.retina_scan_by_pk;
  if (!scan) return reply.code(404).send({ error: 'not found' });

  const fullPath = path.join(IMAGE_DIR, scan.image_key);
  try {
    await fs.access(fullPath);
  } catch {
    return reply.code(404).send({ error: 'image missing on disk' });
  }
  const ext = scan.image_key.split('.').pop();
  reply.type(ext === 'png' ? 'image/png' : 'image/jpeg');
  return reply.send(createReadStream(fullPath));
});

const port = Number(process.env.PORT || 8080);
app.listen({ host: '0.0.0.0', port }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
});
