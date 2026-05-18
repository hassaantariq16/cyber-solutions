const homepage = require('./test_homepage');
const apiTest = require('./test_api_response');
const createTest = require('./test_create_blog');

async function runAll() {
  try {
    console.log('Running homepage test');
    await homepage.runTest();
    console.log('Running API response test');
    await apiTest.runTest();
    console.log('Running create blog test');
    await createTest.runTest();
    console.log('All tests passed');
    process.exit(0);
  } catch (e) {
    console.error('Tests failed:', e);
    process.exit(1);
  }
}

runAll();
