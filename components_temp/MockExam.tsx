import React, { useState, useEffect } from 'react';
import { Clock, FileText, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { MockExamDef } from '../types';

export const MockExam: React.FC = () => {
  const [exams, setExams] = useState<MockExamDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState<MockExamDef | null>(null);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const loadExams = async () => {
      setLoading(true);
      const data = await dataService.getMockExams();
      setExams(data);
      setLoading(false);
    };
    loadExams();
  }, []);

  useEffect(() => {
    let timer: any;
    if (started && !finished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && started) {
      setFinished(true);
    }
    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  const handleStart = () => {
    if (selectedExam) {
      setTimeLeft(selectedExam.durationMinutes * 60);
      setStarted(true);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Screen 1: Exam Selector
  if (!selectedExam) {
    return (
      <div className="pb-20">
        <h2 className="text-2xl font-heading font-bold text-dark mb-6">Select Mock Exam</h2>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="space-y-4">
            {exams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-left hover:border-primary transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded uppercase">Full Simulation</span>
                  <span className="text-gray-400 text-sm font-medium flex items-center gap-1"><Clock size={14}/> {exam.durationMinutes / 60}h {exam.durationMinutes % 60}m</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-primary">{exam.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{exam.questions.length} Questions covering {exam.questions.map(q => q.title.split(':')[1]).join(', ')}.</p>
                <div className="flex items-center text-primary font-bold text-sm">
                  View Details <ChevronRight size={16} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Screen 2: Pre-start Briefing
  if (!started) {
    return (
      <div className="flex flex-col h-full pt-10 px-4 text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={40} />
          </div>
          <h2 className="text-3xl font-heading font-bold text-dark mb-2">{selectedExam.title}</h2>
          <p className="text-gray-500">Duration: {selectedExam.durationMinutes} minutes</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 text-left mb-8 max-w-sm mx-auto shadow-sm">
          <h4 className="font-bold text-gray-800 mb-3 border-b pb-2">Exam Rules</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> No pausing allowed</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> Closed book simulation</li>
            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500"/> 25 Marks per question</li>
          </ul>
        </div>

        <div className="mt-auto pb-10 flex gap-4 justify-center">
          <button 
            onClick={() => setSelectedExam(null)}
            className="px-6 py-3 text-gray-500 font-bold hover:text-gray-800"
          >
            Cancel
          </button>
          <button 
            onClick={handleStart}
            className="bg-primary text-white text-lg font-bold px-10 py-3 rounded-full shadow-xl hover:bg-blue-700 transition-transform active:scale-95"
          >
            Start Now
          </button>
        </div>
      </div>
    );
  }

  // Screen 4: Finished
  if (finished) {
    return (
      <div className="text-center pt-10 px-4">
        <h2 className="text-2xl font-bold text-secondary mb-4">Time's Up!</h2>
        <p className="text-gray-600 mb-8">Your answers have been submitted for auto-grading.</p>
        <div className="p-6 bg-white rounded-xl shadow-md max-w-md mx-auto mb-8 border border-gray-100">
          <div className="text-5xl font-bold text-dark mb-2">55%</div>
          <div className="text-sm text-gray-500 uppercase tracking-wide">Provisional Score</div>
        </div>
        <div className="space-y-3 max-w-md mx-auto text-left">
           <div className="bg-green-50 p-3 rounded text-sm text-green-800 border border-green-100">
             <strong>Strong:</strong> Assets (Q3) - Well structured.
           </div>
           <div className="bg-red-50 p-3 rounded text-sm text-red-800 border border-red-100">
             <strong>Weak:</strong> Revenue (Q2) - Missed Step 4 of IFRS 15.
           </div>
        </div>
        <button 
          onClick={() => { setStarted(false); setFinished(false); setSelectedExam(null); }}
          className="mt-8 text-primary font-bold hover:underline"
        >
          Return to Mock List
        </button>
      </div>
    );
  }

  // Screen 3: Active Exam
  return (
    <div className="h-full flex flex-col pb-20">
      {/* Timer Bar */}
      <div className="bg-dark text-white p-4 rounded-xl flex justify-between items-center mb-6 shadow-md sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${timeLeft < 300 ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`}>
            <Clock className="text-white" size={20} />
          </div>
          <div>
             <span className="font-mono text-xl font-bold block leading-none">{formatTime(timeLeft)}</span>
             <span className="text-[10px] text-gray-400 uppercase">Time Remaining</span>
          </div>
        </div>
        <button 
          onClick={() => setFinished(true)}
          className="bg-red-500/20 hover:bg-red-500 text-red-100 px-4 py-2 rounded-lg text-sm transition-colors border border-red-500/50 font-medium"
        >
          Submit Exam
        </button>
      </div>

      {/* Exam Content */}
      <div className="flex-1 overflow-y-auto space-y-8">
        {selectedExam.questions.map((q, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
              <span className="text-accent font-bold text-sm uppercase">Question {idx + 1}</span>
              <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">{q.marks} Marks</span>
            </div>
            
            <h3 className="text-xl font-heading font-bold mb-3">{q.title}</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm text-gray-700 leading-relaxed border border-gray-100">
               {q.scenario}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500 mb-4">
              <h4 className="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wide">Requirements:</h4>
              <ul className="list-disc ml-5 text-blue-800 space-y-1 text-sm">
                {q.requirements.map((req, rIdx) => (
                  <li key={rIdx}>{req}</li>
                ))}
              </ul>
            </div>
            
            <textarea 
              className="w-full p-4 border rounded-lg h-48 font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none bg-yellow-50/30"
              placeholder={`Type your answer for Question ${idx + 1} here...`}
            ></textarea>
          </div>
        ))}
      </div>
    </div>
  );
};