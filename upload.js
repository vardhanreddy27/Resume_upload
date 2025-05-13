const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true }); // set false to debug locally
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Navigating to login page...");
  await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'networkidle' });

  console.log("Waiting for email input...");
  await page.waitForSelector('input[placeholder="Email ID / Username"]', { timeout: 60000 }); // wait up to 60s

  await page.fill('input[placeholder="Email ID / Username"]', process.env.NAUKRI_EMAIL);
  await page.fill('input[placeholder="Password"]', process.env.NAUKRI_PASSWORD);

  console.log("Clicking login...");
  await page.click('button[type="submit"]');

  // Wait for navigation to complete after login
  await page.waitForNavigation({ waitUntil: 'networkidle' });

  // Navigate to the resume upload page
  console.log("Navigating to resume upload page...");
  await page.goto('https://www.naukri.com/mnjuser/profile', { waitUntil: 'networkidle' });

  // Wait for the upload button
  console.log("Waiting for upload input...");
  const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 60000 });

  // Upload your resume
  await fileInput.setInputFiles('vishnu_pega_developer.pdf');

  console.log('✅ Resume uploaded successfully.');

  await browser.close();
})();