#!/usr/bin/env node

/**
 * Mobile App Screenshot Capture Script
 * Captures full-page screenshots of wireframes with JavaScript loaded
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DOCS_DIR = '/home/rajesh/ai-for-bharat-2/docs';
const OUTPUT_DIR = '/home/rajesh/ai-for-bharat-2/screenshots';
const VIEWPORT_WIDTH = 390;
const VIEWPORT_HEIGHT = 844;

// Create output directory
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

console.log('Creating mobile app screenshots...');
console.log(`Viewport: ${VIEWPORT_WIDTH}x${VIEWPORT_HEIGHT}\n`);

pages.forEach(page => {
    const inputFile = path.join(DOCS_DIR, page.file);
    const outputFile = path.join(OUTPUT_DIR, `screenshot-${page.name}.png`);

    console.log(`Capturing: ${page.description}`);
    console.log(`  Source: ${inputFile}`);
    console.log(`  Output: ${outputFile}`);

    try {
        // Use Chrome with timeout to allow JavaScript to load
        const cmd = `google-chrome --headless=new --disable-gpu \
            --window-size=${VIEWPORT_WIDTH},${VIEWPORT_HEIGHT} \
            --screenshot="${outputFile}" \
            --hide-scrollbars \
            --force-device-scale-factor=2 \
            --virtual-time-budget=3000 \
            --run-all-compositor-stages-before-draw \
            --disable-web-security \
            --disable-features=IsolateOrigins,site-per-process \
            "file://${inputFile}"`;

        execSync(cmd, { stdio: 'pipe' });

        const stats = fs.statSync(outputFile);
        console.log(`  ✓ Success (${(stats.size / 1024).toFixed(0)} KB)`);
    } catch (error) {
        console.log(`  ✗ Failed: ${error.message}`);
    }
    console.log('');
});

console.log('Screenshot capture complete!');
console.log(`\nScreenshots saved in: ${OUTPUT_DIR}`);

// List all screenshots
try {
    const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.png'));
    console.log('\nGenerated screenshots:');
    files.forEach(file => {
        const stats = fs.statSync(path.join(OUTPUT_DIR, file));
        console.log(`  - ${file} (${(stats.size / 1024).toFixed(0)} KB)`);
    });
} catch (error) {
    console.error('Error listing screenshots:', error.message);
}
