export const QUESTION_BANK = [
  // ================= MATHEMATICS =================
  {
    id: 'm1-01',
    subject: 'math',
    session: 1,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Natural Domain of a Rational Radical Function',
    prompt: 'What is the natural domain of the function f(x) = \\frac{\\sqrt{4 - x^2}}{x - 1}?',
    mathPrompt: true,
    options: [
      '[-2, 2]',
      '[-2, 1) \\cup (1, 2]',
      '(-\\infty, -2] \\cup [2, \\infty)',
      '(-2, 1) \\cup (1, 2)'
    ],
    correctAnswer: 1,
    explanation: 'Condition 1: Inside radical must be non-negative: 4 - x^2 >= 0 => x^2 <= 4 => -2 <= x <= 2. Condition 2: Denominator cannot be zero: x - 1 != 0 => x != 1. Combining both gives [-2, 1) U (1, 2].'
  },
  {
    id: 'm1-02',
    subject: 'math',
    session: 1,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Algebraic Limit with Conjugate Rationalization',
    prompt: 'Evaluate the limit: \\lim_{x \\to 0} \\frac{\\sqrt{9 + x} - 3}{x}. Enter the exact decimal value.',
    mathPrompt: true,
    correctAnswer: 0.167,
    tolerance: 0.005,
    unit: '',
    solution: 'Direct substitution yields 0/0. Multiply numerator and denominator by conjugate (\\sqrt{9+x} + 3):\n\\frac{(\\sqrt{9+x} - 3)(\\sqrt{9+x} + 3)}{x(\\sqrt{9+x} + 3)} = \\frac{(9+x) - 9}{x(\\sqrt{9+x} + 3)} = \\frac{x}{x(\\sqrt{9+x} + 3)} = \\frac{1}{\\sqrt{9+x} + 3}.\nTaking limit as x -> 0 gives 1 / (\\sqrt{9} + 3) = 1 / 6 = 0.1667.'
  },
  {
    id: 'm1-03',
    subject: 'math',
    session: 2,
    difficulty: 'Exam-style',
    type: 'free-response',
    title: 'Continuity & Piecewise Parameter Finding',
    prompt: 'Find constants a and b such that f(x) is continuous everywhere on \\mathbb{R}:\n\nf(x) = \\begin{cases} ax + 3 & x < 2 \\\\ 5 & x = 2 \\\\ 2x^2 + b & x > 2 \\end{cases}',
    mathPrompt: true,
    points: 8,
    rubric: [
      { criterion: 'State condition for continuity at x = 2: lim_{x->2^-} f(x) = f(2) = lim_{x->2^+} f(x)', marks: 2 },
      { criterion: 'Set up left-hand limit equation: 2a + 3 = 5 and solve a = 1', marks: 3 },
      { criterion: 'Set up right-hand limit equation: 2(2)^2 + b = 5 => 8 + b = 5 and solve b = -3', marks: 3 }
    ],
    modelAnswer: 'For continuity at x = 2, we require lim_{x->2^-} f(x) = f(2) = lim_{x->2^+} f(x) = 5.\n\nLeft-hand limit: lim_{x->2^-} (ax + 3) = 2a + 3 = 5 => 2a = 2 => a = 1.\nRight-hand limit: lim_{x->2^+} (2x^2 + b) = 2(4) + b = 8 + b = 5 => b = -3.\n\nTherefore, a = 1 and b = -3.'
  },

  // ================= PHYSICS =================
  {
    id: 'p2-01',
    subject: 'physics',
    session: 2,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Series Resistor Power Dissipation',
    prompt: 'Two resistors R1 = 4 \\Omega and R2 = 8 \\Omega are connected in series to an ideal 24 V DC supply. What is the power dissipated in R2?',
    mathPrompt: true,
    options: [
      '16 W',
      '32 W',
      '48 W',
      '64 W'
    ],
    correctAnswer: 1,
    explanation: 'Total resistance R_eq = 4 + 8 = 12 \\Omega. Circuit current I = V / R_eq = 24 / 12 = 2 A. Power in R2 is P = I^2 * R2 = (2)^2 * 8 = 4 * 8 = 32 W.'
  },
  {
    id: 'p2-02',
    subject: 'physics',
    session: 2,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Loaded Battery Terminal Voltage',
    prompt: 'A real DC battery has an electromotive force (EMF) of 12.0 V and an internal resistance of 0.50 \\Omega. When connected across a 5.50 \\Omega load resistor, calculate the terminal voltage in Volts.',
    correctAnswer: 11.0,
    tolerance: 0.1,
    unit: 'V',
    solution: 'Total circuit resistance R_total = R_load + r = 5.50 + 0.50 = 6.00 \\Omega.\nCurrent I = EMF / R_total = 12.0 / 6.00 = 2.00 A.\nTerminal voltage V_terminal = EMF - I*r = 12.0 - (2.00 * 0.50) = 12.0 - 1.00 = 11.0 V. Alternatively, V_term = I * R_load = 2.00 * 5.50 = 11.0 V.'
  },
  {
    id: 'p2-03',
    subject: 'physics',
    session: 2,
    difficulty: 'Exam-style',
    type: 'free-response',
    title: 'Bridge Circuit & Voltage Divider Derivation',
    prompt: 'Consider a voltage divider circuit where input voltage V_in = 30 V is applied across R1 = 100 \\Omega and R2 = 200 \\Omega in series. (a) Derive the formula for output voltage V_out across R2 using Ohm’s Law. (b) Calculate V_out. (c) If a 200 \\Omega meter is connected in parallel across R2, calculate the loaded output voltage.',
    mathPrompt: true,
    points: 10,
    rubric: [
      { criterion: 'Derive VDR formula V_out = V_in * (R2 / (R1 + R2)) showing current I = V_in / (R1 + R2)', marks: 3 },
      { criterion: 'Calculate unloaded V_out = 30 * (200 / 300) = 20.0 V', marks: 3 },
      { criterion: 'Find loaded parallel equivalent R2_loaded = (200 * 200) / 400 = 100 \\Omega and recalculate V_out = 30 * (100 / 200) = 15.0 V', marks: 4 }
    ],
    modelAnswer: '(a) Circuit current I = V_in / (R1 + R2). Voltage across R2 is V_out = I * R2 = V_in * [R2 / (R1 + R2)].\n\n(b) V_out = 30 * (200 / 300) = 20.0 V.\n\n(c) When loaded by 200 \\Omega in parallel with R2, R_parallel = (200 * 200) / (200 + 200) = 100 \\Omega.\nNew total resistance = 100 + 100 = 200 \\Omega.\nLoaded V_out = 30 * (100 / 200) = 15.0 V (demonstrates the loading effect of non-ideal voltmeters).'
  },

  // ================= COMPUTER SCIENCE =================
  {
    id: 'cs2-01',
    subject: 'cs',
    session: 2,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'IEEE 754 Exponent Bias Calculation',
    prompt: 'In IEEE 754 single-precision (32-bit) floating-point format, what 8-bit binary pattern represents the actual exponent E = -3?',
    options: [
      '01111100 (124 decimal)',
      '01111011 (123 decimal)',
      '10000010 (130 decimal)',
      '11111101 (253 decimal)'
    ],
    correctAnswer: 0,
    explanation: 'In 32-bit single-precision float, exponent bias is +127. Stored Exponent = E_actual + 127 = -3 + 127 = 124. 124 in binary is 01111100.'
  },
  {
    id: 'cs2-02',
    subject: 'cs',
    session: 2,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Bitwise Logic Masking Result',
    prompt: 'Given uint8 integer x = 0x5A (binary 01011010), compute the decimal value of: (x ^ 0x0F) & 0xF0',
    correctAnswer: 80,
    tolerance: 0,
    unit: '',
    solution: 'Step 1: 0x5A = 0101 1010.\nStep 2: 0x0F = 0000 1111.\nx ^ 0x0F = 0101 0101 (0x55).\nStep 3: 0x55 & 0xF0 (1111 0000) = 0101 0000 (0x50).\n0x50 in decimal = 5 * 16 = 80.'
  },
  {
    id: 'cs2-03',
    subject: 'cs',
    session: 2,
    difficulty: 'Exam-style',
    type: 'free-response',
    title: 'Manual IEEE 754 Floating-Point Encoding',
    prompt: 'Encode the decimal number -13.625 into 32-bit IEEE 754 single-precision floating-point representation. Show: (a) Binary conversion, (b) Normalized scientific form, (c) Sign bit, biased exponent, and mantissa bit fields, (d) Final 8-digit hexadecimal representation.',
    mathPrompt: true,
    points: 10,
    rubric: [
      { criterion: 'Convert integer 13 = 1101_2 and fractional 0.625 = 0.101_2 => 1101.101_2', marks: 2 },
      { criterion: 'Normalize to 1.101101_2 * 2^3 (Exponent = 3)', marks: 2 },
      { criterion: 'Compute Sign=1, Biased Exponent = 3 + 127 = 130 = 10000010_2, Mantissa = 10110100000000000000000_2', marks: 3 },
      { criterion: 'Pack into 32-bit word 1 10000010 10110100000000000000000 => 0xC15A0000', marks: 3 }
    ],
    modelAnswer: '(a) Integer 13 in binary is 1101_2. Fractional 0.625 = (0.5 + 0.125) = 2^-1 + 2^-3 = 0.101_2. Total: 1101.101_2.\n\n(b) Normalize: 1101.101_2 = 1.101101_2 * 2^3. True exponent E = 3.\n\n(c) Fields:\n- Sign bit (S): 1 (since number is negative)\n- Biased Exponent (E): 3 + 127 = 130 = 10000010_2\n- Mantissa (M): Drop leading 1, pad to 23 bits: 10110100000000000000000_2\n\n(d) Packed bits:\n1100 0001 0101 1010 0000 0000 0000 0000\nGroup into nibbles: C 1 5 A 0 0 0 0 => 0xC15A0000.'
  }
];
