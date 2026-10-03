const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.js');
let dbContent = fs.readFileSync(dbPath, 'utf8');

const durations = require('./video_durations.json');
const validVideos = durations.filter(v => v.durationSeconds && v.durationSeconds >= 180);

const formattedVideos = validVideos.map((v, i) => {
  const durationSec = v.durationSeconds;
  const reward = Math.round((durationSec / 60) * 0.80 * 100) / 100;
  return {
    id: `wv_mbl_${i + 1}`,
    title: v.title,
    videoUrl: v.videoUrl,
    durationSeconds: durationSec,
    rewardPerVideo: reward,
    active: true,
    createdAt: "2026-10-02T19:30:00.000Z"
  };
});

// Update updateUserCoins to round cleanly
dbContent = dbContent.replace(
  "user.walletCoins = Math.max(0, (user.walletCoins || 0) + amount);",
  "user.walletCoins = Math.max(0, Math.round(((user.walletCoins || 0) + Number(amount)) * 100) / 100);"
);

// Replace defaultData.watchVideos array in db.js
const startMarker = 'watchVideos: [';
const endMarker = '  watchTasks: [],';

const startIndex = dbContent.indexOf(startMarker);
const endIndex = dbContent.indexOf(endMarker, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const newWatchVideosSection = `watchVideos: ${JSON.stringify(formattedVideos, null, 2)},\n  `;
  dbContent = dbContent.slice(0, startIndex) + newWatchVideosSection + dbContent.slice(endIndex);
  fs.writeFileSync(dbPath, dbContent, 'utf8');
  console.log('Successfully updated db.js with 31 verified 3+ min videos at ₹0.80/min!');
} else {
  console.error('Could not find watchVideos section in db.js', startIndex, endIndex);
}
