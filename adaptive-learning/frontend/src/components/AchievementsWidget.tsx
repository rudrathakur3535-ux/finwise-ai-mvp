import { Trophy, Flame, Target, Star, Award, Lock, CheckCircle2 } from 'lucide-react';

interface AchievementProps {
  totalQuizzes: number;
  averageScore: number;
  streak: number;
}

export default function AchievementsWidget({ totalQuizzes, averageScore, streak }: AchievementProps) {
  // Calculate XP and level
  const totalXp = (totalQuizzes * 100) + (averageScore * 5) + (streak * 50);
  const level = Math.floor(totalXp / 300) + 1;
  const xpInCurrentLevel = totalXp % 300;
  const progressPercent = Math.min(Math.round((xpInCurrentLevel / 300) * 100), 100);

  const badges = [
    {
      id: 'first_victory',
      title: 'First Victory',
      desc: 'Complete your first quiz session',
      icon: Trophy,
      color: 'from-amber-500 to-yellow-600',
      unlocked: totalQuizzes >= 1
    },
    {
      id: 'streak_flame',
      title: 'Streak Flame',
      desc: 'Maintain a 3+ day learning streak',
      icon: Flame,
      color: 'from-orange-500 to-red-600',
      unlocked: streak >= 3
    },
    {
      id: 'score_master',
      title: '90% Accuracy',
      desc: 'Achieve 90%+ average score',
      icon: Target,
      color: 'from-emerald-500 to-teal-600',
      unlocked: averageScore >= 90
    },
    {
      id: 'master_mind',
      title: 'Master Mind',
      desc: 'Complete 5 or more quizzes',
      icon: Star,
      color: 'from-indigo-500 to-violet-600',
      unlocked: totalQuizzes >= 5
    },
    {
      id: 'speed_demon',
      title: 'Scholar',
      desc: 'Reach Level 3 Student status',
      icon: Award,
      color: 'from-purple-500 to-pink-600',
      unlocked: level >= 3
    }
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6">
      {/* Header with Level Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)] border-2 border-indigo-400/40">
            <Award size={32} className="text-white" />
            <span className="absolute -bottom-2 bg-slate-900 text-indigo-300 border border-indigo-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
              Lvl {level}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              Level {level} Student <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">{totalXp} XP</span>
            </h3>
            <p className="text-sm text-slate-400">Unlock achievement badges by practicing daily</p>
          </div>
        </div>

        {/* Level XP Bar */}
        <div className="w-full sm:w-64 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>Progress to Lvl {level + 1}</span>
            <span className="text-indigo-400">{xpInCurrentLevel}/300 XP</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div>
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Achievement Badges</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center ${
                  b.unlocked
                    ? 'bg-slate-800/60 border-slate-700 hover:border-slate-500 hover:-translate-y-1 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-50'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-md ${
                    b.unlocked
                      ? `bg-gradient-to-br ${b.color} text-white`
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon size={24} />
                </div>
                <h5 className="font-bold text-white text-sm flex items-center gap-1">
                  {b.title}
                  {b.unlocked ? (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  ) : (
                    <Lock size={12} className="text-slate-500" />
                  )}
                </h5>
                <p className="text-xs text-slate-400 mt-1 leading-snug">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
