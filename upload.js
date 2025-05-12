const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true, // <== Critical for headless environments!
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.naukri.com/nlogin/login');

  await page.waitForSelector('#usernameField', { timeout: 15000 });
  await page.fill('#usernameField', process.env.NAUKRI_EMAIL);

  await page.waitForSelector('#passwordField', { timeout: 15000 });
  await page.fill('#passwordField', process.env.NAUKRI_PASSWORD);

  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');

  await page.goto('https://www.naukri.com/mnjuser/profile');

  const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 15000 });
  await fileInput.setInputFiles('your_resume.pdf');

  console.log('✅ Resume uploaded successfully');
  await page.waitForTimeout(5000);
  await browser.close();
})();