// PWA Installation & Service Worker Handler
(function() {
  // 1. Register Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js')
        .then((reg) => console.log('PWA Service Worker registered:', reg.scope))
        .catch((err) => console.warn('PWA SW registration failed:', err));
    });
  }

  let deferredPrompt = null;

  // 2. Listen for BeforeInstallPrompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default mini-infobar or browser banner
    e.preventDefault();
    deferredPrompt = e;
    showPWAInstallPrompt();
  });

  // Function to show custom install banner/button
  function showPWAInstallPrompt() {
    // Check if user already dismissed in this session
    if (sessionStorage.getItem('pwa_banner_dismissed') === 'true') return;

    let banner = document.getElementById('pwaInstallBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'pwaInstallBanner';
      banner.className = 'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-indigo-500/40 backdrop-blur-xl animate-bounce-short transition-all';
      banner.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white text-xl font-black shadow-inner flex-shrink-0">
            <i class="fa-solid fa-mobile-screen-button"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-black text-white leading-tight">📲 Mobile App Install Karein</h4>
            <p class="text-[11px] text-slate-300 mt-0.5">Ek click me apne mobile home screen par app download karein.</p>
          </div>
          <button onclick="dismissPWABanner()" class="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <button onclick="triggerPWAInstall()" class="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all">
            <i class="fa-solid fa-download"></i>
            <span>INSTALL APP (ऐप इंस्टॉल करें)</span>
          </button>
        </div>
      `;
      document.body.appendChild(banner);
    } else {
      banner.classList.remove('hidden');
    }

    // Also show any in-page install buttons
    const inPageBtns = document.querySelectorAll('.pwa-install-btn');
    inPageBtns.forEach(btn => btn.classList.remove('hidden'));
  }

  window.triggerPWAInstall = async function() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA install prompt outcome: ${outcome}`);
      deferredPrompt = null;
      const banner = document.getElementById('pwaInstallBanner');
      if (banner) banner.remove();
    } else {
      // Guide for iOS Safari or browsers where prompt event hasn't fired
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'info',
            title: 'iPhone / iPad par Install karein',
            html: `
              <div class="text-left text-xs space-y-2">
                <p>1. Safari browser me neeche <b>Share Button <i class="fa-solid fa-arrow-up-from-bracket"></i></b> par click karein.</p>
                <p>2. Neeche scroll karein aur <b>'Add to Home Screen' <i class="fa-solid fa-plus-square"></i></b> select karein.</p>
                <p>3. Upar <b>'Add'</b> par tap karein. App aapke phone me install ho jayegi!</p>
              </div>
            `,
            confirmButtonText: 'Theek Hai'
          });
        } else {
          alert("iPhone par install karne ke liye Safari Share button tap karein aur 'Add to Home Screen' chunein.");
        }
      } else {
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'info',
            title: 'Mobile App Install Karein',
            html: `
              <div class="text-left text-xs space-y-2">
                <p>1. Chrome browser ke top right me <b>3 Dots (⋮)</b> par click karein.</p>
                <p>2. <b>'Install app'</b> ya <b>'Add to Home screen' (होम स्क्रीन में जोड़ें)</b> par tap karein.</p>
                <p>3. Confirm karein aur app aapke mobile me turant install ho jayegi!</p>
              </div>
            `,
            confirmButtonText: 'Theek Hai'
          });
        } else {
          alert("Chrome menu (3 dots) par click karke 'Install App' ya 'Add to Home screen' select karein.");
        }
      }
    }
  };

  window.dismissPWABanner = function() {
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) banner.remove();
  };

  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed successfully');
    const banner = document.getElementById('pwaInstallBanner');
    if (banner) banner.remove();
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'success',
        title: '🎉 App Installed Successfully!',
        text: 'MapReview Pay app aapke phone ke home screen par add ho gayi hai.',
        timer: 3000,
        showConfirmButton: false
      });
    }
  });
})();
