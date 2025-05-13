const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true }); // Set false to debug
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("Navigating to login page...");
    await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'domcontentloaded' });

    console.log("Waiting for email input...");
    await page.waitForSelector('input[name="username"]', { timeout: 60000 });
    await page.waitForSelector('input[name="password"]', { timeout: 60000 });

    console.log("Filling login form...");
    await page.fill('input[name="username"]', process.env.NAUKRI_EMAIL || 'your-email@example.com');
    await page.fill('input[name="password"]', process.env.NAUKRI_PASSWORD || 'your-password');

    console.log("Clicking login...");
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    // Optional: Verify login success
    if (await page.url().includes('nlogin')) {
      throw new Error('Login appears to have failed. Check credentials.');
    }

    console.log("Navigating to resume upload page...");
    await page.goto('https://www.naukri.com/mnjuser/profile', { waitUntil: 'networkidle' });

    console.log("Waiting for upload input...");
    const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 60000 });

    const filePath = path.resolve(__dirname, 'vishnu_pega_developer.pdf');
    await fileInput.setInputFiles(filePath);

    console.log('✅ Resume uploaded successfully.');
  } catch (err) {
    console.error('❌ Error occurred:', err.message);
  } finally {
    await browser.close();
  }
})();