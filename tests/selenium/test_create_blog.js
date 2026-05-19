const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function runTest() {
  const base = process.env.TARGET_URL || 'http://localhost:3000';
  console.log('Creating blog through browser API:', `${base}/api/blogs`);

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
    await driver.get(base);
    const result = await driver.executeAsyncScript(`
      const done = arguments[arguments.length - 1];
      fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Selenium Test Blog ' + Date.now(),
          content: 'This is a test blog created by selenium browser automation',
          author: 'Test',
          published: true
        })
      })
        .then(async (response) => ({ status: response.status, body: await response.json() }))
        .then(done)
        .catch((error) => done({ error: error.message }));
    `);

    if (result.error) throw new Error(result.error);
    if (result.status !== 201) throw new Error('Create blog failed: ' + result.status);
    if (!result.body.data || !result.body.data.slug) throw new Error('Created blog missing slug');
    console.log('Create blog OK:', result.body.data.slug);
  } finally {
    await driver.quit();
  }
}

module.exports = { runTest };
