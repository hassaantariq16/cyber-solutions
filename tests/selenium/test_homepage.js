const { Builder, By, until } = require('selenium-webdriver');

async function runTest() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
    const target = process.env.TARGET_URL || 'http://localhost:3000';
    console.log('Visiting', target);
    await driver.get(target);
    await driver.sleep(1000);
    const nav = await driver.findElements(By.css('nav'));
    console.log('Nav elements found:', nav.length);
    const main = await driver.findElements(By.css('main, body'));
    console.log('Main/body elements found:', main.length);
    console.log('Homepage load test completed');
  } finally {
    await driver.quit();
  }
}

module.exports = { runTest };
