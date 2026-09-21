export const SLIDE_DECKS = {
  'math-1': {
    subject: 'math',
    session: 1,
    title: 'Math Session 1: Functions, Domain/Range & Intro to Limits',
    subtitle: 'Foundation Sprint • Calculus I',
    slides: [
      {
        id: 1,
        title: 'Functions & Limits: The Gateway to Calculus',
        subtitle: 'From Static Algebra to Dynamic Rates of Change',
        points: [
          'Pre-calculus studies static values: f(2) = 4.',
          'Calculus studies behavior as we get infinitesimally close to points.',
          'Core Goal: Understand what happens when substitution breaks down (0/0).'
        ],
        notes: 'Hook the student: explain why static algebra fails when dividing by zero or analyzing instantaneous speed.'
      },
      {
        id: 2,
        title: 'Domain & Range Constraints',
        subtitle: 'The 3 Golden Rules of Real-Valued Functions',
        points: [
          '1. Denominators cannot be zero: g(x) != 0',
          '2. Even roots require non-negative inputs: g(x) >= 0',
          '3. Logarithms require strictly positive inputs: g(x) > 0'
        ],
        formula: 'f(x) = \\frac{\\sqrt{x+3}}{x-2} \\implies x \\ge -3 \\text{ and } x \\neq 2 \\implies [-3, 2) \\cup (2, \\infty)',
        notes: 'Emphasize interval notation. Test edge cases where root is in the denominator.'
      },
      {
        id: 3,
        title: 'Intuitive Concept of a Limit',
        subtitle: 'Approaching, Not Touching',
        points: [
          'The limit L is the value f(x) gets arbitrarily close to as x approaches c.',
          'f(c) does NOT need to exist for the limit to exist!',
          'Two-sided condition: Left-hand limit must equal Right-hand limit.'
        ],
        formula: '\\lim_{x \\to c} f(x) = L \\iff \\lim_{x \\to c^-} f(x) = \\lim_{x \\to c^+} f(x) = L',
        notes: 'Draw a graph on the board with a hole at (c, L). Show that the limit is still L.'
      },
      {
        id: 4,
        title: 'Tackling the 0/0 Indeterminate Form',
        subtitle: 'Direct Substitution Bottlenecks',
        points: [
          'Direct substitution gives 0/0 -> DO NOT write "undefined"!',
          'Strategy 1: Factoring & Canceling common binomials.',
          'Strategy 2: Conjugate Rationalization for square roots.',
          'Strategy 3: Trigonometric transformations.'
        ],
        formula: '\\lim_{x \\to 2} \\frac{x^2 - 4}{x - 2} = \\lim_{x \\to 2} \\frac{(x-2)(x+2)}{x-2} = \\lim_{x \\to 2} (x+2) = 4',
        notes: 'Walk through why canceling (x-2) is valid: x approaches 2, so x != 2 and (x-2)/(x-2) = 1.'
      },
      {
        id: 5,
        title: 'Key Takeaways & Session 1 Summary',
        subtitle: 'Foundational Checklist',
        points: [
          'Domain inspection requires scanning denominators and radicals.',
          'Limit existence requires matching one-sided limits.',
          '0/0 means "algebra required", not "undefined".',
          'Next Session: Squeeze theorem, continuity, and trig limits.'
        ],
        notes: 'Assign Practice Set 1 questions 1 to 5.'
      }
    ]
  },
  'physics-2': {
    subject: 'physics',
    session: 2,
    title: 'Physics Session 2: DC Circuits, Dividers & Power Dissipation',
    subtitle: 'Foundation Sprint • Electrical Physics',
    slides: [
      {
        id: 1,
        title: 'DC Circuits & Conservation Laws',
        subtitle: 'Charge and Energy in Closed Systems',
        points: [
          'Charge is conserved: sum of currents at any node is zero (KCL).',
          'Energy is conserved: sum of potential changes in any loop is zero (KVL).',
          'Ohm’s Law governs resistive voltage drops: V = I * R.'
        ],
        image: '/images/physics_series_circuit.png',
        notes: 'Remind student: KCL is conservation of charge; KVL is conservation of energy.'
      },
      {
        id: 2,
        title: 'Series vs Parallel Networks',
        subtitle: 'Equivalent Resistances and Behavior',
        points: [
          'Series: Same current I through all components. Resistances sum linearly.',
          'Parallel: Same voltage drop V across all branches. Conductances sum.',
          'Parallel shortcut for two resistors: R_eq = (R1 * R2) / (R1 + R2).'
        ],
        formula: 'R_{\\text{series}} = R_1 + R_2 + \\dots, \\quad \\frac{1}{R_{\\text{parallel}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots',
        image: '/images/physics_parallel_circuit.png',
        notes: 'Emphasize that parallel equivalent is always smaller than the smallest individual resistor.'
      },
      {
        id: 3,
        title: 'Voltage & Current Divider Rules (VDR & CDR)',
        subtitle: 'Direct Calculation Without Solving Full Systems',
        points: [
          'VDR (Series): Voltage splits in direct proportion to resistance.',
          'CDR (Parallel): Current splits in inverse proportion to branch resistance.',
          'Crucial for sensor conditioning and transistor biasing circuits.'
        ],
        formula: 'V_k = V_{\\text{total}} \\left(\\frac{R_k}{R_{\\text{total}}}\\right), \\quad I_1 = I_{\\text{total}} \\left(\\frac{R_2}{R_1 + R_2}\\right)',
        image: '/images/physics_dividers_and_ladder.png',
        notes: 'Point out the subscript swap in CDR: for I_1, the numerator is R_2!'
      },
      {
        id: 4,
        title: 'Real Batteries & Internal Resistance',
        subtitle: 'Terminal Voltage vs Electromotive Force (EMF)',
        points: [
          'Ideal source has 0 internal resistance: V_term = EMF (E).',
          'Real source has internal resistance r: V_term = E - I * r.',
          'Under short circuit (R_load = 0): I_max = E / r.',
          'Maximum power transfer theorem: R_load = r.'
        ],
        formula: 'P_{\\text{dissipated}} = I^2 R = \\frac{V^2}{R} = V I, \\quad V_{\\text{term}} = \\mathcal{E} - I r',
        notes: 'Show how terminal voltage drops as more devices are plugged into the circuit.'
      },
      {
        id: 5,
        title: 'Circuit Problem-Solving Algorithm',
        subtitle: '4-Step Systematic Approach',
        points: [
          '1. Simplify series and parallel clusters into equivalent single resistors.',
          '2. Find total source current I_total = E / (R_eq + r).',
          '3. Unpack backwards using VDR and CDR for individual branches.',
          '4. Verify power balance: P_supplied = sum(P_dissipated).'
        ],
        notes: 'Demonstrate with a 3-resistor ladder example from the worksheet.'
      }
    ]
  },
  'cs-2': {
    subject: 'cs',
    session: 2,
    title: 'CS Session 2: IEEE 754 Floats, Base Systems & Bitwise Logic',
    subtitle: 'Foundation Sprint • Computer Systems',
    slides: [
      {
        id: 1,
        title: 'Representing Numbers in Silicon',
        subtitle: 'From Integers to Real Floating-Point Numbers',
        points: [
          'Integers use fixed 2’s complement representation.',
          'Real numbers require dynamic scientific notation in binary: 1.F * 2^E.',
          'IEEE 754 is the universal hardware standard for floating-point arithmetic.'
        ],
        image: '/images/cs_ieee754_structure.png',
        notes: 'Explain why fixed-point numbers have too narrow a dynamic range for scientific computing.'
      },
      {
        id: 2,
        title: 'IEEE 754 Single-Precision (32-Bit) Breakdown',
        subtitle: '1 Sign Bit | 8 Exponent Bits | 23 Mantissa Bits',
        points: [
          'Sign bit (Bit 31): 0 = Positive (+), 1 = Negative (-).',
          'Biased Exponent (Bits 30-23): Stored = E_actual + 127.',
          'Mantissa / Fraction (Bits 22-0): Normalized with implicit leading 1: 1.M.',
          'Value formula: V = (-1)^S * (1.M) * 2^(E - 127).'
        ],
        formula: '(-1)^S \\times \\left(1 + \\sum_{i=1}^{23} b_{23-i} 2^{-i}\\right) \\times 2^{(E - 127)}',
        notes: 'Walk through converting decimal -6.75 into binary: -110.11_2 = -1.1011 * 2^2.'
      },
      {
        id: 3,
        title: 'Special IEEE 754 Values',
        subtitle: 'Edge Cases and Non-Numbers',
        points: [
          'Exponent = 255 (0xFF) & Mantissa = 0 -> +/- Infinity (e.g., 1.0 / 0.0)',
          'Exponent = 255 (0xFF) & Mantissa != 0 -> NaN (Not a Number, e.g., 0.0 / 0.0)',
          'Exponent = 0 & Mantissa = 0 -> +/- Zero',
          'Exponent = 0 & Mantissa != 0 -> Denormalized / Subnormal numbers'
        ],
        notes: 'Emphasize that in IEEE 754, NaN != NaN is always true in Python/C++.'
      },
      {
        id: 4,
        title: 'Bitwise Logic Operations & Masks',
        subtitle: 'Hardware-Level Manipulations',
        points: [
          'AND (&): Masking / Clearing bits (x & 0 = 0, x & 1 = x).',
          'OR (|): Setting bits (x | 1 = 1, x | 0 = x).',
          'XOR (^): Toggling bits & parity (x ^ x = 0, x ^ 0 = x).',
          'Shifts: (x << k) multiplies by 2^k; (x >> k) divides by 2^k.'
        ],
        image: '/images/cs_bases_and_bitwise.png',
        notes: 'Show Brian Kernighan’s algorithm: x & (x-1) removes the lowest set bit.'
      },
      {
        id: 5,
        title: 'Fast Hexadecimal Nibble Mapping',
        subtitle: 'Hex as Human-Readable Binary Shorthand',
        points: [
          '1 Hex digit = exactly 4 binary bits (1 nibble).',
          '0x0 to 0xF maps 0000 to 1111.',
          '0xA = 1010, 0xB = 1011, 0xC = 1100, 0xD = 1101, 0xE = 1110, 0xF = 1111.',
          'Example: 0x3F800000 is the IEEE 754 representation of +1.0f.'
        ],
        notes: 'Drill the student with quick hex-to-binary nibble conversions.'
      }
    ]
  }
};
