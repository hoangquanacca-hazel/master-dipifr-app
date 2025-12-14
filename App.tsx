import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  LayoutDashboard, 
  PenTool, 
  Home as HomeIcon, 
  GraduationCap,
  Globe,
  Bell,
  LogOut,
  Crown
} from 'lucide-react';

import { ViewState, Language, User } from './types';
import { Study } from './components/Study';
import { Dashboard } from './components/Dashboard';
import { MockExam } from './components/MockExam';
import { Bot } from './components/bot';
import { AuthScreen } from './components/Auth';
import { AdminDashboard } from './components/Admin';
import { Practice } from './components/Practice';
import { ExamTechnique } from './components/examTechnique';
import { authService } from './services/authService';

const IDLE_TIMEOUT = 15 * 60 * 1000; // 15 minutes idle
const SESSION_CHECK_INTERVAL = 60 * 1000; // Check every 1 minute

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<ViewState>('home');
  const [lang, setLang] = useState<Language>('en');
  const [loading, setLoading] = useState(true);
  
  // Idle Timer Refs
  const idleTimerRef = useRef<any>(null);

  // Check session on load
  useEffect(() => {
    const sessionUser = authService.getCurrentUser();
    if (sessionUser) {
      setUser(sessionUser);
    }
    setLoading(false);
  }, []);

  // 1. Idle Logout Logic
  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (user) {
      idleTimerRef.current = setTimeout(() => {
        handleLogout('Session expired due to inactivity (15 mins).');
      }, IDLE_TIMEOUT);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    resetIdleTimer(); // Start initial
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [user]);

  // 2. Hard Session Timeout Logic (60 mins)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      // getCurrentUser checks session expiry internally
      const validUser = authService.getCurrentUser();
      if (!validUser) {
        handleLogout('Your session has expired (60 mins limit). Please login again.');
      }
    }, SESSION_CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = (msg?: string) => {
    authService.logout();
    setUser(null);
    setView('home');
    if (msg) alert(msg);
  };

  const handleUpdateProgress = (moduleId: string, progress: number) => {
    if (user) {
      const updatedUser = authService.updateUserProgress(user.email, moduleId, progress);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  };

  // Simple translations
  const t = {
    home: lang === 'en' ? 'Home' : 'Trang chủ',
    study: lang === 'en' ? 'Study' : 'Học tập',
    practice: lang === 'en' ? 'Practice' : 'Luyện tập',
    dashboard: lang === 'en' ? 'Dashboard' : 'Tiến độ',
    mock: lang === 'en' ? 'Mock Exam' : 'Thi thử',
    welcome: lang === 'en' ? `Welcome back, ${user?.name.split(' ')[0]}!` : 'Chào mừng trở lại!',
    startLearning: lang === 'en' ? 'Start Learning' : 'Bắt đầu học',
    continue: lang === 'en' ? 'Continue where you left off' : 'Tiếp tục bài học',
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin text-primary font-bold text-2xl">Loading...</div></div>;

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard onLogout={() => handleLogout()} />;
  }

  const renderContent = () => {
    switch (view) {
      case 'study':
        return <Study user={user} onUpdateProgress={handleUpdateProgress} />;
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'mock':
        return <MockExam />;
      case 'practice':
        return <Practice />;
      case 'technique':
        return <ExamTechnique />;
      case 'settings':
        return (
          <div className="pb-20">
             <h2 className="text-2xl font-heading font-bold text-dark mb-6">Settings</h2>
             <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <span className="text-[10px] uppercase font-bold text-accent bg-orange-50 px-2 py-0.5 rounded mt-1 inline-block">{user.role} User</span>
                  </div>
                </div>
                
                {user.role === 'student' && user.trialEndsAt && (
                   <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800 border border-blue-100">
                     <p className="font-bold">Trial Active</p>
                     <p>Expires on: {new Date(user.trialEndsAt).toLocaleDateString()}</p>
                   </div>
                )}

                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <Globe size={20} className="text-gray-500" />
                    <span>Language</span>
                  </div>
                  <button 
                    onClick={() => setLang(prev => prev === 'en' ? 'vi' : 'en')}
                    className="font-bold text-primary"
                  >
                    {lang === 'en' ? 'English' : 'Tiếng Việt'}
                  </button>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <Bell size={20} className="text-gray-500" />
                    <span>Notifications</span>
                  </div>
                  <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <button 
                  onClick={() => handleLogout()}
                  className="w-full text-red-500 font-bold py-3 mt-4 bg-red-50 rounded-lg flex items-center justify-center gap-2"
                >
                  <LogOut size={18} /> Sign Out
                </button>
             </div>
          </div>
        )
      case 'home':
      default:
        return (
          <div className="pb-20 space-y-8">
            {/* Banner */}
            <div className="bg-gradient-to-r from-primary to-blue-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h1 className="text-2xl font-heading font-bold mb-2">{t.welcome}</h1>
                <p className="opacity-90 mb-6 max-w-xs">{t.continue}</p>
                <button 
                  onClick={() => setView('study')}
                  className="bg-white text-primary px-6 py-2 rounded-full font-bold shadow-md hover:bg-gray-100 transition-colors"
                >
                  {t.startLearning}
                </button>
              </div>
              <div className="absolute -right-4 -bottom-8 opacity-20 text-white">
                <Globe size={150} />
              </div>
            </div>

            {/* Premium Upsell (if student) */}
            {user.role === 'student' && (
              <div className="bg-gradient-to-r from-orange-400 to-accent rounded-xl p-4 text-white flex justify-between items-center shadow-md">
                 <div>
                   <h3 className="font-bold flex items-center gap-2"><Crown size={18}/> Go Premium</h3>
                   <p className="text-xs opacity-90">Unlock all Mock Exams & AI Tutor limits.</p>
                 </div>
                 <button className="bg-white text-accent px-3 py-1.5 rounded-lg text-xs font-bold">Upgrade</button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setView('practice')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
                <div className="bg-green-100 p-3 rounded-full text-green-600">
                  <PenTool size={24} />
                </div>
                <span className="font-bold text-gray-700">Question Bank</span>
              </button>
              <button onClick={() => setView('mock')} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center gap-2 hover:bg-gray-50 transition-colors">
                <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                  <BookOpen size={24} />
                </div>
                <span className="font-bold text-gray-700">Mock Exam</span>
              </button>
            </div>

            {/* Daily Tip */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-accent text-white text-xs font-bold px-2 py-1 rounded">TIP OF THE DAY</span>
              </div>
              <p className="text-gray-700 italic">"In consolidation questions, always calculate the Group Structure percentage first!"</p>
            </div>

             {/* Recent Activity Mini List */}
             <div>
               <h3 className="font-bold text-gray-800 mb-3">Recent Activity</h3>
               <div className="space-y-3">
                 <div className="flex items-center gap-4 bg-white p-3 rounded-lg border border-gray-100">
                   <div className="w-2 h-10 bg-primary rounded-full"></div>
                   <div>
                     <h4 className="font-bold text-sm">IFRS 10 Quiz</h4>
                     <p className="text-xs text-gray-500">Score: 8/10 • 2 hours ago</p>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] font-body text-gray-800">
      {/* Top Bar */}
      <div className="bg-white sticky top-0 z-10 px-6 py-4 shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="bg-primary text-white p-1.5 rounded-lg">
             <BookOpen size={20} />
           </div>
           <span className="font-heading font-bold text-primary text-lg tracking-tight">DipIFR Master</span>
        </div>
        <button onClick={() => setView('settings')} className="text-gray-400 hover:text-gray-600">
          {user.avatar ? (
             <img src={user.avatar} className="w-8 h-8 rounded-full" alt="profile"/>
          ) : (
             <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-primary font-bold">
               {user.name.charAt(0)}
             </div>
          )}
        </button>
      </div>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto px-6 pt-6 min-h-[85vh]">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 pb-safe z-40">
        <div className="max-w-3xl mx-auto flex justify-around items-center px-2">
          <button 
            onClick={() => setView('home')}
            className={`flex flex-col items-center p-2 rounded-xl transition-all ${view === 'home' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <HomeIcon size={24} strokeWidth={view === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-bold mt-1">{t.home}</span>
          </button>
          
          <button 
             onClick={() => setView('study')}
             className={`flex flex-col items-center p-2 rounded-xl transition-all ${view === 'study' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <GraduationCap size={24} strokeWidth={view === 'study' ? 2.5 : 2} />
            <span className="text-[10px] font-bold mt-1">{t.study}</span>
          </button>

          <button 
            onClick={() => setView('mock')} // Center action button
            className="flex flex-col items-center justify-center -mt-8 bg-primary text-white w-14 h-14 rounded-full shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-transform active:scale-95"
          >
             <PenTool size={24} />
          </button>

          <button 
             onClick={() => setView('dashboard')}
             className={`flex flex-col items-center p-2 rounded-xl transition-all ${view === 'dashboard' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <LayoutDashboard size={24} strokeWidth={view === 'dashboard' ? 2.5 : 2} />
            <span className="text-[10px] font-bold mt-1">{t.dashboard}</span>
          </button>
          
          <button 
             onClick={() => setView('technique')}
             className={`flex flex-col items-center p-2 rounded-xl transition-all ${view === 'technique' ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BookOpen size={24} strokeWidth={view === 'technique' ? 2.5 : 2} />
            <span className="text-[10px] font-bold mt-1">Tips</span>
          </button>
        </div>
      </nav>

      {/* Chatbot Overlay */}
      <Bot />
    </div>
  );
};

export default App;