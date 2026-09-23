#!/usr/bin/env node
import crypto from 'crypto';

function sha256(str) {
  return crypto.createHash('sha256').update(str.trim().toUpperCase()).digest('hex');
}

function generateRandomSegment() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return rand;
}

const args = process.argv.slice(2);
let scope = 'all';
let prefix = 'STEM';
let customCode = null;

args.forEach((arg) => {
  const lower = arg.toLowerCase();
  if (lower === '--math' || lower === '-m') {
    scope = 'math';
    prefix = 'MATH';
  } else if (lower === '--phys' || lower === '--physics' || lower === '-p') {
    scope = 'physics';
    prefix = 'PHYS';
  } else if (lower === '--cs' || lower === '-c') {
    scope = 'cs';
    prefix = 'CS';
  } else if (lower === '--all' || lower === '-a') {
    scope = 'all';
    prefix = 'STEM';
  } else if (!arg.startsWith('-')) {
    customCode = arg;
  }
});

const code = (customCode || `${prefix}-${generateRandomSegment()}`).trim().toUpperCase();
const hash = sha256(code);

const scopeLabels = {
  all: '3-Course Comprehensive Pass (Math, Physics, CS)',
  math: 'Mathematics Examination Pass',
  physics: 'Physics Examination Pass',
  cs: 'Computer Science Examination Pass'
};

console.log('========================================================');
console.log('  STEM Pre-University Portal — Cryptographic Code Gen');
console.log('========================================================\n');
console.log(`Access Code      : ${code}`);
console.log(`Scope            : ${scope.toUpperCase()} (${scopeLabels[scope]})`);
console.log(`SHA-256 Hash     : ${hash}\n`);
console.log('--------------------------------------------------------');
console.log('Definition Object for EXAM_CODE_DEFINITIONS (src/auth/authConfig.js):');
console.log(`  {`);
console.log(`    hash: '${hash}',`);
console.log(`    scope: SCOPES.${scope.toUpperCase()},`);
console.log(`    label: '${code}',`);
console.log(`    desc: '${scopeLabels[scope]}'`);
console.log(`  },`);
console.log('--------------------------------------------------------');
console.log('Usage Examples:');
console.log('  npm run gen-code                   # Generates 3-Course STEM pass');
console.log('  npm run gen-code -- --math          # Generates Math-specific pass');
console.log('  npm run gen-code -- --phys          # Generates Physics-specific pass');
console.log('  npm run gen-code -- --cs            # Generates CS-specific pass');
console.log('  npm run gen-code -- MATH-FINALS26   # Hashes custom access code');
console.log('========================================================\n');

