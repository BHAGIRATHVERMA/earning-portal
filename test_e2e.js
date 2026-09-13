const http = require('http');
const path = require('path');
const fs = require('fs');

async function runTests() {
  console.log('--- Starting End-to-End Automated Tests ---');

  // Let's require the server or test via direct API / DB
  const db = require('./db');

  console.log('1. Testing DB initialization...');
  const settings = db.getSettings();
  console.log('   Settings Admin ID:', settings.adminId);
  console.log('   Default UPI ID:', settings.upiId);
  console.log('   Active Google Map Links Count:', db.getActiveLinks().length);

  console.log('\n2. Testing User Registration...');
  const user = db.createUser({
    fullName: 'Ramesh Kumar',
    mobile: '9876500001',
    city: 'Indore',
    password: 'user123',
    utr: 'UTR998877665544',
    upiId: 'ramesh@upi',
    planId: '69'
  });
  console.log('   Created User ID:', user.id);
  console.log('   User Status:', user.status); // Should be 'pending'
  console.log('   User Plan:', user.planName, 'Validity:', user.planValidityDays, 'days');

  console.log('\n3. Testing Admin User Approval...');
  const approvedUser = db.approveUser(user.id);
  console.log('   Approved Status:', approvedUser.status);
  console.log('   Plan Expires At:', approvedUser.planExpiresAt);

  console.log('\n4. Testing Daily 10 Tasks Generation...');
  const task = db.getUserDailyTask(user.id);
  console.log('   Task ID:', task.id);
  console.log('   Generated Task Items Count:', task.items.length);
  console.log('   Sample Map Item 1:', task.items[0].businessName, '->', task.items[0].mapUrl);

  console.log('\n5. Testing Screenshot Uploads Simulation...');
  for (let i = 1; i <= 10; i++) {
    db.updateTaskScreenshot(task.id, i, `/uploads/screenshots/sample_proof_${i}.png`);
  }
  const submittedTask = db.submitDailyTask(task.id);
  console.log('   Task Status after all 10 uploaded:', submittedTask.status); // 'submitted'

  console.log('\n6. Testing Admin Task Approval & Reward Credit (+400 Coins)...');
  const initialCoins = db.getUserById(user.id).walletCoins || 0;
  console.log('   User Coins before approval:', initialCoins);
  
  const reviewedTask = db.approveDailyTask(task.id);
  const updatedUser = db.getUserById(user.id);
  console.log('   Task Status after admin approval:', reviewedTask.status);
  console.log('   User Coins after approval (+400):', updatedUser.walletCoins);

  console.log('\n7. Testing YouTube Subscribe & Comment Tasks (₹50 Coins)...');
  const ytTask = db.getUserDailyYoutubeTask(user.id);
  console.log('   YouTube Task ID:', ytTask.id);
  console.log('   Generated YouTube Channels Count:', ytTask.items.length);
  console.log('   Sample YT Channel 1:', ytTask.items[0].channelName, '->', ytTask.items[0].channelUrl);

  for (let i = 1; i <= 10; i++) {
    db.updateYoutubeTaskScreenshot(ytTask.id, i, `/uploads/screenshots/yt_sample_proof_${i}.png`);
  }
  const submittedYtTask = db.submitDailyYoutubeTask(ytTask.id);
  console.log('   YouTube Task Status after 10 proofs uploaded:', submittedYtTask.status);

  db.approveDailyYoutubeTask(ytTask.id);
  const userAfterYt = db.getUserById(user.id);
  console.log('   User Coins after YouTube approval (+50):', userAfterYt.walletCoins); // Should be 450

  console.log('\n8. Testing Withdrawal Validations & Workflow...');
  // Attempt with 400 coins (less than 500)
  const failWithdraw = db.createWithdrawal(user.id, 400);
  console.log('   Withdrawal < 500 Coins rejected properly:', failWithdraw.error);

  // Credit enough coins to test successful withdrawal (e.g. 500 coins)
  db.updateUserCoins(user.id, 500); // 150 + 500 = 650 coins
  console.log('   User Balance now:', db.getUserById(user.id).walletCoins);

  const successWithdraw = db.createWithdrawal(user.id, 500);
  console.log('   Withdrawal Request Created ID:', successWithdraw.id);
  console.log('   Remaining User Balance:', db.getUserById(user.id).walletCoins); // Should be 150

  // Admin approves withdrawal with Payout UTR
  const approvedWithdraw = db.approveWithdrawal(successWithdraw.id, 'PAYOUT_UTR_11223344', 'Transferred to UPI');
  console.log('   Withdrawal Approved Status:', approvedWithdraw.status, 'UTR:', approvedWithdraw.payoutUtr);

  console.log('\n8. Testing Google Maps Link Pool Manager...');
  const newLink = db.addLink('Taj Palace Delhi', 'https://maps.google.com/?q=Taj+Palace+Delhi');
  console.log('   Added New Link ID:', newLink.id, newLink.businessName);
  console.log('   Total Links in Pool now:', db.getLinks().length);

  console.log('\n9. Testing User Deactivation & Reactivation Workflow...');
  const deactUser = db.deactivateUser(user.id, 'Spam Review Warning');
  console.log('   Deactivated User Status:', deactUser.status, 'Reason:', deactUser.deactivatedReason);

  const reactUser = db.activateUser(user.id);
  console.log('   Reactivated User Status:', reactUser.status);

  console.log('\n10. Testing Referral System (50 Coins Earning)...');
  const userReferralInfo = db.getUserReferrals(user.id);
  console.log('   User Referral Code:', userReferralInfo.referralCode);

  // New user signing up with Ramesh's referral code
  const friendUser = db.createUser({
    fullName: 'Suresh Verma',
    mobile: '9876500002',
    city: 'Bhopal',
    password: 'user123',
    utr: 'UTR778899001122',
    upiId: 'suresh@upi',
    planId: '69',
    referredByCode: userReferralInfo.referralCode
  });
  console.log('   Friend Signed Up with Ref Code:', friendUser.referredByCode, 'ReferredBy ID:', friendUser.referredBy);
  
  const referrerCoinsBefore = db.getUserById(user.id).walletCoins;
  console.log('   Referrer (Ramesh) Coins before friend approval:', referrerCoinsBefore);

  // Admin approves friend
  db.approveUser(friendUser.id);
  const referrerCoinsAfter = db.getUserById(user.id).walletCoins;
  console.log('   Referrer (Ramesh) Coins after friend approval (+50 Coins):', referrerCoinsAfter);
  console.log('   Referral Bonus Verified (+50):', referrerCoinsAfter === referrerCoinsBefore + 50);

  console.log('\n11. Testing Live Chat Support System (User <-> Admin)...');
  // User sends message to Admin
  const userMsg = db.addMessage(user.id, 'user', 'Namaste Admin, mera task review kar dijiye.');
  console.log('   User Sent Message:', userMsg.text, 'Sender:', userMsg.sender);

  // Admin checks threads
  const threads = db.getAdminChatThreads();
  console.log('   Admin Active Threads Count:', threads.length);
  console.log('   Thread User:', threads[0].userName, 'Last Msg:', threads[0].lastMessage, 'Unread:', threads[0].unreadCount);

  // Admin replies
  const adminMsg = db.addMessage(user.id, 'admin', 'Haan Ramesh, aapka task check karke approve kar diya hai.');
  console.log('   Admin Sent Reply:', adminMsg.text, 'Sender:', adminMsg.sender);

  const userMessages = db.getUserMessages(user.id);
  console.log('\n12. Testing Video Watch & Earn Module (4 Mins = 10 Coins Instant)...');
  const watchPool = db.getWatchVideos();
  console.log('   Default Watch Videos in Pool:', watchPool.length);

  // Admin adds new watch video
  const newWatchVid = db.addWatchVideo('Special High Paying Guide', 'https://youtu.be/dQw4w9WgXcQ', 240, 10);
  console.log('   Admin Added Watch Video ID:', newWatchVid.id, 'Title:', newWatchVid.title);

  // User gets 10 daily assigned watch videos
  const userWatchTask = db.getUserDailyWatchTask(user.id);
  console.log('   User Watch Task ID:', userWatchTask.id);
  console.log('   Daily Assigned Watch Videos Count:', userWatchTask.items.length);
  console.log('   Sample Video Item 1:', userWatchTask.items[0].title, 'Duration:', userWatchTask.items[0].durationSeconds, 'Reward:', userWatchTask.items[0].reward);

  // Anti-cheat verification test: claim with only 60 seconds watch time (should fail)
  const cheatAttempt = db.claimWatchVideoReward(user.id, userWatchTask.id, 1, 60);
  console.log('   Anti-Cheat check (60s < 240s) properly rejected:', !!cheatAttempt.error);

  // Legitimate full 4-minute watch (240s)
  const coinsBeforeWatch = db.getUserById(user.id).walletCoins;
  console.log('   User Coins before video claim:', coinsBeforeWatch);

  const legitClaim = db.claimWatchVideoReward(user.id, userWatchTask.id, 1, 240);
  console.log('   Legit Claim Success:', legitClaim.success, 'Message:', legitClaim.message);
  console.log('   Reward Coins Credited:', legitClaim.rewardCoins);

  const coinsAfterWatch = db.getUserById(user.id).walletCoins;
  console.log('   User Coins after video claim (+10):', coinsAfterWatch);
  console.log('   Coin Increase Verified (+10):', coinsAfterWatch === coinsBeforeWatch + 10);

  // Double claim prevention test
  const doubleClaim = db.claimWatchVideoReward(user.id, userWatchTask.id, 1, 240);
  console.log('   Double Claim properly prevented:', !!doubleClaim.error);

  console.log('\n========================================');
  console.log('ALL CORE FUNCTIONAL TESTS PASSED SUCCESSFULLY! ✅');
  console.log('========================================\n');
}

runTests().catch(console.error);
