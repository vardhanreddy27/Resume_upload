const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // Must be false for xvfb
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to login page...");
  await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'networkidle' });

  console.log("Waiting for username field...");
  await page.waitForSelector('#usernameField', { timeout: 60000 });

  await page.fill('#usernameField', process.env.NAUKRI_EMAIL);
  await page.fill('#passwordField', process.env.NAUKRI_PASSWORD);

  await page.click('button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  console.log("Navigating to resume page...");
  await page.goto('https://www.naukri.com/mnjuser/profile', { waitUntil: 'networkidle' });

  console.log("Uploading resume...");
  const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 60000 });
  await fileInput.setInputFiles('vishnu_pega_developer.pdf');

  console.log('✅ Resume uploaded successfully.');
  await browser.close();
})();
