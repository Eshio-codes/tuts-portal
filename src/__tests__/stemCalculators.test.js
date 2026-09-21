import { describe, it, expect } from 'vitest';
import {
  getIEEE754,
  calculateDCCircuit,
  calculateProjectileKinematics,
  runNewtonRaphson,
  calculateRLC
} from '../utils/stemCalculators';

describe('STEM Calculators - IEEE 754 Converter', () => {
  it('correctly decodes positive float +1.0', () => {
    const res = getIEEE754(1.0);
    expect(res.sign).toBe('0');
    expect(res.expBits).toBe('01111111'); // 127 in binary
    expect(res.mantBits).toBe('00000000000000000000000');
    expect(res.hex).toBe('0x3F800000');
    expect(res.actualExp).toBe(0);
  });

  it('correctly decodes negative float -13.625', () => {
    const res = getIEEE754(-13.625);
    expect(res.sign).toBe('1');
    expect(res.hex).toBe('0xC15A0000');
    expect(res.actualExp).toBe(3); // 13.625 = 1.703125 * 2^3
  });

  it('handles invalid NaN gracefully', () => {
    const res = getIEEE754('invalid');
    expect(res.sign).toBe('0');
    expect(res.hex).toBe('0x00000000');
  });
});

describe('STEM Calculators - DC Circuit Solver', () => {
  it('solves series resistor circuit with internal resistance', () => {
    const res = calculateDCCircuit({
      voltage: 24,
      internalR: 0.5,
      r1: 10,
      r2: 20,
      isParallel: false
    });

    expect(res.rLoad).toBe(30);
    expect(res.rTotal).toBe(30.5);
    expect(res.currentTotal).toBeCloseTo(24 / 30.5, 4);
    expect(res.terminalVoltage).toBeCloseTo(24 - (24 / 30.5) * 0.5, 4);
  });

  it('solves parallel resistor network', () => {
    const res = calculateDCCircuit({
      voltage: 12,
      internalR: 0,
      r1: 6,
      r2: 12,
      isParallel: true
    });

    // 6 || 12 = 72 / 18 = 4 ohms
    expect(res.rLoad).toBe(4);
    expect(res.currentTotal).toBe(3); // 12 / 4 = 3A
    expect(res.iR1).toBe(2); // 12 / 6 = 2A
    expect(res.iR2).toBe(1); // 12 / 12 = 1A
  });
});

describe('STEM Calculators - 2D Kinematics Projectile', () => {
  it('calculates symmetrical projectile flight time and range from ground (h0 = 0)', () => {
    const res = calculateProjectileKinematics({
      initialSpeed: 20,
      launchAngle: 30,
      initialHeight: 0,
      gravity: 9.80,
      time: 0
    });

    // uy = 20 * sin(30) = 10 m/s
    // flight time = 2 * 10 / 9.80 ≈ 2.0408 s
    expect(res.flightTime).toBeCloseTo(2.0408, 3);
    expect(res.peakHeight).toBeCloseTo((10 * 10) / (2 * 9.80), 3);
    expect(res.maxRange).toBeCloseTo(20 * Math.cos(Math.PI / 6) * res.flightTime, 3);
  });
});

describe('STEM Calculators - Newton-Raphson Solver', () => {
  it('finds root of f(x) = x^2 - 2 (sqrt(2))', () => {
    const f = (x) => x * x - 2;
    const df = (x) => 2 * x;
    const res = runNewtonRaphson({ f, df, initialGuess: 2.0, maxIterations: 10 });

    expect(res.root).toBeCloseTo(Math.SQRT2, 6);
    expect(res.steps.length).toBeGreaterThan(1);
    expect(res.steps[res.steps.length - 1].converged).toBe(true);
  });
});

describe('STEM Calculators - AC RLC Resonant Circuit', () => {
  it('calculates resonance frequency and impedance', () => {
    const res = calculateRLC({
      resistance: 10,
      inductanceH: 0.05,
      capacitanceF: 0.00002, // 20 uF
      frequencyHz: 159.155, // approx resonant frequency
      acVoltage: 50
    });

    // f0 = 1 / (2*pi*sqrt(0.05 * 20e-6)) = 1 / (2*pi*1e-3) ≈ 159.155 Hz
    expect(res.fResonant).toBeCloseTo(159.155, 1);
    expect(res.z).toBeCloseTo(10, 0); // at resonance, Z ≈ R
  });
});
