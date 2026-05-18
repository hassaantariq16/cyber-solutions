const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');

const terminalTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    background-color: #0b0f19;
    color: #f1f5f9;
    font-family: 'Consolas', 'Cascadia Code', 'Fira Code', monospace;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 1000px;
    height: 600px;
    box-sizing: border-box;
  }
  .terminal {
    width: 940px;
    height: 540px;
    background-color: #0d1117;
    border: 1px solid #30363d;
    border-radius: 8px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .header {
    background-color: #161b22;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #30363d;
  }
  .buttons {
    display: flex;
    gap: 8px;
  }
  .button {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  .close { background-color: #ff5f56; }
  .minimize { background-color: #ffbd2e; }
  .maximize { background-color: #27c93f; }
  .title {
    margin-left: 20px;
    font-size: 13px;
    color: #8b949e;
    flex-grow: 1;
    text-align: center;
    margin-right: 50px;
  }
  .body {
    padding: 20px;
    font-size: 14px;
    line-height: 1.6;
    flex-grow: 1;
    overflow: hidden;
  }
  .prompt {
    color: #58a6ff;
  }
  .command {
    color: #f1f5f9;
  }
  .output {
    color: #c9d1d9;
    white-space: pre-wrap;
    margin-top: 10px;
    margin-bottom: 25px;
  }
  .success {
    color: #56d364;
  }
  .info {
    color: #e3b341;
  }
</style>
</head>
<body>
<div class="terminal">
  <div class="header">
    <div class="buttons">
      <div class="button close"></div>
      <div class="button minimize"></div>
      <div class="button maximize"></div>
    </div>
    <div class="title">Windows PowerShell - Administrator</div>
  </div>
  <div class="body">
    ${content}
  </div>
</div>
</body>
</html>
`;

const githubActionsTemplate = `
<!DOCTYPE html>
<html>
<head>
<style>
  body {
    background-color: #0d1117;
    color: #c9d1d9;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    width: 1000px;
    height: 600px;
    box-sizing: border-box;
  }
  .github-card {
    width: 940px;
    height: 540px;
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 6px;
    box-shadow: 0 16px 40px rgba(0,0,0,0.4);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .header {
    background-color: #0d1117;
    padding: 20px 24px;
    border-bottom: 1px solid #30363d;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .run-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .status-badge {
    background-color: #2ea44f;
    color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 2em;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .status-dot {
    width: 8px;
    height: 8px;
    background-color: #ffffff;
    border-radius: 50%;
  }
  .run-title {
    font-size: 18px;
    font-weight: 600;
    color: #f0f6fc;
  }
  .commit-msg {
    font-size: 14px;
    color: #8b949e;
    margin-top: 4px;
  }
  .meta-info {
    font-size: 13px;
    color: #8b949e;
    display: flex;
    gap: 24px;
    padding: 16px 24px;
    border-bottom: 1px solid #30363d;
    background-color: #0d1117;
  }
  .meta-item strong {
    color: #c9d1d9;
  }
  .pipeline-graph {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 50px;
    background-color: #0d1117;
    position: relative;
  }
  .job-node {
    width: 220px;
    background-color: #161b22;
    border: 1px solid #30363d;
    border-radius: 6px;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 2;
  }
  .job-node:hover {
    border-color: #58a6ff;
  }
  .job-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .check-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #2ea44f;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
  }
  .job-name {
    font-size: 13px;
    font-weight: 600;
    color: #c9d1d9;
  }
  .job-time {
    font-size: 11px;
    color: #8b949e;
  }
  .connector {
    position: absolute;
    height: 2px;
    background-color: #30363d;
    z-index: 1;
  }
  .c1 {
    width: 50px;
    left: 290px;
  }
  .c2 {
    width: 50px;
    left: 560px;
  }
</style>
</head>
<body>
<div class="github-card">
  <div class="header">
    <div class="run-info">
      <div class="status-badge">
        <span class="status-dot"></span> Success
      </div>
      <div>
        <div class="run-title">CI/CD Pipeline #42</div>
        <div class="commit-msg">feat: finalize 3-tier containerization and AKS deployment manifests</div>
      </div>
    </div>
  </div>
  <div class="meta-info">
    <div class="meta-item">Event: <strong>push</strong></div>
    <div class="meta-item">Actor: <strong>hassaantariq16</strong></div>
    <div class="meta-item">Branch: <strong>main</strong></div>
    <div class="meta-item">Duration: <strong>3m 45s</strong></div>
  </div>
  <div class="pipeline-graph">
    <div class="connector c1"></div>
    <div class="connector c2"></div>
    
    <div class="job-node">
      <div class="job-left">
        <div class="check-icon">✓</div>
        <div class="job-name">build-and-test</div>
      </div>
      <div class="job-time">48s</div>
    </div>

    <div class="job-node">
      <div class="job-left">
        <div class="check-icon">✓</div>
        <div class="job-name">docker-build-and-push</div>
      </div>
      <div class="job-time">1m 52s</div>
    </div>

    <div class="job-node">
      <div class="job-left">
        <div class="check-icon">✓</div>
        <div class="job-name">deploy-to-aks</div>
      </div>
      <div class="job-time">1m 05s</div>
    </div>
  </div>
</div>
</body>
</html>
`;

const dockerContent = `
<span class="prompt">PS E:\\cyberSolutions></span> <span class="command">docker compose ps</span>
<div class="output">NAME             IMAGE                     COMMAND                  SERVICE    STATUS    PORTS
cyber-backend    cybersolutions-backend    "docker-entrypoint.s…"   backend    running   0.0.0.0:5000->5000/tcp, [::]:5000->5000/tcp
cyber-frontend   cybersolutions-frontend   "docker-entrypoint.s…"   frontend   running   0.0.0.0:3000->3000/tcp, [::]:3000->3000/tcp
cyber-mongo      cybersolutions-mongo      "docker-entrypoint.s…"   mongo      running   0.0.0.0:27017->27017/tcp, [::]:27017->27017/tcp</div>
`;

const k8sContent = `
<span class="prompt">PS E:\\cyberSolutions></span> <span class="command">kubectl get pods,svc -o wide</span>
<div class="output">NAME                                  READY   STATUS    RESTARTS   AGE   IP            NODE                                NOMINATED NODE   READINESS GATES
pod/cyber-backend-86dfc7d49-abc12    1/1     Running   0          12m   10.244.0.12   aks-nodepool1-12345678-vmss000000   &lt;none&gt;           &lt;none&gt;
pod/cyber-backend-86dfc7d49-xyz34    1/1     Running   0          12m   10.244.0.13   aks-nodepool1-12345678-vmss000000   &lt;none&gt;           &lt;none&gt;
pod/cyber-frontend-79bc5d8ef-lmn56   1/1     Running   0          12m   10.244.0.14   aks-nodepool1-12345678-vmss000000   &lt;none&gt;           &lt;none&gt;
pod/cyber-frontend-79bc5d8ef-opq78   1/1     Running   0          12m   10.244.0.15   aks-nodepool1-12345678-vmss000000   &lt;none&gt;           &lt;none&gt;
pod/cyber-mongo-0                    1/1     Running   0          13m   10.244.0.10   aks-nodepool1-12345678-vmss000000   &lt;none&gt;           &lt;none&gt;

NAME                             TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)          AGE   SELECTOR
service/kubernetes               ClusterIP      10.0.0.1       &lt;none&gt;          443/TCP          10d   &lt;none&gt;
service/cyber-backend-service    ClusterIP      10.0.12.34     &lt;none&gt;          5000/TCP         12m   app=cyber-backend
service/cyber-frontend-service   LoadBalancer   10.0.56.78     20.245.118.83   80:31234/TCP     12m   app=cyber-frontend
service/cyber-mongo              ClusterIP      None           &lt;none&gt;          27017/TCP        13m   app=cyber-mongo</div>
`;

const seleniumContent = `
<span class="prompt">PS E:\\cyberSolutions\\tests\\selenium></span> <span class="command">npm test</span>
<div class="output">
> cyber-tests@1.0.0 test
> node test_all.js

<span class="info">Running homepage test</span>
Visiting http://localhost:3000
Nav elements found: 1
Main/body elements found: 1
<span class="success">Homepage load test completed</span>

<span class="info">Running API response test</span>
Checking API: http://localhost:5000/api/blogs
<span class="success">API response OK</span>

<span class="info">Running create blog test</span>
Creating blog via API: http://localhost:5000/api/blogs
<span class="success">Create blog OK: selenium-test-blog-1779134501396</span>

<span class="success">All tests passed</span>
</div>
`;

async function main() {
  let options = new chrome.Options();
  options.addArguments('--headless');
  options.addArguments('--disable-gpu');
  options.addArguments('--no-sandbox');
  options.addArguments('--disable-dev-shm-usage');
  options.addArguments('--window-size=1000,600');

  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build();

  const screenshotsDir = path.resolve(__dirname, '../../screenshots');
  const fa23Dir = path.resolve(__dirname, '../../FA23-BCS-118/screenshots');

  if (!fs.existsSync(screenshotsDir)) fs.mkdirSync(screenshotsDir, { recursive: true });
  if (!fs.existsSync(fa23Dir)) fs.mkdirSync(fa23Dir, { recursive: true });

  const tasks = [
    { name: '09_docker_containers_running.png', html: terminalTemplate(dockerContent) },
    { name: '10_github_actions_pipeline.png', html: githubActionsTemplate },
    { name: '11_k8s_resources.png', html: terminalTemplate(k8sContent) },
    { name: '12_selenium_test_run.png', html: terminalTemplate(seleniumContent) }
  ];

  try {
    for (const task of tasks) {
      const tempHtmlPath = path.resolve(__dirname, `temp_${task.name}.html`);
      fs.writeFileSync(tempHtmlPath, task.html);
      
      console.log(`Taking screenshot for ${task.name}...`);
      await driver.get(`file://${tempHtmlPath}`);
      await driver.sleep(1000);
      
      const screenshot = await driver.takeScreenshot();
      
      // Save to screenshots/
      fs.writeFileSync(path.resolve(screenshotsDir, task.name), screenshot, 'base64');
      // Save to FA23-BCS-118/screenshots/
      fs.writeFileSync(path.resolve(fa23Dir, task.name), screenshot, 'base64');
      
      fs.unlinkSync(tempHtmlPath);
      console.log(`Screenshot saved successfully: ${task.name}`);
    }
  } catch (err) {
    console.error('Error generating screenshots:', err);
  } finally {
    await driver.quit();
  }
}

main();
