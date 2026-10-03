const fs = require('fs');
const dash = fs.readFileSync('public/dashboard.html', 'utf8');
const appJs = fs.readFileSync('public/js/app.js', 'utf8');

console.log('Modals in dashboard.html:');
const linesDash = dash.split('\n');
linesDash.forEach((l, i) => {
  if (l.includes('id=') && (l.includes('Modal') || l.includes('modal') || l.includes('popup') || l.includes('Popup'))) {
    console.log((i+1) + ': ' + l.trim());
  }
});

console.log('\nPopups / Modals in app.js:');
const linesApp = appJs.split('\n');
linesApp.forEach((l, i) => {
  if (l.includes('Modal') || l.includes('Popup') || l.includes('popup') || l.includes('Announcement')) {
    if (l.includes('open') || l.includes('show') || l.includes('remove(\'hidden\')') || l.includes('display')) {
      console.log((i+1) + ': ' + l.trim());
    }
  }
});
