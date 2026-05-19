console.error(
  [
    'This script intentionally does not generate Docker, GitHub Actions, or AKS evidence screenshots.',
    '',
    'For the final submission, capture those screenshots from the real tools:',
    '- docker compose ps',
    '- the actual GitHub Actions run page',
    '- kubectl get pods -o wide and kubectl get svc -o wide against the live AKS cluster',
    '',
    'For live application screenshots only, run:',
    '  node capture_screenshots.js',
  ].join('\n')
);

process.exit(1);
