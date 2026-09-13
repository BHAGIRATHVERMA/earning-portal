let currentUser = null;
let currentTask = null;
let chatPollingInterval = null;
let isChatOpen = false;

async function initDashboard() {
  try {
    const sessionRes = await fetch('/api/auth/check-session');
    const sessionData = await sessionRes.json();

    if (!sessionData.success || sessionData.role !== 'user') {
      window.location.href = '/login.html';
      return;
    }

    currentUser = sessionData.user;
    updateUserHeader(currentUser);
    await loadTodayTasks();
    await loadWithdrawalHistory();
    await loadReferralDetails();
    await loadUserChatMessages(true);
    startChatPolling();
    checkAndTriggerLoginAd();
  } catch (err) {
    console.error('Init error:', err);
    Swal.fire({
      icon: 'error',
      title: 'Session Error',
      text: 'Please login again.'
    }).then(() => {
      window.location.href = '/login.html';
    });
  }
}

function updateUserHeader(user) {
  document.getElementById('loadingState').classList.add('hidden');
  document.getElementById('headerWalletCoins').innerText = user.walletCoins || 0;
  document.getElementById('headerWalletInr').innerText = user.walletCoins || 0;
  document.getElementById('walletCoinsCard').innerText = user.walletCoins || 0;
  document.getElementById('walletInrCard').innerText = user.walletCoins || 0;
  document.getElementById('walletUpiCard').innerText = user.upiId || '--';

  document.getElementById('userName').innerText = user.fullName;
  document.getElementById('userAvatarChar').innerText = user.fullName.charAt(0).toUpperCase();
  document.getElementById('userMobile').innerText = user.mobile;
  document.getElementById('userCity').innerText = user.city;
  document.getElementById('userUpi').innerText = user.upiId;
  document.getElementById('planBadge').innerText = user.planName || `Plan (₹${user.planPrice})`;

  // Expiry date calculation
  if (user.planExpiresAt) {
    const expDate = new Date(user.planExpiresAt);
    const now = new Date();
    const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      document.getElementById('planExpiryDate').innerText = `Expires in: ${diffDays} Days (${expDate.toLocaleDateString()})`;
    } else {
      document.getElementById('planExpiryDate').innerText = `Expired on ${expDate.toLocaleDateString()}`;
    }
  }
}

async function loadTodayTasks() {
  const statusBanners = document.getElementById('statusBanners');
  const activeDashboard = document.getElementById('activeDashboard');
  const pendingBanner = document.getElementById('pendingApprovalBanner');
  const rejectedBanner = document.getElementById('rejectedBanner');
  const expiredBanner = document.getElementById('expiredBanner');

  try {
    const res = await fetch('/api/user/tasks/today');
    const data = await res.json();

    if (!data.success) {
      Swal.fire({ icon: 'error', title: 'Error', text: data.message });
      return;
    }

    if (data.accountStatus === 'pending') {
      statusBanners.classList.remove('hidden');
      pendingBanner.classList.remove('hidden');
      document.getElementById('pendingUtrDisplay').innerText = currentUser.utr || 'Pending';
      activeDashboard.classList.add('hidden');
      return;
    }

    if (data.accountStatus === 'rejected') {
      statusBanners.classList.remove('hidden');
      rejectedBanner.classList.remove('hidden');
      document.getElementById('rejectionReasonText').innerText = data.message;
      activeDashboard.classList.add('hidden');
      return;
    }

    if (data.accountStatus === 'deactivated') {
      statusBanners.classList.remove('hidden');
      const deactBanner = document.getElementById('deactivatedBanner');
      if (deactBanner) deactBanner.classList.remove('hidden');
      if (data.message) {
        document.getElementById('deactivatedReasonText').innerText = data.message;
      }
      activeDashboard.classList.add('hidden');
      return;
    }

    if (data.accountStatus === 'expired') {
      statusBanners.classList.remove('hidden');
      expiredBanner.classList.remove('hidden');
      activeDashboard.classList.add('hidden');
      return;
    }

    // Account is active
    statusBanners.classList.add('hidden');
    activeDashboard.classList.remove('hidden');

    currentTask = data.task;
    renderTasks(currentTask);
  } catch (err) {
    console.error('Task fetch error:', err);
  }
}

function renderTasks(task) {
  const grid = document.getElementById('taskGrid');
  const uploadedCount = document.getElementById('uploadedCount');
  const finalBtn = document.getElementById('finalSubmitTaskBtn');
  const alertBox = document.getElementById('taskStatusAlertBox');

  grid.innerHTML = '';
  let count = 0;

  // Handle task statuses
  if (task.status === 'submitted') {
    alertBox.classList.remove('hidden');
    alertBox.className = 'p-4 bg-amber-50 border-b border-amber-200 text-amber-900 flex items-center justify-between text-xs font-bold';
    alertBox.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-hourglass-half text-amber-600 text-base"></i>
        <span>Aapne aaj ke 10 reviews submit kar diye hain. Admin verification process me hai. Verify hote hi ₹100 Coins wallet me add ho jayenge.</span>
      </div>
      <span class="bg-amber-200 text-amber-900 px-2.5 py-1 rounded-full uppercase">Under Review</span>
    `;
    finalBtn.disabled = true;
    finalBtn.className = 'w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2';
    finalBtn.innerHTML = '<i class="fa-solid fa-check"></i> Already Submitted (Pending Approval)';
  } else if (task.status === 'approved') {
    alertBox.classList.remove('hidden');
    alertBox.className = 'p-4 bg-emerald-50 border-b border-emerald-200 text-emerald-900 flex items-center justify-between text-xs font-bold';
    alertBox.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
        <span>Shandar! Aaj ka task Admin dwara approve ho gaya hai aur ₹100 Coins aapke wallet me add ho chuke hain!</span>
      </div>
      <span class="bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full uppercase">+100 Coins Credited</span>
    `;
    finalBtn.disabled = true;
    finalBtn.className = 'w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm cursor-default flex items-center justify-center gap-2';
    finalBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Task Approved (+₹100 Coins)';
  } else if (task.status === 'rejected') {
    alertBox.classList.remove('hidden');
    alertBox.className = 'p-4 bg-rose-50 border-b border-rose-200 text-rose-900 flex items-center justify-between text-xs font-bold';
    alertBox.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-triangle-exclamation text-rose-600 text-base"></i>
        <span>Task Rejected: ${task.rejectionReason || 'Invalid screenshots'}. Kripya sahi screenshots upload karke dobara submit karein.</span>
      </div>
      <span class="bg-rose-200 text-rose-900 px-2.5 py-1 rounded-full uppercase">Rejected</span>
    `;
    finalBtn.disabled = false;
  } else {
    alertBox.classList.add('hidden');
    finalBtn.disabled = false;
  }

  // Render items
  task.items.forEach((item) => {
    const isUploaded = !!item.screenshot;
    if (isUploaded) count++;

    const card = document.createElement('div');
    card.className = `p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
      isUploaded ? 'bg-emerald-50/40 border-emerald-300' : 'bg-white border-slate-200 hover:border-indigo-300'
    }`;

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="w-6 h-6 rounded-full ${isUploaded ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'} flex items-center justify-center text-xs font-black">
            ${item.taskIndex}
          </span>
          <span class="text-xs font-bold ${isUploaded ? 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full' : 'text-slate-400'}">
            ${isUploaded ? '<i class="fa-solid fa-check mr-1"></i> Screenshot Uploaded' : 'Pending Upload'}
          </span>
        </div>

        <h4 class="font-black text-slate-900 text-sm leading-snug">${item.businessName}</h4>
        
        <div class="mt-2.5 flex items-center gap-2">
          <a href="${item.mapUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl transition-colors">
            <i class="fa-solid fa-map-location-dot"></i>
            <span>Open in Google Maps</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
          <span class="text-xs text-amber-500 font-bold flex items-center">
            ⭐⭐⭐⭐⭐
          </span>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100/80">
        ${
          task.status === 'in_progress' || task.status === 'rejected'
            ? `
          <div class="flex items-center gap-2">
            <input type="file" id="file_${item.taskIndex}" accept="image/*" class="hidden" onchange="handleFileUpload('${task.id}', ${item.taskIndex}, this)">
            <button type="button" onclick="document.getElementById('file_${item.taskIndex}').click()" id="uploadBtn_${item.taskIndex}" class="w-full py-2 px-3 rounded-xl ${
                isUploaded ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              } text-xs font-bold transition-all flex items-center justify-center gap-1.5">
              <i class="fa-solid ${isUploaded ? 'fa-arrow-rotate-right' : 'fa-camera'}"></i>
              <span>${isUploaded ? 'Re-upload Screenshot' : 'Upload Review Screenshot'}</span>
            </button>
            ${
              isUploaded
                ? `<button type="button" onclick="viewScreenshot('${item.screenshot}', '${item.businessName}')" title="View Uploaded Image" class="w-9 h-9 flex-shrink-0 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-eye"></i>
                  </button>`
                : ''
            }
          </div>
        `
            : `
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-500">Review Proof:</span>
            <button type="button" onclick="viewScreenshot('${item.screenshot}', '${item.businessName}')" class="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <i class="fa-solid fa-image"></i> View Screenshot
            </button>
          </div>
        `
        }
      </div>
    `;

    grid.appendChild(card);
  });

  uploadedCount.innerText = count;
}

async function handleFileUpload(taskId, taskIndex, fileInput) {
  const file = fileInput.files[0];
  if (!file) return;

  const btn = document.getElementById(`uploadBtn_${taskIndex}`);
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Uploading...';

  const formData = new FormData();
  formData.append('taskId', taskId);
  formData.append('taskIndex', taskIndex);
  formData.append('screenshot', file);

  try {
    const res = await fetch('/api/user/tasks/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = originalHtml;

    if (data.success) {
      currentTask = data.task;
      renderTasks(currentTask);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      Toast.fire({
        icon: 'success',
        title: `Task #${taskIndex} Screenshot Uploaded!`
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: data.message });
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    Swal.fire({ icon: 'error', title: 'Network Error', text: 'Upload failed. Try again.' });
  }
}

async function submitDailyTask() {
  if (!currentTask) return;

  const allUploaded = currentTask.items.every(i => i.screenshot && i.screenshot.length > 0);
  if (!allUploaded) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Tasks',
      text: 'Kripya sabhi 10 Google Map reviews ke screenshots upload karein uske baad hi submit karein!'
    });
    return;
  }

  const result = await Swal.fire({
    title: 'Submit 10 Reviews?',
    text: 'Kya aapne sabhi 10 links par 5-star review dekar sahi screenshots upload kar diye hain?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, Submit for ₹100 Coins'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch('/api/user/tasks/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: currentTask.id })
    });

    const data = await res.json();
    if (data.success) {
      currentTask = data.task;
      renderTasks(currentTask);
      Swal.fire({
        icon: 'success',
        title: 'Tasks Submitted!',
        text: 'Aapke 10 reviews admin verification ke liye submit ho gaye hain. Admin check karke ₹100 coins wallet me credit kar dega.'
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Submission Error', text: data.message });
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Network Error', text: 'Server connect nahi ho pa raha.' });
  }
}

function viewScreenshot(url, title) {
  if (!url) return;
  document.getElementById('previewModalImg').src = url;
  document.getElementById('previewModalTitle').innerText = title || 'Review Screenshot';
  document.getElementById('previewModal').classList.remove('hidden');
}

function closePreviewModal() {
  document.getElementById('previewModal').classList.add('hidden');
}

// Withdrawal functions
function openWithdrawModal() {
  if (!currentUser) return;
  const coins = currentUser.walletCoins || 0;
  document.getElementById('modalAvailCoins').innerText = coins;
  document.getElementById('modalAvailInr').innerText = coins;
  document.getElementById('modalRegisteredUpi').innerText = currentUser.upiId || '--';
  document.getElementById('withdrawAmountInput').value = coins >= 500 ? coins : 500;
  document.getElementById('withdrawModal').classList.remove('hidden');
}

function closeWithdrawModal() {
  document.getElementById('withdrawModal').classList.add('hidden');
}

async function submitWithdrawal(e) {
  e.preventDefault();
  const amount = parseInt(document.getElementById('withdrawAmountInput').value, 10);

  if (!amount || amount < 500) {
    Swal.fire({
      icon: 'warning',
      title: 'Minimum Limit',
      text: 'Minimum withdrawal amount 500 Coins (₹500) hona jaruri hai.'
    });
    return;
  }

  if ((currentUser.walletCoins || 0) < amount) {
    Swal.fire({
      icon: 'warning',
      title: 'Insufficient Coins',
      text: `Aapke paas kewal ${currentUser.walletCoins || 0} Coins hain.`
    });
    return;
  }

  const btn = document.getElementById('withdrawSubmitBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Submitting...';

  try {
    const res = await fetch('/api/user/withdrawals/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });

    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = '<span>Submit Withdrawal Request</span> <i class="fa-solid fa-arrow-right"></i>';

    if (data.success) {
      closeWithdrawModal();
      currentUser.walletCoins -= amount;
      updateUserHeader(currentUser);
      await loadWithdrawalHistory();
      Swal.fire({
        icon: 'success',
        title: 'Withdrawal Requested!',
        text: `₹${amount} ki withdrawal request Admin ke paas bhej di gayi hai. Direct aapke UPI (${currentUser.upiId}) par payout hoga.`
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Withdrawal Failed', text: data.message });
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = '<span>Submit Withdrawal Request</span> <i class="fa-solid fa-arrow-right"></i>';
    Swal.fire({ icon: 'error', title: 'Network Error', text: 'Could not connect to server.' });
  }
}

async function loadWithdrawalHistory() {
  try {
    const res = await fetch('/api/user/withdrawals');
    const data = await res.json();
    if (!data.success) return;

    const tbody = document.getElementById('withdrawalTableBody');
    tbody.innerHTML = '';

    if (!data.withdrawals || data.withdrawals.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="py-6 text-center text-slate-400">No withdrawal requests yet.</td></tr>';
      return;
    }

    data.withdrawals.forEach(w => {
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-50 transition-colors';

      let statusBadge = '';
      if (w.status === 'approved') {
        statusBadge = '<span class="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">Paid / Success</span>';
      } else if (w.status === 'rejected') {
        statusBadge = '<span class="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold">Rejected</span>';
      } else {
        statusBadge = '<span class="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold">Pending Admin</span>';
      }

      tr.innerHTML = `
        <td class="py-3 px-3 text-slate-500">${new Date(w.requestedAt).toLocaleDateString()}</td>
        <td class="py-3 px-3 font-extrabold text-slate-900">${w.amount} Coins (₹${w.amount})</td>
        <td class="py-3 px-3 font-mono text-indigo-600 font-semibold">${w.upiId}</td>
        <td class="py-3 px-3">${statusBadge}</td>
        <td class="py-3 px-3 font-mono text-slate-600">${w.payoutUtr || '--'}</td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error('Withdrawal history fetch error:', err);
  }
}

let currentYoutubeTask = null;
let currentWatchTask = null;

function switchUserTaskTab(tab) {
  const mapTabBtn = document.getElementById('taskTab_map');
  const ytTabBtn = document.getElementById('taskTab_youtube');
  const watchTabBtn = document.getElementById('taskTab_watch');
  const mapSection = document.getElementById('mapTasksSection');
  const ytSection = document.getElementById('youtubeTasksSection');
  const watchSection = document.getElementById('watchTasksSection');

  // Reset all tabs
  mapTabBtn.className = 'px-5 py-3 rounded-2xl font-black text-sm bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm flex items-center gap-2 transition-all';
  ytTabBtn.className = 'px-5 py-3 rounded-2xl font-black text-sm bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm flex items-center gap-2 transition-all';
  if (watchTabBtn) {
    watchTabBtn.className = 'px-5 py-3 rounded-2xl font-black text-sm bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm flex items-center gap-2 transition-all';
  }

  mapSection.classList.add('hidden');
  ytSection.classList.add('hidden');
  if (watchSection) watchSection.classList.add('hidden');

  if (tab === 'youtube') {
    ytTabBtn.className = 'px-5 py-3 rounded-2xl font-black text-sm bg-red-600 text-white shadow-md flex items-center gap-2 transition-all';
    ytSection.classList.remove('hidden');
    if (!currentYoutubeTask) {
      loadTodayYoutubeTasks();
    }
  } else if (tab === 'watch') {
    if (watchTabBtn) {
      watchTabBtn.className = 'px-5 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md flex items-center gap-2 transition-all';
    }
    if (watchSection) watchSection.classList.remove('hidden');
    loadTodayWatchTasks();
  } else {
    mapTabBtn.className = 'px-5 py-3 rounded-2xl font-black text-sm bg-indigo-600 text-white shadow-md flex items-center gap-2 transition-all';
    mapSection.classList.remove('hidden');
  }
}

async function loadTodayYoutubeTasks() {
  try {
    const res = await fetch('/api/user/youtube-tasks/today');
    const data = await res.json();
    if (!data.success) return;

    if (data.accountStatus === 'active') {
      currentYoutubeTask = data.task;
      renderYoutubeTasks(currentYoutubeTask);
    }
  } catch (err) {
    console.error('YouTube task load error:', err);
  }
}

function renderYoutubeTasks(task) {
  const grid = document.getElementById('ytTaskGrid');
  const uploadedCount = document.getElementById('ytUploadedCount');
  const finalBtn = document.getElementById('finalSubmitYtTaskBtn');
  const alertBox = document.getElementById('ytTaskStatusAlertBox');

  grid.innerHTML = '';
  let count = 0;

  if (task.status === 'submitted') {
    alertBox.classList.remove('hidden');
    alertBox.className = 'p-4 bg-amber-50 border-b border-amber-200 text-amber-900 flex items-center justify-between text-xs font-bold';
    alertBox.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-hourglass-half text-amber-600 text-base"></i>
        <span>Aapne 10 YouTube Channels Subscribe proofs submit kar diye hain. Admin verification ke baad ₹50 Coins add ho jayenge.</span>
      </div>
      <span class="bg-amber-200 text-amber-900 px-2.5 py-1 rounded-full uppercase">Under Review</span>
    `;
    finalBtn.disabled = true;
    finalBtn.className = 'w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-300 text-slate-500 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2';
    finalBtn.innerHTML = '<i class="fa-solid fa-check"></i> Already Submitted (Pending Approval)';
  } else if (task.status === 'approved') {
    alertBox.classList.remove('hidden');
    alertBox.className = 'p-4 bg-emerald-50 border-b border-emerald-200 text-emerald-900 flex items-center justify-between text-xs font-bold';
    alertBox.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
        <span>YouTube Tasks Admin dwara approve ho gaye hain aur ₹50 Coins wallet me add ho chuke hain!</span>
      </div>
      <span class="bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full uppercase">+50 Coins Credited</span>
    `;
    finalBtn.disabled = true;
    finalBtn.className = 'w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm cursor-default flex items-center justify-center gap-2';
    finalBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Tasks Approved (+₹50 Coins)';
  } else if (task.status === 'rejected') {
    alertBox.classList.remove('hidden');
    alertBox.className = 'p-4 bg-rose-50 border-b border-rose-200 text-rose-900 flex items-center justify-between text-xs font-bold';
    alertBox.innerHTML = `
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-triangle-exclamation text-rose-600 text-base"></i>
        <span>YouTube Task Rejected: ${task.rejectionReason || 'Invalid screenshots'}. Kripya sahi screenshot upload karke dobara submit karein.</span>
      </div>
      <span class="bg-rose-200 text-rose-900 px-2.5 py-1 rounded-full uppercase">Rejected</span>
    `;
    finalBtn.disabled = false;
  } else {
    alertBox.classList.add('hidden');
    finalBtn.disabled = false;
  }

  task.items.forEach((item) => {
    const isUploaded = !!item.screenshot;
    if (isUploaded) count++;

    const card = document.createElement('div');
    card.className = `p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
      isUploaded ? 'bg-emerald-50/40 border-emerald-300' : 'bg-white border-slate-200 hover:border-red-300'
    }`;

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-2 mb-2">
          <span class="w-6 h-6 rounded-full ${isUploaded ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'} flex items-center justify-center text-xs font-black">
            ${item.taskIndex}
          </span>
          <span class="text-xs font-bold ${isUploaded ? 'text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full' : 'text-slate-400'}">
            ${isUploaded ? '<i class="fa-solid fa-check mr-1"></i> Subscribe Proof Uploaded' : 'Pending Upload'}
          </span>
        </div>

        <h4 class="font-black text-slate-900 text-sm leading-snug flex items-center gap-2">
          <i class="fa-brands fa-youtube text-red-600"></i>
          <span>${item.channelName}</span>
        </h4>
        
        <div class="mt-2.5 flex items-center gap-2">
          <a href="${item.channelUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition-colors">
            <i class="fa-brands fa-youtube"></i>
            <span>Open Channel &amp; Comment</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      </div>

      <div class="mt-4 pt-3 border-t border-slate-100/80">
        ${
          task.status === 'in_progress' || task.status === 'rejected'
            ? `
          <div class="flex items-center gap-2">
            <input type="file" id="yt_file_${item.taskIndex}" accept="image/*" class="hidden" onchange="handleYoutubeFileUpload('${task.id}', ${item.taskIndex}, this)">
            <button type="button" onclick="document.getElementById('yt_file_${item.taskIndex}').click()" id="ytUploadBtn_${item.taskIndex}" class="w-full py-2 px-3 rounded-xl ${
                isUploaded ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-red-600 hover:bg-red-700 text-white'
              } text-xs font-bold transition-all flex items-center justify-center gap-1.5">
              <i class="fa-solid ${isUploaded ? 'fa-arrow-rotate-right' : 'fa-camera'}"></i>
              <span>${isUploaded ? 'Re-upload Proof' : 'Upload Subscribe + Comment Proof'}</span>
            </button>
            ${
              isUploaded
                ? `<button type="button" onclick="viewScreenshot('${item.screenshot}', '${item.channelName}')" title="View Uploaded Proof" class="w-9 h-9 flex-shrink-0 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl flex items-center justify-center transition-colors">
                    <i class="fa-solid fa-eye"></i>
                  </button>`
                : ''
            }
          </div>
        `
            : `
          <div class="flex items-center justify-between">
            <span class="text-xs text-slate-500">Subscribe Proof:</span>
            <button type="button" onclick="viewScreenshot('${item.screenshot}', '${item.channelName}')" class="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
              <i class="fa-solid fa-image"></i> View Screenshot
            </button>
          </div>
        `
        }
      </div>
    `;

    grid.appendChild(card);
  });

  uploadedCount.innerText = count;
}

async function handleYoutubeFileUpload(taskId, taskIndex, fileInput) {
  const file = fileInput.files[0];
  if (!file) return;

  const btn = document.getElementById(`ytUploadBtn_${taskIndex}`);
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Uploading...';

  const formData = new FormData();
  formData.append('taskId', taskId);
  formData.append('taskIndex', taskIndex);
  formData.append('screenshot', file);

  try {
    const res = await fetch('/api/user/youtube-tasks/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = originalHtml;

    if (data.success) {
      currentYoutubeTask = data.task;
      renderYoutubeTasks(currentYoutubeTask);
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
      Toast.fire({
        icon: 'success',
        title: `YouTube #${taskIndex} Proof Uploaded!`
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: data.message });
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
    Swal.fire({ icon: 'error', title: 'Network Error', text: 'Upload failed. Try again.' });
  }
}

async function submitDailyYoutubeTask() {
  if (!currentYoutubeTask) return;

  const allUploaded = currentYoutubeTask.items.every(i => i.screenshot && i.screenshot.length > 0);
  if (!allUploaded) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Tasks',
      text: 'Kripya sabhi 10 YouTube Channels ke Subscribe + Comment screenshots upload karein uske baad hi submit karein!'
    });
    return;
  }

  const result = await Swal.fire({
    title: 'Submit 10 YouTube Tasks?',
    text: 'Kya aapne sabhi 10 channels ko subscribe aur comment karke screenshot upload kar diye hain?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, Submit for ₹50 Coins'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch('/api/user/youtube-tasks/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: currentYoutubeTask.id })
    });

    const data = await res.json();
    if (data.success) {
      currentYoutubeTask = data.task;
      renderYoutubeTasks(currentYoutubeTask);
      Swal.fire({
        icon: 'success',
        title: 'YouTube Tasks Submitted!',
        text: 'Aapke 10 YouTube tasks admin verification ke liye submit ho gaye hain. Admin verify karke ₹50 coins wallet me credit kar dega.'
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Submission Error', text: data.message });
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Network Error', text: 'Server connect nahi ho pa raha.' });
  }
}

// -------------------------------------------------------------
// VIDEO WATCH & EARN (4 MIN WATCH = INSTANT 10 COINS)
// -------------------------------------------------------------
let watchTimerInterval = null;
let currentActiveWatchTask = null;

async function loadTodayWatchTasks() {
  try {
    const res = await fetch('/api/user/watch-tasks/today');
    const data = await res.json();
    if (!data.success) return;

    if (data.accountStatus === 'active') {
      currentWatchTask = data.task;
      renderWatchTasks(currentWatchTask);
    }
  } catch (err) {
    console.error('Watch tasks load error:', err);
  }
}

function renderWatchTasks(task) {
  if (!task || !task.items) return;

  const grid = document.getElementById('watchTaskGrid');
  const completedCountEl = document.getElementById('watchVideosCompletedCount');
  const earnedCoinsEl = document.getElementById('watchVideosEarnedCoins');

  if (!grid) return;
  grid.innerHTML = '';

  let completedCount = 0;
  let earnedCoins = 0;

  task.items.forEach(item => {
    if (item.completed) {
      completedCount++;
      earnedCoins += (item.reward || 10);
    }

    const card = document.createElement('div');
    card.className = `p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
      item.completed ? 'bg-emerald-50/50 border-emerald-300' : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-md'
    }`;

    const durationMins = Math.round((item.durationSeconds || 240) / 60);

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-2 mb-3">
          <span class="w-7 h-7 rounded-xl ${item.completed ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'} flex items-center justify-center text-xs font-black shadow-sm">
            #${item.taskIndex}
          </span>
          <div class="flex items-center gap-1.5">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
              item.completed ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'
            }">
              <i class="fa-solid fa-clock mr-1"></i>${durationMins} Mins (${item.durationSeconds || 240}s)
            </span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
              🪙 +${item.reward || 10} Coins
            </span>
          </div>
        </div>

        <h4 class="font-extrabold text-slate-900 text-sm sm:text-base leading-snug flex items-center gap-2 mb-2">
          <i class="fa-solid fa-circle-play text-amber-500"></i>
          <span>${escapeHtml(item.title || `Video Task #${item.taskIndex}`)}</span>
        </h4>
        <p class="text-xs text-slate-500 mb-4">
          ${item.completed ? 'Aapne yeh video pura dekh liya hai aur 10 Coins aapke wallet me add ho chuke hain!' : `Hamari website ke andar hi pura ${durationMins} minute dekhein aur turant ₹10 Coins earn karein.`}
        </p>
      </div>

      <div class="pt-3 border-t border-slate-100">
        ${
          item.completed
            ? `
            <div class="w-full py-2.5 px-4 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center gap-2">
              <i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i>
              <span>Completed • ₹${item.reward || 10} Coins Credited ✓</span>
            </div>
            `
            : `
            <button onclick="openWatchPlayerModal('${task.id}', ${item.taskIndex}, '${encodeURIComponent(item.videoUrl)}', '${encodeURIComponent(item.title || '')}', ${item.durationSeconds || 240}, ${item.reward || 10})" class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
              <i class="fa-solid fa-play"></i>
              <span>Watch Video (Pura ${durationMins} Min Dekhein • ₹${item.reward || 10})</span>
            </button>
            `
        }
      </div>
    `;

    grid.appendChild(card);
  });

  if (completedCountEl) completedCountEl.innerText = completedCount;
  if (earnedCoinsEl) earnedCoinsEl.innerText = earnedCoins;
}

function openWatchPlayerModal(taskId, taskIndex, encodedUrl, encodedTitle, durationSeconds = 240, reward = 10) {
  const videoUrl = decodeURIComponent(encodedUrl);
  const title = decodeURIComponent(encodedTitle) || `Video Task #${taskIndex}`;
  
  const modal = document.getElementById('videoWatchModal');
  const playerContainer = document.getElementById('ytPlayerContainer');
  const titleEl = document.getElementById('playerVideoTitle');
  const timerDisplay = document.getElementById('watchRemainingDisplay');
  const secondsDisplay = document.getElementById('watchSecondsCountDisplay');
  const progressBar = document.getElementById('watchProgressBar');
  const claimContainer = document.getElementById('watchClaimBtnContainer');

  if (!modal || !playerContainer) return;

  const embedUrl = getYouTubeEmbedUrl(videoUrl);
  playerContainer.innerHTML = `
    <iframe class="w-full h-full border-0" src="${embedUrl}" title="${escapeHtml(title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" allowfullscreen></iframe>
  `;

  if (titleEl) titleEl.innerText = title;

  currentActiveWatchTask = {
    taskId,
    taskIndex,
    durationSeconds: Number(durationSeconds) || 240,
    elapsedSeconds: 0,
    reward: Number(reward) || 10
  };

  // Reset progress and display
  if (progressBar) progressBar.style.width = '0%';
  if (secondsDisplay) secondsDisplay.innerText = '0';
  updateTimerDisplay(currentActiveWatchTask.durationSeconds);

  // Set initial locked claim button
  if (claimContainer) {
    claimContainer.innerHTML = `
      <button id="claimWatchRewardBtn" disabled class="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-500 font-bold text-xs flex items-center justify-center gap-2 cursor-not-allowed transition-all opacity-80">
        <i class="fa-solid fa-lock text-rose-400"></i>
        <span>Watching... (Complete 4 Mins to Claim ₹${reward})</span>
      </button>
    `;
  }

  modal.classList.remove('hidden');

  // Start the Anti-Cheat Countdown Interval
  if (watchTimerInterval) clearInterval(watchTimerInterval);
  watchTimerInterval = setInterval(() => {
    if (!currentActiveWatchTask) {
      clearInterval(watchTimerInterval);
      return;
    }

    currentActiveWatchTask.elapsedSeconds++;
    const remaining = Math.max(0, currentActiveWatchTask.durationSeconds - currentActiveWatchTask.elapsedSeconds);
    const percent = Math.min(100, Math.floor((currentActiveWatchTask.elapsedSeconds / currentActiveWatchTask.durationSeconds) * 100));

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (secondsDisplay) secondsDisplay.innerText = currentActiveWatchTask.elapsedSeconds;
    updateTimerDisplay(remaining);

    // When 4 minutes (or target duration) are completed
    if (remaining <= 0) {
      clearInterval(watchTimerInterval);
      unlockWatchRewardClaim();
    }
  }, 1000);
}

function updateTimerDisplay(remainingSec) {
  const timerDisplay = document.getElementById('watchRemainingDisplay');
  if (!timerDisplay) return;

  const mins = Math.floor(remainingSec / 60);
  const secs = remainingSec % 60;
  timerDisplay.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function unlockWatchRewardClaim() {
  const claimContainer = document.getElementById('watchClaimBtnContainer');
  const timerDisplay = document.getElementById('watchRemainingDisplay');
  const timerIcon = document.getElementById('timerIcon');

  if (timerDisplay) timerDisplay.innerHTML = '<span class="text-emerald-400">00:00 ✓ COMPLETED</span>';
  if (timerIcon) timerIcon.className = 'fa-solid fa-circle-check text-emerald-400';

  if (claimContainer && currentActiveWatchTask) {
    claimContainer.innerHTML = `
      <button onclick="claimCurrentVideoReward()" class="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 animate-bounce cursor-pointer">
        <i class="fa-solid fa-gift text-base"></i>
        <span>🎉 Claim ₹${currentActiveWatchTask.reward} Coins Now!</span>
      </button>
    `;
  }
}

async function claimCurrentVideoReward() {
  if (!currentActiveWatchTask) return;

  const { taskId, taskIndex, elapsedSeconds } = currentActiveWatchTask;

  try {
    const res = await fetch('/api/user/watch-tasks/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        taskId,
        taskIndex,
        watchTimeSeconds: elapsedSeconds
      })
    });

    const data = await res.json();
    if (data.success) {
      if (currentUser) {
        currentUser.walletCoins = data.walletCoins;
        updateUserHeader(currentUser);
      }
      closeWatchPlayerModal();
      await loadTodayWatchTasks();

      Swal.fire({
        icon: 'success',
        title: `🎉 ₹${data.rewardCoins} Coins Credited!`,
        text: 'Aapne video pura 4 minute dekha hai. Instant ₹10 Coins aapke wallet me add ho gaye hain!',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'Great! Agla Video Dekhein'
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Reward Error',
        text: data.message
      });
    }
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Network Error',
      text: 'Server connect nahi ho pa raha.'
    });
  }
}

function closeWatchPlayerModal() {
  if (watchTimerInterval) {
    clearInterval(watchTimerInterval);
    watchTimerInterval = null;
  }

  const modal = document.getElementById('videoWatchModal');
  const playerContainer = document.getElementById('ytPlayerContainer');

  if (playerContainer) playerContainer.innerHTML = '';
  if (modal) modal.classList.add('hidden');

  currentActiveWatchTask = null;
}

// -------------------------------------------------------------
// LOGIN AUTO-PLAY YOUTUBE POPUP AD CONTROLLER (30s Non-Skippable)
// -------------------------------------------------------------
let adTimerInterval = null;

function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  let videoId = '';

  try {
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v');
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1].split('?')[0];
    } else if (url.includes('youtube.com/shorts/')) {
      videoId = url.split('youtube.com/shorts/')[1].split('?')[0];
    } else {
      videoId = url.trim();
    }
  } catch (e) {
    videoId = url.trim();
  }

  if (!videoId) return url;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&playsinline=1&enablejsapi=1`;
}

async function checkAndTriggerLoginAd() {
  const sessionKey = 'loginAdWatched_' + (currentUser ? currentUser.id : 'user');
  if (sessionStorage.getItem(sessionKey) === 'true') {
    return;
  }

  try {
    const res = await fetch('/api/public/settings');
    const data = await res.json();
    if (!data.success || !data.data) return;

    const s = data.data;
    if (s.popupAdEnabled === false) return;

    const videoUrl = s.popupVideoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const embedUrl = getYouTubeEmbedUrl(videoUrl);
    const duration = s.popupAdTimer !== undefined ? Number(s.popupAdTimer) : 30;

    const modal = document.getElementById('loginAdModal');
    const iframe = document.getElementById('loginAdIframe');
    if (!modal || !iframe) return;

    iframe.src = embedUrl;
    modal.classList.remove('hidden');

    startAdCountdown(duration, sessionKey);
  } catch (err) {
    console.error('Error loading popup video ad:', err);
  }
}

function startAdCountdown(seconds, sessionKey) {
  let timeLeft = seconds;
  const badge = document.getElementById('adTimerBadge');
  const span = document.getElementById('adTimerSpan');
  const actionContainer = document.getElementById('adActionContainer');

  if (badge) {
    badge.innerText = `${timeLeft}s`;
    badge.className = 'text-sm font-black text-amber-400 font-mono';
  }
  if (span) span.innerText = timeLeft;

  if (adTimerInterval) clearInterval(adTimerInterval);

  adTimerInterval = setInterval(() => {
    timeLeft--;
    if (badge) badge.innerText = `${timeLeft}s`;
    if (span) span.innerText = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(adTimerInterval);
      if (badge) {
        badge.innerText = 'Completed ✓';
        badge.className = 'text-xs font-black text-emerald-400 font-mono';
      }
      if (actionContainer) {
        actionContainer.innerHTML = `
          <button onclick="closeLoginAdModal('${sessionKey}')" class="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-105 animate-pulse cursor-pointer">
            <span>Continue to Dashboard</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        `;
      }
    }
  }, 1000);
}

function closeLoginAdModal(sessionKey) {
  if (sessionKey) {
    sessionStorage.setItem(sessionKey, 'true');
  }
  const modal = document.getElementById('loginAdModal');
  const iframe = document.getElementById('loginAdIframe');
  if (iframe) iframe.src = '';
  if (modal) modal.classList.add('hidden');
}

// -------------------------------------------------------------
// REFERRAL SYSTEM
// -------------------------------------------------------------
let userReferralData = null;

async function loadReferralDetails() {
  try {
    const res = await fetch('/api/user/referrals');
    const data = await res.json();
    if (!data.success) return;

    userReferralData = data;
    const refCode = data.referralCode || 'REF---';
    const codeDisplay = document.getElementById('userReferralCodeDisplay');
    if (codeDisplay) codeDisplay.innerText = refCode;

    const countDisplay = document.getElementById('refCountDisplay');
    if (countDisplay) countDisplay.innerText = data.count || 0;

    const earnDisplay = document.getElementById('refEarningsDisplay');
    if (earnDisplay) earnDisplay.innerText = data.earnings || 0;

    // Update WhatsApp share link
    const waBtn = document.getElementById('whatsappShareBtn');
    if (waBtn) {
      const shareUrl = `${window.location.origin}/register.html?ref=${refCode}`;
      const waText = encodeURIComponent(`🔥 *MapReview Pay Earning Portal* 🔥\n\nMain yahan daily Google Maps aur YouTube tasks karke ₹150+ earn kar raha hoon. Aap bhi join karein aur ₹500 minimum payout UPI me lein!\n\n👉 Join Link: ${shareUrl}\n👉 Use Referral Code: *${refCode}*`);
      waBtn.href = `https://api.whatsapp.com/send?text=${waText}`;
    }

    // Render referred users table
    const tbody = document.getElementById('referredUsersList');
    if (tbody) {
      if (!data.referredUsers || data.referredUsers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-indigo-200/60">Abhi tak kisi ko refer nahi kiya hai. Apne dosto ko invite karein!</td></tr>';
      } else {
        tbody.innerHTML = '';
        data.referredUsers.forEach(u => {
          const tr = document.createElement('tr');
          const dateStr = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '--';
          let statusBadge = '';
          if (u.status === 'approved') {
            statusBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">Active (Paid)</span>';
          } else if (u.status === 'pending') {
            statusBadge = '<span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">Pending Verify</span>';
          } else {
            statusBadge = `<span class="px-2 py-0.5 rounded-full bg-slate-500/20 text-slate-400 font-bold">${u.status}</span>`;
          }

          tr.innerHTML = `
            <td class="py-2.5 font-semibold text-white">${u.fullName} <span class="text-[10px] text-indigo-300">(${u.mobile})</span></td>
            <td class="py-2.5 text-slate-300">${dateStr}</td>
            <td class="py-2.5 text-indigo-200">${u.planName || 'Plan'}</td>
            <td class="py-2.5">${statusBadge}</td>
            <td class="py-2.5 text-right font-black ${u.rewardEarned > 0 ? 'text-amber-400' : 'text-slate-400'}">
              ${u.rewardEarned > 0 ? '+50 Coins ✓' : 'Pending Approval'}
            </td>
          `;
          tbody.appendChild(tr);
        });
      }
    }
  } catch (err) {
    console.error('Error loading referrals:', err);
  }
}

function copyReferralCode() {
  if (!userReferralData || !userReferralData.referralCode) return;
  navigator.clipboard.writeText(userReferralData.referralCode).then(() => {
    const btn = document.getElementById('refCopyBtnText');
    if (btn) {
      btn.innerText = 'Copied!';
      setTimeout(() => { btn.innerText = 'Copy'; }, 2000);
    }
    Swal.fire({
      icon: 'success',
      title: 'Referral Code Copied!',
      text: userReferralData.referralCode,
      timer: 1500,
      showConfirmButton: false
    });
  });
}

function copyReferralLink() {
  if (!userReferralData || !userReferralData.referralCode) return;
  const link = `${window.location.origin}/register.html?ref=${userReferralData.referralCode}`;
  navigator.clipboard.writeText(link).then(() => {
    const btn = document.getElementById('linkCopyBtnText');
    if (btn) {
      btn.innerText = 'Link Copied!';
      setTimeout(() => { btn.innerText = 'Copy Referral Link'; }, 2000);
    }
    Swal.fire({
      icon: 'success',
      title: 'Referral Link Copied!',
      text: 'Apne dosto ke sath share karein.',
      timer: 1500,
      showConfirmButton: false
    });
  });
}

// -------------------------------------------------------------
// LIVE CHAT SYSTEM (USER <-> ADMIN)
// -------------------------------------------------------------
function toggleUserChat() {
  const windowEl = document.getElementById('userChatWindow');
  if (!windowEl) return;

  isChatOpen = !isChatOpen;
  if (isChatOpen) {
    windowEl.classList.remove('hidden');
    loadUserChatMessages();
    setTimeout(() => {
      const input = document.getElementById('userChatInput');
      if (input) input.focus();
    }, 100);
  } else {
    windowEl.classList.add('hidden');
  }
}

async function loadUserChatMessages(isBackgroundCheck = false) {
  try {
    const res = await fetch('/api/user/chat/messages');
    const data = await res.json();
    if (!data.success) return;

    const messages = data.messages || [];
    const container = document.getElementById('userChatMessagesBody');
    const badge = document.getElementById('chatUnreadBadge');

    // Count unread admin messages
    const unreadCount = messages.filter(m => m.sender === 'admin' && !m.readByUser).length;
    if (badge) {
      if (unreadCount > 0 && !isChatOpen) {
        badge.innerText = unreadCount;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    }

    if (!isChatOpen && isBackgroundCheck) return;

    if (!container) return;

    if (messages.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 text-slate-400">
          <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl mx-auto mb-2 shadow-inner">
            <i class="fa-solid fa-headset"></i>
          </div>
          <p class="font-bold text-slate-700">Namaste ${currentUser ? currentUser.fullName : 'User'}!</p>
          <p class="text-[11px] text-slate-400 mt-1">Admin se kisi bhi sawal ya madad ke liye yahan message karein.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    messages.forEach(m => {
      const isUser = m.sender === 'user';
      const msgDiv = document.createElement('div');
      msgDiv.className = `flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-3`;

      const timeStr = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

      msgDiv.innerHTML = `
        <div class="flex items-end gap-1.5 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}">
          ${!isUser ? `
            <div class="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black shadow flex-shrink-0 mb-0.5">
              AD
            </div>
          ` : ''}
          <div class="px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
            isUser
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none'
              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
          }">
            ${!isUser ? '<div class="text-[10px] font-black text-indigo-600 mb-0.5">Admin Support</div>' : ''}
            <div>${escapeHtml(m.text)}</div>
            <div class="text-[9px] mt-1 text-right ${isUser ? 'text-indigo-200' : 'text-slate-400'} flex items-center justify-end gap-1">
              <span>${timeStr}</span>
              ${isUser ? '<i class="fa-solid fa-check text-[8px]"></i>' : ''}
            </div>
          </div>
        </div>
      `;
      container.appendChild(msgDiv);
    });

    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
  } catch (err) {
    console.error('Chat load error:', err);
  }
}

async function handleSendUserMessage(e) {
  if (e) e.preventDefault();
  const input = document.getElementById('userChatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  const sendBtn = document.getElementById('userChatSendBtn');
  if (sendBtn) sendBtn.disabled = true;

  try {
    const res = await fetch('/api/user/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    const data = await res.json();
    if (data.success) {
      await loadUserChatMessages();
    }
  } catch (err) {
    console.error('Send message error:', err);
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

function sendQuickMessage(text) {
  const input = document.getElementById('userChatInput');
  if (input) {
    input.value = text;
    handleSendUserMessage();
  }
}

function startChatPolling() {
  if (chatPollingInterval) clearInterval(chatPollingInterval);
  chatPollingInterval = setInterval(() => {
    loadUserChatMessages(true);
  }, 4000); // Check every 4 seconds for instant messages
}

function escapeHtml(string) {
  const entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  return String(string).replace(/[&<>"'\/]/g, s => entityMap[s]);
}

// Start
initDashboard();
