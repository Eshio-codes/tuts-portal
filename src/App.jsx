import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LessonView from './components/LessonView';
import SlidePresenter from './components/SlidePresenter';
import QuestionBankView from './components/QuestionBankView';
import ExamPortal from './components/ExamPortal';
import GradingDashboard from './components/GradingDashboard';
import InteractiveTools from './components/InteractiveTools';
import { BookOpen, Layers, HelpCircle, Award, Cpu, ShieldCheck, Github } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('lessons');
  const [userRole, setUserRole] = useState('student'); // 'student' | 'tutor'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">

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

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-850 bg-slate-900/60 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-400">Pre-University STEM Foundation Tutoring Portal</span>
            <span>•</span>
            <span>Mathematics • Physics • Computer Science</span>
          </div>

          <div className="flex items-center space-x-6 text-slate-400">
            <button onClick={() => setActiveTab('lessons')} className="hover:text-cyan-300 transition-colors">Curriculum Notes</button>
            <button onClick={() => setActiveTab('slides')} className="hover:text-cyan-300 transition-colors">Slide Decks</button>
            <button onClick={() => setActiveTab('practice')} className="hover:text-cyan-300 transition-colors">Question Bank</button>
            <button onClick={() => setActiveTab('exams')} className="hover:text-cyan-300 transition-colors">Exam Portal</button>
            <button onClick={() => setActiveTab('grading')} className="hover:text-cyan-300 transition-colors">Gradebook</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
