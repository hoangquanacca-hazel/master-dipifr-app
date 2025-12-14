import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, BookOpen, BrainCircuit } from 'lucide-react';
import { MODULES } from '../constants';
import { User } from '../types';

const COLORS = ['#1E88E5', '#43A047', '#FB8C00', '#FF5252', '#7E57C2', '#26C6DA'];

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const userModules = MODULES.map(m => ({
    ...m,
    progress: user.progress[m.id] || 0
  }));

  const overallProgress = Math.round(userModules.reduce((acc, m) => acc + m.progress, 0) / userModules.length);
  
  const statusCounts = {
    mastered: userModules.filter(m => m.progress >= 90).length,
    learning: userModules.filter(m => m.progress >= 30 && m.progress < 90).length,
    toStart: userModules.filter(m => m.progress < 30).length
  };

  const dataProgress = [
    { name: 'Mastered', value: statusCounts.mastered },
    { name: 'Learning', value: statusCounts.learning },
    { name: 'To Start', value: statusCounts.toStart },
  ];

  // Mock Bloom Data (In real app, calculate from user's quiz history)
  const bloomData = [
    { subject: 'Remember', A: 80, fullMark: 100 },
    { subject: 'Understand', A: 70, fullMark: 100 },
    { subject: 'Apply', A: 55, fullMark: 100 },
    { subject: 'Analyze', A: 40, fullMark: 100 },
    { subject: 'Evaluate', A: 30, fullMark: 100 },
    { subject: 'Create', A: 20, fullMark: 100 },
  ];

  const topicPerformance = userModules.reduce((acc, mod) => {
    if (!acc[mod.topic]) {
      acc[mod.topic] = { total: 0, count: 0 };
    }
    acc[mod.topic].total += mod.progress;
    acc[mod.topic].count += 1;
    return acc;
  }, {} as Record<string, { total: number, count: number }>);

  const dataPerformance = Object.keys(topicPerformance).map(topic => ({
    name: topic.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    score: Math.round(topicPerformance[topic].total / topicPerformance[topic].count)
  })).slice(0, 5);

  return (
    <div className="space-y-6 pb-20">
      <header className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-dark">Your Progress</h2>
        <p className="text-gray-500">June 2026 Syllabus Tracker.</p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <TrendingUp className="text-primary" size={24} />
          </div>
          <span className="text-3xl font-bold text-dark">{overallProgress}%</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Syllabus Covered</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
            <BookOpen className="text-accent" size={24} />
          </div>
          <span className="text-3xl font-bold text-dark">{MODULES.length}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Standards</span>
        </div>
      </div>

      {/* Cognitive Analysis (Bloom) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
          <BrainCircuit size={18} className="text-purple-500"/> Cognitive Skills (Bloom's Taxonomy)
        </h3>
        <p className="text-xs text-gray-400 mb-4">DipIFR requires high 'Apply' and 'Analyze' scores.</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={bloomData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{fontSize: 10}} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar name="My Skills" dataKey="A" stroke="#1E88E5" fill="#1E88E5" fillOpacity={0.6} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-2">
          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Action: Focus on 'Create' & 'Evaluate' questions.</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase">Topic Mastery</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataPerformance} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 10}} interval={0} />
                <Tooltip cursor={{fill: '#f5f7fa'}} />
                <Bar dataKey="score" fill="#43A047" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase">Study Status</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataProgress}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};