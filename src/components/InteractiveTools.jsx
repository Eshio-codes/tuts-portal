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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Header & Tool Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight flex items-center space-x-2">
            <span>STEM Engineering & Computing Instruments</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Interactive calculation sandboxes for floating-point registers, DC circuit networks, and bitwise logic.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#121215] p-1 rounded-lg border border-[#27272a] self-start sm:self-auto">
          <button
            onClick={() => setActiveTool('float')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTool === 'float'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-750'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            IEEE 754 Float
          </button>
          <button
            onClick={() => setActiveTool('circuits')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTool === 'circuits'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-750'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            DC Circuit Solver
          </button>
          <button
            onClick={() => setActiveTool('bitwise')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              activeTool === 'bitwise'
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-750'
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
                <div>• Exponent Bias: +127 ($2^{8-1}-1$)</div>
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
                  <div className="text-sm font-semibold text-zinc-100 font-mono">{ieee.storedExp} <span className="text-xs text-zinc-400 font-normal">($2^{'{'}{ieee.actualExp}{'}'}$)</span></div>
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

      {/* 3. BITWISE TOOL */}
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
