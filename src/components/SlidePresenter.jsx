import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SLIDE_DECKS } from '../data/slideDecks';
import { MathTex, MathText } from './MathTex';
import {
  ChevronLeft, ChevronRight, Maximize, Minimize,
  LayoutGrid, FileText, CheckCircle2, X, RotateCcw,
  Play, Pause, Clock, Code2, BookOpen, Layers,
  Search, PanelLeftClose, PanelLeft, MousePointerClick,
  Mouse, AlignJustify, MonitorPlay, Printer, ChevronsLeft, ChevronsRight
} from 'lucide-react';

export default function SlidePresenter({ initialDeckId = 'physics-2' }) {
  const [selectedDeckKey, setSelectedDeckKey] = useState(initialDeckId);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [viewMode, setViewMode] = useState('stage'); // 'stage' | 'continuous'
  const [showSidebar, setShowSidebar] = useState(true);
  const [enableWheelNav, setEnableWheelNav] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  // Presenter Timer State
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Refs for scroll sync and wheel debouncing
  const sidebarListRef = useRef(null);
  const slideItemRefs = useRef([]);
  const continuousScrollContainerRef = useRef(null);
  const wheelCooldownRef = useRef(false);
  const touchStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentDeck = SLIDE_DECKS[selectedDeckKey] || SLIDE_DECKS['physics-2'] || Object.values(SLIDE_DECKS)[0];
  const slides = currentDeck.slides || [];
  const currentSlide = slides[currentSlideIndex] || slides[0] || {};

  // Auto-scroll active thumbnail in sidebar into view
  useEffect(() => {
    if (showSidebar && sidebarListRef.current) {
      const activeEl = sidebarListRef.current.querySelector(`[data-slide-index="${currentSlideIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentSlideIndex, showSidebar]);

  const handleNext = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleSelectSlide = (idx) => {
    setCurrentSlideIndex(idx);
    if (viewMode === 'continuous') {
      const targetEl = document.getElementById(`continuous-slide-${idx}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Mouse wheel scroll to advance or reverse slides in stage view
  const handleWheel = (e) => {
    if (viewMode !== 'stage' || !enableWheelNav) return;
    if (wheelCooldownRef.current) return;

    if (Math.abs(e.deltaY) > 28) {
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      wheelCooldownRef.current = true;
      setTimeout(() => {
        wheelCooldownRef.current = false;
      }, 350);
    }
  };

  // Touch Swipe for mobile/tablets
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      };
    }
  };

  const handleTouchEnd = (e) => {
    if (viewMode !== 'stage') return;
    if (e.changedTouches && e.changedTouches[0]) {
      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Synchronize fullscreen state on native changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        handleSelectSlide(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        handleSelectSlide(slides.length - 1);
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((prev) => !prev);
      } else if (e.key === 'g' || e.key === 'G') {
        setShowGrid((prev) => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        setShowSidebar((prev) => !prev);
      } else if (e.key === 'v' || e.key === 'V') {
        setViewMode((prev) => (prev === 'stage' ? 'continuous' : 'stage'));
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
      } else if (e.key === 't' || e.key === 'T') {
        setIsTimerRunning((prev) => !prev);
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        window.print();
      } else if (e.key === 'Escape') {
        setShowGrid(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, slides.length, viewMode]);

  // Filtered decks list by subject and search query
  const deckKeys = Object.keys(SLIDE_DECKS).filter((key) => {
    const deck = SLIDE_DECKS[key];
    const matchesSubject = subjectFilter === 'all' || deck.subject === subjectFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.slides.some((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">

      {/* Top Deck Selector & Global Controls Header */}
      <div className="flex flex-col space-y-3 pb-3 border-b border-[#27272a]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">Presentation Decks</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                {Object.keys(SLIDE_DECKS).length} Decks • {slides.length} Slides in Current
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Interactive slide workbench with instant thumbnail selection, continuous scroll, speaker notes, and live math rendering.
            </p>
          </div>

          {/* Search & Subject Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search decks or slides..."
                className="pl-8 pr-3 py-1 bg-[#121215] border border-[#27272a] rounded-lg text-xs font-mono text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 w-44 sm:w-52"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Subject Filter Pills */}
            <div className="flex items-center gap-1 bg-[#121215] p-1 rounded-lg border border-[#27272a]">
              {[
                { id: 'all', label: 'All' },
                { id: 'math', label: 'Math' },
                { id: 'physics', label: 'Physics' },
                { id: 'cs', label: 'CS' }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSubjectFilter(sub.id)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                    subjectFilter === sub.id
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-medium'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* View Mode Toggle: Stage vs Continuous Scroll */}
            <div className="flex items-center bg-[#121215] p-1 rounded-lg border border-[#27272a]">
              <button
                onClick={() => setViewMode('stage')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  viewMode === 'stage'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Single Slide Presentation Mode (Key: V)"
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Presenter</span>
              </button>
              <button
                onClick={() => setViewMode('continuous')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  viewMode === 'continuous'
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Continuous Document Scroll Mode (Key: V)"
              >
                <AlignJustify className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Scroll Mode</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Deck Selector Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {deckKeys.map((key) => {
            const deck = SLIDE_DECKS[key];
            const isSelected = key === selectedDeckKey;
            const subLabel = deck.subject === 'math' ? 'MATH' : deck.subject === 'physics' ? 'PHYS' : 'CS';
            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedDeckKey(key);
                  setCurrentSlideIndex(0);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-mono whitespace-nowrap transition-all flex items-center space-x-2 shrink-0 border ${
                  isSelected
                    ? 'bg-zinc-800 text-zinc-100 border-zinc-500 shadow-sm font-semibold ring-1 ring-zinc-500/30'
                    : 'bg-[#121215] text-zinc-400 border-[#27272a] hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  deck.subject === 'math' ? 'bg-cyan-950/70 text-cyan-400 border border-cyan-800/40' :
                  deck.subject === 'physics' ? 'bg-emerald-950/70 text-emerald-400 border border-emerald-800/40' :
                  'bg-violet-950/70 text-violet-400 border border-violet-800/40'
                }`}>
                  {subLabel} {deck.session}
                </span>
                <span className="truncate max-w-[150px] sm:max-w-none">{deck.title.split(':')[1] || deck.title}</span>
              </button>
            );
          })}
          {deckKeys.length === 0 && (
            <div className="text-xs font-mono text-zinc-500 py-1.5">No presentation decks match your search query.</div>
          )}
        </div>
      </div>

      {/* Main Presentation Layout: Sidebar + Slide Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        {/* LEFT COLUMN: Scrollable Slide Selector Panel (Filmstrip Sidebar) */}
        {showSidebar && (
          <aside className="lg:col-span-4 xl:col-span-3 rounded-lg bg-[#0c0c0e] border border-[#27272a] p-3 space-y-2 flex flex-col max-h-[720px] shadow-lg sticky top-16">
            <div className="flex items-center justify-between pb-2 border-b border-[#27272a]">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                  Slides ({slides.length})
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                Click to Select
              </span>
            </div>

            {/* Scrollable list of slide cards */}
            <div
              ref={sidebarListRef}
              className="space-y-2 overflow-y-auto pr-1 flex-1 max-h-[620px] scrollbar-thin scrollbar-thumb-zinc-800"
            >
              {slides.map((s, idx) => {
                const isCurrent = idx === currentSlideIndex;
                return (
                  <button
                    key={s.id || idx}
                    data-slide-index={idx}
                    onClick={() => handleSelectSlide(idx)}
                    className={`w-full text-left p-2.5 rounded-md border transition-all flex items-start space-x-2.5 ${
                      isCurrent
                        ? 'bg-zinc-800/90 border-zinc-500 text-zinc-100 shadow-md ring-1 ring-zinc-400/20'
                        : 'bg-[#121215] border-[#27272a] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-[#18181c]'
                    }`}
                  >
                    {/* Slide Number Badge */}
                    <div className={`w-6 h-6 rounded flex items-center justify-center font-mono text-xs font-semibold shrink-0 mt-0.5 border ${
                      isCurrent
                        ? 'bg-zinc-100 text-zinc-950 border-zinc-100'
                        : 'bg-[#09090b] text-zinc-400 border-zinc-800'
                    }`}>
                      {idx + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono uppercase truncate ${isCurrent ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          {s.subtitle || `Slide ${idx + 1}`}
                        </span>
                        {isCurrent && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                        )}
                      </div>
                      <div className={`text-xs font-semibold truncate mt-0.5 ${isCurrent ? 'text-zinc-100' : 'text-zinc-300'}`}>
                        <MathText text={s.title} />
                      </div>
                      {s.points && s.points[0] && (
                        <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                          • {s.points[0].slice(0, 45)}...
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[#27272a] flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>Scroll list & click any slide</span>
              <button
                onClick={() => setEnableWheelNav(!enableWheelNav)}
                className={`hover:text-zinc-300 transition-colors flex items-center space-x-1 ${
                  enableWheelNav ? 'text-emerald-400' : 'text-zinc-500'
                }`}
                title="Toggle mouse wheel page navigation"
              >
                <Mouse className="w-3 h-3" />
                <span>Wheel Nav: {enableWheelNav ? 'ON' : 'OFF'}</span>
              </button>
            </div>
          </aside>
        )}

        {/* RIGHT COLUMN: Slide Display Stage or Continuous Flow */}
        <div className={`${showSidebar ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'} space-y-3`}>

          {/* Slide Stage Container */}
          <div
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="rounded-lg bg-[#0c0c0e] border border-[#27272a] shadow-2xl overflow-hidden flex flex-col justify-between min-h-[560px] relative transition-all"
          >

            {/* Slide Action Bar / Header */}
            <div className="px-4 sm:px-5 py-3 border-b border-[#27272a] flex flex-wrap items-center justify-between gap-2 bg-[#121215]">
              <div className="flex items-center space-x-2">
                {/* Toggle Sidebar Button */}
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-1.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-xs"
                  title="Toggle Slide List Sidebar (Key: S)"
                >
                  {showSidebar ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
                </button>

                {/* Direct Slide Jump Selector Dropdown */}
                <select
                  value={currentSlideIndex}
                  onChange={(e) => handleSelectSlide(Number(e.target.value))}
                  className="px-2.5 py-1 rounded bg-[#09090b] border border-[#27272a] text-xs font-mono font-semibold text-zinc-200 focus:outline-none focus:border-zinc-500"
                >
                  {slides.map((s, idx) => (
                    <option key={idx} value={idx}>
                      Slide {idx + 1} of {slides.length}: {s.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Center/Right Toolbar */}
              <div className="flex items-center space-x-2">
                {/* Presenter Timer */}
                <div className="flex items-center space-x-1 px-2 py-1 rounded bg-[#09090b] border border-[#27272a] text-xs font-mono text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{formatTimer(timerSeconds)}</span>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="ml-1 text-zinc-400 hover:text-zinc-100"
                    title={isTimerRunning ? 'Pause Timer (T)' : 'Start Timer (T)'}
                  >
                    {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => { setTimerSeconds(0); setIsTimerRunning(false); }}
                    className="text-zinc-500 hover:text-zinc-300 ml-0.5"
                    title="Reset Timer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Toggle Notes Button */}
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={`px-2.5 py-1 rounded text-xs font-mono border transition-all flex items-center space-x-1.5 ${
                    showNotes
                      ? 'bg-zinc-800 text-zinc-200 border-zinc-600'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                  }`}
                  title="Toggle Instructor Notes (Key: N)"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Notes (N)</span>
                </button>

                {/* Grid Overview Modal Trigger */}
                <button
                  onClick={() => setShowGrid(!showGrid)}
                  className="px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 text-xs font-mono flex items-center space-x-1.5"
                  title="Overview Grid (Key: G)"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid (G)</span>
                </button>

                {/* Print Handout Button */}
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 text-xs"
                  title="Print Slide Deck Handout (Key: P)"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>

                {/* Fullscreen Toggle */}
                <button
                  onClick={handleToggleFullscreen}
                  className="p-1.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200 text-xs"
                  title="Toggle Fullscreen (Key: F)"
                >
                  {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Clickable / Scrubbable Interactive Progress Bar */}
            <div
              className="w-full bg-zinc-800/80 h-1.5 cursor-pointer relative group hover:h-2.5 transition-all"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                const targetIdx = Math.min(Math.floor(ratio * slides.length), slides.length - 1);
                handleSelectSlide(targetIdx);
              }}
              title="Click anywhere to scrub slides"
            >
              <div
                className="bg-zinc-300 group-hover:bg-zinc-100 h-full transition-all duration-150"
                style={{ width: `${((currentSlideIndex + 1) / slides.length) * 100}%` }}
              />
              <div className="absolute right-2 top-0 -translate-y-full text-[9px] font-mono text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity">
                Scrubber: Slide {currentSlideIndex + 1}/{slides.length}
              </div>
            </div>

            {/* VIEW MODE 1: Single Slide Stage View */}
            {viewMode === 'stage' && (
              <div className="p-6 sm:p-10 flex-1 flex flex-col justify-center">
                <div className="max-w-3xl mx-auto w-full space-y-6">

                  {/* Title & Subtitle Header */}
                  <div className="border-b border-[#27272a] pb-4">
                    <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-1">
                      <span><MathText text={currentSlide.subtitle || currentDeck.subtitle} /></span>
                      <span className="text-zinc-500">
                        {currentSlideIndex + 1} of {slides.length}
                      </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 tracking-tight leading-snug">
                      <MathText text={currentSlide.title} />
                    </h1>
                  </div>

                  {/* Bullet Points */}
                  {currentSlide.points && currentSlide.points.length > 0 && (
                    <div className="space-y-3 pt-1">
                      {currentSlide.points.map((pt, i) => (
                        <div key={i} className="flex items-start space-x-3 text-zinc-200 text-base leading-relaxed">
                          <span className="text-zinc-400 mt-1 font-mono text-sm">•</span>
                          <span className="flex-1"><MathText text={pt} /></span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Code Block */}
                  {currentSlide.code && (
                    <div className="p-4 rounded-lg bg-[#09090b] border border-[#27272a] font-mono text-xs text-zinc-200 overflow-x-auto shadow-inner">
                      <pre>{currentSlide.code}</pre>
                    </div>
                  )}

                  {/* Formula Block */}
                  {currentSlide.formula && (
                    <div className="p-4 rounded-lg bg-[#121215] border border-[#27272a] my-4 shadow-sm">
                      <MathTex math={currentSlide.formula} block />
                    </div>
                  )}

                  {/* Image Diagram */}
                  {currentSlide.image && (
                    <div className="p-3 rounded-lg bg-[#121215] border border-[#27272a] my-4 flex items-center justify-center max-h-64 overflow-hidden">
                      <img
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        className="max-h-56 object-contain rounded"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* VIEW MODE 2: Continuous Document Scroll View */}
            {viewMode === 'continuous' && (
              <div
                ref={continuousScrollContainerRef}
                className="p-6 sm:p-10 space-y-10 overflow-y-auto max-h-[640px] divide-y divide-[#27272a]"
              >
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id || idx}
                    id={`continuous-slide-${idx}`}
                    className={`pt-8 first:pt-0 space-y-4 max-w-3xl mx-auto ${
                      idx === currentSlideIndex ? 'ring-1 ring-zinc-700 p-4 rounded-lg bg-[#121215]/50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-[#27272a] pb-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                          SLIDE {idx + 1} • {slide.subtitle || currentDeck.subtitle}
                        </span>
                        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">
                          <MathText text={slide.title} />
                        </h2>
                      </div>
                      <button
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`px-2.5 py-1 rounded text-xs font-mono border ${
                          idx === currentSlideIndex
                            ? 'bg-zinc-800 text-zinc-100 border-zinc-600'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        {idx === currentSlideIndex ? 'Current' : 'Select'}
                      </button>
                    </div>

                    {slide.points && (
                      <div className="space-y-2">
                        {slide.points.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-start space-x-2 text-zinc-200 text-sm">
                            <span className="text-zinc-500 font-mono">•</span>
                            <span><MathText text={pt} /></span>
                          </div>
                        ))}
                      </div>
                    )}

                    {slide.formula && (
                      <div className="p-3 rounded bg-[#121215] border border-[#27272a]">
                        <MathTex math={slide.formula} block />
                      </div>
                    )}

                    {slide.code && (
                      <div className="p-3 rounded bg-[#09090b] border border-[#27272a] font-mono text-xs text-zinc-200 overflow-x-auto">
                        <pre>{slide.code}</pre>
                      </div>
                    )}

                    {slide.notes && showNotes && (
                      <div className="p-3 rounded bg-[#18181c] border border-zinc-700 text-xs font-mono text-zinc-300">
                        <span className="font-semibold text-zinc-200">Instructor Note: </span>
                        <MathText text={slide.notes} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Presenter Speaker Notes Drawer */}
            {showNotes && currentSlide.notes && viewMode === 'stage' && (
              <div className="p-4 bg-[#121215] border-t border-[#27272a] text-zinc-300 text-xs flex items-start space-x-3 font-mono">
                <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 uppercase text-[10px] font-semibold shrink-0">
                  Instructor Note
                </span>
                <p className="leading-relaxed text-zinc-300"><MathText text={currentSlide.notes} /></p>
              </div>
            )}

            {/* Slide Footer Navigation Bar */}
            <div className="px-4 sm:px-5 py-3 border-t border-[#27272a] bg-[#121215] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSelectSlide(0)}
                  className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-xs border border-zinc-800"
                  title="First Slide (Home)"
                >
                  <ChevronsLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleSelectSlide(slides.length - 1)}
                  className="p-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all text-xs border border-zinc-800"
                  title="Last Slide (End)"
                >
                  <ChevronsRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-zinc-400 font-mono hidden md:inline">
                  [← / → / Wheel] Navigate • [S] Slide List • [N] Notes • [G] Grid
                </span>
              </div>

              {/* Bottom Nav Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePrev}
                  disabled={currentSlideIndex === 0}
                  className={`px-3 py-1.5 rounded text-xs font-mono border transition-all flex items-center space-x-1 ${
                    currentSlideIndex === 0
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-zinc-850 border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  onClick={handleNext}
                  disabled={currentSlideIndex === slides.length - 1}
                  className={`px-3.5 py-1.5 rounded text-xs font-mono border transition-all flex items-center space-x-1 ${
                    currentSlideIndex === slides.length - 1
                      ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                      : 'bg-zinc-100 border-zinc-100 text-zinc-950 font-semibold hover:bg-zinc-200'
                  }`}
                >
                  <span>{currentSlideIndex === slides.length - 1 ? 'End of Deck' : 'Next Slide'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Slide Overview Grid Modal (G) */}
      {showGrid && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setShowGrid(false)}>
          <div className="relative max-w-4xl w-full bg-[#121215] border border-zinc-700 rounded-lg p-5 overflow-hidden shadow-2xl max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-4">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Slide Deck Overview Matrix</h3>
                <p className="text-xs text-zinc-400">{currentDeck.title} ({slides.length} slides total)</p>
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
                    key={s.id || idx}
                    onClick={() => {
                      handleSelectSlide(idx);
                      setShowGrid(false);
                    }}
                    className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#18181c] border-zinc-500 text-zinc-100 ring-1 ring-zinc-400'
                        : 'bg-[#09090b] border-[#27272a] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-1.5">
                      <span>SLIDE {idx + 1}</span>
                      {isCurrent && <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-700 text-zinc-100 font-semibold">Active</span>}
                    </div>
                    <div className="font-semibold text-xs text-zinc-200 line-clamp-1 mb-0.5"><MathText text={s.title} /></div>
                    <div className="text-[11px] text-zinc-400 line-clamp-1"><MathText text={s.subtitle || ''} /></div>
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
