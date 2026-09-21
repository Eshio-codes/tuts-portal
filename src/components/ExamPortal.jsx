import React, { useState, useEffect } from 'react';
import { EXAMS } from '../data/examData';
import { QUESTION_BANK } from '../data/questionBank';
import MathTex from './MathTex';
import {
  Clock, Flag, CheckCircle2, AlertTriangle, Send,
  ChevronLeft, ChevronRight, FileText, Award, Check
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
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamActive, timeLeftSeconds, submittedReceipt]);

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

  const calculateAutoScore = () => {
    let autoScore = 0;
    let maxAutoScore = 0;
    const scores = {};

    examQuestions.forEach((q) => {
      const userAns = answers[q.id];
      const qMaxPoints = q.points || (q.type === 'multiple-choice' ? 4 : 4);

      if (q.type === 'multiple-choice') {
        maxAutoScore += qMaxPoints;
        if (userAns === q.correctAnswer) {
          scores[q.id] = qMaxPoints;
          autoScore += qMaxPoints;
        } else {
          scores[q.id] = 0;
        }
      } else if (q.type === 'numeric') {
        maxAutoScore += qMaxPoints;
        const num = parseFloat(userAns);
        if (!isNaN(num) && Math.abs(num - q.correctAnswer) <= (q.tolerance || 0.01)) {
          scores[q.id] = qMaxPoints;
          autoScore += qMaxPoints;
        } else {
          scores[q.id] = 0;
        }
      } else {
        // Free response requires tutor grading
        scores[q.id] = 0; // pending
      }
    });

    return { autoScore, maxAutoScore, scores };
  };

  const handleFinalSubmit = () => {
    const { autoScore, maxAutoScore, scores } = calculateAutoScore();
    const submission = {
      id: `sub-${Date.now()}`,
      studentName: studentName || 'Student',
      studentId: studentId || 'STU-2026',
      examId: activeExam.id,
      submittedAt: new Date().toISOString(),
      status: 'Pending', // Pending tutor manual review for free-response
      answers,
      scores,
      totalScore: autoScore,
      maxScore: activeExam.totalPoints,
      percentage: Math.round((autoScore / activeExam.totalPoints) * 100),
      feedback: 'Preliminary automated score recorded. Tutor manual review pending for free response.'
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

  const handleAutoSubmit = () => {
    alert('Time has expired! Submitting your exam now.');
    handleFinalSubmit();
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* 1. Exam Selection / Pre-flight Screen */}
      {!isExamActive && !submittedReceipt && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Formal Tests & Exam Portal</h1>
            <p className="text-sm text-slate-400">Standardized, timed assessments with automated marking & tutor rubric review.</p>
          </div>

          {/* Exam Selector Cards */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Select Assessment:</label>
            <div className="grid grid-cols-1 gap-3">
              {EXAMS.map((ex) => {
                const isSelected = ex.id === selectedExamId;
                return (
                  <div
                    key={ex.id}
                    onClick={() => setSelectedExamId(ex.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                        {ex.subject.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{ex.timeLimitMinutes} Mins</span>
                        <span className="mx-1.5">•</span>
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        <span>{ex.totalPoints} Marks</span>
                      </span>
                    </div>
                    <div className="text-base font-bold text-white mb-1">{ex.title}</div>
                    <div className="text-xs text-slate-400">{ex.description}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Profile & Launch Box */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Candidate Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Student Full Name *</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Student ID (Optional)</label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. STU-2026-001"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 leading-relaxed space-y-1">
              <div className="font-bold text-slate-300">Exam Instructions:</div>
              <div>• Ensure a quiet environment before starting. Timer cannot be paused.</div>
              <div>• Answers are saved automatically in your browser as you type.</div>
              <div>• Multiple-choice and numeric problems are auto-marked upon submission; derivations will be reviewed by your tutor.</div>
            </div>

            <button
              onClick={handleStartExam}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-extrabold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2"
            >
              <span>Begin Exam Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Active Timed Exam Session */}
      {isExamActive && currentQ && (
        <div className="space-y-6">

          {/* Sticky Status & Timer Header */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400">{activeExam.title}</div>
              <div className="text-xs text-slate-400">Candidate: {studentName} ({studentId || 'STU'})</div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Countdown Clock */}
              <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-mono text-sm font-bold border ${
                timeLeftSeconds < 300
                  ? 'bg-rose-950/60 text-rose-300 border-rose-600 animate-pulse'
                  : 'bg-slate-950 text-cyan-300 border-slate-800'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeftSeconds)}</span>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Finish & Submit</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Left: Question Jump Drawer */}
            <div className="lg:col-span-1 p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Question Map ({examQuestions.length})
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-3 gap-2">
                {examQuestions.map((q, idx) => {
                  const isCurrent = idx === currentQuestionIndex;
                  const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                  const isFlagged = flaggedQuestions[q.id];

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`relative p-2.5 rounded-xl text-xs font-mono font-bold border transition-all ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                          : isAnswered
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <span>Q{idx + 1}</span>
                      {isFlagged && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full ring-2 ring-slate-900" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-800/80 text-[11px] space-y-1.5 text-slate-400">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-700"></span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-slate-950 border border-slate-800"></span>
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>Flagged for Review</span>
                </div>
              </div>
            </div>

            {/* Right: Active Question Canvas */}
            <div className="lg:col-span-3 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between min-h-[480px]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div>
                    <span className="text-xs font-mono text-cyan-400 font-bold uppercase">
                      {currentQ.sectionTitle || 'Section'} • Question {currentQuestionIndex + 1}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{currentQ.title}</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleFlag(currentQ.id)}
                      className={`p-2 rounded-lg border text-xs font-medium flex items-center space-x-1.5 ${
                        flaggedQuestions[currentQ.id]
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                      title="Flag question for review"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Flag</span>
                    </button>
                    <span className="text-xs font-mono font-bold text-purple-400 px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30">
                      {currentQ.points || 4} Marks
                    </span>
                  </div>
                </div>

                {/* Prompt */}
                <div className="text-white text-base leading-relaxed mb-6 font-medium">
                  {currentQ.mathPrompt ? (
                    <div className="space-y-2">
                      <p>{currentQ.prompt.split('\n\n')[0]}</p>
                      {currentQ.prompt.includes('\n\n') && (
                        <MathTex math={currentQ.prompt.split('\n\n')[1]} block />
                      )}
                    </div>
                  ) : (
                    <p>{currentQ.prompt}</p>
                  )}
                </div>

                {/* Input Area */}
                <div className="space-y-4 mb-8">
                  {currentQ.type === 'multiple-choice' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentQ.options.map((opt, optIdx) => {
                        const isChosen = answers[currentQ.id] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleAnswerChange(currentQ.id, optIdx)}
                            className={`p-4 rounded-xl border text-left flex items-center space-x-3 transition-all ${
                              isChosen
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold shadow-md'
                                : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                            }`}
                          >
                            <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="text-sm">
                              {opt.includes('\\') ? <MathTex math={opt} /> : opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {currentQ.type === 'numeric' && (
                    <div className="max-w-sm">
                      <label className="block text-xs font-mono text-slate-400 mb-2">
                        Enter numeric answer {currentQ.unit && `(${currentQ.unit})`}:
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        placeholder="e.g. 11.0"
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}

                  {currentQ.type === 'free-response' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-slate-400">
                        Type derivation / calculation steps:
                      </label>
                      <textarea
                        rows={6}
                        value={answers[currentQ.id] || ''}
                        onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                        placeholder="State your formulas, substitutions, and conclusion clearly..."
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={currentQuestionIndex === 0}
                  className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 ${
                    currentQuestionIndex === 0
                      ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 text-white hover:bg-slate-750'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="text-xs text-slate-500 font-mono">
                  {Object.keys(answers).length} of {examQuestions.length} answered
                </div>

                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, examQuestions.length - 1))}
                  disabled={currentQuestionIndex === examQuestions.length - 1}
                  className={`px-4 py-2 rounded-xl text-xs font-medium flex items-center space-x-1.5 ${
                    currentQuestionIndex === examQuestions.length - 1
                      ? 'bg-slate-900 text-slate-600 cursor-not-allowed'
                      : 'bg-slate-800 text-white hover:bg-slate-750'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Confirm Exam Submission</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have answered <span className="text-cyan-400 font-bold">{Object.keys(answers).length}</span> out of{' '}
              <span className="font-bold">{examQuestions.length}</span> questions. Once submitted, your exam will be recorded and cannot be changed.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                Continue Exam
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Submission Complete Receipt */}
      {submittedReceipt && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-white">Exam Submitted Successfully!</h2>
            <p className="text-xs text-slate-400 font-mono">Submission ID: {submittedReceipt.id}</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-4 text-left">
            <div>
              <div className="text-xs text-slate-500">Student</div>
              <div className="text-sm font-bold text-white">{submittedReceipt.studentName}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Submitted At</div>
              <div className="text-sm font-mono text-slate-300">
                {new Date(submittedReceipt.submittedAt).toLocaleTimeString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Auto-Marked Points</div>
              <div className="text-base font-bold text-cyan-400 font-mono">
                {submittedReceipt.totalScore} / {submittedReceipt.maxScore}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Status</div>
              <span className="inline-block text-xs font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Pending Tutor Review
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Automated questions have been scored. Free-response problems are ready in the Tutor Grading Dashboard for marking.
          </p>

          <button
            onClick={() => {
              setSubmittedReceipt(null);
              setIsExamActive(false);
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
          >
            Return to Exam Portal
          </button>
        </div>
      )}

    </div>
  );
}
