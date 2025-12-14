import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { User as AppUser } from '../types';
import { Users, Server, Activity, Shield, Search, MoreVertical, LogOut, Lock, UserPlus, Trash2 } from 'lucide-react';

export const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [stats, setStats] = useState<any>({});
  const [maintenance, setMaintenance] = useState(false);
  
  // Whitelist State
  const [whitelist, setWhitelist] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [viewMode, setViewMode] = useState<'users' | 'whitelist'>('users');

  useEffect(() => {
    // Initial load
    setUsers(authService.getAllUsers());
    setStats(authService.getStats());
    setMaintenance(authService.isMaintenanceMode());
    setWhitelist(authService.getWhitelist());

    // Mock live updates
    const interval = setInterval(() => {
      setStats(authService.getStats());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleRoleChange = (email: string, newRole: string) => {
    authService.updateUserRole(email, newRole);
    setUsers(authService.getAllUsers());
  };

  const toggleMaintenance = () => {
    const newState = !maintenance;
    setMaintenance(newState);
    authService.setMaintenanceMode(newState);
  };

  const handleAddWhitelist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail && newEmail.includes('@')) {
      authService.addToWhitelist(newEmail);
      setWhitelist(authService.getWhitelist());
      setNewEmail('');
    }
  };

  const handleRemoveWhitelist = (email: string) => {
    authService.removeFromWhitelist(email);
    setWhitelist(authService.getWhitelist());
  };

  const getDaysLeft = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days` : 'Expired';
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Admin Header */}
      <div className="bg-dark text-white px-6 py-4 shadow-md flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 p-1.5 rounded-lg">
            <Shield size={20} className="text-white" />
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">DipIFR Admin</span>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setViewMode('users')} 
             className={`text-sm font-bold ${viewMode === 'users' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
           >
             User Manager
           </button>
           <button 
             onClick={() => setViewMode('whitelist')} 
             className={`text-sm font-bold ${viewMode === 'whitelist' ? 'text-white border-b-2 border-white' : 'text-gray-400'}`}
           >
             Whitelist
           </button>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-gray-300 hover:text-white text-sm font-bold">
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Active Users</p>
              <h3 className="text-3xl font-bold text-green-600 flex items-center gap-2">
                {stats.activeUsers} <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </h3>
            </div>
            <div className="p-3 bg-green-50 rounded-full text-green-600"><Users size={24}/></div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Server Load</p>
              <h3 className="text-3xl font-bold text-blue-600">{stats.serverLoad}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Server size={24}/></div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase mb-1">Total Accounts</p>
              <h3 className="text-3xl font-bold text-dark">{stats.totalUsers}</h3>
            </div>
            <div className="p-3 bg-gray-100 rounded-full text-gray-600"><Activity size={24}/></div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-center">
             <div className="flex justify-between items-center mb-2">
               <span className="text-xs font-bold uppercase text-gray-500">Access Control</span>
               <Lock size={16} className={maintenance ? 'text-red-500' : 'text-green-500'} />
             </div>
             <button 
               onClick={toggleMaintenance}
               className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${maintenance ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
             >
               {maintenance ? 'MAINTENANCE ACTIVE' : 'SYSTEM NORMAL'}
             </button>
          </div>
        </div>

        {viewMode === 'users' ? (
          /* User Management */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-heading font-bold text-lg text-dark">User Management</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Trial Left</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          user.role === 'admin' ? 'bg-red-100 text-red-600' : 
                          user.role === 'premium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.isTrialExpired && user.role === 'student' ? (
                           <span className="text-red-500 font-bold text-xs flex items-center gap-1"><Lock size={12}/> Locked</span>
                        ) : (
                          <span className="text-green-600 font-bold text-xs">Active</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {user.role === 'student' ? (
                           <span className={user.isTrialExpired ? 'text-red-500 font-bold' : 'text-gray-600'}>
                             {getDaysLeft(user.trialEndsAt)}
                           </span>
                        ) : (
                          <span className="text-amber-500"><Shield size={12} className="inline"/> Lifetime</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                           {user.role !== 'admin' && (
                             <button 
                               onClick={() => handleRoleChange(user.email, user.role === 'student' ? 'premium' : 'student')}
                               className="text-xs font-bold text-primary hover:underline"
                             >
                               {user.role === 'student' ? 'Upgrade' : 'Downgrade'}
                             </button>
                           )}
                           <MoreVertical size={16} className="text-gray-400 cursor-pointer" />
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Whitelist Management */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
               <h3 className="font-heading font-bold text-lg text-dark mb-2">Registration Whitelist</h3>
               <p className="text-sm text-gray-500 mb-4">Only emails listed here can register for an account.</p>
               
               <form onSubmit={handleAddWhitelist} className="flex gap-2 max-w-md">
                 <input 
                   type="email" 
                   value={newEmail}
                   onChange={(e) => setNewEmail(e.target.value)}
                   className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary"
                   placeholder="Enter email to invite..."
                   required
                 />
                 <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700">
                   <UserPlus size={18} /> Invite
                 </button>
               </form>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {whitelist.length === 0 && <p className="text-gray-400 italic">No emails in whitelist.</p>}
              {whitelist.map((email, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:border-blue-200 transition-colors">
                  <span className="text-gray-700 font-medium">{email}</span>
                  <button 
                    onClick={() => handleRemoveWhitelist(email)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};