import Fastify from 'fastify';
import cors from '@fastify/cors';
import { requestLogin, verifyOtp, getMe } from './auth.js';

const required = ['DATABASE_URL', 'JWT_SECRET', 'SMTP_HOST', 'SMTP_USERNAME', 'SMTP_PASSWORD', 'SMTP_FROM'];
for (const k of required) {
  if (!process.env[k]) { console.error(`missing env: ${k}`); process.exit(1); }
}

const app = Fastify({ logger: { level: process.env.LOG_LEVEL || 'info' } });

await app.register(cors, { origin: true, credentials: false });

app.get('/auth/health', async () => ({ ok: true }));

app.post('/auth/request-login', async (req, reply) => {
  try {
    await requestLogin(req.body?.email);
    return reply.code(204).send();
  } catch (e) {
    return reply.code(e.statusCode || 500).send({ error: e.message });
  }
});

app.post('/auth/verify', async (req, reply) => {
  try {
    const out = await verifyOtp(req.body?.email, req.body?.otp);
    return reply.send(out);
  } catch (e) {
    return reply.code(e.statusCode || 500).send({ error: e.message });
  }
});

app.get('/auth/me', async (req, reply) => {
  try {
    const user = await getMe(req.headers.authorization);
    return reply.send({ user });
  } catch (e) {
    return reply.code(e.statusCode || 500).send({ error: e.message });
  }
});

const port = Number(process.env.PORT || 8080);
app.listen({ host: '0.0.0.0', port }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
});
