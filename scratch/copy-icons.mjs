import fs from 'fs';
import path from 'path';

const userProfile = process.env.USERPROFILE || 'C:\\Users\\harih';
const src = path.join(userProfile, '.gemini', 'antigravity-ide', 'brain', 'd2770da9-07a9-40b3-b658-f4f2fdabdd4d', '.user_uploaded', 'media_1788768486007.jpg');

const targetFiles = [
  path.resolve('public', 'spiher-logo.jpg'),
  path.resolve('public', 'icon-192.png'),
  path.resolve('public', 'icon-512.png'),
  path.resolve('public', 'apple-touch-icon.png'),
  path.resolve('public', 'favicon.png'),
];

for (const dest of targetFiles) {
  fs.copyFileSync(src, dest);
  console.log(`Copied to ${dest}`);
}
console.log('All PWA icon assets initialized successfully.');
