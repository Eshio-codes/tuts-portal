/**
 * Auth Config — client-side access control
 *
 * All codes are hashed at runtime via crypto.subtle — these values are
 * SHA-256(code) computed in the browser. Never store plaintext codes here.
 *
 * Tutor passphrase : STEM-TUTOR-2026
 * Student exam codes: STEM-A1B2  STEM-C3D4  STEM-E5F6  STEM-G7H8  STEM-J9K0
 *
 * To add/rotate codes:
 *   1. Open browser console on any HTTPS page
 *   2. Run: crypto.subtle.digest('SHA-256', new TextEncoder().encode('NEW-CODE'))
 *        .then(b => console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
 *   3. Paste the result into the appropriate array below.
 */

// SHA-256("STEM-TUTOR-2026")
export const TUTOR_PASSPHRASE_HASH =
  '7f55f440c224c33539a382f07aaf45a637846f6fad969349b27a6ad5417b36d7';

/**
 * SHA-256 hashes of valid student exam access codes.
 * Codes are normalised to UPPERCASE before hashing.
 */
export const EXAM_CODE_HASHES = [
  // STEM-A1B2
  '946e558761665a1e41e8a78c3c4a4cc14f27ebc003b6b756b347a0a6f23547be',
  // STEM-C3D4
  '5599a83d6b4eaeb32cbb5c79de1487465aadc0e436ec342cb521f550d55a844f',
  // STEM-E5F6
  'c9ac18484ad3f3be329d5eae9e9e8f5cf96f95c9e612532de3da0e045b23991c',
  // STEM-G7H8
  'e6cee6622b40e3b6e3f2efa5f553970d91e0b14b28789b17ec9d052c5a59e24b',
  // STEM-J9K0
  '6a38cb546c8d9805365fe2626ebd728e4d17dd45806245636b2d58959e235655',
];
