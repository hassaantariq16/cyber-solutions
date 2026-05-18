async function runTest() {
  const base = process.env.TARGET_URL || 'http://localhost:5000';
  const url = `${base}/api/blogs`;
  console.log('Creating blog via API:', url);
  const payload = {
    title: 'Selenium Test Blog ' + Date.now(),
    content: 'This is a test blog created by selenium tests',
    author: 'Test'
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch((e) => { throw e; });
  if (res.status !== 201) throw new Error('Create blog failed: ' + res.status);
  const body = await res.json();
  if (!body.data || !body.data.slug) throw new Error('Created blog missing data');
  console.log('Create blog OK:', body.data.slug);
}

module.exports = { runTest };
