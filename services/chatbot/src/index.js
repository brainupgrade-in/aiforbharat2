import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from 'jsonwebtoken';

const required = ['JWT_SECRET', 'OLLAMA_API_KEY'];
for (const k of required) {
  if (!process.env[k]) { console.error(`missing env: ${k}`); process.exit(1); }
}

// Model order is language-dependent:
// - Indian languages (hi/kn): gpt-oss has better Devanagari/Kannada output and faster cold-start
// - English: kimi-k2.6 produces tighter India-context answers, gpt-oss as fallback
const KIMI_MODEL    = 'kimi-k2.6:cloud';
const GPT_OSS_MODEL = 'gpt-oss:120b';
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 60_000);

function modelChain(lang) {
  if (lang === 'hi' || lang === 'kn') return [GPT_OSS_MODEL, KIMI_MODEL];
  return [KIMI_MODEL, GPT_OSS_MODEL];
}

const SYSTEM_PROMPT = `You are Nazar AI, a friendly and knowledgeable diabetes health advisor designed for Indian patients. You are part of a mobile health app.

Your expertise:
- Blood glucose management (fasting, post-meal, HbA1c interpretation)
- Indian diet guidance (mention specific Indian foods, recipes, GI values, costs in INR)
- Exercise recommendations suitable for Indian lifestyles
- Diabetic retinopathy awareness and screening guidance
- Medication awareness (metformin, insulin, etc.) — never prescribe, only educate

Rules:
- Be concise and practical (mobile app, not a textbook)
- Use bullet points and bold text for readability
- Include India-specific context (Indian foods, festivals, costs in INR, government schemes like Ayushman Bharat)
- Always end with a gentle reminder: "Please consult your doctor for personalized medical advice."
- If asked in Hindi or Kannada, respond in that language
- Never diagnose conditions or prescribe medications
- For emergencies (glucose <50 or >400, chest pain, vision loss), advise calling 108 or visiting nearest hospital immediately`;

function languageInstruction(lang) {
  if (lang === 'hi') return 'Respond in Hindi (हिन्दी). Use Devanagari script.';
  if (lang === 'kn') return 'Respond in Kannada (ಕನ್ನಡ). Use Kannada script.';
  return 'Respond in English.';
}

async function callOllama(model, systemPrompt, message, signal) {
  const r = await fetch('https://ollama.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: message      },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
    signal,
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    const err = new Error(`ollama ${model} ${r.status}: ${text.slice(0, 200)}`);
    err.status = r.status;
    throw err;
  }
  const data = await r.json();
  const content = data.choices?.[0]?.message?.content?.trim() || '';
  if (!content) {
    // Treat empty content as a model failure so the next model in the chain is tried
    const err = new Error(`ollama ${model} returned empty content`);
    err.status = 502;
    throw err;
  }
  return content;
}

const app = Fastify({ logger: { level: process.env.LOG_LEVEL || 'info' } });
await app.register(cors, { origin: true });

app.get('/api/chat/health', async () => ({ ok: true }));

app.post('/api/chat', async (req, reply) => {
  const m = /^Bearer\s+(.+)$/.exec(req.headers.authorization || '');
  if (!m) return reply.code(401).send({ error: 'missing token' });
  try {
    jwt.verify(m[1], process.env.JWT_SECRET, { algorithms: ['HS256'] });
  } catch {
    return reply.code(401).send({ error: 'invalid token' });
  }

  const { message, lang = 'en' } = req.body || {};
  if (!message || !String(message).trim()) {
    return reply.code(400).send({ error: 'message required' });
  }

  const systemPrompt = `${SYSTEM_PROMPT}\n\n${languageInstruction(lang)}`;
  const chain = modelChain(lang);

  let lastErr;
  for (let i = 0; i < chain.length; i++) {
    const model = chain[i];
    try {
      const response = await callOllama(model, systemPrompt, message, AbortSignal.timeout(REQUEST_TIMEOUT_MS));
      return { response, model, ...(i > 0 ? { fallback: true } : {}) };
    } catch (e) {
      req.log.warn({ err: e.message, model }, i < chain.length - 1 ? 'model failed, trying next' : 'all models failed');
      lastErr = e;
    }
  }
  return reply.code(502).send({ error: 'AI service unavailable', details: lastErr?.message });
});

const port = Number(process.env.PORT || 8080);
app.listen({ host: '0.0.0.0', port }, (err) => {
  if (err) { app.log.error(err); process.exit(1); }
});
