import React, { useState } from 'react';
import { QUESTION_BANK } from '../data/questionBank';
import MathTex from './MathTex';
import {
  HelpCircle, CheckCircle2, XCircle, ChevronDown,
  ChevronUp, RotateCcw, Sparkles, Filter, Award, BookOpen
} from 'lucide-react';

export default function QuestionBankView({ defaultSubject = 'all' }) {
  const [selectedSubject, setSelectedSubject] = useState(defaultSubject);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedStates, setSubmittedStates] = useState({});
  const [revealedSolutions, setRevealedSolutions] = useState({});

  // Filter questions
  const filteredQuestions = QUESTION_BANK.filter((q) => {
    if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const handleSelectOption = (qId, optionIdx) => {
    if (submittedStates[qId]) return;
    setUserAnswers({ ...userAnswers, [qId]: optionIdx });
  };

  const handleNumericChange = (qId, val) => {
    if (submittedStates[qId]) return;
    setUserAnswers({ ...userAnswers, [qId]: val });
  };

  const handleFreeResponseChange = (qId, val) => {
    setUserAnswers({ ...userAnswers, [qId]: val });
  };

  const handleSubmitQuestion = (qId) => {
    setSubmittedStates({ ...submittedStates, [qId]: true });
  };

  const handleResetQuestion = (qId) => {
    const newAnswers = { ...userAnswers };
    delete newAnswers[qId];
    const newSubmitted = { ...submittedStates };
    delete newSubmitted[qId];
    setUserAnswers(newAnswers);
    setSubmittedStates(newSubmitted);
  };

  const toggleSolution = (qId) => {
    setRevealedSolutions({
      ...revealedSolutions,
      [qId]: !revealedSolutions[qId]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-slate-900/80 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-2">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <span>Interactive Question Bank</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Filter and practice questions with instant automated validation and step-by-step marking rubrics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Subject Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['all', 'math', 'physics', 'cs'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  selectedSubject === sub
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sub === 'cs' ? 'CS' : sub}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['all', 'Foundational', 'Intermediate', 'Exam-style'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">No questions found matching the selected filters.</p>
          </div>
        ) : (
          filteredQuestions.map((q, qIndex) => {
            const isSubmitted = submittedStates[q.id];
            const answer = userAnswers[q.id];
            const showSol = revealedSolutions[q.id];

            let isCorrect = false;
            if (isSubmitted) {
              if (q.type === 'multiple-choice') {
                isCorrect = answer === q.correctAnswer;
              } else if (q.type === 'numeric') {
                const numericVal = parseFloat(answer);
                isCorrect = !isNaN(numericVal) && Math.abs(numericVal - q.correctAnswer) <= (q.tolerance || 0.01);
              }
            }

            return (
              <div
                key={q.id}
                className={`rounded-2xl border transition-all p-6 sm:p-8 ${
                  isSubmitted
                    ? isCorrect
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : q.type === 'free-response'
                      ? 'bg-slate-900 border-purple-500/40'
                      : 'bg-rose-950/20 border-rose-500/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Card Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                      Q{qIndex + 1} • {q.subject.toUpperCase()} (S{q.session})
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      q.difficulty === 'Foundational'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : q.difficulty === 'Intermediate'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    }`}>
                      {q.difficulty}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                      {q.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>

                  {q.points && (
                    <span className="text-xs font-mono font-bold text-purple-400">
                      [{q.points} Marks]
                    </span>
                  )}
                </div>

                {/* Prompt */}
                <div className="text-white text-base sm:text-lg font-medium mb-6 leading-relaxed">
                  <div className="font-bold text-sm text-cyan-300 mb-1">{q.title}</div>
                  {q.mathPrompt ? (
                    <div className="space-y-2">
                      <p>{q.prompt.split('\n\n')[0]}</p>
                      {q.prompt.includes('\n\n') && (
                        <MathTex math={q.prompt.split('\n\n')[1]} block />
                      )}
                    </div>
                  ) : (
                    <p>{q.prompt}</p>
                  )}
                </div>

                {/* Interactive Answer Form */}
                <div className="mb-6">
                  {/* Type 1: Multiple Choice */}
                  {q.type === 'multiple-choice' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = answer === optIdx;
                        let optionStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850';

                        if (isSubmitted) {
                          if (optIdx === q.correctAnswer) {
                            optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                          } else if (isChosen && !isCorrect) {
                            optionStyle = 'bg-rose-950/60 border-rose-500 text-rose-200 font-bold line-through';
                          } else {
                            optionStyle = 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-60';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-medium shadow-md shadow-cyan-500/10';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${optionStyle}`}
                          >
                            <div className="flex items-center space-x-3">
                              <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-400">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="text-sm">
                                {opt.includes('\\') ? <MathTex math={opt} /> : opt}
                              </span>
                            </div>
                            {isSubmitted && optIdx === q.correctAnswer && (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            )}
                            {isSubmitted && isChosen && !isCorrect && (
                              <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Type 2: Numeric */}
                  {q.type === 'numeric' && (
                    <div className="max-w-md">
                      <label className="block text-xs font-mono text-slate-400 mb-2">
                        Enter numerical value {q.unit && `(${q.unit})`}:
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="number"
                          step="any"
                          disabled={isSubmitted}
                          value={answer || ''}
                          onChange={(e) => handleNumericChange(q.id, e.target.value)}
                          placeholder="e.g. 11.0"
                          className="flex-1 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                        />
                        {q.unit && <span className="text-sm font-mono text-slate-400">{q.unit}</span>}
                      </div>
                    </div>
                  )}

                  {/* Type 3: Free Response */}
                  {q.type === 'free-response' && (
                    <div className="space-y-3">
                      <label className="block text-xs font-mono text-slate-400">
                        Type your full mathematical derivation or solution:
                      </label>
                      <textarea
                        rows={4}
                        value={answer || ''}
                        onChange={(e) => handleFreeResponseChange(q.id, e.target.value)}
                        placeholder="Show equations, substitutions, and final statement..."
                        className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}
                </div>

                {/* Actions & Result Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    {!isSubmitted ? (
                      <button
                        onClick={() => handleSubmitQuestion(q.id)}
                        disabled={answer === undefined || answer === ''}
                        className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition-all ${
                          answer === undefined || answer === ''
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md shadow-cyan-500/20'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Check Answer</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResetQuestion(q.id)}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium flex items-center space-x-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Try Again</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleSolution(q.id)}
                      className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-slate-200 text-xs font-medium flex items-center space-x-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{showSol ? 'Hide Full Solution' : 'View Model Solution'}</span>
                      {showSol ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {isSubmitted && q.type !== 'free-response' && (
                    <div className="flex items-center space-x-2 text-xs font-bold font-mono">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center space-x-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Correct (+100%)</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center space-x-1 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/30">
                          <XCircle className="w-4 h-4" />
                          <span>Incorrect. Review solution below.</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded Solution / Rubric Drawer */}
                {showSol && (
                  <div className="mt-6 p-6 rounded-xl bg-slate-950 border border-slate-800/80 space-y-4">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" />
                      <span>Step-by-Step Mathematical Solution</span>
                    </div>

                    {q.explanation && (
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {q.explanation}
                      </p>
                    )}

                    {q.solution && (
                      <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line font-mono bg-slate-900 p-4 rounded-lg border border-slate-800">
                        {q.solution}
                      </div>
                    )}

                    {q.modelAnswer && (
                      <div className="space-y-2">
                        <div className="text-xs font-mono font-bold text-purple-400">Model Answer:</div>
                        <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-mono bg-slate-900 p-4 rounded-lg border border-slate-800">
                          {q.modelAnswer}
                        </div>
                      </div>
                    )}

                    {/* Marking Rubric Checklist for Free-Response */}
                    {q.rubric && (
                      <div className="border-t border-slate-800 pt-4 space-y-2">
                        <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                          <Award className="w-3.5 h-3.5 text-purple-400" />
                          <span>Marking Scheme & Rubric</span>
                        </div>
                        <div className="space-y-1.5">
                          {q.rubric.map((rub, rIdx) => (
                            <div key={rIdx} className="flex items-center justify-between text-xs p-2 rounded bg-slate-900/60 border border-slate-800/60">
                              <span className="text-slate-300">{rub.criterion}</span>
                              <span className="font-mono font-bold text-purple-300 ml-2">+{rub.marks} pts</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
