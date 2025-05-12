const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto('https://www.naukri.com/nlogin/login', { waitUntil: 'networkidle' });
    await page.waitForSelector('input[type="text"][name="username"]', { timeout: 60000 });
    await page.fill('input[type="text"][name="username"]', process.env.NAUKRI_EMAIL);
    await page.fill('input[type="password"][name="password"]', process.env.NAUKRI_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL('https://www.naukri.com/mnjuser/homepage', { timeout: 60000 });
    await page.goto('https://www.naukri.com/mnjuser/profile/edit', { waitUntil: 'networkidle' });
    const fileInput = await page.$('input[type="file"][id="attachCV"]');
    if (!fileInput) throw new Error('File input not found');
    await fileInput.setInputFiles('vishnu_pega_developer.pdf');
    console.log('Resume uploaded successfully!');
  } catch (error) {
    console.error('Error during upload:', error);
    throw error;
  } finally {
    await browser.close();
  }
})();