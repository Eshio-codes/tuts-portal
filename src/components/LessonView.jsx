import React, { useState } from 'react';
import { CURRICULUM, SUBJECTS } from '../data/curriculumData';
import { COURSE_MATERIALS } from '../data/materialsData';
import { MathTex, MathText } from './MathTex';
import {
  BookOpen, Clock, CheckCircle2, AlertCircle, Maximize2, X,
  ChevronRight, ChevronLeft, Zap, Calculator, Cpu, Printer, Search, ArrowRight,
  Download, FileText, ExternalLink, Eye
} from 'lucide-react';

const ICONS = {
  Calculator: Calculator,
  Zap: Zap,
  Cpu: Cpu
};

export default function LessonView() {
  const [selectedSubject, setSelectedSubject] = useState('physics');
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(1); // Session 2
  const [searchQuery, setSearchQuery] = useState('');
  const [modalImage, setModalImage] = useState(null);

  const currentSubjectObj = SUBJECTS.find(s => s.id === selectedSubject) || SUBJECTS[0];
  const allSessions = CURRICULUM[selectedSubject] || [];

  const filteredSessions = allSessions.filter(s => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.title.toLowerCase().includes(q) ||
      (s.topics && s.topics.some(t => t.toLowerCase().includes(q))) ||
      (s.overview && s.overview.toLowerCase().includes(q));
  });

  const currentSession = allSessions[selectedSessionIndex] || allSessions[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

      {/* Subject Header & Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#27272a] mb-6 print:hidden">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">Curriculum & Course Notes</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Formal STEM lecture notes, mathematical derivations, and schematics.</p>
        </div>

        {/* Minimalist Segmented Subject Switcher */}
        <div className="flex items-center bg-[#121215] p-1 rounded-lg border border-[#27272a] self-start sm:self-auto">
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
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/40'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-zinc-200' : 'text-zinc-500'}`} />
                <span>{sub.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Sidebar: Session Table of Contents (3-4 cols) */}
        <div className="lg:col-span-4 space-y-4 print:hidden">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${currentSubjectObj.name} topics...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#121215] border border-[#27272a] rounded-lg text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              {currentSubjectObj.name} Modules
            </span>
            <span className="text-[11px] font-mono text-zinc-500">
              {filteredSessions.length} Units
            </span>
          </div>

          <div className="space-y-1.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredSessions.map((sess) => {
              const actualIdx = allSessions.findIndex(s => s.session === sess.session);
              const isSelected = actualIdx === selectedSessionIndex;
              return (
                <button
                  key={sess.session}
                  onClick={() => setSelectedSessionIndex(actualIdx)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-[#18181c] border-zinc-600 text-zinc-100'
                      : 'bg-[#121215]/60 border-[#27272a] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold text-zinc-300">Unit {String(sess.session).padStart(2, '0')}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                      sess.status === 'Completed'
                        ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                        : sess.status === 'Ready'
                        ? 'bg-sky-950/40 text-sky-400 border-sky-800/40'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-750'
                    }`}>
                      {sess.status}
                    </span>
                  </div>
                  <div className="font-medium text-xs text-zinc-200 line-clamp-1"><MathText text={sess.title} /></div>
                  <div className="flex items-center text-[11px] text-zinc-500 mt-1 space-x-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{sess.duration}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Module Metadata Box */}
          <div className="p-3.5 rounded-lg bg-[#121215] border border-[#27272a] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Module Summary
              </span>
              <button
                onClick={handlePrint}
                className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 hover:text-zinc-100 flex items-center space-x-1"
                title="Print or export current lecture handout as PDF"
              >
                <Printer className="w-2.5 h-2.5" />
                <span>Print Notes</span>
              </button>
            </div>
            <div className="text-xs text-zinc-400 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Subject:</span>
                <span className="text-zinc-200">{currentSubjectObj.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="text-zinc-200">{currentSession.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-zinc-200">{currentSession.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Main Content Document (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* Document Header Panel */}
          <div className="p-6 rounded-lg bg-[#121215] border border-[#27272a]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 font-mono text-xs text-zinc-400">
                <span>{currentSubjectObj.name.toUpperCase()}</span>
                <span>/</span>
                <span>SESSION {currentSession.session}</span>
              </div>
              <span className="text-xs font-mono text-zinc-500">{currentSession.duration}</span>
            </div>

            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mb-2">
              <MathText text={currentSession.title} />
            </h1>

            <div className="text-zinc-300 text-sm leading-relaxed mb-5">
              <MathText text={currentSession.overview} />
            </div>

            {/* Learning Outcomes */}
            {currentSession.topics && (
              <div className="border-t border-[#27272a] pt-4">
                <div className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Key Concepts & Competencies
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSession.topics.map((topic, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded bg-[#18181c] text-zinc-300 border border-[#27272a] flex items-center space-x-1.5">
                      <span className="w-1 h-1 rounded-full bg-zinc-400"></span>
                      <span><MathText text={topic} /></span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Key Formulas Section */}
          {currentSession.keyFormulas && currentSession.keyFormulas.length > 0 && (
            <div className="p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-3">
              <div className="flex items-center space-x-2 text-zinc-300 font-mono text-xs font-semibold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5 text-zinc-400" />
                <span>Reference Formulas & Standard Forms</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentSession.keyFormulas.map((form, idx) => (
                  <div key={idx} className="p-3 rounded bg-[#09090b] border border-[#27272a] flex items-center justify-center min-h-[55px]">
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
                <div key={idx} className="p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-2">
                  <h2 className="text-sm font-semibold text-zinc-100 flex items-center space-x-2">
                    <span className="font-mono text-zinc-500">§ {currentSession.session}.{idx + 1}</span>
                    <span><MathText text={sec.heading} /></span>
                  </h2>
                  <div className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                    <MathText text={sec.content} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-lg bg-[#121215] border border-[#27272a] text-center">
              <AlertCircle className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
              <p className="text-zinc-400 text-xs">Lecture notes for this upcoming session are currently being compiled.</p>
            </div>
          )}

          {/* Technical Diagrams */}
          {currentSession.diagrams && currentSession.diagrams.length > 0 && (
            <div className="p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300">
                Technical Diagrams & Circuit Schematics
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentSession.diagrams.map((diag, idx) => (
                  <div
                    key={idx}
                    className="group rounded-lg overflow-hidden border border-[#27272a] bg-[#09090b] hover:border-zinc-600 transition-all cursor-pointer"
                    onClick={() => setModalImage(diag)}
                  >
                    <div className="aspect-video relative overflow-hidden bg-[#09090b] flex items-center justify-center p-3">
                      <img
                        src={diag.src}
                        alt={diag.title}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-[#09090b]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-2.5 py-1 rounded bg-zinc-800 text-zinc-200 text-xs font-mono flex items-center space-x-1.5 border border-zinc-700">
                          <Maximize2 className="w-3 h-3" />
                          <span>Expand</span>
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-[#121215] border-t border-[#27272a]">
                      <div className="text-xs font-medium text-zinc-200"><MathText text={diag.title} /></div>
                      <div className="text-[11px] text-zinc-400 mt-0.5"><MathText text={diag.desc} /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course Handouts & Downloadable Materials */}
          {(() => {
            const subjectMaterials = COURSE_MATERIALS.filter(
              (m) => m.subject === selectedSubject || m.subject === 'general'
            );
            if (subjectMaterials.length === 0) return null;

            return (
              <div className="p-5 rounded-lg bg-[#121215] border border-[#27272a] space-y-4 print:hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-200">
                      Official Handouts & Course Downloads
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {subjectMaterials.length} Documents Available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjectMaterials.map((mat) => (
                    <div
                      key={mat.id}
                      className="p-3 rounded-lg bg-[#09090b] border border-[#27272a] hover:border-zinc-600 transition-all flex flex-col justify-between space-y-2.5"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-semibold border border-zinc-700">
                            {mat.fileType}
                          </span>
                          <span className="text-[10px] font-mono text-zinc-500">{mat.fileSize}</span>
                        </div>
                        <h4 className="text-xs font-semibold text-zinc-200 leading-snug">
                          {mat.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
                          {mat.description}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t border-[#27272a]/60">
                        <a
                          href={mat.downloadUrl}
                          download={mat.fileName}
                          className="flex-1 px-2.5 py-1 rounded bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-mono font-semibold flex items-center justify-center space-x-1.5 transition-all"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download</span>
                        </a>
                        {mat.fileType === 'PDF' && (
                          <a
                            href={mat.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded bg-[#18181c] hover:bg-zinc-800 text-zinc-300 border border-[#27272a] text-xs font-mono flex items-center space-x-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Bottom Pagination & Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-[#27272a] print:hidden">
            <button
              onClick={() => setSelectedSessionIndex(Math.max(0, selectedSessionIndex - 1))}
              disabled={selectedSessionIndex === 0}
              className={`px-3 py-1.5 rounded-md text-xs font-mono flex items-center space-x-1.5 border transition-all ${
                selectedSessionIndex === 0
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-[#121215] border-[#27272a] text-zinc-300 hover:text-zinc-100 hover:border-zinc-600'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Unit</span>
            </button>

            <span className="text-xs font-mono text-zinc-500">
              Unit {selectedSessionIndex + 1} of {allSessions.length}
            </span>

            <button
              onClick={() => setSelectedSessionIndex(Math.min(allSessions.length - 1, selectedSessionIndex + 1))}
              disabled={selectedSessionIndex === allSessions.length - 1}
              className={`px-3 py-1.5 rounded-md text-xs font-mono flex items-center space-x-1.5 border transition-all ${
                selectedSessionIndex === allSessions.length - 1
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-600 cursor-not-allowed'
                  : 'bg-[#121215] border-[#27272a] text-zinc-300 hover:text-zinc-100 hover:border-zinc-600'
              }`}
            >
              <span>Next Unit</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Diagram Zoom Lightbox Modal */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 print:hidden" onClick={() => setModalImage(null)}>
          <div className="relative max-w-4xl w-full bg-[#121215] rounded-lg border border-zinc-700 overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-[#27272a]">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100"><MathText text={modalImage.title} /></h3>
                <p className="text-xs text-zinc-400"><MathText text={modalImage.desc} /></p>
              </div>
              <button
                onClick={() => setModalImage(null)}
                className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 bg-[#09090b] flex items-center justify-center max-h-[75vh] overflow-auto">
              <img src={modalImage.src} alt={modalImage.title} className="max-h-[65vh] w-auto object-contain rounded" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
