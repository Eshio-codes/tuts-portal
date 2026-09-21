import React, { useState } from 'react';
import MathTex from './MathTex';
import { Cpu, Zap, Calculator, ArrowRight, RefreshCw, Layers } from 'lucide-react';

export default function InteractiveTools() {
  const [activeTool, setActiveTool] = useState('float');

  // Tool 1: Circuit State
  const [voltage, setVoltage] = useState(24);
  const [internalR, setInternalR] = useState(0.5);
  const [r1, setR1] = useState(10);
  const [r2, setR2] = useState(20);
  const [isParallel, setIsParallel] = useState(false);

  // Tool 2: IEEE 754 State
  const [floatInput, setFloatInput] = useState(-13.625);

  // Tool 3: Bitwise State
  const [numA, setNumA] = useState(90); // 0x5A
  const [numB, setNumB] = useState(15); // 0x0F

  // --- Calculate Circuit ---
  const rLoad = isParallel ? (r1 * r2) / (r1 + r2) : r1 + r2;
  const rTotal = rLoad + internalR;
  const currentTotal = voltage / rTotal;
  const terminalVoltage = voltage - currentTotal * internalR;
  const vR1 = isParallel ? terminalVoltage : currentTotal * r1;
  const vR2 = isParallel ? terminalVoltage : currentTotal * r2;
  const iR1 = isParallel ? terminalVoltage / r1 : currentTotal;
  const iR2 = isParallel ? terminalVoltage / r2 : currentTotal;
  const pTotal = terminalVoltage * currentTotal;

  // --- Calculate IEEE 754 32-bit ---
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header & Tool Tabs */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Cpu className="w-6 h-6 text-cyan-400" />
            <span>Interactive STEM Calculators & Simulators</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hands-on visual playgrounds for DC circuits, IEEE 754 float bit-packing, and bitwise logic.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTool('float')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTool === 'float' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>IEEE 754 Float Packer</span>
          </button>
          <button
            onClick={() => setActiveTool('circuits')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTool === 'circuits' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>DC Circuit & VDR/CDR</span>
          </button>
          <button
            onClick={() => setActiveTool('bitwise')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
              activeTool === 'bitwise' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Bitwise Logic Sandbox</span>
          </button>
        </div>
      </div>

      {/* 1. IEEE 754 FLOAT TOOL */}
      {activeTool === 'float' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Input Controls */}
            <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Decimal Float Input</h3>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">Enter any real number:</label>
                <input
                  type="number"
                  step="any"
                  value={floatInput}
                  onChange={(e) => setFloatInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-slate-950 border border-cyan-500/50 rounded-xl text-white font-mono text-lg font-bold focus:outline-none"
                />
              </div>

              {/* Quick Presets */}
              <div className="pt-2">
                <span className="text-xs text-slate-500 font-mono block mb-2">Test Presets:</span>
                <div className="flex flex-wrap gap-2">
                  {[-13.625, 1.0, 0.15625, -0.75, 42.0, 0.0].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setFloatInput(preset)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-xs border border-slate-700"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Visualizer Display */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">32-Bit IEEE 754 Single-Precision Word</h3>
                <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono font-bold text-sm border border-cyan-500/40">
                  {ieee.hex}
                </span>
              </div>

              {/* Colored Bit Fields Breakdown */}
              <div className="space-y-2">
                <div className="grid grid-cols-32 gap-0.5 text-center font-mono text-[10px] text-slate-500 overflow-x-auto">
                  <div className="col-span-1 text-rose-400 font-bold">Bit 31 (S)</div>
                  <div className="col-span-8 text-amber-400 font-bold">Bits 30-23 (Exp)</div>
                  <div className="col-span-23 text-cyan-400 font-bold">Bits 22-0 (Mantissa / Fraction)</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center gap-1 font-mono text-sm tracking-wider justify-center">
                  <span className="px-2 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded font-bold" title="Sign Bit">
                    {ieee.sign}
                  </span>
                  <span className="px-2 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-bold" title="8-Bit Biased Exponent">
                    {ieee.expBits}
                  </span>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded font-bold break-all" title="23-Bit Mantissa">
                    {ieee.mantBits}
                  </span>
                </div>
              </div>

              {/* Dissection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/40 space-y-1">
                  <div className="text-xs text-rose-400 font-bold font-mono uppercase">Sign Field (1 Bit)</div>
                  <div className="text-lg font-bold text-white font-mono">{ieee.sign === '1' ? '1 (Negative -)' : '0 (Positive +)'}</div>
                  <div className="text-[11px] text-slate-400">(-1)^{ieee.sign} = {ieee.sign === '1' ? '-1' : '+1'}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-amber-900/40 space-y-1">
                  <div className="text-xs text-amber-400 font-bold font-mono uppercase">Biased Exponent (8 Bits)</div>
                  <div className="text-lg font-bold text-white font-mono">{ieee.storedExp} <span className="text-xs font-normal text-slate-400">(Stored)</span></div>
                  <div className="text-[11px] text-slate-400">True Exp: {ieee.storedExp} - 127 = {ieee.actualExp} (2^{ieee.actualExp})</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-cyan-900/40 space-y-1">
                  <div className="text-xs text-cyan-400 font-bold font-mono uppercase">Normalized Mantissa (23 Bits)</div>
                  <div className="text-sm font-bold text-white font-mono truncate">1.{ieee.mantBits.slice(0, 7)}...</div>
                  <div className="text-[11px] text-slate-400">Implicit leading '1.' restored in ALU</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. DC CIRCUITS TOOL */}
      {activeTool === 'circuits' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Circuit Parameters</h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Source EMF Voltage (V):</label>
              <input
                type="number"
                value={voltage}
                onChange={(e) => setVoltage(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Internal Resistance r (Ω):</label>
              <input
                type="number"
                step="0.1"
                value={internalR}
                onChange={(e) => setInternalR(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Resistor R1 (Ω):</label>
              <input
                type="number"
                value={r1}
                onChange={(e) => setR1(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Resistor R2 (Ω):</label>
              <input
                type="number"
                value={r2}
                onChange={(e) => setR2(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Topology:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsParallel(false)}
                  className={`py-2 rounded-lg text-xs font-bold font-mono border ${
                    !isParallel ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Series (VDR)
                </button>
                <button
                  onClick={() => setIsParallel(true)}
                  className={`py-2 rounded-lg text-xs font-bold font-mono border ${
                    isParallel ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Parallel (CDR)
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-2 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Calculated Circuit Outputs ({isParallel ? 'Parallel Network' : 'Series Network'})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Equivalent Load R_eq</div>
                <div className="text-lg font-bold text-cyan-400 font-mono">{rLoad.toFixed(2)} Ω</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Total Loop Current</div>
                <div className="text-lg font-bold text-emerald-400 font-mono">{currentTotal.toFixed(2)} A</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Terminal Voltage</div>
                <div className="text-lg font-bold text-amber-400 font-mono">{terminalVoltage.toFixed(2)} V</div>
              </div>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-xs text-slate-400">Total Power Load</div>
                <div className="text-lg font-bold text-purple-400 font-mono">{pTotal.toFixed(2)} W</div>
              </div>
            </div>

            {/* Individual Branch Breakdown */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-mono font-bold uppercase text-slate-400">Individual Branch Drops:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">Resistor R1 ({r1} Ω):</div>
                  <div className="text-slate-300">Voltage Drop V1 = {vR1.toFixed(2)} V</div>
                  <div className="text-slate-300">Current I1 = {iR1.toFixed(2)} A</div>
                  <div className="text-cyan-400">Power P1 = {(vR1 * iR1).toFixed(2)} W</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                  <div className="font-bold text-white">Resistor R2 ({r2} Ω):</div>
                  <div className="text-slate-300">Voltage Drop V2 = {vR2.toFixed(2)} V</div>
                  <div className="text-slate-300">Current I2 = {iR2.toFixed(2)} A</div>
                  <div className="text-cyan-400">Power P2 = {(vR2 * iR2).toFixed(2)} W</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BITWISE TOOL */}
      {activeTool === 'bitwise' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Input Operands (8-Bit)</h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Operand A (0-255):</label>
              <input
                type="number"
                min="0"
                max="255"
                value={numA}
                onChange={(e) => setNumA(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
              />
              <span className="text-[11px] text-slate-500 font-mono">Binary: {numA.toString(2).padStart(8, '0')} | Hex: 0x{numA.toString(16).toUpperCase()}</span>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Operand B (0-255):</label>
              <input
                type="number"
                min="0"
                max="255"
                value={numB}
                onChange={(e) => setNumB(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
              />
              <span className="text-[11px] text-slate-500 font-mono">Binary: {numB.toString(2).padStart(8, '0')} | Hex: 0x{numB.toString(16).toUpperCase()}</span>
            </div>
          </div>

          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Bitwise Logical Results</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {[
                { op: 'AND (A & B)', res: (numA & numB) & 0xFF, desc: 'Masking / bit filtering' },
                { op: 'OR (A | B)', res: (numA | numB) & 0xFF, desc: 'Setting bits' },
                { op: 'XOR (A ^ B)', res: (numA ^ numB) & 0xFF, desc: 'Toggling & bit difference' },
                { op: 'NOT (~A)', res: (~numA) & 0xFF, desc: '1s complement bit flip' },
                { op: 'Shift Left (A << 1)', res: (numA << 1) & 0xFF, desc: 'Multiplication by 2' },
                { op: 'Shift Right (A >> 1)', res: (numA >> 1) & 0xFF, desc: 'Division by 2' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-purple-300">{item.op}</div>
                    <div className="text-[10px] text-slate-500">{item.desc}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-cyan-400">{item.res} (0x{item.res.toString(16).toUpperCase().padStart(2, '0')})</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.res.toString(2).padStart(8, '0')}</div>
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
