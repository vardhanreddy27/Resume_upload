const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.naukri.com/mnjuser/profile');
  await page.fill('input[type="text"]', process.env.NAUKRI_EMAIL);
  await page.fill('input[type="password"]', process.env.NAUKRI_PASSWORD);
  await page.click('button[type="submit"]');

  await page.waitForTimeout(5000);
  await page.goto('https://www.naukri.com/mnjuser/profile/edit');

  const fileInput = await page.$('input[type="file"]');
  await fileInput.setInputFiles('vishnu_pega_developer.pdf');

  console.log('Resume uploaded successfully!');
  await browser.close();
})();