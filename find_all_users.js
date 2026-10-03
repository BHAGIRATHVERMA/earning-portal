const fs = require('fs');
const path = require('path');

const allUsersMap = new Map();

function scan(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (!['node_modules', '.git'].includes(item.name)) {
        scan(fullPath);
      }
    } else if (item.name.endsWith('.json') || item.name.endsWith('.jsonl') || item.name === 'db.js') {
      try {
        const text = fs.readFileSync(fullPath, 'utf8');
        // Search for user objects with fullName and mobile
        const regex = /"fullName"\s*:\s*"([^"]+)"\s*,\s*"mobile"\s*:\s*"([^"]+)"/g;
        let match;
        while ((match = regex.exec(text)) !== null) {
          const key = match[2].trim();
          if (!allUsersMap.has(key)) {
            allUsersMap.set(key, {
              fullName: match[1].trim(),
              mobile: match[2].trim(),
              source: item.name
            });
          }
        }
      } catch (e) {}
    }
  }
}

scan('C:/Users/bhagi/.gemini/antigravity/scratch/map-earning-portal');
scan('C:/Users/bhagi/.gemini/antigravity/brain/9cec8a1d-f26f-480f-b5ff-4b0871cd3ead');

console.log('Total unique users found in all history: ' + allUsersMap.size);
let count = 1;
for (const [mobile, u] of allUsersMap.entries()) {
  console.log(`${count++}. Name: ${u.fullName} | Mobile: ${u.mobile} | File: ${u.source}`);
}
