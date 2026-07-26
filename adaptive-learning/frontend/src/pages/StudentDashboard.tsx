import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen, ChevronRight, Trophy, TrendingUp, Target, Flame, Activity, Layers, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../lib/api';

import AchievementsWidget from '../components/AchievementsWidget';
import WeaknessHeatmap from '../components/WeaknessHeatmap';
import AITutorWidget from '../components/AITutorWidget';

export default function StudentDashboard() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [profileStats, setProfileStats] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    
    axios.get(`${API_BASE_URL}/api/subjects`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setSubjects(res.data))
      .catch(console.error);
      
    axios.get(`${API_BASE_URL}/api/dashboard/student`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setDashboardData(res.data))
      .catch(console.error);

    axios.get(`${API_BASE_URL}/api/profile/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setProfileStats(res.data))
      .catch(console.error);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  // Prepare chart data
  const chartData = dashboardData?.recentAttempts
    ? [...dashboardData.recentAttempts].reverse().map((a: any, idx: number) => ({
        name: `Q${idx + 1}`,
        score: a.score,
        topic: a.topic.name
      }))
    : [];

  // Prepare topics list with mastery scores for WeaknessHeatmap
  const allTopicsWithMastery = subjects.flatMap((s: any) =>
    s.topics.map((t: any) => {
      const match = dashboardData?.topicMastery?.find((m: any) => m.name === t.name);
      return {
        id: t.id,
        name: t.name,
        subjectName: s.name,
        masteryScore: match ? match.averageScore : 0
      };
    })
  );

  const CircularProgress = ({ value, label }: { value: number, label: string }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              className="text-slate-800"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
            <circle
              className="text-indigo-500 transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-xl font-black text-white">{value}%</span>
          </div>
        </div>
        <span className="mt-2 text-sm font-semibold text-slate-400 text-center">{label}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative font-sans">
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
              <BookOpen className="text-indigo-400" size={20} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              LearnFlow <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">Pro</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/leaderboard')}
              className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition bg-indigo-500/10 hover:bg-indigo-500/20 px-4 py-2 rounded-xl border border-indigo-500/20"
            >
              <Trophy size={18} />
              <span className="hidden sm:inline">Leaderboard</span>
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white font-medium transition bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-600">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in-up">
        
        {/* Welcome & Quick Stats */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Welcome back, Student <Sparkles className="text-amber-400" size={24} />
            </h2>
            <p className="text-slate-400 mt-1">Your personal AI-driven learning roadmap is ready</p>
          </div>
          
          <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <div className="glass-card p-4 min-w-[140px] flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                <Target size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Quizzes</p>
                <p className="text-2xl font-black text-white">{profileStats?.totalQuizzes || 0}</p>
              </div>
            </div>
            <div className="glass-card p-4 min-w-[140px] flex items-center gap-4">
              <div className="p-3 bg-violet-500/20 rounded-xl text-violet-400">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Avg Score</p>
                <p className="text-2xl font-black text-white">{profileStats?.averageScore || 0}%</p>
              </div>
            </div>
            <div className="glass-card p-4 min-w-[140px] flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-xl text-orange-400">
                <Flame size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Streak</p>
                <p className="text-2xl font-black text-white">{profileStats?.streak || 0}d</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gamification Achievements */}
        <AchievementsWidget
          totalQuizzes={profileStats?.totalQuizzes || 0}
          averageScore={profileStats?.averageScore || 0}
          streak={profileStats?.streak || 0}
        />

        {/* Weakness & Practice Analysis */}
        <WeaknessHeatmap topics={allTopicsWithMastery} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Chart */}
          <section className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="text-indigo-400" size={24} />
              <h2 className="text-xl font-bold text-white">Score History & Adaptive Trends</h2>
            </div>
            <div className="glass-card p-6 h-[320px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(51, 65, 85, 0.5)" />
                    <XAxis dataKey="name" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', borderColor: 'rgba(99, 102, 241, 0.4)', borderRadius: '16px', color: '#fff' }}
                      formatter={(value: any) => [`${value}%`, 'Score'] as any}
                      itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#818cf8" 
                      strokeWidth={4}
                      activeDot={{ r: 8, fill: '#818cf8', stroke: '#1e293b', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  Take your first adaptive quiz to generate progress metrics!
                </div>
              )}
            </div>
          </section>

          {/* Mastery Overview */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500" size={24} />
              <h2 className="text-xl font-bold text-white">Topic Mastery</h2>
            </div>
            
            <div className="glass-card p-6 h-[320px] overflow-y-auto">
              {dashboardData?.topicMastery?.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {dashboardData.topicMastery.map((m: any, idx: number) => (
                    <CircularProgress key={idx} value={m.averageScore} label={m.name} />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-center">
                  Take quizzes to see your topic mastery levels
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Subjects & Topics */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            Course Catalog <BookOpen size={24} className="text-indigo-400" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map(subject => (
              <div key={subject.id} className="glass-card overflow-hidden group">
                <div className="bg-slate-800/80 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">{subject.name}</h3>
                  <span className="text-xs bg-slate-700 text-slate-300 px-2.5 py-0.5 rounded-full font-semibold">
                    {subject.topics.length} topics
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  {subject.topics.map((topic: any) => (
                    <div 
                      key={topic.id} 
                      className="p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all space-y-3" 
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-200">{topic.name}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/flashcards/${topic.id}`)}
                          className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-1 transition"
                        >
                          <Layers size={14} /> Flashcards
                        </button>
                        <button
                          onClick={() => navigate(`/quiz/${topic.id}`)}
                          className="flex-1 py-2 px-3 glass-button text-xs flex items-center justify-center gap-1"
                        >
                          Quiz <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Floating AI Tutor Assistant */}
      <AITutorWidget />
    </div>
  );
}
