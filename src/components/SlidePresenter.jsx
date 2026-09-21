import React, { useState, useEffect, useCallback } from 'react';
import { SLIDE_DECKS } from '../data/slideDecks';
import MathTex from './MathTex';
import {
  ChevronLeft, ChevronRight, Maximize, Minimize,
  LayoutGrid, FileText, CheckCircle2, X, RotateCcw
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">

      {/* Top Deck Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27272a]">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">Presentation Decks</h2>
          <p className="text-xs text-zinc-400">Structured visual slide sequences for live instruction.</p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-[#121215] p-1 rounded-lg border border-[#27272a]">
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
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-750 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {deck.title.split(':')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Slide Viewer Canvas */}
      <div className="rounded-lg bg-[#0c0c0e] border border-[#27272a] shadow-xl overflow-hidden min-h-[540px] flex flex-col justify-between">

        {/* Slide Header Bar */}
        <div className="px-5 py-3 border-b border-[#27272a] flex items-center justify-between bg-[#121215]">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-semibold text-zinc-300">
              SLIDE {currentSlideIndex + 1} / {slides.length}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-xs text-zinc-400 truncate max-w-sm">
              {currentDeck.title}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-2.5 py-1 rounded text-xs font-mono border transition-all flex items-center space-x-1.5 ${
                showNotes
                  ? 'bg-zinc-800 text-zinc-200 border-zinc-600'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
              title="Toggle Presenter Speaker Notes (Key: N)"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Notes (N)</span>
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 text-xs font-mono flex items-center space-x-1.5"
              title="Overview Grid (Key: G)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid (G)</span>
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 text-xs"
              title="Toggle Fullscreen (Key: F)"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Slide Body */}
        <div className="p-8 sm:p-12 flex-1 flex flex-col justify-center">
          <div className="max-w-3xl mx-auto w-full space-y-6">

            {/* Title & Subtitle */}
            <div className="border-b border-[#27272a] pb-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
                {currentSlide.subtitle || currentDeck.subtitle}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight">
                {currentSlide.title}
              </h1>
            </div>

            {/* Bullet Points */}
            {currentSlide.points && currentSlide.points.length > 0 && (
              <div className="space-y-3 pt-1">
                {currentSlide.points.map((pt, i) => (
                  <div key={i} className="flex items-start space-x-3 text-zinc-200 text-base leading-relaxed">
                    <span className="text-zinc-400 mt-1 font-mono text-sm">•</span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Formula Block */}
            {currentSlide.formula && (
              <div className="p-4 rounded bg-[#121215] border border-[#27272a] my-4">
                <MathTex math={currentSlide.formula} block />
              </div>
            )}

            {/* Image Diagram */}
            {currentSlide.image && (
              <div className="p-3 rounded bg-[#121215] border border-[#27272a] my-4 flex items-center justify-center max-h-60 overflow-hidden">
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="max-h-52 object-contain rounded"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}

          </div>
        </div>

        {/* Presenter Speaker Notes Drawer */}
        {showNotes && currentSlide.notes && (
          <div className="p-4 bg-[#121215] border-t border-[#27272a] text-zinc-300 text-xs flex items-start space-x-3 font-mono">
            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase text-[10px] font-semibold shrink-0">
              Instructor Note
            </span>
            <p className="leading-relaxed text-zinc-300">{currentSlide.notes}</p>
          </div>
        )}

        {/* Slide Footer Navigation Bar */}
        <div className="px-5 py-3 border-t border-[#27272a] bg-[#121215] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentSlideIndex(0)}
              className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-xs"
              title="First Slide"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] text-zinc-400 font-mono hidden sm:inline">Use [← / →] to navigate</span>
          </div>

          {/* Progress Indicator */}
          <div className="flex-1 max-w-xs mx-4">
            <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
              <div
                className="bg-zinc-300 h-full rounded-full transition-all duration-200"
                style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
                currentSlideIndex === 0
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-850 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentSlideIndex === slides.length - 1}
              className={`px-3 py-1.5 rounded text-xs font-mono border transition-all ${
                currentSlideIndex === slides.length - 1
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-zinc-100 border-zinc-100 text-zinc-950 font-semibold hover:bg-zinc-200'
              }`}
            >
              {currentSlideIndex === slides.length - 1 ? 'Deck End' : 'Next'}
            </button>
          </div>
        </div>

      </div>

      {/* Slide Overview Grid Modal */}
      {showGrid && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowGrid(false)}>
          <div className="relative max-w-4xl w-full bg-[#121215] border border-zinc-700 rounded-lg p-5 overflow-hidden shadow-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Slide Deck Index</h3>
                <p className="text-xs text-zinc-400">{currentDeck.title} ({slides.length} slides)</p>
              </div>
              <button
                onClick={() => setShowGrid(false)}
                className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 overflow-y-auto pr-1">
              {slides.map((s, idx) => {
                const isCurrent = idx === currentSlideIndex;
                return (
                  <div
                    key={s.id}
                    onClick={() => {
                      setCurrentSlideIndex(idx);
                      setShowGrid(false);
                    }}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#18181c] border-zinc-500 text-zinc-100'
                        : 'bg-[#09090b] border-[#27272a] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1.5">
                      <span>SLIDE {idx + 1}</span>
                      {isCurrent && <span className="text-[10px] px-1 rounded bg-zinc-800 text-zinc-200">Active</span>}
                    </div>
                    <div className="font-semibold text-xs text-zinc-200 line-clamp-1 mb-0.5">{s.title}</div>
                    <div className="text-[11px] text-zinc-400 line-clamp-1">{s.subtitle}</div>
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
