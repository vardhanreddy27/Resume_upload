const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,  // For testing
    args: ['--start-maximized']
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113 Safari/537.36',
    viewport: null
  });
  const page = await context.newPage();

  await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'domcontentloaded' });

  // Wait for React login to render (increase timeout)
  await page.waitForSelector('#usernameField', { timeout: 30000 });

  // Slow typing mimics human
  await page.type('#usernameField', process.env.NAUKRI_EMAIL, { delay: 100 });
  await page.type('#passwordField', process.env.NAUKRI_PASSWORD, { delay: 100 });

  await page.click('button[type="submit"]');

  await page.waitForNavigation({ waitUntil: 'networkidle' });

  await page.goto('https://www.naukri.com/mnjuser/profile/edit', { waitUntil: 'networkidle' });

  const fileInput = await page.waitForSelector('input[type="file"]', { timeout: 10000 });
  await fileInput.setInputFiles('vishnu_pega_developer.pdf');

  console.log('✅ Resume uploaded successfully!');
  await browser.close();
})();