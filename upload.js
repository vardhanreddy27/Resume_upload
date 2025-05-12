const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Go to login page
  await page.goto('https://www.naukri.com/mnjuser/profile');

  // Wait for login fields
  await page.waitForSelector('#usernameField');
  await page.fill('#usernameField', process.env.NAUKRI_EMAIL);
  await page.fill('#passwordField', process.env.NAUKRI_PASSWORD);

  // Click login button
  await page.click('button.btn-large.btn-block.btn-bold.blue-btn');

  // Wait for navigation after login
  await page.waitForNavigation();

  // Go to resume upload section
  await page.goto('https://www.naukri.com/mnjuser/profile/edit');

  // Wait for file input and upload resume
  const fileInput = await page.waitForSelector('input[type="file"]');
  await fileInput.setInputFiles('vishnu_pega_developer.pdf');

  console.log('✅ Resume uploaded successfully!');
  await browser.close();
})();