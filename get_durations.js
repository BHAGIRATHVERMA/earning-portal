const https = require('https');
const fs = require('fs');
const db = require('./db.js');

function getDuration(videoId) {
  return new Promise((resolve) => {
    const req = https.get('https://www.youtube.com/watch?v=' + videoId, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const m = data.match(/"approxDurationMs":"(\d+)"/);
        const s = data.match(/"lengthSeconds":"(\d+)"/);
        if (m) {
          resolve(Math.round(parseInt(m[1]) / 1000));
        } else if (s) {
          resolve(parseInt(s[1]));
        } else {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.setTimeout(5000, () => {
      req.destroy();
      resolve(null);
    });
  });
}

async function run() {
  const videos = db.getWatchVideos();
  console.log(`Checking ${videos.length} videos...`);
  const results = [];
  
  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    const match = v.videoUrl.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    const videoId = match ? match[1] : null;
    if (!videoId) continue;
    
    const duration = await getDuration(videoId);
    results.push({
      id: v.id,
      videoId,
      title: v.title,
      videoUrl: v.videoUrl,
      durationSeconds: duration,
      durationMins: duration ? (duration / 60).toFixed(2) : null
    });
    
    console.log(`[${i+1}/${videos.length}] ${videoId}: ${duration}s (${duration ? (duration/60).toFixed(1) + 'm' : '?'}) - ${v.title.slice(0, 40)}`);
  }
  
  fs.writeFileSync('video_durations.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Saved to video_durations.json');
}

run();
