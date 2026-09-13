const express = require('express');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// Setup directories
const uploadsDir = path.join(__dirname, 'uploads');
const screenshotsDir = path.join(uploadsDir, 'screenshots');
const qrDir = path.join(uploadsDir, 'qr');

[uploadsDir, screenshotsDir, qrDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Configure Multer for Screenshots
const screenshotStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, screenshotsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const uniqueName = 'shot_' + Date.now() + '_' + Math.floor(Math.random() * 10000) + ext;
    cb(null, uniqueName);
  }
});

// Configure Multer for Admin QR Code Upload
const qrStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, qrDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    const uniqueName = 'admin_qr_' + Date.now() + ext;
    cb(null, uniqueName);
  }
});

const uploadScreenshot = multer({
  storage: screenshotStorage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

const uploadQr = multer({
  storage: qrStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'map_earning_portal_secret_key_2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 7 days
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(uploadsDir));

function requireUserAuth(req, res, next) {
  if (req.session && req.session.userId) {
    const user = db.getUserById(req.session.userId);
    if (user) {
      if (user.status === 'deactivated') {
        req.session.userId = null;
        return res.status(403).json({
          success: false,
          message: 'Aapka account admin dwara deactivate/block kar diya gaya hai. Kripya admin se sampark karein.'
        });
      }
      req.user = user;
      return next();
    }
  }
  return res.status(401).json({ success: false, message: 'Please login to continue' });
}

function requireAdminAuth(req, res, next) {
  if (req.session && req.session.isAdmin) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Admin authentication required' });
}

// -------------------------------------------------------------
// PUBLIC API
// -------------------------------------------------------------
app.get('/api/public/settings', (req, res) => {
  const settings = db.getSettings();
  res.json({
    success: true,
    data: {
      upiId: settings.upiId,
      upiName: settings.upiName,
      qrImage: settings.qrImage || '/uploads/qr/default_qr.svg',
      minWithdrawal: settings.minWithdrawal || 500,
      dailyTaskReward: settings.dailyTaskReward || 100,
      dailyYoutubeReward: settings.dailyYoutubeReward || 50,
      popupVideoUrl: settings.popupVideoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      popupAdTimer: settings.popupAdTimer !== undefined ? settings.popupAdTimer : 30,
      popupAdEnabled: settings.popupAdEnabled !== undefined ? settings.popupAdEnabled : true,
      enableMapService: settings.enableMapService !== undefined ? settings.enableMapService : true,
      enableYoutubeService: settings.enableYoutubeService !== undefined ? settings.enableYoutubeService : true,
      enableVideoWatchService: settings.enableVideoWatchService !== undefined ? settings.enableVideoWatchService : true,
      videoLikeCommentBonusCoins: settings.videoLikeCommentBonusCoins !== undefined ? settings.videoLikeCommentBonusCoins : 2,
      plans: settings.plans
    }
  });
});

// -------------------------------------------------------------
// AUTH API
// -------------------------------------------------------------
app.post('/api/auth/validate-coupon', (req, res) => {
  const { code, planId } = req.body;
  if (!code || !code.trim()) {
    return res.status(400).json({ success: false, message: 'Kripya coupon code enter karein.' });
  }

  const coupon = db.getCouponByCode(code);
  if (!coupon || !coupon.active) {
    return res.status(400).json({ success: false, message: 'Yeh Coupon Code invalid ya expire ho chuka hai.' });
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return res.status(400).json({ success: false, message: 'Yeh coupon code ki limit khatam ho chuki hai.' });
  }

  const settings = db.getSettings();
  const plan = settings.plans.find(p => p.id === String(planId)) || settings.plans[0];
  let finalPrice = plan.price;
  let discountAmount = 0;

  if (coupon.discountType === 'free') {
    discountAmount = plan.price;
    finalPrice = 0;
  } else if (coupon.discountType === 'flat') {
    discountAmount = Math.min(plan.price, Number(coupon.discountValue) || 0);
    finalPrice = Math.max(0, plan.price - discountAmount);
  } else if (coupon.discountType === 'percent') {
    discountAmount = Math.round((plan.price * (Number(coupon.discountValue) || 0)) / 100);
    finalPrice = Math.max(0, plan.price - discountAmount);
  }

  return res.json({
    success: true,
    message: coupon.discountType === 'free' 
      ? '🎉 Badhai ho! 100% Free Coupon Apply Ho Gaya! Koi payment nahi karni hai.' 
      : `🎉 Coupon code apply ho gaya! ₹${discountAmount} ki chhut mili.`,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
      originalPrice: plan.price,
      finalPrice,
      isFree: finalPrice === 0
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { fullName, mobile, city, password, utr, upiId, planId, referralCode, couponCode } = req.body;

  if (!fullName || !mobile || !city || !password || !planId) {
    return res.status(400).json({ success: false, message: 'All mandatory fields must be filled.' });
  }

  // Validate coupon if provided
  let validCoupon = null;
  let isFreeRegistration = false;

  if (couponCode && couponCode.trim()) {
    const coupon = db.getCouponByCode(couponCode.trim());
    if (coupon && coupon.active && (!coupon.maxUses || coupon.usedCount < coupon.maxUses)) {
      validCoupon = coupon;
      if (coupon.discountType === 'free') {
        isFreeRegistration = true;
      }
    }
  }

  // If not 100% free coupon, UTR is required
  if (!isFreeRegistration && !utr) {
    return res.status(400).json({ success: false, message: 'Please enter 12-digit UTR number or apply a valid 100% Free coupon.' });
  }

  // Check if mobile already exists
  const existing = db.getUserByMobile(mobile.trim());
  if (existing) {
    return res.status(400).json({ success: false, message: 'This mobile number is already registered. Please login.' });
  }

  const newUser = db.createUser({
    fullName: fullName.trim(),
    mobile: mobile.trim(),
    city: city.trim(),
    password: password.trim(),
    utr: utr ? utr.trim() : (validCoupon ? `COUPON_${validCoupon.code}` : ''),
    upiId: upiId ? upiId.trim() : '',
    planId: planId,
    referredByCode: referralCode ? referralCode.trim() : '',
    autoApprove: isFreeRegistration,
    couponApplied: validCoupon ? validCoupon.code : null
  });

  if (validCoupon) {
    db.useCoupon(validCoupon.code);
  }

  // Automatically start user session
  req.session.userId = newUser.id;

  const successMessage = isFreeRegistration
    ? '🎉 Badhai ho! Free Coupon se aapka account INSTANT ACTIVATE ho gaya hai! Earning shuru karein.'
    : 'Registration successful! Your account is submitted for Admin verification.';

  res.json({
    success: true,
    message: successMessage,
    isFree: isFreeRegistration,
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      mobile: newUser.mobile,
      status: newUser.status,
      planName: newUser.planName,
      referralCode: newUser.referralCode
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(400).json({ success: false, message: 'Mobile and Password are required' });
  }

  const user = db.getUserByMobile(mobile.trim());
  if (!user || user.password !== password.trim()) {
    return res.status(401).json({ success: false, message: 'Invalid Mobile Number or Password' });
  }

  if (user.status === 'deactivated') {
    return res.status(403).json({
      success: false,
      message: 'Aapka account admin dwara deactivate/block kar diya gaya hai. Kripya admin se sampark karein.'
    });
  }

  req.session.userId = user.id;

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      fullName: user.fullName,
      mobile: user.mobile,
      status: user.status,
      planName: user.planName,
      walletCoins: user.walletCoins || 0
    }
  });
});

app.post('/api/auth/admin-login', (req, res) => {
  const { adminId, password } = req.body;
  const settings = db.getSettings();

  if (adminId === (settings.adminId || 'ADMIN') && password === (settings.adminPassword || 'Password')) {
    req.session.isAdmin = true;
    return res.json({ success: true, message: 'Admin login successful' });
  }

  return res.status(401).json({ success: false, message: 'Invalid Admin Credentials' });
});

app.get('/api/auth/check-session', (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.json({ success: true, role: 'admin' });
  }
  if (req.session && req.session.userId) {
    const user = db.getUserById(req.session.userId);
    if (user) {
      return res.json({ success: true, role: 'user', user });
    }
  }
  res.json({ success: false, role: 'guest' });
});

app.get('/api/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// -------------------------------------------------------------
// USER API
// -------------------------------------------------------------
app.get('/api/user/profile', requireUserAuth, (req, res) => {
  const user = db.getUserById(req.user.id);
  res.json({ success: true, user });
});

app.get('/api/user/tasks/today', requireUserAuth, (req, res) => {
  const user = db.getUserById(req.user.id);

  if (user.status === 'pending') {
    return res.json({
      success: true,
      accountStatus: 'pending',
      message: 'Aapka account admin verification ke liye pending hai. Payment verify hote hi tasks shuru ho jayenge.'
    });
  }

  if (user.status === 'rejected') {
    return res.json({
      success: true,
      accountStatus: 'rejected',
      message: `Account reject kar diya gaya hai: ${user.rejectionReason || 'Invalid UTR'}`
    });
  }

  if (user.status === 'deactivated') {
    return res.json({
      success: true,
      accountStatus: 'deactivated',
      message: user.deactivatedReason || 'Aapka account admin dwara deactivate/block kar diya gaya hai. Kripya admin se sampark karein.'
    });
  }

  // Check plan expiration
  if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date()) {
    return res.json({
      success: true,
      accountStatus: 'expired',
      message: 'Aapka plan expire ho chuka hai. Kripya naya plan activate karein.'
    });
  }

  const task = db.getUserDailyTask(user.id);
  if (!task) {
    return res.status(500).json({ success: false, message: 'Unable to generate daily tasks. Please contact admin.' });
  }

  res.json({
    success: true,
    accountStatus: 'active',
    task,
    user: {
      walletCoins: user.walletCoins || 0,
      planExpiresAt: user.planExpiresAt,
      planName: user.planName
    }
  });
});

// Upload screenshot for individual task link
app.post('/api/user/tasks/upload', requireUserAuth, uploadScreenshot.single('screenshot'), (req, res) => {
  const { taskId, taskIndex } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a screenshot image' });
  }

  if (!taskId || !taskIndex) {
    return res.status(400).json({ success: false, message: 'Missing taskId or taskIndex' });
  }

  const screenshotPath = '/uploads/screenshots/' + req.file.filename;
  const updatedTask = db.updateTaskScreenshot(taskId, taskIndex, screenshotPath);

  if (!updatedTask) {
    return res.status(404).json({ success: false, message: 'Task item not found' });
  }

  res.json({
    success: true,
    message: `Review #${taskIndex} screenshot uploaded successfully!`,
    screenshotUrl: screenshotPath,
    task: updatedTask
  });
});

// Final daily task submit
app.post('/api/user/tasks/submit', requireUserAuth, (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ success: false, message: 'Task ID is required' });
  }

  const result = db.submitDailyTask(taskId);
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }

  res.json({
    success: true,
    message: '10 Reviews successfully submitted! Admin verification ke baad ₹100 aapke wallet me jud jayenge.',
    task: result
  });
});

// -------------------------------------------------------------
// USER YOUTUBE TASKS API (₹50 Coins / Day)
// -------------------------------------------------------------
app.get('/api/user/youtube-tasks/today', requireUserAuth, (req, res) => {
  const user = db.getUserById(req.user.id);

  if (user.status === 'pending') {
    return res.json({ success: true, accountStatus: 'pending', message: 'Account pending admin approval.' });
  }
  if (user.status === 'rejected') {
    return res.json({ success: true, accountStatus: 'rejected', message: `Account rejected: ${user.rejectionReason}` });
  }
  if (user.status === 'deactivated') {
    return res.json({ success: true, accountStatus: 'deactivated', message: user.deactivatedReason || 'Aapka account admin dwara deactivate kar diya gaya hai.' });
  }
  if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date()) {
    return res.json({ success: true, accountStatus: 'expired', message: 'Plan expired.' });
  }

  const task = db.getUserDailyYoutubeTask(user.id);
  if (!task) {
    return res.status(500).json({ success: false, message: 'Unable to generate daily YouTube tasks.' });
  }

  res.json({
    success: true,
    accountStatus: 'active',
    task,
    user: {
      walletCoins: user.walletCoins || 0
    }
  });
});

app.post('/api/user/youtube-tasks/upload', requireUserAuth, uploadScreenshot.single('screenshot'), (req, res) => {
  const { taskId, taskIndex } = req.body;

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload a screenshot proof' });
  }
  if (!taskId || !taskIndex) {
    return res.status(400).json({ success: false, message: 'Missing taskId or taskIndex' });
  }

  const screenshotPath = '/uploads/screenshots/' + req.file.filename;
  const updatedTask = db.updateYoutubeTaskScreenshot(taskId, taskIndex, screenshotPath);

  if (!updatedTask) {
    return res.status(404).json({ success: false, message: 'YouTube task item not found' });
  }

  res.json({
    success: true,
    message: `YouTube Channel #${taskIndex} Subscribe proof uploaded!`,
    screenshotUrl: screenshotPath,
    task: updatedTask
  });
});

app.post('/api/user/youtube-tasks/submit', requireUserAuth, (req, res) => {
  const { taskId } = req.body;
  if (!taskId) {
    return res.status(400).json({ success: false, message: 'Task ID is required' });
  }

  const result = db.submitDailyYoutubeTask(taskId);
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }

  res.json({
    success: true,
    message: '10 YouTube Channels Subscribe proofs submitted! Admin verification ke baad ₹50 coins wallet me credit honge.',
    task: result
  });
});

// User Withdrawals
app.get('/api/user/withdrawals', requireUserAuth, (req, res) => {
  const withdrawals = db.getUserWithdrawals(req.user.id);
  res.json({ success: true, withdrawals });
});

app.post('/api/user/withdrawals/request', requireUserAuth, (req, res) => {
  const { amount } = req.body;
  const numAmount = parseInt(amount, 10);

  if (!numAmount || isNaN(numAmount)) {
    return res.status(400).json({ success: false, message: 'Please enter a valid coin amount' });
  }

  const result = db.createWithdrawal(req.user.id, numAmount);
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }

  res.json({
    success: true,
    message: `Withdrawal request of ₹${numAmount} submitted successfully! Admin will transfer to ${result.upiId}.`,
    withdrawal: result
  });
});

// User Video Watch & Earn (4 Min = 10 Coins)
app.get('/api/user/watch-tasks/today', requireUserAuth, (req, res) => {
  const user = db.getUserById(req.user.id);
  if (user.status === 'pending') {
    return res.json({ success: true, accountStatus: 'pending', message: 'Aapka account admin verification ke liye pending hai.' });
  }
  if (user.status === 'rejected') {
    return res.json({ success: true, accountStatus: 'rejected', message: `Account reject ho gaya: ${user.rejectionReason}` });
  }
  if (user.status === 'deactivated') {
    return res.json({ success: true, accountStatus: 'deactivated', message: user.deactivatedReason || 'Account deactivated' });
  }
  if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date()) {
    return res.json({ success: true, accountStatus: 'expired', message: 'Aapka plan expire ho chuka hai.' });
  }

  const task = db.getUserDailyWatchTask(user.id);
  if (!task) {
    return res.status(500).json({ success: false, message: 'Unable to load watch tasks.' });
  }

  res.json({
    success: true,
    accountStatus: 'active',
    task,
    user: {
      walletCoins: user.walletCoins || 0
    }
  });
});

app.post('/api/user/watch-tasks/claim', requireUserAuth, (req, res) => {
  const { taskId, taskIndex, watchTimeSeconds, likedAndCommented } = req.body;
  if (!taskId || !taskIndex || watchTimeSeconds === undefined) {
    return res.status(400).json({ success: false, message: 'taskId, taskIndex, and watchTimeSeconds are required' });
  }

  const result = db.claimWatchVideoReward(req.user.id, taskId, taskIndex, watchTimeSeconds, Boolean(likedAndCommented));
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error, alreadyCompleted: result.alreadyCompleted });
  }

  res.json(result);
});

// User Referrals
app.get('/api/user/referrals', requireUserAuth, (req, res) => {
  const refData = db.getUserReferrals(req.user.id);
  res.json({ success: true, ...refData });
});

// User Chat API
app.get('/api/user/chat/messages', requireUserAuth, (req, res) => {
  const messages = db.getUserMessages(req.user.id);
  db.markMessagesReadByUser(req.user.id);
  res.json({ success: true, messages });
});

app.post('/api/user/chat/send', requireUserAuth, (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Message text is required' });
  }

  const msg = db.addMessage(req.user.id, 'user', text);
  res.json({ success: true, message: 'Message sent', chatMessage: msg });
});

// Public / Website Visitor Live Chat API
app.get('/api/public/chat/messages', (req, res) => {
  const visitorId = req.query.visitorId;
  if (!visitorId) return res.json({ success: true, messages: [] });
  const messages = db.getUserMessages(visitorId);
  db.markMessagesReadByUser(visitorId);
  res.json({ success: true, messages });
});

app.post('/api/public/chat/send', (req, res) => {
  const { visitorId, text, name, mobile } = req.body;
  if (!visitorId || !text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'Visitor ID and message text are required' });
  }

  const msg = db.addMessage(visitorId, 'user', text, name || 'Website Visitor', mobile || '');
  res.json({ success: true, message: 'Message sent', chatMessage: msg });
});

// -------------------------------------------------------------
// ADMIN API
// -------------------------------------------------------------
// Admin Live Chat API
app.get('/api/admin/chat/threads', requireAdminAuth, (req, res) => {
  const threads = db.getAdminChatThreads();
  res.json({ success: true, threads });
});

app.get('/api/admin/chat/messages/:userId', requireAdminAuth, (req, res) => {
  const { userId } = req.params;
  const messages = db.getUserMessages(userId);
  db.markMessagesReadByAdmin(userId);
  const user = db.getUserById(userId);
  res.json({ success: true, user, messages });
});

app.post('/api/admin/chat/send', requireAdminAuth, (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text || !text.trim()) {
    return res.status(400).json({ success: false, message: 'UserId and message text are required' });
  }

  const msg = db.addMessage(userId, 'admin', text);
  res.json({ success: true, message: 'Reply sent', chatMessage: msg });
});
app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
  const users = db.getUsers();
  const tasks = db.getAllTasks();
  const ytTasks = db.getAllYoutubeTasks();
  const withdrawals = db.getWithdrawals();
  const links = db.getLinks();
  const ytLinks = db.getYoutubeLinks();

  const pendingUsers = users.filter(u => u.status === 'pending').length;
  const approvedUsers = users.filter(u => u.status === 'approved').length;
  const pendingTasks = tasks.filter(t => t.status === 'submitted').length;
  const pendingYtTasks = ytTasks.filter(t => t.status === 'submitted').length;
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;
  const totalPaid = withdrawals.filter(w => w.status === 'approved').reduce((acc, w) => acc + (w.amount || 0), 0);

  res.json({
    success: true,
    stats: {
      totalUsers: users.length,
      pendingUsers,
      approvedUsers,
      pendingTasks,
      pendingYtTasks,
      pendingWithdrawals,
      totalPaid,
      totalLinks: links.length,
      activeLinks: links.filter(l => l.active).length,
      totalYtLinks: ytLinks.length,
      activeYtLinks: ytLinks.filter(l => l.active).length
    }
  });
});

// Users management
app.get('/api/admin/users', requireAdminAuth, (req, res) => {
  const users = db.getUsers();
  res.json({ success: true, users });
});

app.post('/api/admin/users/approve', requireAdminAuth, (req, res) => {
  const { userId } = req.body;
  const user = db.approveUser(userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: `User ${user.fullName} approved and plan activated!`, user });
});

app.post('/api/admin/users/reject', requireAdminAuth, (req, res) => {
  const { userId, reason } = req.body;
  const user = db.rejectUser(userId, reason);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: `User ${user.fullName} rejected.`, user });
});

app.post('/api/admin/users/deactivate', requireAdminAuth, (req, res) => {
  const { userId, reason } = req.body;
  const user = db.deactivateUser(userId, reason);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: `User ${user.fullName} has been deactivated/blocked.`, user });
});

app.post('/api/admin/users/activate', requireAdminAuth, (req, res) => {
  const { userId } = req.body;
  const user = db.activateUser(userId);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: `User ${user.fullName} has been reactivated/unblocked!`, user });
});

// Map Tasks management
app.get('/api/admin/tasks', requireAdminAuth, (req, res) => {
  const tasks = db.getAllTasks();
  res.json({ success: true, tasks });
});

app.post('/api/admin/tasks/approve', requireAdminAuth, (req, res) => {
  const { taskId } = req.body;
  const task = db.approveDailyTask(taskId);
  if (!task || task.error) {
    return res.status(400).json({ success: false, message: task ? task.error : 'Task not found' });
  }
  res.json({ success: true, message: `Map tasks approved! ₹100 credited to ${task.userName}'s wallet.`, task });
});

app.post('/api/admin/tasks/reject', requireAdminAuth, (req, res) => {
  const { taskId, reason } = req.body;
  const task = db.rejectDailyTask(taskId, reason);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, message: `Map tasks rejected for ${task.userName}.`, task });
});

// YouTube Tasks management (₹50 Coins)
app.get('/api/admin/youtube-tasks', requireAdminAuth, (req, res) => {
  const tasks = db.getAllYoutubeTasks();
  res.json({ success: true, tasks });
});

app.post('/api/admin/youtube-tasks/approve', requireAdminAuth, (req, res) => {
  const { taskId } = req.body;
  const task = db.approveDailyYoutubeTask(taskId);
  if (!task || task.error) {
    return res.status(400).json({ success: false, message: task ? task.error : 'YouTube task not found' });
  }
  res.json({ success: true, message: `YouTube tasks approved! ₹50 credited to ${task.userName}'s wallet.`, task });
});

app.post('/api/admin/youtube-tasks/reject', requireAdminAuth, (req, res) => {
  const { taskId, reason } = req.body;
  const task = db.rejectDailyYoutubeTask(taskId, reason);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, message: `YouTube tasks rejected for ${task.userName}.`, task });
});

// Withdrawals management
app.get('/api/admin/withdrawals', requireAdminAuth, (req, res) => {
  const withdrawals = db.getWithdrawals();
  res.json({ success: true, withdrawals });
});

app.post('/api/admin/withdrawals/approve', requireAdminAuth, (req, res) => {
  const { withdrawalId, payoutUtr, note } = req.body;
  const w = db.approveWithdrawal(withdrawalId, payoutUtr, note);
  if (!w) return res.status(404).json({ success: false, message: 'Withdrawal not found' });
  res.json({ success: true, message: `Withdrawal of ₹${w.amount} approved & marked as Paid!`, withdrawal: w });
});

app.post('/api/admin/withdrawals/reject', requireAdminAuth, (req, res) => {
  const { withdrawalId, reason } = req.body;
  const w = db.rejectWithdrawal(withdrawalId, reason);
  if (!w) return res.status(404).json({ success: false, message: 'Withdrawal not found' });
  res.json({ success: true, message: `Withdrawal rejected and ${w.amount} coins refunded to user.`, withdrawal: w });
});

// Map Links Pool management
app.get('/api/admin/links', requireAdminAuth, (req, res) => {
  const links = db.getLinks();
  res.json({ success: true, links });
});

app.post('/api/admin/links/add', requireAdminAuth, (req, res) => {
  const { businessName, mapUrl } = req.body;
  if (!businessName || !mapUrl) {
    return res.status(400).json({ success: false, message: 'Business Name and Google Map URL are required' });
  }
  const link = db.addLink(businessName, mapUrl);
  res.json({ success: true, message: 'Google Map link added to rotation pool!', link });
});

app.post('/api/admin/links/delete', requireAdminAuth, (req, res) => {
  const { linkId } = req.body;
  const ok = db.deleteLink(linkId);
  if (!ok) return res.status(404).json({ success: false, message: 'Link not found' });
  res.json({ success: true, message: 'Link deleted from pool' });
});

app.post('/api/admin/links/toggle', requireAdminAuth, (req, res) => {
  const { linkId } = req.body;
  const link = db.toggleLink(linkId);
  if (!link) return res.status(404).json({ success: false, message: 'Link not found' });
  res.json({ success: true, message: `Link ${link.active ? 'Activated' : 'Deactivated'}`, link });
});

// YouTube Links Pool management
app.get('/api/admin/youtube-links', requireAdminAuth, (req, res) => {
  const links = db.getYoutubeLinks();
  res.json({ success: true, links });
});

app.post('/api/admin/youtube-links/add', requireAdminAuth, (req, res) => {
  const { channelName, channelUrl } = req.body;
  if (!channelName || !channelUrl) {
    return res.status(400).json({ success: false, message: 'Channel Name and YouTube URL are required' });
  }
  const link = db.addYoutubeLink(channelName, channelUrl);
  res.json({ success: true, message: 'YouTube channel added to rotation pool!', link });
});

app.post('/api/admin/youtube-links/delete', requireAdminAuth, (req, res) => {
  const { linkId } = req.body;
  const ok = db.deleteYoutubeLink(linkId);
  if (!ok) return res.status(404).json({ success: false, message: 'YouTube channel not found' });
  res.json({ success: true, message: 'YouTube channel deleted from pool' });
});

app.post('/api/admin/youtube-links/toggle', requireAdminAuth, (req, res) => {
  const { linkId } = req.body;
  const link = db.toggleYoutubeLink(linkId);
  if (!link) return res.status(404).json({ success: false, message: 'YouTube channel not found' });
  res.json({ success: true, message: `YouTube channel ${link.active ? 'Activated' : 'Deactivated'}`, link });
});

// Watch Videos Pool Management (4 Min Watch = 10 Coins)
app.get('/api/admin/watch-videos', requireAdminAuth, (req, res) => {
  const videos = db.getWatchVideos();
  res.json({ success: true, videos });
});

app.post('/api/admin/watch-videos/add', requireAdminAuth, (req, res) => {
  const { title, videoUrl, durationSeconds, rewardPerVideo } = req.body;
  if (!title || !videoUrl) {
    return res.status(400).json({ success: false, message: 'Video Title and YouTube Video URL are required' });
  }
  const video = db.addWatchVideo(title, videoUrl, durationSeconds || 240, rewardPerVideo || 10);
  res.json({ success: true, message: 'Watch Video added to rotation pool!', video });
});

app.post('/api/admin/watch-videos/delete', requireAdminAuth, (req, res) => {
  const { videoId } = req.body;
  const ok = db.deleteWatchVideo(videoId);
  if (!ok) return res.status(404).json({ success: false, message: 'Video not found' });
  res.json({ success: true, message: 'Watch Video deleted from pool' });
});

app.post('/api/admin/watch-videos/toggle', requireAdminAuth, (req, res) => {
  const { videoId } = req.body;
  const video = db.toggleWatchVideo(videoId);
  if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
  res.json({ success: true, message: `Video ${video.active ? 'Activated' : 'Deactivated'}`, video });
});

// Coupon Management API
app.get('/api/admin/coupons', requireAdminAuth, (req, res) => {
  const coupons = db.getCoupons();
  res.json({ success: true, coupons });
});

app.post('/api/admin/coupons/create', requireAdminAuth, (req, res) => {
  const { code, discountType, discountValue, maxUses } = req.body;
  if (!code || !code.trim()) {
    return res.status(400).json({ success: false, message: 'Coupon code is required' });
  }
  const result = db.createCoupon({ code, discountType, discountValue, maxUses });
  if (result.error) {
    return res.status(400).json({ success: false, message: result.error });
  }
  res.json({ success: true, message: `Coupon "${result.code}" successfully ban gaya!`, coupon: result });
});

app.post('/api/admin/coupons/toggle', requireAdminAuth, (req, res) => {
  const { couponId } = req.body;
  const coupon = db.toggleCoupon(couponId);
  if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
  res.json({ success: true, message: `Coupon ${coupon.code} is now ${coupon.active ? 'Active' : 'Inactive'}`, coupon });
});

app.post('/api/admin/coupons/delete', requireAdminAuth, (req, res) => {
  const { couponId } = req.body;
  const ok = db.deleteCoupon(couponId);
  if (!ok) return res.status(404).json({ success: false, message: 'Coupon not found' });
  res.json({ success: true, message: 'Coupon deleted successfully' });
});

// Settings & QR Code Upload
app.get('/api/admin/settings', requireAdminAuth, (req, res) => {
  const settings = db.getSettings();
  res.json({ success: true, settings });
});

app.post('/api/admin/settings/update', requireAdminAuth, (req, res) => {
  const { 
    upiId, upiName, adminPassword, minWithdrawal, dailyTaskReward, dailyYoutubeReward, 
    popupVideoUrl, popupAdTimer, popupAdEnabled,
    enableMapService, enableYoutubeService, enableVideoWatchService, videoLikeCommentBonusCoins
  } = req.body;

  const updates = {};
  if (upiId) updates.upiId = upiId.trim();
  if (upiName) updates.upiName = upiName.trim();
  if (adminPassword) updates.adminPassword = adminPassword.trim();
  if (minWithdrawal !== undefined && minWithdrawal !== '') updates.minWithdrawal = Number(minWithdrawal);
  if (dailyTaskReward !== undefined && dailyTaskReward !== '') updates.dailyTaskReward = Number(dailyTaskReward);
  if (dailyYoutubeReward !== undefined && dailyYoutubeReward !== '') updates.dailyYoutubeReward = Number(dailyYoutubeReward);
  if (popupVideoUrl !== undefined) updates.popupVideoUrl = popupVideoUrl.trim();
  if (popupAdTimer !== undefined && popupAdTimer !== '') updates.popupAdTimer = Math.max(5, Number(popupAdTimer));
  if (popupAdEnabled !== undefined) updates.popupAdEnabled = Boolean(popupAdEnabled);

  if (enableMapService !== undefined) updates.enableMapService = Boolean(enableMapService);
  if (enableYoutubeService !== undefined) updates.enableYoutubeService = Boolean(enableYoutubeService);
  if (enableVideoWatchService !== undefined) updates.enableVideoWatchService = Boolean(enableVideoWatchService);
  if (videoLikeCommentBonusCoins !== undefined && videoLikeCommentBonusCoins !== '') updates.videoLikeCommentBonusCoins = Number(videoLikeCommentBonusCoins);

  const updated = db.updateSettings(updates);
  res.json({ success: true, message: 'Settings updated successfully', settings: updated });
});

app.post('/api/admin/settings/upload-qr', requireAdminAuth, uploadQr.single('qrImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please select a QR code image to upload' });
  }

  const qrPath = '/uploads/qr/' + req.file.filename;
  const updated = db.updateSettings({ qrImage: qrPath });

  res.json({
    success: true,
    message: 'Admin QR Code uploaded & updated on registration page successfully!',
    qrImage: qrPath,
    settings: updated
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`Google Map Review Earning Portal running on port ${PORT}`);
  console.log(`User portal: http://localhost:${PORT}`);
  console.log(`Admin portal: http://localhost:${PORT}/admin.html`);
  console.log(`Admin ID: ADMIN | Password: Password`);
  console.log(`====================================================`);
});
