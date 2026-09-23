import { describe, it, expect } from 'vitest';
import {
  TUTOR_PASSPHRASE_HASH,
  EXAM_CODE_HASHES,
  EXAM_CODE_DEFINITIONS,
  SCOPES,
  getCodeScope
} from '../auth/authConfig';
import crypto from 'crypto';

function nodeSha256(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

describe('Auth Configuration & Access Security', () => {
  it('correctly matches SHA-256 hash for tutor passphrase', () => {
    const calculated = nodeSha256('STEM-TUTOR-2026');
    expect(calculated).toBe(TUTOR_PASSPHRASE_HASH);
  });

  it('correctly matches SHA-256 hashes for all pre-configured exam access codes', () => {
    expect(EXAM_CODE_HASHES.length).toBe(EXAM_CODE_DEFINITIONS.length);

    EXAM_CODE_DEFINITIONS.forEach((def) => {
      const calculated = nodeSha256(def.label);
      expect(calculated).toBe(def.hash);
      expect(EXAM_CODE_HASHES.includes(def.hash)).toBe(true);
    });
  });

  it('accurately resolves course scopes for all defined passes', () => {
    // 3-Course general passes
    const allPass = EXAM_CODE_DEFINITIONS.find((d) => d.label === 'STEM-ALL3');
    expect(getCodeScope(allPass.hash, 'STEM-ALL3')).toBe(SCOPES.ALL);

    const cohortAlpha = EXAM_CODE_DEFINITIONS.find((d) => d.label === 'STEM-A1B2');
    expect(getCodeScope(cohortAlpha.hash, 'STEM-A1B2')).toBe(SCOPES.ALL);

    // Mathematics passes
    const mathPass = EXAM_CODE_DEFINITIONS.find((d) => d.label === 'MATH-CALC');
    expect(getCodeScope(mathPass.hash, 'MATH-CALC')).toBe(SCOPES.MATH);

    const mathM101 = EXAM_CODE_DEFINITIONS.find((d) => d.label === 'MATH-M101');
    expect(getCodeScope(mathM101.hash, 'MATH-M101')).toBe(SCOPES.MATH);

    // Physics passes
    const physPass = EXAM_CODE_DEFINITIONS.find((d) => d.label === 'PHYS-MECH');
    expect(getCodeScope(physPass.hash, 'PHYS-MECH')).toBe(SCOPES.PHYSICS);

    const physP101 = EXAM_CODE_DEFINITIONS.find((d) => d.label === 'PHYS-P101');
    expect(getCodeScope(physP101.hash, 'PHYS-P101')).toBe(SCOPES.PHYSICS);

    // Computer Science passes
    const csPass = EXAM_CODE_DEFINITIONS.find((d) => d.label === 'CS-ALGO');
    expect(getCodeScope(csPass.hash, 'CS-ALGO')).toBe(SCOPES.CS);

    const csC101 = EXAM_CODE_DEFINITIONS.find((d) => d.label === 'CS-C101');
    expect(getCodeScope(csC101.hash, 'CS-C101')).toBe(SCOPES.CS);
  });

  it('resolves fallback prefix heuristics for newly added custom codes', () => {
    const dummyHash = '0000000000000000000000000000000000000000000000000000000000000000';
    expect(getCodeScope(dummyHash, 'MATH-CUSTOM')).toBe(SCOPES.MATH);
    expect(getCodeScope(dummyHash, 'PHYS-CUSTOM')).toBe(SCOPES.PHYSICS);
    expect(getCodeScope(dummyHash, 'CS-CUSTOM')).toBe(SCOPES.CS);
    expect(getCodeScope(dummyHash, 'STEM-CUSTOM')).toBe(SCOPES.ALL);
    expect(getCodeScope(dummyHash, '')).toBe(SCOPES.ALL);
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
