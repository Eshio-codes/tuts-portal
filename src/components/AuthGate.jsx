import React, { useState } from 'react';
import { ShieldCheck, LogIn, KeyRound, Eye, EyeOff, BookOpen } from 'lucide-react';

/**
 * AuthGate — shown when unauthenticated.
 * Props:
 *   onStudentLogin(name, code) => Promise<string|null>
 *   onTutorLogin(passphrase)   => Promise<string|null>
 */
export default function AuthGate({ onStudentLogin, onTutorLogin }) {
  const [mode, setMode] = useState('student'); // 'student' | 'tutor'

  // Student form
  const [studentName, setStudentName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [studentError, setStudentError] = useState('');
  const [studentLoading, setStudentLoading] = useState(false);

  // Tutor form
  const [passphrase, setPassphrase] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [tutorError, setTutorError] = useState('');
  const [tutorLoading, setTutorLoading] = useState(false);

  async function handleStudentSubmit(e) {
    e.preventDefault();
    setStudentError('');
    setStudentLoading(true);
    const err = await onStudentLogin(studentName, accessCode);
    setStudentLoading(false);
    if (err) setStudentError(err);
  }

  async function handleTutorSubmit(e) {
    e.preventDefault();
    setTutorError('');
    setTutorLoading(true);
    const err = await onTutorLogin(passphrase);
    setTutorLoading(false);
    if (err) setTutorError(err);
  }

  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center px-4 py-12">
      {/* Branding */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <BookOpen className="w-7 h-7 text-blue-400" />
          <span className="text-xl font-bold text-zinc-100 tracking-tight">
            STEM Foundation Portal
          </span>
        </div>
        <p className="text-sm text-zinc-500">Pre-University Tutoring Platform</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Tab switcher */}
        <div className="flex border-b border-zinc-800">
          <button
            onClick={() => { setMode('student'); setTutorError(''); }}
            className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
              mode === 'student'
                ? 'text-zinc-100 bg-zinc-800/60'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => { setMode('tutor'); setStudentError(''); }}
            className={`flex-1 py-3.5 text-sm font-medium transition-colors ${
              mode === 'tutor'
                ? 'text-zinc-100 bg-zinc-800/60'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Tutor
          </button>
        </div>

        <div className="p-6">
          {mode === 'student' ? (
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Exam Access Code
                </label>
                <div className="relative">
                  <input
                    type={showCode ? 'text' : 'password'}
                    value={accessCode}
                    onChange={e => setAccessCode(e.target.value)}
                    placeholder="STEM-XXXX"
                    autoComplete="off"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 pr-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCode(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    tabIndex={-1}
                  >
                    {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="mt-1.5 text-xs text-zinc-600">
                  Access code provided by your tutor
                </p>
              </div>

              {studentError && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
                  {studentError}
                </p>
              )}

              <button
                type="submit"
                disabled={studentLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:text-blue-500 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                {studentLoading ? 'Verifying…' : 'Enter Portal'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTutorSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-medium text-amber-400">Tutor access only</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Passphrase
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={passphrase}
                    onChange={e => setPassphrase(e.target.value)}
                    placeholder="Enter tutor passphrase"
                    autoComplete="current-password"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 pr-10 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {tutorError && (
                <p className="text-xs text-red-400 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
                  {tutorError}
                </p>
              )}

              <button
                type="submit"
                disabled={tutorLoading}
                className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900 disabled:text-amber-500 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                {tutorLoading ? 'Verifying…' : 'Tutor Login'}
              </button>
            </form>
          )}
        </div>
      </div>

      <p className="mt-6 text-xs text-zinc-700">
        Credentials verified locally — no data leaves your browser.
      </p>
    </div>
  );
}
