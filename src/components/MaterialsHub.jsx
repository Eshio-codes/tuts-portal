import React, { useState, useEffect } from 'react';
import { COURSE_MATERIALS } from '../data/materialsData';
import { MathTex, MathText } from './MathTex';
import {
  Download, FileText, Presentation, FileCode, Search, Filter,
  Eye, CheckCircle2, BookOpen, ExternalLink, Calculator, Zap, Cpu,
  Sparkles, Layers, ShieldCheck, ArrowRight, X, Printer, Wifi, WifiOff
} from 'lucide-react';

export default function MaterialsHub({ onNavigate }) {
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const subjects = [
    { id: 'all', label: 'All Subjects', icon: Layers },
    { id: 'general', label: 'Master Syllabus', icon: BookOpen },
    { id: 'math', label: 'Mathematics', icon: Calculator },
    { id: 'physics', label: 'Physics', icon: Zap },
    { id: 'cs', label: 'Computer Science', icon: Cpu }
  ];

  const fileTypes = [
    { id: 'all', label: 'All Formats' },
    { id: 'PDF', label: 'PDF Handouts' },
    { id: 'PPTX', label: 'PPTX Slide Decks' },
    { id: 'DOCX', label: 'DOCX Derivations' }
  ];

  const filteredMaterials = COURSE_MATERIALS.filter((mat) => {
    // Subject filter
    if (selectedSubject !== 'all' && mat.subject !== selectedSubject) return false;
    // Type filter
    if (selectedType !== 'all' && mat.fileType !== selectedType) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = mat.title.toLowerCase().includes(q);
      const matchDesc = mat.description.toLowerCase().includes(q);
      const matchFile = mat.fileName.toLowerCase().includes(q);
      const matchTags = mat.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchFile && !matchTags) return false;
    }
    return true;
  });

  const getFormatBadgeStyle = (type) => {
    switch (type) {
      case 'PDF':
        return 'bg-rose-950/40 text-rose-300 border-rose-800/50';
      case 'PPTX':
        return 'bg-amber-950/40 text-amber-300 border-amber-800/50';
      case 'DOCX':
        return 'bg-sky-950/40 text-sky-300 border-sky-800/50';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  const getSubjectColor = (subj) => {
    switch (subj) {
      case 'math':
        return 'text-sky-400 bg-sky-950/30 border-sky-800/40';
      case 'physics':
        return 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40';
      case 'cs':
        return 'text-purple-400 bg-purple-950/30 border-purple-800/40';
      default:
        return 'text-amber-400 bg-amber-950/30 border-amber-800/40';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#27272a]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-750 font-semibold uppercase">
              Official Course Repository
            </span>
            <span className="text-xs font-mono text-zinc-500">2-Month Foundation Sprint</span>
          </div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight mt-1">
            Course Downloads & Teaching Materials
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Direct access to official lecture handouts, slide presentations, derivation sheets, and graded assignments.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center space-x-3 text-xs font-mono text-zinc-400 bg-[#121215] px-3.5 py-2 rounded-lg border border-[#27272a] self-start sm:self-auto">
          <div>
            <span className="text-zinc-200 font-semibold">{COURSE_MATERIALS.length}</span> Documents
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center space-x-1.5">
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Online Hub</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400 font-semibold">Offline Mode</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="space-y-3 bg-[#121215] p-4 rounded-lg border border-[#27272a]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">

          {/* Search Field */}
          <div className="md:col-span-6 relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search syllabus, limits, kinematics, python, 2's complement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#09090b] border border-[#27272a] rounded-md text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
            />
          </div>

          {/* Subject Filter Pills */}
          <div className="md:col-span-6 flex flex-wrap items-center gap-1.5 justify-start md:justify-end">
            {subjects.map((sub) => {
              const Icon = sub.icon;
              const isSelected = selectedSubject === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubject(sub.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 shadow-sm'
                      : 'bg-[#09090b] text-zinc-400 border border-[#27272a] hover:text-zinc-200 hover:border-zinc-700'
                  }`}
                >
                  <Icon className="w-3 h-3 text-zinc-400" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Secondary Format Filters */}
        <div className="flex items-center justify-between pt-2 border-t border-[#27272a]/60 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Format:</span>
            <div className="flex items-center space-x-1">
              {fileTypes.map((ft) => (
                <button
                  key={ft.id}
                  onClick={() => setSelectedType(ft.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
                    selectedType === ft.id
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {ft.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-mono text-zinc-500">
            Showing {filteredMaterials.length} of {COURSE_MATERIALS.length} items
          </div>
        </div>
      </div>

      {/* Materials Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map((mat) => {
          const isPdf = mat.fileType === 'PDF';

          return (
            <div
              key={mat.id}
              className="group bg-[#121215] rounded-lg border border-[#27272a] hover:border-zinc-600 transition-all flex flex-col justify-between p-4 space-y-4"
            >
              {/* Card Header & Format Badge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getSubjectColor(mat.subject)}`}>
                    {mat.courseName} • {mat.session}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border font-bold ${getFormatBadgeStyle(mat.fileType)}`}>
                    {mat.fileType}
                  </span>
                </div>

                <h2 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors leading-snug">
                  {mat.title}
                </h2>

                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {mat.description}
                </p>
              </div>

              {/* Tags & Metadata */}
              <div className="space-y-3 pt-2 border-t border-[#27272a]/70">
                <div className="flex flex-wrap gap-1">
                  {mat.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#09090b] text-zinc-400 border border-[#27272a]">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 pt-1">
                  <span>{mat.fileName}</span>
                  <span>{mat.fileSize}</span>
                </div>

                {/* Download and Preview Action Buttons */}
                <div className="flex items-center space-x-2 pt-1">
                  {isPdf && (
                    <button
                      onClick={() => setPreviewDoc(mat)}
                      className="flex-1 px-2.5 py-1.5 bg-[#09090b] hover:bg-zinc-850 text-zinc-300 hover:text-zinc-100 border border-[#27272a] rounded text-xs font-mono flex items-center justify-center space-x-1.5 transition-all"
                    >
                      <Eye className="w-3 h-3 text-zinc-400" />
                      <span>Preview</span>
                    </button>
                  )}

                  <a
                    href={mat.downloadUrl}
                    download={mat.fileName}
                    className="flex-1 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold rounded text-xs font-mono flex items-center justify-center space-x-1.5 transition-all shadow-sm"
                  >
                    <Download className="w-3 h-3 text-zinc-950" />
                    <span>Download</span>
                  </a>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* PDF Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewDoc(null)}>
          <div
            className="relative max-w-5xl w-full h-[85vh] bg-[#121215] rounded-lg border border-zinc-750 flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a] bg-[#18181c]">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-zinc-300" />
                <span className="text-xs font-semibold text-zinc-100">{previewDoc.title}</span>
                <span className="text-[10px] font-mono text-zinc-500">({previewDoc.fileName})</span>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={previewDoc.downloadUrl}
                  download={previewDoc.fileName}
                  className="px-2.5 py-1 rounded bg-zinc-100 text-zinc-950 text-xs font-mono font-semibold flex items-center space-x-1 hover:bg-white transition-all"
                >
                  <Download className="w-3 h-3" />
                  <span>Download File</span>
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Embedded Iframe Viewer */}
            <div className="flex-1 bg-[#09090b] relative">
              <iframe
                src={previewDoc.downloadUrl}
                title={previewDoc.title}
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
