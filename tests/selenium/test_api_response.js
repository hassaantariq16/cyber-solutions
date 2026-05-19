const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
  const base = process.env.TARGET_URL || 'http://localhost:3000';
  const url = `${base}/api/blogs`;
  console.log('Checking API through browser:', url);

  const options = new chrome.Options();
  options.addArguments('--headless=new');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(url);
    await driver.wait(until.elementLocated(By.css('body')), 5000);
    const bodyText = await driver.findElement(By.css('body')).getText();
    const body = JSON.parse(bodyText);
    if (!body.success) throw new Error('API response success flag was false');
    if (!body.data || !Array.isArray(body.data.blogs)) {
      throw new Error('API response missing data.blogs array');
    }
    console.log('API response OK');
  } finally {
    await driver.quit();
  }
}

module.exports = { runTest };
