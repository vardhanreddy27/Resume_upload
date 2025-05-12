const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Go to Naukri login page
  await page.goto('https://www.naukri.com/mnjuser/profile');

  // Wait for username input to appear
  await page.waitForSelector('#usernameField');

  // Fill in credentials from environment variables
  await page.fill('#usernameField', process.env.NAUKRI_EMAIL);
  await page.fill('#passwordField', process.env.NAUKRI_PASSWORD);

  // Click login button
  await page.click('button[type="submit"]'); // You can adjust this selector if it fails

  // Wait for login to process
  await page.waitForTimeout(5000);

  // Go to profile edit page
  await page.goto('https://www.naukri.com/mnjuser/profile/edit');

  // Upload the resume
  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('vishnu_pega_developer.pdf');

  console.log('Resume uploaded successfully!');
  await browser.close();
})();