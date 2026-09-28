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
    {
        "id": "wv_mbl_1",
        "title": "₹151 स्वैच्छिक सहयोग | जन सहायता मिशन | स्वास्थ्य • शिक्षा • कौशल • सामाजिक सहयोग",
        "videoUrl": "https://www.youtube.com/watch?v=zxJEXCI7x94",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:30.680Z"
    },
    {
        "id": "wv_mbl_2",
        "title": "Maya Bai Lodhi Foundation App का पूरा Review | Teacher Attendance कैसे लगाएं |",
        "videoUrl": "https://www.youtube.com/watch?v=BA_3lOoH5ss",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:30.559Z"
    },
    {
        "id": "wv_mbl_3",
        "title": "Block Coordinator बनें | ₹15,000 तक मानदेय | हर महीने 20 Teacher नियुक्त करवाएं | Field Job",
        "videoUrl": "https://www.youtube.com/watch?v=kBxP7aLiOaA",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:30.589Z"
    },
    {
        "id": "wv_mbl_4",
        "title": "District Coordinator कैसे बनें? | ₹25,000 तक मानदेय + Travel Fund | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=rz4pWiAyMaA",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:30.796Z"
    },
    {
        "id": "wv_mbl_5",
        "title": "गांव में Tuition Teacher बनें | घर से 2 घंटे पढ़ाएं |  Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=G-P8zc_RlMI",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:30.575Z"
    },
    {
        "id": "wv_mbl_6",
        "title": "Maya Bai Lodhi Foundation Online Joining कैसे करें? | Complete Process",
        "videoUrl": "https://www.youtube.com/watch?v=QIPwK264KpA",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:30.576Z"
    },
    {
        "id": "wv_mbl_7",
        "title": "एक छोटा सा दीपक | एक बच्ची का बड़ा सपना | दिल छू लेने वाली कहानी | Emotional Inspirational Story",
        "videoUrl": "https://www.youtube.com/watch?v=GRjKhVDDwnE",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:30.681Z"
    },
    {
        "id": "wv_mbl_8",
        "title": "THE INDIA STORY (2026) Full Movie in Hindi",
        "videoUrl": "https://www.youtube.com/watch?v=snTCv_sNdYU",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:30.683Z"
    },
    {
        "id": "wv_mbl_9",
        "title": "विश्वकर्मा पूजा एवं कन्या संक्रांति की हार्दिक शुभकामनाएँ 🙏 | Vishwakarma Puja Special | MBLF",
        "videoUrl": "https://www.youtube.com/watch?v=7pcOI9hoLrk",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:30.682Z"
    },
    {
        "id": "wv_mbl_10",
        "title": "ऋषि पंचमी की हार्दिक शुभकामनाएँ 🙏 | Rishi Panchami Special | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=Udwu5gqFwqg",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:30.794Z"
    },
    {
        "id": "wv_mbl_11",
        "title": "गणेश चतुर्थी की हार्दिक शुभकामनाएँ 🙏 | गणेश उत्सव आरंभ | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=hl2a6XPPhFU",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:31.375Z"
    },
    {
        "id": "wv_mbl_12",
        "title": "Why This Teacher’s Mission Matters More Than Ever",
        "videoUrl": "https://www.youtube.com/watch?v=-PNp_Yoc9OI",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:31.376Z"
    },
    {
        "id": "wv_mbl_13",
        "title": "एक पुरानी कॉपी और एक अधूरा सपना | Inspirational Hindi Movie",
        "videoUrl": "https://www.youtube.com/watch?v=rDFSGaxlaaA",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:31.354Z"
    },
    {
        "id": "wv_mbl_14",
        "title": "गांव के बच्चों की पढ़ाई की नई शुरुआत | शिक्षा की ओर बढ़ते कदम | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=cRzrrMUht3I",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:31.414Z"
    },
    {
        "id": "wv_mbl_15",
        "title": "MBL Foundation की Free Coaching Classes में धूमधाम से मनाया गया शिक्षक दिवस 🎉 | Teachers Day Special",
        "videoUrl": "https://www.youtube.com/watch?v=IxcEFWnczuY",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:31.351Z"
    },
    {
        "id": "wv_mbl_16",
        "title": "Teacher Job Alert: बच्चों के सपनों को दें नई दिशा 👨‍🏫",
        "videoUrl": "https://www.youtube.com/watch?v=076Q3PixVmE",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:31.354Z"
    },
    {
        "id": "wv_mbl_17",
        "title": "सिर्फ 2 घंटे पढ़ाएं और ₹4,500 कमाएं | Teacher Joining Open",
        "videoUrl": "https://www.youtube.com/watch?v=fIh0bxJlODk",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:31.355Z"
    },
    {
        "id": "wv_mbl_18",
        "title": "सिर्फ 2 घंटे देकर बदलें किसी का जीवन ❤️ | Teacher Recruitment Open",
        "videoUrl": "https://www.youtube.com/watch?v=84xu--GN8Qc",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:31.353Z"
    },
    {
        "id": "wv_mbl_19",
        "title": "इनकी मुस्कान में ही है असली सुकून ❤️🥰",
        "videoUrl": "https://www.youtube.com/watch?v=G0UCxmhxoHQ",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:31.350Z"
    },
    {
        "id": "wv_mbl_20",
        "title": "बच्चों को टॉफी और शिक्षा का उपहार ❤️ | Village Education Program",
        "videoUrl": "https://www.youtube.com/watch?v=Do6Tdkk4cco",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:31.350Z"
    },
    {
        "id": "wv_mbl_21",
        "title": "Village Education Program: बच्चों की प्रतिभा और उनका जोश! 🔥",
        "videoUrl": "https://www.youtube.com/watch?v=RpJF6fuxHV0",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.027Z"
    },
    {
        "id": "wv_mbl_22",
        "title": "सीखने के साथ मस्ती: बच्चों की खास Class Activity 📚",
        "videoUrl": "https://www.youtube.com/watch?v=HGkF5Mey0lI",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.027Z"
    },
    {
        "id": "wv_mbl_23",
        "title": "Online Work के Genuine तरीके: शुरुआत कहाँ से करें?",
        "videoUrl": "https://www.youtube.com/watch?v=kz8_iEbXG6k",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.023Z"
    },
    {
        "id": "wv_mbl_24",
        "title": "सिर्फ 2 मिनट में AI Video तैयार! | Google Gemini का कमाल",
        "videoUrl": "https://www.youtube.com/watch?v=oUk2Uwy7h9U",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.023Z"
    },
    {
        "id": "wv_mbl_25",
        "title": "बच्चों की पढ़ाई के लिए एक छोटी सी मदद ❤️ | बुंदेली डोनेशन अपील गीत | माया बाई लोधी फाउंडेशन",
        "videoUrl": "https://www.youtube.com/watch?v=QUGEW7Lgxig",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.021Z"
    },
    {
        "id": "wv_mbl_26",
        "title": "Blood Relation: Indirect Statement Questions Solve in Seconds!",
        "videoUrl": "https://www.youtube.com/watch?v=CM_HF9GRt2s",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.026Z"
    },
    {
        "id": "wv_mbl_27",
        "title": "Blood Relation: Statement Based Questions को Solve करने का सबसे तेज़ तरीका",
        "videoUrl": "https://www.youtube.com/watch?v=syN4nxbHQv4",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.024Z"
    },
    {
        "id": "wv_mbl_28",
        "title": "Blood Relation Reasoning in Hindi | Family Tree Method (Full Concepts)",
        "videoUrl": "https://www.youtube.com/watch?v=5YJtPLPFg2U",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.017Z"
    },
    {
        "id": "wv_mbl_29",
        "title": "Reasoning Fast Trick: Alphabet Arrangement & Same Position Questions",
        "videoUrl": "https://www.youtube.com/watch?v=pm3B3kmud7E",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.021Z"
    },
    {
        "id": "wv_mbl_30",
        "title": "Alphabet Series Model 4: Vowel-Consonant आधारित Questions की Fast Trick",
        "videoUrl": "https://www.youtube.com/watch?v=_IA-Zp2zJ7A",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.024Z"
    },
    {
        "id": "wv_mbl_31",
        "title": "Vocabulary Based Reasoning | Alphabet Series Model 3 | Exam Tricks 🔥",
        "videoUrl": "https://www.youtube.com/watch?v=s7xzTMruZZg",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.585Z"
    },
    {
        "id": "wv_mbl_32",
        "title": "Complete Reasoning Series | Alphabet Reasoning (Model 2) | Exam Special",
        "videoUrl": "https://www.youtube.com/watch?v=ZfDre3LOjGI",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.584Z"
    },
    {
        "id": "wv_mbl_33",
        "title": "Reasoning Tricks: Alphabet टेस्ट के कठिन सवालों को ऐसे करें हल",
        "videoUrl": "https://www.youtube.com/watch?v=I37bWbbikTE",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.585Z"
    },
    {
        "id": "wv_mbl_34",
        "title": "Teacher और कोऑर्डिनेटर के लिए Maya Foundation की गाइडलाइन",
        "videoUrl": "https://www.youtube.com/watch?v=mEpvgMEIVEU",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.666Z"
    },
    {
        "id": "wv_mbl_35",
        "title": "Maya Bai Lodhi Foundation: चंडी के बच्चों के साथ एक यादगार दिन ❤️",
        "videoUrl": "https://www.youtube.com/watch?v=4uW6qszp9Qg",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.584Z"
    },
    {
        "id": "wv_mbl_36",
        "title": "नालंदा के बच्चों के बीच टॉफी वितरण ❤️ | Maya Bai Lodhi Foundation | शिक्षा के साथ खुशियाँ",
        "videoUrl": "https://www.youtube.com/watch?v=CaTidkJkses",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.584Z"
    },
    {
        "id": "wv_mbl_37",
        "title": "Step-by-Step Guide: Teacher, Student और Staff Attendance Process",
        "videoUrl": "https://www.youtube.com/watch?v=PtmqCFpaHNw",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.664Z"
    },
    {
        "id": "wv_mbl_38",
        "title": "घर बैठे बच्चों को पढ़ाएं और हर महीने पाएं मानदेय",
        "videoUrl": "https://www.youtube.com/watch?v=eNzsuj-gxPA",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.665Z"
    },
    {
        "id": "wv_mbl_39",
        "title": "Why Teacher Pay Matters: Our Latest Foundation Update",
        "videoUrl": "https://www.youtube.com/watch?v=uuw0c4SD4s8",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.665Z"
    },
    {
        "id": "wv_mbl_40",
        "title": "Our Commitment to Rural Education: Teacher Salary Update #85",
        "videoUrl": "https://www.youtube.com/watch?v=_KCGeWblthM",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:32.666Z"
    },
    {
        "id": "wv_mbl_41",
        "title": "How We Build Future Leaders: Fun Classroom Activities!",
        "videoUrl": "https://www.youtube.com/watch?v=Q8_7AfdrFgo",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:33.211Z"
    },
    {
        "id": "wv_mbl_42",
        "title": "How We Make Learning Fun: Amazing Classroom Activities!",
        "videoUrl": "https://www.youtube.com/watch?v=-1hIaCJ2g9o",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:33.203Z"
    },
    {
        "id": "wv_mbl_43",
        "title": "Best Educational Activities for Children | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=s3hPRgsR2GE",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:33.208Z"
    },
    {
        "id": "wv_mbl_44",
        "title": "Students Enjoy Creative Classroom Games in Village Education Program",
        "videoUrl": "https://www.youtube.com/watch?v=niSwjQAEH-E",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:33.287Z"
    },
    {
        "id": "wv_mbl_45",
        "title": "माया बाई लोधी फाउंडेशन ज्वाइनिंग प्रोसेस 2026 | ऑनलाइन रजिस्ट्रेशन और आईडी कार्ड डाउनलोड",
        "videoUrl": "https://www.youtube.com/watch?v=YKv03SjO2Ng",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:33.207Z"
    },
    {
        "id": "wv_mbl_46",
        "title": "Maya Bai Lodhi Foundation Health Card 2026: Complete Registration Video!",
        "videoUrl": "https://www.youtube.com/watch?v=Jov614Cjl3M",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:33.213Z"
    },
    {
        "id": "wv_mbl_47",
        "title": "Group Learning Activities for Children #77",
        "videoUrl": "https://www.youtube.com/watch?v=4VliJMQ2PGU",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:33.292Z"
    },
    {
        "id": "wv_mbl_48",
        "title": "Happy Classroom Moments with Students #76",
        "videoUrl": "https://www.youtube.com/watch?v=ZLbEd6c3-F0",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:33.214Z"
    },
    {
        "id": "wv_mbl_49",
        "title": "Interactive Learning in Rural Classrooms #75",
        "videoUrl": "https://www.youtube.com/watch?v=OAdyqhOOlH8",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:33.207Z"
    },
    {
        "id": "wv_mbl_50",
        "title": "Best Student Participation Activities #74",
        "videoUrl": "https://www.youtube.com/watch?v=YXp8uM4gOQk",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:33.212Z"
    },
    {
        "id": "wv_mbl_51",
        "title": "Creative Classroom Games for Students #73",
        "videoUrl": "https://www.youtube.com/watch?v=lJBkDeh6GoQ",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.197Z"
    },
    {
        "id": "wv_mbl_52",
        "title": "Fun Learning Activities at Free Coaching Centres #72",
        "videoUrl": "https://www.youtube.com/watch?v=zdJc9iZyACs",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.164Z"
    },
    {
        "id": "wv_mbl_53",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation #71",
        "videoUrl": "https://www.youtube.com/watch?v=AIPcYOMEgGk",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.196Z"
    },
    {
        "id": "wv_mbl_54",
        "title": "Learning Through Creativity and Teamwork #70",
        "videoUrl": "https://www.youtube.com/watch?v=eEXyXaW-P1M",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.168Z"
    },
    {
        "id": "wv_mbl_55",
        "title": "Confidence Building Activities for Students #69",
        "videoUrl": "https://www.youtube.com/watch?v=6Inht1O82Bg",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.170Z"
    },
    {
        "id": "wv_mbl_56",
        "title": "Educational Games and Classroom Fun #68",
        "videoUrl": "https://www.youtube.com/watch?v=i1Pdg-zDPQg",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.173Z"
    },
    {
        "id": "wv_mbl_57",
        "title": "Group Learning Activities for Children #67",
        "videoUrl": "https://www.youtube.com/watch?v=G1n7OFlQ5PY",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.197Z"
    },
    {
        "id": "wv_mbl_58",
        "title": "Happy Classroom Moments with Students #66",
        "videoUrl": "https://www.youtube.com/watch?v=jGconaqyaeo",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.196Z"
    },
    {
        "id": "wv_mbl_59",
        "title": "Interactive Learning in Rural Classrooms #65",
        "videoUrl": "https://www.youtube.com/watch?v=M3LxQj80UnM",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.197Z"
    },
    {
        "id": "wv_mbl_60",
        "title": "Best Student Participation Activities #64",
        "videoUrl": "https://www.youtube.com/watch?v=GxVJX1OlRHo",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.197Z"
    },
    {
        "id": "wv_mbl_61",
        "title": "Creative Classroom Games for Students #63",
        "videoUrl": "https://www.youtube.com/watch?v=Gd5mGy7HH3s",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.954Z"
    },
    {
        "id": "wv_mbl_62",
        "title": "Fun Learning Activities at Free Coaching Centres #62",
        "videoUrl": "https://www.youtube.com/watch?v=fPAPf6HYsz0",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.948Z"
    },
    {
        "id": "wv_mbl_63",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation #61",
        "videoUrl": "https://www.youtube.com/watch?v=H5uyyNb-KzA",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.949Z"
    },
    {
        "id": "wv_mbl_64",
        "title": "Learning Through Creativity and Teamwork #60",
        "videoUrl": "https://www.youtube.com/watch?v=_P9earKpknc",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.947Z"
    },
    {
        "id": "wv_mbl_65",
        "title": "Confidence Building Activities for Students #59",
        "videoUrl": "https://www.youtube.com/watch?v=tSJ2sSjlHMI",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.947Z"
    },
    {
        "id": "wv_mbl_66",
        "title": "Educational Games and Classroom Fun #58",
        "videoUrl": "https://www.youtube.com/watch?v=7D62LpIbFCg",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.948Z"
    },
    {
        "id": "wv_mbl_67",
        "title": "Free Coaching Teachers Got Salary ✅ | Real Teacher Payment | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=MdUK_vL83lw",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.949Z"
    },
    {
        "id": "wv_mbl_68",
        "title": "Free Coaching Teachers Got Salary ✅ | Real Teacher Payment | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=hI6QejyBU-g",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.954Z"
    },
    {
        "id": "wv_mbl_69",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=6zSIh8jFq3U",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.954Z"
    },
    {
        "id": "wv_mbl_70",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=Qjt8Hrbwu54",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:34.954Z"
    },
    {
        "id": "wv_mbl_71",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=Tys1-i3qX5I",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.403Z"
    },
    {
        "id": "wv_mbl_72",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=D0JFeSmufkY",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.384Z"
    },
    {
        "id": "wv_mbl_73",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=oWo9pxeZVcw",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.395Z"
    },
    {
        "id": "wv_mbl_74",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=NyJOTHhEO4o",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.407Z"
    },
    {
        "id": "wv_mbl_75",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=oY9jxqHm6NM",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.384Z"
    },
    {
        "id": "wv_mbl_76",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=axU5V7rBkHk",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.384Z"
    },
    {
        "id": "wv_mbl_77",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=9DNCaeiQ5Sg",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.384Z"
    },
    {
        "id": "wv_mbl_78",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=yypJmcs-vrM",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.395Z"
    },
    {
        "id": "wv_mbl_79",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=4SW86G6biZ4",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.395Z"
    },
    {
        "id": "wv_mbl_80",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=TFlCZUGEgTU",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.385Z"
    },
    {
        "id": "wv_mbl_81",
        "title": "🚨 NGO में Udan 2.0 District Coordinator Job 2026 | ₹25,000 Salary | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=eAHoBr2lAQQ",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.823Z"
    },
    {
        "id": "wv_mbl_82",
        "title": "Udan 2.0 Block Coordinator Job 2026 | ₹15,000 Salary | 12th Pass Jobs | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=TAyPfnlqvqs",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.822Z"
    },
    {
        "id": "wv_mbl_83",
        "title": "Maya Bai Lodhi Foundation: क्या आप गांव के बच्चों को पढ़ाकर कमाना चाहते हैं?",
        "videoUrl": "https://www.youtube.com/watch?v=IoqePIgUgcA",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.826Z"
    },
    {
        "id": "wv_mbl_84",
        "title": "0% Government Funding से कैसे चल रही है FREE Education? | Maya Bai Lodhi Foundation Explained",
        "videoUrl": "https://www.youtube.com/watch?v=ajzedr-m9D0",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.817Z"
    },
    {
        "id": "wv_mbl_85",
        "title": "🚨 100% FREE Education Mission | Teacher Recruitment 2026 | ₹4500 Salary | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=TWbyzH7E9GY",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.831Z"
    },
    {
        "id": "wv_mbl_86",
        "title": "Parents Feedback | बच्चों में आया बड़ा बदलाव | Maya Bai Lodhi Foundation | Real Parent Review",
        "videoUrl": "https://www.youtube.com/watch?v=_xf9BohFk0A",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.825Z"
    },
    {
        "id": "wv_mbl_87",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=b6pfGiaDcHs",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.831Z"
    },
    {
        "id": "wv_mbl_88",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=KMLMzw1B9CI",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.831Z"
    },
    {
        "id": "wv_mbl_89",
        "title": "Amazing Classroom Activities with Students | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=Gd2ru0bGmA4",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.823Z"
    },
    {
        "id": "wv_mbl_90",
        "title": "How We Make Education Fun | Maya Bai Lodhi Foundation",
        "videoUrl": "https://www.youtube.com/watch?v=Q9grp1hXfAw",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:35.832Z"
    },
    {
        "id": "wv_mbl_91",
        "title": "✅ Teacher Recruitment 2026 | Step-by-Step Guide to Becoming a Free Coaching Teacher",
        "videoUrl": "https://www.youtube.com/watch?v=mYLjiHzf8-4",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:36.204Z"
    },
    {
        "id": "wv_mbl_92",
        "title": "Maya Bai Lodhi Foundation Teacher Jobs: Everything You Need to Know",
        "videoUrl": "https://www.youtube.com/watch?v=CwMJEMThXAw",
        "durationSeconds": 240,
        "rewardPerVideo": 5,
        "active": true,
        "createdAt": "2026-09-28T02:23:36.205Z"
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
