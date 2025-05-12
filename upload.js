const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true }); // Set to false for debugging
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
  });
  const page = await context.newPage();

  // Go directly to login page
  await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'domcontentloaded' });

  // Wait and fill in username and password
  await page.waitForSelector('#usernameField', { timeout: 10000 });
  await page.fill('#usernameField', process.env.NAUKRI_EMAIL);
  await page.fill('#passwordField', process.env.NAUKRI_PASSWORD);

  // Click login button
  await page.click('button.btn-block');

  // Wait for navigation or redirection after login
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  // Go to resume upload section
  await page.goto('https://www.naukri.com/mnjuser/profile/edit', { waitUntil: 'domcontentloaded' });

  // Wait for file input and upload resume
  const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 10000 });
  await fileInput.setInputFiles('vishnu_pega_developer.pdf');

  console.log('✅ Resume uploaded successfully!');
  await browser.close();
})();