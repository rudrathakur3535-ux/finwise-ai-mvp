import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Target } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

export default function QuizReview() {
  const { quizAttemptId } = useParams();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.get(`${API_BASE_URL}/api/quiz/review/${quizAttemptId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setReviewData(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [quizAttemptId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-violet-500 border-solid rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 border-b-4 border-emerald-500 border-solid rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        <p className="mt-8 text-indigo-400 font-medium animate-pulse tracking-widest uppercase text-sm">Loading Review Data</p>
      </div>
    );
  }

  if (!reviewData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative p-4">
        <div className="glass-panel p-10 text-center max-w-md w-full animate-fade-in-up">
          <Target className="mx-auto text-slate-500 mb-6" size={56} />
          <h2 className="text-2xl font-bold text-white mb-3">Review Not Found</h2>
          <p className="text-slate-400 mb-8">We couldn't find the data for this quiz attempt.</p>
          <button 
            onClick={() => navigate('/student')}
            className="w-full glass-button py-4"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-1/4 w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate('/student')} 
            className="group flex items-center gap-2 text-slate-400 hover:text-white font-semibold transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700/50"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold border ${reviewData.score >= 80 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : reviewData.score >= 50 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
              <Target size={18} />
              Final Score: {reviewData.score}%
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 z-10 relative space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Quiz Review</h1>
          <p className="text-slate-400 mt-2">Topic: {reviewData.topic?.name || 'Adaptive Quiz'}</p>
        </div>

        <div className="space-y-6">
          {(reviewData.answers || []).map((answer: any, index: number) => {
            const question = answer.question || {};
            let options: string[] = [];
            try {
              options = typeof question.options === 'string' 
                ? JSON.parse(question.options) 
                : (Array.isArray(question.options) ? question.options : []);
            } catch (e) {
              options = [];
            }
            const isCorrect = answer.isCorrect;
            
            return (
              <div key={answer.id || index} className="glass-card p-6 sm:p-8 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      Q{index + 1}
                    </span>
                    <span className={`font-semibold uppercase tracking-wider text-xs ${isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800">
                    <Clock size={14} />
                    {((answer.timeTakenMs || 0) / 1000).toFixed(1)}s
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-6 leading-relaxed">
                  {question.content}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {options.map((opt: string, optIdx: number) => {
                    const isSelectedAnswer = answer.selectedOptionIndex === optIdx;
                    const isActualCorrect = question.correctOption === optIdx;
                    
                    let cardClass = "bg-slate-800/30 border-slate-700/30 text-slate-400";
                    let icon = null;

                    if (isActualCorrect) {
                      cardClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
                      icon = <CheckCircle2 className="text-emerald-400" size={20} />;
                    } else if (isSelectedAnswer && !isActualCorrect) {
                      cardClass = "bg-red-500/10 border-red-500/40 text-red-100";
                      icon = <XCircle className="text-red-400" size={20} />;
                    }

                    // Special case: timed out (no answer selected)
                    if (answer.selectedOptionIndex === -1 && isActualCorrect) {
                       cardClass = "bg-emerald-500/10 border-emerald-500/40 text-emerald-100 shadow-[0_0_10px_rgba(16,185,129,0.1)]";
                       icon = <CheckCircle2 className="text-emerald-400" size={20} />;
                    }

                    return (
                      <div 
                        key={optIdx} 
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${cardClass}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs ${isActualCorrect ? 'bg-emerald-500/20 text-emerald-400' : isSelectedAnswer && !isActualCorrect ? 'bg-red-500/20 text-red-400' : 'bg-slate-700/50 text-slate-500'}`}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="font-medium">{opt}</span>
                        </div>
                        {icon}
                      </div>
                    );
                  })}
                </div>
                
                {answer.selectedOptionIndex === -1 && (
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg text-orange-400 text-sm font-medium flex items-center gap-2">
                    <Clock size={16} /> Time ran out before an answer was selected.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
