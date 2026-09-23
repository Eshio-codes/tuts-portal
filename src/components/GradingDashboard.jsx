import React, { useState, useEffect } from 'react';
import { INITIAL_SUBMISSIONS, EXAMS } from '../data/examData';
import { QUESTION_BANK } from '../data/questionBank';
import { calculateGradeBadge } from '../utils/gradingEngine';
import { MathTex, MathText } from './MathTex';
import {
  Award, CheckCircle2, Clock, Download,
  FileText, User, ChevronRight, Save, Trash2, Edit3, Filter, Check
} from 'lucide-react';

export default function GradingDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [gradingScores, setGradingScores] = useState({});
  const [feedbackNote, setFeedbackNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [savedBanner, setSavedBanner] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  // Load submissions from LocalStorage merged with initial defaults
  useEffect(() => {
    try {
      const stored = localStorage.getItem('tuts_submissions');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSubmissions(parsed);
      } else {
        localStorage.setItem('tuts_submissions', JSON.stringify(INITIAL_SUBMISSIONS));
        setSubmissions(INITIAL_SUBMISSIONS);
      }
    } catch (err) {
      console.error('Error loading submissions:', err);
      setSubmissions(INITIAL_SUBMISSIONS);
    }
  }, []);

  const activeSubmission = submissions.find((s) => s.id === selectedSubId);
  const activeExam = activeSubmission ? EXAMS.find((e) => e.id === activeSubmission.examId) : null;

  // Prepopulate scores and feedback
  useEffect(() => {
    if (activeSubmission) {
      setGradingScores(activeSubmission.scores || {});
      setFeedbackNote(activeSubmission.feedback || '');
    }
  }, [activeSubmission]);

  const handleScoreChange = (qId, scoreVal, maxVal) => {
    const num = Math.min(Math.max(0, parseFloat(scoreVal) || 0), maxVal);
    setGradingScores((prev) => ({
      ...prev,
      [qId]: num
    }));
  };

  const handleSaveGrade = () => {
    if (!activeSubmission || !activeExam) return;

    let total = 0;
    Object.values(gradingScores).forEach((val) => {
      total += parseFloat(val) || 0;
    });

    const max = activeExam.totalPoints || 50;
    const pct = Math.round((total / max) * 100);

    const updatedSubmissions = submissions.map((sub) => {
      if (sub.id === activeSubmission.id) {
        return {
          ...sub,
          scores: gradingScores,
          totalScore: total,
          maxScore: max,
          percentage: pct,
          feedback: feedbackNote,
          status: 'Graded',
          gradedAt: new Date().toISOString()
        };
      }
      return sub;
    });

    setSubmissions(updatedSubmissions);
    localStorage.setItem('tuts_submissions', JSON.stringify(updatedSubmissions));
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleDeleteSubmission = (subId) => {
    const updated = submissions.filter((s) => s.id !== subId);
    setSubmissions(updated);
    localStorage.setItem('tuts_submissions', JSON.stringify(updated));
    if (selectedSubId === subId) setSelectedSubId(null);
    setConfirmDeleteId(null);
  };

  const handleExportCSV = () => {
    if (submissions.length === 0) return;
    const headers = ['Submission ID', 'Student Name', 'Student ID', 'Exam ID', 'Total Score', 'Max Score', 'Percentage', 'Status', 'Submitted At', 'Feedback'];
    const rows = submissions.map((s) => [
      s.id,
      `"${s.studentName}"`,
      s.studentId,
      s.examId,
      s.totalScore,
      s.maxScore,
      `${s.percentage}%`,
      s.status,
      s.submittedAt,
      `"${(s.feedback || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tuts_gradebook_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status.toLowerCase() === filterStatus.toLowerCase();
  });

  const liveTotalScore = Object.values(gradingScores).reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
  const liveMaxScore = activeExam?.totalPoints || 50;
  const livePercentage = Math.round((liveTotalScore / liveMaxScore) * 100);
  const liveGradeBadge = calculateGradeBadge(livePercentage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Header & Stats Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Examiner Gradebook & Review Console</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Speedgrade submitted assessments, adjust rubric mark allocations, and export cohort performance data.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-md bg-[#121215] hover:bg-zinc-850 text-zinc-200 border border-[#27272a] text-xs font-mono flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-zinc-400" />
            <span>Export CSV Gradebook</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Submissions Queue (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
              Submissions ({submissions.length})
            </span>

            {/* Filter */}
            <div className="flex items-center space-x-1 bg-[#121215] p-0.5 rounded border border-[#27272a] text-[11px] font-mono">
              {['all', 'Pending', 'Graded'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2 py-0.5 rounded capitalize ${
                    filterStatus === st ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
            {filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center rounded-lg bg-[#121215] border border-[#27272a] text-zinc-500 text-xs font-mono">
                No submissions matching filter.
              </div>
            ) : (
              filteredSubmissions.map((sub) => {
                const isSelected = sub.id === selectedSubId;
                const exam = EXAMS.find((e) => e.id === sub.examId);
                const gradeBadge = calculateGradeBadge(sub.percentage || 0);

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubId(sub.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#18181c] border-zinc-500 text-zinc-100 shadow-sm'
                        : 'bg-[#121215] border-[#27272a] hover:border-zinc-700 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-zinc-200">{sub.studentName}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                        sub.status === 'Graded'
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                          : 'bg-amber-950/40 text-amber-300 border-amber-800/40'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-zinc-400 font-mono truncate mb-2">
                      <MathText text={exam?.title || sub.examId} />
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#27272a] text-xs font-mono">
                      <span className="text-zinc-400">
                        {sub.totalScore} / {sub.maxScore} pts ({sub.percentage}%)
                      </span>
                      <span className={`px-1.5 py-0.2 rounded font-semibold border ${gradeBadge.style}`}>
                        {gradeBadge.grade}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Grading Workbench (8 cols) */}
        <div className="lg:col-span-8">
          {activeSubmission && activeExam ? (
            <div className="space-y-5 bg-[#121215] p-6 rounded-lg border border-[#27272a]">

              {/* Submission Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-850 text-zinc-300 font-semibold border border-zinc-700 uppercase">
                      Grading Workbench
                    </span>
                    <span className="text-xs font-mono text-zinc-500">{activeSubmission.id}</span>
                  </div>
                  <h2 className="text-base font-semibold text-zinc-100 mt-1">
                    {activeSubmission.studentName} <span className="text-zinc-400 text-xs font-normal">({activeSubmission.studentId})</span>
                  </h2>
                  <p className="text-xs text-zinc-400"><MathText text={activeExam.title} /></p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-[10px] text-zinc-500 font-mono uppercase">Calculated Score</div>
                    <div className="text-lg font-mono font-semibold text-zinc-100">
                      {liveTotalScore} / {liveMaxScore} ({livePercentage}%)
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded font-bold font-mono border ${liveGradeBadge.style}`}>
                    {liveGradeBadge.grade}
                  </span>
                </div>
              </div>

              {/* Questions List & Marking Fields */}
              <div className="space-y-4">
                {activeExam.sections.flatMap((sec) => sec.questions).map((qId, idx) => {
                  const q = QUESTION_BANK.find((qb) => qb.id === qId);
                  if (!q) return null;

                  const studentAns = activeSubmission.answers[q.id];
                  const currentScore = gradingScores[q.id] !== undefined ? gradingScores[q.id] : 0;
                  const qMaxPoints = q.points || (q.type === 'multiple-choice' ? 4 : 4);

                  return (
                    <div key={q.id} className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-3">

                      {/* Question Header */}
                      <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                        <span className="text-xs font-mono font-semibold text-zinc-300">
                          Problem {idx + 1}: <MathText text={q.title} /> <span className="text-zinc-500 font-normal">({q.type})</span>
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-zinc-400 font-mono">Marks:</span>
                          <input
                            type="number"
                            min="0"
                            max={qMaxPoints}
                            step="0.5"
                            value={currentScore}
                            onChange={(e) => handleScoreChange(q.id, e.target.value, qMaxPoints)}
                            className="w-14 px-2 py-1 bg-[#121215] border border-zinc-700 rounded text-zinc-100 font-mono text-center font-semibold text-xs focus:outline-none focus:border-zinc-400"
                          />
                          <span className="text-xs font-mono text-zinc-400">/ {qMaxPoints}</span>
                        </div>
                      </div>

                      {/* Prompt Snippet */}
                      <div className="text-xs text-zinc-300 leading-relaxed">
                        <MathText text={q.prompt} />
                      </div>

                      {/* Student's Response */}
                      <div className="space-y-1">
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                          Candidate Answer:
                        </div>
                        <div className="p-2.5 rounded bg-[#121215] border border-[#27272a] text-xs font-mono text-zinc-200 whitespace-pre-line">
                          {q.type === 'multiple-choice' ? (
                            studentAns !== undefined ? (
                              <span>
                                Choice {String.fromCharCode(65 + studentAns)}: <MathText text={q.options[studentAns]} />
                              </span>
                            ) : (
                              <span className="text-zinc-500 italic">No answer provided</span>
                            )
                          ) : (
                            studentAns !== undefined && studentAns !== '' ? <MathText text={String(studentAns)} /> : <span className="text-zinc-500 italic">No response</span>
                          )}
                        </div>
                      </div>

                      {/* Model Answer & Rubric for Tutor Reference */}
                      <div className="p-3 rounded bg-[#121215] border border-[#27272a] text-xs space-y-2">
                        <div className="text-[10px] font-mono font-semibold uppercase text-zinc-400 tracking-wider">
                          Teacher Solution & Rubric Criteria
                        </div>
                        {q.correctAnswer !== undefined && (
                          <div className="text-zinc-300 text-xs">
                            <span className="text-zinc-500">Correct Option:</span> Choice {String.fromCharCode(65 + q.correctAnswer)} (<MathText text={q.options?.[q.correctAnswer]} />)
                          </div>
                        )}
                        {q.solution && (
                          <div className="text-zinc-300 text-xs whitespace-pre-line">
                            <MathText text={q.solution} />
                          </div>
                        )}
                        {q.modelAnswer && (
                          <div className="text-zinc-300 text-xs whitespace-pre-line">
                            <MathText text={q.modelAnswer} />
                          </div>
                        )}
                        {q.rubric && (
                          <div className="pt-2 border-t border-[#27272a] space-y-1">
                            {q.rubric.map((r, ri) => (
                              <div key={ri} className="flex items-center justify-between text-xs text-zinc-300">
                                <span>• <MathText text={r.criterion} /></span>
                                <span className="font-mono text-zinc-200 font-semibold">+{r.marks}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Overall Feedback Editor */}
              <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] space-y-2">
                <label className="block text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
                  Examiner Feedback & Commendations:
                </label>
                <textarea
                  rows={3}
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="State candidate strengths, specific errors in derivations, and recommendations..."
                  className="w-full px-3 py-2 bg-[#121215] border border-[#27272a] rounded-md text-zinc-100 text-xs font-mono focus:outline-none focus:border-zinc-500"
                />
              </div>

              {/* Saved Success Toast */}
              {savedBanner && (
                <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-950/50 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs font-mono">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Grade and qualitative feedback saved successfully.</span>
                </div>
              )}

              {/* Save / Delete Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#27272a]">
                {confirmDeleteId === activeSubmission.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-400 font-mono">Confirm delete?</span>
                    <button
                      onClick={() => handleDeleteSubmission(activeSubmission.id)}
                      className="px-2.5 py-1 rounded bg-rose-700 hover:bg-rose-600 text-white text-xs font-mono transition-colors"
                    >
                      Yes, delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(activeSubmission.id)}
                    className="px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-rose-400 hover:bg-rose-950/40 text-xs font-mono flex items-center space-x-1.5 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                )}

                <button
                  onClick={handleSaveGrade}
                  className="px-4 py-2 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Grade & Feedback</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-16 rounded-lg bg-[#121215] border border-[#27272a] text-center space-y-2">
              <Award className="w-8 h-8 text-zinc-600 mx-auto" />
              <h3 className="text-sm font-semibold text-zinc-300">No Submission Selected</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto font-mono">
                Select a candidate submission from the queue to review answers and record grades.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
