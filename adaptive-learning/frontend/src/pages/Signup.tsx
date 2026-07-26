import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, KeyRound, GraduationCap, Users } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>('STUDENT');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        username,
        password,
        role
      });
      // Registration successful, log them in immediately
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      if (res.data.role === 'STUDENT') {
        navigate('/student');
      } else {
        navigate('/teacher');
      }
      window.location.reload();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Signup failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/30 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-md p-8 sm:p-10 z-10 glass-panel animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl mb-6 shadow-lg shadow-indigo-500/20 border border-indigo-500/30">
            <UserPlus size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Join LearnFlow</h2>
          <p className="text-slate-400 font-medium">Create your account to get started</p>
        </div>
        
        {error && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300 ml-1">Account Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`flex-1 flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all duration-300 border ${
                  role === 'STUDENT' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <GraduationCap size={24} className="mb-2" />
                <span className="font-semibold text-sm">Student</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('TEACHER')}
                className={`flex-1 flex flex-col items-center justify-center py-4 px-2 rounded-xl transition-all duration-300 border ${
                  role === 'TEACHER' 
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <Users size={24} className="mb-2" />
                <span className="font-semibold text-sm">Teacher</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-slate-500" />
              </div>
              <input
                type="text"
                required
                className="w-full pl-11 pr-4 py-3 text-white glass-input placeholder:text-slate-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose a username"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound size={18} className="text-slate-500" />
              </div>
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 text-white glass-input placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 px-4 mt-4 glass-button disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
        
        <div className="text-center mt-8">
          <p className="text-slate-400">
            Already have an account? <Link to="/" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
