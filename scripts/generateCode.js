#!/usr/bin/env node
import crypto from 'crypto';

function sha256(str) {
  return crypto.createHash('sha256').update(str.trim().toUpperCase()).digest('hex');
}

function generateRandomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `STEM-${rand}`;
}

const args = process.argv.slice(2);
const inputCode = args[0] || generateRandomCode();
const normalized = inputCode.trim().toUpperCase();
const hash = sha256(normalized);

console.log('========================================================');
console.log('  STEM Pre-University Portal — Cryptographic Code Gen');
console.log('========================================================\n');
console.log(`Access Code      : ${normalized}`);
console.log(`SHA-256 Hash     : ${hash}\n`);
console.log('--------------------------------------------------------');
console.log('To add as a Student Exam Code:');
console.log(`Add '${hash}', to EXAM_CODE_HASHES in src/auth/authConfig.js`);
console.log('--------------------------------------------------------');
console.log('To set as Tutor Passphrase:');
console.log(`Set TUTOR_PASSPHRASE_HASH = '${hash}'; in src/auth/authConfig.js`);
console.log('========================================================\n');
