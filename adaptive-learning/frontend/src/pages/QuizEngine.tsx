import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, Target, TrendingUp, TrendingDown, Star, CheckCircle2, XCircle } from 'lucide-react';
import { soundFx } from '../lib/soundFx';

export default function QuizEngine() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [quizState, setQuizState] = useState<'LOADING' | 'ACTIVE' | 'FINISHED'>('LOADING');
  const [question, setQuestion] = useState<any>(null);
  const [quizAttemptId, setQuizAttemptId] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [results, setResults] = useState<any>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  
  // Animation states
  const [diffDirection, setDiffDirection] = useState<'UP' | 'DOWN' | 'SAME' | null>(null);
  const [animateBadge, setAnimateBadge] = useState(false);
  const [masteryScore, setMasteryScore] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswering, setIsAnswering] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer effect
  useEffect(() => {
    if (quizState !== 'ACTIVE' || isAnswering) return;

    if (timeLeft <= 0) {
      handleAnswer(-1); // Auto submit wrong answer on timeout
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, quizState, isAnswering]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    axios.post('http://localhost:3001/api/quiz/start', { topicId }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setQuizAttemptId(res.data.quizAttemptId);
        setQuestion(res.data.question);
        setStartTime(Date.now());
        setTimeLeft(30);
        setQuestionNumber(1);
        setQuizState('ACTIVE');
      })
      .catch(err => {
        console.error(err);
        navigate('/student');
      });
  }, [topicId, navigate]);

  const handleAnswer = async (selectedIndex: number) => {
    if (isAnswering) return; // Prevent double clicks
    
    setIsAnswering(true);
    setSelectedAnswer(selectedIndex);
    const timeTakenMs = Date.now() - startTime;
    const isCorrect = selectedIndex === question.correctOption;
    const prevDifficulty = question.difficultyLevel;

    if (isCorrect) {
      soundFx.playCorrectSound();
    } else {
      soundFx.playIncorrectSound();
    }
    
    const token = localStorage.getItem('token');

    // Add a slight delay for visual feedback
    setTimeout(async () => {
      setQuizState('LOADING');
      try {
        const res = await axios.post('http://localhost:3001/api/quiz/next-question', {
          quizAttemptId,
          questionId: question.id,
          isCorrect,
          selectedOptionIndex: selectedIndex,
          timeTakenMs
        }, { headers: { Authorization: `Bearer ${token}` } });

        setMasteryScore(res.data.currentMasteryScore);

        if (res.data.finished) {
          const submitRes = await axios.post('http://localhost:3001/api/quiz/submit', { quizAttemptId }, { headers: { Authorization: `Bearer ${token}` } });
          setResults(submitRes.data);
          soundFx.playFanfareSound();
          setQuizState('FINISHED');
        } else {
          const nextDiff = res.data.question.difficultyLevel;
          if (nextDiff > prevDifficulty) setDiffDirection('UP');
          else if (nextDiff < prevDifficulty) setDiffDirection('DOWN');
          else setDiffDirection('SAME');
          
          setAnimateBadge(true);
          setTimeout(() => setAnimateBadge(false), 1500);

          setQuestion(res.data.question);
          setQuestionNumber(prev => prev + 1);
          setStartTime(Date.now());
          setTimeLeft(30);
          setSelectedAnswer(null);
          setIsAnswering(false);
          setQuizState('ACTIVE');
        }
      } catch (err) {
        console.error(err);
        setIsAnswering(false);
      }
    }, 1000); // 1 second delay to show answer feedback
  };

  const CircularTimer = ({ timeLeft }: { timeLeft: number }) => {
    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (timeLeft / 30) * circumference;
    const isWarning = timeLeft <= 10;
    const isDanger = timeLeft <= 5;

    return (
      <div className="relative flex items-center justify-center w-12 h-12">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
          <circle
            className="text-slate-700"
            strokeWidth="4"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="24"
            cy="24"
          />
          <circle
            className={`${isDanger ? 'text-red-500' : isWarning ? 'text-orange-500' : 'text-indigo-500'} transition-all duration-1000 linear`}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="24"
            cy="24"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-sm font-bold ${isDanger ? 'text-red-400 animate-pulse' : isWarning ? 'text-orange-400' : 'text-indigo-400'}`}>
            {timeLeft}
          </span>
        </div>
      </div>
    );
  };

  if (quizState === 'LOADING' && !isAnswering) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-r-4 border-violet-500 border-solid rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-4 border-b-4 border-blue-500 border-solid rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
        </div>
        <p className="mt-8 text-indigo-400 font-medium animate-pulse tracking-widest uppercase text-sm">Adaptive Engine Loading</p>
      </div>
    );
  }

  if (quizState === 'FINISHED') {
    return (
      <div className="min-h-screen relative overflow-hidden flex justify-center items-center">
        {/* Celebration Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1s' }}></div>

        <div className="w-full max-w-lg glass-panel p-10 text-center transform transition-all animate-fade-in-up z-10 mx-4">
          <div className="mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.5)] border-4 border-emerald-400/30">
            <Target className="text-white" size={40} />
          </div>
          <h2 className="text-4xl font-black text-white mb-2">Session Complete!</h2>
          <p className="text-slate-400 font-medium mb-8 text-lg">You nailed {results.correctCount} out of {results.total} questions.</p>
          
          <div className="relative inline-block mb-10">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 rounded-full"></div>
            <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-lg">
              {results.score}%
            </div>
            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">
              Accuracy Score
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => navigate('/student')}
              className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition duration-300 border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} /> Dashboard
            </button>
            <button 
              onClick={() => navigate(`/quiz/review/${quizAttemptId}`)}
              className="flex-1 py-4 glass-button flex items-center justify-center gap-2"
            >
              Review Answers
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative p-4">
        <div className="glass-panel p-10 text-center max-w-md w-full animate-fade-in-up">
          <Target className="mx-auto text-slate-500 mb-6" size={56} />
          <h2 className="text-2xl font-bold text-white mb-3">No Questions Ready</h2>
          <p className="text-slate-400 mb-8">The learning engine needs more data for this topic. Please check back later.</p>
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

  const options = JSON.parse(question.options);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      <header className="bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate('/student')} 
            className="group flex items-center gap-2 text-slate-400 hover:text-white font-semibold transition-colors bg-slate-800/50 hover:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700/50"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span className="hidden sm:inline">Exit Session</span>
          </button>
          
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Mastery Score */}
            <div className="flex items-center gap-2 bg-indigo-500/10 text-indigo-300 px-4 py-2.5 rounded-xl font-bold border border-indigo-500/20">
              <Star size={18} className="fill-indigo-400 text-indigo-400" />
              <span className="hidden sm:inline">Mastery:</span> {masteryScore}
            </div>
            
            {/* Difficulty Badge */}
            <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-500 transform ${animateBadge ? 'scale-110 ring-4 ring-opacity-30 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'scale-100'}
              ${question.difficultyLevel === 3 ? 'bg-red-500/10 text-red-400 border border-red-500/30 ring-red-500' : 
                question.difficultyLevel === 2 ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 ring-orange-500' : 
                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ring-emerald-500'}`}
            >
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-xs">
                {diffDirection === 'UP' && animateBadge ? <TrendingUp size={16} className="animate-bounce" /> :
                 diffDirection === 'DOWN' && animateBadge ? <TrendingDown size={16} className="animate-bounce" /> :
                 <Zap size={16} className={question.difficultyLevel === 3 ? 'fill-red-400' : question.difficultyLevel === 2 ? 'fill-orange-400' : 'fill-emerald-400'} />}
                <span className="hidden sm:inline">Level</span> {question.difficultyLevel}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-8 sm:py-12 z-10 relative">
        {/* Progress header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 text-slate-300 px-4 py-1.5 rounded-lg border border-slate-700 font-bold tracking-wider text-sm">
              Q{questionNumber}
            </div>
            <span className="text-slate-500 font-medium">Adaptive Engine</span>
          </div>
          <CircularTimer timeLeft={timeLeft} />
        </div>

        {/* Question Card */}
        <div className="glass-panel p-8 sm:p-12 mb-8 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">
            {question.content}
          </h2>
        </div>
        
        {/* Options */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          {options.map((opt: string, idx: number) => {
            const isSelected = selectedAnswer === idx;
            const isCorrectOption = question.correctOption === idx;
            
            // Determine styles based on answer state
            let buttonStyle = "bg-slate-800/60 border-slate-700/60 text-slate-200 hover:bg-slate-700 hover:border-slate-500";
            let icon = null;
            
            if (isAnswering) {
              if (isSelected) {
                if (isCorrectOption) {
                  buttonStyle = "bg-emerald-500/20 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-white";
                  icon = <CheckCircle2 className="text-emerald-400" size={24} />;
                } else {
                  buttonStyle = "bg-red-500/20 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] text-white";
                  icon = <XCircle className="text-red-400" size={24} />;
                }
              } else if (isCorrectOption) {
                // Highlight correct answer if wrong was selected
                buttonStyle = "bg-emerald-500/10 border-emerald-500/50 text-emerald-200";
                icon = <CheckCircle2 className="text-emerald-400/70" size={24} />;
              } else {
                buttonStyle = "bg-slate-900/50 border-slate-800 text-slate-500 opacity-50";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={isAnswering}
                className={`group flex items-center justify-between text-left p-5 sm:p-6 text-lg font-medium border-2 rounded-2xl transition-all duration-300 backdrop-blur-sm ${buttonStyle} ${!isAnswering && 'hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10 cursor-pointer'} ${isAnswering ? 'cursor-default' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${isAnswering ? (isSelected ? (isCorrectOption ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400') : 'bg-slate-800 text-slate-500') : 'bg-slate-700 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'}`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{opt}</span>
                </div>
                
                {isAnswering ? (
                  <div className="animate-in fade-in zoom-in duration-300">
                    {icon}
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-indigo-400 flex items-center justify-center transition-colors">
                    <div className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-indigo-400 transition-colors scale-0 group-hover:scale-100 duration-200"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
