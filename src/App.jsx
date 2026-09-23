import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthGate from './components/AuthGate';
import ErrorBoundary from './components/ErrorBoundary';
import LessonView from './components/LessonView';
import MaterialsHub from './components/MaterialsHub';
import SlidePresenter from './components/SlidePresenter';
import QuestionBankView from './components/QuestionBankView';
import ExamPortal from './components/ExamPortal';
import GradingDashboard from './components/GradingDashboard';
import InteractiveTools from './components/InteractiveTools';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { auth, isAuthenticated, isTutor, studentName, loginTutor, loginStudent, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('lessons');

  if (!isAuthenticated) {
    return <AuthGate onStudentLogin={loginStudent} onTutorLogin={loginTutor} />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col font-sans selection:bg-zinc-700 selection:text-zinc-100">

      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        auth={auth}
        onLogout={logout}
      />

      {/* Main View Router wrapped with Error Boundary */}
      <main className="flex-1">
        <ErrorBoundary onReset={() => setActiveTab('lessons')}>
          {activeTab === 'lessons' && <LessonView />}
          {activeTab === 'materials' && <MaterialsHub onNavigate={setActiveTab} />}
          {activeTab === 'slides' && <SlidePresenter />}
          {activeTab === 'practice' && <QuestionBankView />}
          {activeTab === 'exams' && (
            <ExamPortal
              studentName={studentName}
              isTutor={isTutor}
            />
          )}
          {activeTab === 'grading' && (
            isTutor ? (
              <GradingDashboard />
            ) : (
              <div className="max-w-md mx-auto mt-20 p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
                <p className="text-sm text-zinc-400">The Gradebook is restricted to tutors.</p>
                <button
                  onClick={() => setActiveTab('lessons')}
                  className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs rounded-lg text-zinc-200 transition-colors"
                >
                  Return to Curriculum
                </button>
              </div>
            )
          )}
          {activeTab === 'tools' && <InteractiveTools />}
        </ErrorBoundary>
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
            <button onClick={() => setActiveTab('materials')} className="hover:text-zinc-200 transition-colors">Materials</button>
            <button onClick={() => setActiveTab('slides')} className="hover:text-zinc-200 transition-colors">Slides</button>
            <button onClick={() => setActiveTab('practice')} className="hover:text-zinc-200 transition-colors">Problems</button>
            <button onClick={() => setActiveTab('exams')} className="hover:text-zinc-200 transition-colors">Examinations</button>
            {isTutor && (
              <button onClick={() => setActiveTab('grading')} className="hover:text-zinc-200 transition-colors">Gradebook</button>
            )}
            <button onClick={() => setActiveTab('tools')} className="hover:text-zinc-200 transition-colors">Calculators</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
