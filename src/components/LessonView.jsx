import React, { useState } from 'react';
import { CURRICULUM, SUBJECTS } from '../data/curriculumData';
import MathTex from './MathTex';
import { BookOpen, Clock, CheckCircle2, AlertCircle, Maximize2, X, ChevronRight, Zap, Calculator, Cpu } from 'lucide-react';

const ICONS = {
  Calculator: Calculator,
  Zap: Zap,
  Cpu: Cpu
};

export default function LessonView({ onOpenSlide, onOpenPractice }) {
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(1); // Session 2
  const [modalImage, setModalImage] = useState(null);

  const currentSubjectObj = SUBJECTS.find(s => s.id === selectedSubject) || SUBJECTS[0];
  const sessions = CURRICULUM[selectedSubject] || [];
  const currentSession = sessions[selectedSessionIndex] || sessions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Subject Selector Tabs */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {SUBJECTS.map((sub) => {
          const isSelected = selectedSubject === sub.id;
          const Icon = ICONS[sub.icon] || BookOpen;
          return (
            <button
              key={sub.id}
              onClick={() => {
                setSelectedSubject(sub.id);
                setSelectedSessionIndex(0);
              }}
              className={`flex items-center justify-center space-x-3 p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500/50 shadow-lg shadow-cyan-500/10 text-white'
                  : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm sm:text-base">{sub.name}</div>
                <div className="text-xs text-slate-500 font-mono">{CURRICULUM[sub.id]?.length || 0} Modules Available</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Left Sidebar: Session List */}
        <div className="lg:col-span-1 space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1 font-mono">
            {currentSubjectObj.name} Sessions
          </div>
          <div className="space-y-2">
            {sessions.map((sess, idx) => {
              const isSelected = idx === selectedSessionIndex;
              return (
                <button
                  key={sess.session}
                  onClick={() => setSelectedSessionIndex(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-slate-800 to-slate-850 border-cyan-500/40 shadow-sm text-white'
                      : 'bg-slate-900/40 border-slate-800/60 text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-bold text-cyan-400">Session {sess.session}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      sess.status === 'Completed'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : sess.status === 'Ready'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}>
                      {sess.status}
                    </span>
                  </div>
                  <div className="font-medium text-sm line-clamp-2">{sess.title}</div>
                  <div className="flex items-center text-xs text-slate-500 mt-2 space-x-2">
                    <Clock className="w-3 h-3" />
                    <span>{sess.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Action Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 mt-6 space-y-3">
            <div className="text-xs font-semibold text-slate-300">Quick Actions</div>
            <button
              onClick={() => onOpenSlide && onOpenSlide(selectedSubject, currentSession.session)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
            >
              <span>Launch Slide Deck</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onOpenPractice && onOpenPractice(selectedSubject, currentSession.session)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750 transition-all"
            >
              <span>Practice Questions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Main Content Panel */}
        <div className="lg:col-span-3 space-y-6">

          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-800 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {currentSubjectObj.name.toUpperCase()} • SESSION {currentSession.session}
              </span>
              <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {currentSession.duration}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              {currentSession.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              {currentSession.overview}
            </p>

            {/* Topics Covered Chips */}
            <div className="border-t border-slate-800/80 pt-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
                Key Learning Outcomes
              </div>
              <div className="flex flex-wrap gap-2">
                {currentSession.topics?.map((topic, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{topic}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Key Formulas Section */}
          {currentSession.keyFormulas && currentSession.keyFormulas.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 shadow-lg shadow-cyan-950/20">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-sm mb-4">
                <Calculator className="w-4 h-4" />
                <span className="uppercase tracking-wider font-mono">Essential Formulas & Theorems</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentSession.keyFormulas.map((form, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center min-h-[70px]">
                    <MathTex math={form} block />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Theory Sections */}
          {currentSession.sections && currentSession.sections.length > 0 ? (
            <div className="space-y-4">
              {currentSession.sections.map((sec, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all">
                  <h2 className="text-lg font-bold text-white mb-2 text-cyan-300">{sec.heading}</h2>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 text-center py-12">
              <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Detailed notes for this upcoming session will unlock prior to class.</p>
            </div>
          )}

          {/* Diagrams Gallery */}
          {currentSession.diagrams && currentSession.diagrams.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono">
                Technical Diagrams & Schematics
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentSession.diagrams.map((diag, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 hover:border-cyan-500/50 transition-all cursor-pointer"
                    onClick={() => setModalImage(diag)}
                  >
                    <div className="aspect-video relative overflow-hidden bg-slate-900 flex items-center justify-center p-2">
                      <img
                        src={diag.src}
                        alt={diag.title}
                        className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-lg bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-1 shadow-lg">
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>View Full Diagram</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-900/90 border-t border-slate-800">
                      <div className="text-xs font-bold text-white mb-0.5">{diag.title}</div>
                      <div className="text-[11px] text-slate-400">{diag.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Diagram Zoom Modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setModalImage(null)}>
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{modalImage.title}</h3>
                <p className="text-xs text-slate-400">{modalImage.desc}</p>
              </div>
              <button
                onClick={() => setModalImage(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-slate-950 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img src={modalImage.src} alt={modalImage.title} className="max-h-[65vh] w-auto object-contain rounded-lg" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
