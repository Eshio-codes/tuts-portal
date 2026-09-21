import React from 'react';
import { BookOpen, Presentation, HelpCircle, FileCheck, Award, Cpu, ShieldCheck, UserCheck, FolderDown } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userRole, setUserRole }) {
  const navItems = [
    { id: 'lessons', label: 'Curriculum', icon: BookOpen },
    { id: 'materials', label: 'Course Materials', icon: FolderDown },
    { id: 'slides', label: 'Slide Decks', icon: Presentation },
    { id: 'practice', label: 'Problem Bank', icon: HelpCircle },
    { id: 'exams', label: 'Examinations', icon: FileCheck },
    { id: 'grading', label: 'Gradebook', icon: Award, tutorOnly: true },
    { id: 'tools', label: 'Calculators', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#09090b]/95 backdrop-blur-md border-b border-[#27272a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">

          {/* Product Mark */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => setActiveTab('lessons')}>
            <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-750 flex items-center justify-center font-mono font-bold text-xs text-zinc-100">
              ∑
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">STEM Foundations</span>
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-750">
                v1.0
              </span>
            </div>
          </div>

          {/* Centered Segmented Nav Control */}
          <nav className="hidden md:flex items-center bg-[#121215] p-1 rounded-lg border border-[#27272a]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-zinc-200' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                  {item.tutorOnly && (
                    <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-750 uppercase">
                      Tutor
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Role Switcher */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setUserRole(userRole === 'student' ? 'tutor' : 'student')}
              className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-colors border ${
                userRole === 'tutor'
                  ? 'bg-zinc-900 text-zinc-200 border-zinc-700 hover:bg-zinc-850'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-850 hover:text-zinc-200'
              }`}
              title="Toggle Student / Tutor role view"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${userRole === 'tutor' ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
              <span className="text-[11px] uppercase tracking-wider">{userRole === 'tutor' ? 'Tutor Mode' : 'Student Mode'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Nav Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-[#27272a] scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
