import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, KeyRound, User } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

export default function Login() {
  const [username, setUsername] = useState('student');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        username,
        password
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      if (res.data.role === 'STUDENT') {
        navigate('/student');
        window.location.reload();
      } else {
        navigate('/teacher');
        window.location.reload();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/30 rounded-full blur-[120px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>

      <div className="w-full max-w-md p-8 sm:p-10 z-10 glass-panel animate-fade-in-up">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl mb-6 shadow-lg shadow-indigo-500/20 border border-indigo-500/30">
            <BookOpen size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-2">LearnFlow AI</h2>
          <p className="text-slate-400 font-medium">Welcome back to your learning journey</p>
        </div>
        
        {error && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/50 text-red-400 rounded-xl text-sm font-medium flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-300 ml-1">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-slate-500" />
              </div>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3 text-white glass-input placeholder:text-slate-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
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
                className="w-full pl-11 pr-4 py-3 text-white glass-input placeholder:text-slate-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3.5 px-4 mt-2 glass-button disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-8 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm">
          <p className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Demo Credentials</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">Student</span>
              <span className="font-mono bg-slate-900/50 px-2 py-0.5 rounded text-indigo-300 border border-slate-700/50">student / password123</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-500">Teacher</span>
              <span className="font-mono bg-slate-900/50 px-2 py-0.5 rounded text-emerald-300 border border-slate-700/50">teacher / password123</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-400">
            New to LearnFlow? <Link to="/signup" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
