import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { MessageCircle, X, Send, Bot as BotIcon, Loader2, Sparkles, Lightbulb, BookOpen } from 'lucide-react';
import { UserContext } from '../types';

// Mock context based on the data in Dashboard/Constants
const MOCK_USER_CONTEXT: UserContext = {
  weakTopics: ['IFRS 9 Financial Instruments', 'Revenue Recognition'],
  strongTopics: ['IAS 16 Property, Plant & Equipment', 'Group Accounting'],
  studyProgress: 41,
  lastExamScore: 58
};

const SUGGESTED_PROMPTS = [
  "Explain IFRS 9 simplified",
  "How to answer Consolidation Q1?",
  "Analyze my weak topics",
  "Give me an exam tip",
  "Explain IFRS 15 5 steps"
];

export const Bot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hello! I am your AI DipIFR Tutor. I know you\'re doing great in Assets but might need help with Financial Instruments. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: textToSend }]);
    setLoading(true);

    const response = await getGeminiResponse(textToSend, MOCK_USER_CONTEXT);
    
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 group"
        aria-label="Open Chat Tutor"
      >
        <MessageCircle size={28} className="group-hover:animate-pulse" />
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">1</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex justify-between items-center text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
             <BotIcon size={24} />
          </div>
          <div>
            <h3 className="font-heading font-bold text-lg leading-none">AI Tutor</h3>
            <span className="text-xs text-blue-100 opacity-90">Powered by Gemini 2.5</span>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white shrink-0 mr-2 mt-1 shadow-sm">
                <BotIcon size={16} />
              </div>
            )}
            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 text-inherit whitespace-pre-wrap">
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-white shrink-0 mr-2 mt-1">
               <Sparkles size={16} className="animate-pulse" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-primary" size={18} />
              <span className="text-xs text-gray-500 font-medium">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 bg-white border-t border-gray-100 overflow-x-auto no-scrollbar">
         <div className="flex gap-2 w-max">
           {SUGGESTED_PROMPTS.map((prompt, i) => (
             <button
               key={i}
               onClick={() => handleSend(prompt)}
               disabled={loading}
               className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors border border-blue-100 whitespace-nowrap flex items-center gap-1"
             >
               {i === 0 ? <Lightbulb size={12}/> : <BookOpen size={12}/>}
               {prompt}
             </button>
           ))}
         </div>
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask about IFRS, past papers..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="bg-primary hover:bg-blue-700 text-white p-2.5 rounded-full shadow-md disabled:opacity-50 disabled:shadow-none transition-all transform active:scale-95"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};