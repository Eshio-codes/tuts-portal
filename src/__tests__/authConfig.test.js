import { describe, it, expect } from 'vitest';
import { TUTOR_PASSPHRASE_HASH, EXAM_CODE_HASHES } from '../auth/authConfig';
import crypto from 'crypto';

function nodeSha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

describe('Auth Configuration & Access Security', () => {
  it('correctly matches SHA-256 hash for tutor passphrase', () => {
    const calculated = nodeSha256('STEM-TUTOR-2026');
    expect(calculated).toBe(TUTOR_PASSPHRASE_HASH);
  });

  it('correctly matches SHA-256 hashes for all student exam access codes', () => {
    const studentCodes = [
      'STEM-A1B2',
      'STEM-C3D4',
      'STEM-E5F6',
      'STEM-G7H8',
      'STEM-J9K0'
    ];

    expect(EXAM_CODE_HASHES.length).toBe(studentCodes.length);

    studentCodes.forEach((code, idx) => {
      const calculated = nodeSha256(code);
      expect(calculated).toBe(EXAM_CODE_HASHES[idx]);
    });
  });

  it('rejects invalid or lowercase codes unless normalised', () => {
    const invalidHash = nodeSha256('INVALID-CODE');
    expect(EXAM_CODE_HASHES.includes(invalidHash)).toBe(false);

    const lowercaseHash = nodeSha256('stem-a1b2');
    expect(EXAM_CODE_HASHES.includes(lowercaseHash)).toBe(false);

    // Normalised uppercase matches
    const normalisedHash = nodeSha256('stem-a1b2'.toUpperCase());
    expect(EXAM_CODE_HASHES.includes(normalisedHash)).toBe(true);
  });
});
