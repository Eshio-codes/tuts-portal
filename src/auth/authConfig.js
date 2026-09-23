/**
 * Auth Config — Client-side cryptographic access control and exam scoping
 *
 * Zero-backend authentication powered by Web Crypto SHA-256 digests.
 * Passphrases and student access codes are hashed at runtime.
 *
 * Code Types:
 *   - General / 3-Course Pass (STEM-* / ALL-*): Grants access to Math, Physics, and CS exams
 *   - Mathematics Pass (MATH-*): Grants access exclusively to Mathematics examinations
 *   - Physics Pass (PHYS-*): Grants access exclusively to Physics examinations
 *   - Computer Science Pass (CS-*): Grants access exclusively to Computer Science examinations
 */

// SHA-256("STEM-TUTOR-2026")
export const TUTOR_PASSPHRASE_HASH =
  '7f55f440c224c33539a382f07aaf45a637846f6fad969349b27a6ad5417b36d7';

export const SCOPES = {
  ALL: 'all',        // Access to all 3 courses (Math, Physics, CS, and Combined)
  MATH: 'math',      // Access to Mathematics exams only
  PHYSICS: 'physics',// Access to Physics exams only
  CS: 'cs'           // Access to Computer Science exams only
};

/**
 * Pre-configured exam access codes with explicit scopes
 */
export const EXAM_CODE_DEFINITIONS = [
  // --- 3-Course General / All-Access Codes ---
  {
    hash: '5d2defbd5e9fa3bcedd1fa7856ff2915a23f2acaa7bfbc34c99183fe3269e458', // STEM-ALL3
    scope: SCOPES.ALL,
    label: 'STEM-ALL3',
    desc: '3-Course Comprehensive Pass (Math, Phys, CS)'
  },
  {
    hash: '946e558761665a1e41e8a78c3c4a4cc14f27ebc003b6b756b347a0a6f23547be', // STEM-A1B2
    scope: SCOPES.ALL,
    label: 'STEM-A1B2',
    desc: '3-Course Cohort Alpha'
  },
  {
    hash: '5599a83d6b4eaeb32cbb5c79de1487465aadc0e436ec342cb521f550d55a844f', // STEM-C3D4
    scope: SCOPES.ALL,
    label: 'STEM-C3D4',
    desc: '3-Course Cohort Beta'
  },
  {
    hash: 'c9ac18484ad3f3be329d5eae9e9e8f5cf96f95c9e612532de3da0e045b23991c', // STEM-E5F6
    scope: SCOPES.ALL,
    label: 'STEM-E5F6',
    desc: '3-Course Cohort Gamma'
  },
  {
    hash: 'e6cee6622b40e3b6e3f2efa5f553970d91e0b14b28789b17ec9d052c5a59e24b', // STEM-G7H8
    scope: SCOPES.ALL,
    label: 'STEM-G7H8',
    desc: '3-Course Cohort Delta'
  },
  {
    hash: '6a38cb546c8d9805365fe2626ebd728e4d17dd45806245636b2d58959e235655', // STEM-J9K0
    scope: SCOPES.ALL,
    label: 'STEM-J9K0',
    desc: '3-Course Standard Pass'
  },

  // --- Mathematics Specific Exam Codes ---
  {
    hash: '190ba4334e9be79a9568b35a6bb52ed38dffdb22f0f8f4b52464c09a43f2a640', // MATH-CALC
    scope: SCOPES.MATH,
    label: 'MATH-CALC',
    desc: 'Mathematics Unit Mastery Pass'
  },
  {
    hash: '5e665145d9bb8cdbb8b2ba81cd8640f3a01183a6dacad88ae50e88529c4289a9', // MATH-M101
    scope: SCOPES.MATH,
    label: 'MATH-M101',
    desc: 'Calculus & Vectors Examination'
  },
  {
    hash: '846d1db8fa671af490c331ff31e42253f974c94af4701ae2d9cf164a0a7e9c80', // MATH-C3D4
    scope: SCOPES.MATH,
    label: 'MATH-C3D4',
    desc: 'Math Cohort Practice Key'
  },

  // --- Physics Specific Exam Codes ---
  {
    hash: '18b9f1f948b9748aa72ccc306be1bca49d2670a32c429255a81e84b9a4e7dd3b', // PHYS-MECH
    scope: SCOPES.PHYSICS,
    label: 'PHYS-MECH',
    desc: 'Physics Unit Mastery Pass'
  },
  {
    hash: 'd3247edd556b3a51213f32121bc90e61265e2ae7ba03b9571e617c4185442895', // PHYS-P101
    scope: SCOPES.PHYSICS,
    label: 'PHYS-P101',
    desc: 'Kinematics & Circuits Examination'
  },
  {
    hash: 'f5f7a1e04b7582e3aebb1a3ac818b782b89713d43cb765c7feafdb393932ecba', // PHYS-E5F6
    scope: SCOPES.PHYSICS,
    label: 'PHYS-E5F6',
    desc: 'Physics Cohort Practice Key'
  },

  // --- Computer Science Specific Exam Codes ---
  {
    hash: '25990fd2095d3b7837ffc0640392f7dd472df9690d4d2161e0ff1a536089520b', // CS-ALGO
    scope: SCOPES.CS,
    label: 'CS-ALGO',
    desc: 'Computer Science Unit Mastery Pass'
  },
  {
    hash: '0de333e23f810fd4ce1e279b1f50a6e6a0f4911082333e97fa6d642b87de82ce', // CS-C101
    scope: SCOPES.CS,
    label: 'CS-C101',
    desc: 'Architecture & Logic Examination'
  },
  {
    hash: 'ae62ee7c5baa3f591240d5a585396883aae5cdcca3746fa1ab47e7f890807a8d', // CS-G7H8
    scope: SCOPES.CS,
    label: 'CS-G7H8',
    desc: 'CS Cohort Practice Key'
  }
];

/**
 * Array of all valid SHA-256 hashes for fast lookup
 */
export const EXAM_CODE_HASHES = EXAM_CODE_DEFINITIONS.map((def) => def.hash);

/**
 * Resolves the allowed exam scope for a given code hash or raw code string
 * @param {string} hash - SHA-256 hash of the code
 * @param {string} [rawCode] - Optional plaintext code for fallback prefix parsing
 * @returns {'all' | 'math' | 'physics' | 'cs'}
 */
export function getCodeScope(hash, rawCode = '') {
  const match = EXAM_CODE_DEFINITIONS.find((def) => def.hash === hash);
  if (match) return match.scope;

  // Fallback heuristic based on prefix if a custom hash is added
  const normalized = (rawCode || '').trim().toUpperCase();
  if (normalized.startsWith('MATH-')) return SCOPES.MATH;
  if (normalized.startsWith('PHYS-')) return SCOPES.PHYSICS;
  if (normalized.startsWith('CS-')) return SCOPES.CS;
  return SCOPES.ALL;
}
