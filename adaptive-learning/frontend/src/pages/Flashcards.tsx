import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, RotateCw, CheckCircle2, XCircle, ChevronLeft, ChevronRight, Layers, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { soundFx } from '../lib/soundFx';
import { API_BASE_URL } from '../lib/api';

export default function Flashcards() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [masteredCount, setMasteredCount] = useState(0);
  const [isMuted, setIsMuted] = useState(soundFx.getIsMuted());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    // Start quiz attempt to fetch questions or load topic questions
    axios.post(`${API_BASE_URL}/api/quiz/start`, { topicId }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data.question) {
          // Generate a flashcard deck from topic data
          setQuestions([
            res.data.question,
            {
              id: res.data.question.id + 100,
              content: `Key Concept: What is the core rule for solving level ${res.data.question.difficultyLevel} questions in this topic?`,
              options: JSON.stringify(["Identify patterns first", "Break problem into steps", "Apply formulas systematically", "Verify boundary cases"]),
              correctOption: 1,
              difficultyLevel: res.data.question.difficultyLevel
            },
            {
              id: res.data.question.id + 101,
              content: `Adaptive Tip: How to increase accuracy on Level ${res.data.question.difficultyLevel} difficulty?`,
              options: JSON.stringify(["Take your time under 30s", "Read options carefully", "Eliminate wrong choices", "All of the above"]),
              correctOption: 3,
              difficultyLevel: res.data.question.difficultyLevel
            }
          ]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [topicId, navigate]);

  const toggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const handleFlip = () => {
    soundFx.playFlipSound();
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const markConfidence = (gotIt: boolean) => {
    if (gotIt) {
      soundFx.playCorrectSound();
      setMasteredCount(prev => prev + 1);
    } else {
      soundFx.playIncorrectSound();
    }
    handleNext();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="animate-spin border-t-4 border-indigo-500 rounded-full w-16 h-16"></div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const options = currentQ ? (typeof currentQ.options === 'string' ? JSON.parse(currentQ.options) : currentQ.options) : [];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
      <div className="absolute top-0 right-1/4 w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate('/student')}
            className="flex items-center gap-2 text-slate-400 hover:text-white font-semibold transition bg-slate-800 px-4 py-2 rounded-xl border border-slate-700"
          >
            <ArrowLeft size={18} /> Dashboard
          </button>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Layers size={14} /> Flashcards ({currentIndex + 1}/{questions.length})
            </span>
            <button
              onClick={toggleSound}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
              title="Toggle Sound FX"
            >
              {isMuted ? <VolumeX size={18} className="text-red-400" /> : <Volume2 size={18} className="text-emerald-400" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Flashcard Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 flex flex-col items-center justify-center z-10">
        
        {/* Progress header */}
        <div className="w-full flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            3D Concept Deck <Sparkles className="text-amber-400" size={20} />
          </h2>
          <span className="text-sm font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Mastered: {masteredCount}/{questions.length}
          </span>
        </div>

        {/* 3D Flip Card Container */}
        {currentQ ? (
          <div
            onClick={handleFlip}
            className="w-full h-[380px] cursor-pointer perspective-1000 group mb-8"
          >
            <div
              className={`relative w-full h-full duration-700 transform-style-3d transition-transform rounded-3xl ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* FRONT OF CARD */}
              <div className="absolute inset-0 w-full h-full glass-panel p-8 sm:p-12 flex flex-col justify-between backface-hidden border-2 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                    Question Card #{currentIndex + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <RotateCw size={14} className="animate-spin-slow" /> Click to reveal answer
                  </span>
                </div>

                <div className="my-auto text-center">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-relaxed">
                    {currentQ.content}
                  </h3>
                </div>

                <div className="text-center text-slate-500 text-xs font-semibold">
                  Level {currentQ.difficultyLevel || 1} Difficulty • Tap anywhere to flip
                </div>
              </div>

              {/* BACK OF CARD */}
              <div className="absolute inset-0 w-full h-full glass-panel p-8 sm:p-12 flex flex-col justify-between backface-hidden rotate-y-180 border-2 border-emerald-500/40 bg-slate-900/95 shadow-[0_0_35px_rgba(16,185,129,0.2)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    Answer & Concept
                  </span>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <RotateCw size={14} /> Click to view question
                  </span>
                </div>

                <div className="my-auto space-y-4">
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">Correct Answer</span>
                    <p className="text-xl font-black text-white">
                      {options[currentQ.correctOption] || "Correct Option Choice"}
                    </p>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-medium">
                    💡 <strong>Tip</strong>: Master this concept to boost your adaptive difficulty score on upcoming test attempts!
                  </p>
                </div>

                <div className="text-center text-slate-500 text-xs font-semibold">
                  Tap to flip back
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* Card Controls */}
        <div className="w-full flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="py-3 px-5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold rounded-2xl border border-slate-700 flex items-center gap-2 transition"
          >
            <ChevronLeft size={20} /> Previous
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => markConfidence(false)}
              className="py-3 px-5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-2xl border border-red-500/30 flex items-center gap-2 transition"
            >
              <XCircle size={18} /> Need Practice
            </button>
            <button
              onClick={() => markConfidence(true)}
              className="py-3 px-5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold rounded-2xl border border-emerald-500/30 flex items-center gap-2 transition shadow-lg shadow-emerald-500/10"
            >
              <CheckCircle2 size={18} /> Got It!
            </button>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="py-3 px-5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold rounded-2xl border border-slate-700 flex items-center gap-2 transition"
          >
            Next <ChevronRight size={20} />
          </button>
        </div>
      </main>
    </div>
  );
}
