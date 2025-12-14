import React, { useState } from 'react';
import { authService } from '../services/authService';
import { User as AppUser } from '../types'; 
import { Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck, Apple, AlertCircle } from 'lucide-react';

interface AuthProps {
  onLogin: (user: AppUser) => void;
}

export const AuthScreen: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'register' | '2fa'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempUser, setTempUser] = useState<AppUser | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const res = await authService.login(email, password);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.require2FA && res.user) {
      setTempUser(res.user);
      setView('2fa');
    } else if (res.user) {
      onLogin(res.user);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await authService.register(email, password, name);
    setLoading(false);

    if (res.error) {
      setError(res.error);
    } else if (res.user) {
      onLogin(res.user);
    }
  };

  const handle2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const isValid = await authService.verify2FA(email, otp);
    setLoading(false);

    if (isValid && tempUser) {
      onLogin(tempUser);
    } else {
      setError('Invalid 2FA Code. (Try 123456)');
    }
  };

  const handleSocial = async (provider: 'google' | 'microsoft' | 'apple') => {
    setError('');
    setLoading(true);
    const res = await authService.socialLogin(provider);
    setLoading(false);
    
    if (res.error) {
      setError(res.error);
    } else if (res.user) {
      onLogin(res.user);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
          <ShieldCheck className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-heading font-bold text-gray-800">DipIFR Master</h1>
        <p className="text-gray-500">Secure Access Portal</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        {view === '2fa' ? (
          <form onSubmit={handle2FA}>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Two-Factor Authentication</h2>
            <p className="text-sm text-gray-500 mb-6">Please enter the 6-digit code sent to your authenticator app.</p>
            
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Security Code</label>
              <input 
                type="text" 
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                placeholder="000000"
              />
            </div>
             {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2"><AlertCircle size={16}/>{error}</div>}
            <button 
              disabled={loading}
              className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Identity'}
            </button>
          </form>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{view === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            
            <form onSubmit={view === 'login' ? handleLogin : handleRegister} className="space-y-4">
              {view === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <div className="relative">
                    <UserIcon size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input 
                      type="text" 
                      value={name} 
                      onChange={e => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" 
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-1"><AlertCircle size={16}/><span>{error}</span></div>}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-md"
              >
                {loading ? 'Processing...' : (view === 'login' ? 'Sign In' : 'Create Account')}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button 
                  onClick={() => handleSocial('google')} 
                  className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-xl font-bold text-red-500 group-hover:scale-110 transition-transform">G</span>
                </button>
                <button 
                  onClick={() => handleSocial('microsoft')} 
                  className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <span className="text-xl font-bold text-blue-500 group-hover:scale-110 transition-transform">M</span>
                </button>
                <button 
                  onClick={() => handleSocial('apple')} 
                  className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <Apple size={22} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button 
                  onClick={() => { setView(view === 'login' ? 'register' : 'login'); setError(''); }}
                  className="font-bold text-primary hover:underline"
                >
                  {view === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
            
            {view === 'login' && (
               <div className="mt-4 text-center p-3 bg-gray-50 rounded-lg text-xs text-gray-500 border border-gray-100">
                  <p className="font-bold flex items-center justify-center gap-1 mb-1"><Lock size={12}/> Restricted Access</p>
                  <p>Please contact the administrator to request an account invitation.</p>
               </div>
            )}
            
            {view === 'register' && (
              <div className="mt-4 text-center p-3 bg-orange-50 rounded-lg text-xs text-orange-800 border border-orange-100">
                  <p className="font-bold flex items-center justify-center gap-1"><Lock size={12}/> Invitation Only</p>
                  <p>Your email must be whitelisted by an admin to register.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};