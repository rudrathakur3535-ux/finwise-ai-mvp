import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Star, Flame } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get(`${API_BASE_URL}/api/leaderboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setLeaderboard(res.data))
      .catch(console.error);
      
    // Fetch profile to know who current user is for highlighting
    axios.get(`${API_BASE_URL}/api/profile/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setCurrentUser(res.data.user))
      .catch(console.error);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-violet-600/20 rounded-full blur-[150px] pointer-events-none"></div>

      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/student')} 
            className="group flex items-center gap-2 text-slate-400 hover:text-white font-semibold transition-colors"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            Back
          </button>
          
          <div className="flex items-center gap-2">
            <Trophy className="text-yellow-500" size={24} />
            <h1 className="text-xl font-bold text-white tracking-tight">Global Leaderboard</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 z-10 relative space-y-12">
        
        {/* Podium for top 3 */}
        {leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-2 sm:gap-6 pt-10 pb-8 animate-fade-in-up">
            {/* Rank 2 - Silver */}
            <div className="flex flex-col items-center w-28 sm:w-36">
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 rounded-full border-4 border-slate-300 flex items-center justify-center text-slate-300 shadow-[0_0_20px_rgba(203,213,225,0.3)] z-10 relative">
                  <span className="text-2xl font-black">{leaderboard[1].user.username.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-3 -right-2 bg-slate-300 rounded-full p-1.5 shadow-lg border-2 border-slate-800">
                  <Medal size={20} className="text-slate-700" />
                </div>
              </div>
              <div className="bg-gradient-to-t from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-slate-600/50 rounded-t-2xl w-full flex flex-col items-center justify-start pt-4 pb-6 h-32 shadow-xl shadow-slate-900/50">
                <span className="font-bold text-white truncate w-full text-center px-2">{leaderboard[1].user.username}</span>
                <span className="text-indigo-300 font-black mt-1">{leaderboard[1].totalMasteryScore} pts</span>
              </div>
            </div>

            {/* Rank 1 - Gold */}
            <div className="flex flex-col items-center w-32 sm:w-44 z-10 relative -mb-4">
              <div className="absolute -top-12 animate-bounce">
                <Star size={32} className="fill-yellow-400 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" />
              </div>
              <div className="relative mb-4">
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-slate-800 rounded-full border-4 border-yellow-400 flex items-center justify-center text-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)] z-10 relative">
                  <span className="text-3xl sm:text-4xl font-black">{leaderboard[0].user.username.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-3 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg border-2 border-slate-800">
                  <Trophy size={24} className="text-yellow-900" />
                </div>
              </div>
              <div className="bg-gradient-to-t from-yellow-900/40 to-yellow-600/20 backdrop-blur-sm border border-yellow-500/50 rounded-t-2xl w-full flex flex-col items-center justify-start pt-6 pb-6 h-40 shadow-2xl shadow-yellow-900/20">
                <span className="font-extrabold text-white text-lg truncate w-full text-center px-2">{leaderboard[0].user.username}</span>
                <span className="text-yellow-400 font-black mt-1 text-lg">{leaderboard[0].totalMasteryScore} pts</span>
              </div>
            </div>

            {/* Rank 3 - Bronze */}
            <div className="flex flex-col items-center w-28 sm:w-36">
              <div className="relative mb-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-800 rounded-full border-4 border-amber-600 flex items-center justify-center text-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.3)] z-10 relative">
                  <span className="text-2xl font-black">{leaderboard[2].user.username.substring(0, 2).toUpperCase()}</span>
                </div>
                <div className="absolute -bottom-3 -right-2 bg-amber-600 rounded-full p-1.5 shadow-lg border-2 border-slate-800">
                  <Medal size={20} className="text-amber-100" />
                </div>
              </div>
              <div className="bg-gradient-to-t from-slate-800/80 to-slate-700/80 backdrop-blur-sm border border-amber-900/50 rounded-t-2xl w-full flex flex-col items-center justify-start pt-4 pb-6 h-24 shadow-xl shadow-slate-900/50">
                <span className="font-bold text-white truncate w-full text-center px-2">{leaderboard[2].user.username}</span>
                <span className="text-indigo-300 font-black mt-1">{leaderboard[2].totalMasteryScore} pts</span>
              </div>
            </div>
          </div>
        )}

        {/* List for rest */}
        <div className="glass-panel overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="p-6 border-b border-slate-700/50 bg-slate-800/50">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Flame className="text-orange-500" size={20} /> Current Standings
            </h3>
          </div>
          <div className="divide-y divide-slate-700/50">
            {leaderboard.slice(3).map((entry: any, index: number) => {
              const rank = index + 4;
              const isCurrentUser = currentUser && currentUser.id === entry.userId;
              
              return (
                <div 
                  key={entry.userId} 
                  className={`flex items-center justify-between p-4 sm:p-6 transition-colors ${isCurrentUser ? 'bg-indigo-500/10 border-l-4 border-l-indigo-500' : 'hover:bg-slate-800/30'}`}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-8 font-black text-slate-500 text-lg text-center">
                      #{rank}
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-bold text-slate-300">
                      {entry.user.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${isCurrentUser ? 'text-indigo-400' : 'text-slate-200'}`}>
                        {entry.user.username} {isCurrentUser && <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded ml-2 uppercase tracking-wide">You</span>}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black text-white">{entry.totalMasteryScore}</div>
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Points</div>
                  </div>
                </div>
              );
            })}
            
            {leaderboard.length <= 3 && (
              <div className="p-8 text-center text-slate-500">
                More students need to join to fill out the leaderboard!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
