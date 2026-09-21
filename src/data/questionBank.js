export const QUESTION_BANK = [
  // =========================================================================
  // ============================ MATHEMATICS ================================
  // =========================================================================
  {
    id: 'm1-01',
    subject: 'math',
    session: 1,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Natural Domain of a Rational Radical Function',
    prompt: 'What is the natural domain of the function f(x) = \\frac{\\sqrt{4 - x^2}}{x - 1} in the real numbers \\mathbb{R}?',
    mathPrompt: true,
    options: [
      '[-2, 2]',
      '[-2, 1) \\cup (1, 2]',
      '(-\\infty, -2] \\cup [2, \\infty)',
      '(-2, 1) \\cup (1, 2)'
    ],
    correctAnswer: 1,
    explanation: 'Condition 1: Inside radical must be non-negative: 4 - x^2 >= 0 => x^2 <= 4 => -2 <= x <= 2. Condition 2: Denominator cannot be zero: x - 1 != 0 => x != 1. Combining both constraints with interval notation gives [-2, 1) U (1, 2].'
  },
  {
    id: 'm1-02',
    subject: 'math',
    session: 1,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Algebraic Limit with Conjugate Rationalization',
    prompt: 'Evaluate the limit: \\lim_{x \\to 0} \\frac{\\sqrt{9 + x} - 3}{x}. Enter the exact decimal value to 3 decimal places.',
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
  {
    id: 'm1-04',
    subject: 'math',
    session: 2,
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    title: 'Special Trigonometric Limit Evaluation',
    prompt: 'Evaluate the limit: \\lim_{x \\to 0} \\frac{\\sin(5x)}{\\tan(2x)}.',
    mathPrompt: true,
    options: [
      '0',
      '1',
      '\\frac{5}{2}',
      '\\frac{2}{5}'
    ],
    correctAnswer: 2,
    explanation: 'Rewrite \\tan(2x) = \\frac{\\sin(2x)}{\\cos(2x)}. The expression becomes \\frac{\\sin(5x)}{\\sin(2x)} \\cdot \\cos(2x) = \\frac{\\frac{\\sin(5x)}{5x} \\cdot 5x}{\\frac{\\sin(2x)}{2x} \\cdot 2x} \\cdot \\cos(2x). As x -> 0, \\frac{\\sin(5x)}{5x} -> 1, \\frac{\\sin(2x)}{2x} -> 1, and \\cos(0) = 1. Hence the limit is \\frac{5}{2} = 2.5.'
  },
  {
    id: 'm1-05',
    subject: 'math',
    session: 3,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Derivative of a Quotient with Chain Rule',
    prompt: 'Find the derivative \\frac{d}{dx} \\left[ \\frac{e^{3x}}{x^2 + 1} \\right] at x = 0.',
    mathPrompt: true,
    options: [
      '3',
      '0',
      '1',
      '-3'
    ],
    correctAnswer: 0,
    explanation: 'Using Quotient Rule: \\frac{u\'v - uv\'}{v^2}. Here u = e^{3x}, u\' = 3e^{3x}, v = x^2+1, v\' = 2x. At x = 0: u(0) = 1, u\'(0) = 3, v(0) = 1, v\'(0) = 0. Thus, f\'(0) = \\frac{3(1) - 1(0)}{1^2} = 3.'
  },
  {
    id: 'm1-06',
    subject: 'math',
    session: 4,
    difficulty: 'Exam-style',
    type: 'numeric',
    title: 'Box Construction Volume Optimization',
    prompt: 'A rectangular sheet of cardboard measures 12 cm by 12 cm. Identical squares of side length x cm are cut from each of the 4 corners, and the flaps are folded up to form an open-top box. Calculate the value of x (in cm) that maximizes the enclosed box volume.',
    correctAnswer: 2.0,
    tolerance: 0.05,
    unit: 'cm',
    solution: 'Box dimensions: length = (12 - 2x), width = (12 - 2x), height = x. Volume V(x) = x(12 - 2x)^2 = x(144 - 48x + 4x^2) = 4x^3 - 48x^2 + 144x.\nTake derivative: V\'(x) = 12x^2 - 96x + 144 = 12(x^2 - 8x + 12) = 12(x - 2)(x - 6).\nFeasible domain for x is (0, 6). Critical point in domain is x = 2 cm. V\'\'(2) = 24(2) - 96 = -48 < 0 (confirms local maximum). Maximum volume is V(2) = 2(8)^2 = 128 cm^3.'
  },

  // =========================================================================
  // ============================= PHYSICS ===================================
  // =========================================================================
  {
    id: 'p1-01',
    subject: 'physics',
    session: 1,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: '2D Projectile Maximum Height & Range',
    prompt: 'A projectile is launched from ground level with initial speed u = 20.0 \\text{ m/s} at an angle \\theta = 30.0^\\circ above the horizontal over flat terrain (take g = 9.80 \\text{ m/s}^2). What is the maximum height H reached by the projectile?',
    mathPrompt: true,
    options: [
      '5.10 m',
      '10.20 m',
      '15.30 m',
      '20.40 m'
    ],
    correctAnswer: 0,
    explanation: 'Vertical component u_y = u * sin(30) = 20.0 * 0.5 = 10.0 m/s. At peak height, v_y = 0. Using v_y^2 = u_y^2 - 2gH => 0 = 10.0^2 - 2(9.80)H => H = 100 / 19.6 = 5.102 m.'
  },
  {
    id: 'p1-02',
    subject: 'physics',
    session: 1,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Total Flight Time of an Elevated Projectile',
    prompt: 'A stone is launched horizontally with velocity v_x = 15.0 \\text{ m/s} from the top of a cliff of height h = 44.1 \\text{ m}. Calculate the total time of flight (in seconds) before it strikes the flat ground below (take g = 9.80 \\text{ m/s}^2).',
    correctAnswer: 3.0,
    tolerance: 0.05,
    unit: 's',
    solution: 'Vertical motion has initial vertical velocity u_y = 0. Using s_y = u_y t + 0.5 g t^2 => 44.1 = 0 + 0.5(9.80)t^2 => 4.90 t^2 = 44.1 => t^2 = 9.0 => t = 3.00 s.'
  },
  {
    id: 'p2-01',
    subject: 'physics',
    session: 2,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Series Resistor Power Dissipation',
    prompt: 'Two resistors R1 = 4 \\Omega and R2 = 8 \\Omega are connected in series to an ideal 24 V DC supply. What is the electrical power dissipated in R2?',
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
    title: 'Loaded Battery Terminal Voltage with Internal Resistance',
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
  {
    id: 'p3-01',
    subject: 'physics',
    session: 3,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Work-Energy Theorem with Incline Friction',
    prompt: 'A 2.0 kg block slides 5.0 m down a frictionless ramp inclined at 30 degrees to the horizontal. What is the work done by the gravitational force on the block (take g = 9.8 m/s^2)?',
    options: [
      '49.0 J',
      '98.0 J',
      '24.5 J',
      '84.9 J'
    ],
    correctAnswer: 0,
    explanation: 'Vertical height dropped h = d * sin(30) = 5.0 * 0.5 = 2.5 m. Work done by gravity W_g = m * g * h = 2.0 * 9.8 * 2.5 = 49.0 J.'
  },

  // =========================================================================
  // ======================== COMPUTER SCIENCE ===============================
  // =========================================================================
  {
    id: 'cs1-01',
    subject: 'cs',
    session: 1,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Two’s Complement Range and Negation',
    prompt: 'What is the 8-bit two’s complement binary representation of decimal -45?',
    options: [
      '11010011',
      '11010010',
      '00101101',
      '10101101'
    ],
    correctAnswer: 0,
    explanation: 'Step 1: +45 in 8-bit binary is 00101101. Step 2: Invert all bits (1s complement) => 11010010. Step 3: Add 1 => 11010011.'
  },
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
  },
  {
    id: 'cs3-01',
    subject: 'cs',
    session: 3,
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    title: 'Recurrence Relation & Master Theorem',
    prompt: 'What is the tight asymptotic time complexity of a recursive algorithm with recurrence T(n) = 2T(n/2) + O(n)?',
    options: [
      'O(n)',
      'O(n \\log n)',
      'O(n^2)',
      'O(\\log n)'
    ],
    correctAnswer: 1,
    explanation: 'By Master Theorem: a = 2, b = 2, f(n) = O(n). Here \\log_b(a) = \\log_2(2) = 1. Since f(n) = \\Theta(n^{\\log_b a}) = \\Theta(n^1), this is Case 2 of Master Theorem. Hence T(n) = \\Theta(n \\log n).'
  }
];
