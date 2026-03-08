/**
 * Capture screenshots of the live Nazar AI app (all 5 tabs + auth screen)
 * Uses Puppeteer to log in via Cognito and navigate each tab.
 *
 * Usage: node capture-app-screenshots.js
 */

import puppeteer from 'puppeteer';
import { mkdir } from 'fs/promises';

const APP_URL = 'https://main.d3vwqyp1h0elbo.amplifyapp.com/';
const OUTPUT_DIR = './app-screenshots';
const TEST_EMAIL = 'testuser@nazarai.test';
const TEST_PASSWORD = 'TestPass@9876';

// Mobile viewport (iPhone 14 Pro)
const VIEWPORT = { width: 393, height: 852, deviceScaleFactor: 2 };

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  console.log('1. Loading app...');
  await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await sleep(2000);

  // Screenshot: Auth / Login screen
  console.log('2. Capturing auth screen...');
  await page.screenshot({
    path: `${OUTPUT_DIR}/01-auth-screen.png`,
    fullPage: true,
  });
  console.log('   Saved 01-auth-screen.png');

  // Sign in
  console.log('3. Signing in...');
  try {
    // Amplify UI Authenticator uses specific input names
    await page.waitForSelector('input[name="username"]', { timeout: 10000 });
    await page.type('input[name="username"]', TEST_EMAIL, { delay: 30 });
    await page.type('input[name="password"]', TEST_PASSWORD, { delay: 30 });

    // Click sign in button
    const signInBtn = await page.$(
      'button[type="submit"]'
    );
    if (signInBtn) await signInBtn.click();

    // Wait for auth to complete — look for the app header
    await page.waitForSelector('header', { timeout: 20000 });
    await sleep(2000);
  } catch (e) {
    console.error('Auth failed:', e.message);
    await page.screenshot({ path: `${OUTPUT_DIR}/auth-error.png`, fullPage: true });
    await browser.close();
    process.exit(1);
  }

  // Screenshot: Home tab
  console.log('4. Capturing Home tab...');
  await page.screenshot({
    path: `${OUTPUT_DIR}/02-home.png`,
    fullPage: true,
  });
  console.log('   Saved 02-home.png');

  // Navigate tabs by clicking bottom nav buttons
  const tabs = [
    { index: 1, name: 'scan', file: '03-scan.png' },
    { index: 2, name: 'chat', file: '04-chat.png' },
    { index: 3, name: 'glucose', file: '05-glucose.png' },
    { index: 4, name: 'community', file: '06-community.png' },
  ];

  for (const tab of tabs) {
    console.log(`5. Capturing ${tab.name} tab...`);
    // Bottom nav buttons are role="tab"
    const navButtons = await page.$$('nav[role="tablist"] button[role="tab"]');
    if (navButtons[tab.index]) {
      await navButtons[tab.index].click();
      await sleep(1500);
    }
    await page.screenshot({
      path: `${OUTPUT_DIR}/${tab.file}`,
      fullPage: true,
    });
    console.log(`   Saved ${tab.file}`);
  }

  // Bonus: capture high-contrast mode on home
  console.log('6. Capturing high-contrast mode...');
  const navButtons = await page.$$('nav[role="tablist"] button[role="tab"]');
  if (navButtons[0]) await navButtons[0].click();
  await sleep(500);

  // Click the high-contrast toggle button
  const hcButton = await page.$('button[aria-label]');
  const allHeaderButtons = await page.$$('header button');
  // High contrast is the first button in the controls area
  for (const btn of allHeaderButtons) {
    const label = await page.evaluate((el) => el.getAttribute('aria-label'), btn);
    if (label && (label.includes('contrast') || label.includes('कंट्रास्ट'))) {
      await btn.click();
      break;
    }
  }
  await sleep(1000);
  await page.screenshot({
    path: `${OUTPUT_DIR}/07-high-contrast.png`,
    fullPage: true,
  });
  console.log('   Saved 07-high-contrast.png');

  await browser.close();
  console.log(`\nDone! ${7} screenshots saved to ${OUTPUT_DIR}/`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
