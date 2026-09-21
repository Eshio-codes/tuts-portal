/**
 * STEM Numerical & Engineering Calculation Utilities
 * Pure functions for calculation tools and simulations
 */

/**
 * IEEE 754 32-bit Single Precision Float Decoder
 * @param {number|string} val - Float input
 * @returns {object} Decoded sign, exponent, mantissa bitstrings, hex representation, and exponent powers
 */
export function getIEEE754(val) {
  const num = parseFloat(val);
  if (isNaN(num)) {
    return {
      sign: '0',
      expBits: '00000000',
      mantBits: '00000000000000000000000',
      hex: '0x00000000',
      actualExp: 0,
      storedExp: 0
    };
  }

  const buffer = new ArrayBuffer(4);
  const floatView = new Float32Array(buffer);
  const uintView = new Uint32Array(buffer);

  floatView[0] = num;
  const bits = uintView[0];

  const binaryStr = bits.toString(2).padStart(32, '0');
  const sign = binaryStr[0];
  const expBits = binaryStr.slice(1, 9);
  const mantBits = binaryStr.slice(9, 32);
  const hex = '0x' + bits.toString(16).toUpperCase().padStart(8, '0');

  const storedExp = parseInt(expBits, 2);
  const actualExp = storedExp - 127;

  return { sign, expBits, mantBits, hex, actualExp, storedExp };
}

/**
 * DC Circuit Solver
 * Calculates equivalent resistance, terminal voltage, branch currents, and total power
 */
export function calculateDCCircuit({ voltage, internalR, r1, r2, isParallel }) {
  const v = parseFloat(voltage) || 0;
  const rInt = parseFloat(internalR) || 0;
  const res1 = parseFloat(r1) || 0.001;
  const res2 = parseFloat(r2) || 0.001;

  const rLoad = isParallel ? (res1 * res2) / (res1 + res2) : res1 + res2;
  const rTotal = rLoad + rInt;
  const currentTotal = rTotal > 0 ? v / rTotal : 0;
  const terminalVoltage = v - currentTotal * rInt;
  const vR1 = isParallel ? terminalVoltage : currentTotal * res1;
  const vR2 = isParallel ? terminalVoltage : currentTotal * res2;
  const iR1 = isParallel ? (res1 > 0 ? terminalVoltage / res1 : 0) : currentTotal;
  const iR2 = isParallel ? (res2 > 0 ? terminalVoltage / res2 : 0) : currentTotal;
  const pTotal = terminalVoltage * currentTotal;

  return {
    rLoad,
    rTotal,
    currentTotal,
    terminalVoltage,
    vR1,
    vR2,
    iR1,
    iR2,
    pTotal
  };
}

/**
 * 2D Kinematics Projectile Solver
 * Uses standard SUVAT equations under uniform gravity
 */
export function calculateProjectileKinematics({
  initialSpeed,
  launchAngle,
  initialHeight,
  gravity = 9.80,
  time = 0
}) {
  const u = parseFloat(initialSpeed) || 0;
  const thetaDeg = parseFloat(launchAngle) || 0;
  const h0 = parseFloat(initialHeight) || 0;
  const g = parseFloat(gravity) || 9.80;

  const rad = (thetaDeg * Math.PI) / 180;
  const ux = u * Math.cos(rad);
  const uy = u * Math.sin(rad);

  const discriminant = uy * uy + 2 * g * h0;
  const flightTime = discriminant >= 0 && g > 0 ? (uy + Math.sqrt(discriminant)) / g : 0;
  const peakTime = uy > 0 && g > 0 ? uy / g : 0;
  const peakHeight = h0 + (uy > 0 && g > 0 ? (uy * uy) / (2 * g) : 0);
  const maxRange = ux * flightTime;

  const t = Math.min(Math.max(parseFloat(time) || 0, 0), flightTime);
  const currentX = ux * t;
  const currentY = Math.max(0, h0 + uy * t - 0.5 * g * t * t);
  const currentVx = ux;
  const currentVy = uy - g * t;
  const currentSpeed = Math.sqrt(currentVx * currentVx + currentVy * currentVy);
  const currentAngleDeg = (Math.atan2(currentVy, currentVx) * 180) / Math.PI;

  return {
    ux,
    uy,
    flightTime,
    peakTime,
    peakHeight,
    maxRange,
    currentX,
    currentY,
    currentVx,
    currentVy,
    currentSpeed,
    currentAngleDeg
  };
}

/**
 * Newton-Raphson Root Finding Iteration
 * Solves f(x) = 0 for standard polynomial/transcendental functions
 */
export function runNewtonRaphson({
  f,
  df,
  initialGuess = 2.0,
  maxIterations = 10,
  tolerance = 1e-7
}) {
  let x = initialGuess;
  const steps = [];

  for (let i = 0; i < maxIterations; i++) {
    const fx = f(x);
    const dfx = df(x);
    if (Math.abs(dfx) < 1e-12) {
      steps.push({ iter: i + 1, x, fx, dfx, nextX: x, error: Math.abs(fx), converged: false, divZero: true });
      break;
    }
    const nextX = x - fx / dfx;
    const error = Math.abs(nextX - x);
    steps.push({ iter: i + 1, x, fx, dfx, nextX, error, converged: error < tolerance });

    if (error < tolerance) {
      x = nextX;
      break;
    }
    x = nextX;
  }

  return { root: x, steps };
}

/**
 * AC RLC Series Resonant Circuit Solver
 */
export function calculateRLC({ resistance, inductanceH, capacitanceF, frequencyHz, acVoltage }) {
  const r = parseFloat(resistance) || 1;
  const l = parseFloat(inductanceH) || 0.001;
  const c = parseFloat(capacitanceF) || 0.000001;
  const f = parseFloat(frequencyHz) || 50;
  const v = parseFloat(acVoltage) || 10;

  const omega = 2 * Math.PI * f;
  const xl = omega * l;
  const xc = 1 / (omega * c);
  const xNet = xl - xc;
  const z = Math.sqrt(r * r + xNet * xNet);
  const fResonant = 1 / (2 * Math.PI * Math.sqrt(l * c));
  const current = z > 0 ? v / z : 0;
  const phaseRad = Math.atan2(xNet, r);
  const phaseDeg = (phaseRad * 180) / Math.PI;
  const powerFactor = Math.cos(phaseRad);

  return {
    omega,
    xl,
    xc,
    xNet,
    z,
    fResonant,
    current,
    phaseRad,
    phaseDeg,
    powerFactor
  };
}
