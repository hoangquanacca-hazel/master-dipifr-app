import React from 'react';
import { Play, FileText, CheckSquare, Mic } from 'lucide-react';
import { EXAM_TECHNIQUES } from '../constants';

export const ExamTechnique: React.FC = () => {
  return (
    <div className="pb-20 space-y-8">
      <header>
        <h2 className="text-2xl font-heading font-bold text-dark">Exam Technique Masterclass</h2>
        <p className="text-gray-500">Strategies to maximize your marks.</p>
      </header>

      {/* Video/Audio Section (Placeholders) */}
      <section>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Play size={18} className="text-primary"/> Video Lectures
        </h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="min-w-[200px] bg-gray-800 rounded-xl overflow-hidden relative group cursor-pointer shadow-md">
              <div className="aspect-video bg-gray-700 flex items-center justify-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-primary transition-colors">
                   <Play size={16} className="text-white fill-white" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-white text-sm font-bold">Consolidation Proforma {i+1}</p>
                <p className="text-gray-400 text-xs">10:45 • Video</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <Mic size={18} className="text-secondary"/> Audio Tips (Podcast)
        </h3>
        <div className="space-y-2">
          <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                 <Play size={12} className="fill-secondary"/>
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-800">Time Management Hacks</p>
                 <p className="text-xs text-gray-500">5 min • Audio</p>
               </div>
             </div>
             <button className="text-xs font-bold text-primary bg-blue-50 px-3 py-1 rounded-full">Listen</button>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                 <Play size={12} className="fill-secondary"/>
               </div>
               <div>
                 <p className="text-sm font-bold text-gray-800">Handling Ethical Threats</p>
                 <p className="text-xs text-gray-500">3 min • Audio</p>
               </div>
             </div>
             <button className="text-xs font-bold text-primary bg-blue-50 px-3 py-1 rounded-full">Listen</button>
          </div>
        </div>
      </section>

      {/* Checklists */}
      <section>
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <CheckSquare size={18} className="text-accent"/> Pre-Exam Checklist
        </h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {['Read requirement FIRST', 'Allocate time (1.95m/mark)', 'Plan structure for Q1', 'Leave white space'].map((item, idx) => (
             <label key={idx} className="flex items-center gap-3 p-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer">
               <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
               <span className="text-sm text-gray-700">{item}</span>
             </label>
          ))}
        </div>
      </section>

      {/* Written Tips */}
      <section>
         <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <FileText size={18} className="text-gray-600"/> Essential Techniques
        </h3>
         <div className="grid gap-4">
           {EXAM_TECHNIQUES.map((tech, i) => (
             <div key={i} className="bg-white p-5 rounded-xl border-l-4 border-gray-300 shadow-sm hover:border-primary transition-colors">
               <h3 className="font-bold text-lg mb-2 text-gray-800">{tech.title}</h3>
               <p className="text-gray-600 text-sm leading-relaxed">{tech.desc}</p>
             </div>
           ))}
         </div>
      </section>
    </div>
  );
};