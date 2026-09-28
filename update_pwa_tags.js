const fs = require('fs');

const files = [
  'public/index.html',
  'public/dashboard.html',
  'public/login.html',
  'public/register.html',
  'public/admin.html'
];

const pwaMeta = `  <!-- PWA Settings -->
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#4f46e5">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="MapReview">
  <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">`;

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  if (!content.includes('rel="manifest"')) {
    content = content.replace('</head>', `${pwaMeta}\n</head>`);
  }
  if (!content.includes('/js/pwa-installer.js')) {
    content = content.replace('</body>', `  <script src="/js/pwa-installer.js"></script>\n</body>`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully added PWA tags to:', filePath);
});
