import { User } from '../types';

// Mock database keys
const USERS_KEY = 'dipifr_users';
const SESSION_KEY = 'dipifr_session';
const SETTINGS_KEY = 'dipifr_settings';
const WHITELIST_KEY = 'dipifr_whitelist';

// Constants
const TRIAL_DURATION_DAYS = 14;
const SESSION_TIMEOUT_MS = 60 * 60 * 1000; // 60 minutes hard timeout

// Helper to simulate hash
const mockHash = (str: string) => btoa(str).split('').reverse().join('');

const DEFAULT_ADMIN: User = {
  id: 'admin_01',
  email: 'admin@dipifr.com',
  name: 'System Administrator',
  role: 'admin',
  twoFactorEnabled: true,
  joinedDate: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  progress: {}
};

const DEFAULT_USER: User = {
  id: 'user_01',
  email: 'student@dipifr.com',
  name: 'John Doe',
  role: 'student',
  twoFactorEnabled: false,
  joinedDate: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  progress: {
    'm0': 100,
    'm1': 80,
    'm3': 40,
    'm8': 60
  },
  trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
};

export const authService = {
  // Initialize mock DB
  init: () => {
    // 1. Init Users
    if (!localStorage.getItem(USERS_KEY)) {
      const db = {
        [DEFAULT_ADMIN.email]: { ...DEFAULT_ADMIN, passwordHash: mockHash('admin123') },
        [DEFAULT_USER.email]: { ...DEFAULT_USER, passwordHash: mockHash('user123') }
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(db));
    }
    
    // 2. Init Settings
    if (!localStorage.getItem(SETTINGS_KEY)) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify({ maintenance: false }));
    }

    // 3. Init Whitelist
    if (!localStorage.getItem(WHITELIST_KEY)) {
      // Default whitelist includes admin and demo student
      const whitelist = [DEFAULT_ADMIN.email, DEFAULT_USER.email];
      localStorage.setItem(WHITELIST_KEY, JSON.stringify(whitelist));
    }
  },

  isMaintenanceMode: (): boolean => {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    return !!settings.maintenance;
  },

  setMaintenanceMode: (enabled: boolean) => {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    settings.maintenance = enabled;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // Whitelist Logic
  isWhitelisted: (email: string): boolean => {
    const whitelist: string[] = JSON.parse(localStorage.getItem(WHITELIST_KEY) || '[]');
    return whitelist.includes(email.toLowerCase());
  },

  addToWhitelist: (email: string) => {
    const whitelist: string[] = JSON.parse(localStorage.getItem(WHITELIST_KEY) || '[]');
    if (!whitelist.includes(email.toLowerCase())) {
      whitelist.push(email.toLowerCase());
      localStorage.setItem(WHITELIST_KEY, JSON.stringify(whitelist));
    }
  },

  removeFromWhitelist: (email: string) => {
    let whitelist: string[] = JSON.parse(localStorage.getItem(WHITELIST_KEY) || '[]');
    whitelist = whitelist.filter(e => e !== email.toLowerCase());
    localStorage.setItem(WHITELIST_KEY, JSON.stringify(whitelist));
  },

  getWhitelist: (): string[] => {
    return JSON.parse(localStorage.getItem(WHITELIST_KEY) || '[]');
  },

  login: async (email: string, password: string): Promise<{ user?: User; error?: string; require2FA?: boolean }> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    
    const db = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const userRecord = db[email];

    if (!userRecord) return { error: 'User not found' };
    
    if (userRecord.passwordHash !== mockHash(password)) {
      return { error: 'Invalid password' };
    }

    // Check Maintenance Mode (Admins bypass)
    if (authService.isMaintenanceMode() && userRecord.role !== 'admin') {
      return { error: 'System is currently in maintenance mode. Please try again later.' };
    }

    // Check Trial Expiry (Admins & Premium bypass)
    if (userRecord.role === 'student' && userRecord.trialEndsAt) {
      const expiryDate = new Date(userRecord.trialEndsAt);
      if (new Date() > expiryDate) {
        return { error: 'Your 14-day trial has expired. Please contact admin to upgrade to Premium.' };
      }
    }

    // Update Last Login
    userRecord.lastLogin = new Date().toISOString();
    db[email] = userRecord;
    localStorage.setItem(USERS_KEY, JSON.stringify(db));

    // Determine if 2FA is needed
    if (userRecord.twoFactorEnabled) {
      return { require2FA: true, user: userRecord }; 
    }

    // Remove passwordHash before returning
    const safeUser = { ...userRecord };
    delete (safeUser as any).passwordHash;

    // Set Login Timestamp for Session Timeout
    const sessionData = { ...safeUser, sessionStartedAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    
    return { user: safeUser };
  },

  verify2FA: async (email: string, code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock check: code must be "123456" for demo
    if (code === '123456') {
      const db = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
      
      const safeUser = { ...db[email] };
      delete (safeUser as any).passwordHash;
      
      const sessionData = { ...safeUser, sessionStartedAt: Date.now() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      return true;
    }
    return false;
  },

  socialLogin: async (provider: 'google' | 'microsoft' | 'apple'): Promise<{ user?: User; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if the mock social email is whitelisted
    const socialEmail = `user@${provider}.com`;
    
    if (!authService.isWhitelisted(socialEmail)) {
      return { error: `Access Denied. The email ${socialEmail} is not in the invitation whitelist.` };
    }

    // Check trial for social user (simplified: reusing logic)
    const db = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    let user = db[socialEmail];

    if (!user) {
       // Register new social user automatically if whitelisted
       const trialEnd = new Date();
       trialEnd.setDate(trialEnd.getDate() + TRIAL_DURATION_DAYS);
       
       const newUser: User = {
        id: `social_${Date.now()}`,
        email: socialEmail,
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        role: 'student',
        twoFactorEnabled: false,
        joinedDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        progress: {},
        trialEndsAt: trialEnd.toISOString()
      };
      db[socialEmail] = { ...newUser, passwordHash: 'social' };
      localStorage.setItem(USERS_KEY, JSON.stringify(db));
      user = newUser;
    } else {
       // Check expiry
       if (user.role === 'student' && user.trialEndsAt && new Date() > new Date(user.trialEndsAt)) {
         return { error: 'Your trial has expired.' };
       }
    }

    const sessionData = { ...user, sessionStartedAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    return { user };
  },

  register: async (email: string, password: string, name: string): Promise<{ user?: User; error?: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 1. Whitelist Check
    if (!authService.isWhitelisted(email)) {
      return { error: 'Registration restricted. Your email is not on the invited list.' };
    }

    const db = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    
    if (db[email]) return { error: 'Email already exists' };

    // 2. Set Trial Period (14 Days)
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + TRIAL_DURATION_DAYS);

    const newUser: User = {
      id: `u_${Date.now()}`,
      email,
      name,
      role: 'student', // Start as student
      twoFactorEnabled: false,
      joinedDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      progress: {},
      trialEndsAt: trialEnd.toISOString()
    };

    db[email] = { ...newUser, passwordHash: mockHash(password) };
    localStorage.setItem(USERS_KEY, JSON.stringify(db));
    
    const sessionData = { ...newUser, sessionStartedAt: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
    
    return { user: newUser };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    const session = JSON.parse(sessionStr);
    
    // 60-Minute Session Timeout Check
    if (session.sessionStartedAt) {
      const now = Date.now();
      if (now - session.sessionStartedAt > SESSION_TIMEOUT_MS) {
        localStorage.removeItem(SESSION_KEY);
        return null; // Session expired
      }
    }

    return session;
  },

  updateUserProgress: (email: string, moduleId: string, progress: number) => {
    const db = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (db[email]) {
      db[email].progress = { ...db[email].progress, [moduleId]: progress };
      localStorage.setItem(USERS_KEY, JSON.stringify(db));
      
      // Update session if it's the current user
      const session = JSON.parse(localStorage.getItem(SESSION_KEY) || '{}');
      if (session.email === email) {
        session.progress = db[email].progress;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
      return session; // Return updated user
    }
    return null;
  },

  // Admin Methods
  getAllUsers: (): User[] => {
    const db = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    return Object.values(db).map((u: any) => {
      const user = { ...u };
      delete user.passwordHash;
      
      // Calculate derived status
      if (user.trialEndsAt && new Date() > new Date(user.trialEndsAt)) {
         user.isTrialExpired = true;
      }
      return user;
    });
  },

  updateUserRole: (email: string, role: string) => {
    const db = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    if (db[email]) {
      db[email].role = role;
      // If upgraded to premium/admin, maybe remove trial restrictions? 
      // For now, we keep the date but logic bypasses check.
      localStorage.setItem(USERS_KEY, JSON.stringify(db));
    }
  },

  getStats: () => {
    const db = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
    const users = Object.values(db) as User[];
    return {
      activeUsers: Math.floor(Math.random() * 50) + 120, // Mock
      serverLoad: Math.floor(Math.random() * 30) + 20 + '%', // Mock
      totalUsers: users.length,
      premiumUsers: users.filter(u => u.role === 'premium').length
    };
  }
};

authService.init();