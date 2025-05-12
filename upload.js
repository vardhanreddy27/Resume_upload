const { chromium } = require('playwright'); // Ensure Playwright is installed

(async () => {
  // Launch browser in headless mode to avoid XServer issues
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to Naukri login page
  await page.goto('https://www.naukri.com/nlogin/login');

  // Wait and fill in login details
  await page.waitForSelector('#usernameField', { timeout: 15000 });
  await page.fill('#usernameField', 'your-email@example.com');

  await page.waitForSelector('#passwordField', { timeout: 15000 });
  await page.fill('#passwordField', 'your-password');

  // Click login button
  await page.click('button[type="submit"]');

  // Wait for login to complete
  await page.waitForLoadState('networkidle');

  // Navigate to resume upload page (update this URL if needed)
  await page.goto('https://www.naukri.com/mnjuser/profile');

  // Wait for resume upload input
  const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 15000 });

  // Upload resume (path must be accessible)
  await fileInput.setInputFiles('/path/to/your_resume.pdf');

  console.log('✅ Resume uploaded successfully');

  // Optional: wait to ensure upload completes
  await page.waitForTimeout(5000);

  await browser.close();
})();