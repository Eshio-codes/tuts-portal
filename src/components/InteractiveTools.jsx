import React, { useState, useEffect, useRef } from 'react';
import MathTex from './MathTex';
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
  Activity
} from 'lucide-react';

export default function InteractiveTools() {
  const [activeTool, setActiveTool] = useState('float');

  // ==========================================
  // Tool 1: IEEE 754 State
  // ==========================================
  const [floatInput, setFloatInput] = useState(-13.625);

  const getIEEE754 = (val) => {
    const num = parseFloat(val);
    if (isNaN(num)) return { sign: 0, expBits: '00000000', mantBits: '00000000000000000000000', hex: '0x00000000', actualExp: 0, storedExp: 0 };

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
  };

  const ieee = getIEEE754(floatInput);

  // ==========================================
  // Tool 2: Circuit State
  // ==========================================
  const [voltage, setVoltage] = useState(24);
  const [internalR, setInternalR] = useState(0.5);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);
  const [isParallel, setIsParallel] = useState(false);

  const rLoad = isParallel ? (r1 * r2) / (r1 + r2) : r1 + r2;
  const rTotal = rLoad + internalR;
  const currentTotal = voltage / rTotal;
  const terminalVoltage = voltage - currentTotal * internalR;
  const vR1 = isParallel ? terminalVoltage : currentTotal * r1;
  const vR2 = isParallel ? terminalVoltage : currentTotal * r2;
  const iR1 = isParallel ? terminalVoltage / r1 : currentTotal;
  const iR2 = isParallel ? terminalVoltage / r2 : currentTotal;
  const pTotal = terminalVoltage * currentTotal;

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
      const startTime = performance.now() - (currentTime / flightTime) * (flightTime * 1000);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Header & Tool Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight flex items-center space-x-2">
            <span>STEM Engineering & Computing Instruments</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Interactive calculation sandboxes for floating-point registers, DC circuit networks, projectile kinematics, bitwise logic, and numerical root finding.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 bg-[#121215] p-1 rounded-lg border border-[#27272a] self-start sm:self-auto">
          <button
            onClick={() => setActiveTool('float')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTool === 'float'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            IEEE 754 Float
          </button>
          <button
            onClick={() => setActiveTool('circuits')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTool === 'circuits'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            DC Circuit Solver
          </button>
          <button
            onClick={() => setActiveTool('kinematics')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTool === 'kinematics'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            2D Projectile Simulator
          </button>
          <button
            onClick={() => setActiveTool('rootfinder')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTool === 'rootfinder'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Newton-Raphson Solver
          </button>
          <button
            onClick={() => setActiveTool('bitwise')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTool === 'bitwise'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Bitwise Logic
          </button>
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
                  <span className="px-2 py-1 bg-zinc-800 text-zinc-200 border border-zinc-700 rounded font-semibold break-all" title="Mantissa [22:0]">
                    {ieee.mantBits}
                  </span>
                </div>
              </div>

              {/* Dissection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a] space-y-1">
                  <div className="text-[10px] text-rose-400 font-mono uppercase font-semibold">Sign Bit (s)</div>
                  <div className="text-sm font-semibold text-zinc-100 font-mono">{ieee.sign === '1' ? '1 (Negative)' : '0 (Positive)'}</div>
                  <div className="text-[11px] text-zinc-400 font-mono">(-1)^{ieee.sign} = {ieee.sign === '1' ? '-1' : '+1'}</div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a] space-y-1">
                  <div className="text-[10px] text-amber-400 font-mono uppercase font-semibold">Biased Exponent (e)</div>
                  <div className="text-sm font-semibold text-zinc-100 font-mono">{ieee.storedExp} <span className="text-xs text-zinc-400 font-normal">(2^{ieee.actualExp})</span></div>
                  <div className="text-[11px] text-zinc-400 font-mono">{ieee.storedExp} - 127 = {ieee.actualExp}</div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a] space-y-1">
                  <div className="text-[10px] text-zinc-400 font-mono uppercase font-semibold">Mantissa (1 + f)</div>
                  <div className="text-sm font-semibold text-zinc-100 font-mono truncate">1.{ieee.mantBits.slice(0, 6)}...</div>
                  <div className="text-[11px] text-zinc-400 font-mono">Implicit hidden 1 restored</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. DC CIRCUITS TOOL */}
      {activeTool === 'circuits' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls (4 cols) */}
          <div className="lg:col-span-4 p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-3.5">
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
              Circuit Parameter Controls
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Source EMF Voltage (V):</label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Internal Resistance r (Ω):</label>
              <input
                type="number"
                step="0.1"
                value={internalR}
                onChange={(e) => setInternalR(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Resistor R1 (Ω):</label>
              <input
                type="number"
                value={r1}
                onChange={(e) => setR1(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Resistor R2 (Ω):</label>
              <input
                type="number"
                value={r2}
                onChange={(e) => setR2(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500"
              />
            </div>

            <div className="pt-2 border-t border-[#27272a]">
              <label className="block text-xs font-mono text-zinc-400 mb-2">Network Topology:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsParallel(false)}
                  className={`py-1.5 rounded text-xs font-mono border transition-all ${
                    !isParallel ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-semibold' : 'bg-[#09090b] border-[#27272a] text-zinc-400'
                  }`}
                >
                  Series (VDR)
                </button>
                <button
                  onClick={() => setIsParallel(true)}
                  className={`py-1.5 rounded text-xs font-mono border transition-all ${
                    isParallel ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-semibold' : 'bg-[#09090b] border-[#27272a] text-zinc-400'
                  }`}
                >
                  Parallel (CDR)
                </button>
              </div>
            </div>
          </div>

          {/* Results Display (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-lg bg-[#121215] border border-[#27272a] space-y-5">
            <h3 className="text-sm font-semibold text-zinc-100 border-b border-[#27272a] pb-3">
              Network Calculations ({isParallel ? 'Parallel Configuration' : 'Series Configuration'})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a]">
                <div className="text-[10px] text-zinc-400 uppercase">Equivalent Load R_eq</div>
                <div className="text-base font-semibold text-zinc-100 mt-0.5">{rLoad.toFixed(2)} Ω</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a]">
                <div className="text-[10px] text-zinc-400 uppercase">Loop Current (I)</div>
                <div className="text-base font-semibold text-zinc-100 mt-0.5">{currentTotal.toFixed(2)} A</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a]">
                <div className="text-[10px] text-zinc-400 uppercase">Terminal Voltage (V_t)</div>
                <div className="text-base font-semibold text-zinc-100 mt-0.5">{terminalVoltage.toFixed(2)} V</div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#09090b] border border-[#27272a]">
                <div className="text-[10px] text-zinc-400 uppercase">Load Dissipation (P)</div>
                <div className="text-base font-semibold text-zinc-100 mt-0.5">{pTotal.toFixed(2)} W</div>
              </div>
            </div>

            {/* Individual Branch Breakdown */}
            <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-3">
              <div className="text-xs font-mono font-semibold uppercase text-zinc-300 tracking-wider">Individual Branch Quantities:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-[#121215] border border-[#27272a] space-y-1">
                  <div className="font-semibold text-zinc-200">Resistor R1 ({r1} Ω):</div>
                  <div className="text-zinc-400">Voltage Drop V1 = {vR1.toFixed(2)} V</div>
                  <div className="text-zinc-400">Branch Current I1 = {iR1.toFixed(2)} A</div>
                  <div className="text-zinc-300">Dissipation P1 = {(vR1 * iR1).toFixed(2)} W</div>
                </div>

                <div className="p-3 rounded bg-[#121215] border border-[#27272a] space-y-1">
                  <div className="font-semibold text-zinc-200">Resistor R2 ({r2} Ω):</div>
                  <div className="text-zinc-400">Voltage Drop V2 = {vR2.toFixed(2)} V</div>
                  <div className="text-zinc-400">Branch Current I2 = {iR2.toFixed(2)} A</div>
                  <div className="text-zinc-300">Dissipation P2 = {(vR2 * iR2).toFixed(2)} W</div>
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
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                <span>Launch Parameters</span>
                <span className="text-[10px] text-zinc-500 lowercase">SUVAT 2D</span>
              </div>

              {/* Initial Speed */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Initial Speed (u):</span>
                  <span className="text-zinc-200 font-semibold">{initialSpeed.toFixed(1)} m/s</span>
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
                  <span className="text-zinc-200 font-semibold">{launchAngle.toFixed(1)}°</span>
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
                  <span>Cliff Height (h₀):</span>
                  <span className="text-zinc-200 font-semibold">{initialHeight.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={initialHeight}
                  onChange={(e) => {
                    setInitialHeight(parseFloat(e.target.value));
                    setCurrentTime(0);
                    setIsPlaying(false);
                  }}
                  className="w-full accent-zinc-400"
                />
              </div>

              {/* Gravity */}
              <div>
                <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                  <span>Gravity (g):</span>
                  <span className="text-zinc-200 font-semibold">{gravity.toFixed(2)} m/s²</span>
                </div>
                <input
                  type="range"
                  min="1.62"
                  max="24.79"
                  step="0.1"
                  value={gravity}
                  onChange={(e) => {
                    setGravity(parseFloat(e.target.value));
                    setCurrentTime(0);
                    setIsPlaying(false);
                  }}
                  className="w-full accent-zinc-400"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <button onClick={() => { setGravity(1.62); setCurrentTime(0); }} className="hover:text-zinc-300">Moon (1.62)</button>
                  <button onClick={() => { setGravity(9.80); setCurrentTime(0); }} className="hover:text-zinc-300">Earth (9.80)</button>
                  <button onClick={() => { setGravity(24.79); setCurrentTime(0); }} className="hover:text-zinc-300">Jupiter (24.79)</button>
                </div>
              </div>

              {/* Time Scrub & Playback */}
              <div className="pt-3 border-t border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-zinc-400">Simulation Time (t):</span>
                  <span className="text-xs font-mono font-semibold text-zinc-200">{clampedT.toFixed(2)}s / {flightTime.toFixed(2)}s</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={flightTime || 1}
                  step="0.01"
                  value={clampedT}
                  onChange={(e) => {
                    setCurrentTime(parseFloat(e.target.value));
                    setIsPlaying(false);
                  }}
                  className="w-full accent-zinc-300"
                />

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (currentTime >= flightTime) setCurrentTime(0);
                      setIsPlaying(!isPlaying);
                    }}
                    className="flex-1 flex items-center justify-center space-x-1.5 py-1.5 px-3 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-mono text-xs font-medium border border-zinc-600 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlaying ? 'Pause' : currentTime >= flightTime ? 'Replay' : 'Launch'}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentTime(0);
                    }}
                    className="p-1.5 rounded bg-[#09090b] hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-[#27272a] transition-colors"
                    title="Reset Time"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Trajectory Visualizer & Metrics (8 cols) */}
            <div className="lg:col-span-8 p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center space-x-2">
                  <Crosshair className="w-4 h-4 text-zinc-400" />
                  <span>2D Trajectory Vector Flight Curve</span>
                </h3>
                <span className="text-xs font-mono text-zinc-400">
                  y(x) = h₀ + x·tan(θ) - [g/(2u²cos²θ)]·x²
                </span>
              </div>

              {/* SVG Projectile Canvas */}
              <div className="w-full bg-[#09090b] rounded-lg border border-[#27272a] p-2 flex items-center justify-center overflow-hidden">
                <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto max-h-[300px]">
                  {/* Grid Lines */}
                  {[0.25, 0.5, 0.75, 1.0].map((frac) => (
                    <g key={frac}>
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
                        const steps = Math.floor((clampedT / flightTime) * numPlotPoints) || 1;
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

      {/* 5. BITWISE TOOL */}
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
                { op: 'AND (A & B)', res: (numA & numB) & 0xFF, desc: 'Masking / bit filtering' },
                { op: 'OR (A | B)', res: (numA | numB) & 0xFF, desc: 'Setting bit flags' },
                { op: 'XOR (A ^ B)', res: (numA ^ numB) & 0xFF, desc: 'Toggling & parity check' },
                { op: 'NOT (~A)', res: (~numA) & 0xFF, desc: '1s complement bit flip' },
                { op: 'Shift Left (A << 1)', res: (numA << 1) & 0xFF, desc: 'Arithmetic multiplication by 2' },
                { op: 'Shift Right (A >> 1)', res: (numA >> 1) & 0xFF, desc: 'Logical division by 2' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-zinc-200">{item.op}</div>
                    <div className="text-[10px] text-zinc-500">{item.desc}</div>
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
