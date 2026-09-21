import React, { useState, useEffect, useCallback } from 'react';
import { SLIDE_DECKS } from '../data/slideDecks';
import MathTex from './MathTex';
import {
  ChevronLeft, ChevronRight, Maximize, Minimize,
  LayoutGrid, FileText, CheckCircle2, X, Play, RotateCcw
} from 'lucide-react';

export default function SlidePresenter({ initialDeckId = 'physics-2' }) {
  const [selectedDeckKey, setSelectedDeckKey] = useState(initialDeckId);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const currentDeck = SLIDE_DECKS[selectedDeckKey] || SLIDE_DECKS['physics-2'];
  const slides = currentDeck.slides || [];
  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((prev) => !prev);
      } else if (e.key === 'g' || e.key === 'G') {
        setShowGrid((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
      } else if (e.key === 'Escape') {
        setShowGrid(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Top Deck Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Presentation Decks</h2>
          <p className="text-xs text-slate-400">Interactive slide decks for live tutoring sessions</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.keys(SLIDE_DECKS).map((key) => {
            const deck = SLIDE_DECKS[key];
            const isSelected = key === selectedDeckKey;
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedDeckKey(key);
                  setCurrentSlideIndex(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {deck.title.split(':')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Slide Viewer Canvas */}
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-2xl overflow-hidden min-h-[580px] flex flex-col justify-between">

        {/* Slide Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold text-slate-300 tracking-wider">
              SLIDE {currentSlideIndex + 1} OF {slides.length}
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-xs text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
              {currentDeck.title}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`p-2 rounded-lg text-xs font-medium border flex items-center space-x-1.5 transition-all ${
                showNotes
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              title="Toggle Presenter Speaker Notes (Key: N)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notes</span>
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200 text-xs flex items-center space-x-1.5"
              title="Overview Grid (Key: G)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200 text-xs"
              title="Toggle Fullscreen (Key: F)"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center">
          <div className="max-w-4xl mx-auto w-full space-y-6">

            {/* Title & Subtitle */}
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                {currentSlide.subtitle || currentDeck.subtitle}
              </span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {currentSlide.title}
              </h1>
            </div>

            {/* Bullet Points */}
            {currentSlide.points && currentSlide.points.length > 0 && (
              <div className="space-y-3 pt-2">
                {currentSlide.points.map((pt, i) => (
                  <div key={i} className="flex items-start space-x-3 text-slate-200 text-base sm:text-lg leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Formula Block */}
            {currentSlide.formula && (
              <div className="p-5 rounded-xl bg-slate-950/90 border border-cyan-500/30 my-4 shadow-inner">
                <MathTex math={currentSlide.formula} block />
              </div>
            )}

            {/* Image Diagram */}
            {currentSlide.image && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 my-4 flex items-center justify-center max-h-64 overflow-hidden">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="max-h-56 object-contain rounded-lg"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

          </div>
        </div>

        {/* Presenter Speaker Notes Drawer */}
        {showNotes && currentSlide.notes && (
          <div className="p-4 bg-purple-950/40 border-t border-purple-800/50 text-purple-200 text-xs sm:text-sm flex items-start space-x-3">
            <span className="px-2 py-0.5 rounded bg-purple-500/30 text-purple-300 font-mono font-bold uppercase text-[10px] shrink-0 mt-0.5">
              Teacher Note
            </span>
            <p className="leading-relaxed">{currentSlide.notes}</p>
          </div>
        )}

        {/* Slide Footer Navigation Bar */}
        <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSlideIndex(0)}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all text-xs"
              title="First Slide"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">Use [← / →] or [Space]</span>
          </div>

          {/* Progress Bar */}
          <div className="flex-1 max-w-md mx-6">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className={`p-2.5 rounded-xl border font-medium text-xs flex items-center space-x-1 transition-all ${
                currentSlideIndex === 0
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800 border-slate-700 text-white hover:bg-slate-750'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            <button
              onClick={handleNext}
              disabled={currentSlideIndex === slides.length - 1}
              className={`px-4 py-2.5 rounded-xl border font-bold text-xs flex items-center space-x-1.5 transition-all ${
                currentSlideIndex === slides.length - 1
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-cyan-500 border-cyan-400 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20'
              }`}
            >
              <span>{currentSlideIndex === slides.length - 1 ? 'End of Deck' : 'Next'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Slide Overview Grid Modal */}
      {showGrid && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowGrid(false)}>
          <div className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden shadow-2xl max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Slide Deck Overview</h3>
                <p className="text-xs text-slate-400">{currentDeck.title} ({slides.length} slides)</p>
              </div>
              <button
                onClick={() => setShowGrid(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2">
              {slides.map((s, idx) => {
                const isCurrent = idx === currentSlideIndex;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      setShowGrid(false);
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-lg'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 mb-2">
                      <span>SLIDE {idx + 1}</span>
                      {isCurrent && <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Active</span>}
                    </div>
                    <div className="font-bold text-sm text-slate-100 line-clamp-2 mb-1">{s.title}</div>
                    <div className="text-xs text-slate-400 line-clamp-2">{s.subtitle}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
