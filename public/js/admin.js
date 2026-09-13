// Admin Portal Controller
let allUsers = [];
let allTasks = [];
let allYoutubeTasks = [];
let allWithdrawals = [];
let allLinks = [];
let allYoutubeLinks = [];
let allWatchVideos = [];
let allChatThreads = [];
let currentSelectedChatUserId = null;
let currentInspectTaskId = null;
let currentInspectYtTaskId = null;
let adminChatPollingInterval = null;

async function initAdmin() {
  try {
    const res = await fetch('/api/auth/check-session');
    const data = await res.json();
    if (!data.success || data.role !== 'admin') {
      window.location.href = '/login.html?admin=true';
      return;
    }

    await loadAdminStats();
    await loadAdminUsers();
    await loadAdminTasks();
    await loadAdminYoutubeTasks();
    await loadAdminWithdrawals();
    await loadAdminLinks();
    await loadAdminYoutubeLinks();
    await loadAdminWatchVideos();
    await loadAdminChatThreads();
    await loadAdminSettings();
    startAdminChatPolling();
  } catch (err) {
    console.error('Admin init error:', err);
    window.location.href = '/login.html?admin=true';
  }
}

function switchAdminTab(tabName) {
  const tabs = ['users', 'tasks', 'yttasks', 'withdrawals', 'links', 'ytlinks', 'watchvideos', 'chat', 'settings'];
  tabs.forEach(t => {
    const btn = document.getElementById(`tabBtn_${t}`);
    const content = document.getElementById(`tabContent_${t}`);
    if (btn && content) {
      if (t === tabName) {
        btn.className = 'px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-indigo-600 text-white shadow-sm transition-all flex items-center gap-2';
        content.classList.remove('hidden');
      } else {
        btn.className = 'px-3.5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-slate-600 hover:bg-slate-100 transition-all flex items-center gap-2';
        content.classList.add('hidden');
      }
    }
  });
}

// -------------------------------------------------------------
// STATS
// -------------------------------------------------------------
async function loadAdminStats() {
  try {
    const res = await fetch('/api/admin/stats');
    const data = await res.json();
    if (!data.success) return;

    const s = data.stats;
    document.getElementById('statTotalUsers').innerText = s.totalUsers;
    document.getElementById('statPendingUsers').innerText = s.pendingUsers;
    document.getElementById('statPendingTasks').innerText = s.pendingTasks;
    if (document.getElementById('statPendingYtTasks')) {
      document.getElementById('statPendingYtTasks').innerText = s.pendingYtTasks || 0;
    }
    document.getElementById('statPendingWithdrawals').innerText = s.pendingWithdrawals;
    document.getElementById('statTotalPaid').innerText = s.totalPaid;
    document.getElementById('statActiveLinks').innerText = s.activeLinks;
    if (document.getElementById('statActiveYtLinks')) {
      document.getElementById('statActiveYtLinks').innerText = s.activeYtLinks || 0;
    }

    // Badges in tabs
    const bUsers = document.getElementById('badgeUsersCount');
    if (s.pendingUsers > 0) {
      bUsers.innerText = s.pendingUsers;
      bUsers.classList.remove('hidden');
    } else {
      bUsers.classList.add('hidden');
    }

    const bTasks = document.getElementById('badgeTasksCount');
    if (s.pendingTasks > 0) {
      bTasks.innerText = s.pendingTasks;
      bTasks.classList.remove('hidden');
    } else {
      bTasks.classList.add('hidden');
    }

    const bYtTasks = document.getElementById('badgeYtTasksCount');
    if (bYtTasks) {
      if (s.pendingYtTasks > 0) {
        bYtTasks.innerText = s.pendingYtTasks;
        bYtTasks.classList.remove('hidden');
      } else {
        bYtTasks.classList.add('hidden');
      }
    }

    const bWith = document.getElementById('badgeWithdrawalsCount');
    if (s.pendingWithdrawals > 0) {
      bWith.innerText = s.pendingWithdrawals;
      bWith.classList.remove('hidden');
    } else {
      bWith.classList.add('hidden');
    }
  } catch (err) {
    console.error('Stats error:', err);
  }
}

// -------------------------------------------------------------
// USER APPROVALS
// -------------------------------------------------------------
async function loadAdminUsers() {
  try {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (data.success) {
      allUsers = data.users;
      filterUsers();
    }
  } catch (err) {
    console.error('Users load error:', err);
  }
}

function filterUsers() {
  const filter = document.getElementById('userFilterSelect').value;
  const tbody = document.getElementById('usersTableBody');
  tbody.innerHTML = '';

  let filtered = allUsers;
  if (filter !== 'all') {
    filtered = allUsers.filter(u => u.status === filter);
  }

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-slate-400">No users found matching selected filter.</td></tr>';
    return;
  }

  filtered.forEach(u => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';

    let statusBadge = '';
    if (u.status === 'approved') {
      statusBadge = '<span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">Active / Approved</span>';
    } else if (u.status === 'deactivated') {
      statusBadge = '<span class="px-2.5 py-0.5 bg-rose-900 text-rose-100 rounded-full font-bold shadow-sm"><i class="fa-solid fa-ban mr-1"></i>Deactivated</span>';
    } else if (u.status === 'rejected') {
      statusBadge = '<span class="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold">Rejected</span>';
    } else {
      statusBadge = '<span class="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold animate-pulse">Pending Approval</span>';
    }

    let actionButtons = '';
    if (u.status === 'pending') {
      actionButtons = `
        <button onclick="approveUser('${u.id}', '${u.fullName}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all mr-1">
          <i class="fa-solid fa-check mr-1"></i> Approve
        </button>
        <button onclick="rejectUser('${u.id}', '${u.fullName}')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all">
          <i class="fa-solid fa-xmark mr-1"></i> Reject
        </button>
      `;
    } else if (u.status === 'approved') {
      actionButtons = `
        <button onclick="deactivateUser('${u.id}', '${u.fullName}')" class="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 ml-auto">
          <i class="fa-solid fa-user-slash"></i>
          <span>Deactivate</span>
        </button>
      `;
    } else if (u.status === 'deactivated') {
      actionButtons = `
        <button onclick="activateUser('${u.id}', '${u.fullName}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1 ml-auto">
          <i class="fa-solid fa-user-check"></i>
          <span>Reactivate</span>
        </button>
      `;
    } else {
      actionButtons = `
        <button onclick="approveUser('${u.id}', '${u.fullName}')" class="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all">
          <i class="fa-solid fa-rotate-left mr-1"></i> Re-Approve
        </button>
      `;
    }

    tr.innerHTML = `
      <td class="py-3 px-3">
        <div class="font-extrabold text-slate-900">${u.fullName}</div>
        <div class="text-[11px] text-slate-500 font-mono"><i class="fa-solid fa-phone mr-1"></i>${u.mobile} • ${u.city}</div>
        ${u.deactivatedReason ? `<div class="text-[10px] text-rose-600 font-semibold mt-0.5">Reason: ${u.deactivatedReason}</div>` : ''}
      </td>
      <td class="py-3 px-3">
        <span class="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-200">${u.planName || '₹' + u.planPrice}</span>
      </td>
      <td class="py-3 px-3">
        <div class="font-mono font-extrabold text-slate-900 bg-slate-100 px-2 py-1 rounded inline-block select-all">${u.utr || '--'}</div>
      </td>
      <td class="py-3 px-3">
        <div class="font-mono font-bold text-indigo-600">${u.upiId || '--'}</div>
      </td>
      <td class="py-3 px-3 text-slate-500 text-[11px]">
        ${new Date(u.createdAt).toLocaleDateString()}
      </td>
      <td class="py-3 px-3">${statusBadge}</td>
      <td class="py-3 px-3 text-right whitespace-nowrap">
        ${actionButtons}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function approveUser(userId, userName) {
  const result = await Swal.fire({
    title: `Approve ${userName}?`,
    text: 'Payment UTR verify ho gaya hai? Plan activate kiya jaye?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    confirmButtonText: 'Yes, Approve Plan'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch('/api/admin/users/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire({ icon: 'success', title: 'User Approved', text: data.message });
      await loadAdminStats();
      await loadAdminUsers();
    } else {
      Swal.fire({ icon: 'error', title: 'Failed', text: data.message });
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Server error' });
  }
}

async function deactivateUser(userId, userName) {
  const { value: reason } = await Swal.fire({
    title: `Deactivate ${userName}?`,
    text: 'Yeh user login nahi kar payega aur dashboard access block ho jayega.',
    input: 'text',
    inputLabel: 'Deactivation Reason (Optional)',
    inputValue: 'Rule violation / Suspicious activity',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Yes, Deactivate User'
  });

  if (reason === undefined) return;

  try {
    const res = await fetch('/api/admin/users/deactivate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason })
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire({ icon: 'success', title: 'User Deactivated', text: data.message });
      await loadAdminStats();
      await loadAdminUsers();
    } else {
      Swal.fire({ icon: 'error', title: 'Failed', text: data.message });
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Server error' });
  }
}

async function activateUser(userId, userName) {
  const result = await Swal.fire({
    title: `Reactivate ${userName}?`,
    text: 'User ka account fir se active ho jayega aur login kar payega.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    confirmButtonText: 'Yes, Reactivate'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch('/api/admin/users/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire({ icon: 'success', title: 'User Reactivated', text: data.message });
      await loadAdminStats();
      await loadAdminUsers();
    } else {
      Swal.fire({ icon: 'error', title: 'Failed', text: data.message });
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Server error' });
  }
}

async function rejectUser(userId, userName) {
  const { value: reason } = await Swal.fire({
    title: `Reject ${userName}?`,
    input: 'text',
    inputLabel: 'Rejection Reason (e.g. Invalid UTR number / Payment not received)',
    inputValue: 'Invalid UTR Number / Payment not received',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Reject Signup'
  });

  if (reason === undefined) return;

  try {
    const res = await fetch('/api/admin/users/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason })
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire({ icon: 'info', title: 'User Rejected', text: data.message });
      await loadAdminStats();
      await loadAdminUsers();
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Server error' });
  }
}

// -------------------------------------------------------------
// TASK REVIEWS & INSPECTION
// -------------------------------------------------------------
async function loadAdminTasks() {
  try {
    const res = await fetch('/api/admin/tasks');
    const data = await res.json();
    if (data.success) {
      allTasks = data.tasks;
      renderAdminTasks();
    }
  } catch (err) {
    console.error('Tasks error:', err);
  }
}

function renderAdminTasks() {
  const tbody = document.getElementById('tasksTableBody');
  tbody.innerHTML = '';

  if (allTasks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-slate-400">No task submissions yet.</td></tr>';
    return;
  }

  allTasks.forEach(t => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';

    let statusBadge = '';
    if (t.status === 'approved') {
      statusBadge = `<span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">Approved (+₹${t.rewardAmount || 100} Paid)</span>`;
    } else if (t.status === 'rejected') {
      statusBadge = '<span class="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold">Rejected</span>';
    } else if (t.status === 'submitted') {
      statusBadge = '<span class="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold animate-pulse">Submitted / Pending Review</span>';
    } else {
      statusBadge = '<span class="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-bold">In Progress</span>';
    }

    const uploadedCount = t.items ? t.items.filter(i => i.screenshot).length : 0;

    tr.innerHTML = `
      <td class="py-3 px-3 text-slate-600 font-medium">${t.date}</td>
      <td class="py-3 px-3 font-extrabold text-slate-900">${t.userName}</td>
      <td class="py-3 px-3 font-mono text-slate-600">${t.userMobile}</td>
      <td class="py-3 px-3 font-bold text-slate-800">
        <span class="${uploadedCount === 10 ? 'text-emerald-600' : 'text-slate-500'}">${uploadedCount}/10 Reviews</span>
      </td>
      <td class="py-3 px-3">${statusBadge}</td>
      <td class="py-3 px-3 text-right">
        <button onclick="openInspectModal('${t.id}')" class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 ml-auto">
          <i class="fa-solid fa-images"></i>
          <span>Inspect 10 Proofs</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openInspectModal(taskId) {
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return;

  currentInspectTaskId = task.id;
  document.getElementById('inspectUserName').innerText = task.userName;
  document.getElementById('inspectUserMobile').innerText = task.userMobile;
  document.getElementById('inspectTaskDate').innerText = task.date;

  const grid = document.getElementById('inspectItemsGrid');
  grid.innerHTML = '';

  task.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'p-3 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between';

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">
            ${item.taskIndex}
          </span>
          <a href="${item.mapUrl}" target="_blank" class="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1">
            <span>Map Link</span> <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </div>
        <div class="font-extrabold text-slate-800 text-xs truncate mb-2">${item.businessName}</div>
      </div>

      <div class="mt-2">
        ${
          item.screenshot
            ? `
          <div class="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-300 bg-black aspect-video flex items-center justify-center" onclick="zoomImage('${item.screenshot}')">
            <img src="${item.screenshot}" alt="Proof" class="max-h-full object-contain group-hover:scale-105 transition-transform duration-200">
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
              <i class="fa-solid fa-magnifying-glass-plus"></i> Zoom Proof
            </div>
          </div>
        `
            : `
          <div class="py-6 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
            No Screenshot
          </div>
        `
        }
      </div>
    `;
    grid.appendChild(card);
  });

  const approveBtn = document.getElementById('inspectApproveBtn');
  const rejectBtn = document.getElementById('inspectRejectBtn');

  if (task.status === 'approved') {
    approveBtn.disabled = true;
    approveBtn.className = 'px-5 py-2 bg-slate-300 text-slate-500 rounded-xl text-xs font-bold cursor-not-allowed';
    approveBtn.innerHTML = `<i class="fa-solid fa-check mr-1"></i> Already Approved (+₹${task.rewardAmount || 100})`;
    rejectBtn.disabled = true;
  } else {
    approveBtn.disabled = false;
    approveBtn.className = 'px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow transition-all flex items-center gap-1.5';
    approveBtn.innerHTML = `<i class="fa-solid fa-check mr-1"></i> Approve Tasks (+₹${task.rewardAmount || 100} Coins)`;
    rejectBtn.disabled = false;
  }

  document.getElementById('taskInspectionModal').classList.remove('hidden');
}

function closeInspectionModal() {
  document.getElementById('taskInspectionModal').classList.add('hidden');
}

function zoomImage(src) {
  document.getElementById('adminZoomImg').src = src;
  document.getElementById('adminZoomModal').classList.remove('hidden');
}

async function inspectActionApprove() {
  if (!currentInspectTaskId) return;

  const result = await Swal.fire({
    title: 'Approve 10 Reviews?',
    text: 'User ke wallet me ₹100 Coins credit ho jayenge.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    confirmButtonText: 'Yes, Approve & Reward ₹100'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch('/api/admin/tasks/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: currentInspectTaskId })
    });
    const data = await res.json();
    if (data.success) {
      closeInspectionModal();
      Swal.fire({ icon: 'success', title: 'Approved!', text: data.message });
      await loadAdminStats();
      await loadAdminTasks();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: data.message });
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Server error' });
  }
}

async function inspectActionReject() {
  if (!currentInspectTaskId) return;

  const { value: reason } = await Swal.fire({
    title: 'Reject Task Set?',
    input: 'text',
    inputLabel: 'Rejection Reason (Screenshots incomplete / blurry / invalid)',
    inputValue: 'Some review screenshots were invalid or missing',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Reject Tasks'
  });

  if (reason === undefined) return;

  try {
    const res = await fetch('/api/admin/tasks/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: currentInspectTaskId, reason })
    });
    const data = await res.json();
    if (data.success) {
      closeInspectionModal();
      Swal.fire({ icon: 'info', title: 'Tasks Rejected', text: data.message });
      await loadAdminStats();
      await loadAdminTasks();
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Server error' });
  }
}

// -------------------------------------------------------------
// YOUTUBE TASKS (₹50 Coins)
// -------------------------------------------------------------
async function loadAdminYoutubeTasks() {
  try {
    const res = await fetch('/api/admin/youtube-tasks');
    const data = await res.json();
    if (data.success) {
      allYoutubeTasks = data.tasks;
      renderAdminYoutubeTasks();
    }
  } catch (err) {
    console.error('YouTube tasks load error:', err);
  }
}

function renderAdminYoutubeTasks() {
  const tbody = document.getElementById('ytTasksTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (allYoutubeTasks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="py-8 text-center text-slate-400">No YouTube task submissions yet.</td></tr>';
    return;
  }

  allYoutubeTasks.forEach(t => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';

    let statusBadge = '';
    if (t.status === 'approved') {
      statusBadge = '<span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">Approved (+₹50 Paid)</span>';
    } else if (t.status === 'rejected') {
      statusBadge = '<span class="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold">Rejected</span>';
    } else if (t.status === 'submitted') {
      statusBadge = '<span class="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold animate-pulse">Submitted / Pending</span>';
    } else {
      statusBadge = '<span class="px-2.5 py-0.5 bg-slate-100 text-slate-700 rounded-full font-bold">In Progress</span>';
    }

    const uploadedCount = t.items ? t.items.filter(i => i.screenshot).length : 0;

    tr.innerHTML = `
      <td class="py-3 px-3 text-slate-600 font-medium">${t.date}</td>
      <td class="py-3 px-3 font-extrabold text-slate-900">${t.userName}</td>
      <td class="py-3 px-3 font-mono text-slate-600">${t.userMobile}</td>
      <td class="py-3 px-3 font-bold text-slate-800">
        <span class="${uploadedCount === 10 ? 'text-emerald-600' : 'text-slate-500'}">${uploadedCount}/10 Channels</span>
      </td>
      <td class="py-3 px-3">${statusBadge}</td>
      <td class="py-3 px-3 text-right">
        <button onclick="openInspectYoutubeModal('${t.id}')" class="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 ml-auto">
          <i class="fa-brands fa-youtube"></i>
          <span>Inspect 10 Proofs</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openInspectYoutubeModal(taskId) {
  const task = allYoutubeTasks.find(t => t.id === taskId);
  if (!task) return;

  currentInspectTaskId = null;
  currentInspectYtTaskId = task.id;

  document.getElementById('inspectUserName').innerText = task.userName + ' (YouTube)';
  document.getElementById('inspectUserMobile').innerText = task.userMobile;
  document.getElementById('inspectTaskDate').innerText = task.date;

  const grid = document.getElementById('inspectItemsGrid');
  grid.innerHTML = '';

  task.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'p-3 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between';

    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
            ${item.taskIndex}
          </span>
          <a href="${item.channelUrl}" target="_blank" class="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1">
            <i class="fa-brands fa-youtube"></i> Channel Link <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
          </a>
        </div>
        <div class="font-extrabold text-slate-800 text-xs truncate mb-2">${item.channelName}</div>
      </div>

      <div class="mt-2">
        ${
          item.screenshot
            ? `
          <div class="relative group cursor-pointer overflow-hidden rounded-xl border border-slate-300 bg-black aspect-video flex items-center justify-center" onclick="zoomImage('${item.screenshot}')">
            <img src="${item.screenshot}" alt="Subscribe Proof" class="max-h-full object-contain group-hover:scale-105 transition-transform duration-200">
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
              <i class="fa-solid fa-magnifying-glass-plus"></i> Zoom Proof
            </div>
          </div>
        `
            : `
          <div class="py-6 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
            No Screenshot
          </div>
        `
        }
      </div>
    `;
    grid.appendChild(card);
  });

  const approveBtn = document.getElementById('inspectApproveBtn');
  const rejectBtn = document.getElementById('inspectRejectBtn');

  if (task.status === 'approved') {
    approveBtn.disabled = true;
    approveBtn.className = 'px-5 py-2 bg-slate-300 text-slate-500 rounded-xl text-xs font-bold cursor-not-allowed';
    approveBtn.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Already Approved (+₹50)';
    rejectBtn.disabled = true;
  } else {
    approveBtn.disabled = false;
    approveBtn.className = 'px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black shadow transition-all flex items-center gap-1.5';
    approveBtn.innerHTML = '<i class="fa-solid fa-check mr-1"></i> Approve YouTube Tasks (+₹50 Coins)';
    approveBtn.onclick = inspectYtActionApprove;
    rejectBtn.disabled = false;
    rejectBtn.onclick = inspectYtActionReject;
  }

  document.getElementById('taskInspectionModal').classList.remove('hidden');
}

async function inspectYtActionApprove() {
  if (!currentInspectYtTaskId) return;

  const result = await Swal.fire({
    title: 'Approve YouTube Tasks?',
    text: 'User ke wallet me ₹50 Coins credit ho jayenge.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Yes, Approve & Reward ₹50'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch('/api/admin/youtube-tasks/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: currentInspectYtTaskId })
    });
    const data = await res.json();
    if (data.success) {
      closeInspectionModal();
      Swal.fire({ icon: 'success', title: 'Approved!', text: data.message });
      await loadAdminStats();
      await loadAdminYoutubeTasks();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: data.message });
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Server error' });
  }
}

async function inspectYtActionReject() {
  if (!currentInspectYtTaskId) return;

  const { value: reason } = await Swal.fire({
    title: 'Reject YouTube Tasks?',
    input: 'text',
    inputLabel: 'Rejection Reason',
    inputValue: 'Subscribe or comment proof screenshots missing',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Reject Tasks'
  });

  if (reason === undefined) return;

  try {
    const res = await fetch('/api/admin/youtube-tasks/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: currentInspectYtTaskId, reason })
    });
    const data = await res.json();
    if (data.success) {
      closeInspectionModal();
      Swal.fire({ icon: 'info', title: 'Tasks Rejected', text: data.message });
      await loadAdminStats();
      await loadAdminYoutubeTasks();
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Server error' });
  }
}

// -------------------------------------------------------------
// YOUTUBE CHANNELS POOL
// -------------------------------------------------------------
async function loadAdminYoutubeLinks() {
  try {
    const res = await fetch('/api/admin/youtube-links');
    const data = await res.json();
    if (data.success) {
      allYoutubeLinks = data.links;
      renderAdminYoutubeLinks();
    }
  } catch (err) {
    console.error('YouTube links load error:', err);
  }
}

function renderAdminYoutubeLinks() {
  const tbody = document.getElementById('ytLinksTableBody');
  if (!tbody) return;
  if (document.getElementById('totalYtLinksCount')) {
    document.getElementById('totalYtLinksCount').innerText = allYoutubeLinks.length;
  }
  tbody.innerHTML = '';

  if (allYoutubeLinks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="py-8 text-center text-slate-400">No YouTube channels in pool. Add above!</td></tr>';
    return;
  }

  allYoutubeLinks.forEach((lnk, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';

    tr.innerHTML = `
      <td class="py-3 px-3 text-slate-400 font-bold">${idx + 1}</td>
      <td class="py-3 px-3 font-extrabold text-slate-900 flex items-center gap-1.5">
        <i class="fa-brands fa-youtube text-red-600"></i> ${lnk.channelName}
      </td>
      <td class="py-3 px-3">
        <a href="${lnk.channelUrl}" target="_blank" class="text-red-600 font-mono hover:underline truncate max-w-xs block">
          ${lnk.channelUrl} <i class="fa-solid fa-arrow-up-right-from-square text-[9px] ml-1"></i>
        </a>
      </td>
      <td class="py-3 px-3">
        <span class="px-2 py-0.5 rounded-full font-bold text-[11px] ${
          lnk.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
        }">
          ${lnk.active ? 'Active in Pool' : 'Disabled'}
        </span>
      </td>
      <td class="py-3 px-3 text-right whitespace-nowrap">
        <button onclick="toggleYtLink('${lnk.id}')" class="px-2.5 py-1 text-xs font-bold rounded-lg border ${
          lnk.active ? 'border-amber-300 text-amber-700 bg-amber-50' : 'border-emerald-300 text-emerald-700 bg-emerald-50'
        } transition-colors mr-1">
          ${lnk.active ? 'Disable' : 'Enable'}
        </button>
        <button onclick="deleteYtLink('${lnk.id}')" class="px-2.5 py-1 text-xs font-bold rounded-lg border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function handleAddYtLink(e) {
  e.preventDefault();
  const channelName = document.getElementById('newYtChannelName').value.trim();
  const channelUrl = document.getElementById('newYtChannelUrl').value.trim();

  if (!channelName || !channelUrl) return;

  const btn = document.getElementById('addYtLinkBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Adding...';

  try {
    const res = await fetch('/api/admin/youtube-links/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelName, channelUrl })
    });
    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-plus mr-1"></i> Add Channel';

    if (data.success) {
      document.getElementById('newYtChannelName').value = '';
      document.getElementById('newYtChannelUrl').value = '';
      Swal.fire({ icon: 'success', title: 'Channel Added', text: 'New YouTube channel added to rotation pool!' });
      await loadAdminStats();
      await loadAdminYoutubeLinks();
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-plus mr-1"></i> Add Channel';
    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add channel' });
  }
}

async function toggleYtLink(linkId) {
  try {
    const res = await fetch('/api/admin/youtube-links/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId })
    });
    const data = await res.json();
    if (data.success) {
      await loadAdminStats();
      await loadAdminYoutubeLinks();
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteYtLink(linkId) {
  const result = await Swal.fire({
    title: 'Delete YouTube Channel?',
    text: 'Are you sure you want to remove this channel from the pool?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Delete'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch('/api/admin/youtube-links/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId })
    });
    const data = await res.json();
    if (data.success) {
      await loadAdminStats();
      await loadAdminYoutubeLinks();
    }
  } catch (err) {
    console.error(err);
  }
}

// -------------------------------------------------------------
// WATCH VIDEOS POOL (4 Min Watch = 10 Coins)
// -------------------------------------------------------------
async function loadAdminWatchVideos() {
  try {
    const res = await fetch('/api/admin/watch-videos');
    const data = await res.json();
    if (data.success) {
      allWatchVideos = data.videos || [];
      renderAdminWatchVideos();
    }
  } catch (err) {
    console.error('Watch videos load error:', err);
  }
}

function renderAdminWatchVideos() {
  const tbody = document.getElementById('watchVideosTableBody');
  if (!tbody) return;
  if (document.getElementById('totalWatchVideosCount')) {
    document.getElementById('totalWatchVideosCount').innerText = allWatchVideos.length;
  }
  tbody.innerHTML = '';

  if (allWatchVideos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-slate-400">No watch videos in pool. Add some above!</td></tr>';
    return;
  }

  allWatchVideos.forEach((v, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';

    const durationMins = Math.round((v.durationSeconds || 240) / 60);

    tr.innerHTML = `
      <td class="py-3 px-3 text-slate-400 font-bold">${idx + 1}</td>
      <td class="py-3 px-3 font-extrabold text-slate-900 flex items-center gap-2">
        <i class="fa-solid fa-circle-play text-amber-500"></i> ${escapeHtml(v.title || `Video #${idx + 1}`)}
      </td>
      <td class="py-3 px-3 font-semibold text-slate-700">
        <span class="bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200">
          ${durationMins} Mins (${v.durationSeconds || 240}s)
        </span>
      </td>
      <td class="py-3 px-3 font-black text-indigo-600">
        🪙 ${v.rewardPerVideo || 10} Coins (₹${v.rewardPerVideo || 10})
      </td>
      <td class="py-3 px-3">
        <a href="${v.videoUrl}" target="_blank" class="text-amber-600 font-mono hover:underline truncate max-w-xs block">
          ${v.videoUrl} <i class="fa-solid fa-arrow-up-right-from-square text-[9px] ml-1"></i>
        </a>
      </td>
      <td class="py-3 px-3">
        <span class="px-2 py-0.5 rounded-full font-bold text-[11px] ${
          v.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
        }">
          ${v.active ? 'Active in Pool' : 'Disabled'}
        </span>
      </td>
      <td class="py-3 px-3 text-right whitespace-nowrap">
        <button onclick="toggleWatchVideo('${v.id}')" class="px-2.5 py-1 text-xs font-bold rounded-lg border ${
          v.active ? 'border-amber-300 text-amber-700 bg-amber-50' : 'border-emerald-300 text-emerald-700 bg-emerald-50'
        } transition-colors mr-1">
          ${v.active ? 'Disable' : 'Enable'}
        </button>
        <button onclick="deleteWatchVideo('${v.id}')" class="px-2.5 py-1 text-xs font-bold rounded-lg border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function handleAddWatchVideo(e) {
  e.preventDefault();
  const title = document.getElementById('newWatchVideoTitle').value.trim();
  const videoUrl = document.getElementById('newWatchVideoUrl').value.trim();
  const durationSeconds = document.getElementById('newWatchVideoDuration').value;
  const rewardPerVideo = document.getElementById('newWatchVideoReward').value;

  if (!title || !videoUrl) return;

  const btn = document.getElementById('addWatchVideoBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Adding...';

  try {
    const res = await fetch('/api/admin/watch-videos/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        videoUrl,
        durationSeconds: Number(durationSeconds) || 240,
        rewardPerVideo: Number(rewardPerVideo) || 10
      })
    });
    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Video to Pool';

    if (data.success) {
      document.getElementById('newWatchVideoTitle').value = '';
      document.getElementById('newWatchVideoUrl').value = '';
      Swal.fire({ icon: 'success', title: 'Video Added', text: 'New Video added to Watch & Earn rotation pool!' });
      await loadAdminWatchVideos();
    } else {
      Swal.fire({ icon: 'error', title: 'Error', text: data.message });
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Video to Pool';
    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add video' });
  }
}

async function toggleWatchVideo(videoId) {
  try {
    const res = await fetch('/api/admin/watch-videos/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId })
    });
    const data = await res.json();
    if (data.success) {
      await loadAdminWatchVideos();
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteWatchVideo(videoId) {
  const result = await Swal.fire({
    title: 'Delete Watch Video?',
    text: 'Are you sure you want to remove this video from the pool?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Delete'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch('/api/admin/watch-videos/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ videoId })
    });
    const data = await res.json();
    if (data.success) {
      await loadAdminWatchVideos();
    }
  } catch (err) {
    console.error(err);
  }
}

// -------------------------------------------------------------
// WITHDRAWALS
// -------------------------------------------------------------
async function loadAdminWithdrawals() {
  try {
    const res = await fetch('/api/admin/withdrawals');
    const data = await res.json();
    if (data.success) {
      allWithdrawals = data.withdrawals;
      renderAdminWithdrawals();
    }
  } catch (err) {
    console.error('Withdrawals error:', err);
  }
}

function renderAdminWithdrawals() {
  const tbody = document.getElementById('withdrawalsTableBody');
  tbody.innerHTML = '';

  if (allWithdrawals.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="py-8 text-center text-slate-400">No withdrawal requests yet.</td></tr>';
    return;
  }

  allWithdrawals.forEach(w => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';

    let statusBadge = '';
    if (w.status === 'approved') {
      statusBadge = '<span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">Paid / Success</span>';
    } else if (w.status === 'rejected') {
      statusBadge = '<span class="px-2.5 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold">Rejected &amp; Refunded</span>';
    } else {
      statusBadge = '<span class="px-2.5 py-0.5 bg-cyan-100 text-cyan-800 rounded-full font-bold animate-pulse">Pending Payout</span>';
    }

    tr.innerHTML = `
      <td class="py-3 px-3 text-slate-600 font-medium">${new Date(w.requestedAt).toLocaleDateString()}</td>
      <td class="py-3 px-3">
        <div class="font-extrabold text-slate-900">${w.userName}</div>
        <div class="text-[11px] text-slate-500 font-mono">${w.userMobile}</div>
      </td>
      <td class="py-3 px-3 font-black text-slate-900 text-sm">
        ₹${w.amount} <span class="text-xs text-slate-500">(${w.amount} Coins)</span>
      </td>
      <td class="py-3 px-3">
        <div class="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded inline-block select-all">${w.upiId}</div>
      </td>
      <td class="py-3 px-3">${statusBadge}</td>
      <td class="py-3 px-3 font-mono text-slate-600 text-xs">${w.payoutUtr || '--'}</td>
      <td class="py-3 px-3 text-right whitespace-nowrap">
        ${
          w.status === 'pending'
            ? `
          <button onclick="approveWithdrawal('${w.id}', ${w.amount}, '${w.upiId}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all mr-1">
            <i class="fa-solid fa-check mr-1"></i> Pay &amp; Approve
          </button>
          <button onclick="rejectWithdrawal('${w.id}')" class="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-all">
            <i class="fa-solid fa-xmark mr-1"></i> Reject
          </button>
        `
            : `
          <span class="text-xs text-slate-400 font-semibold">Completed</span>
        `
        }
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function approveWithdrawal(withdrawalId, amount, upiId) {
  const { value: payoutUtr } = await Swal.fire({
    title: `Approve ₹${amount} Payout`,
    text: `Transfer ₹${amount} to UPI: ${upiId} and enter bank payout UTR:`,
    input: 'text',
    inputPlaceholder: 'Enter Payment UTR / Transaction ID',
    showCancelButton: true,
    confirmButtonColor: '#059669',
    confirmButtonText: 'Confirm Paid'
  });

  if (payoutUtr === undefined) return;

  try {
    const res = await fetch('/api/admin/withdrawals/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ withdrawalId, payoutUtr })
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire({ icon: 'success', title: 'Withdrawal Approved', text: data.message });
      await loadAdminStats();
      await loadAdminWithdrawals();
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Server error' });
  }
}

async function rejectWithdrawal(withdrawalId) {
  const { value: reason } = await Swal.fire({
    title: 'Reject Withdrawal?',
    text: 'Coins automatically user ke wallet me refund ho jayenge.',
    input: 'text',
    inputPlaceholder: 'Reason for rejection (e.g. Invalid UPI ID)',
    inputValue: 'Invalid UPI ID details',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Reject & Refund Coins'
  });

  if (reason === undefined) return;

  try {
    const res = await fetch('/api/admin/withdrawals/reject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ withdrawalId, reason })
    });
    const data = await res.json();
    if (data.success) {
      Swal.fire({ icon: 'info', title: 'Withdrawal Rejected', text: data.message });
      await loadAdminStats();
      await loadAdminWithdrawals();
    }
  } catch (err) {
    Swal.fire({ icon: 'error', title: 'Error', text: 'Server error' });
  }
}

// -------------------------------------------------------------
// GOOGLE MAP LINKS POOL
// -------------------------------------------------------------
async function loadAdminLinks() {
  try {
    const res = await fetch('/api/admin/links');
    const data = await res.json();
    if (data.success) {
      allLinks = data.links;
      renderAdminLinks();
    }
  } catch (err) {
    console.error('Links error:', err);
  }
}

function renderAdminLinks() {
  const tbody = document.getElementById('linksTableBody');
  document.getElementById('totalLinksCount').innerText = allLinks.length;
  tbody.innerHTML = '';

  if (allLinks.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="py-8 text-center text-slate-400">No Google Map links in pool. Add some links above!</td></tr>';
    return;
  }

  allLinks.forEach((lnk, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';

    tr.innerHTML = `
      <td class="py-3 px-3 text-slate-400 font-bold">${idx + 1}</td>
      <td class="py-3 px-3 font-extrabold text-slate-900">${lnk.businessName}</td>
      <td class="py-3 px-3">
        <a href="${lnk.mapUrl}" target="_blank" class="text-indigo-600 font-mono hover:underline truncate max-w-xs block">
          ${lnk.mapUrl} <i class="fa-solid fa-arrow-up-right-from-square text-[9px] ml-1"></i>
        </a>
      </td>
      <td class="py-3 px-3">
        <span class="px-2 py-0.5 rounded-full font-bold text-[11px] ${
          lnk.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
        }">
          ${lnk.active ? 'Active in Pool' : 'Disabled'}
        </span>
      </td>
      <td class="py-3 px-3 text-right whitespace-nowrap">
        <button onclick="toggleLink('${lnk.id}')" class="px-2.5 py-1 text-xs font-bold rounded-lg border ${
          lnk.active ? 'border-amber-300 text-amber-700 bg-amber-50' : 'border-emerald-300 text-emerald-700 bg-emerald-50'
        } transition-colors mr-1">
          ${lnk.active ? 'Disable' : 'Enable'}
        </button>
        <button onclick="deleteLink('${lnk.id}')" class="px-2.5 py-1 text-xs font-bold rounded-lg border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

async function handleAddLink(e) {
  e.preventDefault();
  const businessName = document.getElementById('newBusinessName').value.trim();
  const mapUrl = document.getElementById('newMapUrl').value.trim();

  if (!businessName || !mapUrl) return;

  const btn = document.getElementById('addLinkBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Adding...';

  try {
    const res = await fetch('/api/admin/links/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName, mapUrl })
    });
    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-plus mr-1"></i> Add Link';

    if (data.success) {
      document.getElementById('newBusinessName').value = '';
      document.getElementById('newMapUrl').value = '';
      Swal.fire({ icon: 'success', title: 'Link Added', text: 'New Google Map link added to daily pool!' });
      await loadAdminStats();
      await loadAdminLinks();
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-plus mr-1"></i> Add Link';
    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to add link' });
  }
}

async function toggleLink(linkId) {
  try {
    const res = await fetch('/api/admin/links/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId })
    });
    const data = await res.json();
    if (data.success) {
      await loadAdminStats();
      await loadAdminLinks();
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteLink(linkId) {
  const result = await Swal.fire({
    title: 'Delete Google Map Link?',
    text: 'Are you sure you want to remove this place from the pool?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    confirmButtonText: 'Delete'
  });

  if (!result.isConfirmed) return;

  try {
    const res = await fetch('/api/admin/links/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId })
    });
    const data = await res.json();
    if (data.success) {
      await loadAdminStats();
      await loadAdminLinks();
    }
  } catch (err) {
    console.error(err);
  }
}

// -------------------------------------------------------------
// PAYMENT & QR SETTINGS
// -------------------------------------------------------------
async function loadAdminSettings() {
  try {
    const res = await fetch('/api/admin/settings');
    const data = await res.json();
    if (data.success) {
      const s = data.settings;
      document.getElementById('settingUpiId').value = s.upiId || 'admin@upi';
      document.getElementById('settingUpiName').value = s.upiName || '';
      document.getElementById('settingMinWithdrawal').value = s.minWithdrawal || 500;
      document.getElementById('settingDailyReward').value = s.dailyTaskReward || 100;
      if (document.getElementById('settingDailyYoutubeReward')) {
        document.getElementById('settingDailyYoutubeReward').value = s.dailyYoutubeReward || 50;
      }
      if (document.getElementById('settingPopupVideoUrl')) {
        document.getElementById('settingPopupVideoUrl').value = s.popupVideoUrl || '';
      }
      if (document.getElementById('settingPopupAdTimer')) {
        document.getElementById('settingPopupAdTimer').value = s.popupAdTimer || 30;
      }
      if (document.getElementById('settingPopupAdEnabled')) {
        document.getElementById('settingPopupAdEnabled').checked = s.popupAdEnabled !== false;
      }
      if (s.qrImage) {
        document.getElementById('adminCurrentQrImg').src = s.qrImage;
      }
      previewAdminVideo();
    }
  } catch (err) {
    console.error('Settings load error:', err);
  }
}

async function handleQrUpload(e) {
  e.preventDefault();
  const fileInput = document.getElementById('newQrFileInput');
  const file = fileInput.files[0];
  if (!file) {
    Swal.fire({ icon: 'warning', title: 'Select Image', text: 'Kripya QR code image file select karein.' });
    return;
  }

  const btn = document.getElementById('uploadQrBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Uploading QR...';

  const formData = new FormData();
  formData.append('qrImage', file);

  try {
    const res = await fetch('/api/admin/settings/upload-qr', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up mr-2"></i> Upload &amp; Update Live QR Code';

    if (data.success) {
      document.getElementById('adminCurrentQrImg').src = data.qrImage;
      fileInput.value = '';
      Swal.fire({
        icon: 'success',
        title: 'QR Code Updated!',
        text: 'Naya QR Code upload ho gaya hai aur registration page par live ho gaya hai.'
      });
    } else {
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: data.message });
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up mr-2"></i> Upload &amp; Update Live QR Code';
    Swal.fire({ icon: 'error', title: 'Error', text: 'Upload failed due to network error.' });
  }
}

async function handleSettingsUpdate(e) {
  e.preventDefault();
  const upiId = document.getElementById('settingUpiId').value.trim();
  const upiName = document.getElementById('settingUpiName').value.trim();
  const minWithdrawal = document.getElementById('settingMinWithdrawal').value;
  const dailyTaskReward = document.getElementById('settingDailyReward').value;
  const dailyYoutubeReward = document.getElementById('settingDailyYoutubeReward') ? document.getElementById('settingDailyYoutubeReward').value : 50;
  const popupVideoUrl = document.getElementById('settingPopupVideoUrl') ? document.getElementById('settingPopupVideoUrl').value.trim() : '';
  const popupAdTimer = document.getElementById('settingPopupAdTimer') ? document.getElementById('settingPopupAdTimer').value : 30;
  const popupAdEnabled = document.getElementById('settingPopupAdEnabled') ? document.getElementById('settingPopupAdEnabled').checked : true;
  const adminPassword = document.getElementById('settingAdminPassword').value.trim();

  const btn = document.getElementById('saveSettingsBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-2"></i> Saving...';

  try {
    const res = await fetch('/api/admin/settings/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        upiId,
        upiName,
        minWithdrawal,
        dailyTaskReward,
        dailyYoutubeReward,
        popupVideoUrl,
        popupAdTimer,
        popupAdEnabled,
        adminPassword
      })
    });
    const data = await res.json();
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-floppy-disk mr-2"></i> Save System Settings';

    if (data.success) {
      document.getElementById('settingAdminPassword').value = '';
      Swal.fire({ icon: 'success', title: 'Settings Saved', text: 'System & Video Popup configuration updated successfully.' });
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-floppy-disk mr-2"></i> Save System Settings';
    Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to update settings.' });
  }
}

function previewAdminVideo() {
  const urlInput = document.getElementById('settingPopupVideoUrl');
  const previewBox = document.getElementById('adminVideoPreviewBox');
  const previewIframe = document.getElementById('adminVideoPreviewIframe');

  if (!urlInput || !previewBox || !previewIframe) return;

  const url = urlInput.value.trim();
  if (!url) {
    previewBox.classList.add('hidden');
    previewIframe.src = '';
    return;
  }

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

  if (videoId) {
    previewIframe.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
    previewBox.classList.remove('hidden');
  }
}

// -------------------------------------------------------------
// LIVE CHAT SUPPORT (ADMIN <-> USERS)
// -------------------------------------------------------------
async function loadAdminChatThreads(isSilent = false) {
  try {
    const res = await fetch('/api/admin/chat/threads');
    const data = await res.json();
    if (!data.success) return;

    allChatThreads = data.threads || [];

    // Calculate total unread messages across all users
    const totalUnread = allChatThreads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);
    const badgeChat = document.getElementById('badgeChatCount');
    if (badgeChat) {
      if (totalUnread > 0) {
        badgeChat.innerText = totalUnread;
        badgeChat.classList.remove('hidden');
      } else {
        badgeChat.classList.add('hidden');
      }
    }

    renderChatThreads(allChatThreads);

    // If a user conversation is currently selected, refresh its messages
    if (currentSelectedChatUserId) {
      await reloadActiveThreadMessages(true);
    }
  } catch (err) {
    if (!isSilent) console.error('Error loading chat threads:', err);
  }
}

function renderChatThreads(threads) {
  const container = document.getElementById('chatThreadsList');
  if (!container) return;

  if (threads.length === 0) {
    container.innerHTML = `
      <div class="p-8 text-center text-slate-400 text-xs">
        <i class="fa-regular fa-comments text-2xl mb-2 text-slate-300"></i>
        <p class="font-semibold text-slate-600">No chat messages yet</p>
        <p class="text-[11px] text-slate-400 mt-0.5">Users jaise hi support message bhejenge, yahan list ho jayenge.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';
  threads.forEach(t => {
    const isSelected = t.userId === currentSelectedChatUserId;
    const item = document.createElement('div');
    item.onclick = () => selectUserChat(t.userId);
    item.className = `p-3.5 cursor-pointer transition-colors flex items-start gap-3 ${
      isSelected ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-100/80'
    }`;

    const timeStr = t.lastMessageTime ? new Date(t.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

    item.innerHTML = `
      <div class="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow flex-shrink-0">
        ${(t.userName || 'U').charAt(0).toUpperCase()}
      </div>
      <div class="flex-grow min-w-0">
        <div class="flex items-center justify-between">
          <h4 class="text-xs font-black text-slate-900 truncate">${t.userName}</h4>
          <span class="text-[10px] text-slate-400 whitespace-nowrap ml-1">${timeStr}</span>
        </div>
        <div class="flex items-center justify-between mt-0.5">
          <p class="text-[11px] ${t.unreadCount > 0 ? 'font-bold text-slate-900' : 'text-slate-500'} truncate">
            ${t.lastSender === 'admin' ? '<span class="text-indigo-600 font-bold">You: </span>' : ''}${escapeHtml(t.lastMessage || '')}
          </p>
          ${t.unreadCount > 0 ? `
            <span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center flex-shrink-0 ml-1.5">
              ${t.unreadCount}
            </span>
          ` : ''}
        </div>
        <div class="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
          <span>${t.userMobile}</span>
          ${t.planName ? `<span>• ${t.planName}</span>` : ''}
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

function filterChatThreads() {
  const query = document.getElementById('chatSearchInput')?.value.toLowerCase().trim() || '';
  if (!query) {
    renderChatThreads(allChatThreads);
    return;
  }

  const filtered = allChatThreads.filter(t => 
    (t.userName && t.userName.toLowerCase().includes(query)) ||
    (t.userMobile && t.userMobile.includes(query)) ||
    (t.lastMessage && t.lastMessage.toLowerCase().includes(query))
  );
  renderChatThreads(filtered);
}

async function selectUserChat(userId) {
  currentSelectedChatUserId = userId;
  renderChatThreads(allChatThreads);

  const emptyState = document.getElementById('adminChatEmptyState');
  const activeThread = document.getElementById('adminChatActiveThread');
  if (emptyState) emptyState.classList.add('hidden');
  if (activeThread) activeThread.classList.remove('hidden');

  await reloadActiveThreadMessages();
  setTimeout(() => {
    const input = document.getElementById('adminChatInput');
    if (input) input.focus();
  }, 100);
}

async function reloadActiveThreadMessages(isSilent = false) {
  if (!currentSelectedChatUserId) return;

  try {
    const res = await fetch(`/api/admin/chat/messages/${currentSelectedChatUserId}`);
    const data = await res.json();
    if (!data.success) return;

    const user = data.user || {};
    const messages = data.messages || [];

    // Update Header
    const nameEl = document.getElementById('activeChatUserName');
    if (nameEl) nameEl.innerText = user.fullName || 'User';

    const avatarEl = document.getElementById('activeChatUserAvatar');
    if (avatarEl) avatarEl.innerText = (user.fullName || 'U').charAt(0).toUpperCase();

    const mobileEl = document.getElementById('activeChatUserMobile');
    if (mobileEl) mobileEl.innerText = user.mobile || '--';

    const planEl = document.getElementById('activeChatUserPlan');
    if (planEl) planEl.innerText = user.planName || 'Basic Plan';

    const statusEl = document.getElementById('activeChatUserStatus');
    if (statusEl) {
      statusEl.innerText = (user.status || 'Active').toUpperCase();
      if (user.status === 'approved') {
        statusEl.className = 'text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full';
      } else if (user.status === 'deactivated') {
        statusEl.className = 'text-[10px] font-extrabold bg-red-100 text-red-800 px-2 py-0.5 rounded-full';
      } else {
        statusEl.className = 'text-[10px] font-extrabold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full';
      }
    }

    // Render messages bubbles
    const container = document.getElementById('adminChatMessagesBody');
    if (!container) return;

    if (messages.length === 0) {
      container.innerHTML = '<div class="text-center py-8 text-slate-400">No messages in this conversation yet.</div>';
      return;
    }

    container.innerHTML = '';
    messages.forEach(m => {
      const isAdmin = m.sender === 'admin';
      const msgDiv = document.createElement('div');
      msgDiv.className = `flex flex-col ${isAdmin ? 'items-end' : 'items-start'} mb-3`;

      const timeStr = m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

      msgDiv.innerHTML = `
        <div class="flex items-end gap-1.5 max-w-[80%] ${isAdmin ? 'flex-row-reverse' : 'flex-row'}">
          <div class="w-7 h-7 rounded-full ${isAdmin ? 'bg-slate-900' : 'bg-indigo-600'} text-white flex items-center justify-center text-[10px] font-black shadow flex-shrink-0 mb-0.5">
            ${isAdmin ? 'AD' : (m.userName || 'U').charAt(0).toUpperCase()}
          </div>
          <div class="px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
            isAdmin
              ? 'bg-slate-900 text-white rounded-br-none'
              : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
          }">
            ${!isAdmin ? `<div class="text-[10px] font-black text-indigo-600 mb-0.5">${escapeHtml(m.userName || 'User')}</div>` : ''}
            <div>${escapeHtml(m.text)}</div>
            <div class="text-[9px] mt-1 text-right ${isAdmin ? 'text-slate-400' : 'text-slate-400'} flex items-center justify-end gap-1">
              <span>${timeStr}</span>
              ${isAdmin ? '<i class="fa-solid fa-check text-[8px] text-emerald-400"></i>' : ''}
            </div>
          </div>
        </div>
      `;
      container.appendChild(msgDiv);
    });

    container.scrollTop = container.scrollHeight;
  } catch (err) {
    if (!isSilent) console.error('Error reloading thread messages:', err);
  }
}

async function handleSendAdminMessage(e) {
  if (e) e.preventDefault();
  if (!currentSelectedChatUserId) return;

  const input = document.getElementById('adminChatInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  const sendBtn = document.getElementById('adminChatSendBtn');
  if (sendBtn) sendBtn.disabled = true;

  try {
    const res = await fetch('/api/admin/chat/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentSelectedChatUserId, text })
    });
    const data = await res.json();
    if (data.success) {
      await reloadActiveThreadMessages();
      await loadAdminChatThreads(true);
    }
  } catch (err) {
    console.error('Error sending admin reply:', err);
  } finally {
    if (sendBtn) sendBtn.disabled = false;
  }
}

function startAdminChatPolling() {
  if (adminChatPollingInterval) clearInterval(adminChatPollingInterval);
  adminChatPollingInterval = setInterval(() => {
    loadAdminChatThreads(true);
  }, 4000); // Check every 4 seconds for live user messages
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

async function adminLogout() {
  await fetch('/api/auth/logout');
  window.location.href = '/login.html?admin=true';
}

// Start Admin Controller
initAdmin();
