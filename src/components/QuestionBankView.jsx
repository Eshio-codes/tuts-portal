import React, { useState } from 'react';
import { QUESTION_BANK } from '../data/questionBank';
import MathTex from './MathTex';
import {
  HelpCircle, CheckCircle2, XCircle, ChevronDown,
  ChevronUp, RotateCcw, Award, BookOpen, Check
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#27272a]">
        <div>
          <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Problem Bank & Practice Sets</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Topic-specific questions with instant answer validation and step-by-step marking rubrics.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Subject Filter */}
          <div className="flex items-center bg-[#121215] p-1 rounded-lg border border-[#27272a]">
            {['all', 'math', 'physics', 'cs'].map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubject(sub)}
                className={`px-2.5 py-1 rounded text-xs font-mono capitalize transition-all ${
                  selectedSubject === sub
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {sub === 'cs' ? 'CS' : sub}
              </button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center bg-[#121215] p-1 rounded-lg border border-[#27272a]">
            {['all', 'Foundational', 'Intermediate', 'Exam-style'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-[#121215] border border-[#27272a] rounded-lg">
            <p className="text-zinc-400 text-xs font-mono">No practice problems match the selected filter criteria.</p>
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
                className="rounded-lg border border-[#27272a] bg-[#121215] p-5 sm:p-6 transition-all"
              >
                {/* Problem Meta Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#27272a]">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-semibold text-zinc-200">
                      Problem {qIndex + 1}
                    </span>
                    <span className="text-zinc-600 font-mono">•</span>
                    <span className="text-xs font-mono uppercase text-zinc-400">
                      {q.subject} (S{q.session})
                    </span>
                    <span className="text-zinc-600 font-mono">•</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {q.difficulty}
                    </span>
                  </div>

                  {q.points && (
                    <span className="text-xs font-mono font-semibold text-zinc-400">
                      [{q.points} Marks]
                    </span>
                  )}
                </div>

                {/* Prompt */}
                <div className="text-zinc-100 text-sm sm:text-base font-normal mb-5 leading-relaxed">
                  <div className="font-semibold text-sm text-zinc-100 mb-1">{q.title}</div>
                  {q.mathPrompt ? (
                    <div className="space-y-2">
                      <p>{q.prompt.split('\n\n')[0]}</p>
                      {q.prompt.includes('\n\n') && (
                        <MathTex math={q.prompt.split('\n\n')[1]} block />
                      )}
                    </div>
                  ) : (
                    <p className="text-zinc-200">{q.prompt}</p>
                  )}
                </div>

                {/* Answer Form */}
                <div className="mb-5">
                  {/* Type 1: Multiple Choice */}
                  {q.type === 'multiple-choice' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        const isChosen = answer === optIdx;
                        let optionStyle = 'bg-[#09090b] border-[#27272a] text-zinc-300 hover:border-zinc-700';

                        if (isSubmitted) {
                          if (optIdx === q.correctAnswer) {
                            optionStyle = 'bg-emerald-950/40 border-emerald-700 text-emerald-200 font-semibold';
                          } else if (isChosen && !isCorrect) {
                            optionStyle = 'bg-rose-950/40 border-rose-800 text-rose-300 line-through';
                          } else {
                            optionStyle = 'bg-[#09090b] border-[#27272a] text-zinc-500 opacity-60';
                          }
                        } else if (isChosen) {
                          optionStyle = 'bg-zinc-850 border-zinc-500 text-zinc-100 font-medium';
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(q.id, optIdx)}
                            className={`p-3 rounded-md border text-left flex items-center justify-between transition-all ${optionStyle}`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs font-mono font-semibold text-zinc-400">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="text-xs sm:text-sm">
                                {opt.includes('\\') ? <MathTex math={opt} /> : opt}
                              </span>
                            </div>
                            {isSubmitted && optIdx === q.correctAnswer && (
                              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {isSubmitted && isChosen && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Type 2: Numeric */}
                  {q.type === 'numeric' && (
                    <div className="max-w-xs space-y-1.5">
                      <label className="block text-xs font-mono text-zinc-400">
                        Enter numerical value {q.unit && `(${q.unit})`}:
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          step="any"
                          disabled={isSubmitted}
                          value={answer || ''}
                          onChange={(e) => handleNumericChange(q.id, e.target.value)}
                          placeholder="e.g. 11.0"
                          className="flex-1 px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-zinc-100 font-mono text-sm focus:outline-none focus:border-zinc-500"
                        />
                        {q.unit && <span className="text-xs font-mono text-zinc-400">{q.unit}</span>}
                      </div>
                    </div>
                  )}

                  {/* Type 3: Free Response */}
                  {q.type === 'free-response' && (
                    <div className="space-y-2">
                      <label className="block text-xs font-mono text-zinc-400">
                        Derivation & mathematical working:
                      </label>
                      <textarea
                        rows={4}
                        value={answer || ''}
                        onChange={(e) => handleFreeResponseChange(q.id, e.target.value)}
                        placeholder="Type mathematical proof steps or derivations..."
                        className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500"
                      />
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#27272a]">
                  <div className="flex items-center space-x-2">
                    {!isSubmitted ? (
                      <button
                        onClick={() => handleSubmitQuestion(q.id)}
                        disabled={answer === undefined || answer === ''}
                        className={`px-3.5 py-1.5 rounded-md font-mono text-xs font-medium transition-all ${
                          answer === undefined || answer === ''
                            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
                            : 'bg-zinc-100 text-zinc-950 hover:bg-zinc-200 border border-zinc-100 font-semibold'
                        }`}
                      >
                        Submit Answer
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResetQuestion(q.id)}
                        className="px-3 py-1.5 rounded-md bg-zinc-850 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-700 flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleSolution(q.id)}
                      className="px-3 py-1.5 rounded-md bg-[#09090b] border border-[#27272a] hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center space-x-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{showSol ? 'Hide Solution' : 'View Model Solution'}</span>
                      {showSol ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {isSubmitted && q.type !== 'free-response' && (
                    <div className="flex items-center space-x-2 text-xs font-mono">
                      {isCorrect ? (
                        <span className="text-emerald-400 flex items-center space-x-1 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-800/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Correct</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center space-x-1 bg-rose-950/40 px-2.5 py-1 rounded border border-rose-800/40">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Incorrect</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded Solution Drawer */}
                {showSol && (
                  <div className="mt-4 p-4 rounded-md bg-[#09090b] border border-[#27272a] space-y-3">
                    <div className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider">
                      Model Solution & Derivation
                    </div>

                    {q.explanation && (
                      <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                        {q.explanation}
                      </p>
                    )}

                    {q.solution && (
                      <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line font-mono bg-[#121215] p-3 rounded border border-[#27272a]">
                        {q.solution}
                      </div>
                    )}

                    {q.modelAnswer && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono text-zinc-400 uppercase">Model Derivation:</div>
                        <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line font-mono bg-[#121215] p-3 rounded border border-[#27272a]">
                          {q.modelAnswer}
                        </div>
                      </div>
                    )}

                    {/* Marking Scheme Checklist */}
                    {q.rubric && (
                      <div className="border-t border-[#27272a] pt-3 space-y-2">
                        <div className="text-[11px] font-mono font-semibold text-zinc-400 uppercase tracking-wider flex items-center space-x-1.5">
                          <Award className="w-3 h-3 text-zinc-400" />
                          <span>Marking Scheme</span>
                        </div>
                        <div className="space-y-1">
                          {q.rubric.map((rub, rIdx) => (
                            <div key={rIdx} className="flex items-center justify-between text-xs p-1.5 rounded bg-[#121215] border border-[#27272a]">
                              <span className="text-zinc-300 text-[11px]">• {rub.criterion}</span>
                              <span className="font-mono text-zinc-200 font-semibold text-[11px]">+{rub.marks} pts</span>
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
