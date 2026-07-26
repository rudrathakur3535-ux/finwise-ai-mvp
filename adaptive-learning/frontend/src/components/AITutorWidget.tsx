import { useState } from 'react';
import { Bot, Sparkles, X, Send } from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export default function AITutorWidget({ currentTopic }: { currentTopic?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: `Hello! I'm your AI Learning Companion. ${currentTopic ? `Ask me anything about ${currentTopic} or study tips!` : 'How can I assist your study session today?'}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "💡 Give me a smart study tip",
    "🧠 How does the adaptive engine work?",
    "🔥 Which topics should I revise next?",
    "⚡ Give me a quick motivation boost"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input.trim();
    if (!query) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Generate intelligent contextual response
    setTimeout(() => {
      let botResponse = "";
      const lower = query.toLowerCase();

      if (lower.includes("tip") || lower.includes("study")) {
        botResponse = "💡 **Pro Tip**: Use the Spaced Repetition method! Focus on Level 2 & Level 3 questions in topics where your mastery score is under 70%. Taking 5-minute quick flashcard breaks boosts memory retention by 40%!";
      } else if (lower.includes("adaptive") || lower.includes("engine") || lower.includes("work")) {
        botResponse = "🧠 **Adaptive Engine Logic**: If you answer correctly under 15 seconds, the engine increases question difficulty to Level 3. If you make a mistake or time out, it provides Level 1 reinforcement to solidify your core foundations!";
      } else if (lower.includes("revise") || lower.includes("weak") || lower.includes("topic")) {
        botResponse = "🔥 **Recommended Revision**: Check your dashboard's Weakness Heatmap! Start with topics that have accuracy below 60%. Try the new 3D Flashcards mode before attempting adaptive quizzes.";
      } else if (lower.includes("motivation") || lower.includes("boost")) {
        botResponse = "⚡ **Keep Pushing!** Consistency is key. Every question you attempt builds your mastery score and unlocks new achievement badges. You're doing great!";
      } else {
        botResponse = `✨ Great question! In ${currentTopic || 'this subject'}, understanding core concepts step-by-step is key. Practice 3-5 questions daily to keep your learning streak active!`;
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponse,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold px-5 py-3.5 rounded-full shadow-[0_0_25px_rgba(99,102,241,0.5)] hover:shadow-[0_0_35px_rgba(99,102,241,0.8)] hover:scale-105 transition-all duration-300 border border-indigo-400/30"
        >
          <div className="relative">
            <Bot size={24} className="animate-bounce" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping"></span>
          </div>
          <span className="hidden sm:inline font-semibold">AI Tutor</span>
          <Sparkles size={16} className="text-amber-300 animate-pulse" />
        </button>
      )}

      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[520px] bg-slate-900/95 backdrop-blur-2xl border border-indigo-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-900/80 to-slate-900 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
                <Bot className="text-indigo-400" size={22} />
              </div>
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-1.5">
                  AI Study Tutor <Sparkles size={14} className="text-amber-400" />
                </h3>
                <p className="text-xs text-indigo-300 font-medium">Adaptive Learning Companion</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 bg-slate-800/70 text-indigo-400 p-3 rounded-2xl w-fit border border-slate-700">
                <Bot size={16} className="animate-spin" />
                <span className="text-xs font-medium animate-pulse">Thinking...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="whitespace-nowrap text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 px-3 py-1.5 rounded-full transition font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 border-t border-slate-800 bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask AI tutor a question..."
              className="flex-1 bg-slate-800/80 text-white text-sm px-4 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
            <button
              onClick={() => handleSend()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition shadow-md"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
