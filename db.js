const fs = require('fs');
const path = require('path');

let MongoClient = null;
try {
  MongoClient = require('mongodb').MongoClient;
} catch (e) {
  // MongoDB driver will be auto-installed via package.json on Render
}

const DEFAULT_MONGODB_URI = 'mongodb+srv://bhagirathverma38_db_user:1OJDqIzogneAQWrj@cluster0.lhdjo0n.mongodb.net/map_earning?retryWrites=true&w=majority&appName=Cluster0';

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
  {
    "id": "wv_mbl_1",
    "title": "₹151 स्वैच्छिक सहयोग | जन सहायता मिशन | स्वास्थ्य • शिक्षा • कौशल • सामाजिक सहयोग",
    "videoUrl": "https://www.youtube.com/watch?v=zxJEXCI7x94",
    "durationSeconds": 186,
    "rewardPerVideo": 2.48,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_2",
    "title": "Maya Bai Lodhi Foundation App का पूरा Review | Teacher Attendance कैसे लगाएं |",
    "videoUrl": "https://www.youtube.com/watch?v=BA_3lOoH5ss",
    "durationSeconds": 428,
    "rewardPerVideo": 5.71,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_3",
    "title": "District Coordinator कैसे बनें? | ₹25,000 तक मानदेय + Travel Fund | Maya Bai Lodhi Foundation",
    "videoUrl": "https://www.youtube.com/watch?v=rz4pWiAyMaA",
    "durationSeconds": 303,
    "rewardPerVideo": 4.04,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_4",
    "title": "गांव में Tuition Teacher बनें | घर से 2 घंटे पढ़ाएं |  Maya Bai Lodhi Foundation",
    "videoUrl": "https://www.youtube.com/watch?v=G-P8zc_RlMI",
    "durationSeconds": 286,
    "rewardPerVideo": 3.81,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_5",
    "title": "Maya Bai Lodhi Foundation Online Joining कैसे करें? | Complete Process",
    "videoUrl": "https://www.youtube.com/watch?v=QIPwK264KpA",
    "durationSeconds": 335,
    "rewardPerVideo": 4.47,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_6",
    "title": "एक छोटा सा दीपक | एक बच्ची का बड़ा सपना | दिल छू लेने वाली कहानी | Emotional Inspirational Story",
    "videoUrl": "https://www.youtube.com/watch?v=GRjKhVDDwnE",
    "durationSeconds": 274,
    "rewardPerVideo": 3.65,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_7",
    "title": "एक पुरानी कॉपी और एक अधूरा सपना | Inspirational Hindi Movie",
    "videoUrl": "https://www.youtube.com/watch?v=rDFSGaxlaaA",
    "durationSeconds": 182,
    "rewardPerVideo": 2.43,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_8",
    "title": "Online Work के Genuine तरीके: शुरुआत कहाँ से करें?",
    "videoUrl": "https://www.youtube.com/watch?v=kz8_iEbXG6k",
    "durationSeconds": 196,
    "rewardPerVideo": 2.61,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_9",
    "title": "सिर्फ 2 मिनट में AI Video तैयार! | Google Gemini का कमाल",
    "videoUrl": "https://www.youtube.com/watch?v=oUk2Uwy7h9U",
    "durationSeconds": 536,
    "rewardPerVideo": 7.15,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_10",
    "title": "बच्चों की पढ़ाई के लिए एक छोटी सी मदद ❤️ | बुंदेली डोनेशन अपील गीत | माया बाई लोधी फाउंडेशन",
    "videoUrl": "https://www.youtube.com/watch?v=QUGEW7Lgxig",
    "durationSeconds": 271,
    "rewardPerVideo": 3.61,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_11",
    "title": "Blood Relation: Indirect Statement Questions Solve in Seconds!",
    "videoUrl": "https://www.youtube.com/watch?v=CM_HF9GRt2s",
    "durationSeconds": 498,
    "rewardPerVideo": 6.64,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_12",
    "title": "Blood Relation: Statement Based Questions को Solve करने का सबसे तेज़ तरीका",
    "videoUrl": "https://www.youtube.com/watch?v=syN4nxbHQv4",
    "durationSeconds": 403,
    "rewardPerVideo": 5.37,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_13",
    "title": "Blood Relation Reasoning in Hindi | Family Tree Method (Full Concepts)",
    "videoUrl": "https://www.youtube.com/watch?v=5YJtPLPFg2U",
    "durationSeconds": 678,
    "rewardPerVideo": 9.04,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_14",
    "title": "Alphabet Series Model 4: Vowel-Consonant आधारित Questions की Fast Trick",
    "videoUrl": "https://www.youtube.com/watch?v=_IA-Zp2zJ7A",
    "durationSeconds": 238,
    "rewardPerVideo": 3.17,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_15",
    "title": "Vocabulary Based Reasoning | Alphabet Series Model 3 | Exam Tricks 🔥",
    "videoUrl": "https://www.youtube.com/watch?v=s7xzTMruZZg",
    "durationSeconds": 183,
    "rewardPerVideo": 2.44,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_16",
    "title": "Complete Reasoning Series | Alphabet Reasoning (Model 2) | Exam Special",
    "videoUrl": "https://www.youtube.com/watch?v=ZfDre3LOjGI",
    "durationSeconds": 229,
    "rewardPerVideo": 3.05,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_17",
    "title": "Reasoning Tricks: Alphabet टेस्ट के कठिन सवालों को ऐसे करें हल",
    "videoUrl": "https://www.youtube.com/watch?v=I37bWbbikTE",
    "durationSeconds": 351,
    "rewardPerVideo": 4.68,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_18",
    "title": "Teacher और कोऑर्डिनेटर के लिए Maya Foundation की गाइडलाइन",
    "videoUrl": "https://www.youtube.com/watch?v=mEpvgMEIVEU",
    "durationSeconds": 1121,
    "rewardPerVideo": 14.95,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_19",
    "title": "Step-by-Step Guide: Teacher, Student और Staff Attendance Process",
    "videoUrl": "https://www.youtube.com/watch?v=PtmqCFpaHNw",
    "durationSeconds": 395,
    "rewardPerVideo": 5.27,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_20",
    "title": "Our Commitment to Rural Education: Teacher Salary Update #85",
    "videoUrl": "https://www.youtube.com/watch?v=_KCGeWblthM",
    "durationSeconds": 1500,
    "rewardPerVideo": 20,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_21",
    "title": "माया बाई लोधी फाउंडेशन ज्वाइनिंग प्रोसेस 2026 | ऑनलाइन रजिस्ट्रेशन और आईडी कार्ड डाउनलोड",
    "videoUrl": "https://www.youtube.com/watch?v=YKv03SjO2Ng",
    "durationSeconds": 295,
    "rewardPerVideo": 3.93,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_22",
    "title": "Maya Bai Lodhi Foundation Health Card 2026: Complete Registration Video!",
    "videoUrl": "https://www.youtube.com/watch?v=Jov614Cjl3M",
    "durationSeconds": 295,
    "rewardPerVideo": 3.93,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_23",
    "title": "Confidence Building Activities for Students #59",
    "videoUrl": "https://www.youtube.com/watch?v=tSJ2sSjlHMI",
    "durationSeconds": 224,
    "rewardPerVideo": 2.99,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_24",
    "title": "🚨 NGO में Udan 2.0 District Coordinator Job 2026 | ₹25,000 Salary | Maya Bai Lodhi Foundation",
    "videoUrl": "https://www.youtube.com/watch?v=eAHoBr2lAQQ",
    "durationSeconds": 1288,
    "rewardPerVideo": 17.17,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_25",
    "title": "Udan 2.0 Block Coordinator Job 2026 | ₹15,000 Salary | 12th Pass Jobs | Maya Bai Lodhi Foundation",
    "videoUrl": "https://www.youtube.com/watch?v=TAyPfnlqvqs",
    "durationSeconds": 1181,
    "rewardPerVideo": 15.75,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_26",
    "title": "Maya Bai Lodhi Foundation: क्या आप गांव के बच्चों को पढ़ाकर कमाना चाहते हैं?",
    "videoUrl": "https://www.youtube.com/watch?v=IoqePIgUgcA",
    "durationSeconds": 1312,
    "rewardPerVideo": 17.49,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_27",
    "title": "0% Government Funding से कैसे चल रही है FREE Education? | Maya Bai Lodhi Foundation Explained",
    "videoUrl": "https://www.youtube.com/watch?v=ajzedr-m9D0",
    "durationSeconds": 1122,
    "rewardPerVideo": 14.96,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_28",
    "title": "🚨 100% FREE Education Mission | Teacher Recruitment 2026 | ₹4500 Salary | Maya Bai Lodhi Foundation",
    "videoUrl": "https://www.youtube.com/watch?v=TWbyzH7E9GY",
    "durationSeconds": 429,
    "rewardPerVideo": 5.72,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_29",
    "title": "Parents Feedback | बच्चों में आया बड़ा बदलाव | Maya Bai Lodhi Foundation | Real Parent Review",
    "videoUrl": "https://www.youtube.com/watch?v=_xf9BohFk0A",
    "durationSeconds": 438,
    "rewardPerVideo": 5.84,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_30",
    "title": "✅ Teacher Recruitment 2026 | Step-by-Step Guide to Becoming a Free Coaching Teacher",
    "videoUrl": "https://www.youtube.com/watch?v=mYLjiHzf8-4",
    "durationSeconds": 1201,
    "rewardPerVideo": 16.01,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  },
  {
    "id": "wv_mbl_31",
    "title": "Maya Bai Lodhi Foundation Teacher Jobs: Everything You Need to Know",
    "videoUrl": "https://www.youtube.com/watch?v=CwMJEMThXAw",
    "durationSeconds": 1186,
    "rewardPerVideo": 15.81,
    "active": true,
    "createdAt": "2026-10-02T19:30:00.000Z"
  }
],
    watchTasks: [], // { id, userId, userName, date, items: [{ taskIndex, videoId, title, videoUrl, durationSeconds: 240, reward: 10, watchSeconds: 0, completed: false, claimedAt: null }] }
  withdrawals: [],
  coupons: [
    { id: 'cpn_free15oct', code: 'FREE15OCT', discountType: 'free', discountValue: 100, maxUses: 10000, usedCount: 0, active: true, expiresAt: '2026-10-15T23:59:59.999Z', description: 'Special 100% Free Registration Coupon (Valid till 15 Oct 2026) - Instant Auto Approval', createdAt: new Date().toISOString() },
    { id: 'cpn_1', code: 'FREE100', discountType: 'free', discountValue: 100, maxUses: 10000, usedCount: 0, active: true, expiresAt: '2026-10-15T23:59:59.999Z', description: '100% Free Plan Access (Valid till 15 Oct 2026)', createdAt: new Date().toISOString() },
    { id: 'cpn_2', code: 'OFFER50', discountType: 'flat', discountValue: 50, maxUses: 1000, usedCount: 0, active: true, expiresAt: '2026-10-15T23:59:59.999Z', description: 'Flat ₹50 Off', createdAt: new Date().toISOString() }
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
    watchVideoRewardCoins: 5, // 5 coins per video (20 videos * 5 = ₹100 daily)
    videoLikeCommentBonusCoins: 2, // 2 extra coins for like & comment
    enableMapService: false, // Master switch for Google Map Reviews (FULL DISABLED PER USER REQUEST)
    enableYoutubeService: true, // Master switch for YouTube Subscribe
    enableVideoWatchService: true, // Master switch for Video Watch & Earn
    googleClientId: '', // Google OAuth 2.0 Client ID
    enableGoogleLogin: true, // Master switch for Sign in with Google
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
    this.mongoClient = null;
    this.mongoDb = null;
    this.mongoConnected = false;
    this.init();
    this.initMongo();
  }

  async initMongo() {
    const uri = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
    if (!uri || !MongoClient) {
      console.log('ℹ️ [Database] MongoDB driver or URI not ready yet, running in local JSON mode.');
      return;
    }

    try {
      console.log('🔄 [Database] Connecting to MongoDB Atlas Cloud...');
      this.mongoClient = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });
      await this.mongoClient.connect();
      this.mongoDb = this.mongoClient.db('map_earning');
      this.mongoConnected = true;
      console.log('✅ [Database] SUCCESSFULLY CONNECTED TO MONGODB ATLAS CLOUD!');

      const col = this.mongoDb.collection('app_state');
      const doc = await col.findOne({ _id: 'main_db' });

      if (doc && doc.data && Array.isArray(doc.data.users) && doc.data.users.length > 0) {
        console.log(`📥 [Database] Successfully loaded ${doc.data.users.length} users and live state from MongoDB Cloud!`);
        this.data = doc.data;
        try {
          fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
        } catch (e) {}
      } else {
        console.log(`📤 [Database] Seeding MongoDB Cloud with current ${this.data.users.length} users and initial state...`);
        await col.updateOne(
          { _id: 'main_db' },
          { $set: { data: this.data, updatedAt: new Date().toISOString() } },
          { upsert: true }
        );
        console.log('✅ [Database] MongoDB Cloud database seeded successfully!');
      }
    } catch (err) {
      console.error('⚠️ [Database] MongoDB Cloud connection warning:', err.message);
      this.mongoConnected = false;
    }
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
          if (this.data.settings.googleClientId === undefined) this.data.settings.googleClientId = '';
          if (this.data.settings.enableGoogleLogin === undefined) this.data.settings.enableGoogleLogin = true;
        }
        if (!this.data.coupons) {
          this.data.coupons = JSON.parse(JSON.stringify(defaultData.coupons));
        } else {
          // Ensure special festive coupon FREE15OCT is available
          const hasOct15 = this.data.coupons.find(c => c.code === 'FREE15OCT');
          if (!hasOct15) {
            this.data.coupons.unshift({
              id: 'cpn_free15oct',
              code: 'FREE15OCT',
              discountType: 'free',
              discountValue: 100,
              maxUses: 10000,
              usedCount: 0,
              active: true,
              expiresAt: '2026-10-15T23:59:59.999Z',
              description: 'Special 100% Free Registration Coupon (Valid till 15 Oct 2026) - Instant Auto Approval',
              createdAt: new Date().toISOString()
            });
          }
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

    this.syncToMongo();
  }

  async syncToMongo() {
    if (!this.mongoConnected || !this.mongoDb) return;
    try {
      const col = this.mongoDb.collection('app_state');
      await col.updateOne(
        { _id: 'main_db' },
        { $set: { data: this.data, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (err) {
      console.error('⚠️ [Database] Cloud sync failed:', err.message);
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

  isCouponExpired(coupon) {
    if (!coupon || !coupon.expiresAt) return false;
    return new Date(coupon.expiresAt).getTime() < Date.now();
  }

  createCoupon({ code, discountType = 'free', discountValue = 100, maxUses = 1000, expiresAt = '2026-10-15T23:59:59.999Z', description = '' }) {
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
      expiresAt: expiresAt || '2026-10-15T23:59:59.999Z',
      description: description || (discountType === 'free' ? '100% Free Plan & Auto-Approval' : `Discount Coupon`),
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
    let hasChanges = false;
    const bonus = this.data.settings.referralBonusCoins !== undefined ? Number(this.data.settings.referralBonusCoins) : 50;
    
    this.data.users.forEach(u => {
      if (u.walletCoins === undefined || isNaN(u.walletCoins)) {
        u.walletCoins = 0;
        hasChanges = true;
      }
      if (!u.referralCode) {
        u.referralCode = this.generateReferralCode(u.fullName, u.mobile);
        hasChanges = true;
      }
      const myRefs = this.data.users.filter(other => other.referredBy === u.id);
      if (u.referralsCount === undefined || u.referralsCount < myRefs.length) {
        u.referralsCount = myRefs.length;
        hasChanges = true;
      }
      if (u.referralEarnings === undefined) {
        u.referralEarnings = (u.referralsCount || 0) * bonus;
        hasChanges = true;
      }
      if (u.referredBy && !u.referredByName) {
        const ref = this.data.users.find(r => r.id === u.referredBy);
        if (ref) {
          u.referredByName = ref.fullName;
          u.referredByCode = ref.referralCode;
          hasChanges = true;
        }
      }
      if (!u.lastPlatform) {
        u.lastPlatform = (u.deviceInfo && u.deviceInfo.includes('MapReviewPay-Android-App')) ? 'apk' : 'web';
      }
    });

    if (hasChanges) {
      this.save();
    }
    return this.data.users;
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  getUserByMobile(mobile) {
    return this.data.users.find(u => u.mobile === mobile);
  }

  getUserByEmail(email) {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    return this.data.users.find(u => (u.email || '').toLowerCase() === clean);
  }

  getUserByGoogleId(googleId) {
    if (!googleId) return null;
    return this.data.users.find(u => u.googleId === googleId);
  }

  findOrCreateGoogleUser({ email, name, googleId, picture, referralCode }) {
    if (!email && !googleId) return null;

    const cleanEmail = (email || '').trim().toLowerCase();
    let user = null;

    if (googleId) {
      user = this.getUserByGoogleId(googleId);
    }
    if (!user && cleanEmail) {
      user = this.getUserByEmail(cleanEmail);
    }

    const now = new Date();

    if (user) {
      let modified = false;
      if (googleId && !user.googleId) {
        user.googleId = googleId;
        modified = true;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
        modified = true;
      }
      if (cleanEmail && !user.email) {
        user.email = cleanEmail;
        modified = true;
      }
      if (user.status === 'deactivated') {
        return { isBlocked: true, user };
      }
      if (!user.planExpiresAt || new Date(user.planExpiresAt) < now) {
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        user.planExpiresAt = expiry.toISOString();
        user.status = 'approved';
        modified = true;
      }
      if (modified) {
        this.save();
      }
      return { isNew: false, user };
    }

    const plan = this.data.settings.plans && this.data.settings.plans.length > 0 
      ? this.data.settings.plans[0] 
      : { id: '69', price: 69, name: 'Basic Plan (₹69)', validityDays: 30 };

    let referredByUser = null;
    if (referralCode) {
      referredByUser = this.getUserByReferralCode(referralCode);
    }

    const displayName = (name || cleanEmail.split('@')[0] || 'Google User').trim();
    const refCode = this.generateReferralCode(displayName, String(Date.now()).slice(-4));

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    const referralBonus = this.data.settings.referralBonusCoins !== undefined ? Number(this.data.settings.referralBonusCoins) : 50;
    let rewardGiven = false;
    if (referredByUser) {
      referredByUser.walletCoins = (referredByUser.walletCoins || 0) + referralBonus;
      referredByUser.referralsCount = (referredByUser.referralsCount || 0) + 1;
      referredByUser.referralEarnings = (referredByUser.referralEarnings || 0) + referralBonus;
      rewardGiven = true;
    }

    const newUser = {
      id: 'usr_g_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      googleId: googleId || null,
      email: cleanEmail,
      avatar: picture || '',
      fullName: displayName,
      mobile: '',
      city: 'India',
      password: 'GOOGLE_AUTH_SECURE_' + Math.random().toString(36).slice(-8),
      utr: 'GOOGLE_SIGNIN_VERIFIED',
      upiId: cleanEmail,
      planId: plan.id,
      planPrice: 0,
      planName: 'Google Verified Plan',
      planValidityDays: 30,
      status: 'approved',
      rejectionReason: '',
      walletCoins: 0,
      referralCode: refCode,
      referredBy: referredByUser ? referredByUser.id : null,
      referredByName: referredByUser ? referredByUser.fullName : null,
      referredByCode: referredByUser ? referredByUser.referralCode : null,
      referralRewardClaimed: rewardGiven,
      referralsCount: 0,
      referralEarnings: 0,
      couponApplied: 'GOOGLE_SIGNIN_FREE',
      createdAt: now.toISOString(),
      approvedAt: now.toISOString(),
      planExpiresAt: expiry.toISOString()
    };

    this.data.users.unshift(newUser);
    this.save();
    return { isNew: true, user: newUser };
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

    // Instantly credit referral reward to referrer
    const referralBonus = this.data.settings.referralBonusCoins !== undefined ? Number(this.data.settings.referralBonusCoins) : 50;
    let rewardGiven = false;
    if (referredByUser) {
      referredByUser.walletCoins = (referredByUser.walletCoins || 0) + referralBonus;
      referredByUser.referralsCount = (referredByUser.referralsCount || 0) + 1;
      referredByUser.referralEarnings = (referredByUser.referralEarnings || 0) + referralBonus;
      rewardGiven = true;
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
      referredByName: referredByUser ? referredByUser.fullName : null,
      referredByCode: referredByUser ? referredByUser.referralCode : null,
      referralRewardClaimed: rewardGiven,
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
        const referralBonus = this.data.settings.referralBonusCoins !== undefined ? Number(this.data.settings.referralBonusCoins) : 50;
        referrer.walletCoins = (referrer.walletCoins || 0) + referralBonus;
        referrer.referralsCount = (referrer.referralsCount || 0) + 1;
        referrer.referralEarnings = (referrer.referralEarnings || 0) + referralBonus;
        user.referralRewardClaimed = true;
      }
    }
    
    this.save();
    return user;
  }

  adjustUserCoins(userId, amount, action = 'add') {
    const user = this.getUserById(userId);
    if (!user) return null;
    const num = Number(amount) || 0;
    if (action === 'add') {
      user.walletCoins = (user.walletCoins || 0) + num;
    } else if (action === 'subtract') {
      user.walletCoins = Math.max(0, (user.walletCoins || 0) - num);
    } else if (action === 'set') {
      user.walletCoins = Math.max(0, num);
    }
    this.save();
    return user;
  }

  getAdminReferralsOverview() {
    const users = this.getUsers();
    const bonus = this.data.settings.referralBonusCoins !== undefined ? Number(this.data.settings.referralBonusCoins) : 50;

    const referrersMap = [];
    users.forEach(u => {
      const myRefs = users.filter(other => other.referredBy === u.id);
      if (myRefs.length > 0 || (u.referralsCount && u.referralsCount > 0)) {
        referrersMap.push({
          id: u.id,
          fullName: u.fullName,
          mobile: u.mobile,
          city: u.city,
          referralCode: u.referralCode,
          walletCoins: u.walletCoins || 0,
          totalReferred: myRefs.length || (u.referralsCount || 0),
          totalEarned: u.referralEarnings || (myRefs.length * bonus),
          referredUsers: myRefs.map(r => ({
            id: r.id,
            fullName: r.fullName,
            mobile: r.mobile,
            city: r.city,
            status: r.status,
            planName: r.planName,
            createdAt: r.createdAt,
            rewardClaimed: r.referralRewardClaimed || false
          }))
        });
      }
    });

    referrersMap.sort((a, b) => b.totalReferred - a.totalReferred);

    const totalReferrals = users.filter(u => Boolean(u.referredBy)).length;
    const totalBonusDistributed = referrersMap.reduce((sum, r) => sum + (r.totalEarned || 0), 0);

    return {
      referralBonusCoins: bonus,
      totalReferrals,
      totalBonusDistributed,
      referrers: referrersMap
    };
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
    user.walletCoins = Math.max(0, Math.round(((user.walletCoins || 0) + Number(amount)) * 100) / 100);
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

  addMessage(userId, sender, text, overrideName = '', overrideMobile = '') {
    if (!this.data.messages) this.data.messages = [];
    const user = this.getUserById(userId);
    const userName = user ? user.fullName : (overrideName || 'Website Visitor');
    const userMobile = user ? user.mobile : (overrideMobile || 'Guest');

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

      let activeLinks = this.getActiveLinks();
      if (!activeLinks || activeLinks.length === 0) {
        if (defaultData && defaultData.links && defaultData.links.length > 0) {
          this.data.links = JSON.parse(JSON.stringify(defaultData.links));
          this.save();
          activeLinks = this.getActiveLinks();
        }
      }
      if (!activeLinks || activeLinks.length === 0) return null;

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

      let activeLinks = this.getActiveYoutubeLinks();
      if (!activeLinks || activeLinks.length === 0) {
        if (defaultData && defaultData.youtubeLinks && defaultData.youtubeLinks.length > 0) {
          this.data.youtubeLinks = JSON.parse(JSON.stringify(defaultData.youtubeLinks));
          this.save();
          activeLinks = this.getActiveYoutubeLinks();
        }
      }
      if (!activeLinks || activeLinks.length === 0) return null;

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

      let activeVideos = this.getActiveWatchVideos();
      if (!activeVideos || activeVideos.length === 0) {
        if (defaultData && defaultData.watchVideos && defaultData.watchVideos.length > 0) {
          this.data.watchVideos = JSON.parse(JSON.stringify(defaultData.watchVideos));
          this.save();
          activeVideos = this.getActiveWatchVideos();
        }
      }
      if (!activeVideos || activeVideos.length === 0) return null;

      // Randomly pick 20 videos daily (or duplicate if fewer)
      const shuffled = [...activeVideos].sort(() => 0.5 - Math.random());
      let selectedVideos = shuffled.slice(0, 20);
      if (selectedVideos.length < 20) {
        while (selectedVideos.length < 20) {
          selectedVideos.push(shuffled[Math.floor(Math.random() * shuffled.length)]);
        }
      }

      const durationSec = this.data.settings.watchVideoDurationSeconds || 240; // 4 minutes = 240s
      const rewardCoin = this.data.settings.watchVideoRewardCoins || 5; // 10 coins

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
    
    const totalCoins = Math.round((baseReward + bonusCoins) * 100) / 100;
    item.totalReward = totalCoins;
    task.totalRewardEarned = Math.round(((task.totalRewardEarned || 0) + totalCoins) * 100) / 100;

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

  // -------------------------------------------------------------
  // VISITOR & USER TIME TRACKING ANALYTICS
  // -------------------------------------------------------------
  ensureAnalytics() {
    if (!this.data.analytics) {
      this.data.analytics = {
        totalVisits: 0,
        pageViews: {},
        visitsHistory: []
      };
    }
  }

  recordVisit(pagePath = '/', ip = '', userAgent = '', userId = null, platform = 'web') {
    this.ensureAnalytics();
    this.data.analytics.totalVisits = (this.data.analytics.totalVisits || 0) + 1;
    
    // Page views count
    const cleanPath = pagePath.split('?')[0] || '/';
    this.data.analytics.pageViews[cleanPath] = (this.data.analytics.pageViews[cleanPath] || 0) + 1;

    let userName = 'Guest Visitor';
    let userMobile = '';
    if (userId) {
      const user = this.getUserById(userId);
      if (user) {
        userName = user.fullName;
        userMobile = user.mobile;
        user.lastActiveAt = new Date().toISOString();
        user.lastPage = cleanPath;
        if (platform) user.lastPlatform = platform;
      }
    }

    const visitEntry = {
      id: 'vis_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      path: cleanPath,
      ip: ip || '127.0.0.1',
      userAgent: userAgent || 'Browser',
      userId: userId || null,
      userName: userName,
      userMobile: userMobile,
      platform: platform || 'web',
      timestamp: new Date().toISOString()
    };

    if (!this.data.analytics.visitsHistory) this.data.analytics.visitsHistory = [];
    this.data.analytics.visitsHistory.unshift(visitEntry);

    // Keep history capped to last 150 items
    if (this.data.analytics.visitsHistory.length > 150) {
      this.data.analytics.visitsHistory = this.data.analytics.visitsHistory.slice(0, 150);
    }

    this.save();
    return visitEntry;
  }

  recordUserLogin(userId, ip = '', userAgent = '', platform = 'web') {
    const user = this.getUserById(userId);
    if (!user) return;

    user.loginCount = (user.loginCount || 0) + 1;
    user.lastLoginAt = new Date().toISOString();
    user.lastActiveAt = new Date().toISOString();
    user.deviceInfo = userAgent;
    user.lastPlatform = platform || 'web';
    this.save();
  }

  recordUserHeartbeat(userId, pagePath = '/dashboard.html', seconds = 30, platform = null) {
    const user = this.getUserById(userId);
    if (!user) return null;

    user.totalTimeSpentSeconds = (user.totalTimeSpentSeconds || 0) + Number(seconds);
    user.lastActiveAt = new Date().toISOString();
    user.lastPage = pagePath;
    if (platform) {
      user.lastPlatform = platform;
    }
    this.save();

    return {
      userId: user.id,
      totalTimeSpentSeconds: user.totalTimeSpentSeconds,
      formattedTime: this.formatTimeDuration(user.totalTimeSpentSeconds),
      platform: user.lastPlatform || 'web'
    };
  }

  formatTimeDuration(totalSeconds = 0) {
    const sec = Math.max(0, Number(totalSeconds) || 0);
    if (sec < 60) return `${sec}s`;
    const mins = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    if (mins < 60) {
      return `${mins}m ${remainingSec}s`;
    }
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
  }

  getAnalyticsOverview() {
    this.ensureAnalytics();
    const now = Date.now();
    const threeMinutesAgo = now - (3 * 60 * 1000); // 3 mins threshold for online

    const users = this.getUsers();
    let totalUserSeconds = 0;
    let onlineUsersCount = 0;
    let onlineAppUsersCount = 0;
    let onlineWebUsersCount = 0;

    const usersTracking = users.map(u => {
      const timeSpent = u.totalTimeSpentSeconds || 0;
      totalUserSeconds += timeSpent;
      const lastActiveMs = u.lastActiveAt ? new Date(u.lastActiveAt).getTime() : 0;
      const isOnline = lastActiveMs >= threeMinutesAgo;
      const platform = (u.lastPlatform === 'apk' || (u.deviceInfo && u.deviceInfo.includes('MapReviewPay-Android-App'))) ? 'apk' : 'web';

      if (isOnline) {
        onlineUsersCount++;
        if (platform === 'apk') {
          onlineAppUsersCount++;
        } else {
          onlineWebUsersCount++;
        }
      }

      return {
        id: u.id,
        fullName: u.fullName,
        mobile: u.mobile,
        city: u.city,
        status: u.status,
        planName: u.planName,
        platform: platform,
        lastPlatform: platform,
        deviceInfo: u.deviceInfo || '',
        loginCount: u.loginCount || 1,
        totalTimeSpentSeconds: timeSpent,
        formattedTimeSpent: this.formatTimeDuration(timeSpent),
        lastLoginAt: u.lastLoginAt || u.createdAt,
        lastActiveAt: u.lastActiveAt || u.createdAt,
        lastPage: u.lastPage || '/dashboard.html',
        isOnline: isOnline
      };
    });

    // Sort users by isOnline first, then total time spent desc
    usersTracking.sort((a, b) => {
      if (a.isOnline && !b.isOnline) return -1;
      if (!a.isOnline && b.isOnline) return 1;
      return b.totalTimeSpentSeconds - a.totalTimeSpentSeconds;
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const todayVisits = (this.data.analytics.visitsHistory || []).filter(v => v.timestamp && v.timestamp.startsWith(todayStr)).length;

    return {
      totalVisits: Math.max(this.data.analytics.totalVisits || 0, 1),
      todayVisits: todayVisits || Math.min(this.data.analytics.totalVisits || 0, 15),
      pageViews: this.data.analytics.pageViews || {},
      totalUserEngagementSeconds: totalUserSeconds,
      totalFormattedEngagement: this.formatTimeDuration(totalUserSeconds),
      onlineUsersCount: onlineUsersCount,
      onlineAppUsersCount: onlineAppUsersCount,
      onlineWebUsersCount: onlineWebUsersCount,
      usersTracking: usersTracking,
      recentVisits: (this.data.analytics.visitsHistory || []).slice(0, 50)
    };
  }
}

module.exports = new Database();
