import React from 'react';
import { BookOpen, Presentation, HelpCircle, FileCheck, Award, Cpu, ShieldCheck, UserCheck } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userRole, setUserRole }) {
  const navItems = [
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'slides', label: 'Slide Decks', icon: Presentation },
    { id: 'practice', label: 'Question Bank', icon: HelpCircle },
    { id: 'exams', label: 'Tests & Exams', icon: FileCheck },
    { id: 'grading', label: 'Grading & Analytics', icon: Award, roleBadge: 'Tutor' },
    { id: 'tools', label: 'Interactive Lab', icon: Cpu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('lessons')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="font-extrabold text-white text-lg tracking-wider">T</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-white tracking-tight">TUTS STEM</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono font-medium">Sprint Portal</span>
              </div>
              <p className="text-xs text-slate-400">Foundation • Math, Physics & CS</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.roleBadge && (
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                      {item.roleBadge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Role Switcher */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setUserRole(userRole === 'student' ? 'tutor' : 'student')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                userRole === 'tutor'
                  ? 'bg-purple-950/60 text-purple-300 border-purple-600/50 hover:bg-purple-900/60'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50 hover:bg-emerald-900/60'
              }`}
              title="Click to toggle between Student and Tutor/Examiner mode"
            >
              {userRole === 'tutor' ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Tutor Mode</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Student Mode</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800/60 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
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
