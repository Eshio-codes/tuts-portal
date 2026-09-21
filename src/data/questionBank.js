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
    session: 1,
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    title: 'Even and Odd Function Symmetry',
    prompt: 'Which of the following functions is strictly odd on its entire domain (satisfying f(-x) = -f(x))?',
    mathPrompt: true,
    options: [
      'f(x) = x^3 - 4x',
      'f(x) = x^4 + 3x^2',
      'f(x) = \\cos(x) + x^2',
      'f(x) = |x| + x'
    ],
    correctAnswer: 0,
    explanation: 'Test f(-x): f(-x) = (-x)^3 - 4(-x) = -x^3 + 4x = -(x^3 - 4x) = -f(x). Thus f(x) = x^3 - 4x is an odd function (symmetric about origin).'
  },
  {
    id: 'm2-01',
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
    id: 'm2-02',
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
    id: 'm3-01',
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
    id: 'm3-02',
    subject: 'math',
    session: 3,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Derivative from First Principles at a Point',
    prompt: 'Given f(x) = 3x^2 - 4x, evaluate the slope of the tangent line f\'(2) using the difference quotient.',
    correctAnswer: 8.0,
    tolerance: 0.01,
    unit: '',
    solution: 'f\'(x) = d/dx [3x^2 - 4x] = 6x - 4. At x = 2: f\'(2) = 6(2) - 4 = 12 - 4 = 8.'
  },
  {
    id: 'm4-01',
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
  {
    id: 'm4-02',
    subject: 'math',
    session: 4,
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    title: 'Inflection Point and Concavity of Cubic',
    prompt: 'At what x-coordinate does the cubic function f(x) = x^3 - 6x^2 + 9x - 2 have an inflection point?',
    mathPrompt: true,
    options: [
      'x = 2',
      'x = 1',
      'x = 3',
      'x = 0'
    ],
    correctAnswer: 0,
    explanation: 'First derivative f\'(x) = 3x^2 - 12x + 9. Second derivative f\'\'(x) = 6x - 12. Set f\'\'(x) = 0 => 6x = 12 => x = 2. Since f\'\'(x) changes sign from negative (x < 2) to positive (x > 2), an inflection point occurs at x = 2.'
  },
  {
    id: 'm5-01',
    subject: 'math',
    session: 5,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Definite Integral via U-Substitution',
    prompt: 'Evaluate the definite integral: \\int_0^2 2x \\sqrt{x^2 + 5}\\,dx. Enter the decimal value to 3 decimal places.',
    mathPrompt: true,
    correctAnswer: 10.547,
    tolerance: 0.02,
    unit: '',
    solution: 'Let u = x^2 + 5, then du = 2x dx.\nWhen x = 0, u = 5. When x = 2, u = 2^2 + 5 = 9.\nIntegral becomes \\int_5^9 u^{1/2}\\,du = [\\frac{2}{3} u^{3/2}]_5^9 = \\frac{2}{3}(9^{3/2} - 5^{3/2}) = \\frac{2}{3}(27 - 5\\sqrt{5}) = \\frac{2}{3}(27 - 11.1803) = \\frac{2}{3}(15.8197) \\approx 10.546.'
  },
  {
    id: 'm5-02',
    subject: 'math',
    session: 5,
    difficulty: 'Exam-style',
    type: 'multiple-choice',
    title: 'Integration by Parts Application',
    prompt: 'Evaluate the indefinite integral: \\int x e^{2x} \\, dx.',
    mathPrompt: true,
    options: [
      '\\frac{1}{2}x e^{2x} - \\frac{1}{4}e^{2x} + C',
      '\\frac{1}{2}x e^{2x} - \\frac{1}{2}e^{2x} + C',
      'x e^{2x} - e^{2x} + C',
      '\\frac{1}{4}x^2 e^{2x} + C'
    ],
    correctAnswer: 0,
    explanation: 'Using formula \\int u\\,dv = uv - \\int v\\,du. Let u = x => du = dx. Let dv = e^{2x} dx => v = \\frac{1}{2}e^{2x}. Then \\int x e^{2x} dx = \\frac{1}{2}x e^{2x} - \\int \\frac{1}{2}e^{2x} dx = \\frac{1}{2}x e^{2x} - \\frac{1}{4}e^{2x} + C.'
  },
  {
    id: 'm6-01',
    subject: 'math',
    session: 6,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: '2x2 Matrix Determinant and Singularity',
    prompt: 'Calculate the determinant of matrix A = \\begin{pmatrix} 4 & -2 \\\\ 3 & 5 \\end{pmatrix}.',
    mathPrompt: true,
    correctAnswer: 26.0,
    tolerance: 0.01,
    unit: '',
    solution: '\\det(A) = ad - bc = (4)(5) - (-2)(3) = 20 - (-6) = 20 + 6 = 26.'
  },
  {
    id: 'm6-02',
    subject: 'math',
    session: 6,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Eigenvalues of a 2x2 Diagonal Matrix',
    prompt: 'What are the eigenvalues of the transformation matrix M = \\begin{pmatrix} 7 & 0 \\\\ 0 & -3 \\end{pmatrix}?',
    mathPrompt: true,
    options: [
      '\\lambda_1 = 7, \\lambda_2 = -3',
      '\\lambda_1 = 4, \\lambda_2 = -21',
      '\\lambda_1 = 0, \\lambda_2 = 4',
      '\\lambda_1 = 7, \\lambda_2 = 3'
    ],
    correctAnswer: 0,
    explanation: 'For any diagonal or triangular matrix, the eigenvalues are simply the entries along the main diagonal. Hence \\det(M - \\lambda I) = (7 - \\lambda)(-3 - \\lambda) = 0 => \\lambda = 7, -3.'
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
    title: 'Work-Energy Theorem with Incline',
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
  {
    id: 'p3-02',
    subject: 'physics',
    session: 3,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Ideal Spring Elastic Potential Energy',
    prompt: 'A spring with force constant k = 400 N/m is compressed by 0.15 m from its equilibrium position. Calculate the stored elastic potential energy in Joules.',
    correctAnswer: 4.5,
    tolerance: 0.05,
    unit: 'J',
    solution: 'Elastic potential energy U_s = 0.5 * k * x^2 = 0.5 * (400 N/m) * (0.15 m)^2 = 200 * 0.0225 = 4.50 J.'
  },
  {
    id: 'p4-01',
    subject: 'physics',
    session: 4,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Inelastic Collision Common Final Velocity',
    prompt: 'A cart of mass m1 = 3.0 kg moving at 4.0 m/s collides with and couples to a stationary cart of mass m2 = 1.0 kg on a frictionless horizontal track. Calculate their common final speed in m/s.',
    correctAnswer: 3.0,
    tolerance: 0.05,
    unit: 'm/s',
    solution: 'By conservation of linear momentum: m1*u1 + m2*u2 = (m1 + m2)*v_f => (3.0)(4.0) + (1.0)(0) = (3.0 + 1.0)*v_f => 12.0 = 4.0 * v_f => v_f = 3.0 m/s.'
  },
  {
    id: 'p4-02',
    subject: 'physics',
    session: 4,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Impulse and Force-Time Integral',
    prompt: 'A constant horizontal force of 50 N acts on a 5.0 kg stationary object for 0.4 seconds. What is the final momentum of the object?',
    options: [
      '20 N·s (kg·m/s)',
      '10 N·s (kg·m/s)',
      '50 N·s (kg·m/s)',
      '100 N·s (kg·m/s)'
    ],
    correctAnswer: 0,
    explanation: 'Impulse J = F * \\Delta t = \\Delta p. Since initial momentum is 0, final momentum p_f = 50 N * 0.4 s = 20 N·s.'
  },
  {
    id: 'p5-01',
    subject: 'physics',
    session: 5,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Torque on a Wrench',
    prompt: 'A mechanic applies a 150 N force perpendicular to the end of a 0.25 m wrench. Calculate the resulting torque in N*m.',
    correctAnswer: 37.5,
    tolerance: 0.1,
    unit: 'N*m',
    solution: '\\tau = r * F * \\sin(90^\\circ) = (0.25 \\text{ m}) * (150 \\text{ N}) * (1.0) = 37.5 \\text{ N}\\cdot\\text{m}.'
  },
  {
    id: 'p5-02',
    subject: 'physics',
    session: 5,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Rotational Kinetic Energy Formula',
    prompt: 'What is the rotational kinetic energy of a solid cylinder of mass M, radius R, and moment of inertia I = \\frac{1}{2} M R^2 spinning at angular velocity \\omega?',
    mathPrompt: true,
    options: [
      'K = \\frac{1}{4} M R^2 \\omega^2',
      'K = \\frac{1}{2} M R^2 \\omega^2',
      'K = M R^2 \\omega',
      'K = \\frac{1}{2} I^2 \\omega'
    ],
    correctAnswer: 0,
    explanation: 'Rotational kinetic energy is K_{rot} = \\frac{1}{2} I \\omega^2. Substituting I = \\frac{1}{2} M R^2 yields K_{rot} = \\frac{1}{2} \\left(\\frac{1}{2} M R^2\\right) \\omega^2 = \\frac{1}{4} M R^2 \\omega^2.'
  },
  {
    id: 'p6-01',
    subject: 'physics',
    session: 6,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Capacitor Energy Storage',
    prompt: 'A 100 \\mu\\text{F} capacitor is charged to a potential difference of 20 V. Calculate the stored electrical energy in millijoules (mJ).',
    correctAnswer: 20.0,
    tolerance: 0.1,
    unit: 'mJ',
    solution: 'U = 0.5 * C * V^2 = 0.5 * (100 * 10^-6 F) * (20 V)^2 = 0.5 * 10^-4 * 400 = 0.020 J = 20.0 mJ.'
  },
  {
    id: 'p6-02',
    subject: 'physics',
    session: 6,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Series RLC Circuit Resonant Frequency',
    prompt: 'Calculate the resonant angular frequency \\omega_0 (in rad/s) for a series RLC circuit with L = 20 \\text{ mH} and C = 5.0 \\mu\\text{F}.',
    correctAnswer: 3162.3,
    tolerance: 10.0,
    unit: 'rad/s',
    solution: '\\omega_0 = \\frac{1}{\\sqrt{LC}} = \\frac{1}{\\sqrt{(20 \\times 10^{-3})(5.0 \\times 10^{-6})}} = \\frac{1}{\\sqrt{10^{-7}}} = \\frac{1}{3.1623 \\times 10^{-4}} \\approx 3162.3 \\text{ rad/s}.'
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
    id: 'cs1-02',
    subject: 'cs',
    session: 1,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Von Neumann Architecture Registers',
    prompt: 'During the instruction fetch cycle in a Von Neumann CPU, which register holds the memory address of the NEXT instruction to be retrieved?',
    options: [
      'Program Counter (PC)',
      'Memory Data Register (MDR)',
      'Instruction Register (IR)',
      'Accumulator (ACC)'
    ],
    correctAnswer: 0,
    explanation: 'The Program Counter (PC) stores the memory address of the next sequential instruction. This value is loaded into the MAR (Memory Address Register) to read the instruction byte.'
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
  },
  {
    id: 'cs3-02',
    subject: 'cs',
    session: 3,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Nested Loop Complexity',
    prompt: 'What is the worst-case asymptotic time complexity of two nested loops where the outer loop executes n times and the inner loop executes i times (for i = 1 to n)?',
    options: [
      'O(n^2)',
      'O(n \\log n)',
      'O(n)',
      'O(2^n)'
    ],
    correctAnswer: 0,
    explanation: 'Total iterations = \\sum_{i=1}^n i = \\frac{n(n+1)}{2} = \\frac{1}{2}n^2 + \\frac{1}{2}n = O(n^2).'
  },
  {
    id: 'cs4-01',
    subject: 'cs',
    session: 4,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Stack vs Queue Operation Discipline',
    prompt: 'Which data structure follows the LIFO (Last-In, First-Out) access pattern and is used by compilers for tracking function calls and return addresses?',
    options: [
      'FIFO Queue',
      'Call Stack',
      'Doubly Linked List',
      'Binary Search Tree'
    ],
    correctAnswer: 1,
    explanation: 'A Stack is a LIFO (Last-In, First-Out) data structure. The CPU call stack uses push and pop operations to store local frames and return pointers.'
  },
  {
    id: 'cs4-02',
    subject: 'cs',
    session: 4,
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    title: 'Linked List Head Insertion Time Complexity',
    prompt: 'What is the time complexity to insert a new node at the head of a singly linked list with a known head pointer?',
    options: [
      'O(1)',
      'O(n)',
      'O(\\log n)',
      'O(n^2)'
    ],
    correctAnswer: 0,
    explanation: 'Inserting at head only requires allocating the new node, setting newNode.next = head, and updating head = newNode. This runs in constant O(1) time independent of list size.'
  },
  {
    id: 'cs5-01',
    subject: 'cs',
    session: 5,
    difficulty: 'Intermediate',
    type: 'numeric',
    title: 'Binary Search Maximum Comparisons',
    prompt: 'What is the maximum number of comparisons required to search for an item in a sorted array of 1024 elements using binary search?',
    correctAnswer: 11,
    tolerance: 0,
    unit: 'comparisons',
    solution: 'Maximum comparisons in binary search = floor(log2(n)) + 1 = floor(log2(1024)) + 1 = 10 + 1 = 11 comparisons.'
  },
  {
    id: 'cs5-02',
    subject: 'cs',
    session: 5,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Merge Sort Divide-and-Conquer Phase',
    prompt: 'What is the time complexity of the merge step that combines two sorted subarrays of length n/2 into a single sorted array of length n?',
    options: [
      'O(n)',
      'O(n \\log n)',
      'O(1)',
      'O(n^2)'
    ],
    correctAnswer: 0,
    explanation: 'Merging two sorted lists of total length n scans each element at most once using two pointers, requiring linear O(n) operations.'
  },
  {
    id: 'cs6-01',
    subject: 'cs',
    session: 6,
    difficulty: 'Intermediate',
    type: 'multiple-choice',
    title: 'Boolean De Morgan Equivalence',
    prompt: 'According to De Morgan\'s Laws, what is the equivalent simplified expression for \\overline{A \\cdot \\overline{B}}?',
    options: [
      '\\overline{A} + B',
      '\\overline{A} \\cdot B',
      'A + \\overline{B}',
      '\\overline{A} + \\overline{B}'
    ],
    correctAnswer: 0,
    explanation: 'Using De Morgan\'s Law \\overline{X \\cdot Y} = \\overline{X} + \\overline{Y}. Here X = A and Y = \\overline{B}. Thus \\overline{A \\cdot \\overline{B}} = \\overline{A} + \\overline{\\overline{B}} = \\overline{A} + B.'
  },
  {
    id: 'cs6-02',
    subject: 'cs',
    session: 6,
    difficulty: 'Foundational',
    type: 'multiple-choice',
    title: 'Digital Logic Half Adder Outputs',
    prompt: 'A 1-bit Half Adder circuit receives binary inputs A = 1 and B = 1. What are the resulting Sum (S) and Carry (C) outputs?',
    options: [
      'Sum = 0, Carry = 1',
      'Sum = 1, Carry = 0',
      'Sum = 1, Carry = 1',
      'Sum = 0, Carry = 0'
    ],
    correctAnswer: 0,
    explanation: 'For a half adder: Sum S = A XOR B = 1 XOR 1 = 0. Carry C = A AND B = 1 AND 1 = 1. The binary sum is 10_2 (decimal 2).'
  }
];
