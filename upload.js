const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true }); // set to false to see the browser
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log("Navigating to login page...");
    await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'networkidle' });

    console.log("Filling login form...");
    await page.getByPlaceholder('Enter Email ID / Username').fill(process.env.NAUKRI_EMAIL || 'your-email@example.com');
    await page.getByPlaceholder('Enter Password').fill(process.env.NAUKRI_PASSWORD || 'your-password');

    console.log("Clicking login...");
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('button', { name: 'Login' }).click()
    ]);

    // Optional: Confirm login success by checking if a known post-login element exists
    console.log("Verifying login...");
    const isLoggedIn = await page.locator('text=My Naukri').isVisible({ timeout: 10000 });
    if (!isLoggedIn) {
      throw new Error("❌ Login failed. Please check your credentials.");
    }

    // Navigate to resume profile section
    console.log("Navigating to profile page...");
    await page.goto('https://www.naukri.com/mnjuser/profile', { waitUntil: 'networkidle' });

    // Wait for the upload input
    console.log("Waiting for resume upload input...");
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