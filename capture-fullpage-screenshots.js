#!/usr/bin/env node

/**
 * Full-Page Mobile Screenshot Capture Script
 * Uses Puppeteer to capture complete scrollable pages with all content visible
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const DOCS_DIR = '/home/rajesh/ai-for-bharat-2/docs';
const OUTPUT_DIR = '/home/rajesh/ai-for-bharat-2/screenshots';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const pages = [
    { name: '01-landing-page', file: 'index.html', description: 'Landing Page' },
    { name: '02-dashboard', file: 'dashboard.html', description: 'Dashboard' },
    { name: '03-glucose-tracker', file: 'glucose-tracker.html', description: 'Glucose Tracker' },
    { name: '04-meal-analyzer', file: 'meal-analyzer.html', description: 'Meal Analyzer' },
    { name: '05-retina-scan', file: 'retina-scan.html', description: 'Retina Scan' },
    { name: '06-ai-advisor', file: 'chatbot.html', description: 'AI Advisor' }
];

(async () => {
    console.log('Creating full-page mobile screenshots with Puppeteer...');
    console.log('Viewport: 390x844 (iPhone 12/13)\n');

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set mobile viewport (iPhone 12/13)
    await page.setViewport({
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
    });

    // Set user agent to mobile
    await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1');

    for (const pageInfo of pages) {
        const inputFile = path.join(DOCS_DIR, pageInfo.file);
        const outputFile = path.join(OUTPUT_DIR, `screenshot-${pageInfo.name}.png`);

        console.log(`Capturing: ${pageInfo.description}`);
        console.log(`  Source: ${pageInfo.file}`);
        console.log(`  Output: screenshot-${pageInfo.name}.png`);

        try {
            // Navigate to page
            await page.goto(`file://${inputFile}`, {
                waitUntil: 'networkidle2',
                timeout: 15000
            });

            // Wait for body to be present
            await page.waitForSelector('body');

            // Wait for JavaScript to load and render
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Take full page screenshot
            await page.screenshot({
                path: outputFile,
                fullPage: true,
                captureBeyondViewport: true
            });

            const stats = fs.statSync(outputFile);
            console.log(`  ✓ Success (${(stats.size / 1024).toFixed(0)} KB)`);
        } catch (error) {
            console.log(`  ✗ Failed: ${error.message}`);
        }
        console.log('');
    }

    await browser.close();

    console.log('Screenshot capture complete!');
    console.log(`\nScreenshots saved in: ${OUTPUT_DIR}`);

    // List all screenshots
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
    console.log('\nGenerated screenshots:');
    files.forEach(file => {
        const stats = fs.statSync(path.join(OUTPUT_DIR, file));
        console.log(`  - ${file} (${(stats.size / 1024).toFixed(0)} KB)`);
    });

    const totalSize = files.reduce((sum, file) => {
        return sum + fs.statSync(path.join(OUTPUT_DIR, file)).size;
    }, 0);
    console.log(`\nTotal: ${files.length} screenshots, ${(totalSize / 1024 / 1024).toFixed(1)} MB`);
})();
