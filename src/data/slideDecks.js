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
  'math-3': {
    subject: 'math',
    session: 3,
    title: 'Math Session 3: Derivative from First Principles & Product/Quotient/Chain Rules',
    subtitle: 'Foundation Sprint • Differential Calculus',
    slides: [
      {
        id: 1,
        title: 'Instantaneous Rate of Change',
        subtitle: 'From Secant Lines to the Tangent Slope',
        points: [
          'Average velocity over [t, t+h] = [s(t+h) - s(t)] / h.',
          'Instantaneous velocity takes the limit as the interval h shrinks to 0.',
          'Geometric meaning: The slope of the tangent line at point (x, f(x)).'
        ],
        formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        notes: 'Illustrate secant lines rotating into the tangent line.'
      },
      {
        id: 2,
        title: 'Fundamental Differentiation Rules',
        subtitle: 'Algebraic Shortcuts from First Principles',
        points: [
          'Power Rule: d/dx [x^n] = n * x^(n-1)',
          'Exponential Rule: d/dx [e^x] = e^x',
          'Linearity: d/dx [af(x) + bg(x)] = a f\'(x) + b g\'(x)'
        ],
        formula: "\\frac{d}{dx}[5x^4 - 3x^2 + 7] = 20x^3 - 6x",
        notes: 'Remind students that constant terms differentiate to 0.'
      },
      {
        id: 3,
        title: 'The Product & Quotient Rules',
        subtitle: 'Differentiating Multiplied and Divided Functions',
        points: [
          'Product Rule: (uv)\' = u\'v + uv\' (NOT u\'v\')',
          'Quotient Rule: (u/v)\' = (u\'v - uv\') / v^2 (Low d-High minus High d-Low over Low-squared)',
          'Common pitfall: Sign error in quotient numerator.'
        ],
        formula: "\\frac{d}{dx}\\left[\\frac{\\sin x}{x^2}\\right] = \\frac{(\\cos x)(x^2) - (\\sin x)(2x)}{x^4} = \\frac{x\\cos x - 2\\sin x}{x^3}",
        notes: 'Have student practice quotient rule on board.'
      },
      {
        id: 4,
        title: 'The Chain Rule for Composite Functions',
        subtitle: 'Unpacking Nested Layers: f(g(x))',
        points: [
          'Derivative of outer evaluated at inner, times derivative of inner.',
          'Leibniz form: dy/dx = (dy/du) * (du/dx).',
          'Universal rule for powers of functions: d/dx [g(x)^n] = n g(x)^(n-1) g\'(x).'
        ],
        formula: "\\frac{d}{dx}\\left[(3x^2 + 5)^4\\right] = 4(3x^2 + 5)^3 \\cdot (6x) = 24x(3x^2 + 5)^3",
        notes: 'Emphasize peeling the layers from outside to inside.'
      }
    ]
  },
  'physics-1': {
    subject: 'physics',
    session: 1,
    title: 'Physics Session 1: Kinematics in 1D & 2D (Projectiles & Vectors)',
    subtitle: 'Foundation Sprint • Classical Mechanics',
    slides: [
      {
        id: 1,
        title: 'Kinematics: Describing Motion',
        subtitle: 'Vectors, Derivatives & Constant Acceleration',
        points: [
          'Displacement (s), Velocity (v = ds/dt), Acceleration (a = dv/dt).',
          'When acceleration a is constant, integration yields the 4 SUVAT equations.',
          'Always establish a coordinate origin and sign convention (+y up, +x right).'
        ],
        formula: 'v = u + at, \\quad s = ut + \\frac{1}{2}at^2, \\quad v^2 = u^2 + 2as',
        notes: 'Check if student understands that g is directed downwards (-9.8 m/s^2).'
      },
      {
        id: 2,
        title: 'Projectile Independence Principle',
        subtitle: 'Decoupling 2D Motion into Orthogonal 1D Components',
        points: [
          'Horizontal axis: ax = 0 -> constant velocity vx = u * cos(theta).',
          'Vertical axis: ay = -g -> freefall with vy = u * sin(theta) - gt.',
          'Time of flight (t) is the master scalar linking both dimensions.'
        ],
        formula: 'x(t) = (u \\cos\\theta) t, \\quad y(t) = h_0 + (u \\sin\\theta) t - \\frac{1}{2}gt^2',
        notes: 'Demonstrate with simulator that horizontal speed has zero effect on fall time.'
      },
      {
        id: 3,
        title: 'Apex, Range & Trajectory Parabola',
        subtitle: 'Key Projectile Formulas (Flat Ground)',
        points: [
          'At apex: vy = 0 -> t_peak = (u sin theta) / g.',
          'Total flight time = 2 * t_peak.',
          'Max Range occurs at launch angle theta = 45 degrees.'
        ],
        formula: 'R = \\frac{u^2 \\sin(2\\theta)}{g}, \\quad H = \\frac{u^2 \\sin^2(\\theta)}{2g}',
        notes: 'Show how air resistance distorts the symmetric parabola into a steeper descent.'
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
          'Current (I) is rate of charge flow: I = dQ/dt (Amperes = C/s).',
          'Kirchhoff’s Current Law (KCL): Sum of currents at node = 0 (Charge Conservation).',
          'Kirchhoff’s Voltage Law (KVL): Sum of voltages around loop = 0 (Energy Conservation).'
        ],
        formula: '\\sum I_{\\text{in}} = \\sum I_{\\text{out}}, \\quad \\sum \\Delta V_{\\text{loop}} = 0',
        notes: 'Connect KCL to node analysis and KVL to closed loop potential drops.'
      },
      {
        id: 2,
        title: 'Resistors in Series vs Parallel',
        subtitle: 'Equivalent Resistance Reductions',
        points: [
          'Series: Same current flows through all components; voltages add.',
          'Parallel: Same voltage across all branches; currents divide.',
          'Parallel equivalent is always SMALLER than the smallest branch resistor.'
        ],
        formula: 'R_{\\text{series}} = R_1 + R_2, \\quad R_{\\text{parallel}} = \\frac{R_1 R_2}{R_1 + R_2}',
        notes: 'Have student compute 6 ohm || 3 ohm = 2 ohm mental math.'
      },
      {
        id: 3,
        title: 'Voltage & Current Divider Rules',
        subtitle: 'Rapid Circuit Analysis Without Full KVL/KCL',
        points: [
          'Voltage Divider (VDR): Voltage splits proportionally to resistance.',
          'Current Divider (CDR): Current splits INVERSELY to branch resistance.',
          'Crucial for sensor interfaces, potentiometer ladders, and bias networks.'
        ],
        formula: 'V_k = V_{\\text{total}} \\left(\\frac{R_k}{\\sum R}\\right), \\quad I_1 = I_{\\text{total}} \\left(\\frac{R_2}{R_1 + R_2}\\right)',
        notes: 'Demonstrate loading effect when a low-impedance voltmeter is placed in parallel.'
      },
      {
        id: 4,
        title: 'Real Power Sources: EMF & Internal Resistance',
        subtitle: 'Terminal Voltage Drop Under Load',
        points: [
          'Electromotive Force (EMF, E): Maximum potential difference at open-circuit.',
          'Internal resistance (r): Inherent ohmic resistance of chemical electrolyte.',
          'Terminal voltage V_term drops as load current increases due to internal I*r drop.'
        ],
        formula: 'V_{\\text{terminal}} = \\mathcal{E} - I r = I R_{\\text{load}}',
        notes: 'Explain why car headlights dim slightly when starter motor draws large initial current.'
      }
    ]
  },
  'physics-3': {
    subject: 'physics',
    session: 3,
    title: 'Physics Session 3: Work, Energy, Power & Conservation Laws',
    subtitle: 'Foundation Sprint • Energy Systems',
    slides: [
      {
        id: 1,
        title: 'Work and the Work-Energy Theorem',
        subtitle: 'Mechanical Work as Dot Product of Force and Displacement',
        points: [
          'Work is done only by the component of force parallel to displacement: W = F d cos(theta).',
          'Perpendicular forces (like normal force on flat surface) do ZERO work.',
          'Net Work done on a point mass directly equals the change in kinetic energy.'
        ],
        formula: 'W = \\vec{F} \\cdot \\vec{d} = F d \\cos(\\theta), \\quad W_{\\text{net}} = \\Delta E_k = \\frac{1}{2}mv_f^2 - \\frac{1}{2}mv_i^2',
        notes: 'Emphasize that work is a scalar quantity measured in Joules (N*m).'
      },
      {
        id: 2,
        title: 'Conservation of Mechanical Energy',
        subtitle: 'Conservative vs Dissipative Systems',
        points: [
          'Conservative forces (gravity, ideal springs) store energy reversibly in potential fields.',
          'Non-conservative forces (friction, drag) dissipate mechanical energy into heat.',
          'Total mechanical energy E_mech = Ek + Ep is invariant when non-conservative work is 0.'
        ],
        formula: 'E_k + E_p = \\text{constant} \\implies \\frac{1}{2}m v_1^2 + mgh_1 = \\frac{1}{2}mv_2^2 + mgh_2',
        notes: 'Walk through roller coaster problem without using Newton second law.'
      }
    ]
  },
  'cs-1': {
    subject: 'cs',
    session: 1,
    title: 'CS Session 1: Computer Architecture & Signed Integers',
    subtitle: 'Foundation Sprint • Computer Systems',
    slides: [
      {
        id: 1,
        title: 'Von Neumann Architecture',
        subtitle: 'The Stored-Program Computer Model',
        points: [
          'Single unified memory for BOTH program instructions and application data.',
          'Central Processing Unit (CPU) contains ALU, Control Unit, and high-speed Registers.',
          'System Buses: Address Bus (unidirectional), Data Bus (bidirectional), Control Bus.'
        ],
        formula: '\\text{CPU Registers: PC (Program Counter) } \\to \\text{ MAR } \\to \\text{ MDR } \\to \\text{ CIR } \\to \\text{ ACC}',
        notes: 'Explain why memory bandwidth creates the "Von Neumann Bottleneck".'
      },
      {
        id: 2,
        title: 'The Fetch-Decode-Execute Cycle',
        subtitle: 'The Heartbeat of the Processor',
        points: [
          '1. Fetch: Copy PC to MAR; load instruction into MDR; copy to CIR; increment PC.',
          '2. Decode: Control Unit decodes opcode and operand fields.',
          '3. Execute: ALU performs arithmetic/logic, loads/stores memory, or branches.'
        ],
        notes: 'Walk through execution of a simple assembly instruction like ADD R1, R2.'
      },
      {
        id: 3,
        title: "Two's Complement Signed Representation",
        subtitle: 'Eliminating Separate Hardware Subtractors',
        points: [
          'Sign bit in MSB: 0 for positive, 1 for negative.',
          'To negate an n-bit binary number: Invert all bits (1s complement) and add 1.',
          'Subtractions A - B are computed via addition: A + (-B).'
        ],
        formula: '\\text{Negate}(X) = (\\sim X) + 1, \\quad \\text{Range: } [-2^{n-1}, 2^{n-1} - 1]',
        notes: 'Point out why 8-bit range is -128 to +127 (asymmetric zero representation).'
      }
    ]
  },
  'cs-2': {
    subject: 'cs',
    session: 2,
    title: 'CS Session 2: IEEE 754 Floating-Point & Bitwise Operations',
    subtitle: 'Foundation Sprint • Data Representation & Logic',
    slides: [
      {
        id: 1,
        title: 'The IEEE 754 32-Bit Single Precision Standard',
        subtitle: 'Encoding Real Numbers in Silicon Registers',
        points: [
          'Sign bit (1 bit): 0 = positive, 1 = negative.',
          'Biased Exponent (8 bits): Bias +127 allows unsigned comparison of signed exponents.',
          'Mantissa / Fraction (23 bits): Normalized representation with implicit leading 1.'
        ],
        formula: 'V = (-1)^S \\times 1.M \\times 2^{E - 127}',
        notes: 'Show how 0.1 decimal cannot be represented exactly in binary floating point.'
      },
      {
        id: 2,
        title: 'Bitwise Logic Operations & Masks',
        subtitle: 'Hardware-Level Boolean Manipulation',
        points: [
          'AND (&): Clear/mask unwanted bits (x & 0x0F isolates low nibble).',
          'OR (|): Set specific flag bits without altering others.',
          'XOR (^): Invert specific bits, toggle states, and compute parity.',
          'Shifts (<<, >>): Ultra-fast multiplication and division by powers of 2.'
        ],
        formula: 'x \\ll 3 = x \\times 8, \\quad x \\gg 2 = \\lfloor x / 4 \\rfloor, \\quad x \\oplus x = 0',
        notes: 'Show bitmasking application in network subnetting and embedded GPIO registers.'
      }
    ]
  },
  'cs-3': {
    subject: 'cs',
    session: 3,
    title: 'CS Session 3: Python Control Flow, Recursion & Big-O Complexity',
    subtitle: 'Foundation Sprint • Algorithms & Complexity',
    slides: [
      {
        id: 1,
        title: 'Asymptotic Analysis & Big-O Notation',
        subtitle: 'Measuring Algorithm Scalability',
        points: [
          'Big-O describes how runtime or memory grows as input size n approaches infinity.',
          'Drop constant coefficients (e.g. 5n -> O(n)).',
          'Drop lower-order polynomial terms (e.g. n^2 + 100n -> O(n^2)).'
        ],
        formula: 'O(1) \\subset O(\\log n) \\subset O(n) \\subset O(n \\log n) \\subset O(n^2) \\subset O(2^n)',
        notes: 'Contrast linear search O(n) with binary search O(log n) on 1 million elements.'
      },
      {
        id: 2,
        title: 'Recursion and Call Stacks',
        subtitle: 'Divide & Conquer Mechanics',
        points: [
          'Every recursive function requires: 1. Base Case, 2. Recursive Step.',
          'Each call pushes a new stack frame onto the memory stack.',
          'Master Theorem solves divide-and-conquer recurrences: T(n) = a T(n/b) + f(n).'
        ],
        formula: 'T(n) = 2T(n/2) + O(n) \\implies \\Theta(n \\log n) \\quad [\\text{MergeSort}]',
        notes: 'Warn students about recursion depth limit and stack overflow.'
      }
    ]
  }
};
