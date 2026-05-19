const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
  let options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();
  try {
    const target = process.env.TARGET_URL || 'http://localhost:3000';
    console.log('Visiting', target);
    await driver.get(target);
    await driver.sleep(1000);
    const nav = await driver.findElements(By.css('nav'));
    console.log('Nav elements found:', nav.length);
    if (nav.length < 1) throw new Error('Homepage nav was not found');
    const main = await driver.findElements(By.css('main, body'));
    console.log('Main/body elements found:', main.length);
    if (main.length < 1) throw new Error('Homepage body was not found');
    console.log('Homepage load test completed');
  } finally {
    await driver.quit();
  }
}

module.exports = { runTest };
