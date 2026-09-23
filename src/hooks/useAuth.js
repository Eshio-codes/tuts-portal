import { useState, useCallback } from 'react';
import { TUTOR_PASSPHRASE_HASH, EXAM_CODE_HASHES, getCodeScope, SCOPES } from '../auth/authConfig';

const SESSION_KEY = 'tuts_auth';

async function sha256(text) {
  const buf = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(text)
  );
  return [...new Uint8Array(buf)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(data) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch { /* storage full — continue without persistence */ }
}

function clearSession() {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
}

export function useAuth() {
  const [auth, setAuth] = useState(() => loadSession());

  // Returns null on success, error string on failure.
  const loginTutor = useCallback(async (passphrase) => {
    const hash = await sha256(passphrase.trim());
    if (hash !== TUTOR_PASSPHRASE_HASH) return 'Incorrect passphrase.';
    const session = { role: 'tutor', scope: SCOPES.ALL };
    saveSession(session);
    setAuth(session);
    return null;
  }, []);

  // Returns null on success, error string on failure.
  const loginStudent = useCallback(async (name, code) => {
    if (!name.trim()) return 'Enter your name.';
    const normalizedCode = code.trim().toUpperCase();
    const hash = await sha256(normalizedCode);
    if (!EXAM_CODE_HASHES.includes(hash)) return 'Invalid exam access code.';
    const scope = getCodeScope(hash, normalizedCode);
    const session = { role: 'student', name: name.trim(), code: normalizedCode, scope };
    saveSession(session);
    setAuth(session);
    return null;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setAuth(null);
  }, []);

  return {
    auth,                          // null | { role: 'tutor', scope } | { role: 'student', name, code, scope }
    role: auth?.role ?? null,      // 'tutor' | 'student' | null
    scope: auth?.scope ?? (auth?.role === 'tutor' ? SCOPES.ALL : null),
    isAuthenticated: !!auth,
    isTutor: auth?.role === 'tutor',
    isStudent: auth?.role === 'student',
    studentName: auth?.name ?? '',
    studentCode: auth?.code ?? '',
    loginTutor,
    loginStudent,
    logout,
  };
}
