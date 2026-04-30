/**
 * End-to-End Integration Test Suite for Nazar AI (on-prem k3s deployment)
 *
 * Stack tested: Magic-link Auth → Hasura GraphQL → ollama_cloud Chatbot → Live Site
 * All requests go through https://nazarai.gheware-ai.com (Cloudflare → Traefik → services).
 *
 * Required env:
 *   TEST_PUBLIC_URL          (default https://nazarai.gheware-ai.com)
 *   HASURA_ADMIN_SECRET      (for OTP injection / cleanup)
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import bcrypt from 'bcryptjs'

const PUBLIC_URL = process.env.TEST_PUBLIC_URL || 'https://nazarai.gheware-ai.com'
const ADMIN      = process.env.HASURA_ADMIN_SECRET
const TEST_EMAIL = `e2e+vitest-${Date.now()}@nazar.local`

if (!ADMIN) {
  throw new Error('HASURA_ADMIN_SECRET env var required to run e2e tests')
}

// ─── helpers ────────────────────────────────────────────────────────────────

async function adminGql(query, variables = {}) {
  const r = await fetch(`${PUBLIC_URL}/api/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Hasura-Admin-Secret': ADMIN },
    body: JSON.stringify({ query, variables }),
  })
  return r.json()
}

async function userGql(token, query, variables = {}) {
  const r = await fetch(`${PUBLIC_URL}/api/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  })
  return r.json()
}

// ─── shared state ───────────────────────────────────────────────────────────

let token       // user JWT (HS256, signed by nazar-auth)
let userId      // app_user.id

// ─── setup: inject OTP, exchange for JWT ────────────────────────────────────

beforeAll(async () => {
  const otp     = '123456'
  const otpHash = await bcrypt.hash(otp, 10)

  // Wipe any prior state for this email (defensive — email is unique-per-run anyway)
  await adminGql(`
    mutation Cleanup($email: String!) {
      delete_login_otp(where: { email: { _eq: $email } })  { affected_rows }
      delete_app_user (where: { email: { _eq: $email } })  { affected_rows }
    }
  `, { email: TEST_EMAIL })

  // Inject a known OTP via Hasura admin (login_otp is admin-only)
  const inject = await adminGql(`
    mutation InjectOtp($email: String!, $hash: String!) {
      insert_login_otp_one(object: {
        email: $email
        otp_hash: $hash
        expires_at: "2030-01-01T00:00:00Z"
      }) { email }
    }
  `, { email: TEST_EMAIL, hash: otpHash })
  if (inject.errors) throw new Error('OTP inject failed: ' + JSON.stringify(inject.errors))

  // Exchange via the real /auth/verify endpoint
  const r = await fetch(`${PUBLIC_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, otp }),
  })
  const out = await r.json()
  if (!r.ok) throw new Error('verify failed: ' + JSON.stringify(out))
  token  = out.token
  userId = out.user.id
})

afterAll(async () => {
  // app_user delete cascades to glucose_reading / chat_message / etc.
  await adminGql(`
    mutation Teardown($email: String!) {
      delete_login_otp(where: { email: { _eq: $email } })  { affected_rows }
      delete_app_user (where: { email: { _eq: $email } })  { affected_rows }
    }
  `, { email: TEST_EMAIL })
})

// ─── 1. PUBLIC SITE HEALTH ──────────────────────────────────────────────────

describe('1. Public Site Health', () => {
  it('serves the React SPA at /', async () => {
    const r = await fetch(PUBLIC_URL)
    expect(r.status).toBe(200)
    const html = await r.text()
    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('Nazar')
  })

  it('auth service /auth/health returns ok', async () => {
    const r = await fetch(`${PUBLIC_URL}/auth/health`)
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true })
  })

  it('chatbot /api/chat/health returns ok', async () => {
    const r = await fetch(`${PUBLIC_URL}/api/chat/health`)
    expect(r.status).toBe(200)
    expect(await r.json()).toEqual({ ok: true })
  })
})

// ─── 2. MAGIC-LINK AUTH ─────────────────────────────────────────────────────

describe('2. Magic-link Auth', () => {
  it('issues a JWT on valid OTP (set up in beforeAll)', () => {
    expect(token).toBeTruthy()
    expect(userId).toBeTruthy()
  })

  it('/auth/me returns the user with valid JWT', async () => {
    const r = await fetch(`${PUBLIC_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    expect(r.status).toBe(200)
    const data = await r.json()
    expect(data.user.id).toBe(userId)
    expect(data.user.email).toBe(TEST_EMAIL)
  })

  it('/auth/me rejects missing token with 401', async () => {
    const r = await fetch(`${PUBLIC_URL}/auth/me`)
    expect(r.status).toBe(401)
  })

  it('/auth/verify rejects bad OTP', async () => {
    const r = await fetch(`${PUBLIC_URL}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: TEST_EMAIL, otp: '000000' }),
    })
    expect(r.status).toBe(401)
  })
})

// ─── 3. HASURA GRAPHQL — ROW-LEVEL SECURITY ─────────────────────────────────

describe('3. Hasura GraphQL — RLS for `user` role', () => {
  let glucoseId
  let profileId

  it('insert glucose_reading auto-sets user_id from JWT claim', async () => {
    const result = await userGql(token, `
      mutation Ins($value: Int!, $context: String!, $reading_at: timestamptz!, $status: String!) {
        insert_glucose_reading_one(object: {
          value: $value, context: $context, reading_at: $reading_at, status: $status
        }) { id value context status }
      }
    `, { value: 105, context: 'Fasting', reading_at: new Date().toISOString(), status: 'normal' })

    expect(result.errors).toBeUndefined()
    expect(result.data.insert_glucose_reading_one.value).toBe(105)
    glucoseId = result.data.insert_glucose_reading_one.id

    // Confirm via admin that user_id was set correctly
    const verify = await adminGql(`
      query($id: uuid!) { glucose_reading_by_pk(id: $id) { user_id } }
    `, { id: glucoseId })
    expect(verify.data.glucose_reading_by_pk.user_id).toBe(userId)
  })

  it('list glucose_reading returns only own rows', async () => {
    const result = await userGql(token, `query { glucose_reading { id value user_id } }`)
    expect(result.errors).toBeUndefined()
    expect(result.data.glucose_reading.length).toBeGreaterThan(0)
    for (const row of result.data.glucose_reading) {
      expect(row.user_id).toBe(userId)
    }
  })

  it('insert + read user_profile', async () => {
    const ins = await userGql(token, `
      mutation Ins($name: String, $age: Int, $diabetes_type: String, $language: String) {
        insert_user_profile_one(object: {
          name: $name, age: $age, diabetes_type: $diabetes_type, language: $language
        }) { user_id name age diabetes_type language }
      }
    `, { name: 'E2E User', age: 45, diabetes_type: 'Type 2', language: 'en' })
    expect(ins.errors).toBeUndefined()
    expect(ins.data.insert_user_profile_one.user_id).toBe(userId)
    profileId = ins.data.insert_user_profile_one.user_id
  })

  it('login_otp is NOT readable by user role (admin-only table)', async () => {
    const result = await userGql(token, `query { login_otp { email } }`)
    expect(result.errors).toBeDefined()
    // Hasura returns "field 'login_otp' not found" because the user role has no select perm
    expect(JSON.stringify(result.errors)).toMatch(/login_otp/)
  })
})

// ─── 4. CHATBOT (ollama_cloud kimi-k2.6) ────────────────────────────────────

describe('4. Chatbot — kimi-k2.6:cloud', () => {
  it('rejects request without JWT (401)', async () => {
    const r = await fetch(`${PUBLIC_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'hi', lang: 'en' }),
    })
    expect(r.status).toBe(401)
  })

  it('returns a non-empty English response', async () => {
    const r = await fetch(`${PUBLIC_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: 'What is a normal fasting blood sugar level?', lang: 'en' }),
    })
    expect(r.status).toBe(200)
    const data = await r.json()
    expect(data.response).toBeTruthy()
    expect(data.response.length).toBeGreaterThan(40)
    expect(data.model).toBeTruthy()
  }, 90_000)

  it('rejects empty message with 400', async () => {
    const r = await fetch(`${PUBLIC_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: '', lang: 'en' }),
    })
    expect(r.status).toBe(400)
  })
})
