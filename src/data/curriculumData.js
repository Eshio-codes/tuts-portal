export const SUBJECTS = [
  { id: 'math', name: 'Mathematics', color: 'cyan', icon: 'Calculator' },
  { id: 'physics', name: 'Physics', color: 'emerald', icon: 'Zap' },
  { id: 'cs', name: 'Computer Science', color: 'violet', icon: 'Cpu' },
];

export const CURRICULUM = {
  math: [
    {
      session: 1,
      title: 'Functions, Domain/Range & Intro to Limits',
      duration: '120 min',
      status: 'Ready',
      topics: ['Function types & mappings', 'Domain, Codomain, Range', 'Piecewise & Absolute value functions', 'Intuitive definition of a limit', 'One-sided limits'],
      keyFormulas: [
        '\\lim_{x \\to c} f(x) = L \\iff \\lim_{x \\to c^-} f(x) = \\lim_{x \\to c^+} f(x) = L',
        '\\text{Domain of } \\frac{1}{g(x)}: \\{x \\in \\mathbb{R} \\mid g(x) \\neq 0\\}',
        '\\text{Domain of } \\sqrt{g(x)}: \\{x \\in \\mathbb{R} \\mid g(x) \\ge 0\\}'
      ],
      overview: 'Foundation of differential calculus: understanding how functions behave locally and globally. Transition from algebraic substitution to limiting behavior as variables approach singularity points.',
      sections: [
        {
          heading: '1. Functions as Mappings & Constraints',
          content: 'A function f: A -> B associates each element in domain A to exactly one output in codomain B. When finding natural domains, observe the Golden Rules: denominators cannot be zero, even roots cannot take negative values, and logarithms require strictly positive arguments.'
        },
        {
          heading: '2. The Intuitive Limit Concept',
          content: 'We write lim (x -> c) f(x) = L when f(x) gets arbitrarily close to L as x approaches c from both sides, independent of whether f(c) is defined. If left-hand limit != right-hand limit, the two-sided limit Does Not Exist (DNE).'
        },
        {
          heading: '3. Indeterminate Forms: 0/0 and Infinity/Infinity',
          content: 'Direct substitution yielding 0/0 indicates a common factor or algebraic bottleneck. Tools include: (a) Factoring & canceling, (b) Conjugate rationalization for radicals, (c) Trigonometric identities.'
        }
      ],
      diagramUrl: null
    },
    {
      session: 2,
      title: 'Limit Laws, Continuity & Squeeze Theorem',
      duration: '120 min',
      status: 'Ready',
      topics: ['Algebraic limit properties', 'Formal definition of continuity', 'Types of discontinuity (Removable, Jump, Essential)', 'Squeeze (Sandwich) Theorem', 'Special trig limit proofs'],
      keyFormulas: [
        '\\lim_{x \\to c} [f(x) \\pm g(x)] = \\lim_{x \\to c} f(x) \\pm \\lim_{x \\to c} g(x)',
        '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1, \\quad \\lim_{x \\to 0} \\frac{1 - \\cos x}{x} = 0',
        'f(x) \\le g(x) \\le h(x) \\implies \\lim g(x) = L \\text{ if } \\lim f(x) = \\lim h(x) = L'
      ],
      overview: 'Rigorous tools for calculating non-trivial limits. Establishing continuity at a point and over an interval using the 3-part continuity criterion.',
      sections: [
        {
          heading: '1. The 3-Part Continuity Test',
          content: 'Function f(x) is continuous at x = c if and only if: 1. f(c) is defined; 2. lim (x->c) f(x) exists; 3. lim (x->c) f(x) = f(c).'
        },
        {
          heading: '2. The Squeeze Theorem',
          content: 'Used when direct algebraic simplification fails, particularly with oscillating functions like x^2 * sin(1/x) near x=0. Since -1 <= sin(1/x) <= 1, multiplying by x^2 bounds the function between -x^2 and +x^2, both of which vanish at 0.'
        }
      ],
      diagramUrl: null
    },
    {
      session: 3,
      title: 'The Derivative from First Principles',
      duration: '120 min',
      status: 'Upcoming',
      topics: ['Secant slope to tangent line', 'Difference quotient', 'Differentiability implies continuity', 'Power, product, and quotient rules'],
      keyFormulas: [
        "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        "\\frac{d}{dx}[x^n] = n x^{n-1}",
        "\\frac{d}{dx}[u \\cdot v] = u'v + uv'"
      ],
      overview: 'Geometric and physical meaning of instantaneous rate of change. Constructing tangent lines and mastering standard differentiation rules.'
    }
  ],
  physics: [
    {
      session: 1,
      title: 'Kinematics in 1D & 2D (Projectiles & Vectors)',
      duration: '120 min',
      status: 'Completed',
      topics: ['Position, velocity, and acceleration vectors', 'SUVAT kinematic equations with constant acceleration', 'Projectile motion decomposition', 'Relative velocity in 2D'],
      keyFormulas: [
        'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad v^2 = u^2 + 2as',
        'R = \\frac{u^2 \\sin(2\\theta)}{g}, \\quad H = \\frac{u^2 \\sin^2(\\theta)}{2g}',
        't_{\\text{flight}} = \\frac{2u \\sin(\\theta)}{g}'
      ],
      overview: 'Motion under constant acceleration. Decoupling horizontal and vertical vector components with independent orthogonal equations.',
      sections: [
        {
          heading: '1. 1D Motion Principles',
          content: 'Velocity is derivative of position; acceleration is derivative of velocity. For constant acceleration a, integrate to obtain the 4 fundamental SUVAT relations.'
        },
        {
          heading: '2. Projectile Independence Principle',
          content: 'Horizontal motion has ax = 0 (constant vx = u cos theta). Vertical motion has ay = -g (freefall with vy = u sin theta - gt). Time of flight links the two orthogonal dimensions.'
        }
      ]
    },
    {
      session: 2,
      title: 'Circuits, Ohm’s Law, Dividers & Power Dissipation',
      duration: '120 min',
      status: 'Ready',
      topics: ['Drift velocity & charge carriers', "Ohm's Law (V = IR)", "Kirchhoff's Current & Voltage Laws (KCL, KVL)", 'Series vs Parallel equivalences', 'Voltage Divider (VDR) & Current Divider (CDR)', 'Internal Resistance & EMF'],
      keyFormulas: [
        'V = I R, \\quad P = V I = I^2 R = \\frac{V^2}{R}',
        'R_{\\text{series}} = \\sum R_i, \\quad \\frac{1}{R_{\\text{parallel}}} = \\sum \\frac{1}{R_i}',
        'V_k = V_{\\text{total}} \\left( \\frac{R_k}{\\sum R} \\right) \\quad [\\text{VDR}]',
        'I_1 = I_{\\text{total}} \\left( \\frac{R_2}{R_1 + R_2} \\right) \\quad [\\text{CDR}]',
        'V_{\\text{terminal}} = \\mathcal{E} - I r'
      ],
      overview: 'Comprehensive DC circuit analysis: applying conservation of charge (KCL) and energy (KVL) to multi-resistor ladders and real power sources with internal resistance.',
      sections: [
        {
          heading: '1. Kirchhoff’s Laws (Conservation Laws)',
          content: 'KCL: The sum of currents entering any node equals zero (Conservation of Charge). KVL: The algebraic sum of potential differences around any closed circuit loop equals zero (Conservation of Energy).'
        },
        {
          heading: '2. Voltage & Current Dividers',
          content: 'In a series circuit, each resistor takes a fraction of total voltage proportional to its resistance (V_k = V_in * (R_k / R_total)). In parallel, current divides inversely proportional to branch resistance.'
        },
        {
          heading: '3. Non-Ideal Power Sources',
          content: 'A real battery has an ideal EMF (E) in series with internal resistance r. As load current I increases, internal voltage drop (I*r) grows, causing terminal voltage V_term = E - I*r to drop.'
        }
      ],
      diagrams: [
        { title: 'Series Circuit Analysis', src: '/images/physics_series_circuit.png', desc: 'Current is identical; voltages add up across resistors.' },
        { title: 'Parallel Circuit Analysis', src: '/images/physics_parallel_circuit.png', desc: 'Voltage is identical; currents divide through branches.' },
        { title: 'Voltage & Current Divider Ladder', src: '/images/physics_dividers_and_ladder.png', desc: 'Applying VDR and CDR to compute node potentials.' }
      ]
    },
    {
      session: 3,
      title: 'Work, Energy, Power & Conservation',
      duration: '120 min',
      status: 'Upcoming',
      topics: ['Work-Energy Theorem', 'Conservative vs Non-conservative forces', 'Gravitational and Elastic Potential Energy', 'Mechanical Efficiency'],
      keyFormulas: [
        'W = \\vec{F} \\cdot \\vec{d} = F d \\cos(\\theta)',
        'E_k = \\frac{1}{2} m v^2, \\quad E_p = m g h, \\quad E_e = \\frac{1}{2} k x^2',
        'W_{\\text{net}} = \\Delta E_k, \\quad P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}'
      ],
      overview: 'Energy as invariant scalar currency of physics. Translating complex trajectory dynamics into conservation laws.'
    }
  ],
  cs: [
    {
      session: 1,
      title: 'Computer Architecture & Signed Integers',
      duration: '120 min',
      status: 'Completed',
      topics: ['Von Neumann Architecture (CPU, ALU, CU, Registers, Bus)', 'Fetch-Decode-Execute Cycle', "Unsigned vs Sign-Magnitude vs 1's Complement", "2's Complement representation & overflow detection"],
      keyFormulas: [
        '\\text{2\'s Complement of } X = (\\sim X) + 1',
        '\\text{Range for } n\\text{-bit signed integer}: [-2^{n-1}, 2^{n-1} - 1]',
        '\\text{Range for } 8\\text{-bit}: [-128, +127]'
      ],
      overview: 'How hardware executes instructions and handles negative numbers in arithmetic logic units without requiring separate subtractor circuits.',
      sections: [
        {
          heading: '1. Von Neumann Architecture',
          content: 'Key components: Central Processing Unit (Control Unit, ALU, Registers like PC, MAR, MDR, CIR, Accumulator), Memory Unit (stores both data and program instructions in the same address space), and System Buses (Data, Address, Control).'
        },
        {
          heading: "2. Two's Complement Arithmetic",
          content: "To negate an n-bit binary number, invert all bits and add 1. Two's complement allows subtraction (A - B) to be computed simply as A + (-B) using identical addition circuitry. Overflow occurs when adding two numbers of the same sign produces an opposite sign result."
        }
      ]
    },
    {
      session: 2,
      title: 'IEEE 754 Floating-Point, Base Conversions & Bitwise Logic',
      duration: '120 min',
      status: 'Ready',
      topics: ['Base conversions: Binary, Octal, Decimal, Hexadecimal', 'IEEE 754 Single-Precision 32-bit Float Format', 'Sign bit (1), Biased Exponent (8 bits, bias 127), Mantissa (23 bits)', 'Special values (+/-Inf, NaN, Subnormals, +/-0)', 'Bitwise Operations: AND, OR, XOR, NOT, Left/Right Shifts'],
      keyFormulas: [
        'V = (-1)^S \\times 1.M \\times 2^{E - 127} \\quad [\\text{Normalized Single-Precision}]',
        'E_{\\text{stored}} = E_{\\text{actual}} + 127',
        'x \\ll k = x \\times 2^k, \\quad x \\gg k = \\lfloor x / 2^k \\rfloor',
        'x \\oplus x = 0, \\quad x \\oplus 0 = x, \\quad x \\text{ \\& } (x-1) = \\text{clear lowest set bit}'
      ],
      overview: 'Representing real numbers in finite silicon words. Understanding float rounding inaccuracies, hexadecimal shorthand, and hardware bit-manipulation primitives.',
      sections: [
        {
          heading: '1. IEEE 754 32-bit Layout',
          content: '1 Sign bit (0 = positive, 1 = negative), 8 Exponent bits (biased by +127, values 1 to 254 for normalized), 23 Fraction bits (implicit leading 1: 1.F). Exponent 255 with F=0 represents Infinity; Exponent 255 with F!=0 represents NaN.'
        },
        {
          heading: '2. Bitwise Logic & Masking',
          content: 'Bitwise AND (&) masks and clears bits. Bitwise OR (|) sets bits. Bitwise XOR (^) flips bits and computes parity. Bit shifts (<<, >>) provide ultra-fast multiplication and division by powers of 2.'
        }
      ],
      diagrams: [
        { title: 'IEEE 754 32-Bit Single Precision Layout', src: '/images/cs_ieee754_structure.png', desc: '1-bit sign, 8-bit biased exponent, 23-bit normalized mantissa.' },
        { title: 'Number Bases & Bitwise Logic Matrix', src: '/images/cs_bases_and_bitwise.png', desc: 'Truth tables, hex-binary nibble mappings, and register masks.' }
      ]
    },
    {
      session: 3,
      title: 'Python Control Flow, Functions & Complexity',
      duration: '120 min',
      status: 'Upcoming',
      topics: ['Conditionals & match-case', 'Iteration patterns & list comprehensions', 'Pure functions, scope, and recursion', 'Intro to Time Complexity O(1) vs O(n) vs O(n^2)'],
      keyFormulas: [
        'T(n) = O(f(n)) \\iff \\exists c > 0, n_0 > 0 \\text{ s.t. } |T(n)| \\le c|f(n)| \\; \\forall n \\ge n_0'
      ],
      overview: 'Translating algorithmic thinking into clean, idiomatic Python. Analyzing loop performance and recursive call stacks.'
    }
  ]
};
