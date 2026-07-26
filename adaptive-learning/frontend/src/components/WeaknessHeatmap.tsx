import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface TopicMastery {
  id: number;
  name: string;
  subjectName: string;
  masteryScore: number;
}

export default function WeaknessHeatmap({ topics }: { topics: TopicMastery[] }) {
  const navigate = useNavigate();

  if (!topics || topics.length === 0) return null;

  // Sort by lowest mastery score first to prioritize weak areas
  const sortedTopics = [...topics].sort((a, b) => a.masteryScore - b.masteryScore);

  return (
    <div className="glass-panel p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            Adaptive Mastery & Weakness Analysis <Sparkles className="text-amber-400" size={18} />
          </h3>
          <p className="text-sm text-slate-400">Target your weakest topics to maximize score improvements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedTopics.map((t) => {
          const isWeak = t.masteryScore < 60;
          const isModerate = t.masteryScore >= 60 && t.masteryScore < 80;
          
          let badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
          let badgeLabel = "Mastered";
          let Icon = CheckCircle;

          if (isWeak) {
            badgeColor = "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse";
            badgeLabel = "Needs Practice";
            Icon = AlertCircle;
          } else if (isModerate) {
            badgeColor = "bg-orange-500/10 text-orange-400 border-orange-500/30";
            badgeLabel = "Developing";
            Icon = AlertCircle;
          }

          return (
            <div
              key={t.id}
              className={`glass-card p-5 space-y-4 flex flex-col justify-between transition-all duration-300 ${
                isWeak ? 'border-red-500/40 hover:border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'hover:border-slate-600'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.subjectName}</span>
                  <span className={`flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${badgeColor}`}>
                    <Icon size={12} /> {badgeLabel}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white leading-snug">{t.name}</h4>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Mastery Level</span>
                  <span className={isWeak ? 'text-red-400 font-extrabold' : 'text-emerald-400'}>{t.masteryScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isWeak
                        ? 'bg-gradient-to-r from-red-500 to-rose-600'
                        : isModerate
                        ? 'bg-gradient-to-r from-orange-400 to-amber-500'
                        : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                    }`}
                    style={{ width: `${Math.max(t.masteryScore, 5)}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => navigate(`/flashcards/${t.id}`)}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-1.5 transition"
                >
                  <Layers size={14} className="text-indigo-400" /> Flashcards
                </button>
                <button
                  onClick={() => navigate(`/quiz/${t.id}`)}
                  className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition ${
                    isWeak
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md'
                      : 'glass-button'
                  }`}
                >
                  Adaptive Quiz <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
