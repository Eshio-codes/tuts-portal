import React, { useState, useEffect, useRef } from 'react';
import MathTex from './MathTex';
import {
  getIEEE754,
  calculateDCCircuit,
  calculateProjectileKinematics,
  runNewtonRaphson,
  calculateRLC
} from '../utils/stemCalculators';
import {
  Cpu,
  Zap,
  Calculator,
  ArrowRight,
  RefreshCw,
  Layers,
  Play,
  Pause,
  RotateCcw,
  Crosshair,
  TrendingUp,
  Activity,
  Grid,
  Radio,
  Sliders,
  CheckCircle2,
  XCircle,
  Maximize2
} from 'lucide-react';

export default function InteractiveTools() {
  const [activeTool, setActiveTool] = useState('float');

  // ==========================================
  // Tool 1: IEEE 754 State
  // ==========================================
  const [floatInput, setFloatInput] = useState(-13.625);
  const ieee = getIEEE754(floatInput);

  // ==========================================
  // Tool 2: Circuit State
  // ==========================================
  const [voltage, setVoltage] = useState(24);
  const [internalR, setInternalR] = useState(0.5);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);
  const [isParallel, setIsParallel] = useState(false);

  const circuit = calculateDCCircuit({ voltage, internalR, r1, r2, isParallel });
  const { rLoad, rTotal, currentTotal, terminalVoltage, vR1, vR2, iR1, iR2, pTotal } = circuit;

  // ==========================================
  // Tool 3: Bitwise State
  // ==========================================
  const [numA, setNumA] = useState(90); // 0x5A
  const [numB, setNumB] = useState(15); // 0x0F

  // ==========================================
  // Tool 4: 2D Kinematics Projectile State
  // ==========================================
  const [initialSpeed, setInitialSpeed] = useState(25.0);
  const [launchAngle, setLaunchAngle] = useState(45.0);
  const [initialHeight, setInitialHeight] = useState(5.0);
  const [gravity, setGravity] = useState(9.80);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animRef = useRef(null);

  const rad = (launchAngle * Math.PI) / 180;
  const ux = initialSpeed * Math.cos(rad);
  const uy = initialSpeed * Math.sin(rad);

  const discriminant = uy * uy + 2 * gravity * initialHeight;
  const flightTime = discriminant >= 0 ? (uy + Math.sqrt(discriminant)) / gravity : 0;
  const peakTime = uy > 0 ? uy / gravity : 0;
  const peakHeight = initialHeight + (uy > 0 ? (uy * uy) / (2 * gravity) : 0);
  const maxRange = ux * flightTime;

  // Current Kinematics at currentTime
  const clampedT = Math.min(Math.max(currentTime, 0), flightTime);
  const currentX = ux * clampedT;
  const currentY = Math.max(0, initialHeight + uy * clampedT - 0.5 * gravity * clampedT * clampedT);
  const currentVx = ux;
  const currentVy = uy - gravity * clampedT;
  const currentSpeed = Math.sqrt(currentVx * currentVx + currentVy * currentVy);
  const currentAngleDeg = (Math.atan2(currentVy, currentVx) * 180) / Math.PI;

  // Projectile Animation Loop
  useEffect(() => {
    if (isPlaying) {
      const startTime = performance.now() - (currentTime / (flightTime || 1)) * (flightTime * 1000);
      const step = (time) => {
        const elapsedSec = (time - startTime) / 1000;
        if (elapsedSec >= flightTime) {
          setCurrentTime(flightTime);
          setIsPlaying(false);
        } else {
          setCurrentTime(elapsedSec);
          animRef.current = requestAnimationFrame(step);
        }
      };
      animRef.current = requestAnimationFrame(step);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, flightTime]);

  // Generate Trajectory SVG points
  const numPlotPoints = 100;
  const svgWidth = 560;
  const svgHeight = 260;
  const padding = 35;
  const plotW = svgWidth - padding * 2;
  const plotH = svgHeight - padding * 2;

  const maxXAxis = Math.max(maxRange * 1.15, 10);
  const maxYAxis = Math.max(peakHeight * 1.25, 10);

  const scaleX = (x) => padding + (x / maxXAxis) * plotW;
  const scaleY = (y) => svgHeight - padding - (y / maxYAxis) * plotH;

  const trajectoryPath = [];
  for (let i = 0; i <= numPlotPoints; i++) {
    const t = (i / numPlotPoints) * flightTime;
    const px = ux * t;
    const py = Math.max(0, initialHeight + uy * t - 0.5 * gravity * t * t);
    trajectoryPath.push(`${i === 0 ? 'M' : 'L'} ${scaleX(px).toFixed(1)} ${scaleY(py).toFixed(1)}`);
  }
  const trajectoryD = trajectoryPath.join(' ');

  // ==========================================
  // Tool 5: Newton-Raphson Root Finder State
  // ==========================================
  const ROOT_PRESETS = [
    {
      id: 'poly',
      name: 'Cubic Polynomial: x³ - 2x - 5 = 0',
      fnStr: 'f(x) = x^3 - 2x - 5',
      f: (x) => Math.pow(x, 3) - 2 * x - 5,
      df: (x) => 3 * Math.pow(x, 2) - 2,
      defaultX0: 2.0,
      xMin: 0,
      xMax: 4
    },
    {
      id: 'sqrt2',
      name: 'Square Root of 2: x² - 2 = 0',
      fnStr: 'f(x) = x^2 - 2',
      f: (x) => Math.pow(x, 2) - 2,
      df: (x) => 2 * x,
      defaultX0: 1.0,
      xMin: 0,
      xMax: 3
    },
    {
      id: 'trig',
      name: 'Transcendental: cos(x) - x = 0',
      fnStr: 'f(x) = \\cos(x) - x',
      f: (x) => Math.cos(x) - x,
      df: (x) => -Math.sin(x) - 1,
      defaultX0: 1.5,
      xMin: -1,
      xMax: 2
    },
    {
      id: 'exp',
      name: 'Exponential: eˣ - 3x = 0',
      fnStr: 'f(x) = e^x - 3x',
      f: (x) => Math.exp(x) - 3 * x,
      df: (x) => Math.exp(x) - 3,
      defaultX0: 0.0,
      xMin: -1,
      xMax: 2
    }
  ];

  const [selectedPresetId, setSelectedPresetId] = useState('poly');
  const activePreset = ROOT_PRESETS.find((p) => p.id === selectedPresetId) || ROOT_PRESETS[0];
  const [initialGuess, setInitialGuess] = useState(activePreset.defaultX0);
  const [maxIter, setMaxIter] = useState(5);

  // Compute Newton-Raphson Iterations
  const iterations = [];
  let currX = initialGuess;
  for (let k = 0; k < maxIter; k++) {
    const fx = activePreset.f(currX);
    const dfx = activePreset.df(currX);
    if (Math.abs(dfx) < 1e-12) {
      iterations.push({ k, x: currX, fx, dfx, nextX: currX, delta: 0, converged: false, err: 'Zero Derivative' });
      break;
    }
    const nextX = currX - fx / dfx;
    const delta = Math.abs(nextX - currX);
    iterations.push({
      k,
      x: currX,
      fx,
      dfx,
      nextX,
      delta,
      converged: delta < 1e-6
    });
    currX = nextX;
  }

  // ==========================================
  // Tool 6: 2D Matrix Linear Transformation State
  // ==========================================
  const [matA, setMatA] = useState(1.0);
  const [matB, setMatB] = useState(1.0); // shear preset default
  const [matC, setMatC] = useState(0.0);
  const [matD, setMatD] = useState(1.0);
  const [vecX, setVecX] = useState(2.0);
  const [vecY, setVecY] = useState(1.0);

  // Matrix Derived Metrics
  const detM = matA * matD - matB * matC;
  const traceM = matA + matD;
  const transVecX = matA * vecX + matB * vecY;
  const transVecY = matC * vecX + matD * vecY;

  // Characteristic equation: λ² - trace*λ + det = 0
  const eigenDisc = traceM * traceM - 4 * detM;
  let eigen1Str = '';
  let eigen2Str = '';
  if (eigenDisc >= 0) {
    const lambda1 = (traceM + Math.sqrt(eigenDisc)) / 2;
    const lambda2 = (traceM - Math.sqrt(eigenDisc)) / 2;
    eigen1Str = lambda1.toFixed(3);
    eigen2Str = lambda2.toFixed(3);
  } else {
    const realPart = (traceM / 2).toFixed(3);
    const imagPart = (Math.sqrt(-eigenDisc) / 2).toFixed(3);
    eigen1Str = `${realPart} + ${imagPart}i`;
    eigen2Str = `${realPart} - ${imagPart}i`;
  }

  const MATRIX_PRESETS = [
    { name: 'Identity', a: 1, b: 0, c: 0, d: 1, desc: 'Zero deformation' },
    { name: 'Rotation 45°', a: 0.707, b: -0.707, c: 0.707, d: 0.707, desc: 'Rigid orthogonal spin' },
    { name: 'Rotation 90°', a: 0, b: -1, c: 1, d: 0, desc: 'Quarter-turn rotation' },
    { name: 'X-Shear (k=1)', a: 1, b: 1, c: 0, d: 1, desc: 'Horizontal slant' },
    { name: 'Y-Shear (k=1)', a: 1, b: 0, c: 1, d: 1, desc: 'Vertical slant' },
    { name: 'Reflection Y-axis', a: -1, b: 0, c: 0, d: 1, desc: 'Invert x basis' },
    { name: 'Non-Uniform Scale', a: 2, b: 0, c: 0, d: 0.5, desc: 'Stretch X, compress Y' },
    { name: 'Projection X', a: 1, b: 0, c: 0, d: 0, desc: 'Rank-1 singular (det=0)' }
  ];

  // SVG Transformation Grid Helpers
  const matGridRange = 3.5;
  const matSvgDim = 320;
  const matOrigin = matSvgDim / 2;
  const matScale = (matSvgDim / 2 - 20) / matGridRange;

  const toSvgCoords = (x, y) => ({
    cx: matOrigin + x * matScale,
    cy: matOrigin - y * matScale
  });

  // Transformed Unit Square Vertices
  const p0 = toSvgCoords(0, 0);
  const p1 = toSvgCoords(matA, matC); // T(i_hat)
  const p2 = toSvgCoords(matA + matB, matC + matD); // T(i_hat + j_hat)
  const p3 = toSvgCoords(matB, matD); // T(j_hat)

  // ==========================================
  // Tool 7: Digital Logic Gates & Circuit State
  // ==========================================
  const [logicCircuitType, setLogicCircuitType] = useState('half_adder');
  const [inA, setInA] = useState(1);
  const [inB, setInB] = useState(1);
  const [inCin, setInCin] = useState(0);
  const [inSel, setInSel] = useState(0);
  const [inD0, setInD0] = useState(1);
  const [inD1, setInD1] = useState(0);
  const [gate1Type, setGate1Type] = useState('AND');
  const [gate2Type, setGate2Type] = useState('OR');

  // Logic Evaluation Helpers
  const evalGate = (type, a, b) => {
    switch (type) {
      case 'AND': return (a && b) ? 1 : 0;
      case 'OR': return (a || b) ? 1 : 0;
      case 'XOR': return (a ^ b) ? 1 : 0;
      case 'NAND': return !(a && b) ? 1 : 0;
      case 'NOR': return !(a || b) ? 1 : 0;
      case 'XNOR': return !(a ^ b) ? 1 : 0;
      case 'NOT': return !a ? 1 : 0;
      default: return 0;
    }
  };

  // Circuit Outcomes
  let circuitOutputs = {};
  if (logicCircuitType === 'half_adder') {
    const sum = evalGate('XOR', inA, inB);
    const carry = evalGate('AND', inA, inB);
    circuitOutputs = { sum, carry };
  } else if (logicCircuitType === 'full_adder') {
    const xor1 = evalGate('XOR', inA, inB);
    const sum = evalGate('XOR', xor1, inCin);
    const and1 = evalGate('AND', inA, inB);
    const and2 = evalGate('AND', xor1, inCin);
    const cout = evalGate('OR', and1, and2);
    circuitOutputs = { sum, cout, xor1, and1, and2 };
  } else if (logicCircuitType === 'mux2to1') {
    const notSel = inSel === 1 ? 0 : 1;
    const term0 = evalGate('AND', inD0, notSel);
    const term1 = evalGate('AND', inD1, inSel);
    const y = evalGate('OR', term0, term1);
    circuitOutputs = { y, notSel, term0, term1 };
  } else if (logicCircuitType === 'demorgan') {
    const nandOut = evalGate('NAND', inA, inB);
    const notA = inA === 1 ? 0 : 1;
    const notB = inB === 1 ? 0 : 1;
    const orNotOut = evalGate('OR', notA, notB);
    const norOut = evalGate('NOR', inA, inB);
    const andNotOut = evalGate('AND', notA, notB);
    circuitOutputs = { nandOut, orNotOut, norOut, andNotOut, notA, notB };
  } else if (logicCircuitType === 'custom') {
    const g1 = evalGate(gate1Type, inA, inB);
    const g2 = evalGate(gate2Type, g1, inCin);
    circuitOutputs = { g1, g2 };
  }

  // ==========================================
  // Tool 8: AC RLC Resonant Circuit State
  // ==========================================
  const [acVrms, setAcVrms] = useState(120);
  const [acFreq, setAcFreq] = useState(60);
  const [acR, setAcR] = useState(40);
  const [acL, setAcL] = useState(150); // mH
  const [acC, setAcC] = useState(47);  // uF

  // Calculations
  const omega = 2 * Math.PI * acFreq;
  const lHenry = acL * 1e-3;
  const cFarad = acC * 1e-6;

  const xl = omega * lHenry;
  const xc = 1 / (omega * cFarad);
  const netX = xl - xc;
  const acZ = Math.sqrt(acR * acR + netX * netX);
  const phaseRad = Math.atan2(netX, acR);
  const phaseDeg = (phaseRad * 180) / Math.PI;

  const resFreq = 1 / (2 * Math.PI * Math.sqrt(lHenry * cFarad));
  const qFactor = (1 / acR) * Math.sqrt(lHenry / cFarad);
  const bandwidthHz = resFreq / (qFactor || 1);

  const acIrms = acVrms / acZ;
  const acIpeak = acIrms * Math.SQRT2;
  const acVpeak = acVrms * Math.SQRT2;

  const vR_rms = acIrms * acR;
  const vL_rms = acIrms * xl;
  const vC_rms = acIrms * xc;
  const realPowerP = acVrms * acIrms * Math.cos(phaseRad);
  const powerFactor = Math.cos(phaseRad);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Header & Tool Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight flex items-center space-x-2">
            <span>STEM Engineering & Computing Instruments</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Interactive calculation sandboxes for floating-point registers, DC/AC circuit networks, projectile kinematics, bitwise logic, matrix transformations, and digital gates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#121215] p-1 rounded-lg border border-[#27272a] self-start sm:self-auto">
          {[
            { id: 'float', label: 'IEEE 754 Float' },
            { id: 'circuits', label: 'DC Circuit Solver' },
            { id: 'kinematics', label: '2D Kinematics' },
            { id: 'rootfinder', label: 'Newton-Raphson' },
            { id: 'matrix2d', label: '2D Matrix Transform' },
            { id: 'logicgates', label: 'Digital Logic Gates' },
            { id: 'ac_rlc', label: 'AC RLC Resonant' },
            { id: 'bitwise', label: 'Bitwise Logic' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTool(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                activeTool === tab.id
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. IEEE 754 FLOAT TOOL */}
      {activeTool === 'float' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Input Controls (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                Decimal Float Register Input
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Real value to encode:</label>
                <input
                  type="number"
                  step="any"
                  value={floatInput}
                  onChange={(e) => setFloatInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-zinc-100 font-mono text-base font-semibold focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Quick Presets */}
              <div className="pt-2 border-t border-[#27272a]">
                <span className="text-[11px] text-zinc-400 font-mono block mb-2">Test Vectors:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[-13.625, 1.0, 0.15625, -0.75, 42.0, 0.0].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setFloatInput(preset)}
                      className="px-2 py-1 rounded bg-[#09090b] hover:bg-zinc-800 text-zinc-300 font-mono text-xs border border-[#27272a]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* IEEE Standard Reference */}
              <div className="p-3 rounded bg-[#09090b] border border-[#27272a] text-xs font-mono text-zinc-400 space-y-1">
                <div className="text-[11px] font-semibold text-zinc-300 uppercase">Single Precision Specs</div>
                <div>• Total Width: 32 bits</div>
                <div>• Exponent Bias: +127 (2^(8-1)-1)</div>
                <div>• Precision: ~7 decimal digits</div>
              </div>
            </div>

            {/* Visualizer Display (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-lg bg-[#121215] border border-[#27272a] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <h3 className="text-sm font-semibold text-zinc-100">32-Bit Binary Layout & Hex Representation</h3>
                <span className="px-2.5 py-1 rounded bg-[#09090b] text-zinc-100 font-mono font-semibold text-xs border border-zinc-700">
                  {ieee.hex}
                </span>
              </div>

              {/* Colored Bit Fields Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-[11px] text-zinc-400 px-1">
                  <span className="text-rose-400">Sign (1b)</span>
                  <span className="text-amber-400">Exponent (8b)</span>
                  <span className="text-zinc-300">Fraction / Mantissa (23b)</span>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex flex-wrap items-center gap-1.5 font-mono text-xs tracking-wider justify-center">
                  <span className="px-2 py-1 bg-rose-950/40 text-rose-300 border border-rose-800/40 rounded font-semibold" title="Sign Bit [31]">
                    {ieee.sign}
                  </span>
                  <span className="px-2 py-1 bg-amber-950/40 text-amber-300 border border-amber-800/40 rounded font-semibold" title="Biased Exponent [30:23]">
                    {ieee.expBits}
                  </span>
                  <span className="px-2 py-1 bg-zinc-900 text-zinc-200 border border-zinc-700 rounded" title="Fraction [22:0]">
                    {ieee.mantBits}
                  </span>
                </div>
              </div>

              {/* Evaluation Steps Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Sign Evaluation</div>
                  <div className="text-sm font-semibold text-rose-400 mt-1">
                    (-1)^{ieee.sign} = {ieee.sign === '1' ? '-1 (Negative)' : '+1 (Positive)'}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Biased Exponent (e)</div>
                  <div className="text-sm font-semibold text-amber-400 mt-1">
                    {ieee.storedExp} - 127 = {ieee.actualExp}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Normalized Scientific</div>
                  <div className="text-sm font-semibold text-zinc-200 mt-1 truncate">
                    1.{ieee.mantBits.slice(0, 6)}... × 2^{ieee.actualExp}
                  </div>
                </div>
              </div>

              {/* Exact Formula Breakdown */}
              <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-2">
                <div className="text-xs font-mono font-semibold text-zinc-300">Mathematical Reconstruction:</div>
                <div className="text-xs font-mono text-zinc-400 overflow-x-auto py-1">
                  Value = (-1)^{ieee.sign} × (1 + Σ (b_{'{23-i}'} × 2^{-i})) × 2^{'{' + ieee.storedExp + ' - 127}'}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 2. DC CIRCUIT SOLVER */}
      {activeTool === 'circuits' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Circuit Inputs (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                Network Parameters
              </div>

              {/* Source EMF */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Source EMF (ℰ):</span>
                  <span className="text-zinc-200 font-semibold">{voltage} V</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="48"
                  value={voltage}
                  onChange={(e) => setVoltage(parseFloat(e.target.value))}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Internal Resistance */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Internal Resistance (r):</span>
                  <span className="text-zinc-200 font-semibold">{internalR} Ω</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={internalR}
                  onChange={(e) => setInternalR(parseFloat(e.target.value))}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Resistor R1 */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Load Resistor R₁:</span>
                  <span className="text-zinc-200 font-semibold">{r1} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={r1}
                  onChange={(e) => setR1(parseFloat(e.target.value))}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Resistor R2 */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Load Resistor R₂:</span>
                  <span className="text-zinc-200 font-semibold">{r2} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={r2}
                  onChange={(e) => setR2(parseFloat(e.target.value))}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Topology Toggle */}
              <div className="pt-2 border-t border-[#27272a]">
                <label className="block text-xs font-mono text-zinc-400 mb-2">Topology Configuration:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setIsParallel(false)}
                    className={`py-2 px-3 rounded text-xs font-mono font-medium border transition-all ${
                      !isParallel
                        ? 'bg-zinc-800 text-zinc-100 border-zinc-600'
                        : 'bg-[#09090b] text-zinc-400 border-[#27272a] hover:text-zinc-200'
                    }`}
                  >
                    Series (VDR)
                  </button>
                  <button
                    onClick={() => setIsParallel(true)}
                    className={`py-2 px-3 rounded text-xs font-mono font-medium border transition-all ${
                      isParallel
                        ? 'bg-zinc-800 text-zinc-100 border-zinc-600'
                        : 'bg-[#09090b] text-zinc-400 border-[#27272a] hover:text-zinc-200'
                    }`}
                  >
                    Parallel (CDR)
                  </button>
                </div>
              </div>

            </div>

            {/* Solved Circuit Outputs (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-lg bg-[#121215] border border-[#27272a] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <h3 className="text-sm font-semibold text-zinc-100">Kirchhoff & Ohm Network Analysis</h3>
                <span className="px-2.5 py-1 rounded bg-[#09090b] text-emerald-400 font-mono font-semibold text-xs border border-zinc-700">
                  {isParallel ? 'Parallel Network' : 'Series Divider'}
                </span>
              </div>

              {/* Primary Quantities Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Load Req</div>
                  <div className="text-sm font-semibold text-zinc-100 mt-1">{rLoad.toFixed(2)} Ω</div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Total Circuit Current</div>
                  <div className="text-sm font-semibold text-sky-400 mt-1">{currentTotal.toFixed(3)} A</div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Terminal Voltage (Vt)</div>
                  <div className="text-sm font-semibold text-amber-400 mt-1">{terminalVoltage.toFixed(2)} V</div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Delivered Power</div>
                  <div className="text-sm font-semibold text-emerald-400 mt-1">{pTotal.toFixed(2)} W</div>
                </div>
              </div>

              {/* Component-Level Breakdown */}
              <div className="border border-[#27272a] rounded-lg overflow-hidden font-mono text-xs">
                <div className="bg-[#09090b] px-4 py-2 text-zinc-400 font-semibold border-b border-[#27272a]">
                  Individual Element Measurements
                </div>
                <div className="p-4 space-y-3 bg-[#121215]">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Internal Battery Drop (r = {internalR}Ω):</span>
                    <span className="text-rose-400 font-semibold">{(currentTotal * internalR).toFixed(2)} V | {(currentTotal * currentTotal * internalR).toFixed(2)} W lost</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Resistor R₁ ({r1}Ω):</span>
                    <span className="text-zinc-100 font-semibold">{vR1.toFixed(2)} V | {iR1.toFixed(3)} A | {(vR1 * iR1).toFixed(2)} W</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300">Resistor R₂ ({r2}Ω):</span>
                    <span className="text-zinc-100 font-semibold">{vR2.toFixed(2)} V | {iR2.toFixed(3)} A | {(vR2 * iR2).toFixed(2)} W</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 3. 2D KINEMATICS PROJECTILE SIMULATOR */}
      {activeTool === 'kinematics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Controls (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                Launch Parameters
              </div>

              {/* Launch Speed */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Initial Speed (u):</span>
                  <span className="text-zinc-200 font-semibold">{initialSpeed} m/s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="0.5"
                  value={initialSpeed}
                  onChange={(e) => {
                    setInitialSpeed(parseFloat(e.target.value));
                    setCurrentTime(0);
                    setIsPlaying(false);
                  }}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Launch Angle */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Launch Angle (θ):</span>
                  <span className="text-zinc-200 font-semibold">{launchAngle}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={launchAngle}
                  onChange={(e) => {
                    setLaunchAngle(parseFloat(e.target.value));
                    setCurrentTime(0);
                    setIsPlaying(false);
                  }}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Initial Height */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Platform Height (h₀):</span>
                  <span className="text-zinc-200 font-semibold">{initialHeight} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="30"
                  step="0.5"
                  value={initialHeight}
                  onChange={(e) => {
                    setInitialHeight(parseFloat(e.target.value));
                    setCurrentTime(0);
                    setIsPlaying(false);
                  }}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Planetary Gravitational Presets */}
              <div className="pt-2 border-t border-[#27272a]">
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Gravitational Field (g):</label>
                <div className="grid grid-cols-3 gap-1.5 text-xs font-mono">
                  {[
                    { name: 'Earth', g: 9.80 },
                    { name: 'Moon', g: 1.62 },
                    { name: 'Mars', g: 3.72 }
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => {
                        setGravity(p.g);
                        setCurrentTime(0);
                        setIsPlaying(false);
                      }}
                      className={`p-1.5 rounded border text-center transition-all ${
                        gravity === p.g
                          ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-semibold'
                          : 'bg-[#09090b] text-zinc-400 border-[#27272a] hover:text-zinc-200'
                      }`}
                    >
                      {p.name} ({p.g})
                    </button>
                  ))}
                </div>
              </div>

              {/* Playback Controls */}
              <div className="pt-2 border-t border-[#27272a] space-y-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : 'Animate Flight'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentTime(0);
                    }}
                    className="p-2 bg-[#09090b] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded border border-[#27272a]"
                    title="Reset to t=0"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Time Scrubber */}
                <div>
                  <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                    <span>Time Scrubber (t):</span>
                    <span className="text-zinc-200 font-semibold">{clampedT.toFixed(2)} / {flightTime.toFixed(2)} s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={flightTime || 1}
                    step="0.01"
                    value={clampedT}
                    onChange={(e) => {
                      setIsPlaying(false);
                      setCurrentTime(parseFloat(e.target.value));
                    }}
                    className="w-full accent-zinc-400"
                  />
                </div>
              </div>

            </div>

            {/* SVG Flight Plot (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span>2D Parabolic Trajectory Vector Field</span>
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  t = {clampedT.toFixed(2)}s | y(t) = {currentY.toFixed(2)}m
                </span>
              </div>

              {/* Vector Trajectory SVG Canvas */}
              <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center justify-center overflow-x-auto">
                <svg width={svgWidth} height={svgHeight} className="overflow-visible select-none">
                  {/* Grid Lines */}
                  {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => (
                    <g key={idx}>
                      {/* Horizontal Grid */}
                      <line
                        x1={padding}
                        y1={scaleY(frac * maxYAxis)}
                        x2={svgWidth - padding}
                        y2={scaleY(frac * maxYAxis)}
                        stroke="#27272a"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={padding - 6}
                        y={scaleY(frac * maxYAxis) + 3}
                        fill="#71717a"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="end"
                      >
                        {(frac * maxYAxis).toFixed(0)}m
                      </text>

                      {/* Vertical Grid */}
                      <line
                        x1={scaleX(frac * maxXAxis)}
                        y1={padding}
                        x2={scaleX(frac * maxXAxis)}
                        y2={svgHeight - padding}
                        stroke="#27272a"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={scaleX(frac * maxXAxis)}
                        y={svgHeight - padding + 14}
                        fill="#71717a"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                      >
                        {(frac * maxXAxis).toFixed(0)}m
                      </text>
                    </g>
                  ))}

                  {/* Axes */}
                  <line
                    x1={padding}
                    y1={svgHeight - padding}
                    x2={svgWidth - padding + 10}
                    y2={svgHeight - padding}
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />
                  <line
                    x1={padding}
                    y1={padding - 10}
                    x2={padding}
                    y2={svgHeight - padding}
                    stroke="#52525b"
                    strokeWidth="1.5"
                  />

                  {/* Trajectory Parabola Curve */}
                  <path
                    d={trajectoryD}
                    fill="none"
                    stroke="#3f3f46"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Traversed Path */}
                  {clampedT > 0 && (
                    <path
                      d={(() => {
                        const traversedPoints = [];
                        const steps = Math.floor((clampedT / (flightTime || 1)) * numPlotPoints) || 1;
                        for (let i = 0; i <= steps; i++) {
                          const t = (i / numPlotPoints) * flightTime;
                          const px = ux * t;
                          const py = Math.max(0, initialHeight + uy * t - 0.5 * gravity * t * t);
                          traversedPoints.push(`${i === 0 ? 'M' : 'L'} ${scaleX(px).toFixed(1)} ${scaleY(py).toFixed(1)}`);
                        }
                        return traversedPoints.join(' ');
                      })()}
                      fill="none"
                      stroke="#e4e4e7"
                      strokeWidth="2.5"
                    />
                  )}

                  {/* Apex Point Marker */}
                  {peakHeight > initialHeight && (
                    <g>
                      <circle
                        cx={scaleX(ux * peakTime)}
                        cy={scaleY(peakHeight)}
                        r="3.5"
                        fill="#f59e0b"
                      />
                      <text
                        x={scaleX(ux * peakTime)}
                        y={scaleY(peakHeight) - 8}
                        fill="#f59e0b"
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        Apex ({peakHeight.toFixed(1)}m)
                      </text>
                    </g>
                  )}

                  {/* Impact Point Marker */}
                  <circle
                    cx={scaleX(maxRange)}
                    cy={scaleY(0)}
                    r="3.5"
                    fill="#ef4444"
                  />
                  <text
                    x={scaleX(maxRange)}
                    y={scaleY(0) + 14}
                    fill="#ef4444"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    fontWeight="bold"
                  >
                    R = {maxRange.toFixed(1)}m
                  </text>

                  {/* Live Projectile Particle */}
                  <g transform={`translate(${scaleX(currentX)}, ${scaleY(currentY)})`}>
                    <circle r="6" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
                    {/* Velocity Vector Arrow */}
                    <line
                      x1="0"
                      y1="0"
                      x2={(currentVx / (initialSpeed || 1)) * 25}
                      y2={(-currentVy / (initialSpeed || 1)) * 25}
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                  </g>
                </svg>
              </div>

              {/* Instantaneous Metrics Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-400 uppercase">Max Range (R)</div>
                  <div className="text-sm font-semibold text-zinc-100 mt-0.5">{maxRange.toFixed(2)} m</div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-400 uppercase">Apex Height (H)</div>
                  <div className="text-sm font-semibold text-zinc-100 mt-0.5">{peakHeight.toFixed(2)} m</div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-400 uppercase">Total Flight (T)</div>
                  <div className="text-sm font-semibold text-zinc-100 mt-0.5">{flightTime.toFixed(2)} s</div>
                </div>
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-400 uppercase">Current Speed |v|</div>
                  <div className="text-sm font-semibold text-zinc-100 mt-0.5">{currentSpeed.toFixed(2)} m/s</div>
                </div>
              </div>

              {/* Live Vector Coordinates */}
              <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a] text-xs font-mono flex flex-wrap items-center justify-between gap-2 text-zinc-300">
                <div>
                  <span className="text-zinc-500">Position: </span>
                  <span className="text-zinc-100 font-semibold">(x: {currentX.toFixed(2)}m, y: {currentY.toFixed(2)}m)</span>
                </div>
                <div>
                  <span className="text-zinc-500">Velocity: </span>
                  <span className="text-sky-400 font-semibold">vx: {currentVx.toFixed(2)} m/s</span>
                  <span className="text-zinc-600 mx-1.5">|</span>
                  <span className="text-emerald-400 font-semibold">vy: {currentVy.toFixed(2)} m/s</span>
                </div>
                <div>
                  <span className="text-zinc-500">Angle: </span>
                  <span className="text-amber-400 font-semibold">{currentAngleDeg.toFixed(1)}°</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 4. NEWTON-RAPHSON ROOT FINDER */}
      {activeTool === 'rootfinder' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Presets & Controls (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                Function & Initial Guess
              </div>

              {/* Target Function Selector */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Preset Equations:</label>
                <div className="space-y-1.5">
                  {ROOT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setSelectedPresetId(preset.id);
                        setInitialGuess(preset.defaultX0);
                      }}
                      className={`w-full text-left p-2.5 rounded border text-xs font-mono transition-all ${
                        selectedPresetId === preset.id
                          ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-semibold'
                          : 'bg-[#09090b] text-zinc-400 border-[#27272a] hover:text-zinc-200'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Initial Guess Input */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Initial Guess (x₀):</label>
                <input
                  type="number"
                  step="0.1"
                  value={initialGuess}
                  onChange={(e) => setInitialGuess(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Iterations Slider */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Max Iterations:</span>
                  <span className="text-zinc-200 font-semibold">{maxIter}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={maxIter}
                  onChange={(e) => setMaxIter(parseInt(e.target.value))}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Algorithmic Recurrence Box */}
              <div className="p-3 rounded bg-[#09090b] border border-[#27272a] text-xs font-mono space-y-1.5">
                <div className="text-[11px] font-semibold text-zinc-300 uppercase">Recurrence Scheme</div>
                <div className="text-zinc-200 font-semibold text-sm">
                  x_{'{k+1}'} = x_k - \frac{'{f(x_k)}'}{'{f\'(x_k)}'}
                </div>
                <p className="text-[11px] text-zinc-500">
                  Quadratic convergence rate when starting sufficiently close to a simple root.
                </p>
              </div>

            </div>

            {/* Convergence Table & Breakdown (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-lg bg-[#121215] border border-[#27272a] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Newton-Raphson Step Iteration Ledger</span>
                </h3>
                <span className="px-2.5 py-1 rounded bg-[#09090b] text-emerald-400 font-mono font-semibold text-xs border border-zinc-700">
                  Root ≈ {iterations[iterations.length - 1]?.nextX.toFixed(6)}
                </span>
              </div>

              {/* Iteration Table */}
              <div className="overflow-x-auto border border-[#27272a] rounded-lg">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#09090b] border-b border-[#27272a] text-zinc-400">
                    <tr>
                      <th className="py-2.5 px-3">k</th>
                      <th className="py-2.5 px-3">x_k</th>
                      <th className="py-2.5 px-3">f(x_k)</th>
                      <th className="py-2.5 px-3">f'(x_k)</th>
                      <th className="py-2.5 px-3">x_{'{k+1}'}</th>
                      <th className="py-2.5 px-3">|Δx|</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a] bg-[#121215]">
                    {iterations.map((row) => (
                      <tr key={row.k} className="hover:bg-zinc-800/40 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-zinc-300">{row.k}</td>
                        <td className="py-2.5 px-3 text-zinc-100 font-semibold">{row.x.toFixed(6)}</td>
                        <td className="py-2.5 px-3 text-zinc-400">{row.fx.toFixed(6)}</td>
                        <td className="py-2.5 px-3 text-zinc-400">{row.dfx.toFixed(6)}</td>
                        <td className="py-2.5 px-3 text-emerald-400 font-semibold">{row.nextX.toFixed(6)}</td>
                        <td className="py-2.5 px-3 text-zinc-500">{row.delta.toExponential(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Final Result Card */}
              <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div>
                  <div className="text-zinc-500 uppercase text-[10px]">Computed Root Approximation:</div>
                  <div className="text-base font-semibold text-zinc-100 mt-0.5">
                    x* = {iterations[iterations.length - 1]?.nextX.toFixed(8)}
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-zinc-500 uppercase text-[10px]">Residual Error |f(x*)|:</div>
                  <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                    {Math.abs(activePreset.f(iterations[iterations.length - 1]?.nextX || 0)).toExponential(4)}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 5. 2D MATRIX LINEAR TRANSFORMATION & VECTOR VISUALIZER */}
      {activeTool === 'matrix2d' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Matrix 2x2 Input & Vector Sliders (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                <span>Transformation Matrix M (2×2)</span>
              </div>

              {/* 2x2 Matrix Input Grid */}
              <div className="p-3.5 bg-[#09090b] border border-[#27272a] rounded-lg">
                <div className="text-[11px] font-mono text-zinc-400 mb-2">Matrix Entries M = [ [a, b], [c, d] ]:</div>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div>
                    <label className="text-[10px] text-zinc-500 block">a (î_x):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={matA}
                      onChange={(e) => setMatA(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-[#121215] border border-[#27272a] rounded text-zinc-100 text-xs font-semibold focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 block">b (ĵ_x):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={matB}
                      onChange={(e) => setMatB(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-[#121215] border border-[#27272a] rounded text-zinc-100 text-xs font-semibold focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 block">c (î_y):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={matC}
                      onChange={(e) => setMatC(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-[#121215] border border-[#27272a] rounded text-zinc-100 text-xs font-semibold focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-500 block">d (ĵ_y):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={matD}
                      onChange={(e) => setMatD(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-[#121215] border border-[#27272a] rounded text-zinc-100 text-xs font-semibold focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
              </div>

              {/* Vector u Input */}
              <div className="space-y-2">
                <div className="text-xs font-mono text-zinc-300 font-semibold">Input Vector u = (ux, uy):</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                      <span>ux:</span>
                      <span className="text-zinc-200">{vecX.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.1"
                      value={vecX}
                      onChange={(e) => setVecX(parseFloat(e.target.value))}
                      className="w-full accent-zinc-400"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                      <span>uy:</span>
                      <span className="text-zinc-200">{vecY.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="-3"
                      max="3"
                      step="0.1"
                      value={vecY}
                      onChange={(e) => setVecY(parseFloat(e.target.value))}
                      className="w-full accent-zinc-400"
                    />
                  </div>
                </div>
              </div>

              {/* Matrix Transformation Presets */}
              <div className="pt-2 border-t border-[#27272a]">
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">Canonical Presets:</label>
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono">
                  {MATRIX_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setMatA(preset.a);
                        setMatB(preset.b);
                        setMatC(preset.c);
                        setMatD(preset.d);
                      }}
                      className="p-1.5 text-left rounded bg-[#09090b] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] transition-all"
                    >
                      <div className="font-semibold text-zinc-200 text-[11px]">{preset.name}</div>
                      <div className="text-[9px] text-zinc-500 truncate">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Visualizer Canvas & Invariants (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-lg bg-[#121215] border border-[#27272a] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center space-x-2">
                  <Grid className="w-4 h-4 text-amber-400" />
                  <span>2D Basis Vector Deformation & Determinant Area</span>
                </h3>
                <span className={`px-2.5 py-1 rounded font-mono font-semibold text-xs border ${
                  Math.abs(detM) < 1e-5
                    ? 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                    : detM < 0
                    ? 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                    : 'bg-[#09090b] text-emerald-400 border-zinc-700'
                }`}>
                  det(M) = {detM.toFixed(3)} {Math.abs(detM) < 1e-5 ? '(Singular)' : detM < 0 ? '(Flipped Orientation)' : '(Preserved)'}
                </span>
              </div>

              {/* Grid SVG Transformation Plot */}
              <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center justify-center">
                <svg width={matSvgDim} height={matSvgDim} className="overflow-visible select-none font-mono">
                  {/* Background Cartesian Coordinate Grid (-3 to +3) */}
                  {[-3, -2, -1, 1, 2, 3].map((val) => {
                    const gx = toSvgCoords(val, 0).cx;
                    const gy = toSvgCoords(0, val).cy;
                    return (
                      <g key={val}>
                        <line x1={gx} y1={10} x2={gx} y2={matSvgDim - 10} stroke="#1c1c20" strokeWidth="1" />
                        <line x1={10} y1={gy} x2={matSvgDim - 10} y2={gy} stroke="#1c1c20" strokeWidth="1" />
                      </g>
                    );
                  })}

                  {/* Transformed Grid Lines (M * [x, y]) */}
                  {[-2, -1, 0, 1, 2].map((k) => {
                    const startH = toSvgCoords(-3 * matA + k * matB, -3 * matC + k * matD);
                    const endH = toSvgCoords(3 * matA + k * matB, 3 * matC + k * matD);
                    const startV = toSvgCoords(k * matA - 3 * matB, k * matC - 3 * matD);
                    const endV = toSvgCoords(k * matA + 3 * matB, k * matC + 3 * matD);
                    return (
                      <g key={'trans' + k}>
                        <line x1={startH.cx} y1={startH.cy} x2={endH.cx} y2={endH.cy} stroke="#27272a" strokeWidth="1" strokeDasharray="2 2" />
                        <line x1={startV.cx} y1={startV.cy} x2={endV.cx} y2={endV.cy} stroke="#27272a" strokeWidth="1" strokeDasharray="2 2" />
                      </g>
                    );
                  })}

                  {/* Main Coordinate Axes */}
                  <line x1={10} y1={matOrigin} x2={matSvgDim - 10} y2={matOrigin} stroke="#52525b" strokeWidth="1.5" />
                  <line x1={matOrigin} y1={10} x2={matOrigin} y2={matSvgDim - 10} stroke="#52525b" strokeWidth="1.5" />

                  {/* Original Unit Square in Dotted Outline */}
                  <polygon
                    points={`${toSvgCoords(0,0).cx},${toSvgCoords(0,0).cy} ${toSvgCoords(1,0).cx},${toSvgCoords(1,0).cy} ${toSvgCoords(1,1).cx},${toSvgCoords(1,1).cy} ${toSvgCoords(0,1).cx},${toSvgCoords(0,1).cy}`}
                    fill="none"
                    stroke="#52525b"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Transformed Unit Parallelogram (Area = |det M|) */}
                  <polygon
                    points={`${p0.cx},${p0.cy} ${p1.cx},${p1.cy} ${p2.cx},${p2.cy} ${p3.cx},${p3.cy}`}
                    fill={detM >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)'}
                    stroke={detM >= 0 ? '#10b981' : '#f43f5e'}
                    strokeWidth="2"
                  />

                  {/* Transformed î Basis Vector (Amber) */}
                  <line x1={p0.cx} y1={p0.cy} x2={p1.cx} y2={p1.cy} stroke="#f59e0b" strokeWidth="2.5" />
                  <circle cx={p1.cx} cy={p1.cy} r="3" fill="#f59e0b" />
                  <text x={p1.cx + 5} y={p1.cy - 5} fill="#f59e0b" fontSize="10" fontWeight="bold">î' ({matA.toFixed(1)}, {matC.toFixed(1)})</text>

                  {/* Transformed ĵ Basis Vector (Sky) */}
                  <line x1={p0.cx} y1={p0.cy} x2={p3.cx} y2={p3.cy} stroke="#38bdf8" strokeWidth="2.5" />
                  <circle cx={p3.cx} cy={p3.cy} r="3" fill="#38bdf8" />
                  <text x={p3.cx + 5} y={p3.cy - 5} fill="#38bdf8" fontSize="10" fontWeight="bold">ĵ' ({matB.toFixed(1)}, {matD.toFixed(1)})</text>

                  {/* Input Vector u (Dotted White) */}
                  {(() => {
                    const uSvg = toSvgCoords(vecX, vecY);
                    return (
                      <g>
                        <line x1={p0.cx} y1={p0.cy} x2={uSvg.cx} y2={uSvg.cy} stroke="#71717a" strokeWidth="1.5" strokeDasharray="2 2" />
                        <circle cx={uSvg.cx} cy={uSvg.cy} r="2.5" fill="#a1a1aa" />
                        <text x={uSvg.cx + 4} y={uSvg.cy + 4} fill="#a1a1aa" fontSize="9">u ({vecX.toFixed(1)}, {vecY.toFixed(1)})</text>
                      </g>
                    );
                  })()}

                  {/* Transformed Vector M*u (Solid Emerald) */}
                  {(() => {
                    const tuSvg = toSvgCoords(transVecX, transVecY);
                    return (
                      <g>
                        <line x1={p0.cx} y1={p0.cy} x2={tuSvg.cx} y2={tuSvg.cy} stroke="#10b981" strokeWidth="2.5" />
                        <circle cx={tuSvg.cx} cy={tuSvg.cy} r="3.5" fill="#10b981" />
                        <text x={tuSvg.cx + 5} y={tuSvg.cy - 5} fill="#10b981" fontSize="10" fontWeight="bold">M·u ({transVecX.toFixed(1)}, {transVecY.toFixed(1)})</text>
                      </g>
                    );
                  })()}
                </svg>
              </div>

              {/* Algebraic Invariants Ledger */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Determinant det(M)</div>
                  <div className="text-sm font-semibold text-amber-400 mt-0.5">{detM.toFixed(3)}</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Area scale factor: {Math.abs(detM).toFixed(3)}×</div>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Matrix Trace tr(M)</div>
                  <div className="text-sm font-semibold text-zinc-100 mt-0.5">{traceM.toFixed(3)}</div>
                  <div className="text-[10px] text-zinc-500 mt-1">Sum of diagonals (a+d)</div>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Eigenvalues (λ₁, λ₂)</div>
                  <div className="text-xs font-semibold text-sky-400 mt-0.5 truncate">{eigen1Str}</div>
                  <div className="text-xs font-semibold text-sky-400 truncate">{eigen2Str}</div>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Transformed Vector</div>
                  <div className="text-sm font-semibold text-emerald-400 mt-0.5">
                    ({transVecX.toFixed(2)}, {transVecY.toFixed(2)})
                  </div>
                  <div className="text-[10px] text-zinc-500 mt-1">|M·u| = {Math.sqrt(transVecX * transVecX + transVecY * transVecY).toFixed(2)}</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 6. DIGITAL LOGIC GATES & COMBINATIONAL CIRCUITS */}
      {activeTool === 'logicgates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Circuit Select & Inputs (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                Circuit Architecture
              </div>

              {/* Circuit Preset Buttons */}
              <div className="space-y-1.5 font-mono text-xs">
                {[
                  { id: 'half_adder', name: 'Half Adder', desc: 'Sum (XOR) & Carry (AND)' },
                  { id: 'full_adder', name: 'Full Adder', desc: '3-Input Cascaded Ripple Bit' },
                  { id: 'mux2to1', name: '2-to-1 Multiplexer', desc: 'Data Select Y = (D0·~S)+(D1·S)' },
                  { id: 'demorgan', name: 'De Morgan Validator', desc: 'NAND ≡ NOT-OR & NOR ≡ NOT-AND' },
                  { id: 'custom', name: 'Configurable Gate Pair', desc: '2-Stage Boolean Combinational' }
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setLogicCircuitType(c.id)}
                    className={`w-full text-left p-2.5 rounded border transition-all ${
                      logicCircuitType === c.id
                        ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-semibold'
                        : 'bg-[#09090b] text-zinc-400 border-[#27272a] hover:text-zinc-200'
                    }`}
                  >
                    <div className="text-zinc-200">{c.name}</div>
                    <div className="text-[10px] text-zinc-500">{c.desc}</div>
                  </button>
                ))}
              </div>

              {/* Dynamic Input Signal Toggles */}
              <div className="pt-3 border-t border-[#27272a] space-y-2 font-mono">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Live Binary Input Signals
                </div>

                {/* Input A */}
                <div className="flex items-center justify-between p-2 rounded bg-[#09090b] border border-[#27272a]">
                  <span className="text-xs text-zinc-300">Input A:</span>
                  <button
                    onClick={() => setInA(inA === 1 ? 0 : 1)}
                    className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                      inA === 1
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    {inA} ({inA === 1 ? 'HIGH' : 'LOW'})
                  </button>
                </div>

                {/* Input B */}
                <div className="flex items-center justify-between p-2 rounded bg-[#09090b] border border-[#27272a]">
                  <span className="text-xs text-zinc-300">Input B:</span>
                  <button
                    onClick={() => setInB(inB === 1 ? 0 : 1)}
                    className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                      inB === 1
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                    }`}
                  >
                    {inB} ({inB === 1 ? 'HIGH' : 'LOW'})
                  </button>
                </div>

                {/* Input Cin (for Full Adder or Custom) */}
                {(logicCircuitType === 'full_adder' || logicCircuitType === 'custom') && (
                  <div className="flex items-center justify-between p-2 rounded bg-[#09090b] border border-[#27272a]">
                    <span className="text-xs text-zinc-300">{logicCircuitType === 'full_adder' ? 'Carry In (Cin):' : 'Input C:'}</span>
                    <button
                      onClick={() => setInCin(inCin === 1 ? 0 : 1)}
                      className={`px-3 py-1 rounded text-xs font-bold border transition-all ${
                        inCin === 1
                          ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600'
                          : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                      }`}
                    >
                      {inCin} ({inCin === 1 ? 'HIGH' : 'LOW'})
                    </button>
                  </div>
                )}

                {/* MUX Controls */}
                {logicCircuitType === 'mux2to1' && (
                  <>
                    <div className="flex items-center justify-between p-2 rounded bg-[#09090b] border border-[#27272a]">
                      <span className="text-xs text-zinc-300">Data D₀:</span>
                      <button
                        onClick={() => setInD0(inD0 === 1 ? 0 : 1)}
                        className={`px-3 py-1 rounded text-xs font-bold border ${
                          inD0 === 1 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600' : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                        }`}
                      >
                        {inD0}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#09090b] border border-[#27272a]">
                      <span className="text-xs text-zinc-300">Data D₁:</span>
                      <button
                        onClick={() => setInD1(inD1 === 1 ? 0 : 1)}
                        className={`px-3 py-1 rounded text-xs font-bold border ${
                          inD1 === 1 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600' : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                        }`}
                      >
                        {inD1}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-[#09090b] border border-[#27272a]">
                      <span className="text-xs text-zinc-300 font-semibold text-amber-400">Select (S):</span>
                      <button
                        onClick={() => setInSel(inSel === 1 ? 0 : 1)}
                        className={`px-3 py-1 rounded text-xs font-bold border ${
                          inSel === 1 ? 'bg-amber-950/60 text-amber-400 border-amber-600' : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                        }`}
                      >
                        {inSel} ({inSel === 1 ? 'Route D1' : 'Route D0'})
                      </button>
                    </div>
                  </>
                )}

                {/* Custom Gate Selectors */}
                {logicCircuitType === 'custom' && (
                  <div className="pt-2 space-y-2">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Gate 1 (A, B):</label>
                      <select
                        value={gate1Type}
                        onChange={(e) => setGate1Type(e.target.value)}
                        className="w-full px-2 py-1 bg-[#09090b] border border-[#27272a] rounded text-zinc-200 text-xs"
                      >
                        {['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'].map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">Gate 2 (G1, C):</label>
                      <select
                        value={gate2Type}
                        onChange={(e) => setGate2Type(e.target.value)}
                        className="w-full px-2 py-1 bg-[#09090b] border border-[#27272a] rounded text-zinc-200 text-xs"
                      >
                        {['AND', 'OR', 'XOR', 'NAND', 'NOR', 'XNOR'].map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Circuit Diagram & Dynamic Truth Table (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-lg bg-[#121215] border border-[#27272a] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <span>Gate Schematic & Output Bus State</span>
                </h3>
                <span className="px-2.5 py-1 rounded bg-[#09090b] text-zinc-200 font-mono font-semibold text-xs border border-zinc-700">
                  {logicCircuitType.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Interactive Signal Flow Diagram */}
              <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] font-mono text-xs space-y-4">
                <div className="text-zinc-400 text-[11px] font-semibold uppercase">Real-Time Signal State:</div>

                {/* Half Adder Display */}
                {logicCircuitType === 'half_adder' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-[#121215] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase">Sum Gate (A ⊕ B)</div>
                        <div className="text-zinc-200 font-semibold mt-0.5">XOR Gate</div>
                      </div>
                      <div className={`px-3 py-1 rounded font-bold text-sm border ${
                        circuitOutputs.sum === 1 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600' : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                      }`}>
                        Sum = {circuitOutputs.sum}
                      </div>
                    </div>

                    <div className="p-3 rounded bg-[#121215] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase">Carry Gate (A ∧ B)</div>
                        <div className="text-zinc-200 font-semibold mt-0.5">AND Gate</div>
                      </div>
                      <div className={`px-3 py-1 rounded font-bold text-sm border ${
                        circuitOutputs.carry === 1 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600' : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                      }`}>
                        Carry = {circuitOutputs.carry}
                      </div>
                    </div>
                  </div>
                )}

                {/* Full Adder Display */}
                {logicCircuitType === 'full_adder' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-[#121215] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase">Sum Output (A ⊕ B ⊕ Cin)</div>
                        <div className="text-zinc-200 font-semibold mt-0.5">Cascaded XOR</div>
                      </div>
                      <div className={`px-3 py-1 rounded font-bold text-sm border ${
                        circuitOutputs.sum === 1 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600' : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                      }`}>
                        Sum = {circuitOutputs.sum}
                      </div>
                    </div>

                    <div className="p-3 rounded bg-[#121215] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase">Carry Out (Cout)</div>
                        <div className="text-zinc-200 font-semibold mt-0.5">(A·B) + (Cin·(A⊕B))</div>
                      </div>
                      <div className={`px-3 py-1 rounded font-bold text-sm border ${
                        circuitOutputs.cout === 1 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600' : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                      }`}>
                        Cout = {circuitOutputs.cout}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2-to-1 MUX Display */}
                {logicCircuitType === 'mux2to1' && (
                  <div className="p-3 rounded bg-[#121215] border border-[#27272a] flex items-center justify-between">
                    <div>
                      <div className="text-zinc-400 text-[10px] uppercase">Selected Multiplexer Output Y</div>
                      <div className="text-zinc-200 font-semibold mt-0.5">
                        Active Channel: <span className="text-amber-400">D{inSel}</span> ({inSel === 0 ? `D0 = ${inD0}` : `D1 = ${inD1}`})
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded font-bold text-base border ${
                      circuitOutputs.y === 1 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600' : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                    }`}>
                      Y = {circuitOutputs.y}
                    </div>
                  </div>
                )}

                {/* De Morgan Equivalence Display */}
                {logicCircuitType === 'demorgan' && (
                  <div className="space-y-2">
                    <div className="p-3 rounded bg-[#121215] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase font-mono mb-0.5">
                          <MathTex math="\text{De Morgan I: } \overline{A \cdot B} \equiv \overline{A} + \overline{B}" />
                        </div>
                        <div className="text-xs text-zinc-300 font-semibold font-mono">
                          NAND({inA}, {inB}) = {circuitOutputs.nandOut} | OR(~{inA}, ~{inB}) = {circuitOutputs.orNotOut}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-600 font-mono text-xs">
                        {circuitOutputs.nandOut === circuitOutputs.orNotOut ? '✓ Equivalent' : 'Mismatch'}
                      </span>
                    </div>

                    <div className="p-3 rounded bg-[#121215] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase font-mono mb-0.5">
                          <MathTex math="\text{De Morgan II: } \overline{A + B} \equiv \overline{A} \cdot \overline{B}" />
                        </div>
                        <div className="text-xs text-zinc-300 font-semibold font-mono">
                          NOR({inA}, {inB}) = {circuitOutputs.norOut} | AND(~{inA}, ~{inB}) = {circuitOutputs.andNotOut}
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 font-bold border border-emerald-600 font-mono text-xs">
                        {circuitOutputs.norOut === circuitOutputs.andNotOut ? '✓ Equivalent' : 'Mismatch'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Custom Pair Display */}
                {logicCircuitType === 'custom' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-[#121215] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase">Stage 1: {gate1Type}(A, B)</div>
                        <div className="text-zinc-200 font-semibold mt-0.5">Intermediate Signal</div>
                      </div>
                      <div className="font-bold text-sm text-zinc-200">G1 = {circuitOutputs.g1}</div>
                    </div>
                    <div className="p-3 rounded bg-[#121215] border border-[#27272a] flex items-center justify-between">
                      <div>
                        <div className="text-zinc-400 text-[10px] uppercase">Stage 2: {gate2Type}(G1, C)</div>
                        <div className="text-zinc-200 font-semibold mt-0.5">Final Output</div>
                      </div>
                      <div className={`px-3 py-1 rounded font-bold text-sm border ${
                        circuitOutputs.g2 === 1 ? 'bg-emerald-950/60 text-emerald-400 border-emerald-600' : 'bg-zinc-900 text-zinc-500 border-zinc-700'
                      }`}>
                        Y = {circuitOutputs.g2}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Auto-Generated Truth Table with Active Row Highlight */}
              <div className="border border-[#27272a] rounded-lg overflow-hidden font-mono text-xs">
                <div className="bg-[#09090b] px-4 py-2 text-zinc-400 font-semibold border-b border-[#27272a] flex justify-between items-center">
                  <span>Complete Circuit Truth Table</span>
                  <span className="text-[10px] text-zinc-500">Active input highlighted</span>
                </div>

                {logicCircuitType === 'half_adder' && (
                  <table className="w-full text-left">
                    <thead className="bg-[#121215] border-b border-[#27272a] text-zinc-400 text-[11px]">
                      <tr>
                        <th className="py-2 px-4"><MathTex math="A" /></th>
                        <th className="py-2 px-4"><MathTex math="B" /></th>
                        <th className="py-2 px-4"><MathTex math="\text{Sum} \ (A \oplus B)" /></th>
                        <th className="py-2 px-4"><MathTex math="\text{Carry} \ (A \cdot B)" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]">
                      {[
                        { a: 0, b: 0, s: 0, c: 0 },
                        { a: 0, b: 1, s: 1, c: 0 },
                        { a: 1, b: 0, s: 1, c: 0 },
                        { a: 1, b: 1, s: 0, c: 1 }
                      ].map((row, idx) => {
                        const isActive = inA === row.a && inB === row.b;
                        return (
                          <tr key={idx} className={isActive ? 'bg-emerald-950/30 font-semibold text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800/30'}>
                            <td className="py-2 px-4">{row.a}</td>
                            <td className="py-2 px-4">{row.b}</td>
                            <td className="py-2 px-4">{row.s}</td>
                            <td className="py-2 px-4">{row.c}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {logicCircuitType === 'full_adder' && (
                  <table className="w-full text-left">
                    <thead className="bg-[#121215] border-b border-[#27272a] text-zinc-400 text-[11px]">
                      <tr>
                        <th className="py-2 px-3"><MathTex math="A" /></th>
                        <th className="py-2 px-3"><MathTex math="B" /></th>
                        <th className="py-2 px-3"><MathTex math="C_{\text{in}}" /></th>
                        <th className="py-2 px-3"><MathTex math="\text{Sum}" /></th>
                        <th className="py-2 px-3"><MathTex math="C_{\text{out}}" /></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a]">
                      {[
                        { a: 0, b: 0, cin: 0, s: 0, cout: 0 },
                        { a: 0, b: 0, cin: 1, s: 1, cout: 0 },
                        { a: 0, b: 1, cin: 0, s: 1, cout: 0 },
                        { a: 0, b: 1, cin: 1, s: 0, cout: 1 },
                        { a: 1, b: 0, cin: 0, s: 1, cout: 0 },
                        { a: 1, b: 0, cin: 1, s: 0, cout: 1 },
                        { a: 1, b: 1, cin: 0, s: 0, cout: 1 },
                        { a: 1, b: 1, cin: 1, s: 1, cout: 1 }
                      ].map((row, idx) => {
                        const isActive = inA === row.a && inB === row.b && inCin === row.cin;
                        return (
                          <tr key={idx} className={isActive ? 'bg-emerald-950/30 font-semibold text-emerald-300' : 'text-zinc-400 hover:bg-zinc-800/30'}>
                            <td className="py-1.5 px-3">{row.a}</td>
                            <td className="py-1.5 px-3">{row.b}</td>
                            <td className="py-1.5 px-3">{row.cin}</td>
                            <td className="py-1.5 px-3">{row.s}</td>
                            <td className="py-1.5 px-3">{row.cout}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}

                {(logicCircuitType === 'mux2to1' || logicCircuitType === 'demorgan' || logicCircuitType === 'custom') && (
                  <div className="p-3 text-zinc-400 bg-[#121215] text-[11px] leading-relaxed">
                    Combinational table dynamically evaluated for current logic state: output bus reflects instantaneous digital switching with 0 propagation delay.
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 7. AC RLC RESONANT CIRCUIT & PHASOR ANALYZER */}
      {activeTool === 'ac_rlc' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* AC Source & Component Sliders (4 cols) */}
            <div className="lg:col-span-4 p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                AC Series Parameters
              </div>

              {/* Source Voltage Vrms */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Source Voltage (<MathTex math="V_{\text{rms}}" />):</span>
                  <span className="text-zinc-200 font-semibold">{acVrms} V</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="240"
                  value={acVrms}
                  onChange={(e) => setAcVrms(parseFloat(e.target.value))}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Frequency f */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Frequency (<MathTex math="f" />):</span>
                  <span className="text-zinc-200 font-semibold">{acFreq} Hz</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={acFreq}
                  onChange={(e) => setAcFreq(parseFloat(e.target.value))}
                  className="w-full accent-zinc-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <span><MathTex math={`\\omega = ${omega.toFixed(1)}\\text{ rad/s}`} /></span>
                  <button
                    onClick={() => setAcFreq(Math.round(resFreq))}
                    className="text-amber-400 hover:underline"
                    title="Jump to resonant frequency"
                  >
                    Set to <MathTex math={`f_0 = ${resFreq.toFixed(1)}\\text{ Hz}`} />
                  </button>
                </div>
              </div>

              {/* Resistance R */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Resistance (<MathTex math="R" />):</span>
                  <span className="text-zinc-200 font-semibold">{acR} Ω</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  value={acR}
                  onChange={(e) => setAcR(parseFloat(e.target.value))}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Inductance L */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Inductance (<MathTex math="L" />):</span>
                  <span className="text-zinc-200 font-semibold">{acL} mH</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={acL}
                  onChange={(e) => setAcL(parseFloat(e.target.value))}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Capacitance C */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Capacitance (<MathTex math="C" />):</span>
                  <span className="text-zinc-200 font-semibold">{acC} μF</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="150"
                  value={acC}
                  onChange={(e) => setAcC(parseFloat(e.target.value))}
                  className="w-full accent-zinc-400"
                />
              </div>

            </div>

            {/* Impedance, Phasors & Dual Waveforms (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-lg bg-[#121215] border border-[#27272a] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span>RLC Impedance & Phasor Vector Analysis</span>
                </h3>
                <span className={`px-2.5 py-1 rounded font-mono font-semibold text-xs border ${
                  Math.abs(phaseDeg) < 2
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700'
                    : phaseDeg > 0
                    ? 'bg-sky-950/40 text-sky-300 border-sky-700'
                    : 'bg-amber-950/40 text-amber-300 border-amber-700'
                }`}>
                  {Math.abs(phaseDeg) < 2 ? 'Pure Resonance (f ≈ f₀)' : phaseDeg > 0 ? 'Inductive (I lags V)' : 'Capacitive (I leads V)'}
                </span>
              </div>

              {/* Phasor Diagram & Impedance Triangle SVG */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phasor Vector SVG */}
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex flex-col items-center">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase self-start mb-1">Voltage Phasor Plane</div>
                  <svg width="240" height="200" className="overflow-visible font-mono select-none">
                    <line x1="20" y1="100" x2="220" y2="100" stroke="#3f3f46" strokeWidth="1" />
                    <line x1="120" y1="20" x2="120" y2="180" stroke="#3f3f46" strokeWidth="1" />
                    <text x="215" y="95" fill="#71717a" fontSize="8">Re</text>
                    <text x="125" y="25" fill="#71717a" fontSize="8">+j (Im)</text>

                    {/* VR Vector (Real Axis) */}
                    <line x1="120" y1="100" x2={120 + Math.min(vR_rms / 2, 80)} y2="100" stroke="#10b981" strokeWidth="2.5" />
                    <text x={120 + Math.min(vR_rms / 2, 80) / 2} y="115" fill="#10b981" fontSize="9" fontWeight="bold">VR ({vR_rms.toFixed(1)}V)</text>

                    {/* VL Vector (Up) */}
                    <line x1="120" y1="100" x2="120" y2={100 - Math.min(vL_rms / 2, 70)} stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />
                    <text x="125" y={100 - Math.min(vL_rms / 2, 70) / 2} fill="#38bdf8" fontSize="9">VL ({vL_rms.toFixed(1)}V)</text>

                    {/* VC Vector (Down) */}
                    <line x1="120" y1="100" x2="120" y2={100 + Math.min(vC_rms / 2, 70)} stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 2" />
                    <text x="125" y={100 + Math.min(vC_rms / 2, 70) / 2} fill="#f59e0b" fontSize="9">VC ({vC_rms.toFixed(1)}V)</text>

                    {/* Net V_total Vector */}
                    {(() => {
                      const netVy = (vL_rms - vC_rms) / 2;
                      const clampedVy = Math.max(Math.min(netVy, 70), -70);
                      const clampedVx = Math.min(vR_rms / 2, 80);
                      return (
                        <g>
                          <line x1="120" y1="100" x2={120 + clampedVx} y2={100 - clampedVy} stroke="#f43f5e" strokeWidth="3" />
                          <circle cx={120 + clampedVx} cy={100 - clampedVy} r="3" fill="#f43f5e" />
                          <text x={120 + clampedVx + 4} y={100 - clampedVy} fill="#f43f5e" fontSize="9" fontWeight="bold">V_total</text>
                        </g>
                      );
                    })()}
                  </svg>
                </div>

                {/* Oscillogram Sinusoidal Waveforms SVG */}
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex flex-col items-center">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase self-start mb-1">Dual Sinusoidal Waveforms (v(t) vs i(t))</div>
                  <svg width="240" height="200" className="overflow-visible font-mono select-none">
                    <line x1="15" y1="100" x2="225" y2="100" stroke="#3f3f46" strokeWidth="1" />
                    {/* Voltage wave (rose) */}
                    <path
                      d={(() => {
                        const pts = [];
                        for (let i = 0; i <= 60; i++) {
                          const theta = (i / 60) * 4 * Math.PI; // 2 cycles
                          const sx = 15 + (i / 60) * 210;
                          const sy = 100 - Math.sin(theta) * 60;
                          pts.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
                        }
                        return pts.join(' ');
                      })()}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />
                    {/* Current wave with phase shift (emerald) */}
                    <path
                      d={(() => {
                        const pts = [];
                        for (let i = 0; i <= 60; i++) {
                          const theta = (i / 60) * 4 * Math.PI; // 2 cycles
                          const sx = 15 + (i / 60) * 210;
                          const sy = 100 - Math.sin(theta - phaseRad) * 45;
                          pts.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
                        }
                        return pts.join(' ');
                      })()}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="3 2"
                    />
                    <text x="25" y="30" fill="#f43f5e" fontSize="9" fontWeight="bold">— v(t)</text>
                    <text x="80" y="30" fill="#10b981" fontSize="9" fontWeight="bold">--- i(t) [φ = {phaseDeg.toFixed(1)}°]</text>
                  </svg>
                </div>
              </div>

              {/* RLC Calculations Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Impedance (<MathTex math="Z" />)</div>
                  <div className="text-sm font-semibold text-zinc-100 mt-0.5">{acZ.toFixed(2)} Ω</div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    <MathTex math={`R = ${acR}\\Omega, \\; X = ${netX.toFixed(1)}\\Omega`} />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">RMS Current (<MathTex math="I_{\text{rms}}" />)</div>
                  <div className="text-sm font-semibold text-emerald-400 mt-0.5">{acIrms.toFixed(3)} A</div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    <MathTex math={`I_{\\text{peak}} = ${acIpeak.toFixed(3)}\\text{ A}`} />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Phase Angle (<MathTex math="\phi" />)</div>
                  <div className="text-sm font-semibold text-amber-400 mt-0.5">{phaseDeg.toFixed(1)}°</div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    <MathTex math={`\\cos\\phi = ${powerFactor.toFixed(3)}`} />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#09090b] border border-[#27272a]">
                  <div className="text-[10px] text-zinc-500 uppercase">Resonant Freq (<MathTex math="f_0" />)</div>
                  <div className="text-sm font-semibold text-sky-400 mt-0.5">{resFreq.toFixed(1)} Hz</div>
                  <div className="text-[10px] text-zinc-500 mt-1">
                    <MathTex math={`Q = ${qFactor.toFixed(2)}`} />
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 8. BITWISE TOOL */}
      {activeTool === 'bitwise' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
              Input Operands (8-Bit Byte)
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Operand A (0-255):</label>
              <input
                type="number"
                min="0"
                max="255"
                value={numA}
                onChange={(e) => setNumA(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500"
              />
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                BIN: {numA.toString(2).padStart(8, '0')} | HEX: 0x{numA.toString(16).toUpperCase()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Operand B (0-255):</label>
              <input
                type="number"
                min="0"
                max="255"
                value={numB}
                onChange={(e) => setNumB(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500"
              />
              <span className="text-[11px] text-zinc-500 font-mono mt-1 block">
                BIN: {numB.toString(2).padStart(8, '0')} | HEX: 0x{numB.toString(16).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="lg:col-span-8 p-6 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
            <h3 className="text-sm font-semibold text-zinc-100 border-b border-[#27272a] pb-3">Bitwise Logical Results</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { op: 'A \\land B', label: 'AND (Bitwise AND)', res: (numA & numB) & 0xFF, desc: 'Masking / bit filtering' },
                { op: 'A \\lor B', label: 'OR (Bitwise OR)', res: (numA | numB) & 0xFF, desc: 'Setting bit flags' },
                { op: 'A \\oplus B', label: 'XOR (Bitwise XOR)', res: (numA ^ numB) & 0xFF, desc: 'Toggling & parity check' },
                { op: '\\sim A', label: 'NOT (1s Complement)', res: (~numA) & 0xFF, desc: 'Bit flip / inversion' },
                { op: 'A \\ll 1', label: 'Shift Left (A << 1)', res: (numA << 1) & 0xFF, desc: 'Arithmetic multiplication by 2' },
                { op: 'A \\gg 1', label: 'Shift Right (A >> 1)', res: (numA >> 1) & 0xFF, desc: 'Logical division by 2' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-zinc-200 flex items-center space-x-2">
                      <MathTex math={item.op} />
                      <span className="text-[11px] text-zinc-400 font-normal">({item.label})</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{item.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-zinc-100">{item.res} (0x{item.res.toString(16).toUpperCase().padStart(2, '0')})</div>
                    <div className="text-[10px] text-zinc-400 font-mono">{item.res.toString(2).padStart(8, '0')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
