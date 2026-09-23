import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const qbPath = path.resolve(__dirname, '../src/data/questionBank.js');

// Map of all 67 numeric questions with textbook formulas and step-by-step solutions
const FORMULAS_AND_SOLUTIONS = {
  // ==================== MATHEMATICS (17 numeric) ====================
  m03: {
    formula: '$$\\lim_{x \\to a} \\frac{f(x) - L}{g(x)} = \\lim_{x \\to a} \\frac{(f(x) - L)(f(x) + L)}{g(x)(f(x) + L)}$$',
    solution: '1. Multiply numerator and denominator by the conjugate $(\\sqrt{9+x} + 3)$:\n$$\\frac{(\\sqrt{9+x}-3)(\\sqrt{9+x}+3)}{x(\\sqrt{9+x}+3)} = \\frac{(9+x)-9}{x(\\sqrt{9+x}+3)} = \\frac{x}{x(\\sqrt{9+x}+3)}$$\n2. Cancel $x$ and take limit as $x \\to 0$:\n$$\\lim_{x \\to 0} \\frac{1}{\\sqrt{9+x}+3} = \\frac{1}{\\sqrt{9}+3} = \\frac{1}{6} \\approx 0.167$$',
    correctAnswer: 0.167,
    tolerance: 0.005,
    unit: ''
  },
  m07: {
    formula: '$$\\lim_{x \\to \\infty} \\frac{a_n x^n + \\dots + a_0}{b_n x^n + \\dots + b_0} = \\frac{a_n}{b_n}$$',
    solution: '1. Divide numerator and denominator by highest degree $x^3$:\n$$\\lim_{x \\to \\infty} \\frac{6 - \\frac{4}{x^2} + \\frac{1}{x^3}}{2 + \\frac{5}{x} - \\frac{9}{x^3}}$$\n2. Since $\\lim_{x \\to \\infty} \\frac{1}{x^k} = 0$ for $k > 0$:\n$$\\frac{6 - 0 + 0}{2 + 0 - 0} = \\frac{6}{2} = 3$$',
    correctAnswer: 3,
    tolerance: 0.01,
    unit: ''
  },
  m11: {
    formula: '$$\\left(\\frac{u}{v}\\right)\' = \\frac{u\'v - uv\'}{v^2}$$',
    solution: '1. Define $u(x) = e^{3x} \\implies u\'(x) = 3e^{3x}$ and $v(x) = x^2 + 1 \\implies v\'(x) = 2x$.\n2. Apply Quotient Rule:\n$$f\'(x) = \\frac{3e^{3x}(x^2+1) - e^{3x}(2x)}{(x^2+1)^2}$$\n3. Evaluate at $x = 0$:\n$$f\'(0) = \\frac{3(1)(1) - (1)(0)}{(0+1)^2} = \\frac{3}{1} = 3$$',
    correctAnswer: 3,
    tolerance: 0.01,
    unit: ''
  },
  m16: {
    formula: '$$f\'(x) = 0, \\quad f\'\'(x) > 0 \\implies \\text{Local Minimum}$$',
    solution: '1. Differentiate $f(x) = 2x^3 - 9x^2 + 12x + 5$ and set to zero:\n$$f\'(x) = 6x^2 - 18x + 12 = 6(x^2 - 3x + 2) = 6(x-1)(x-2) = 0$$\nCritical points are at $x = 1$ and $x = 2$.\n2. Second derivative test $f\'\'(x) = 12x - 18$:\n- $f\'\'(1) = 12(1) - 18 = -6 < 0$ (Local Maximum)\n- $f\'\'(2) = 12(2) - 18 = +6 > 0$ (Local Minimum)\n3. Local minimum is at $x = 2$.',
    correctAnswer: 2,
    tolerance: 0.01,
    unit: ''
  },
  m17: {
    formula: '$$f\'\'(x) = 0 \\quad \\text{and concavity changes sign}$$',
    solution: '1. First derivative: $$f\'(x) = 3x^2 - 12x + 9$$\n2. Second derivative: $$f\'\'(x) = 6x - 12$$\n3. Set $f\'\'(x) = 0$:\n$$6x - 12 = 0 \\implies 6x = 12 \\implies x = 2$$',
    correctAnswer: 2,
    tolerance: 0.01,
    unit: ''
  },
  m18: {
    formula: '$$V(x) = x(L - 2x)(W - 2x), \\quad V\'(x) = 0$$',
    solution: '1. Express box volume with base $(12 - 2x) \\times (12 - 2x)$ and height $x$:\n$$V(x) = x(12 - 2x)^2 = 4x^3 - 48x^2 + 144x$$\n2. Differentiate with respect to $x$ and set to zero:\n$$V\'(x) = 12x^2 - 96x + 144 = 12(x-2)(x-6) = 0$$\n3. Feasible physical domain requires $0 < x < 6$, so $x = 2\\text{ cm}$ maximizes volume.',
    correctAnswer: 2,
    tolerance: 0.01,
    unit: 'cm'
  },
  m20: {
    formula: '$$\\lim_{x \\to c} \\frac{f(x)}{g(x)} = \\lim_{x \\to c} \\frac{f\'(x)}{g\'(x)} \\quad \\left(\\text{for } \\frac{0}{0} \\text{ indeterminate form}\\right)$$',
    solution: '1. Check limit form at $x = 0$: $\\frac{e^0 - 0 - 1}{0^2} = \\frac{0}{0}$ (Indeterminate).\n2. First L\'Hôpital application:\n$$\\lim_{x \\to 0} \\frac{e^x - 1}{2x} = \\frac{0}{0}$$\n3. Second L\'Hôpital application:\n$$\\lim_{x \\to 0} \\frac{e^x}{2} = \\frac{e^0}{2} = \\frac{1}{2} = 0.5$$',
    correctAnswer: 0.5,
    tolerance: 0.01,
    unit: ''
  },
  m21: {
    formula: '$$\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C, \\quad \\int_{a}^{b} f(x)\\,dx = F(b) - F(a)$$',
    solution: '1. Compute the antiderivative:\n$$F(x) = \\int (3x^2 - 2x + 4)\\,dx = x^3 - x^2 + 4x$$\n2. Evaluate between $x = 1$ and $x = 3$:\n$$F(3) = (3)^3 - (3)^2 + 4(3) = 27 - 9 + 12 = 30$$\n$$F(1) = (1)^3 - (1)^2 + 4(1) = 1 - 1 + 4 = 4$$\n3. Subtract bounds: $F(3) - F(1) = 30 - 4 = 26$.',
    correctAnswer: 26,
    tolerance: 0.01,
    unit: ''
  },
  m23: {
    formula: '$$\\int [g(x)]^n g\'(x) \\, dx = \\frac{[g(x)]^{n+1}}{n+1} + C$$',
    solution: '1. Let $u = \\sin(x) \\implies du = \\cos(x)\\,dx$.\n2. Transform limits:\n- At $x = 0$: $u(0) = \\sin(0) = 0$\n- At $x = \\frac{\\pi}{2}$: $u(\\frac{\\pi}{2}) = \\sin(\\frac{\\pi}{2}) = 1$\n3. Integrate:\n$$\\int_{0}^{1} u^2 \\, du = \\left[ \\frac{u^3}{3} \\right]_{0}^{1} = \\frac{1}{3} - 0 \\approx 0.333$$',
    correctAnswer: 0.333,
    tolerance: 0.01,
    unit: ''
  },
  m26: {
    formula: '$$A = \\int_{a}^{b} [f(x) - g(x)] \\, dx$$',
    solution: '1. Find intersection points: $4 - x^2 = 0 \\implies x = \\pm 2$.\n2. Set up definite integral by symmetry:\n$$A = \\int_{-2}^{2} (4 - x^2)\\,dx = 2 \\int_{0}^{2} (4 - x^2)\\,dx$$\n3. Evaluate antiderivative:\n$$A = 2 \\left[ 4x - \\frac{x^3}{3} \\right]_{0}^{2} = 2 \\left( 8 - \\frac{8}{3} \\right) = 2 \\left(\\frac{16}{3}\\right) = \\frac{32}{3} \\approx 10.67$$',
    correctAnswer: 10.67,
    tolerance: 0.1,
    unit: ''
  },
  m29: {
    formula: '$$\\int_{a}^{\\infty} f(x)\\,dx = \\lim_{b \\to \\infty} \\int_{a}^{b} f(x)\\,dx$$',
    solution: '1. Express as limit of proper integral:\n$$\\lim_{b \\to \\infty} \\int_{1}^{b} x^{-2}\\,dx = \\lim_{b \\to \\infty} \\left[ -\\frac{1}{x} \\right]_{1}^{b}$$\n2. Evaluate upper and lower bounds:\n$$\\lim_{b \\to \\infty} \\left( -\\frac{1}{b} - \\left(-\\frac{1}{1}\\right) \\right) = 0 + 1 = 1$$',
    correctAnswer: 1,
    tolerance: 0.01,
    unit: ''
  },
  m30: {
    formula: '$$\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc$$',
    solution: '1. Apply 2x2 determinant formula:\n$$\\det(A) = (4)(5) - (-2)(3)$$\n2. Simplify:\n$$\\det(A) = 20 - (-6) = 20 + 6 = 26$$',
    correctAnswer: 26,
    tolerance: 0.01,
    unit: ''
  },
  m32: {
    formula: '$$\\vec{u} \\cdot \\vec{v} = u_x v_x + u_y v_y + u_z v_z$$',
    solution: '1. Multiply corresponding vector components:\n$$\\vec{u} \\cdot \\vec{v} = (3)(2) + (-4)(1) + (2)(-5)$$\n2. Compute sum of scalar products:\n$$\\vec{u} \\cdot \\vec{v} = 6 - 4 - 10 = -8$$',
    correctAnswer: -8,
    tolerance: 0.01,
    unit: ''
  },
  m34: {
    formula: '$$\\frac{dy}{dx} = g(x)h(y) \\implies \\int \\frac{1}{h(y)}\\,dy = \\int g(x)\\,dx$$',
    solution: '1. Separate variables and integrate:\n$$\\int \\frac{1}{y^2}\\,dy = \\int 2x\\,dx \\implies -\\frac{1}{y} = x^2 + C$$\n2. Apply initial condition $y(0) = \\frac{1}{2}$:\n$$-\\frac{1}{1/2} = -2 = 0 + C \\implies C = -2$$\n3. Solve for $y(x)$:\n$$-\\frac{1}{y} = x^2 - 2 \\implies \\frac{1}{y} = 2 - x^2 \\implies y(x) = \\frac{1}{2 - x^2}$$\n4. Evaluate at $x = 1$:\n$$y(1) = \\frac{1}{2 - 1^2} = \\frac{1}{1} = 1$$',
    correctAnswer: 1,
    tolerance: 0.01,
    unit: ''
  },
  m36: {
    formula: '$$x_{n+1} = x_n - \\frac{f(x_n)}{f\'(x_n)}$$',
    solution: '1. Differentiate $f(x) = x^2 - 5 \\implies f\'(x) = 2x$.\n2. Evaluate at $x_0 = 2$:\n$$f(2) = 2^2 - 5 = 4 - 5 = -1$$\n$$f\'(2) = 2(2) = 4$$\n3. Calculate $x_1$:\n$$x_1 = 2 - \\frac{-1}{4} = 2 + 0.25 = 2.25$$',
    correctAnswer: 2.25,
    tolerance: 0.01,
    unit: ''
  },
  m38: {
    formula: '$$f_{\\text{avg}} = \\frac{1}{b - a} \\int_{a}^{b} f(x) \\, dx$$',
    solution: '1. Apply average value integral formula on $[0, 3]$:\n$$f_{\\text{avg}} = \\frac{1}{3 - 0} \\int_{0}^{3} 6x^2 \\, dx$$\n2. Evaluate antiderivative:\n$$f_{\\text{avg}} = \\frac{1}{3} \\left[ 2x^3 \\right]_{0}^{3} = \\frac{1}{3} (2 \\cdot 27 - 0) = \\frac{54}{3} = 18$$',
    correctAnswer: 18,
    tolerance: 0.01,
    unit: ''
  },
  m40: {
    formula: '$$\\int \\frac{f\'(x)}{f(x)} \\, dx = \\ln|f(x)| + C$$',
    solution: '1. Substitute $u = 1 + e^x \\implies du = e^x\\,dx$.\n2. Evaluate transformed limits:\n- At $x = 0$: $u(0) = 1 + e^0 = 2$\n- At $x = 1$: $u(1) = 1 + e^1 = 1 + e$\n3. Integrate:\n$$\\int_{2}^{1+e} \\frac{1}{u}\\,du = [\\ln(u)]_{2}^{1+e} = \\ln(1+e) - \\ln(2) = \\ln\\left(\\frac{1+e}{2}\\right)$$\n4. With $e \\approx 2.718$:\n$$\\ln\\left(\\frac{3.718}{2}\\right) = \\ln(1.859) \\approx 0.62$$',
    correctAnswer: 0.62,
    tolerance: 0.02,
    unit: ''
  },

  // ==================== PHYSICS (30 numeric) ====================
  p01: {
    formula: '$$a = \\frac{v - u}{t}, \\quad s = ut + \\frac{1}{2}at^2$$',
    solution: '1. Acceleration: $$a = \\frac{30\\text{ m/s} - 0}{6\\text{ s}} = 5\\text{ m/s}^2$$\n2. Displacement: $$s = (0)(6) + \\frac{1}{2}(5)(6^2) = \\frac{1}{2}(5)(36) = 90\\text{ m}$$',
    correctAnswer: 90,
    tolerance: 0.5,
    unit: 'm'
  },
  p02: {
    formula: '$$v^2 = u^2 + 2gs$$',
    solution: '1. Using third equation of motion with $u = 0\\text{ m/s}$:\n$$v^2 = 0^2 + 2(10)(45) = 900$$\n2. Solve for impact velocity $v$:\n$$v = \\sqrt{900} = 30\\text{ m/s}$$',
    correctAnswer: 30,
    tolerance: 0.5,
    unit: 'm/s'
  },
  p04: {
    formula: '$$d_{\\text{total}} = d_{\\text{react}} + d_{\\text{brake}} = v t_{\\text{react}} + \\frac{v^2}{2a}$$',
    solution: '1. Reaction distance (constant velocity):\n$$d_{\\text{react}} = v \\cdot t_{\\text{react}} = (20\\text{ m/s})(0.5\\text{ s}) = 10\\text{ m}$$\n2. Braking distance ($v_f = 0$):\n$$d_{\\text{brake}} = \\frac{v^2}{2a} = \\frac{20^2}{2(4)} = \\frac{400}{8} = 50\\text{ m}$$\n3. Total stopping distance: $$d_{\\text{total}} = 10 + 50 = 60\\text{ m}$$',
    correctAnswer: 60,
    tolerance: 0.5,
    unit: 'm'
  },
  p06: {
    formula: '$$H_{\\text{max}} = \\frac{u^2 \\sin^2(\\theta)}{2g}$$',
    solution: '1. Vertical velocity component: $$u_y = u \\sin(30^\\circ) = (40)(0.5) = 20\\text{ m/s}$$\n2. Maximum apex height:\n$$H_{\\text{max}} = \\frac{u_y^2}{2g} = \\frac{20^2}{2(10)} = \\frac{400}{20} = 20\\text{ m}$$',
    correctAnswer: 20,
    tolerance: 0.5,
    unit: 'm'
  },
  p07: {
    formula: '$$R = \\frac{u^2 \\sin(2\\theta)}{g}$$',
    solution: '1. Apply range formula with $2\\theta = 60^\\circ$:\n$$R = \\frac{(40)^2 \\sin(60^\\circ)}{10} = \\frac{1600}{10} \\left(\\frac{\\sqrt{3}}{2}\\right) = 160 \\cdot \\frac{\\sqrt{3}}{2} = 80\\sqrt{3}$$\n2. Decimal approximation:\n$$R = 80(1.732) \\approx 138.6\\text{ m}$$',
    correctAnswer: 138.6,
    tolerance: 1.0,
    unit: 'm'
  },
  p10: {
    formula: '$$t = \\sqrt{\\frac{2h}{g}}, \\quad x = v_x t$$',
    solution: '1. Time of flight for vertical drop from rest ($u_y = 0$):\n$$h = \\frac{1}{2}gt^2 \\implies 20 = \\frac{1}{2}(10)t^2 \\implies t^2 = 4 \\implies t = 2\\text{ s}$$\n2. Horizontal distance covered:\n$$x = v_x \\cdot t = (15\\text{ m/s})(2\\text{ s}) = 30\\text{ m}$$',
    correctAnswer: 30,
    tolerance: 0.5,
    unit: 'm'
  },
  p11: {
    formula: '$$a = g \\sin(\\theta)$$',
    solution: '1. Resolve gravity component parallel to the incline:\n$$F_{\\parallel} = mg \\sin(\\theta)$$\n2. Acceleration along incline:\n$$a = \\frac{F_{\\parallel}}{m} = g \\sin(30^\\circ) = (10\\text{ m/s}^2)(0.5) = 5\\text{ m/s}^2$$',
    correctAnswer: 5,
    tolerance: 0.1,
    unit: 'm/s^2'
  },
  p12: {
    formula: '$$f_{s,\\text{max}} = \\mu_s N = \\mu_s mg$$',
    solution: '1. Normal force on flat horizontal surface:\n$$N = mg = (10\\text{ kg})(10\\text{ m/s}^2) = 100\\text{ N}$$\n2. Maximum static friction threshold:\n$$F_{\\text{min}} = f_{s,\\text{max}} = \\mu_s N = (0.4)(100\\text{ N}) = 40\\text{ N}$$',
    correctAnswer: 40,
    tolerance: 0.5,
    unit: 'N'
  },
  p14: {
    formula: '$$a = \\frac{m_1 - m_2}{m_1 + m_2} g$$',
    solution: '1. Net accelerating force: $$F_{\\text{net}} = (m_1 - m_2)g = (3 - 2)(10) = 10\\text{ N}$$\n2. Total moving mass: $$m_{\\text{total}} = m_1 + m_2 = 3 + 2 = 5\\text{ kg}$$\n3. Acceleration: $$a = \\frac{F_{\\text{net}}}{m_{\\text{total}}} = \\frac{10\\text{ N}}{5\\text{ kg}} = 2\\text{ m/s}^2$$',
    correctAnswer: 2,
    tolerance: 0.1,
    unit: 'm/s^2'
  },
  p15: {
    formula: '$$N = m(g + a)$$',
    solution: '1. Apply Newton\'s 2nd Law in vertical direction:\n$$N - mg = ma \\implies N = m(g + a)$$\n2. Substitute values:\n$$N = 60\\text{ kg} \\cdot (10 + 2)\\text{ m/s}^2 = 60 \\cdot 12 = 720\\text{ N}$$',
    correctAnswer: 720,
    tolerance: 2.0,
    unit: 'N'
  },
  p16: {
    formula: '$$W = F d \\cos(\\theta)$$',
    solution: '1. Apply work formula for constant force at angle $\\theta$:\n$$W = (50\\text{ N})(10\\text{ m})\\cos(60^\\circ)$$\n2. With $\\cos(60^\\circ) = 0.5$:\n$$W = 500 \\cdot 0.5 = 250\\text{ J}$$',
    correctAnswer: 250,
    tolerance: 1.0,
    unit: 'J'
  },
  p17: {
    formula: '$$U_e = \\frac{1}{2} k x^2$$',
    solution: '1. Substitute spring constant $k = 200\\text{ N/m}$ and displacement $x = 0.3\\text{ m}$:\n$$U_e = \\frac{1}{2}(200)(0.3)^2$$\n2. Compute:\n$$U_e = 100 \\cdot 0.09 = 9\\text{ J}$$',
    correctAnswer: 9,
    tolerance: 0.1,
    unit: 'J'
  },
  p18: {
    formula: '$$P = F v = mg v$$',
    solution: '1. Lifting force at constant velocity equals load weight:\n$$F = mg = (100\\text{ kg})(10\\text{ m/s}^2) = 1000\\text{ N}$$\n2. Mechanical power output:\n$$P = F \\cdot v = (1000\\text{ N})(2\\text{ m/s}) = 2000\\text{ W}$$',
    correctAnswer: 2000,
    tolerance: 10.0,
    unit: 'W'
  },
  p19: {
    formula: '$$v_{\\text{min}} = \\sqrt{g R}$$',
    solution: '1. At apex, centripetal force is supplied by gravity when normal force $N = 0$:\n$$mg = \\frac{m v^2}{R} \\implies v^2 = g R$$\n2. Substitute radius $R = 10\\text{ m}$ and $g = 10\\text{ m/s}^2$:\n$$v_{\\text{min}} = \\sqrt{(10)(10)} = \\sqrt{100} = 10\\text{ m/s}$$',
    correctAnswer: 10,
    tolerance: 0.2,
    unit: 'm/s'
  },
  p21: {
    formula: '$$J = \\Delta p = m(v_f - v_i)$$',
    solution: '1. Calculate change in momentum:\n$$\\Delta p = m(v_f - v_i) = 0.2\\text{ kg} \\cdot (-15 - 10)\\text{ m/s} = 0.2(-25) = -5\\text{ N}\\cdot\\text{s}$$\n2. Magnitude of impulse:\n$$|J| = |-5\\text{ N}\\cdot\\text{s}| = 5\\text{ N}\\cdot\\text{s}$$',
    correctAnswer: 5,
    tolerance: 0.1,
    unit: 'N s'
  },
  p22: {
    formula: '$$m_1 v_1 + m_2 v_2 = (m_1 + m_2) v_f$$',
    solution: '1. Apply conservation of linear momentum:\n$$(2\\text{ kg})(6\\text{ m/s}) + (4\\text{ kg})(0\\text{ m/s}) = (2 + 4) v_f$$\n2. Solve for $v_f$:\n$$12 = 6 v_f \\implies v_f = \\frac{12}{6} = 2\\text{ m/s}$$',
    correctAnswer: 2,
    tolerance: 0.1,
    unit: 'm/s'
  },
  p24: {
    formula: '$$x_{\\text{cm}} = \\frac{\\sum m_i x_i}{\\sum m_i} = \\frac{m_1 x_1 + m_2 x_2}{m_1 + m_2}$$',
    solution: '1. Substitute mass coordinates into center of mass formula:\n$$x_{\\text{cm}} = \\frac{(2\\text{ kg})(0\\text{ m}) + (3\\text{ kg})(10\\text{ m})}{2\\text{ kg} + 3\\text{ kg}}$$\n2. Simplify:\n$$x_{\\text{cm}} = \\frac{0 + 30}{5} = 6\\text{ m}$$',
    correctAnswer: 6,
    tolerance: 0.1,
    unit: 'm'
  },
  p25: {
    formula: '$$p_{\\text{initial}} = 0 \\implies m_1 v_1 + m_2 v_2 = 0$$',
    solution: '1. Conservation of momentum from rest:\n$$(2\\text{ kg})(20\\text{ m/s}) + (4\\text{ kg})(v_2) = 0$$\n2. Solve for velocity $v_2$:\n$$40 + 4v_2 = 0 \\implies 4v_2 = -40 \\implies v_2 = -10\\text{ m/s}$$\n3. The speed (magnitude) is $10\\text{ m/s}$.',
    correctAnswer: 10,
    tolerance: 0.2,
    unit: 'm/s'
  },
  p26: {
    formula: '$$\\tau = r F \\sin(\\theta)$$',
    solution: '1. Apply torque formula with perpendicular angle $\\theta = 90^\\circ$ ($\\sin(90^\\circ) = 1$):\n$$\\tau = (0.25\\text{ m})(40\\text{ N})(1)$$\n2. Calculate:\n$$\\tau = 10\\text{ N}\\cdot\\text{m}$$',
    correctAnswer: 10,
    tolerance: 0.1,
    unit: 'N m'
  },
  p27: {
    formula: '$$I = \\frac{1}{2} M R^2$$',
    solution: '1. Substitute disk parameters into moment of inertia formula:\n$$I = \\frac{1}{2}(4\\text{ kg})(0.5\\text{ m})^2$$\n2. Compute:\n$$I = 2 \\cdot 0.25 = 0.5\\text{ kg}\\cdot\\text{m}^2$$',
    correctAnswer: 0.5,
    tolerance: 0.02,
    unit: 'kg m^2'
  },
  p29: {
    formula: '$$K_{\\text{rot}} = \\frac{1}{2} I \\omega^2$$',
    solution: '1. Substitute moment of inertia $I = 2\\text{ kg}\\cdot\\text{m}^2$ and $\\omega = 10\\text{ rad/s}$:\n$$K_{\\text{rot}} = \\frac{1}{2}(2)(10)^2$$\n2. Compute:\n$$K_{\\text{rot}} = 1 \\cdot 100 = 100\\text{ J}$$',
    correctAnswer: 100,
    tolerance: 1.0,
    unit: 'J'
  },
  p30: {
    formula: '$$Mgh = \\frac{1}{2}Mv^2 + \\frac{1}{2}I\\omega^2 = \\frac{3}{4}Mv^2 \\implies v = \\sqrt{\\frac{4}{3}gh}$$',
    solution: '1. Conservation of total mechanical energy (translational + rotational):\n$$Mgh = \\frac{1}{2}Mv^2 + \\frac{1}{2}\\left(\\frac{1}{2}MR^2\\right)\\left(\\frac{v}{R}\\right)^2 = \\frac{3}{4}Mv^2$$\n2. Solve for velocity $v$:\n$$v = \\sqrt{\\frac{4}{3}gh} = \\sqrt{\\frac{4}{3}(10)(3)} = \\sqrt{40} \\approx 6.32\\text{ m/s}$$',
    correctAnswer: 6.32,
    tolerance: 0.1,
    unit: 'm/s'
  },
  p31: {
    formula: '$$\\frac{1}{R_{\\text{eq}}} = \\frac{1}{R_1} + \\frac{1}{R_2} \\implies R_{\\text{eq}} = \\frac{R_1 R_2}{R_1 + R_2}$$',
    solution: '1. Apply parallel resistance product-over-sum rule:\n$$R_{\\text{eq}} = \\frac{60 \\cdot 40}{60 + 40}$$\n2. Simplify:\n$$R_{\\text{eq}} = \\frac{2400}{100} = 24\\,\\Omega$$',
    correctAnswer: 24,
    tolerance: 0.2,
    unit: 'Ω'
  },
  p32: {
    formula: '$$P = I^2 R = \\frac{V^2}{R} = V I$$',
    solution: '1. Joule heating power formula:\n$$P = I^2 R = (3\\text{ A})^2 \\cdot (12\\,\\Omega)$$\n2. Compute:\n$$P = 9 \\cdot 12 = 108\\text{ W}$$',
    correctAnswer: 108,
    tolerance: 1.0,
    unit: 'W'
  },
  p34: {
    formula: '$$V_2 = V_{\\text{in}} \\left( \\frac{R_2}{R_1 + R_2} \\right)$$',
    solution: '1. Apply voltage divider formula:\n$$V_2 = 24\\text{ V} \\cdot \\left( \\frac{300\\,\\Omega}{100\\,\\Omega + 300\\,\\Omega} \\right)$$\n2. Compute:\n$$V_2 = 24 \\cdot \\frac{300}{400} = 24 \\cdot \\frac{3}{4} = 18\\text{ V}$$',
    correctAnswer: 18,
    tolerance: 0.2,
    unit: 'V'
  },
  p35: {
    formula: '$$I_1 = I_{\\text{total}} \\left( \\frac{R_2}{R_1 + R_2} \\right)$$',
    solution: '1. Apply current divider formula for branch 1:\n$$I_1 = 10\\text{ A} \\cdot \\left( \\frac{30\\,\\Omega}{20\\,\\Omega + 30\\,\\Omega} \\right)$$\n2. Compute:\n$$I_1 = 10 \\cdot \\frac{30}{50} = 6\\text{ A}$$',
    correctAnswer: 6,
    tolerance: 0.1,
    unit: 'A'
  },
  p36: {
    formula: '$$I = \\frac{\\mathcal{E}}{R + r}, \\quad V_T = \\mathcal{E} - I r = I R$$',
    solution: '1. Calculate circuit current:\n$$I = \\frac{\\mathcal{E}}{R + r} = \\frac{12.0\\text{ V}}{5.50 + 0.50\\,\\Omega} = \\frac{12.0}{6.00} = 2.0\\text{ A}$$\n2. Calculate terminal voltage:\n$$V_T = \\mathcal{E} - Ir = 12.0\\text{ V} - (2.0\\text{ A})(0.50\\,\\Omega) = 12.0 - 1.0 = 11.0\\text{ V}$$',
    correctAnswer: 11,
    tolerance: 0.1,
    unit: 'V'
  },
  p37: {
    formula: '$$U = \\frac{1}{2} C V^2$$',
    solution: '1. Substitute $C = 50 \\times 10^{-6}\\text{ F}$ and $V = 200\\text{ V}$:\n$$U = \\frac{1}{2}(50 \\times 10^{-6}\\text{ F})(200\\text{ V})^2$$\n2. Compute:\n$$U = (25 \\times 10^{-6})(40000) = 1.0\\text{ J}$$',
    correctAnswer: 1,
    tolerance: 0.05,
    unit: 'J'
  },
  p38: {
    formula: '$$\\tau = R C$$',
    solution: '1. Multiply resistance and capacitance in base SI units:\n$$\\tau = (200 \\times 10^3\\,\\Omega) \\cdot (50 \\times 10^{-6}\\text{ F})$$\n2. Compute:\n$$\\tau = 10000 \\times 10^{-3} = 10\\text{ s}$$',
    correctAnswer: 10,
    tolerance: 0.1,
    unit: 's'
  },
  p40: {
    formula: '$$f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$$',
    solution: '1. Calculate $LC$ product:\n$$LC = (0.1\\text{ H})(10 \\times 10^{-6}\\text{ F}) = 1.0 \\times 10^{-6}\\text{ s}^2$$\n2. Square root of $LC$:\n$$\\sqrt{LC} = \\sqrt{10^{-6}} = 10^{-3}\\text{ s}$$\n3. Calculate resonant frequency:\n$$f_0 = \\frac{1}{2\\pi \\times 10^{-3}} = \\frac{1000}{2\\pi} = \\frac{1000}{6.2832} \\approx 159.15\\text{ Hz}$$',
    correctAnswer: 159.15,
    tolerance: 0.5,
    unit: 'Hz'
  },

  // ==================== COMPUTER SCIENCE (20 numeric) ====================
  cs06: {
    formula: '$$N_{10} = \\sum_{i=0}^{n-1} b_i \\cdot 2^i$$',
    solution: '1. Expand binary bits by positional powers of 2:\n$$10110100_2 = (1 \\cdot 2^7) + (0 \\cdot 2^6) + (1 \\cdot 2^5) + (1 \\cdot 2^4) + (0 \\cdot 2^3) + (1 \\cdot 2^2) + (0 \\cdot 2^1) + (0 \\cdot 2^0)$$\n2. Sum active powers:\n$$128 + 0 + 32 + 16 + 0 + 4 + 0 + 0 = 180$$',
    correctAnswer: 180,
    tolerance: 0.01,
    unit: ''
  },
  cs07: {
    formula: '$$N_{10} = \\sum_{i=0}^{n-1} h_i \\cdot 16^i$$',
    solution: '1. In hexadecimal, digit $\\text{E} = 14_{10}$.\n2. Expand by positional powers of 16:\n$$2\\text{E}_{16} = (2 \\cdot 16^1) + (14 \\cdot 16^0)$$\n3. Evaluate sum:\n$$32 + 14 = 46$$',
    correctAnswer: 46,
    tolerance: 0.01,
    unit: ''
  },
  cs08: {
    formula: '$$N_{10} = \\sum_{i=0}^{n-1} d_i \\cdot 8^i$$',
    solution: '1. Expand octal digits by powers of 8:\n$$75_8 = (7 \\cdot 8^1) + (5 \\cdot 8^0)$$\n2. Evaluate:\n$$56 + 5 = 61$$',
    correctAnswer: 61,
    tolerance: 0.01,
    unit: ''
  },
  cs11: {
    formula: '$$\\text{Value} = -b_{n-1} \\cdot 2^{n-1} + \\sum_{i=0}^{n-2} b_i \\cdot 2^i$$',
    solution: '1. MSB is 1, indicating a negative two\'s complement integer.\n2. Invert bits (one\'s complement): $$11110110_2 \\to 00001001_2$$\n3. Add 1 to find absolute magnitude:\n$$00001001_2 + 1 = 00001010_2 = (1 \\cdot 2^3) + (1 \\cdot 2^1) = 8 + 2 = 10_{10}$$\n4. Apply negative sign: $$-10$$',
    correctAnswer: -10,
    tolerance: 0.01,
    unit: ''
  },
  cs15: {
    formula: '$$\\text{SignExtension}(b_{k-1}\\dots b_0) = \\underbrace{b_{k-1}\\dots b_{k-1}}_{m \\text{ copies}} b_{k-1}\\dots b_0$$',
    solution: '1. Sign extension replicates the sign bit (MSB = 1) across the upper 4 bits:\n$$1101_2 \\implies 11111101_2$$\n2. Sign extension preserves signed two\'s complement value:\n$$-2^7 + 2^6 + 2^5 + 2^4 + 2^3 + 2^2 + 0 + 2^0 = -128 + 64 + 32 + 16 + 8 + 4 + 1 = -3$$',
    correctAnswer: -3,
    tolerance: 0.01,
    unit: ''
  },
  cs17: {
    formula: '$$\\text{Bias} = 2^{k-1} - 1 \\quad (k = 8 \\text{ exponent bits})$$',
    solution: '1. In 32-bit single precision, $k = 8$ bits are allocated to the biased exponent field.\n2. Calculate the bias constant:\n$$\\text{Bias} = 2^{8-1} - 1 = 2^7 - 1 = 128 - 1 = 127$$',
    correctAnswer: 127,
    tolerance: 0.01,
    unit: ''
  },
  cs21: {
    formula: '$$A \\land B = \\sum_{i=0}^{n-1} (a_i \\cdot b_i) \\cdot 2^i$$',
    solution: '1. Align binary values and apply bitwise AND ($\\land$) to each bit position:\n$$\\begin{array}{r@{\\quad}l}\n& 11001010_2 \\\\\n\\land & 10110110_2 \\\\\n\\hline\n= & 10000010_2\n\\end{array}$$\n2. Convert result to decimal:\n$$10000010_2 = (1 \\cdot 2^7) + (1 \\cdot 2^1) = 128 + 2 = 130$$',
    correctAnswer: 130,
    tolerance: 0.01,
    unit: ''
  },
  cs22: {
    formula: '$$a_i \\oplus b_i = (a_i + b_i) \\bmod 2$$',
    solution: '1. Apply bitwise XOR ($\\oplus$) to each bit position:\n$$\\begin{array}{r@{\\quad}l}\n& 11001100_2 \\\\\n\\oplus & 10101010_2 \\\\\n\\hline\n= & 01100110_2\n\\end{array}$$\n2. Convert binary result to decimal:\n$$01100110_2 = 2^6 + 2^5 + 2^2 + 2^1 = 64 + 32 + 4 + 2 = 102$$',
    correctAnswer: 102,
    tolerance: 0.01,
    unit: ''
  },
  cs23: {
    formula: '$$x \\ll k = x \\times 2^k$$',
    solution: '1. A left bitwise shift by $k$ bits multiplies by $2^k$:\n$$11 \\ll 3 = 11 \\times 2^3$$\n2. Evaluate:\n$$11 \\times 8 = 88$$',
    correctAnswer: 88,
    tolerance: 0.01,
    unit: ''
  },
  cs24: {
    formula: '$$x \\gg k = \\lfloor x / 2^k \\rfloor$$',
    solution: '1. A right bitwise shift by $k$ bits performs integer floor division by $2^k$:\n$$100 \\gg 2 = \\lfloor 100 / 2^2 \\rfloor = \\lfloor 100 / 4 \\rfloor$$\n2. Evaluate:\n$$100 / 4 = 25$$',
    correctAnswer: 25,
    tolerance: 0.01,
    unit: ''
  },
  cs28: {
    formula: '$$a \\mathbin{/\\!} b = \\lfloor a / b \\rfloor$$',
    solution: '1. Perform real division:\n$$-17 / 4 = -4.25$$\n2. Python floor operator $\\lfloor x \\rfloor$ rounds down toward $-\\infty$:\n$$\\lfloor -4.25 \\rfloor = -5$$',
    correctAnswer: -5,
    tolerance: 0.01,
    unit: ''
  },
  cs29: {
    formula: '$$a \\bmod b = a - b \\cdot \\lfloor a / b \\rfloor$$',
    solution: '1. Divide 14 by 5:\n$$\\lfloor 14 / 5 \\rfloor = 2$$\n2. Remainder calculation:\n$$14 - (5 \\cdot 2) = 14 - 10 = 4$$',
    correctAnswer: 4,
    tolerance: 0.01,
    unit: ''
  },
  cs31: {
    formula: '$$\\text{Total Iterations} = N_{\\text{outer}} \\times N_{\\text{inner}}$$',
    solution: '1. Outer loop runs for $i \\in \\{0, 1, 2, 3\\} \\implies 4\\text{ iterations}$.\n2. Inner loop runs for $j \\in \\{0, 1, 2\\} \\implies 3\\text{ iterations}$ for each outer step.\n3. Total executions: $$4 \\times 3 = 12$$',
    correctAnswer: 12,
    tolerance: 0.01,
    unit: ''
  },
  cs32: {
    formula: '$$x_{k+1} = 2 x_k + 1, \\quad \\text{terminating when } x \\ge 20$$',
    solution: '1. Initial state: $x = 1$.\n2. Iteration 1 ($1 < 20$): $x = 1 \\cdot 2 + 1 = 3$\n3. Iteration 2 ($3 < 20$): $x = 3 \\cdot 2 + 1 = 7$\n4. Iteration 3 ($7 < 20$): $x = 7 \\cdot 2 + 1 = 15$\n5. Iteration 4 ($15 < 20$): $x = 15 \\cdot 2 + 1 = 31$\n6. Loop check: $31 < 20$ is False. Final value is $31$.',
    correctAnswer: 31,
    tolerance: 0.01,
    unit: ''
  },
  cs34: {
    formula: '$$\\sum_{k=0}^{n} (2k + 1) = n^2$$',
    solution: '1. Filter odd integers in range $[0, 9]$:\n$$[1, 3, 5, 7, 9]$$\n2. Sum the 5 filtered elements:\n$$1 + 3 + 5 + 7 + 9 = 25$$',
    correctAnswer: 25,
    tolerance: 0.01,
    unit: ''
  },
  cs36: {
    formula: '$$n! = \\prod_{i=1}^{n} i = n \\cdot (n-1)!$$',
    solution: '1. Expand factorial recursion for $n = 5$:\n$$5! = 5 \\times 4 \\times 3 \\times 2 \\times 1$$\n2. Evaluate product:\n$$5 \\times 24 = 120$$',
    correctAnswer: 120,
    tolerance: 0.01,
    unit: ''
  },
  cs37: {
    formula: '$$F_n = F_{n-1} + F_{n-2}, \\quad F_0 = 0, \\quad F_1 = 1$$',
    solution: '1. Compute Fibonacci terms from base cases:\n- $F(0) = 0$\n- $F(1) = 1$\n- $F(2) = 0 + 1 = 1$\n- $F(3) = 1 + 1 = 2$\n- $F(4) = 1 + 2 = 3$\n- $F(5) = 2 + 3 = 5$\n- $F(6) = 3 + 5 = 8$',
    correctAnswer: 8,
    tolerance: 0.01,
    unit: ''
  },
  cs40: {
    formula: '$$\\text{Default argument values are bound once at function definition time}$$',
    solution: '1. Default parameter `target=[]` is instantiated only once when function is defined.\n2. First call `append_to(1)` mutates shared list to `[1]`.\n3. Second call `append_to(2)` appends 2 to the same shared list: `[1, 2]`.\n4. Length of `res` is 2.',
    correctAnswer: 2,
    tolerance: 0.01,
    unit: ''
  },
  cs44: {
    formula: '$$\\text{Worst-Case Comparisons} = \\lfloor \\log_2(N) \\rfloor + 1$$',
    solution: '1. Binary search halves the search space at each comparison:\n$$\\log_2(1024) = 10$$\n2. At most 10 comparisons are needed to locate an element or conclude absence in a sorted array of 1024 items.',
    correctAnswer: 10,
    tolerance: 0.01,
    unit: ''
  },
  cs47: {
    formula: '$$\\text{LIFO (Last-In, First-Out) stack discipline}$$',
    solution: '1. Trace stack state sequentially:\n- `push(4)` $\\implies [4]$\n- `push(8)` $\\implies [4, 8]$\n- `pop()` $\\implies [4]$ (removes 8)\n- `push(15)` $\\implies [4, 15]$\n- `push(16)` $\\implies [4, 15, 16]$\n- `pop()` $\\implies [4, 15]$ (removes 16)\n- `push(23)` $\\implies [4, 15, 23]$\n2. Top element on the stack is 23.',
    correctAnswer: 23,
    tolerance: 0.01,
    unit: ''
  }
};

// Read current questionBank.js content
const content = fs.readFileSync(qbPath, 'utf-8');

// Parse QUESTION_BANK by importing dynamically or replacing objects
import('../src/data/questionBank.js').then(m => {
  const updatedBank = m.QUESTION_BANK.map(q => {
    if (FORMULAS_AND_SOLUTIONS[q.id]) {
      const patch = FORMULAS_AND_SOLUTIONS[q.id];
      return {
        ...q,
        formula: patch.formula,
        solution: patch.solution,
        correctAnswer: patch.correctAnswer,
        tolerance: patch.tolerance,
        unit: patch.unit !== undefined ? patch.unit : (q.unit || '')
      };
    }
    return q;
  });

  const outputCode = 'export const QUESTION_BANK = ' + JSON.stringify(updatedBank, null, 2) + ';\n';
  fs.writeFileSync(qbPath, outputCode, 'utf-8');
  console.log('Successfully updated QUESTION_BANK with 67 explicit formulas and derivations.');
});
