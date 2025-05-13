const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true }); // 👈 must be true in CI/servers
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("Navigating to login page...");
    await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'domcontentloaded' });

    console.log("Waiting for login form...");
    await page.waitForSelector('#usernameField', { timeout: 60000 });
    await page.waitForSelector('#passwordField', { timeout: 60000 });

    console.log("Filling login form...");
    await page.fill('#usernameField', process.env.NAUKRI_EMAIL);
    await page.fill('#passwordField', process.env.NAUKRI_PASSWORD);

    console.log("Clicking login...");
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.click('button[type="submit"]')
    ]);

    if (page.url().includes('nlogin')) {
      throw new Error('Login may have failed. Double-check credentials or CAPTCHA.');
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
