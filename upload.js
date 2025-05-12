const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false }); // set to true on server
  const page = await browser.newPage();

  // Go to login page
  await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'networkidle' });

  // Wait for React app inside #root to render login input
  await page.waitForSelector('#usernameField', { timeout: 15000 });
  await page.fill('#usernameField', process.env.NAUKRI_EMAIL);
  await page.fill('#passwordField', process.env.NAUKRI_PASSWORD);

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for successful login
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  // Go to resume upload page
  await page.goto('https://www.naukri.com/mnjuser/profile/edit', { waitUntil: 'networkidle' });

  // Upload resume
  const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 10000 });
  await fileInput.setInputFiles('vishnu_pega_developer.pdf');

  console.log('✅ Resume uploaded successfully!');
  await browser.close();
})();