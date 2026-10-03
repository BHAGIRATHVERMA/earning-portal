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

  // Function to download Android APK directly
  window.downloadAndroidApp = function() {
    // Trigger download
    const link = document.createElement('a');
    link.href = '/downloads/MapReviewPay.apk';
    link.download = 'MapReviewPay.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    const banner = document.getElementById('pwaInstallBanner');
    if (banner) banner.remove();

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'success',
        title: '📥 MapReview Pay APK Download Shuru Ho Gayi!',
        html: `
          <div class="text-left text-xs space-y-3 text-slate-600">
            <div class="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800">
              <i class="fa-brands fa-android text-base mr-1.5 text-emerald-600"></i>
              <b>MapReviewPay.apk</b> file aapke mobile me download ho rahi hai.
            </div>
            <p><b>Install Karne Ka Aasan Tarika:</b></p>
            <ol class="list-decimal pl-5 space-y-1.5 text-[11px]">
              <li>Mobile ke <b>Downloads</b> ya notification bar me <b>MapReviewPay.apk</b> par tap karein.</li>
              <li>Agar <i>"Install unknown apps"</i> permission maange, to <b>Allow from this source</b> ko ON karein.</li>
              <li><b>Install</b> button par click karein aur application open karein!</li>
            </ol>
          </div>
        `,
        confirmButtonText: 'Theek Hai, Samajh Gaya',
        confirmButtonColor: '#059669',
        showCancelButton: true,
        cancelButtonText: 'Re-Download APK',
        cancelButtonColor: '#4f46e5'
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
          window.location.href = '/downloads/MapReviewPay.apk';
        }
      });
    }
  };

  // Map triggerPWAInstall to direct APK download
  window.triggerPWAInstall = function() {
    window.downloadAndroidApp();
  };

  // Function to show custom install banner/button
  function showPWAInstallPrompt() {
    // If user is already inside Native APK, do not show download banner!
    if (window.IS_ANDROID_APP || (navigator.userAgent && navigator.userAgent.includes('MapReviewPay-Android-App')) || window.location.search.includes('platform=apk')) {
      return;
    }

    // Check if user already dismissed in this session
    if (sessionStorage.getItem('pwa_banner_dismissed') === 'true') return;

    let banner = document.getElementById('pwaInstallBanner');
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'pwaInstallBanner';
      banner.className = 'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/40 backdrop-blur-xl animate-bounce-short transition-all';
      banner.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-black shadow-inner flex-shrink-0">
            <i class="fa-brands fa-android"></i>
          </div>
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-black text-white leading-tight">📲 Official Android App (APK)</h4>
            <p class="text-[11px] text-emerald-200 mt-0.5">Fast earning aur video streaming ke liye direct APK download karein.</p>
          </div>
          <button onclick="dismissPWABanner()" class="w-7 h-7 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <button onclick="downloadAndroidApp()" class="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all">
            <i class="fa-brands fa-android text-base"></i>
            <span>DOWNLOAD APP (APK डाउनलोड करें)</span>
          </button>
        </div>
      `;
      document.body.appendChild(banner);
    } else {
      banner.classList.remove('hidden');
    }

    const inPageBtns = document.querySelectorAll('.pwa-install-btn');
    inPageBtns.forEach(btn => btn.classList.remove('hidden'));
  }

  // Auto show banner after 2 seconds on web
  setTimeout(() => {
    showPWAInstallPrompt();
  }, 2000);

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
