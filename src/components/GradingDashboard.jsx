import React, { useState, useEffect } from 'react';
import { INITIAL_SUBMISSIONS, EXAMS } from '../data/examData';
import { QUESTION_BANK } from '../data/questionBank';
import MathTex from './MathTex';
import {
  Award, CheckCircle2, Clock, Download, Upload,
  FileText, User, ChevronRight, Save, Trash2, Edit3, Filter, Sparkles
} from 'lucide-react';

export default function GradingDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubId, setSelectedSubId] = useState(null);
  const [gradingScores, setGradingScores] = useState({});
  const [feedbackNote, setFeedbackNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

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

  // When selecting a submission to grade, prepopulate scores and feedback
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
    alert('Grade and feedback saved successfully!');
  };

  const handleDeleteSubmission = (subId) => {
    if (confirm('Are you sure you want to delete this submission record?')) {
      const updated = submissions.filter((s) => s.id !== subId);
      setSubmissions(updated);
      localStorage.setItem('tuts_submissions', JSON.stringify(updated));
      if (selectedSubId === subId) setSelectedSubId(null);
    }
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

  // Grade calculation
  const getLetterGrade = (pct) => {
    if (pct >= 90) return { grade: 'A*', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (pct >= 80) return { grade: 'A', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    if (pct >= 70) return { grade: 'B', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (pct >= 60) return { grade: 'C', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { grade: 'F', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filterStatus === 'all') return true;
    return s.status.toLowerCase() === filterStatus.toLowerCase();
  });

  // Calculate live total while grading
  const liveTotalScore = Object.values(gradingScores).reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
  const liveMaxScore = activeExam?.totalPoints || 50;
  const livePercentage = Math.round((liveTotalScore / liveMaxScore) * 100);
  const liveGradeBadge = getLetterGrade(livePercentage);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header & Stats Strip */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <Award className="w-6 h-6 text-purple-400" />
            <span>Tutor Grading & Gradebook Console</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Review exam submissions, apply custom rubrics, adjust scores, and export class gradebooks.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV Gradebook</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Submissions Queue */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              Submissions ({submissions.length})
            </span>

            {/* Filter */}
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
              {['all', 'Pending', 'Graded'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-2 py-0.5 rounded capitalize font-medium ${
                    filterStatus === st ? 'bg-purple-500/20 text-purple-300' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
            {filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
                No submissions found for this filter.
              </div>
            ) : (
              filteredSubmissions.map((sub) => {
                const isSelected = sub.id === selectedSubId;
                const exam = EXAMS.find((e) => e.id === sub.examId);
                const gradeBadge = getLetterGrade(sub.percentage || 0);

                return (
                  <div
                    key={sub.id}
                    onClick={() => setSelectedSubId(sub.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-900 border-purple-500/60 shadow-lg shadow-purple-500/10'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center space-x-2">
                        <User className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-sm font-bold text-white">{sub.studentName}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        sub.status === 'Graded'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}>
                        {sub.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-400 font-medium mb-2 truncate">
                      {exam?.title || sub.examId}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono">
                      <span className="text-slate-400">
                        {sub.totalScore} / {sub.maxScore} pts ({sub.percentage}%)
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold border ${gradeBadge.color}`}>
                        {gradeBadge.grade}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Grading Workbench */}
        <div className="lg:col-span-2">
          {activeSubmission && activeExam ? (
            <div className="space-y-6 bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">

              {/* Submission Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                      GRADING WORKBENCH
                    </span>
                    <span className="text-xs font-mono text-slate-500">{activeSubmission.id}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {activeSubmission.studentName} <span className="text-slate-400 text-sm font-normal">({activeSubmission.studentId})</span>
                  </h2>
                  <p className="text-xs text-slate-400">{activeExam.title}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-mono">Calculated Score</div>
                    <div className="text-xl font-mono font-bold text-cyan-400">
                      {liveTotalScore} / {liveMaxScore} ({livePercentage}%)
                    </div>
                  </div>
                  <span className={`text-sm px-3 py-1.5 rounded-xl font-bold font-mono border ${liveGradeBadge.color}`}>
                    {liveGradeBadge.grade}
                  </span>
                </div>
              </div>

              {/* Questions List & Marking Fields */}
              <div className="space-y-6">
                {activeExam.sections.flatMap((sec) => sec.questions).map((qId, idx) => {
                  const q = QUESTION_BANK.find((qb) => qb.id === qId);
                  if (!q) return null;

                  const studentAns = activeSubmission.answers[q.id];
                  const currentScore = gradingScores[q.id] !== undefined ? gradingScores[q.id] : 0;
                  const qMaxPoints = q.points || (q.type === 'multiple-choice' ? 4 : 4);

                  return (
                    <div key={q.id} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">

                      {/* Question Header */}
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                        <span className="text-xs font-mono font-bold text-cyan-400">
                          Question {idx + 1} • {q.title} ({q.type})
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-400 font-mono">Awarded Score:</span>
                          <input
                            type="number"
                            min="0"
                            max={qMaxPoints}
                            step="0.5"
                            value={currentScore}
                            onChange={(e) => handleScoreChange(q.id, e.target.value, qMaxPoints)}
                            className="w-16 px-2 py-1 bg-slate-900 border border-purple-500/50 rounded-lg text-white font-mono text-center font-bold text-xs focus:outline-none"
                          />
                          <span className="text-xs font-mono text-slate-400">/ {qMaxPoints} pts</span>
                        </div>
                      </div>

                      {/* Prompt Snippet */}
                      <div className="text-xs text-slate-300 font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-850">
                        {q.prompt.split('\n\n')[0]}
                      </div>

                      {/* Student's Response */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-mono font-bold text-slate-400 uppercase">
                          Candidate Submission:
                        </div>
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm font-mono text-cyan-200 whitespace-pre-line">
                          {q.type === 'multiple-choice' ? (
                            studentAns !== undefined ? (
                              <span>
                                Choice {String.fromCharCode(65 + studentAns)}: {q.options[studentAns]}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">No answer provided</span>
                            )
                          ) : (
                            studentAns || <span className="text-slate-500 italic">No response</span>
                          )}
                        </div>
                      </div>

                      {/* Model Answer & Rubric for Tutor Reference */}
                      <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-900/30 text-xs space-y-2">
                        <div className="font-bold text-purple-300 flex items-center space-x-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Teacher Solution & Rubric Criteria:</span>
                        </div>
                        {q.correctAnswer !== undefined && (
                          <div className="text-slate-300">
                            <strong>Correct:</strong> Choice {String.fromCharCode(65 + q.correctAnswer)} ({q.options?.[q.correctAnswer]})
                          </div>
                        )}
                        {q.solution && (
                          <div className="text-slate-300 font-mono text-[11px] whitespace-pre-line">
                            {q.solution}
                          </div>
                        )}
                        {q.modelAnswer && (
                          <div className="text-slate-300 font-mono text-[11px] whitespace-pre-line">
                            {q.modelAnswer}
                          </div>
                        )}
                        {q.rubric && (
                          <div className="pt-2 border-t border-purple-900/40 space-y-1">
                            {q.rubric.map((r, ri) => (
                              <div key={ri} className="flex items-center justify-between text-[11px] text-purple-200">
                                <span>• {r.criterion}</span>
                                <span className="font-mono font-bold">+{r.marks}</span>
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
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <label className="block text-xs font-mono font-bold text-slate-300 uppercase">
                  Tutor Qualitative Feedback & Commendations:
                </label>
                <textarea
                  rows={3}
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Provide personalized strengths, areas for improvement, and next steps..."
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Save / Delete Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  onClick={() => handleDeleteSubmission(activeSubmission.id)}
                  className="px-4 py-2 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-400 hover:bg-rose-900/60 text-xs font-medium flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Record</span>
                </button>

                <button
                  onClick={handleSaveGrade}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white text-xs font-extrabold flex items-center space-x-2 shadow-lg shadow-purple-500/25"
                >
                  <Save className="w-4 h-4" />
                  <span>Commit Grade & Feedback</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="p-16 rounded-3xl bg-slate-900/40 border border-slate-800 text-center space-y-3">
              <Award className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-slate-300">No Submission Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select a student submission from the queue on the left to review answers and record grades.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
