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
      title: 'The Derivative from First Principles & Core Rules',
      duration: '120 min',
      status: 'Ready',
      topics: ['Secant slope to tangent line', 'Difference quotient', 'Differentiability implies continuity', 'Power, product, quotient, and chain rules', 'Higher-order derivatives'],
      keyFormulas: [
        "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        "\\frac{d}{dx}[x^n] = n x^{n-1}, \\quad \\frac{d}{dx}[e^x] = e^x, \\quad \\frac{d}{dx}[\\ln x] = \\frac{1}{x}",
        "\\frac{d}{dx}[u \\cdot v] = u'v + uv', \\quad \\frac{d}{dx}\\left[\\frac{u}{v}\\right] = \\frac{u'v - uv'}{v^2}",
        "\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x) \\quad [\\text{Chain Rule}]"
      ],
      overview: 'Geometric and physical meaning of instantaneous rate of change. Constructing tangent lines, evaluating limit quotients, and mastering standard differentiation rules.',
      sections: [
        {
          heading: '1. Geometric Meaning of the Difference Quotient',
          content: 'The difference quotient [f(x+h) - f(x)] / h gives the average rate of change (secant line slope) over interval [x, x+h]. Taking the limit as h -> 0 contracts the interval to an infinitesimal point, giving the instantaneous rate of change (tangent line slope).'
        },
        {
          heading: '2. The Chain Rule & Composition',
          content: 'For composite function y = f(u) where u = g(x), dy/dx = (dy/du) * (du/dx). Differentiate the outer function with respect to the inner argument, then multiply by the derivative of the inner function.'
        }
      ]
    },
    {
      session: 4,
      title: 'Applications of Derivatives: Curve Sketching & Optimization',
      duration: '120 min',
      status: 'Ready',
      topics: ['Critical points & Fermat Theorem', 'First & Second Derivative Tests', 'Concavity & Points of Inflection', 'Global extrema on closed intervals', 'Real-world optimization modeling'],
      keyFormulas: [
        "f'(c) = 0 \\text{ or } f'(c) \\text{ undefined} \\implies c \\text{ is a critical point}",
        "f''(c) > 0 \\implies \\text{Local Min (Concave Up)}, \\quad f''(c) < 0 \\implies \\text{Local Max (Concave Down)}",
        "\\text{Absolute Extrema: Evaluate } f(x) \\text{ at critical points and domain boundaries } [a, b]"
      ],
      overview: 'Transforming differential calculus into structural analytical tools for graphing functions without calculators and solving engineering optimization problems.',
      sections: [
        {
          heading: '1. Monotonicity and the First Derivative',
          content: 'If f\'(x) > 0 on an interval, f is strictly increasing. If f\'(x) < 0, f is strictly decreasing. A sign change of f\' from positive to negative at critical point c indicates a local maximum.'
        },
        {
          heading: '2. Optimization Procedure',
          content: '1. Formulate objective function in one variable using geometric or physical constraint equations. 2. Identify feasible domain. 3. Find critical points by setting derivative to 0. 4. Verify extremum nature using First/Second Derivative Test.'
        }
      ]
    },
    {
      session: 5,
      title: 'Integral Calculus & Fundamental Theorem (FTC)',
      duration: '120 min',
      status: 'Upcoming',
      topics: ['Riemann sums & area accumulation', 'Fundamental Theorem of Calculus (Parts 1 & 2)', 'Indefinite integrals & antiderivatives', 'Integration by Substitution (U-Sub)', 'Area between curves'],
      keyFormulas: [
        "\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i^*) \\Delta x",
        "\\frac{d}{dx}\\left[ \\int_a^x f(t)\\,dt \\right] = f(x) \\quad [\\text{FTC Part 1}]",
        "\\int_a^b f(x)\\,dx = F(b) - F(a), \\quad \\text{where } F'(x) = f(x) \\quad [\\text{FTC Part 2}]",
        "\\int f(g(x))g'(x)\\,dx = \\int f(u)\\,du \\quad [\\text{U-Substitution}]"
      ],
      overview: 'Accumulation functions and the profound inverse relationship between differentiation and integration established by Newton and Leibniz.',
      sections: [
        {
          heading: '1. The Fundamental Theorem of Calculus',
          content: 'FTC 1 establishes that every continuous function has an antiderivative defined by its accumulation integral. FTC 2 provides the algebraic evaluation tool: the definite integral equals the difference in antiderivative values between the bounds.'
        }
      ]
    },
    {
      session: 6,
      title: 'Matrix Algebra, Determinants & Linear Systems',
      duration: '120 min',
      status: 'Upcoming',
      topics: ['Matrix operations & matrix multiplication', 'Determinants of 2x2 and 3x3 matrices', 'Matrix inverse & singularity', 'Gaussian Elimination & Row-Echelon Form', "Cramer's Rule & Systems of Equations"],
      keyFormulas: [
        'A^{-1} = \\frac{1}{\\det(A)} \\text{adj}(A), \\quad \\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc',
        'A X = B \\implies X = A^{-1} B \\quad (\\text{if } \\det(A) \\neq 0)',
        '\\text{Row operations: } R_i \\leftrightarrow R_j, \\; k R_i \\to R_i, \\; R_i + k R_j \\to R_i'
      ],
      overview: 'Vector spaces and linear transformations: matrix algebra as the universal computational framework for physics, machine learning, and engineering systems.',
      sections: [
        {
          heading: '1. Matrix Invertibility & Determinants',
          content: 'A square matrix A is invertible if and only if its determinant is non-zero (det(A) != 0). If det(A) = 0, the matrix is singular, representing a dimension-collapsing transformation with either zero or infinitely many solutions to AX = B.'
        }
      ]
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
      title: 'Work, Energy, Power & Conservation Laws',
      duration: '120 min',
      status: 'Ready',
      topics: ['Work-Energy Theorem', 'Conservative vs Non-conservative forces', 'Gravitational & Elastic Potential Energy', 'Mechanical Power & Efficiency', 'Potential Energy Curves & Stability'],
      keyFormulas: [
        'W = \\int \\vec{F} \\cdot d\\vec{r} = F d \\cos(\\theta)',
        'E_k = \\frac{1}{2} m v^2, \\quad E_p = m g h, \\quad E_e = \\frac{1}{2} k x^2',
        'W_{\\text{net}} = \\Delta E_k, \\quad W_{\\text{nc}} = \\Delta E_{\\text{mech}}',
        'P = \\frac{dW}{dt} = \\vec{F} \\cdot \\vec{v}, \\quad \\eta = \\frac{P_{\\text{useful}}}{P_{\\text{total}}} \\times 100\\%'
      ],
      overview: 'Energy as the fundamental invariant currency in physical mechanics. Replacing difficult differential equations of motion with scalar conservation principles.',
      sections: [
        {
          heading: '1. The Work-Energy Theorem',
          content: 'The net work done on a point particle by all external forces equals the change in its kinetic energy. When only conservative forces (gravity, springs) act, total mechanical energy (Ek + Ep) remains constant.'
        },
        {
          heading: '2. Conservative vs Non-Conservative Systems',
          content: 'Work done by conservative forces is path-independent and depends solely on initial and final coordinates. Friction and air resistance are non-conservative forces that dissipate mechanical energy into thermal energy.'
        }
      ]
    },
    {
      session: 4,
      title: 'Linear Momentum, Impulse & Collisions',
      duration: '120 min',
      status: 'Upcoming',
      topics: ['Linear momentum vector & Newton 2nd Law form', 'Impulse-Momentum Theorem', 'Conservation of linear momentum in isolated systems', 'Elastic vs Inelastic vs Perfectly Inelastic collisions', 'Coefficient of restitution'],
      keyFormulas: [
        '\\vec{p} = m \\vec{v}, \\quad \\vec{J} = \\int \\vec{F}\\,dt = \\Delta \\vec{p}',
        '\\sum \\vec{p}_{\\text{initial}} = \\sum \\vec{p}_{\\text{final}} \\quad (\\text{if } \\vec{F}_{\\text{ext,net}} = 0)',
        'e = \\frac{v_{2f} - v_{1f}}{v_{1i} - v_{2i}} \\quad (e = 1 \\text{ Elastic}, \\; 0 < e < 1 \\text{ Inelastic}, \\; e=0 \\text{ Perfectly Inelastic})'
      ],
      overview: 'Translational dynamics of multi-particle systems and impact mechanics. Applying Newton’s Third Law to derive momentum conservation.',
      sections: [
        {
          heading: '1. Impulse & Impact Force Mitigation',
          content: 'Impulse J = Integral(F dt) = delta p. To reduce peak impact force on an object during a fixed momentum change, the duration of contact dt must be maximized (e.g. airbags, crumple zones).'
        }
      ]
    },
    {
      session: 5,
      title: 'Rotational Dynamics, Torque & Angular Momentum',
      duration: '120 min',
      status: 'Upcoming',
      topics: ['Angular kinematics (theta, omega, alpha)', 'Torque & Rotational Equilibrium', 'Moment of Inertia & Parallel Axis Theorem', 'Newton 2nd Law for Rotation (tau = I alpha)', 'Conservation of Angular Momentum'],
      keyFormulas: [
        '\\tau = \\vec{r} \\times \\vec{F} = r F \\sin(\\theta), \\quad \\sum \\tau = I \\alpha',
        'I = \\int r^2\\,dm, \\quad I = I_{\\text{cm}} + M d^2 \\quad [\\text{Parallel Axis}]',
        'L = I \\omega, \\quad \\frac{dL}{dt} = \\tau_{\\text{net,ext}}',
        'E_{\\text{rot}} = \\frac{1}{2} I \\omega^2'
      ],
      overview: 'Mapping linear translational quantities into their rotational counterparts. Analyzing rolling without slipping and gyroscopic stability.',
      sections: [
        {
          heading: '1. Rotational Analogues of Mechanics',
          content: 'Linear mass m maps to rotational inertia I; force F maps to torque tau; linear momentum p maps to angular momentum L; work W = Integral(tau d(theta)).'
        }
      ]
    },
    {
      session: 6,
      title: 'Electrostatics, Coulomb’s Law & Capacitors',
      duration: '120 min',
      status: 'Upcoming',
      topics: ["Coulomb's Law & Superposition", 'Electric Field & Electric Potential', 'Gauss’s Law concepts', 'Parallel-plate capacitors & Dielectrics', 'RC charging and discharging transient circuits'],
      keyFormulas: [
        'F_e = \\frac{1}{4\\pi\\varepsilon_0} \\frac{|q_1 q_2|}{r^2}, \\quad \\vec{E} = \\frac{\\vec{F}_e}{q_0}',
        'V = -\\int \\vec{E} \\cdot d\\vec{r}, \\quad C = \\frac{Q}{V} = \\frac{\\varepsilon_0 A}{d}',
        'U_C = \\frac{1}{2} C V^2 = \\frac{1}{2} \\frac{Q^2}{C}, \\quad V(t) = V_0 (1 - e^{-t/RC})'
      ],
      overview: 'Fundamental electromagnetic interactions: charge fields, electrostatic potential gradients, energy storage in dielectric materials, and transient time constants.',
      sections: [
        {
          heading: '1. Electric Fields and Potentials',
          content: 'The electric field E is a conservative vector field equal to the negative gradient of electric potential V (E = -grad V). Potential difference represents the work per unit charge required to move against electrostatic forces.'
        }
      ]
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
      title: 'Python Control Flow, Recursion & Big-O Complexity',
      duration: '120 min',
      status: 'Ready',
      topics: ['Conditionals & pattern matching', 'List comprehensions & iterators', 'Pure functions, stack frames & recursion', 'Formal definition of Big-O, Big-Omega, Big-Theta', 'Time & Space Complexity analysis of algorithms'],
      keyFormulas: [
        'T(n) = O(f(n)) \\iff \\exists c > 0, n_0 > 0 \\text{ s.t. } |T(n)| \\le c|f(n)| \\; \\forall n \\ge n_0',
        '\\text{Hierarchy: } O(1) < O(\\log n) < O(n) < O(n \\log n) < O(n^2) < O(2^n) < O(n!)',
        'T(n) = a T(n/b) + f(n) \\quad [\\text{Master Theorem for Divide \\& Conquer}]'
      ],
      overview: 'Translating mathematical reasoning into idiomatic Python. Rigorous asymptotic complexity analysis to measure how algorithms scale with large input sets.',
      sections: [
        {
          heading: '1. Recursion and the Call Stack',
          content: 'A recursive function requires a base case to prevent stack overflow (infinite recursion) and a recursive step that reduces the problem size toward the base case. Each call allocates a stack frame containing local variables and return addresses.'
        },
        {
          heading: '2. Asymptotic Complexity Rules',
          content: 'Drop constant multipliers (O(3n) -> O(n)). Drop lower-order polynomial terms (O(n^2 + 5n + 100) -> O(n^2)). Nested loops multiply complexities; sequential independent loops add complexities.'
        }
      ]
    },
    {
      session: 4,
      title: 'Linear Data Structures & Memory Management',
      duration: '120 min',
      status: 'Upcoming',
      topics: ['Dynamic Arrays vs Linked Lists', 'Stack LIFO & Queue FIFO operations', 'Pointer indirection & heap vs stack memory', 'Amortized analysis of dynamic resizing', 'Implementing deque and priority queues'],
      keyFormulas: [
        '\\text{Array Access: } O(1), \\quad \\text{Array Insertion (worst): } O(n), \\; \\text{Amortized Insertion: } O(1)',
        '\\text{Linked List Search: } O(n), \\quad \\text{Insertion at Head: } O(1)',
        '\\text{Geometric Array Growth Factor } k = 2 \\implies \\sum_{i=0}^m 2^i = 2^{m+1} - 1 = O(n)'
      ],
      overview: 'How data is laid out in physical RAM cache lines. Trade-offs between contiguous memory structures and pointer-linked nodes.',
      sections: [
        {
          heading: '1. Memory Locality and Cache Performance',
          content: 'Contiguous arrays benefit from CPU spatial locality: fetching one element pulls adjacent elements into the fast L1/L2 cache lines. Linked lists disperse node allocations across the heap, incurring CPU pointer-chasing cache misses.'
        }
      ]
    },
    {
      session: 5,
      title: 'Searching, Sorting & Divide-and-Conquer',
      duration: '120 min',
      status: 'Upcoming',
      topics: ['Binary Search (O(log n)) & predicate bounds', 'Quadratic sorts: Bubble, Insertion, Selection', 'Divide & Conquer: MergeSort (O(n log n))', 'QuickSort: Pivot selection & partition schemes', 'Lower bound of comparison-based sorting (Omega(n log n))'],
      keyFormulas: [
        'T_{\\text{MergeSort}}(n) = 2 T(n/2) + O(n) \\implies O(n \\log n)',
        '\\log_2(n!) = \\Theta(n \\log n) \\quad [\\text{Decision Tree Lower Bound}]',
        '\\text{Binary Search: } \\text{mid} = \\text{low} + \\lfloor(\\text{high} - \\text{low}) / 2\\rfloor'
      ],
      overview: 'Divide-and-conquer paradigms: breaking problems into independent sub-problems, conquering recursively, and recombining solutions with provable asymptotic bounds.',
      sections: [
        {
          heading: '1. MergeSort vs QuickSort',
          content: 'MergeSort guarantees O(n log n) worst-case time with stable sorting, but requires O(n) auxiliary memory. QuickSort sorts in-place with O(log n) stack space and high cache locality, averaging O(n log n), but degrades to O(n^2) if poor pivots are selected.'
        }
      ]
    },
    {
      session: 6,
      title: 'Boolean Algebra, Logic Gates & Digital Combinational Circuits',
      duration: '120 min',
      status: 'Upcoming',
      topics: ['Boolean postulates & De Morgan’s Laws', 'Logic gates: AND, OR, NOT, XOR, NAND, NOR, XNOR', 'Universal gates (NAND/NOR complete sets)', 'Sum of Products (SOP) & Product of Sums (POS)', 'Half Adders, Full Adders & Ripple-Carry Adders'],
      keyFormulas: [
        '\\overline{A \\cdot B} = \\overline{A} + \\overline{B}, \\quad \\overline{A + B} = \\overline{A} \\cdot \\overline{B} \\quad [\\text{De Morgan\'s Laws}]',
        'A \\oplus B = A\\overline{B} + \\overline{A}B \\quad [\\text{XOR}]',
        '\\text{Sum} = A \\oplus B \\oplus C_{\\text{in}}, \\quad C_{\\text{out}} = (A \\cdot B) + (C_{\\text{in}} \\cdot (A \\oplus B)) \\quad [\\text{Full Adder}]'
      ],
      overview: 'Silicon gate synthesis: translating propositional logic into transistor switching networks and building arithmetic adders from scratch.',
      sections: [
        {
          heading: '1. Functional Completeness of NAND Gates',
          content: 'Any Boolean function can be constructed using solely NAND gates (or solely NOR gates). A NOT gate is NAND(A, A); an AND gate is NAND(NAND(A, B), NAND(A, B)); an OR gate is NAND(NAND(A, A), NAND(B, B)).'
        }
      ]
    }
  ]
};
