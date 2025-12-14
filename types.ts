export type BloomLevel = 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';

export interface Flashcard {
  id: string;
  moduleId: string;
  front: string;
  back: string;
  taxonomy: BloomLevel; // Updated to strict Bloom type
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  taxonomy: BloomLevel; // Updated to strict Bloom type
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topic: 'framework' | 'group-accounting' | 'assets' | 'financial-instruments' | 'revenue' | 'liabilities' | 'presentation' | 'other';
  progress: number;
}

export interface PastPaper {
  id: string;
  year: string;
  session: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface PracticeQuestion {
  id: string;
  title: string;
  topic: string;
  year: string;
  marks: number;
  scenario: string;
  solution: string;
  examinerComment?: string;
  taxonomy?: BloomLevel; // Tag for analysis
}

export interface MockExamDef {
  id: string;
  title: string;
  durationMinutes: number;
  questions: {
    title: string;
    marks: number;
    scenario: string;
    requirements: string[];
  }[];
}

export interface UserContext {
  weakTopics: string[];
  strongTopics: string[];
  lastExamScore?: number;
  studyProgress: number;
}

export type UserRole = 'student' | 'premium' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  twoFactorEnabled: boolean;
  avatar?: string;
  joinedDate: string;
  lastLogin: string;
  progress: Record<string, number>;
  // New Trial Fields
  trialEndsAt?: string; 
  isTrialExpired?: boolean;
}

export type ViewState = 'home' | 'study' | 'practice' | 'mock' | 'dashboard' | 'technique' | 'settings' | 'admin';
export type Language = 'en' | 'vi';