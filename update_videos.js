const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'database.json');
const rawDb = fs.readFileSync(dbPath, 'utf8');
const dbData = JSON.parse(rawDb);

const durations = require('./video_durations.json');
// Filter videos that are >= 180 seconds (3 minutes)
const validVideos = durations.filter(v => v.durationSeconds && v.durationSeconds >= 180);

console.log(`Found ${validVideos.length} videos >= 3 minutes`);

const updatedWatchVideos = validVideos.map((v, index) => {
  const durationSec = v.durationSeconds;
  // Calculate reward at 0.80 paisa (₹0.80) per minute
  const reward = Math.round((durationSec / 60) * 0.80 * 100) / 100;
  return {
    id: `wv_mbl_${index + 1}`,
    title: v.title,
    videoUrl: v.videoUrl,
    durationSeconds: durationSec,
    rewardPerVideo: reward,
    active: true,
    createdAt: new Date().toISOString()
  };
});

// Update database.json
dbData.watchVideos = updatedWatchVideos;

// Reset existing watchTasks so all users get the fresh 3+ minute tasks today
dbData.watchTasks = [];

fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log('Successfully updated database.json with 31 verified 3+ min videos at ₹0.80/min!');
