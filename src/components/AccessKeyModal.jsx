import React, { useState, useEffect } from 'react';
import {
  KeyRound, ShieldCheck, Copy, Check, X, Shuffle, Sparkles, Terminal, BookOpen, ExternalLink
} from 'lucide-react';

const PRECONFIGURED_STUDENT_CODES = [
  { code: 'STEM-A1B2', desc: 'Pre-University Cohort Alpha' },
  { code: 'STEM-C3D4', desc: 'Pre-University Cohort Beta' },
  { code: 'STEM-E5F6', desc: 'Pre-University Cohort Gamma' },
  { code: 'STEM-G7H8', desc: 'Pre-University Cohort Delta' },
  { code: 'STEM-J9K0', desc: 'Standard Examination Pass' }
];

const TUTOR_PASSPHRASE = 'STEM-TUTOR-2026';

function generateRandomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `STEM-${rand}`;
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
  const [inputCode, setInputCode] = useState(() => generateRandomCode());
  const [computedHash, setComputedHash] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-[#121215] border border-[#27272a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a] bg-[#09090b]/80">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/60 text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                Access Credentials & Key Manager
              </h3>
              <p className="text-xs text-zinc-400">
                View active access codes, copy student login keys, or generate new cryptographic hashes.
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
            <span>Active Portal Passkeys</span>
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
            <span>Instant Code & Hash Generator</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'existing' ? (
            <div className="space-y-6">
              {/* Tutor Passphrase Card */}
              <div className="p-4 rounded-xl bg-[#09090b] border border-amber-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-300">
                      Tutor Passphrase (Full Portal Access)
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
                <p className="text-[11px] text-zinc-400">
                  Use this passphrase at the login gate to sign in as Tutor, review student submissions, and adjust marks.
                </p>
              </div>

              {/* Student Exam Access Codes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                    Pre-Configured Student Exam Codes ({PRECONFIGURED_STUDENT_CODES.length})
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    Share any code below with your students
                  </span>
                </div>

                <div className="space-y-2">
                  {PRECONFIGURED_STUDENT_CODES.map((item, idx) => (
                    <div
                      key={item.code}
                      className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-all"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-cyan-300 tracking-wider">
                            {item.code}
                          </span>
                          <span className="text-[11px] text-zinc-400 font-sans">
                            — {item.desc}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => copyToClipboard(item.code, `student-${idx}`)}
                        className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-mono flex items-center justify-center space-x-1.5 transition-colors self-start sm:self-auto"
                      >
                        {copiedKey === `student-${idx}` ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-300">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Generator Input Section */}
              <div className="p-4 rounded-xl bg-[#09090b] border border-cyan-900/50 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300">
                      Create Custom Code & Compute SHA-256
                    </span>
                  </div>
                  <button
                    onClick={() => setInputCode(generateRandomCode())}
                    className="px-2.5 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/60 text-xs font-mono flex items-center space-x-1.5 transition-colors"
                  >
                    <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Generate Random</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-zinc-400">
                    Access Code (e.g. STEM-XXXX or Custom Tag):
                  </label>
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="e.g. STEM-SPRING2026"
                    className="w-full px-3.5 py-2.5 bg-[#18181c] border border-zinc-700 rounded-lg text-zinc-100 font-mono text-sm uppercase tracking-wider focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  />
                </div>

                {/* Real-time Code & Hash Result */}
                {inputCode.trim() && (
                  <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                    {/* Normalized Code display */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-[#121215] border border-zinc-800">
                      <div>
                        <div className="text-[10px] font-mono text-zinc-500 uppercase">
                          Student Access Code
                        </div>
                        <div className="font-mono text-sm font-bold text-zinc-200">
                          {inputCode.trim().toUpperCase()}
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
                          Computed SHA-256 Cryptographic Hash
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
                          Snippet for <code className="text-zinc-300">src/auth/authConfig.js</code>
                        </span>
                        <button
                          onClick={() => copyToClipboard(`'${computedHash}',`, 'gen-snippet')}
                          className="px-2 py-1 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] font-mono flex items-center space-x-1 transition-colors"
                        >
                          {copiedKey === 'gen-snippet' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-300">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-zinc-400" />
                              <span>Copy Snippet</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div className="p-2 rounded bg-[#09090b] border border-zinc-850 font-mono text-xs text-amber-200 select-all">
                        {`'${computedHash}',`}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terminal CLI Command alternative */}
              <div className="p-3.5 rounded-xl bg-[#09090b] border border-[#27272a] space-y-2">
                <div className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
                  <Terminal className="w-4 h-4 text-zinc-500" />
                  <span>Alternative: Generate from Terminal CLI</span>
                </div>
                <div className="p-2.5 rounded bg-[#18181c] border border-zinc-800 font-mono text-xs text-zinc-300 flex items-center justify-between">
                  <span>npm run gen-code -- {inputCode.trim().toUpperCase() || 'STEM-XXXX'}</span>
                  <button
                    onClick={() => copyToClipboard(`npm run gen-code -- ${inputCode.trim().toUpperCase() || 'STEM-XXXX'}`, 'cli-cmd')}
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
        <div className="px-6 py-3.5 border-t border-[#27272a] bg-[#09090b]/80 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            {activeTab === 'existing'
              ? 'Tutor passphrase and student codes are verified client-side using SHA-256 digests.'
              : 'Add new SHA-256 hashes to EXAM_CODE_HASHES in src/auth/authConfig.js to authorize new student codes.'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
