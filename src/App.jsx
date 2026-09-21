import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LessonView from './components/LessonView';
import SlidePresenter from './components/SlidePresenter';
import QuestionBankView from './components/QuestionBankView';
import ExamPortal from './components/ExamPortal';
import GradingDashboard from './components/GradingDashboard';
import InteractiveTools from './components/InteractiveTools';
import { ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('lessons');
  const [userRole, setUserRole] = useState('student'); // 'student' | 'tutor'

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-zinc-100">

      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'lessons' && <LessonView />}
        {activeTab === 'slides' && <SlidePresenter />}
        {activeTab === 'practice' && <QuestionBankView />}
        {activeTab === 'exams' && <ExamPortal userRole={userRole} />}
        {activeTab === 'grading' && <GradingDashboard />}
        {activeTab === 'tools' && <InteractiveTools />}
      </main>

      {/* Minimal Footer */}
      <footer className="mt-16 border-t border-[#27272a] bg-[#0c0c0e] py-6 px-4 sm:px-6 text-xs text-zinc-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-zinc-400">Pre-University STEM Foundation Tutoring Portal</span>
            <span>•</span>
            <span>Mathematics • Physics • Computer Science</span>
          </div>

          <div className="flex items-center space-x-5 text-zinc-400 text-[11px]">
            <button onClick={() => setActiveTab('lessons')} className="hover:text-zinc-200 transition-colors">Curriculum</button>
            <button onClick={() => setActiveTab('slides')} className="hover:text-zinc-200 transition-colors">Slides</button>
            <button onClick={() => setActiveTab('practice')} className="hover:text-zinc-200 transition-colors">Problems</button>
            <button onClick={() => setActiveTab('exams')} className="hover:text-zinc-200 transition-colors">Examinations</button>
            <button onClick={() => setActiveTab('grading')} className="hover:text-zinc-200 transition-colors">Gradebook</button>
            <button onClick={() => setActiveTab('tools')} className="hover:text-zinc-200 transition-colors">Instruments</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
