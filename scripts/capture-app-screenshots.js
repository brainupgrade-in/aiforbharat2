/**
 * Capture fresh app screenshots from the live nazarai.gheware-ai.com via Puppeteer,
 * for use in the YouTube-Short composition (video/src/NazarAIHowToShort/).
 *
 * Strategy mirrors tests/e2e.test.js:
 *   1. Inject a known OTP into login_otp via Hasura admin (using the same
 *      bcrypt(otp + OTP_PEPPER) hashing as nazar-auth)
 *   2. Exchange via real /auth/verify to get a user JWT
 *   3. Seed user_profile + a few glucose_reading + 1 retina_scan rows so the
 *      pages we capture aren't empty
 *   4. Launch puppeteer at a tall mobile viewport, set localStorage with the
 *      JWT, navigate through tabs, screenshot each
 *   5. Cleanup: delete app_user (cascades to all child rows)
 *
 * Required env: HASURA_ADMIN_SECRET, OTP_PEPPER
 * Output:       video/public/assets/howto-short/{auth,home,scan,result,glucose,chat,history}.png
 */
import bcrypt from 'bcryptjs'
import puppeteer from 'puppeteer'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const PUBLIC_URL = process.env.TEST_PUBLIC_URL || 'https://nazarai.gheware-ai.com'
const ADMIN  = process.env.HASURA_ADMIN_SECRET
const PEPPER = process.env.OTP_PEPPER || ''
if (!ADMIN) { console.error('HASURA_ADMIN_SECRET required'); process.exit(1) }

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'video', 'public', 'assets', 'howto-short')

const TEST_EMAIL = `screenshots+${Date.now()}@nazar.local`
const TEST_NAME  = 'Asha Sharma'   // typical Indian first name; visible in profile + scans

// ── Hasura helpers ──────────────────────────────────────────────────────────
async function adminGql(query, variables = {}) {
  const r = await fetch(`${PUBLIC_URL}/api/graphql`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Hasura-Admin-Secret': ADMIN },
    body: JSON.stringify({ query, variables }),
  })
  const data = await r.json()
  if (data.errors) throw new Error('GraphQL: ' + JSON.stringify(data.errors))
  return data.data
}

async function setupUser() {
  const otp = '123456'
  const otpHash = await bcrypt.hash(otp + PEPPER, 10)

  await adminGql(`
    mutation Wipe($email: String!) {
      delete_login_otp(where: { email: { _eq: $email } }) { affected_rows }
      delete_app_user (where: { email: { _eq: $email } }) { affected_rows }
    }`, { email: TEST_EMAIL })

  await adminGql(`
    mutation InjectOtp($email: String!, $hash: String!) {
      insert_login_otp_one(object: {
        email: $email, otp_hash: $hash, expires_at: "2030-01-01T00:00:00Z"
      }) { email }
    }`, { email: TEST_EMAIL, hash: otpHash })

  const r = await fetch(`${PUBLIC_URL}/auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: TEST_EMAIL, otp }),
  })
  const out = await r.json()
  if (!r.ok) throw new Error('verify failed: ' + JSON.stringify(out))
  return { token: out.token, user: out.user }
}

async function seedData(userId) {
  // Profile (so onboarding gate doesn't trigger). Test user is fresh from
  // /auth/verify so no existing user_profile row → plain insert.
  await adminGql(`
    mutation SeedProfile($obj: user_profile_insert_input!) {
      insert_user_profile_one(object: $obj) { user_id name diabetes_type language }
    }`, {
      obj: {
        user_id: userId,
        name: TEST_NAME,
        age: 52,
        diabetes_type: 'Type 2',
        target_fasting: 100,
        target_post_meal: 140,
        language: 'en',
      },
    })

  // 5 glucose readings — last 5 days, fasting + post-meal mix
  const now = Date.now()
  const readings = [
    { v: 105, c: 'Fasting',     hours: 0   },
    { v: 142, c: 'After meal',  hours: 4   },
    { v: 98,  c: 'Fasting',     hours: 24  },
    { v: 138, c: 'After meal',  hours: 28  },
    { v: 102, c: 'Fasting',     hours: 48  },
  ]
  const objects = readings.map(({ v, c, hours }) => {
    const status = v > 140 ? 'high' : v < 70 ? 'low' : 'normal'
    return {
      user_id: userId, value: v, context: c,
      reading_at: new Date(now - hours * 3600 * 1000).toISOString(), status,
    }
  })
  await adminGql(`
    mutation SeedReadings($objs: [glucose_reading_insert_input!]!) {
      insert_glucose_reading(objects: $objs) { affected_rows }
    }`, { objs: objects })

  // 1 retina_scan so History + Result pages have content. findings has keys
  // with spaces ("Mild NPDR" etc.) so it MUST be passed as a $jsonb variable —
  // GraphQL inline object literals don't allow quoted keys.
  await adminGql(`
    mutation SeedScan($obj: retina_scan_insert_input!) {
      insert_retina_scan_one(object: $obj) { id }
    }`, {
      obj: {
        user_id: userId,
        image_key: 'seed/placeholder.png',
        classification: 'Mild NPDR',
        confidence: 0.78,
        risk_level: 'moderate',
        findings: {
          'No DR': 0.18,
          'Mild NPDR': 0.78,
          'Moderate NPDR': 0.03,
          'Severe NPDR': 0.005,
          'Proliferative DR': 0.005,
        },
        recommendations: [
          'Schedule an appointment with an ophthalmologist within 4 weeks',
          'Monitor blood glucose closely; aim for HbA1c < 7%',
          'Re-screen every 6 months until stable',
        ],
      },
    })
}

async function teardownUser() {
  await adminGql(`
    mutation Cleanup($email: String!) {
      delete_login_otp(where: { email: { _eq: $email } }) { affected_rows }
      delete_app_user (where: { email: { _eq: $email } }) { affected_rows }
    }`, { email: TEST_EMAIL })
}

// ── Capture flow ────────────────────────────────────────────────────────────
async function capture(page, name) {
  await new Promise((r) => setTimeout(r, 800))   // settle animations + apollo refetch
  const path = join(OUT_DIR, `${name}.png`)
  await page.screenshot({ path, fullPage: false, omitBackground: false })
  console.log(`  ✓ ${name}.png`)
}

async function clickTab(page, tabId) {
  await page.evaluate((id) => {
    const btns = Array.from(document.querySelectorAll('button[role="tab"]'))
    const target = btns.find((b) => b.getAttribute('aria-label')?.toLowerCase() === id || b.textContent.toLowerCase().includes(id))
    if (target) target.click()
  }, tabId)
  await new Promise((r) => setTimeout(r, 1200))   // tab transition + content
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })
  console.log(`Test email: ${TEST_EMAIL}`)

  console.log('1. Inject OTP + verify...')
  const { token, user } = await setupUser()
  const userId = user.id
  console.log(`   user.id = ${userId}`)

  console.log('2. Seed profile + readings + 1 scan...')
  await seedData(userId)

  console.log('3. Launch browser...')
  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    args: ['--no-sandbox'],
  })
  const page = await browser.newPage()
  // Realistic mobile UA
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1')

  try {
    console.log('4. Capture screens...')

    // (a) Auth screen — before setting any token
    await page.goto(PUBLIC_URL, { waitUntil: 'networkidle2', timeout: 30000 })
    await new Promise((r) => setTimeout(r, 1500))
    await capture(page, 'auth')

    // (b) Set token + reload to enter the app authenticated
    await page.evaluate(({ token, user }) => {
      localStorage.setItem('nazarai.token', token)
      localStorage.setItem('nazarai.user', JSON.stringify(user))
    }, { token, user })
    await page.reload({ waitUntil: 'networkidle2' })
    await new Promise((r) => setTimeout(r, 2000))   // profile query + home renders

    // (c) Home — should show last scan + recent glucose
    await capture(page, 'home')

    // (d) Scan tab
    await clickTab(page, 'scan')
    await capture(page, 'scan')

    // (e) Chat tab — show greeting
    await clickTab(page, 'chat')
    await capture(page, 'chat')

    // (f) Glucose tab — should show readings + trend chart
    await clickTab(page, 'glucose')
    await new Promise((r) => setTimeout(r, 1200))   // chart transitions
    await capture(page, 'glucose')

    // (g) History tab — should show 1 scan
    await clickTab(page, 'history')
    await new Promise((r) => setTimeout(r, 800))
    await capture(page, 'history')

    // (h) Tap the history row → result page (re-uses NazarResult)
    await page.evaluate(() => {
      const rows = document.querySelectorAll('button')
      for (const b of rows) {
        if (b.getAttribute('aria-label')?.startsWith('View ')) { b.click(); return }
      }
    })
    await new Promise((r) => setTimeout(r, 1800))   // iris-expand reveal animation
    await capture(page, 'result')
  } finally {
    await browser.close()
    console.log('5. Cleanup user (cascade delete)...')
    await teardownUser()
  }

  console.log('\nDone. Screenshots at', OUT_DIR)
}

main().catch((e) => { console.error(e); process.exit(1) })
