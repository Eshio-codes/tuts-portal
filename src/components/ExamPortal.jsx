import React, { useState, useEffect, useRef } from 'react';
import { EXAMS } from '../data/examData';
import { QUESTION_BANK } from '../data/questionBank';
import { MathTex, MathText } from './MathTex';
import { gradeExamSubmission } from '../utils/gradingEngine';
import {
  Clock, Flag, CheckCircle2, AlertTriangle, Send,
  ChevronLeft, ChevronRight, FileText, Award, Check, RotateCcw,
  ShieldAlert, ShieldCheck, AlertOctagon
} from 'lucide-react';

export default function ExamPortal({ onExamSubmitted }) {
  const [selectedExamId, setSelectedExamId] = useState('exam-stem-s2');
  const [isExamActive, setIsExamActive] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(60 * 60);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedReceipt, setSubmittedReceipt] = useState(null);

  const activeExam = EXAMS.find((e) => e.id === selectedExamId) || EXAMS[0];

  // Ref to always access latest answers inside async event listeners
  const answersRef = useRef(answers);
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Collect all questions for this exam
  const examQuestions = activeExam.sections.flatMap((sec) =>
    sec.questions.map((qId) => {
      const q = QUESTION_BANK.find((qb) => qb.id === qId);
      return { ...q, sectionTitle: sec.title };
    })
  ).filter(Boolean);

  const currentQ = examQuestions[currentQuestionIndex];

  // Timer countdown
  useEffect(() => {
    let timer = null;
    if (isExamActive && timeLeftSeconds > 0 && !submittedReceipt) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit('Time limit reached.');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamActive, timeLeftSeconds, submittedReceipt]);

  // Anti-cheat Proctoring: Tab switch / Window focus loss auto-submit
  useEffect(() => {
    if (!isExamActive || submittedReceipt) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleProctorViolation('Tab switch / background tab navigation detected.');
      }
    };

    const handleWindowBlur = () => {
      handleProctorViolation('Window focus lost / application minimized or switched.');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [isExamActive, submittedReceipt]);

  const handleProctorViolation = (reason) => {
    handleFinalSubmit({
      proctorViolation: true,
      violationReason: reason,
      feedback: `AUTO-SUBMITTED BY PROCTORING ENGINE: Anti-cheat security violation (${reason}). Answers locked at time of event.`
    });
  };

  const handleStartExam = () => {
    if (!studentName.trim()) {
      alert('Please enter your full name before starting the exam.');
      return;
    }
    setIsExamActive(true);
    setTimeLeftSeconds(activeExam.timeLimitMinutes * 60);
    setAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setSubmittedReceipt(null);
  };

  const handleAnswerChange = (qId, val) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const toggleFlag = (qId) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const handleFinalSubmit = (proctorOptions = {}) => {
    const currentAnswers = answersRef.current || answers;
    const { autoScore, scoresMap } = gradeExamSubmission(examQuestions, currentAnswers);

    const isViolation = Boolean(proctorOptions.proctorViolation);
    const submission = {
      id: `sub-${Date.now()}`,
      studentName: studentName || 'Student',
      studentId: studentId || 'STU-2026',
      examId: activeExam.id,
      submittedAt: new Date().toISOString(),
      status: isViolation ? 'Flagged' : 'Pending',
      proctorViolation: isViolation,
      violationReason: proctorOptions.violationReason || null,
      answers: currentAnswers,
      scores: scoresMap,
      totalScore: autoScore,
      maxScore: activeExam.totalPoints,
      percentage: Math.round((autoScore / activeExam.totalPoints) * 100),
      feedback: proctorOptions.feedback || 'Automated objective score recorded. Awaiting tutor review.'
    };

    // Save to LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem('tuts_submissions') || '[]');
      const updated = [submission, ...existing];
      localStorage.setItem('tuts_submissions', JSON.stringify(updated));
    } catch (err) {
      console.error('LocalStorage write error:', err);
    }

    setSubmittedReceipt(submission);
    setIsExamActive(false);
    setShowSubmitModal(false);

    if (onExamSubmitted) {
      onExamSubmitted(submission);
    }
  };

  const handleAutoSubmit = (reason) => {
    handleFinalSubmit({
      feedback: `Auto-submitted: ${reason}`
    });
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* 1. Exam Selection / Pre-flight Screen */}
      {!isExamActive && !submittedReceipt && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border-b border-[#27272a] pb-4">
            <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Formal Examination Portal</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Timed standardized assessments with automated marking and rubric derivation review.</p>
          </div>

          {/* Assessment List */}
          <div className="space-y-3">
            <label className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 block">
              Available Assessments:
            </label>
            <div className="space-y-2.5">
              {EXAMS.map((ex) => {
                const isSelected = ex.id === selectedExamId;
                return (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExamId(ex.id)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#18181c] border-zinc-600 shadow-sm'
                        : 'bg-[#121215] border-[#27272a] hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-850 border border-zinc-700 text-zinc-300 font-semibold">
                          {ex.subject}
                        </span>
                        <span className="text-xs font-semibold text-zinc-200"><MathText text={ex.title} /></span>
                      </div>
                      <div className="text-xs font-mono text-zinc-400 flex items-center space-x-2">
                        <span>{ex.timeLimitMinutes} mins</span>
                        <span>•</span>
                        <span>{ex.totalPoints} marks</span>
                      </div>
                    </div>
                    <div className="text-xs text-zinc-400 leading-relaxed"><MathText text={ex.description} /></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidate Registration Panel */}
          <div className="p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
            <div className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
              Candidate Information
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-zinc-100 text-xs font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Student ID (Optional)</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. STU-2026-01"
                  className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-zinc-100 text-xs font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>
            </div>

            <div className="p-3.5 rounded bg-[#09090b] border border-[#27272a] text-xs text-zinc-400 space-y-1.5 font-mono">
              <div className="text-zinc-300 font-semibold mb-1 flex items-center space-x-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Examination Instructions & Proctoring Policy:</span>
              </div>
              <div>• Assessment timer runs continuously once launched.</div>
              <div>• <span className="text-amber-400 font-semibold">Active Anti-Cheat Enabled:</span> Switching browser tabs, minimizing the window, or losing window focus will instantly auto-submit your exam with a proctoring violation flag.</div>
              <div>• Deterministic Multiple Choice and Numeric inputs are validated automatically upon final submission.</div>
            </div>

            <button
              onClick={handleStartExam}
              className="w-full py-2.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono font-semibold text-xs transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Begin Examination</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Active Timed Exam Session */}
      {isExamActive && currentQ && (
        <div className="space-y-4">

          {/* Status & Timer Command Header */}
          <div className="p-4 rounded-lg bg-[#121215] border border-[#27272a] flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono font-semibold text-zinc-200">{activeExam.title}</div>
              <div className="text-xs text-zinc-400 font-mono mt-0.5">Candidate: {studentName} ({studentId || 'STU-01'})</div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Countdown Clock */}
              <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-md font-mono text-xs font-semibold border ${
                timeLeftSeconds < 300
                  ? 'bg-rose-950/40 text-rose-300 border-rose-800'
                  : 'bg-[#09090b] text-zinc-200 border-[#27272a]'
              }`}>
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-3.5 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono font-semibold text-xs flex items-center space-x-1.5 transition-all"
              >
                <Send className="w-3 h-3" />
                <span>Submit Exam</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* Left: Question Map Matrix (3 cols) */}
            <div className="lg:col-span-4 p-4 rounded-lg bg-[#121215] border border-[#27272a] space-y-3">
              <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Question Index ({examQuestions.length})
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-1.5">
                {examQuestions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                  const isFlagged = flaggedQuestions[q.id];

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`relative p-2 rounded text-xs font-mono border transition-all ${
                        isCurrent
                          ? 'bg-zinc-800 text-zinc-100 border-zinc-500 font-semibold'
                          : isAnswered
                          ? 'bg-[#18181c] text-zinc-200 border-zinc-700'
                          : 'bg-[#09090b] text-zinc-500 border-[#27272a] hover:border-zinc-700'
                      }`}
                    >
                      <span>Q{idx + 1}</span>
                      {isFlagged && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-400 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#27272a] text-[11px] font-mono space-y-1 text-zinc-400">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded bg-[#18181c] border border-zinc-700"></span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded bg-[#09090b] border border-[#27272a]"></span>
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Flagged for Review</span>
                </div>
              </div>
            </div>

            {/* Right: Question Workbench (8 cols) */}
            <div className="lg:col-span-8 p-6 rounded-lg bg-[#121215] border border-[#27272a] flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4">
                  <div>
                    <span className="text-xs font-mono text-zinc-400 uppercase">
                      <MathText text={currentQ.sectionTitle || 'Section'} /> • Question {currentQuestionIndex + 1}
                    </span>
                    <h3 className="text-base font-semibold text-zinc-100 mt-0.5"><MathText text={currentQ.title} /></h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFlag(currentQ.id)}
                      className={`px-2.5 py-1 rounded border text-xs font-mono flex items-center space-x-1.5 transition-all ${
                        flaggedQuestions[currentQ.id]
                          ? 'bg-amber-950/40 text-amber-300 border-amber-800/60'
                          : 'bg-[#09090b] text-zinc-400 border-[#27272a] hover:text-zinc-200'
                      }`}
                      title="Flag question for review"
                    >
                      <Flag className="w-3 h-3" />
                      <span>Flag</span>
                    </button>
                    <span className="text-xs font-mono font-semibold text-zinc-300 px-2 py-0.5 rounded bg-[#09090b] border border-[#27272a]">
                      {currentQ.points || 4} pts
                    </span>
                  </div>
                </div>

                {/* Prompt */}
                <div className="text-zinc-100 text-sm leading-relaxed mb-6">
                  <MathText text={currentQ.prompt} />
                </div>

                {/* Input Controls */}
                <div className="space-y-4 mb-6">
                  {currentQ.type === 'multiple-choice' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentQ.options.map((opt, optIdx) => {
                        const isChosen = answers[currentQ.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerChange(currentQ.id, optIdx)}
                            className={`p-3 rounded-md border text-left flex items-center space-x-2.5 transition-all ${
                              isChosen
                                ? 'bg-[#18181c] border-zinc-500 text-zinc-100 font-medium'
                                : 'bg-[#09090b] border-[#27272a] text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs font-mono font-semibold text-zinc-400">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-xs sm:text-sm">
                              <MathText text={opt} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {currentQ.type === 'numeric' && (
                    <div className="max-w-xs space-y-1.5">
                      <label className="block text-xs font-mono text-zinc-400">
                        Enter numeric value {currentQ.unit && `(${currentQ.unit})`}:
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        placeholder="e.g. 11.0"
                        className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-zinc-100 font-mono text-sm focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  )}

                  {currentQ.type === 'free-response' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-mono text-zinc-400">
                        Derivation & mathematical working:
                      </label>
                      <textarea
                        rows={6}
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        placeholder="State your formulas, substitutions, and conclusion clearly..."
                        className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#27272a]">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentQuestionIndex === 0}
                  className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
                    currentQuestionIndex === 0
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-zinc-850 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5 inline mr-1" />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-zinc-400 font-mono">
                  {Object.keys(answers).length} of {examQuestions.length} answered
                </div>

                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, examQuestions.length - 1))}
                  disabled={currentQuestionIndex === examQuestions.length - 1}
                  className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
                    currentQuestionIndex === examQuestions.length - 1
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-zinc-850 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5 inline ml-1" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#121215] border border-zinc-700 rounded-lg p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Confirm Exam Submission</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed font-mono">
              You have answered <span className="text-zinc-100 font-bold">{Object.keys(answers).length}</span> of{' '}
              <span className="font-bold">{examQuestions.length}</span> questions. Once submitted, your answers cannot be altered.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#27272a]">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-3 py-1.5 rounded bg-zinc-850 border border-zinc-700 text-zinc-300 text-xs font-mono hover:bg-zinc-800"
              >
                Return to Exam
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-3 py-1.5 rounded bg-zinc-100 text-zinc-950 text-xs font-mono font-semibold hover:bg-zinc-200"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Submission Complete Receipt */}
      {submittedReceipt && (
        <div className="max-w-xl mx-auto p-6 rounded-lg bg-[#121215] border border-[#27272a] shadow-xl text-center space-y-5">
          {submittedReceipt.proctorViolation ? (
            <div className="w-12 h-12 rounded-full bg-rose-950/50 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-emerald-950/50 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
          )}

          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-zinc-100">
              {submittedReceipt.proctorViolation ? 'Exam Auto-Submitted (Proctor Violation)' : 'Examination Submitted'}
            </h2>
            <p className="text-xs text-zinc-400 font-mono">Reference: {submittedReceipt.id}</p>
          </div>

          {submittedReceipt.proctorViolation && (
            <div className="p-3.5 rounded-md bg-rose-950/30 border border-rose-800/60 text-left font-mono text-xs text-rose-300 space-y-1">
              <div className="font-semibold flex items-center space-x-1.5 text-rose-200">
                <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
                <span>Security Flag Recorded</span>
              </div>
              <div className="text-[11px] text-rose-300/90 leading-relaxed">
                {submittedReceipt.violationReason || 'Window focus lost or browser tab switched during active examination.'}
              </div>
              <div className="text-[10px] text-rose-400/80 pt-1">
                This event has been logged with timestamp in the Tutor Gradebook.
              </div>
            </div>
          )}

          <div className="p-4 rounded bg-[#09090b] border border-[#27272a] grid grid-cols-2 gap-3 text-left font-mono text-xs">
            <div>
              <div className="text-zinc-500 text-[11px]">Candidate</div>
              <div className="text-zinc-200 font-semibold">{submittedReceipt.studentName}</div>
            </div>
            <div>
              <div className="text-zinc-500 text-[11px]">Timestamp</div>
              <div className="text-zinc-300">
                {new Date(submittedReceipt.submittedAt).toLocaleTimeString()}
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-[11px]">Auto-Scored Marks</div>
              <div className="text-zinc-100 font-bold">
                {submittedReceipt.totalScore} / {submittedReceipt.maxScore}
              </div>
            </div>
            <div>
              <div className="text-zinc-500 text-[11px]">Status</div>
              <span className={submittedReceipt.proctorViolation ? 'text-rose-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                {submittedReceipt.status}
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-400">
            {submittedReceipt.proctorViolation
              ? 'Answers at the moment of the security violation have been captured and preserved.'
              : 'Deterministic questions have been scored automatically and recorded to the gradebook.'}
          </p>

          <button
            onClick={() => {
              setSubmittedReceipt(null);
              setIsExamActive(false);
            }}
            className="px-4 py-2 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-200 text-xs font-mono border border-zinc-700"
          >
            Return to Exam Index
          </button>
        </div>
      )}

    </div>
  );
}
