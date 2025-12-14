import React, { useState, useEffect } from 'react';
import { MODULES } from '../constants';
import { dataService } from '../services/dataService';
import { ChevronRight, ChevronLeft, RotateCw, CheckCircle, XCircle, ArrowLeft, Filter, BookOpen, Loader2, Award } from 'lucide-react';
import { Module, Flashcard, QuizQuestion, User } from '../types';

interface StudyProps {
  user: User;
  onUpdateProgress: (moduleId: string, progress: number) => void;
}

const BLOOM_COLORS: Record<string, string> = {
  'Remember': 'bg-gray-100 text-gray-600',
  'Understand': 'bg-blue-50 text-blue-600',
  'Apply': 'bg-green-50 text-green-600',
  'Analyze': 'bg-orange-50 text-orange-600',
  'Evaluate': 'bg-purple-50 text-purple-600',
  'Create': 'bg-red-50 text-red-600',
};

export const Study: React.FC<StudyProps> = ({ user, onUpdateProgress }) => {
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [mode, setMode] = useState<'overview' | 'flashcards' | 'quiz'>('overview');
  
  // Data States
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  
  const getUserModule = (m: Module) => ({
     ...m,
     progress: user.progress[m.id] || 0
  });

  // Fetch data when module activates
  useEffect(() => {
    if (activeModule) {
      const loadData = async () => {
        setLoading(true);
        try {
          const [fc, quiz] = await Promise.all([
            dataService.getFlashcards(activeModule),
            dataService.getQuiz(activeModule)
          ]);
          setFlashcards(fc);
          setQuizQuestions(quiz);
        } catch (e) {
          console.error("Failed to load study data");
        } finally {
          setLoading(false);
        }
      };
      loadData();
    }
  }, [activeModule]);

  const groupedModules = MODULES.reduce((acc, mod) => {
    (acc[mod.topic] = acc[mod.topic] || []).push(getUserModule(mod));
    return acc;
  }, {} as Record<string, Module[]>);

  const topicTitles: Record<string, string> = {
    'framework': 'Conceptual Framework',
    'group-accounting': 'Group Accounting',
    'assets': 'Assets',
    'liabilities': 'Liabilities',
    'financial-instruments': 'Financial Instruments',
    'revenue': 'Revenue',
    'presentation': 'Presentation',
    'other': 'Other Standards'
  };

  if (activeModule) {
    const currentModule = getUserModule(activeModule);

    return (
      <div className="pb-20">
        <button 
          onClick={() => { setActiveModule(null); setMode('overview'); }}
          className="flex items-center text-gray-500 mb-4 hover:text-primary transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Back to Syllabus
        </button>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">{topicTitles[currentModule.topic]}</span>
            <h2 className="text-2xl font-heading font-bold text-dark mt-1 mb-2">{currentModule.title}</h2>
            <p className="text-gray-600 leading-relaxed">{currentModule.description}</p>
            <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${currentModule.progress}%` }}></div>
                </div>
                <span className="text-xs font-bold text-gray-500">{currentModule.progress}% Complete</span>
            </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button 
            onClick={() => setMode('flashcards')}
            className={`flex-1 py-4 px-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 ${mode === 'flashcards' ? 'bg-accent text-white shadow-lg transform scale-105' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            <RotateCw size={20} />
            <span>Flashcards</span>
          </button>
          <button 
            onClick={() => setMode('quiz')}
            className={`flex-1 py-4 px-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 ${mode === 'quiz' ? 'bg-secondary text-white shadow-lg transform scale-105' : 'bg-white text-gray-600 border hover:bg-gray-50'}`}
          >
            <CheckCircle size={20} />
            <span>Quiz</span>
          </button>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <Loader2 size={40} className="animate-spin mb-4 text-primary" />
             <p>Loading module content...</p>
           </div>
        ) : (
          <>
            {mode === 'flashcards' && <FlashcardDeck cards={flashcards} />}
            {mode === 'quiz' && (
              <QuizSection 
                questions={quizQuestions} 
                onComplete={(score) => {
                  const newProgress = score > (quizQuestions.length / 2) ? 100 : 50;
                  onUpdateProgress(currentModule.id, Math.max(currentModule.progress, newProgress));
                }} 
              />
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-heading font-bold text-dark">June 2026 Syllabus</h2>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white px-3 py-1.5 rounded-full border">
             <Filter size={14} />
             <span>All Topics</span>
          </div>
      </div>
      
      <div className="space-y-8">
        {Object.entries(groupedModules).map(([topic, mods]) => (
          <div key={topic}>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">{topicTitles[topic]}</h3>
            <div className="grid gap-3">
              {mods.map((module) => (
                <div 
                  key={module.id}
                  onClick={() => setActiveModule(module)}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all hover:border-primary/30 flex items-center gap-4 group"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${module.progress === 100 ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-500'}`}>
                    <BookOpen size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-heading font-bold text-gray-800 group-hover:text-primary transition-colors">{module.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{module.description}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-primary" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FlashcardDeck: React.FC<{ cards: Flashcard[] }> = ({ cards }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset index if cards change (e.g. new module)
  useEffect(() => { setCurrentIdx(0); setIsFlipped(false); }, [cards]);

  if (!cards || cards.length === 0) return <div className="text-center text-gray-500">No flashcards available.</div>;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % cards.length);
    }, 200);
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIdx((prev) => prev - 1);
      }, 200);
    }
  };

  const card = cards[currentIdx];

  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full max-w-sm mb-2 text-xs font-bold text-gray-400">
         <span>Card {currentIdx + 1} / {cards.length}</span>
         <span className={`px-2 py-0.5 rounded ${BLOOM_COLORS[card.taxonomy]}`}>{card.taxonomy}</span>
      </div>

      <div 
        className="relative w-full max-w-sm h-72 cursor-pointer perspective-1000 group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full text-center transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full backface-hidden bg-white border-2 border-gray-100 rounded-2xl shadow-xl flex flex-col items-center justify-center p-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Question</span>
            <p className="text-xl font-heading font-bold text-gray-800 leading-tight">{card.front}</p>
            <span className="absolute bottom-4 text-xs text-primary bg-blue-50 px-3 py-1 rounded-full animate-pulse">Tap to reveal</span>
          </div>
          
          {/* Back */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-primary to-blue-600 text-white rounded-2xl shadow-xl flex flex-col items-center justify-center p-6">
             <span className="text-xs font-bold text-white/60 uppercase tracking-widest mb-4">Answer</span>
             <p className="text-lg leading-relaxed">{card.back}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-4 w-full max-w-sm">
        <button 
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} /> Previous
        </button>
        <button 
          onClick={handleNext}
          className="flex-1 bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-lg"
        >
          Next Card <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const QuizSection: React.FC<{ questions: QuizQuestion[], onComplete: (score: number) => void }> = ({ questions, onComplete }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Reset if questions change
  useEffect(() => { setCurrentQ(0); setScore(0); setCompleted(false); setSelected(null); setShowResult(false); }, [questions]);

  if (!questions || questions.length === 0) return <div className="text-center text-gray-500">No quiz questions available.</div>;

  if (completed) {
     return (
       <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
         <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
           <Award size={40} />
         </div>
         <h3 className="text-2xl font-heading font-bold mb-2">Quiz Completed!</h3>
         <p className="text-gray-600 mb-6">You scored <span className="text-primary font-bold text-xl">{score}/{questions.length}</span></p>
         <button 
           onClick={() => { 
             setCompleted(false); 
             setCurrentQ(0); 
             setScore(0); 
             setSelected(null); 
             setShowResult(false); 
           }}
           className="bg-primary text-white px-8 py-3 rounded-xl font-bold"
         >
           Retry Quiz
         </button>
       </div>
     )
  }

  const question = questions[currentQ];

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setSelected(null);
      setShowResult(false);
      setCurrentQ((prev) => prev + 1);
    } else {
      setCompleted(true);
      onComplete(score + (selected === question.correctAnswer ? 1 : 0));
    }
  };

  const prevQuestion = () => {
    if (currentQ > 0) {
      setSelected(null);
      setShowResult(false);
      setCurrentQ((prev) => prev - 1);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
          Question {currentQ + 1}/{questions.length}
        </span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${BLOOM_COLORS[question.taxonomy]}`}>{question.taxonomy}</span>
      </div>
      
      <h3 className="text-lg font-bold text-gray-800 mb-6 leading-snug">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((opt, idx) => {
          let stateClass = "border-gray-200 hover:border-blue-300 bg-white";
          if (showResult) {
            if (idx === question.correctAnswer) stateClass = "border-green-500 bg-green-50 text-green-700 font-medium";
            else if (idx === selected) stateClass = "border-red-500 bg-red-50 text-red-700";
            else stateClass = "opacity-50 border-gray-200";
          } else if (selected === idx) {
             stateClass = "border-primary bg-blue-50";
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${stateClass}`}
              disabled={showResult}
            >
              <div className="flex items-center justify-between">
                <span>{opt}</span>
                {showResult && idx === question.correctAnswer && <CheckCircle size={20} className="text-green-600"/>}
                {showResult && idx === selected && idx !== question.correctAnswer && <XCircle size={20} className="text-red-600"/>}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-8 flex gap-4">
        <button 
          onClick={prevQuestion}
          disabled={currentQ === 0}
          className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {showResult && (
          <button 
            onClick={nextQuestion}
            className="flex-1 bg-primary text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors animate-in fade-in zoom-in duration-200"
          >
            {currentQ < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>

      {showResult && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-900 mb-4 border-l-4 border-blue-500">
            <span className="font-bold block mb-1">Explanation:</span>
            {question.explanation}
          </div>
        </div>
      )}
    </div>
  );
};