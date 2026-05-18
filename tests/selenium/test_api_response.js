async function runTest() {
  const base = process.env.TARGET_URL || 'http://localhost:5000';
  const url = `${base}/api/blogs`;
  console.log('Checking API:', url);
  const res = await fetch(url).catch((e) => { throw e; });
  if (!res.ok) throw new Error('API returned non-200');
  const body = await res.json();
  if (!('success' in body)) throw new Error('API response missing success flag');
  console.log('API response OK');
}

module.exports = { runTest };
