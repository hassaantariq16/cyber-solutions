const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.resolve(__dirname, '../../screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function takeScreenshot(driver, url, filename) {
  await driver.get(url);
  await driver.wait(until.elementLocated(By.css('body')), 5000);
  const img = await driver.takeScreenshot();
  fs.writeFileSync(path.join(SCREENSHOT_DIR, filename), img, 'base64');
  console.log('Saved', filename);
}

async function run() {
  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  try {
    const base = process.env.TARGET_URL || 'http://localhost:3000';

    await takeScreenshot(driver, `${base}/`, '01_homepage_hero.png');
    await takeScreenshot(driver, `${base}/services`, '02_services_dropdown.png');
    await takeScreenshot(driver, `${base}/blogs`, '03_blogs_loading.png');
    await takeScreenshot(driver, `${base}/admin/blogs`, '04_admin_dashboard.png');

    // Editor screenshots: fill title and author, try to set content
    await driver.get(`${base}/blogs/new`);
    await driver.wait(until.elementLocated(By.id('title')), 5000);
    const titleEl = await driver.findElement(By.id('title'));
    await titleEl.clear();
    await titleEl.sendKeys('Automated Screenshot Title ' + Date.now());
    await driver.takeScreenshot().then(img => fs.writeFileSync(path.join(SCREENSHOT_DIR, '05_editor_title_input.png'), img, 'base64'));
    const authorEl = await driver.findElement(By.id('author'));
    await authorEl.clear();
    await authorEl.sendKeys('AutoTester');
    await driver.takeScreenshot().then(img => fs.writeFileSync(path.join(SCREENSHOT_DIR, '06_editor_author_input.png'), img, 'base64'));

    // Try to populate SunEditor editable area
    try {
      await driver.executeScript(`
        const editable = document.querySelector('.se-wrapper .se-editable');
        if (editable) { editable.focus(); editable.innerHTML = '<p>This is automated content inserted for screenshots.</p>'; }
      `);
      await driver.takeScreenshot().then(img => fs.writeFileSync(path.join(SCREENSHOT_DIR, '07_editor_content_input.png'), img, 'base64'));
    } catch (e) {
      console.warn('Failed to set editor content programmatically', e);
    }

    // Submit the form and capture result
    try {
      const submitBtn = await driver.findElement(By.css('button[type="submit"]'));
      await driver.executeScript("arguments[0].scrollIntoView(true);", submitBtn);
      await driver.sleep(500);
      await submitBtn.click();
      console.log('Submit button clicked');
      // wait for success notification or redirect
      await driver.sleep(3000);
    } catch (e) {
      console.warn('Submit click error:', e.message);
    }
    await driver.takeScreenshot().then(img => fs.writeFileSync(path.join(SCREENSHOT_DIR, '08_editor_submit_blog.png'), img, 'base64'));

    // Capture blogs page again to show new post
    await driver.sleep(1000);
    await takeScreenshot(driver, `${base}/blogs`, '03_blogs_loading_updated.png');

    console.log('All page screenshots saved to', SCREENSHOT_DIR);
  } finally {
    await driver.quit();
  }
}

run().catch(err => {
  console.error('Screenshot run failed:', err);
  process.exit(1);
});
