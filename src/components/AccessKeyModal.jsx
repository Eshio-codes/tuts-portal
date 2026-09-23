import React, { useState, useEffect } from 'react';
import {
  KeyRound, ShieldCheck, Copy, Check, X, Shuffle, Sparkles, Terminal,
  BookOpen, Calculator, Atom, Cpu, Layers, Filter
} from 'lucide-react';
import { EXAM_CODE_DEFINITIONS, SCOPES } from '../auth/authConfig';

const TUTOR_PASSPHRASE = 'STEM-TUTOR-2026';

const SCOPE_CONFIG = {
  all: {
    label: '3-Course Pass (All)',
    prefix: 'STEM',
    badgeClass: 'bg-amber-950/70 border-amber-800/60 text-amber-300',
    icon: Layers,
    color: 'amber'
  },
  math: {
    label: 'Mathematics Only',
    prefix: 'MATH',
    badgeClass: 'bg-emerald-950/70 border-emerald-800/60 text-emerald-300',
    icon: Calculator,
    color: 'emerald'
  },
  physics: {
    label: 'Physics Only',
    prefix: 'PHYS',
    badgeClass: 'bg-cyan-950/70 border-cyan-800/60 text-cyan-300',
    icon: Atom,
    color: 'cyan'
  },
  cs: {
    label: 'Computer Science Only',
    prefix: 'CS',
    badgeClass: 'bg-purple-950/70 border-purple-800/60 text-purple-300',
    icon: Cpu,
    color: 'purple'
  }
};

function generateRandomCode(prefix = 'STEM') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${rand}`;
}

async function computeSha256(text) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(text.trim().toUpperCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (err) {
    console.error('Error computing SHA-256:', err);
    return '';
  }
}

export default function AccessKeyModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' | 'generator'
  const [selectedCategory, setSelectedCategory] = useState('all'); // filter for existing list
  const [generatorScope, setGeneratorScope] = useState('all');
  const [inputCode, setInputCode] = useState(() => generateRandomCode('STEM'));
  const [customDescription, setCustomDescription] = useState('Standard Cohort Pass');
  const [computedHash, setComputedHash] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  // When generator scope changes, update prefix if default pattern matches
  const handleScopeChange = (newScope) => {
    setGeneratorScope(newScope);
    const prefix = SCOPE_CONFIG[newScope].prefix;
    setInputCode(generateRandomCode(prefix));
    setCustomDescription(`${SCOPE_CONFIG[newScope].label} Access Pass`);
  };

  // Compute hash whenever inputCode changes
  useEffect(() => {
    let isCurrent = true;
    if (inputCode.trim()) {
      computeSha256(inputCode).then((h) => {
        if (isCurrent) setComputedHash(h);
      });
    } else {
      setComputedHash('');
    }
    return () => { isCurrent = false; };
  }, [inputCode]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text, keyId) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(keyId);
    setTimeout(() => {
      setCopiedKey((curr) => (curr === keyId ? null : curr));
    }, 2000);
  };

  const filteredCodes = EXAM_CODE_DEFINITIONS.filter((item) => {
    if (selectedCategory === 'all_categories') return true;
    if (selectedCategory === 'all') return item.scope === SCOPES.ALL;
    return item.scope === selectedCategory;
  });

  const generatedCodeSnippet = `  {
    hash: '${computedHash}',
    scope: SCOPES.${generatorScope.toUpperCase()},
    label: '${inputCode.trim().toUpperCase()}',
    desc: '${customDescription.trim() || 'Assigned Access Key'}'
  },`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-3xl bg-[#121215] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] bg-[#09090b]/90">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/60 text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                Exam Key Manager & Scope Access Controller
              </h3>
              <p className="text-xs text-zinc-400">
                Generate and distribute individual subject codes (Math, Physics, CS) or 3-course general passes.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#27272a] bg-[#09090b]/40">
          <button
            onClick={() => setActiveTab('existing')}
            className={`flex-1 py-3 text-xs font-mono font-medium transition-colors border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'existing'
                ? 'text-amber-300 border-amber-400 bg-amber-950/20'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Active Passkeys ({EXAM_CODE_DEFINITIONS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex-1 py-3 text-xs font-mono font-medium transition-colors border-b-2 flex items-center justify-center gap-2 ${
              activeTab === 'generator'
                ? 'text-cyan-300 border-cyan-400 bg-cyan-950/20'
                : 'text-zinc-400 border-transparent hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Scope-Based Code Generator</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(92vh-140px)]">
          {activeTab === 'existing' ? (
            <div className="space-y-6">
              {/* Tutor Passphrase Card */}
              <div className="p-4 rounded-xl bg-[#09090b] border border-amber-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
                      Tutor Passphrase (Full Portal & Grading Access)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50">
                    Administrator
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-[#18181c] border border-zinc-800">
                  <div className="font-mono text-sm font-bold text-amber-200 tracking-wider">
                    {TUTOR_PASSPHRASE}
                  </div>
                  <button
                    onClick={() => copyToClipboard(TUTOR_PASSPHRASE, 'tutor-pass')}
                    className="px-3 py-1.5 rounded-md bg-amber-950/70 hover:bg-amber-900/80 text-amber-200 border border-amber-800/80 text-xs font-mono flex items-center justify-center space-x-1.5 transition-all"
                  >
                    {copiedKey === 'tutor-pass' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy Passphrase</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Student Exam Access Codes Header & Filters */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Filter Active Codes By Scope</span>
                  </span>
                  <div className="flex flex-wrap gap-1">
                    <button
                      onClick={() => setSelectedCategory('all_categories')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        selectedCategory === 'all_categories'
                          ? 'bg-zinc-200 text-zinc-950 font-semibold'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      All ({EXAM_CODE_DEFINITIONS.length})
                    </button>
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        selectedCategory === 'all'
                          ? 'bg-amber-400 text-amber-950 font-semibold'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      3-Course General
                    </button>
                    <button
                      onClick={() => setSelectedCategory('math')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        selectedCategory === 'math'
                          ? 'bg-emerald-400 text-emerald-950 font-semibold'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      Mathematics
                    </button>
                    <button
                      onClick={() => setSelectedCategory('physics')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        selectedCategory === 'physics'
                          ? 'bg-cyan-400 text-cyan-950 font-semibold'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      Physics
                    </button>
                    <button
                      onClick={() => setSelectedCategory('cs')}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                        selectedCategory === 'cs'
                          ? 'bg-purple-400 text-purple-950 font-semibold'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                      }`}
                    >
                      CS
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {filteredCodes.map((item, idx) => {
                    const cfg = SCOPE_CONFIG[item.scope] || SCOPE_CONFIG.all;
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={item.label}
                        className="p-3.5 rounded-xl bg-[#09090b] border border-[#27272a] hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-sm font-bold text-zinc-100 tracking-wider">
                              {item.label}
                            </span>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center gap-1 ${cfg.badgeClass}`}>
                              <Icon className="w-3 h-3" />
                              <span>{cfg.label}</span>
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 font-sans">
                            {item.desc}
                          </div>
                        </div>

                        <button
                          onClick={() => copyToClipboard(item.label, `item-${idx}`)}
                          className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono flex items-center justify-center space-x-1.5 transition-colors self-start sm:self-auto"
                        >
                          {copiedKey === `item-${idx}` ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-300 font-semibold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-400" />
                              <span>Copy Passcode</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Generator Scope Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                  Select Examination Access Scope:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.entries(SCOPE_CONFIG).map(([key, config]) => {
                    const Icon = config.icon;
                    const isSelected = generatorScope === key;
                    return (
                      <button
                        key={key}
                        onClick={() => handleScopeChange(key)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'bg-[#18181c] border-cyan-500 shadow-sm'
                            : 'bg-[#09090b] border-[#27272a] hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-zinc-500'}`} />
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-850 text-zinc-400 border border-zinc-800">
                            {config.prefix}-*
                          </span>
                        </div>
                        <div className={`text-xs font-semibold ${isSelected ? 'text-cyan-200' : 'text-zinc-300'}`}>
                          {config.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generator Input Section */}
              <div className="p-4 rounded-xl bg-[#09090b] border border-cyan-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300">
                      Code Configuration & Parameters
                    </span>
                  </div>
                  <button
                    onClick={() => setInputCode(generateRandomCode(SCOPE_CONFIG[generatorScope].prefix))}
                    className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 text-xs font-mono flex items-center space-x-1.5 transition-colors"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Generate Random</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono text-zinc-400">
                      Access Code ({SCOPE_CONFIG[generatorScope].prefix}-*):
                    </label>
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      placeholder={`e.g. ${SCOPE_CONFIG[generatorScope].prefix}-FINALS`}
                      className="w-full px-3.5 py-2.5 bg-[#18181c] border border-zinc-700 rounded-lg text-zinc-100 font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-mono text-zinc-400">
                      Label / Cohort Description:
                    </label>
                    <input
                      type="text"
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder="e.g. Calculus & Vectors Examination"
                      className="w-full px-3.5 py-2.5 bg-[#18181c] border border-zinc-700 rounded-lg text-zinc-100 font-sans text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                {/* Real-time Code & Hash Result */}
                {inputCode.trim() && (
                  <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                    {/* Normalized Code display */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-[#121215] border border-zinc-800">
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">
                          Ready-to-Share Student Access Code
                        </div>
                        <div className="font-mono text-sm font-bold text-zinc-100 flex items-center gap-2">
                          <span>{inputCode.trim().toUpperCase()}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${SCOPE_CONFIG[generatorScope].badgeClass}`}>
                            {SCOPE_CONFIG[generatorScope].label}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(inputCode.trim().toUpperCase(), 'gen-code')}
                        className="px-3 py-1.5 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        {copiedKey === 'gen-code' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300 font-semibold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* SHA-256 Hash display */}
                    <div className="p-2.5 rounded-lg bg-[#121215] border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          Computed SHA-256 Cryptographic Digest
                        </span>
                        <button
                          onClick={() => copyToClipboard(computedHash, 'gen-hash')}
                          className="px-2 py-1 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono flex items-center space-x-1 transition-colors"
                        >
                          {copiedKey === 'gen-hash' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-zinc-400" />
                              <span>Copy Hash</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-2 rounded bg-[#09090b] border border-zinc-850 font-mono text-xs text-cyan-300 break-all select-all">
                        {computedHash || 'Calculating...'}
                      </div>
                    </div>

                    {/* Code Snippet for authConfig.js */}
                    <div className="p-2.5 rounded-lg bg-[#121215] border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                          Definition Entry for <code className="text-zinc-300">src/auth/authConfig.js</code>
                        </span>
                        <button
                          onClick={() => copyToClipboard(generatedCodeSnippet, 'gen-snippet')}
                          className="px-2 py-1 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono flex items-center space-x-1 transition-colors"
                        >
                          {copiedKey === 'gen-snippet' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300 font-semibold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-zinc-400" />
                              <span>Copy Definition Entry</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-2.5 rounded bg-[#09090b] border border-zinc-850 font-mono text-xs text-amber-200 overflow-x-auto select-all">
                        {generatedCodeSnippet}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Terminal CLI Command alternative */}
              <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#27272a] space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <Terminal className="w-4 h-4 text-zinc-500" />
                  <span>Alternative: Generate Scoped Key via CLI Terminal</span>
                </div>
                <div className="p-2.5 rounded bg-[#18181c] border border-zinc-800 font-mono text-xs text-zinc-300 flex items-center justify-between">
                  <span>npm run gen-code -- --{generatorScope === 'physics' ? 'phys' : generatorScope} {inputCode.trim().toUpperCase()}</span>
                  <button
                    onClick={() => copyToClipboard(`npm run gen-code -- --${generatorScope === 'physics' ? 'phys' : generatorScope} ${inputCode.trim().toUpperCase()}`, 'cli-cmd')}
                    className="text-zinc-400 hover:text-zinc-200 p-1"
                    title="Copy command"
                  >
                    {copiedKey === 'cli-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-[#27272a] bg-[#09090b]/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs text-zinc-500">
            {activeTab === 'existing'
              ? 'Tutor passphrase and student access codes are cryptographically verified client-side using SHA-256 digests.'
              : 'Add new definitions to EXAM_CODE_DEFINITIONS in src/auth/authConfig.js.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors self-end sm:self-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
