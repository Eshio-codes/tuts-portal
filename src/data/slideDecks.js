export const SLIDE_DECKS = {
  // =========================================================================
  // ============================ MATHEMATICS ================================
  // =========================================================================
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
  'math-2': {
    subject: 'math',
    session: 2,
    title: 'Math Session 2: Limit Laws, Continuity & Squeeze Theorem',
    subtitle: 'Foundation Sprint • Calculus I',
    slides: [
      {
        id: 1,
        title: 'Rigorous Continuity Criteria',
        subtitle: 'The 3-Part Continuity Test at a Point',
        points: [
          '1. f(c) must be defined (point exists on curve).',
          '2. lim_{x -> c} f(x) must exist (left limit = right limit).',
          '3. lim_{x -> c} f(x) must equal f(c) (no removable jump or hole).'
        ],
        formula: '\\lim_{x \\to c} f(x) = f(c)',
        notes: 'Contrast removable discontinuities (holes) with essential discontinuities (vertical asymptotes).'
      },
      {
        id: 2,
        title: 'The Squeeze (Sandwich) Theorem',
        subtitle: 'Trapping Oscillating Functions Between Known Bounds',
        points: [
          'If g(x) <= f(x) <= h(x) near c, and lim g(x) = lim h(x) = L, then lim f(x) = L.',
          'Essential for oscillating functions like x^2 * sin(1/x) at x = 0.',
          'Trigonometric foundation for lim (sin x)/x = 1.'
        ],
        formula: '-x^2 \\le x^2 \\sin(1/x) \\le x^2 \\implies \\lim_{x \\to 0} x^2 \\sin(1/x) = 0',
        notes: 'Draw two squeezing parabolas trapping the rapid wave inside.'
      },
      {
        id: 3,
        title: 'Special Trigonometric Limits',
        subtitle: 'Standard Limit Identities in Radians',
        points: [
          'Limit of (sin x)/x as x -> 0 equals 1 (angles must be in radians).',
          'Limit of (1 - cos x)/x as x -> 0 equals 0.',
          'Generalization: lim (sin(ax))/(bx) = a/b.'
        ],
        formula: '\\lim_{x \\to 0} \\frac{\\sin(kx)}{x} = k, \\quad \\lim_{x \\to 0} \\frac{1 - \\cos(x)}{x^2} = \\frac{1}{2}',
        notes: 'Have student compute lim (tan 3x)/(sin 2x) = 3/2 using algebra.'
      }
    ]
  },
  'math-3': {
    subject: 'math',
    session: 3,
    title: 'Math Session 3: Derivative from First Principles & Differentiation Rules',
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
  'math-4': {
    subject: 'math',
    session: 4,
    title: 'Math Session 4: Applications of Derivatives — Curve Sketching & Optimization',
    subtitle: 'Foundation Sprint • Differential Calculus',
    slides: [
      {
        id: 1,
        title: 'Critical Points & Fermat’s Theorem',
        subtitle: 'Locating Potential Extrema',
        points: [
          'A critical point c satisfies f\'(c) = 0 or f\'(c) is undefined.',
          'Fermat’s Theorem: Local extrema can ONLY occur at critical points.',
          'Caution: f\'(c) = 0 is a necessary condition, but not sufficient (e.g., y = x^3 at x=0).'
        ],
        formula: "f'(c) = 0 \\lor f'(c) \\notin \\mathbb{R}",
        notes: 'Explain horizontal inflection points where tangent is zero but function continues to rise.'
      },
      {
        id: 2,
        title: 'First & Second Derivative Tests',
        subtitle: 'Classifying Local Maxima, Minima, and Concavity',
        points: [
          'First Derivative Test: f\' flips (+) to (-) -> Local Max; (-) to (+) -> Local Min.',
          'Second Derivative Test: f\'\'(c) > 0 -> Concave Up (Min); f\'\'(c) < 0 -> Concave Down (Max).',
          'Inflection point occurs where concavity changes sign (f\'\'(x) flips sign).'
        ],
        formula: "f''(c) > 0 \\implies \\text{Local Min (Valley)}, \\quad f''(c) < 0 \\implies \\text{Local Max (Peak)}",
        notes: 'Show memory trick: f\'\' > 0 smiles (holds water, min), f\'\' < 0 frowns (spills water, max).'
      },
      {
        id: 3,
        title: 'Real-World Optimization Modeling',
        subtitle: '4-Step Systematic Optimization Algorithm',
        points: [
          '1. Define variables and draw a clear geometric diagram.',
          '2. Write primary objective function (e.g., Volume, Cost, Area).',
          '3. Use constraint equations to eliminate extra variables into single variable f(x).',
          '4. Find critical points in feasible domain and test endpoints.'
        ],
        formula: "V(x) = x(L - 2x)(W - 2x) \\implies V'(x) = 0",
        notes: 'Always check physical domain boundaries (e.g., x > 0 and 2x < min(L, W)).'
      }
    ]
  },
  'math-5': {
    subject: 'math',
    session: 5,
    title: 'Math Session 5: Integral Calculus & Fundamental Theorem (FTC)',
    subtitle: 'Foundation Sprint • Integral Calculus',
    slides: [
      {
        id: 1,
        title: 'Accumulation & Riemann Sums',
        subtitle: 'Approximating Area Under the Curve',
        points: [
          'Definite integral is defined as the infinite limit of Riemann rectangle sums.',
          'Delta x = (b - a) / n is the width of each subinterval.',
          'Definite integral computes net signed area (above x-axis is +, below is -).'
        ],
        formula: "\\int_a^b f(x)\\,dx = \\lim_{n \\to \\infty} \\sum_{i=1}^n f(x_i^*) \\Delta x",
        notes: 'Contrast left, right, and midpoint Riemann sums.'
      },
      {
        id: 2,
        title: 'The Fundamental Theorem of Calculus (FTC)',
        subtitle: 'Uniting Differentiation and Integration',
        points: [
          'FTC Part 1: Derivative of accumulation function restores integrand: d/dx [int_a^x f(t) dt] = f(x).',
          'FTC Part 2: Definite integral equals difference in antiderivatives: int_a^b f(x) dx = F(b) - F(a).',
          'Eliminates the need for evaluating cumbersome Riemann limits.'
        ],
        formula: "\\int_a^b f(x)\\,dx = F(b) - F(a) \\quad \\text{where } F'(x) = f(x)",
        notes: 'Emphasize the constant of integration +C for indefinite integrals and why it cancels in definite integrals.'
      },
      {
        id: 3,
        title: 'Integration by Substitution (U-Sub)',
        subtitle: 'Reversing the Chain Rule for Integrals',
        points: [
          'Identify an inner function u = g(x) whose derivative g\'(x) appears as a factor.',
          'Compute du = g\'(x) dx and substitute all terms into u-space.',
          'For definite integrals: ALWAYS transform the upper and lower integration bounds.'
        ],
        formula: "\\int_a^b f(g(x)) g'(x)\\,dx = \\int_{g(a)}^{g(b)} f(u)\\,du",
        notes: 'Walk through integral of 2x * sqrt(1 + x^2) dx step by step.'
      }
    ]
  },
  'math-6': {
    subject: 'math',
    session: 6,
    title: 'Math Session 6: Matrix Algebra, Determinants & Linear Systems',
    subtitle: 'Foundation Sprint • Linear Algebra',
    slides: [
      {
        id: 1,
        title: 'Matrix Operations & Transformations',
        subtitle: 'Linear Maps in Coordinate Spaces',
        points: [
          'Matrix multiplication is row-by-column dot products (non-commutative: AB != BA).',
          'Identity matrix I acts as the multiplicative identity: AI = IA = A.',
          'A matrix transforms basis vectors i-hat and j-hat into new column vectors.'
        ],
        formula: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax + by \\\\ cx + dy \\end{pmatrix}",
        notes: 'Show geometric interpretation of 2x2 matrix as stretching and rotating the grid.'
      },
      {
        id: 2,
        title: 'Determinants and Invertibility',
        subtitle: 'Area Scaling Factor and Singularity',
        points: [
          'Determinant represents how area/volume scales under the linear transformation.',
          'det(A) = ad - bc for 2x2 matrix.',
          'If det(A) = 0, transformation collapses space into a line/point; matrix has NO inverse (Singular).'
        ],
        formula: "A^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}, \\quad \\det(A) \\neq 0",
        notes: 'Connect det(A) = 0 to systems of equations having 0 or infinite solutions.'
      },
      {
        id: 3,
        title: 'Solving Systems: AX = B and Gaussian Elimination',
        subtitle: 'Systematic Elimination to Row-Echelon Form',
        points: [
          'System of linear equations can be compacted into matrix equation AX = B.',
          'Solution: X = A^(-1) B (when A is non-singular).',
          'Row operations: 1. Swap rows, 2. Scale row by non-zero constant, 3. Add row multiple to another row.'
        ],
        formula: "\\begin{pmatrix} 2 & 1 \\\\ 1 & 3 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 5 \\\\ 10 \\end{pmatrix} \\implies X = A^{-1} B",
        notes: 'Perform Gaussian elimination on board to reach upper triangular form.'
      }
    ]
  },

  // =========================================================================
  // ============================= PHYSICS ===================================
  // =========================================================================
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
  'physics-4': {
    subject: 'physics',
    session: 4,
    title: 'Physics Session 4: Linear Momentum, Impulse & Collisions',
    subtitle: 'Foundation Sprint • Momentum Dynamics',
    slides: [
      {
        id: 1,
        title: 'Linear Momentum & Impulse-Momentum Theorem',
        subtitle: 'The Impact Mechanics of Moving Masses',
        points: [
          'Linear momentum p = m * v is a vector with same direction as velocity.',
          'Impulse J = Integral(F dt) represents the change in momentum (Delta p).',
          'To reduce peak impact force, extend collision time dt (airbags, crumple zones).'
        ],
        formula: '\\vec{J} = \\int_{t_1}^{t_2} \\vec{F}\\,dt = \\Delta \\vec{p} = m \\vec{v}_f - m \\vec{v}_i',
        notes: 'Highlight area under Force-Time curve as the total impulse delivered.'
      },
      {
        id: 2,
        title: 'Conservation of Linear Momentum',
        subtitle: 'Internal vs External Forces in Closed Systems',
        points: [
          'If net external force is zero, total momentum of system is conserved in all directions.',
          'Holds true for all collisions: elastic, inelastic, explosions, and recoils.',
          'Vector conservation: momentum must balance independently on x and y axes.'
        ],
        formula: 'm_1 \\vec{u}_1 + m_2 \\vec{u}_2 = m_1 \\vec{v}_1 + m_2 \\vec{v}_2',
        notes: 'Show rifle recoil calculation where initial system momentum is zero.'
      },
      {
        id: 3,
        title: 'Collision Classification & Restitution',
        subtitle: 'Elastic vs Inelastic Collisions',
        points: [
          'Elastic Collision (e = 1): Kinetic energy AND momentum are conserved.',
          'Inelastic Collision (0 < e < 1): Momentum conserved, kinetic energy lost to heat/sound.',
          'Perfectly Inelastic Collision (e = 0): Objects stick together with common final velocity.'
        ],
        formula: 'e = \\frac{v_2 - v_1}{u_1 - u_2} \\quad [\\text{Coefficient of Restitution}]',
        notes: 'Demonstrate ballistic pendulum calculation where energy is lost in collision but conserved in swing.'
      }
    ]
  },
  'physics-5': {
    subject: 'physics',
    session: 5,
    title: 'Physics Session 5: Rotational Dynamics, Torque & Angular Momentum',
    subtitle: 'Foundation Sprint • Rotational Mechanics',
    slides: [
      {
        id: 1,
        title: 'Torque & Rotational Equilibrium',
        subtitle: 'Rotational Analogue of Force',
        points: [
          'Torque tau = r * F * sin(theta) measures rotational effectiveness of a force.',
          'Lever arm (perpendicular distance) determines torque magnitude.',
          'Static equilibrium requires BOTH: sum of forces = 0 AND sum of torques = 0.'
        ],
        formula: '\\vec{\\tau} = \\vec{r} \\times \\vec{F} = r F \\sin\\theta, \\quad \\sum \\vec{\\tau} = 0',
        notes: 'Show why opening a door near hinges requires much larger force.'
      },
      {
        id: 2,
        title: 'Moment of Inertia & Newton’s 2nd Law for Rotation',
        subtitle: 'Resistance to Angular Acceleration',
        points: [
          'Moment of inertia I = sum(m * r^2) depends on mass AND how mass is distributed from axis.',
          'Rotational Newton 2nd Law: Net Torque = I * alpha (angular acceleration).',
          'Parallel Axis Theorem: I = I_cm + M * d^2 allows shifting rotation axes.'
        ],
        formula: '\\tau_{\\text{net}} = I \\alpha, \\quad I_{\\text{cylinder}} = \\frac{1}{2} M R^2, \\quad I_{\\text{sphere}} = \\frac{2}{5} M R^2',
        notes: 'Race a solid cylinder and a hollow ring down an incline: solid cylinder wins due to smaller I.'
      },
      {
        id: 3,
        title: 'Conservation of Angular Momentum',
        subtitle: 'The Invariance of Rotational Spin',
        points: [
          'Angular momentum L = I * omega for rigid rotating bodies.',
          'When external torque is zero, L remains strictly constant.',
          'Figure skater effect: reducing moment of inertia I increases angular speed omega.'
        ],
        formula: 'L = I_1 \\omega_1 = I_2 \\omega_2 \\quad (\\text{when } \\tau_{\\text{ext}} = 0)',
        notes: 'Demonstrate rotational kinetic energy E_rot = 1/2 I omega^2.'
      }
    ]
  },
  'physics-6': {
    subject: 'physics',
    session: 6,
    title: 'Physics Session 6: Electrostatics, Coulomb’s Law & Capacitors',
    subtitle: 'Foundation Sprint • Electromagnetism',
    slides: [
      {
        id: 1,
        title: 'Coulomb’s Law & Electric Fields',
        subtitle: 'Fundamental Electrostatic Forces',
        points: [
          'Point charges exert electrostatic force proportional to product of charges over r^2.',
          'Electric Field E = F / q represents force exerted per unit positive test charge.',
          'Superposition Principle: Total electric field is vector sum of individual fields.'
        ],
        formula: 'F_e = \\frac{1}{4\\pi \\varepsilon_0} \\frac{|q_1 q_2|}{r^2}, \\quad \\vec{E} = \\frac{\\vec{F}_e}{q_0}',
        notes: 'Draw electric field lines radiating away from positive charges into negative charges.'
      },
      {
        id: 2,
        title: 'Electric Potential & Energy Storage',
        subtitle: 'Voltage as Potential Energy per Charge',
        points: [
          'Electric potential V is work done to bring unit charge from infinity: V = -int E dot dr.',
          'Potential difference Delta V = E * d in uniform electric fields.',
          'Electric field points in direction of steepest decrease in potential: E = -dV/dx.'
        ],
        formula: 'V = \\frac{1}{4\\pi\\varepsilon_0} \\frac{q}{r}, \\quad \\Delta U = q \\Delta V',
        notes: 'Contrast vector electric field (N/C or V/m) with scalar electric potential (Volts = J/C).'
      },
      {
        id: 3,
        title: 'Capacitors and RC Transient Circuits',
        subtitle: 'Storing Electrostatic Energy in Dielectrics',
        points: [
          'Capacitance C = Q / V depends on geometry and dielectric permittivity: C = epsilon * A / d.',
          'Energy stored in capacitor: U = 1/2 C V^2.',
          'RC circuit charging: Voltage rises asymptotically with time constant tau = R * C.'
        ],
        formula: 'C = \\frac{\\varepsilon_0 A}{d}, \\quad V(t) = V_0 \\left(1 - e^{-t / RC}\\right), \\quad \\tau = RC',
        notes: 'Show that after 1 time constant (tau = RC), capacitor charges to 63.2% of supply voltage.'
      }
    ]
  },

  // =========================================================================
  // ======================== COMPUTER SCIENCE ===============================
  // =========================================================================
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
  },
  'cs-4': {
    subject: 'cs',
    session: 4,
    title: 'CS Session 4: Linear Data Structures & Memory Management',
    subtitle: 'Foundation Sprint • Data Structures',
    slides: [
      {
        id: 1,
        title: 'Dynamic Arrays vs Linked Lists',
        subtitle: 'Contiguous vs Pointer-Based Memory Allocation',
        points: [
          'Dynamic Array: O(1) random indexing, but O(n) worst-case insertion/deletion.',
          'Linked List: O(1) head insertion/deletion, but O(n) sequential traversal.',
          'Memory hierarchy: Arrays maximize CPU L1/L2 cache spatial locality.'
        ],
        formula: '\\text{Array Access: } O(1), \\quad \\text{Linked List Access: } O(n)',
        notes: 'Explain why cache misses make linked lists slow in modern architectures despite O(1) insertions.'
      },
      {
        id: 2,
        title: 'Stacks (LIFO) and Queues (FIFO)',
        subtitle: 'Abstract Data Types and Buffer Management',
        points: [
          'Stack: Last-In, First-Out. Push and Pop operations are strictly O(1). Used in call stack, undo buffers, and parser brackets.',
          'Queue: First-In, First-Out. Enqueue and Dequeue are O(1). Used in task scheduling, BFS traversal, and printer queues.',
          'Circular buffer implementation avoids O(n) shifting during array dequeues.'
        ],
        formula: '\\text{Stack: Push/Pop } O(1), \\quad \\text{Queue: Enqueue/Dequeue } O(1)',
        notes: 'Demonstrate bracket matching validator using a stack.'
      }
    ]
  },
  'cs-5': {
    subject: 'cs',
    session: 5,
    title: 'CS Session 5: Searching, Sorting & Divide-and-Conquer',
    subtitle: 'Foundation Sprint • Algorithms',
    slides: [
      {
        id: 1,
        title: 'Binary Search Algorithm',
        subtitle: 'Logarithmic Division of Search Space',
        points: [
          'Requires pre-sorted input array.',
          'Divides search range in half each step: T(n) = T(n/2) + O(1) -> O(log n).',
          'Safe midpoint formula avoids integer overflow: mid = low + (high - low) // 2.'
        ],
        formula: '\\text{Time Complexity: } O(\\log_2 n) \\implies 30 \\text{ steps for } 10^9 \\text{ elements}',
        notes: 'Contrast 30 operations for binary search with 1 billion operations for linear search.'
      },
      {
        id: 2,
        title: 'MergeSort vs QuickSort',
        subtitle: 'Divide-and-Conquer Sorting Paradigms',
        points: [
          'MergeSort: Divides in half, sorts recursively, merges in O(n). Guaranteed O(n log n), stable, but needs O(n) memory.',
          'QuickSort: Partitions around pivot. In-place O(log n) space, very fast cache locality, average O(n log n), worst O(n^2).',
          'Comparison sort lower bound is Omega(n log n) by decision tree theorem.'
        ],
        formula: 'T(n) = 2T(n/2) + O(n) \\implies \\Theta(n \\log n)',
        notes: 'Demonstrate MergeSort recursion tree and partition algorithm for QuickSort.'
      }
    ]
  },
  'cs-6': {
    subject: 'cs',
    session: 6,
    title: 'CS Session 6: Boolean Algebra, Logic Gates & Combinational Circuits',
    subtitle: 'Foundation Sprint • Digital Logic',
    slides: [
      {
        id: 1,
        title: 'Boolean Algebra Postulates & De Morgan’s Laws',
        subtitle: 'Simplifying Logical Equations',
        points: [
          'De Morgan 1: NOT(A AND B) = (NOT A) OR (NOT B).',
          'De Morgan 2: NOT(A OR B) = (NOT A) AND (NOT B).',
          'Absorption Law: A + A*B = A; A*(A + B) = A.'
        ],
        formula: '\\overline{A \\cdot B} = \\overline{A} + \\overline{B}, \\quad \\overline{A + B} = \\overline{A} \\cdot \\overline{B}',
        notes: 'Work through algebraic reduction of a truth table on whiteboard.'
      },
      {
        id: 2,
        title: 'Universal Logic Gates & Circuit Synthesis',
        subtitle: 'Building Complete Computers from NAND/NOR',
        points: [
          'NAND and NOR gates are functionally complete: any boolean logic can be built exclusively from NANDs.',
          'Half Adder: XOR gate computes Sum, AND gate computes Carry.',
          'Full Adder: Chains two half adders and an OR gate to process Carry-In.'
        ],
        formula: '\\text{Sum} = A \\oplus B \\oplus C_{\\text{in}}, \\quad C_{\\text{out}} = (A \\cdot B) + (C_{\\text{in}} \\cdot (A \\oplus B))',
        notes: 'Show how cascading 32 full adders creates a 32-bit Ripple-Carry Adder.'
      }
    ]
  }
};
