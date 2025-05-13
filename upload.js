const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'domcontentloaded' });

    // Email
    await page.fill('input[placeholder="Email ID / Username"]', process.env.NAUKRI_EMAIL);

    // Password
    await page.fill('input[placeholder="Password"]', process.env.NAUKRI_PASSWORD);

    // Click login
    await page.click('button[type="submit"]');
    await page.waitForLoadState('networkidle');

    // Navigate to profile
    await page.goto('https://www.naukri.com/mnjuser/profile', { waitUntil: 'domcontentloaded' });

    // Upload resume
    const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 10000 });
    await fileInput.setInputFiles('vishnu_pega_developer.pdf');

    console.log('✅ Resume uploaded successfully');
    await page.waitForTimeout(3000);
    await browser.close();
  } catch (error) {
    console.error('❌ Upload failed:', error);
    process.exit(1);
  }
})();