import React, { useState, useEffect, useMemo } from 'react';
import { QUESTION_BANK } from '../data/questionBank';
import { evaluateAnswer } from '../utils/gradingEngine';
import { MathTex, MathText } from './MathTex';
import {
  HelpCircle, CheckCircle2, XCircle, ChevronDown,
  ChevronUp, RotateCcw, Award, BookOpen, Check, Search, Filter,
  Star, Copy, CheckCheck, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function QuestionBankView({ defaultSubject = 'all' }) {
  const [selectedSubject, setSelectedSubject] = useState(defaultSubject);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSession, setSelectedSession] = useState('all');
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [submittedStates, setSubmittedStates] = useState({});
  const [revealedSolutions, setRevealedSolutions] = useState({});
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Load bookmarks from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('tuts_bookmarked_questions');
      if (saved) setBookmarkedIds(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleBookmark = (qId) => {
    const updated = bookmarkedIds.includes(qId)
      ? bookmarkedIds.filter(id => id !== qId)
      : [...bookmarkedIds, qId];
    setBookmarkedIds(updated);
    try {
      localStorage.setItem('tuts_bookmarked_questions', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyPrompt = (q) => {
    const text = `${q.title}\n\n${q.prompt}`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(q.id);
        setTimeout(() => setCopiedId(null), 2000);
      }).catch(() => fallbackCopy(text, q.id));
    } else {
      fallbackCopy(text, q.id);
    }
  };

  const fallbackCopy = (text, qId) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(qId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Fallback copy failed:', err);
    }
  };

  // Memoized Filter questions
  const filteredQuestions = useMemo(() => {
    return QUESTION_BANK.filter((q) => {
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (selectedType !== 'all' && q.type !== selectedType) return false;
      if (selectedSession !== 'all' && q.session !== parseInt(selectedSession, 10)) return false;
      if (onlyBookmarked && !bookmarkedIds.includes(q.id)) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = q.title.toLowerCase().includes(query);
        const matchPrompt = q.prompt.toLowerCase().includes(query);
        if (!matchTitle && !matchPrompt) return false;
      }
      return true;
    });
  }, [selectedSubject, selectedDifficulty, selectedType, selectedSession, onlyBookmarked, bookmarkedIds, searchQuery]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject, selectedDifficulty, selectedType, selectedSession, onlyBookmarked, searchQuery, pageSize]);

  // Memoized Performance stats for filtered view
  const { totalInView, submittedCount, correctCount, evaluationsMap } = useMemo(() => {
    let subCount = 0;
    let corCount = 0;
    const evals = {};

    filteredQuestions.forEach((q) => {
      if (submittedStates[q.id]) {
        subCount++;
        const res = evaluateAnswer(q, userAnswers[q.id]);
        evals[q.id] = res;
        if (res.isCorrect === true) {
          corCount++;
        }
      }
    });

    return {
      totalInView: filteredQuestions.length,
      submittedCount: subCount,
      correctCount: corCount,
      evaluationsMap: evals
    };
  }, [filteredQuestions, submittedStates, userAnswers]);

  // Pagination slicing
  const numericPageSize = pageSize === 'all' ? filteredQuestions.length : Number(pageSize);
  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(filteredQuestions.length / numericPageSize));
  const startIndex = (currentPage - 1) * numericPageSize;
  const endIndex = Math.min(startIndex + numericPageSize, filteredQuestions.length);

  const displayedQuestions = useMemo(() => {
    if (pageSize === 'all') return filteredQuestions;
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, pageSize, startIndex, endIndex]);

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

  const handleResetAll = () => {
    setUserAnswers({});
    setSubmittedStates({});
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
      <div className="flex flex-col space-y-4 pb-4 border-b border-[#27272a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">Problem Bank & Practice Sets</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Topic-specific questions with instant answer validation and step-by-step marking rubrics.</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setOnlyBookmarked(!onlyBookmarked)}
              className={`px-2.5 py-1.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-all border ${
                onlyBookmarked
                  ? 'bg-amber-950/40 text-amber-300 border-amber-800'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
              title="Show only bookmarked problems"
            >
              <Star className={`w-3 h-3 ${onlyBookmarked ? 'fill-amber-400 text-amber-400' : 'text-zinc-400'}`} />
              <span>Bookmarks ({bookmarkedIds.length})</span>
            </button>

            {submittedInView.length > 0 && (
              <button
                onClick={handleResetAll}
                className="px-2.5 py-1.5 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-mono flex items-center space-x-1.5 transition-all"
                title="Reset answers in this view"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Practice Set</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Search box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problem title or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#121215] border border-[#27272a] rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Subject Filter */}
            <div className="flex items-center bg-[#121215] p-1 rounded-lg border border-[#27272a]">
              {[
                { id: 'all', label: 'All' },
                { id: 'math', label: 'Math' },
                { id: 'physics', label: 'Physics' },
                { id: 'cs', label: 'CS' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    selectedSubject === sub.id
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {sub.label}
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

            {/* Question Type Filter */}
            <div className="flex items-center bg-[#121215] p-1 rounded-lg border border-[#27272a] hidden md:flex">
              {[
                { id: 'all', label: 'All Types' },
                { id: 'multiple-choice', label: 'MCQ' },
                { id: 'numeric', label: 'Numeric' },
                { id: 'free-response', label: 'Derivation' }
              ].map((tp) => (
                <button
                  key={tp.id}
                  onClick={() => setSelectedType(tp.id)}
                  className={`px-2 py-1 rounded text-xs font-mono transition-all ${
                    selectedType === tp.id
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Score Tracker Ledger */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3.5 py-2 rounded-lg bg-[#121215] border border-[#27272a] text-xs font-mono text-zinc-400">
          <div className="flex items-center space-x-4">
            <div>
              <span className="text-zinc-500 mr-1.5">Total Problems:</span>
              <span className="text-zinc-200 font-semibold">{totalInView}</span>
            </div>
            <div>
              <span className="text-zinc-500 mr-1.5">Attempted:</span>
              <span className="text-zinc-200 font-semibold">{submittedCount}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <span className="text-zinc-500 mr-1.5">Correct:</span>
              <span className="text-emerald-400 font-semibold">{correctCount}</span>
            </div>
            {submittedCount > 0 && (
              <div>
                <span className="text-zinc-500 mr-1.5">Accuracy:</span>
                <span className="text-zinc-100 font-semibold">
                  {Math.round((correctCount / (submittedCount || 1)) * 100)}%
                </span>
              </div>
            )}
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
          displayedQuestions.map((q, qIndex) => {
            const isSubmitted = submittedStates[q.id];
            const answer = userAnswers[q.id];
            const showSol = revealedSolutions[q.id];
            const isBookmarked = bookmarkedIds.includes(q.id);

            let isCorrect = false;
            if (isSubmitted) {
              const evalResult = evaluationsMap[q.id] || evaluateAnswer(q, answer);
              isCorrect = evalResult.isCorrect === true;
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
                      Problem {startIndex + qIndex + 1}
                    </span>
                    <span className="text-zinc-600 font-mono">•</span>
                    <span className="text-xs font-mono uppercase text-zinc-400">
                      {q.subject} (S{q.session})
                    </span>
                    <span className="text-zinc-600 font-mono">•</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {q.difficulty}
                    </span>
                    <span className="text-zinc-600 font-mono hidden sm:inline">•</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800 text-zinc-500 hidden sm:inline">
                      {q.type === 'multiple-choice' ? 'Multiple Choice' : q.type === 'numeric' ? 'Numeric Entry' : 'Free Response'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyPrompt(q)}
                      className="p-1 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
                      title="Copy problem statement"
                    >
                      {copiedId === q.id ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => toggleBookmark(q.id)}
                      className={`p-1 rounded border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-950/50 text-amber-300 border-amber-700'
                          : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark problem'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
                    </button>
                    {q.points && (
                      <span className="text-xs font-mono font-semibold text-zinc-400">
                        [{q.points} Marks]
                      </span>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                <div className="text-zinc-100 text-sm sm:text-base font-normal mb-5 leading-relaxed">
                  <div className="font-semibold text-sm text-zinc-100 mb-1"><MathText text={q.title} /></div>
                  <div className="text-zinc-200">
                    <MathText text={q.prompt} />
                  </div>
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
                                <MathText text={opt} />
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
                        disabled={isSubmitted}
                        value={answer || ''}
                        onChange={(e) => handleFreeResponseChange(q.id, e.target.value)}
                        placeholder="Type mathematical proof steps or derivations..."
                        className="w-full px-3 py-2 bg-[#09090b] border border-[#27272a] rounded-md text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-500 disabled:opacity-60 disabled:cursor-not-allowed"
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
                      <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                        <MathText text={q.explanation} />
                      </div>
                    )}

                    {q.solution && (
                      <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line font-mono bg-[#121215] p-3 rounded border border-[#27272a]">
                        <MathText text={q.solution} />
                      </div>
                    )}

                    {q.modelAnswer && (
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-mono text-zinc-400 uppercase">Model Derivation:</div>
                        <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line font-mono bg-[#121215] p-3 rounded border border-[#27272a]">
                          <MathText text={q.modelAnswer} />
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
                              <span className="text-zinc-300 text-[11px]">• <MathText text={rub.criterion} /></span>
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

      {/* Pagination Controls */}
      {filteredQuestions.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#121215] border border-[#27272a] text-xs font-mono">
          <div className="flex items-center space-x-2 text-zinc-400">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-[#09090b] border border-[#27272a] rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-zinc-500"
            >
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value="all">All ({filteredQuestions.length})</option>
            </select>
            <span className="text-zinc-500">
              Showing {filteredQuestions.length === 0 ? 0 : startIndex + 1}–{endIndex} of {filteredQuestions.length}
            </span>
          </div>

          {pageSize !== 'all' && totalPages > 1 && (
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded border flex items-center space-x-1 transition-all ${
                  currentPage === 1
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-[#09090b] border-[#27272a] text-zinc-300 hover:text-zinc-100 hover:border-zinc-600'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <span className="px-2 text-zinc-300">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded border flex items-center space-x-1 transition-all ${
                  currentPage === totalPages
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                    : 'bg-[#09090b] border-[#27272a] text-zinc-300 hover:text-zinc-100 hover:border-zinc-600'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
