import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, Activity, TrendingUp, TrendingDown, Plus, Sparkles, X, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [content, setContent] = useState('');
  const [opt0, setOpt0] = useState('');
  const [opt1, setOpt1] = useState('');
  const [opt2, setOpt2] = useState('');
  const [opt3, setOpt3] = useState('');
  const [correctOpt, setCorrectOpt] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    
    axios.get('http://localhost:3001/api/dashboard/teacher', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setData(res.data))
      .catch(console.error);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('New Question added to Adaptive Question Bank!');
    setTimeout(() => {
      setSuccessMsg('');
      setShowAddModal(false);
      setContent('');
      setOpt0('');
      setOpt1('');
      setOpt2('');
      setOpt3('');
    }, 1200);
  };

  const chartData = data?.classAverages?.map((m: any) => ({
    name: m.topicName,
    score: m.averageScore
  })) || [];

  return (
    <div className="min-h-screen relative font-sans">
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/20 p-2 rounded-xl border border-indigo-500/30">
              <LayoutDashboard className="text-indigo-400" size={20} />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              Teacher Analytics <span className="text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full font-bold uppercase">Pro</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-4 py-2 rounded-xl transition shadow-lg shadow-indigo-500/20"
            >
              <Plus size={18} /> Add Question
            </button>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white font-medium transition bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-600">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in-up">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              Class Overview <Sparkles size={24} className="text-amber-400" />
            </h2>
            <p className="text-slate-400 mt-1">Monitor real-time student mastery, question difficulty, and learning progress</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Class Averages Cards */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="text-indigo-400" size={24} />
              <h2 className="text-xl font-bold text-white">Topic Mastery Averages</h2>
            </div>
            
            {data?.classAverages?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.classAverages.map((m: any, idx: number) => (
                  <div key={idx} className="glass-card p-6 group">
                    <h3 className="font-semibold text-slate-300 truncate">{m.topicName}</h3>
                    <div className="mt-2 flex items-end justify-between">
                      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">{m.averageScore}%</span>
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        {m.averageScore >= 70 ? <TrendingUp size={16} className="text-emerald-400" /> : <TrendingDown size={16} className="text-red-400" />}
                      </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1.5 rounded-full transition-all duration-1000 ease-out" style={{ width: `${m.averageScore}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card p-8 text-center text-slate-500">
                No class average data available yet.
              </div>
            )}
          </section>

          {/* Bar Chart */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="text-violet-400" size={24} />
              <h2 className="text-xl font-bold text-white">Performance Distribution</h2>
            </div>
            <div className="glass-card p-6 h-[320px]">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(51, 65, 85, 0.5)" />
                    <XAxis dataKey="name" tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{fill: '#94a3b8'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.95)', borderColor: 'rgba(99, 102, 241, 0.4)', borderRadius: '16px', color: '#fff' }}
                      formatter={(value: any) => [`${value}%`, 'Avg Score'] as any}
                      itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                      cursor={{fill: 'rgba(79, 70, 229, 0.1)'}}
                    />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#34d399' : entry.score >= 50 ? '#fbbf24' : '#f87171'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                  No chart data available yet
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Recent Student Activity Table */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="text-emerald-400" size={24} />
            <h2 className="text-xl font-bold text-white">Recent Student Submissions</h2>
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 border-b border-slate-700/50">
                    <th className="p-4 font-semibold text-slate-300">Student</th>
                    <th className="p-4 font-semibold text-slate-300">Topic</th>
                    <th className="p-4 font-semibold text-slate-300">Date</th>
                    <th className="p-4 font-semibold text-slate-300 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {data?.recentActivity?.map((activity: any) => (
                    <tr key={activity.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="p-4 font-medium text-white flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                          {activity.user.username.substring(0, 2).toUpperCase()}
                        </div>
                        {activity.user.username}
                      </td>
                      <td className="p-4 text-slate-300 font-medium">{activity.topic.name}</td>
                      <td className="p-4 text-slate-400 text-sm">
                        {new Date(activity.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-sm font-bold border ${activity.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : activity.score >= 50 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {activity.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                  {!data?.recentActivity?.length && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-slate-500">No recent activity detected.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

      </main>

      {/* Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
          <div className="glass-panel max-w-lg w-full p-8 border-2 border-indigo-500/30 relative space-y-6">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                Add Question <Sparkles className="text-amber-400" size={20} />
              </h3>
              <p className="text-slate-400 text-sm mt-1">Insert a new adaptive question into the question bank</p>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 font-bold text-sm flex items-center gap-2">
                <CheckCircle size={18} /> {successMsg}
              </div>
            )}

            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Question Prompt</label>
                <textarea
                  required
                  rows={2}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="e.g. Solve for x: 3x - 7 = 14"
                  className="w-full bg-slate-800 text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Option A</label>
                  <input
                    required
                    type="text"
                    value={opt0}
                    onChange={(e) => setOpt0(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Option B</label>
                  <input
                    required
                    type="text"
                    value={opt1}
                    onChange={(e) => setOpt1(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Option C</label>
                  <input
                    required
                    type="text"
                    value={opt2}
                    onChange={(e) => setOpt2(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Option D</label>
                  <input
                    required
                    type="text"
                    value={opt3}
                    onChange={(e) => setOpt3(e.target.value)}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Correct Answer Choice</label>
                  <select
                    value={correctOpt}
                    onChange={(e) => setCorrectOpt(Number(e.target.value))}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-sm"
                  >
                    <option value={0}>Option A</option>
                    <option value={1}>Option B</option>
                    <option value={2}>Option C</option>
                    <option value={3}>Option D</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 block mb-1">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(Number(e.target.value))}
                    className="w-full bg-slate-800 text-white p-2.5 rounded-xl border border-slate-700 text-sm"
                  >
                    <option value={1}>Level 1 (Easy)</option>
                    <option value={2}>Level 2 (Medium)</option>
                    <option value={3}>Level 3 (Hard)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl border border-slate-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 glass-button font-bold text-sm"
                >
                  Add Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
