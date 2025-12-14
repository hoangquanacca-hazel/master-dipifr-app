import React, { useState, useEffect } from 'react';
import { Search, Loader2, ChevronDown, ChevronUp, CheckCircle } from 'lucide-react';
import { dataService } from '../services/dataService';
import { PracticeQuestion } from '../types';

export const Practice: React.FC = () => {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterTopic, setFilterTopic] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await dataService.getPracticeQuestions();
        setQuestions(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Extract unique topics
  const topics = ['All', ...Array.from(new Set(questions.map(q => q.topic)))];

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.scenario.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTopic = filterTopic === 'All' || q.topic === filterTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="pb-20">
      <header className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-dark">Question Bank</h2>
        <p className="text-gray-500">Master exam technique with {questions.length}+ past questions.</p>
      </header>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search scenarios, standards..." 
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setFilterTopic(t)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${filterTopic === t ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
           <div className="flex justify-center py-10">
             <Loader2 className="animate-spin text-primary" size={30} />
           </div>
        ) : (
          <>
            {filteredQuestions.map(q => (
              <QuestionCard 
                key={q.id} 
                question={q} 
                isExpanded={expandedId === q.id} 
                onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)} 
              />
            ))}
            {filteredQuestions.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                No questions found matching your criteria.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const QuestionCard: React.FC<{ question: PracticeQuestion; isExpanded: boolean; onToggle: () => void }> = ({ question, isExpanded, onToggle }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border transition-all duration-300 ${isExpanded ? 'border-primary ring-1 ring-primary/20' : 'border-gray-100 hover:border-gray-300'}`}>
      <div 
        onClick={onToggle}
        className="p-5 cursor-pointer flex justify-between items-start"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{question.topic}</span>
            <span className="text-gray-400 text-xs font-medium">{question.year} • {question.marks} Marks</span>
          </div>
          <h3 className="font-bold text-gray-800 text-lg">{question.title}</h3>
        </div>
        {isExpanded ? <ChevronUp size={20} className="text-primary"/> : <ChevronDown size={20} className="text-gray-400"/>}
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 mb-4 leading-relaxed border border-gray-100">
            <span className="font-bold block text-gray-900 mb-1">Scenario:</span>
            {question.scenario}
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-600" />
              <span className="font-bold text-green-900 text-sm uppercase">Suggested Solution</span>
            </div>
            <div className="text-sm text-gray-800 whitespace-pre-line font-medium leading-relaxed">
              {question.solution}
            </div>
          </div>
          
          {question.examinerComment && (
            <div className="mt-4 text-xs text-orange-600 bg-orange-50 p-3 rounded border border-orange-100 italic">
              <strong>Examiner's Note:</strong> {question.examinerComment}
            </div>
          )}
        </div>
      )}
    </div>
  );
};