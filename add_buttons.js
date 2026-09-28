const fs = require('fs');

// 1. Dashboard
let dash = fs.readFileSync('public/dashboard.html', 'utf8');
const installBtnDash = `
        <!-- Install App Button -->
        <button onclick="triggerPWAInstall()" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-700 hover:to-emerald-700 text-white font-extrabold text-xs shadow hover:shadow-indigo-200 transition-all flex items-center gap-1.5">
          <i class="fa-solid fa-download"></i>
          <span class="hidden sm:inline">Install App</span>
          <span class="sm:hidden">App</span>
        </button>
`;
if (!dash.includes('triggerPWAInstall()')) {
  dash = dash.replace('<!-- Withdraw Button -->', installBtnDash + '\n        <!-- Withdraw Button -->');
  fs.writeFileSync('public/dashboard.html', dash, 'utf8');
  console.log('Updated dashboard.html with Install App button');
}

// 2. Index
let idx = fs.readFileSync('public/index.html', 'utf8');
const installBtnIdx = `
        <button onclick="triggerPWAInstall()" class="text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-mobile-screen-button text-emerald-600"></i>
          <span>📲 Install App</span>
        </button>
`;
if (!idx.includes('triggerPWAInstall()')) {
  idx = idx.replace('<a href="/login.html" class="text-sm font-semibold', installBtnIdx + '\n        <a href="/login.html" class="text-sm font-semibold');
  fs.writeFileSync('public/index.html', idx, 'utf8');
  console.log('Updated index.html with Install App button');
}
