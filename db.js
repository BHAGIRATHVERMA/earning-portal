const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const SCREENSHOTS_DIR = path.join(__dirname, 'uploads', 'screenshots');
const QR_DIR = path.join(__dirname, 'uploads', 'qr');

// Ensure directories exist
[DATA_DIR, UPLOADS_DIR, SCREENSHOTS_DIR, QR_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const DB_FILE = path.join(DATA_DIR, 'database.json');

// Default initial state
const defaultData = {
  users: [],
  links: [
    { id: 'lnk_1', businessName: 'Taj Hotel & Suites', mapUrl: 'https://maps.google.com/?q=Taj+Hotel+Mumbai', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_2', businessName: 'Royal Spice Restaurant', mapUrl: 'https://maps.google.com/?q=Royal+Spice+Restaurant+Delhi', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_3', businessName: 'Apex Healthcare Hospital', mapUrl: 'https://maps.google.com/?q=Apex+Hospital+Bangalore', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_4', businessName: 'Silver Star Automobile Service', mapUrl: 'https://maps.google.com/?q=Silver+Star+Auto+Pune', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_5', businessName: 'Elite Salon & Spa Lounge', mapUrl: 'https://maps.google.com/?q=Elite+Salon+Spa+Hyderabad', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_6', businessName: 'Crown Heights Resort & Club', mapUrl: 'https://maps.google.com/?q=Crown+Heights+Resort+Jaipur', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_7', businessName: 'Metro Digital Electronics Store', mapUrl: 'https://maps.google.com/?q=Metro+Electronics+Ahmedabad', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_8', businessName: 'The Grand Heritage Cafe', mapUrl: 'https://maps.google.com/?q=Grand+Heritage+Cafe+Kolkata', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_9', businessName: 'FitPro Gym & Fitness Center', mapUrl: 'https://maps.google.com/?q=FitPro+Gym+Chandigarh', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_10', businessName: 'Urban Trends Fashion Hub', mapUrl: 'https://maps.google.com/?q=Urban+Trends+Fashion+Lucknow', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_11', businessName: 'City Dental & Orthodontic Clinic', mapUrl: 'https://maps.google.com/?q=City+Dental+Clinic+Indore', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_12', businessName: 'Greenwood International Preschool', mapUrl: 'https://maps.google.com/?q=Greenwood+Preschool+Surat', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_13', businessName: 'Skyline Bakers & Confectionery', mapUrl: 'https://maps.google.com/?q=Skyline+Bakers+Bhopal', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_14', businessName: 'Infinity Tech Repair & Sales', mapUrl: 'https://maps.google.com/?q=Infinity+Tech+Repair+Nagpur', active: true, createdAt: new Date().toISOString() },
    { id: 'lnk_15', businessName: 'Blue Ocean Seafood Restaurant', mapUrl: 'https://maps.google.com/?q=Blue+Ocean+Restaurant+Goa', active: true, createdAt: new Date().toISOString() }
  ],
  youtubeLinks: [
    { id: 'yt_1', channelName: 'Tech Master India', channelUrl: 'https://www.youtube.com/@TechMasterIndia', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_2', channelName: 'Daily Indian Recipes', channelUrl: 'https://www.youtube.com/@DailyIndianRecipes', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_3', channelName: 'Fitness & Health Guru', channelUrl: 'https://www.youtube.com/@FitnessHealthGuru', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_4', channelName: 'Smart Money & Business Tips', channelUrl: 'https://www.youtube.com/@SmartMoneyTips', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_5', channelName: 'Explore India Vlogs', channelUrl: 'https://www.youtube.com/@ExploreIndiaVlogs', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_6', channelName: 'Gadget Reviews Hindi', channelUrl: 'https://www.youtube.com/@GadgetReviewsHindi', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_7', channelName: 'Motivation Ki Pathshala', channelUrl: 'https://www.youtube.com/@MotivationPathshala', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_8', channelName: 'Coding & Web Dev Hindi', channelUrl: 'https://www.youtube.com/@CodingWebDevHindi', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_9', channelName: 'Trending News & Facts', channelUrl: 'https://www.youtube.com/@TrendingNewsFacts', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_10', channelName: 'Comedy Club Hindi', channelUrl: 'https://www.youtube.com/@ComedyClubHindi', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_11', channelName: 'Beauty & Lifestyle Tips', channelUrl: 'https://www.youtube.com/@BeautyLifestyleTips', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_12', channelName: 'Kids Learning & Rhymes', channelUrl: 'https://www.youtube.com/@KidsLearningRhymes', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_13', channelName: 'Auto & Bike World', channelUrl: 'https://www.youtube.com/@AutoBikeWorld', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_14', channelName: 'Home Gardening & Plants', channelUrl: 'https://www.youtube.com/@HomeGardeningHindi', active: true, createdAt: new Date().toISOString() },
    { id: 'yt_15', channelName: 'Music Beats Official', channelUrl: 'https://www.youtube.com/@MusicBeatsOfficial', active: true, createdAt: new Date().toISOString() }
  ],
  tasks: [], // Map reviews
  youtubeTasks: [], // { id, userId, userName, userMobile, date, reward: 50, rewardClaimed: false, status: 'in_progress'|'submitted'|'approved'|'rejected', rejectionReason: '', items: [{ taskIndex, linkId, channelName, channelUrl, screenshot: '', status: 'pending'|'uploaded' }], submittedAt, reviewedAt }
  watchVideos: [
    { id: 'wv_mbl_1', title: 'MBL Foundation Official - Rural Education & Free Coaching Initiative', videoUrl: 'https://www.youtube.com/watch?v=rDFSGaxlaaA', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_2', title: 'MBL Foundation - Women Empowerment & Skill Development Program', videoUrl: 'https://www.youtube.com/watch?v=cRzrrMUht3I', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_3', title: 'MBL Foundation - Free Health Card & Medical Camp Project', videoUrl: 'https://www.youtube.com/watch?v=IxcEFWnczuY', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_4', title: 'MBL Foundation - Rural Teacher Honor & Salary Disbursement', videoUrl: 'https://www.youtube.com/watch?v=076Q3PixVmE', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_5', title: 'MBL Foundation - Youth Employment & Digital Training Center', videoUrl: 'https://www.youtube.com/watch?v=fIh0bxJlODk', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_6', title: 'MBL Foundation - Village Social Welfare & Development Drive', videoUrl: 'https://www.youtube.com/watch?v=84xu--GN8Qc', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_7', title: 'MBL Foundation - Educational Kit & Book Distribution Camp', videoUrl: 'https://www.youtube.com/watch?v=G0UCxmhxoHQ', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_8', title: 'MBL Foundation - Self Help Groups & Financial Assistance Scheme', videoUrl: 'https://www.youtube.com/watch?v=Do6Tdkk4cco', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_9', title: 'MBL Foundation - Annual Social Impact & Community Services', videoUrl: 'https://www.youtube.com/watch?v=RpJF6fuxHV0', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_10', title: 'MBL Foundation - Tree Plantation & Clean Village Campaign', videoUrl: 'https://www.youtube.com/watch?v=HGkF5Mey0lI', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_11', title: 'MBL Foundation - Free Digital Literacy for Rural Students', videoUrl: 'https://www.youtube.com/watch?v=kz8_iEbXG6k', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_12', title: 'MBL Foundation - Blanket & Winter Relief Distribution', videoUrl: 'https://www.youtube.com/watch?v=oUk2Uwy7h9U', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_13', title: 'MBL Foundation - Blood Donation & Health Awareness Camp', videoUrl: 'https://www.youtube.com/watch?v=QUGEW7Lgxig', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_14', title: 'MBL Foundation - Girl Child Higher Education Scholarship', videoUrl: 'https://www.youtube.com/watch?v=CM_HF9GRt2s', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_15', title: 'MBL Foundation - Sustainable Farming & Farmer Support Workshop', videoUrl: 'https://www.youtube.com/watch?v=syN4nxbHQv4', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_16', title: 'MBL Foundation - Sewing Machine & Tailoring Training Center', videoUrl: 'https://www.youtube.com/watch?v=5YJtPLPFg2U', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_17', title: 'MBL Foundation - Clean Drinking Water Project in Rural Areas', videoUrl: 'https://www.youtube.com/watch?v=pm3B3kmud7E', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_18', title: 'MBL Foundation - Youth Sports Meet & Physical Fitness Drive', videoUrl: 'https://www.youtube.com/watch?v=_IA-Zp2zJ7A', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_19', title: 'MBL Foundation - Eye Checkup & Free Specs Distribution Camp', videoUrl: 'https://www.youtube.com/watch?v=s7xzTMruZZg', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_20', title: 'MBL Foundation - Rural Library & Reading Room Inauguration', videoUrl: 'https://www.youtube.com/watch?v=ZfDre3LOjGI', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_21', title: 'MBL Foundation - Smart Classroom Setup for Rural Schools', videoUrl: 'https://www.youtube.com/watch?v=I37bWbbikTE', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_22', title: 'MBL Foundation - Sanitation & Hygiene Workshop for Women', videoUrl: 'https://www.youtube.com/watch?v=mEpvgMEIVEU', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_23', title: 'MBL Foundation - Handicraft & Cottage Industry Workshop', videoUrl: 'https://www.youtube.com/watch?v=4uW6qszp9Qg', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_24', title: 'MBL Foundation - Rural Youth Leadership Training Program', videoUrl: 'https://www.youtube.com/watch?v=CaTidkJkses', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_25', title: 'MBL Foundation - Nutrition Food Kit Distribution for Children', videoUrl: 'https://www.youtube.com/watch?v=PtmqCFpaHNw', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_26', title: 'MBL Foundation - Solar Light Installation in Villages', videoUrl: 'https://www.youtube.com/watch?v=eNzsuj-gxPA', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_27', title: 'MBL Foundation - Cultural Heritage & National Fest Celebration', videoUrl: 'https://www.youtube.com/watch?v=uuw0c4SD4s8', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_28', title: 'MBL Foundation - Legal Awareness & Rights Consultation Camp', videoUrl: 'https://www.youtube.com/watch?v=_KCGeWblthM', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_29', title: 'MBL Foundation - Disaster Relief & Emergency Aid Mission', videoUrl: 'https://www.youtube.com/watch?v=Q8_7AfdrFgo', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() },
    { id: 'wv_mbl_30', title: 'MBL Foundation - Journey of Social Change & Future Roadmap', videoUrl: 'https://www.youtube.com/watch?v=-1hIaCJ2g9o', durationSeconds: 240, rewardPerVideo: 10, active: true, createdAt: new Date().toISOString() }
  ],
  watchTasks: [], // { id, userId, userName, date, items: [{ taskIndex, videoId, title, videoUrl, durationSeconds: 240, reward: 10, watchSeconds: 0, completed: false, claimedAt: null }] }
  withdrawals: [],
  coupons: [
    { id: 'cpn_1', code: 'FREE100', discountType: 'free', discountValue: 100, maxUses: 1000, usedCount: 0, active: true, createdAt: new Date().toISOString() },
    { id: 'cpn_2', code: 'OFFER50', discountType: 'flat', discountValue: 50, maxUses: 1000, usedCount: 0, active: true, createdAt: new Date().toISOString() }
  ],
  settings: {
    adminId: 'ADMIN',
    adminPassword: 'Password',
    upiId: 'payment.official@upi',
    upiName: 'Google Review Rewards India',
    qrImage: '/uploads/qr/default_qr.png',
    minWithdrawal: 500,
    dailyTaskReward: 100,
    dailyYoutubeReward: 50,
    watchVideoDurationSeconds: 240, // 4 minutes
    watchVideoRewardCoins: 10, // 10 coins per video
    videoLikeCommentBonusCoins: 2, // 2 extra coins for like & comment
    enableMapService: true, // Master switch for Google Map Reviews
    enableYoutubeService: true, // Master switch for YouTube Subscribe
    enableVideoWatchService: true, // Master switch for Video Watch & Earn
    popupVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    popupAdTimer: 30,
    popupAdEnabled: true,
    taskLinksCount: 10,
    youtubeLinksCount: 10,
    plans: [
      { id: '69', price: 69, validityDays: 3, dailyReward: 100, dailyYoutubeReward: 50, name: 'Basic Plan (₹69)' },
      { id: '149', price: 149, validityDays: 7, dailyReward: 100, dailyYoutubeReward: 50, name: 'Standard Plan (₹149)' },
      { id: '499', price: 499, validityDays: 30, dailyReward: 100, dailyYoutubeReward: 50, name: 'VIP Plan (₹499)' }
    ]
  }
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.data = JSON.parse(JSON.stringify(defaultData));
      this.save();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
        // ensure all root keys exist
        for (let key in defaultData) {
          if (!this.data[key]) {
            this.data[key] = defaultData[key];
          }
        }
        // ensure new settings keys exist
        if (this.data.settings) {
          if (this.data.settings.enableMapService === undefined) this.data.settings.enableMapService = true;
          if (this.data.settings.enableYoutubeService === undefined) this.data.settings.enableYoutubeService = true;
          if (this.data.settings.enableVideoWatchService === undefined) this.data.settings.enableVideoWatchService = true;
          if (this.data.settings.videoLikeCommentBonusCoins === undefined) this.data.settings.videoLikeCommentBonusCoins = 2;
        }
        if (!this.data.coupons) {
          this.data.coupons = JSON.parse(JSON.stringify(defaultData.coupons));
        }
      } catch (err) {
        console.error('Error reading database, creating fresh:', err);
        this.data = JSON.parse(JSON.stringify(defaultData));
        this.save();
      }
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Database save failed:', err);
    }
  }

  // Settings
  getSettings() {
    return this.data.settings;
  }

  updateSettings(newSettings) {
    this.data.settings = { ...this.data.settings, ...newSettings };
    this.save();
    return this.data.settings;
  }

  // Coupons
  getCoupons() {
    if (!this.data.coupons) this.data.coupons = [];
    return this.data.coupons;
  }

  getCouponByCode(code) {
    if (!this.data.coupons || !code) return null;
    const clean = code.trim().toUpperCase();
    return this.data.coupons.find(c => c.code.toUpperCase() === clean) || null;
  }

  createCoupon({ code, discountType = 'free', discountValue = 100, maxUses = 1000 }) {
    if (!this.data.coupons) this.data.coupons = [];
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) return { error: 'Coupon code cannot be empty' };

    const existing = this.getCouponByCode(cleanCode);
    if (existing) return { error: 'Coupon code already exists' };

    const newCoupon = {
      id: 'cpn_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      code: cleanCode,
      discountType: discountType, // 'free' | 'flat' | 'percent'
      discountValue: Number(discountValue) || (discountType === 'free' ? 100 : 0),
      maxUses: Number(maxUses) || 1000,
      usedCount: 0,
      active: true,
      createdAt: new Date().toISOString()
    };
    this.data.coupons.unshift(newCoupon);
    this.save();
    return newCoupon;
  }

  toggleCoupon(id) {
    if (!this.data.coupons) return null;
    const coupon = this.data.coupons.find(c => c.id === id);
    if (coupon) {
      coupon.active = !coupon.active;
      this.save();
      return coupon;
    }
    return null;
  }

  deleteCoupon(id) {
    if (!this.data.coupons) return false;
    const idx = this.data.coupons.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.coupons.splice(idx, 1);
      this.save();
      return true;
    }
    return false;
  }

  useCoupon(code) {
    const coupon = this.getCouponByCode(code);
    if (coupon) {
      coupon.usedCount = (coupon.usedCount || 0) + 1;
      this.save();
    }
  }

  // Users
  getUsers() {
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByMobile(mobile) {
    return this.data.users.find(u => u.mobile === mobile);
  }

  getUserByReferralCode(code) {
    if (!code) return null;
    const cleanCode = code.trim().toUpperCase();
    return this.data.users.find(u => (u.referralCode || '').toUpperCase() === cleanCode);
  }

  generateReferralCode(fullName, mobile) {
    const namePrefix = (fullName || 'USER').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'REF';
    const mobileSuffix = (mobile || '').slice(-4) || Math.floor(1000 + Math.random() * 9000);
    return `${namePrefix}${mobileSuffix}`;
  }

  createUser(userData) {
    const plan = this.data.settings.plans.find(p => p.id === String(userData.planId)) || this.data.settings.plans[0];
    
    // Check if referral code is valid
    let referredByUser = null;
    if (userData.referredByCode) {
      referredByUser = this.getUserByReferralCode(userData.referredByCode);
    }

    const refCode = this.generateReferralCode(userData.fullName, userData.mobile);

    const isAutoApprove = Boolean(userData.autoApprove);
    const now = new Date();
    let planExpiry = null;
    if (isAutoApprove) {
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + (plan.validityDays || 3));
      planExpiry = expiry.toISOString();
    }

    const newUser = {
      id: 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      fullName: userData.fullName,
      mobile: userData.mobile,
      city: userData.city,
      password: userData.password,
      utr: userData.utr || (isAutoApprove ? 'COUPON_FREE' : ''),
      upiId: userData.upiId || 'Not Applicable',
      planId: plan.id,
      planPrice: plan.price,
      planName: plan.name,
      planValidityDays: plan.validityDays,
      status: isAutoApprove ? 'approved' : 'pending', // 'pending' | 'approved' | 'rejected'
      rejectionReason: '',
      walletCoins: 0,
      referralCode: refCode,
      referredBy: referredByUser ? referredByUser.id : null,
      referredByCode: referredByUser ? referredByUser.referralCode : null,
      referralRewardClaimed: false,
      referralsCount: 0,
      referralEarnings: 0,
      couponApplied: userData.couponApplied || null,
      createdAt: now.toISOString(),
      approvedAt: isAutoApprove ? now.toISOString() : null,
      planExpiresAt: planExpiry
    };
    this.data.users.unshift(newUser);
    this.save();
    return newUser;
  }

  approveUser(userId) {
    const user = this.getUserById(userId);
    if (!user) return null;

    user.status = 'approved';
    user.approvedAt = new Date().toISOString();
    
    // Calculate expiration date
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + (user.planValidityDays || 3));
    user.planExpiresAt = expiry.toISOString();

    // Reward Referrer if applicable and not already claimed
    if (user.referredBy && !user.referralRewardClaimed) {
      const referrer = this.getUserById(user.referredBy);
      if (referrer) {
        const referralBonus = this.data.settings.referralBonusCoins !== undefined ? this.data.settings.referralBonusCoins : 50;
        referrer.walletCoins = (referrer.walletCoins || 0) + referralBonus;
        referrer.referralsCount = (referrer.referralsCount || 0) + 1;
        referrer.referralEarnings = (referrer.referralEarnings || 0) + referralBonus;
        user.referralRewardClaimed = true;
      }
    }
    
    this.save();
    return user;
  }

  rejectUser(userId, reason = '') {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.status = 'rejected';
    user.rejectionReason = reason || 'Payment UTR verification failed';
    this.save();
    return user;
  }

  deactivateUser(userId, reason = '') {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.status = 'deactivated';
    user.deactivatedReason = reason || 'Account deactivated by administrator';
    user.deactivatedAt = new Date().toISOString();
    this.save();
    return user;
  }

  activateUser(userId) {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.status = 'approved';
    user.deactivatedReason = '';
    user.reactivatedAt = new Date().toISOString();
    this.save();
    return user;
  }

  updateUserCoins(userId, amount) {
    const user = this.getUserById(userId);
    if (!user) return null;
    user.walletCoins = Math.max(0, (user.walletCoins || 0) + amount);
    this.save();
    return user;
  }

  getUserReferrals(userId) {
    const user = this.getUserById(userId);
    if (!user) return { referralCode: '', count: 0, earnings: 0, referredUsers: [] };
    
    // Make sure user has referral code
    if (!user.referralCode) {
      user.referralCode = this.generateReferralCode(user.fullName, user.mobile);
      this.save();
    }

    const referredUsers = this.data.users
      .filter(u => u.referredBy === userId)
      .map(u => ({
        id: u.id,
        fullName: u.fullName,
        mobile: u.mobile ? u.mobile.slice(0, 3) + '****' + u.mobile.slice(-3) : '',
        status: u.status,
        planName: u.planName,
        createdAt: u.createdAt,
        rewardEarned: u.referralRewardClaimed ? 50 : 0
      }));

    return {
      referralCode: user.referralCode,
      referralBonusCoins: this.data.settings.referralBonusCoins || 50,
      count: user.referralsCount || referredUsers.filter(u => u.status === 'approved').length,
      earnings: user.referralEarnings || (referredUsers.filter(u => u.rewardEarned > 0).length * 50),
      referredUsers
    };
  }

  // -------------------------------------------------------------
  // LIVE CHAT SYSTEM
  // -------------------------------------------------------------
  getMessages() {
    if (!this.data.messages) {
      this.data.messages = [];
    }
    return this.data.messages;
  }

  addMessage(userId, sender, text) {
    if (!this.data.messages) this.data.messages = [];
    const user = this.getUserById(userId);
    const userName = user ? user.fullName : 'User';
    const userMobile = user ? user.mobile : '';

    const newMsg = {
      id: 'msg_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      userId,
      userName,
      userMobile,
      sender, // 'user' | 'admin'
      text: text.trim(),
      createdAt: new Date().toISOString(),
      readByAdmin: sender === 'admin',
      readByUser: sender === 'user'
    };

    this.data.messages.push(newMsg);
    this.save();
    return newMsg;
  }

  getUserMessages(userId) {
    if (!this.data.messages) this.data.messages = [];
    return this.data.messages.filter(m => m.userId === userId);
  }

  markMessagesReadByUser(userId) {
    if (!this.data.messages) return;
    let changed = false;
    this.data.messages.forEach(m => {
      if (m.userId === userId && !m.readByUser) {
        m.readByUser = true;
        changed = true;
      }
    });
    if (changed) this.save();
  }

  markMessagesReadByAdmin(userId) {
    if (!this.data.messages) return;
    let changed = false;
    this.data.messages.forEach(m => {
      if (m.userId === userId && !m.readByAdmin) {
        m.readByAdmin = true;
        changed = true;
      }
    });
    if (changed) this.save();
  }

  getAdminChatThreads() {
    if (!this.data.messages) this.data.messages = [];
    const threadsMap = {};

    this.data.messages.forEach(m => {
      if (!threadsMap[m.userId]) {
        const user = this.getUserById(m.userId);
        threadsMap[m.userId] = {
          userId: m.userId,
          userName: user ? user.fullName : (m.userName || 'User'),
          userMobile: user ? user.mobile : (m.userMobile || ''),
          userStatus: user ? user.status : 'unknown',
          planName: user ? user.planName : '',
          lastMessage: m.text,
          lastMessageTime: m.createdAt,
          lastSender: m.sender,
          unreadCount: 0
        };
      } else {
        // Update last message
        if (new Date(m.createdAt) > new Date(threadsMap[m.userId].lastMessageTime)) {
          threadsMap[m.userId].lastMessage = m.text;
          threadsMap[m.userId].lastMessageTime = m.createdAt;
          threadsMap[m.userId].lastSender = m.sender;
        }
      }

      if (!m.readByAdmin && m.sender === 'user') {
        threadsMap[m.userId].unreadCount += 1;
      }
    });

    return Object.values(threadsMap).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
  }

  // Google Map Links
  getLinks() {
    return this.data.links;
  }

  getActiveLinks() {
    return this.data.links.filter(l => l.active);
  }

  addLink(businessName, mapUrl) {
    const newLink = {
      id: 'lnk_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      businessName: businessName.trim(),
      mapUrl: mapUrl.trim(),
      active: true,
      createdAt: new Date().toISOString()
    };
    this.data.links.unshift(newLink);
    this.save();
    return newLink;
  }

  deleteLink(id) {
    const index = this.data.links.findIndex(l => l.id === id);
    if (index !== -1) {
      this.data.links.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  toggleLink(id) {
    const link = this.data.links.find(l => l.id === id);
    if (link) {
      link.active = !link.active;
      this.save();
      return link;
    }
    return null;
  }

  // Daily Tasks
  getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getUserDailyTask(userId, date = this.getTodayDateString()) {
    let task = this.data.tasks.find(t => t.userId === userId && t.date === date);
    if (!task) {
      // Create fresh 10 random links task for user
      const user = this.getUserById(userId);
      if (!user || user.status !== 'approved') return null;

      // Check if plan expired
      if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date()) {
        return { isExpired: true };
      }

      const activeLinks = this.getActiveLinks();
      if (activeLinks.length === 0) return null;

      // Pick 10 random links (or all if fewer than 10, duplicated if necessary)
      const shuffled = [...activeLinks].sort(() => 0.5 - Math.random());
      let selectedLinks = shuffled.slice(0, 10);
      if (selectedLinks.length < 10) {
        while (selectedLinks.length < 10) {
          selectedLinks.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
        }
      }

      task = {
        id: 'tsk_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        userId: user.id,
        userName: user.fullName,
        userMobile: user.mobile,
        date: date,
        reward: this.data.settings.dailyTaskReward || 100,
        status: 'in_progress', // 'in_progress' | 'submitted' | 'approved' | 'rejected'
        rewardClaimed: false,
        submittedAt: null,
        reviewedAt: null,
        rejectionReason: '',
        items: selectedLinks.map((lnk, index) => ({
          taskIndex: index + 1,
          linkId: lnk.id,
          businessName: lnk.businessName,
          mapUrl: lnk.mapUrl,
          screenshot: '',
          status: 'pending' // 'pending' | 'uploaded'
        }))
      };

      this.data.tasks.unshift(task);
      this.save();
    }
    return task;
  }

  updateTaskScreenshot(taskId, taskIndex, screenshotPath) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return null;

    const item = task.items.find(i => i.taskIndex === Number(taskIndex));
    if (item) {
      item.screenshot = screenshotPath;
      item.status = 'uploaded';
      this.save();
      return task;
    }
    return null;
  }

  submitDailyTask(taskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return null;

    // Check if all 10 items have screenshots
    const allUploaded = task.items.every(i => i.screenshot && i.screenshot.length > 0);
    if (!allUploaded) {
      return { error: 'Please upload screenshots for all 10 Google Map reviews before final submission.' };
    }

    task.status = 'submitted';
    task.submittedAt = new Date().toISOString();
    this.save();
    return task;
  }

  getPendingTasks() {
    return this.data.tasks.filter(t => t.status === 'submitted');
  }

  getAllTasks() {
    return this.data.tasks;
  }

  approveDailyTask(taskId) {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return null;
    if (task.status === 'approved') return { error: 'Task already approved' };

    task.status = 'approved';
    task.reviewedAt = new Date().toISOString();

    if (!task.rewardClaimed) {
      task.rewardClaimed = true;
      this.updateUserCoins(task.userId, task.reward || 100);
    }

    this.save();
    return task;
  }

  rejectDailyTask(taskId, reason = '') {
    const task = this.data.tasks.find(t => t.id === taskId);
    if (!task) return null;

    task.status = 'rejected';
    task.rejectionReason = reason || 'Some review screenshots were invalid or missing.';
    task.reviewedAt = new Date().toISOString();
    this.save();
    return task;
  }

  // Withdrawals
  getWithdrawals() {
    return this.data.withdrawals;
  }

  getUserWithdrawals(userId) {
    return this.data.withdrawals.filter(w => w.userId === userId);
  }

  createWithdrawal(userId, amount) {
    const user = this.getUserById(userId);
    if (!user) return { error: 'User not found' };

    const minAmount = this.data.settings.minWithdrawal || 500;
    if (amount < minAmount) {
      return { error: `Minimum withdrawal amount is ${minAmount} Coins (₹${minAmount}).` };
    }

    if ((user.walletCoins || 0) < amount) {
      return { error: `Insufficient wallet balance! Current balance: ${user.walletCoins} Coins.` };
    }

    // Deduct coins from user balance immediately upon request
    user.walletCoins -= amount;

    const withdrawal = {
      id: 'wdr_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      userId: user.id,
      userName: user.fullName,
      userMobile: user.mobile,
      upiId: user.upiId,
      amount: amount,
      inrAmount: amount, // 1 coin = 1 rupee
      status: 'pending', // 'pending' | 'approved' | 'rejected'
      payoutUtr: '',
      note: '',
      requestedAt: new Date().toISOString(),
      processedAt: null
    };

    this.data.withdrawals.unshift(withdrawal);
    this.save();
    return withdrawal;
  }

  approveWithdrawal(withdrawalId, payoutUtr = '', note = '') {
    const w = this.data.withdrawals.find(x => x.id === withdrawalId);
    if (!w) return null;

    w.status = 'approved';
    w.payoutUtr = payoutUtr || 'PAID_VIA_UPI';
    w.note = note || 'Payment successfully transferred to registered UPI ID';
    w.processedAt = new Date().toISOString();
    this.save();
    return w;
  }

  rejectWithdrawal(withdrawalId, reason = '') {
    const w = this.data.withdrawals.find(x => x.id === withdrawalId);
    if (!w) return null;

    if (w.status === 'pending') {
      // Refund coins back to user
      this.updateUserCoins(w.userId, w.amount);
    }

    w.status = 'rejected';
    w.note = reason || 'Withdrawal rejected. Coins refunded to wallet.';
    w.processedAt = new Date().toISOString();
    this.save();
    return w;
  }

  // ==========================================
  // YOUTUBE CHANNELS & TASKS (₹50 Coins / Day)
  // ==========================================
  getYoutubeLinks() {
    if (!this.data.youtubeLinks) this.data.youtubeLinks = [];
    return this.data.youtubeLinks;
  }

  getActiveYoutubeLinks() {
    return this.getYoutubeLinks().filter(l => l.active);
  }

  addYoutubeLink(channelName, channelUrl) {
    if (!this.data.youtubeLinks) this.data.youtubeLinks = [];
    const newLink = {
      id: 'yt_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      channelName: channelName.trim(),
      channelUrl: channelUrl.trim(),
      active: true,
      createdAt: new Date().toISOString()
    };
    this.data.youtubeLinks.unshift(newLink);
    this.save();
    return newLink;
  }

  deleteYoutubeLink(id) {
    if (!this.data.youtubeLinks) return false;
    const index = this.data.youtubeLinks.findIndex(l => l.id === id);
    if (index !== -1) {
      this.data.youtubeLinks.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  toggleYoutubeLink(id) {
    if (!this.data.youtubeLinks) return null;
    const link = this.data.youtubeLinks.find(l => l.id === id);
    if (link) {
      link.active = !link.active;
      this.save();
      return link;
    }
    return null;
  }

  getUserDailyYoutubeTask(userId, date = this.getTodayDateString()) {
    if (!this.data.youtubeTasks) this.data.youtubeTasks = [];
    let task = this.data.youtubeTasks.find(t => t.userId === userId && t.date === date);
    if (!task) {
      const user = this.getUserById(userId);
      if (!user || user.status !== 'approved') return null;

      if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date()) {
        return { isExpired: true };
      }

      const activeLinks = this.getActiveYoutubeLinks();
      if (activeLinks.length === 0) return null;

      const shuffled = [...activeLinks].sort(() => 0.5 - Math.random());
      let selectedLinks = shuffled.slice(0, 10);
      if (selectedLinks.length < 10) {
        while (selectedLinks.length < 10) {
          selectedLinks.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
        }
      }

      task = {
        id: 'yttsk_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        userId: user.id,
        userName: user.fullName,
        userMobile: user.mobile,
        date: date,
        reward: this.data.settings.dailyYoutubeReward || 50,
        status: 'in_progress', // 'in_progress' | 'submitted' | 'approved' | 'rejected'
        rewardClaimed: false,
        submittedAt: null,
        reviewedAt: null,
        rejectionReason: '',
        items: selectedLinks.map((lnk, index) => ({
          taskIndex: index + 1,
          linkId: lnk.id,
          channelName: lnk.channelName,
          channelUrl: lnk.channelUrl,
          screenshot: '',
          status: 'pending' // 'pending' | 'uploaded'
        }))
      };

      this.data.youtubeTasks.unshift(task);
      this.save();
    }
    return task;
  }

  updateYoutubeTaskScreenshot(taskId, taskIndex, screenshotPath) {
    if (!this.data.youtubeTasks) return null;
    const task = this.data.youtubeTasks.find(t => t.id === taskId);
    if (!task) return null;

    const item = task.items.find(i => i.taskIndex === Number(taskIndex));
    if (item) {
      item.screenshot = screenshotPath;
      item.status = 'uploaded';
      this.save();
      return task;
    }
    return null;
  }

  submitDailyYoutubeTask(taskId) {
    if (!this.data.youtubeTasks) return null;
    const task = this.data.youtubeTasks.find(t => t.id === taskId);
    if (!task) return null;

    const allUploaded = task.items.every(i => i.screenshot && i.screenshot.length > 0);
    if (!allUploaded) {
      return { error: 'Please upload Subscribe + Comment screenshots for all 10 YouTube channels.' };
    }

    task.status = 'submitted';
    task.submittedAt = new Date().toISOString();
    this.save();
    return task;
  }

  getAllYoutubeTasks() {
    if (!this.data.youtubeTasks) this.data.youtubeTasks = [];
    return this.data.youtubeTasks;
  }

  approveDailyYoutubeTask(taskId) {
    if (!this.data.youtubeTasks) return null;
    const task = this.data.youtubeTasks.find(t => t.id === taskId);
    if (!task) return null;
    if (task.status === 'approved') return { error: 'YouTube task already approved' };

    task.status = 'approved';
    task.reviewedAt = new Date().toISOString();

    if (!task.rewardClaimed) {
      task.rewardClaimed = true;
      this.updateUserCoins(task.userId, task.reward || 50);
    }

    this.save();
    return task;
  }

  rejectDailyYoutubeTask(taskId, reason = '') {
    if (!this.data.youtubeTasks) return null;
    const task = this.data.youtubeTasks.find(t => t.id === taskId);
    if (!task) return null;

    task.status = 'rejected';
    task.rejectionReason = reason || 'Some YouTube subscribe/comment screenshots were invalid or missing.';
    task.reviewedAt = new Date().toISOString();
    this.save();
    return task;
  }

  // -------------------------------------------------------------
  // VIDEO WATCH & EARN (4 MIN WATCH = 10 COINS)
  // -------------------------------------------------------------
  getWatchVideos() {
    if (!this.data.watchVideos) {
      this.data.watchVideos = JSON.parse(JSON.stringify(defaultData.watchVideos));
      this.save();
    }
    return this.data.watchVideos;
  }

  getActiveWatchVideos() {
    return this.getWatchVideos().filter(v => v.active);
  }

  addWatchVideo(title, videoUrl, durationSeconds = 240, rewardPerVideo = 10) {
    if (!this.data.watchVideos) this.data.watchVideos = [];
    const newVideo = {
      id: 'wv_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      durationSeconds: Math.max(30, Number(durationSeconds) || 240),
      rewardPerVideo: Math.max(1, Number(rewardPerVideo) || 10),
      active: true,
      createdAt: new Date().toISOString()
    };
    this.data.watchVideos.unshift(newVideo);
    this.save();
    return newVideo;
  }

  deleteWatchVideo(id) {
    if (!this.data.watchVideos) return false;
    const index = this.data.watchVideos.findIndex(v => v.id === id);
    if (index !== -1) {
      this.data.watchVideos.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  toggleWatchVideo(id) {
    if (!this.data.watchVideos) return null;
    const video = this.data.watchVideos.find(v => v.id === id);
    if (video) {
      video.active = !video.active;
      this.save();
      return video;
    }
    return null;
  }

  getUserDailyWatchTask(userId, date = this.getTodayDateString()) {
    if (!this.data.watchTasks) this.data.watchTasks = [];
    let task = this.data.watchTasks.find(t => t.userId === userId && t.date === date);

    if (!task) {
      const user = this.getUserById(userId);
      if (!user || user.status !== 'approved') return null;

      if (user.planExpiresAt && new Date(user.planExpiresAt) < new Date()) {
        return { isExpired: true };
      }

      const activeVideos = this.getActiveWatchVideos();
      if (activeVideos.length === 0) return null;

      // Randomly pick 10 videos (or duplicate if fewer)
      const shuffled = [...activeVideos].sort(() => 0.5 - Math.random());
      let selectedVideos = shuffled.slice(0, 10);
      if (selectedVideos.length < 10) {
        while (selectedVideos.length < 10) {
          selectedVideos.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
        }
      }

      const durationSec = this.data.settings.watchVideoDurationSeconds || 240; // 4 minutes = 240s
      const rewardCoin = this.data.settings.watchVideoRewardCoins || 10; // 10 coins

      task = {
        id: 'wvtsk_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
        userId: user.id,
        userName: user.fullName,
        userMobile: user.mobile,
        date: date,
        totalRewardEarned: 0,
        items: selectedVideos.map((v, index) => ({
          taskIndex: index + 1,
          videoId: v.id,
          title: v.title || `Watch Video #${index + 1}`,
          videoUrl: v.videoUrl,
          durationSeconds: v.durationSeconds || durationSec,
          reward: v.rewardPerVideo || rewardCoin,
          completed: false,
          claimedAt: null
        }))
      };

      this.data.watchTasks.unshift(task);
      this.save();
    }
    return task;
  }

  claimWatchVideoReward(userId, taskId, taskIndex, watchTimeSeconds, likedAndCommented = false) {
    if (!this.data.watchTasks) return { error: 'Watch tasks data not initialized' };
    const task = this.data.watchTasks.find(t => t.id === taskId && t.userId === userId);
    if (!task) return { error: 'Watch task session not found' };

    const item = task.items.find(i => i.taskIndex === Number(taskIndex));
    if (!item) return { error: 'Video task item not found' };

    if (item.completed) {
      return { error: 'Reward for this video is already claimed!', alreadyCompleted: true };
    }

    const requiredDuration = item.durationSeconds || 240;
    // Verify client didn't spoof if seconds are less than 95% of required duration (with 5s buffer)
    if (Number(watchTimeSeconds) < (requiredDuration - 5)) {
      return { error: `Aapko pura ${Math.floor(requiredDuration / 60)} minute video dekhna hoga reward paane ke liye.` };
    }

    item.completed = true;
    item.claimedAt = new Date().toISOString();
    
    const baseReward = item.reward || 10;
    let bonusCoins = 0;
    if (likedAndCommented) {
      bonusCoins = this.data.settings.videoLikeCommentBonusCoins !== undefined ? Number(this.data.settings.videoLikeCommentBonusCoins) : 2;
      item.likedAndCommented = true;
      item.bonusCoins = bonusCoins;
    }
    
    const totalCoins = baseReward + bonusCoins;
    item.totalReward = totalCoins;
    task.totalRewardEarned = (task.totalRewardEarned || 0) + totalCoins;

    // Immediately credit coins to user's wallet
    this.updateUserCoins(userId, totalCoins);
    this.save();

    const user = this.getUserById(userId);

    const bonusMsg = bonusCoins > 0 ? ` (+${bonusCoins} Like & Comment Bonus)` : '';

    return {
      success: true,
      message: `Badhai ho! Video dekhne par ₹${totalCoins} Coins${bonusMsg} aapke wallet me add ho gaye!`,
      rewardCoins: totalCoins,
      baseReward: baseReward,
      bonusCoins: bonusCoins,
      item: item,
      task: task,
      walletCoins: user ? user.walletCoins : 0
    };
  }
}

module.exports = new Database();
