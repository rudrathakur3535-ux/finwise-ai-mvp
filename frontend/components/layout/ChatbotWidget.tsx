"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Sparkles, Bot, Mic, MicOff, Volume2, VolumeX, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

type VoiceState = "idle" | "listening" | "processing";

// ─── Constants ───────────────────────────────────────────────────────────────

const SUGGESTED_PROMPTS = [
  "Mera risk profile kya hai?",
  "Best ELSS funds batao",
  "SIP kaise start karu?",
  "Market down hai, kya karu?"
];

const GOLD = "#D4AF37";
const GOLD_DIM = "rgba(212, 175, 55, 0.15)";
const MAROON_DARK = "rgba(26, 10, 13, 0.85)";
const MAROON_DARKER = "rgba(26, 10, 13, 0.95)";
const MAROON_CARD = "rgba(42, 20, 24, 0.6)";
const MAROON_USER = "rgba(58, 22, 32, 0.8)";

// ─── Browser Feature Detection ─────────────────────────────────────────────

function detectVoiceSupport() {
  if (typeof window === "undefined") return { stt: false, tts: false };
  const stt = !!(
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition
  );
  const tts = !!(window.speechSynthesis);
  return { stt, tts };
}

// ─── TTS Helper ─────────────────────────────────────────────────────────────

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  // Prefer: hi-IN > en-IN > en-US female
  const priority = ["hi-IN", "en-IN", "en-US"];
  for (const lang of priority) {
    const match = voices.find(v => v.lang === lang);
    if (match) return match;
  }
  return voices[0] ?? null;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Namaste! Main FinWise AI Assistant hoon. Aap apne finances ya app se related koi bhi sawal pooch sakte hain. 🙏"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ── Voice states ──
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingMsgIdx, setSpeakingMsgIdx] = useState<number | null>(null);
  const [voiceSupport, setVoiceSupport] = useState({ stt: false, tts: false });

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // ── Init voice support on mount ──
  useEffect(() => {
    setVoiceSupport(detectVoiceSupport());
    // Pre-load voices
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  // ── Auto scroll ──
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // ── Stop recognition on unmount / close ──
  useEffect(() => {
    if (!isOpen && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [isOpen]);

  // ─── Send Message ───────────────────────────────────────────────────────────

  const handleSend = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      const userMessage: Message = { role: "user", content: text.trim() };
      setMessages(prev => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const API_BASE_URL =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        const payload = {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          user_context: user
            ? { name: user.name, subscription_tier: user.subscription_tier }
            : null
        };

        const res = await fetch(`${API_BASE_URL}/api/advisor/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Failed to get response");

        const data = await res.json();
        const replyMsg: Message = { role: "assistant", content: data.reply };
        setMessages(prev => {
          const updated = [...prev, replyMsg];
          // Auto-speak if enabled
          if (autoSpeak && voiceSupport.tts) {
            speakText(data.reply, updated.length - 1);
          }
          return updated;
        });
      } catch {
        setMessages(prev => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, abhi network issue chal raha hai. Please thodi der baad try karein. 🙏"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, user, autoSpeak, voiceSupport.tts]
  );

  // ─── STT: Start Listening ──────────────────────────────────────────────────

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    setVoiceError(null);

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setVoiceState("listening");

    recognition.onresult = (event: any) => {
      setVoiceState("processing");
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setVoiceState("idle");
    };

    recognition.onerror = (event: any) => {
      setVoiceState("idle");
      if (event.error === "not-allowed") {
        setVoiceError("Microphone access allow karo voice feature use karne ke liye.");
      } else if (event.error === "no-speech") {
        setVoiceError("Koi awaaz nahi suni. Dobara try karein.");
      } else {
        setVoiceError("Voice recognition mein error aaya. Dobara try karein.");
      }
      setTimeout(() => setVoiceError(null), 3000);
    };

    recognition.onend = () => {
      if (voiceState === "listening") setVoiceState("idle");
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceState]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setVoiceState("idle");
  }, []);

  // ─── TTS: Speak Text ───────────────────────────────────────────────────────

  const speakText = useCallback((text: string, msgIdx?: number) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = getBestVoice();
    if (voice) utterance.voice = voice;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    if (msgIdx !== undefined) {
      utterance.onstart = () => setSpeakingMsgIdx(msgIdx);
      utterance.onend = () => setSpeakingMsgIdx(null);
      utterance.onerror = () => setSpeakingMsgIdx(null);
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeakingMsgIdx(null);
  }, []);

  // ─── Key Handler ──────────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
    if (e.key === "Escape") setIsOpen(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col items-end"
      style={{ position: "fixed", bottom: "40px", right: "40px", zIndex: 2147483647 }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              marginBottom: "16px",
              width: "380px",
              maxWidth: "calc(100vw - 2rem)",
              height: "580px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              borderRadius: "16px",
              overflow: "hidden",
              background: MAROON_DARK,
              backdropFilter: "blur(20px)",
              border: `1px solid rgba(212, 175, 55, 0.2)`,
              boxShadow:
                "0 10px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(212, 175, 55, 0.1)"
            }}
          >
            {/* ── Header ── */}
            <div
              style={{
                padding: "14px 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(to right, rgba(37,15,20,0.95), rgba(26,10,13,0.95))",
                borderBottom: "1px solid rgba(255,255,255,0.05)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "32px", height: "32px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: GOLD_DIM
                  }}
                >
                  <Bot style={{ width: "18px", height: "18px", color: GOLD }} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: "#F9FAFB", fontSize: "13px" }}>
                    FinWise Assistant
                  </div>
                  <div style={{ fontSize: "10px", color: GOLD, display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E", display: "inline-block" }} className="animate-pulse" />
                    Online
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {/* Auto-speak toggle */}
                {voiceSupport.tts && (
                  <button
                    onClick={() => { setAutoSpeak(p => !p); if (speakingMsgIdx !== null) stopSpeaking(); }}
                    title={autoSpeak ? "Auto-speak On" : "Auto-speak Off"}
                    style={{
                      padding: "6px", borderRadius: "8px", border: "none", cursor: "pointer",
                      background: autoSpeak ? GOLD_DIM : "transparent",
                      color: autoSpeak ? GOLD : "rgba(255,255,255,0.4)",
                      transition: "all 0.2s"
                    }}
                  >
                    {autoSpeak ? <Volume2 style={{ width: "15px", height: "15px" }} /> : <VolumeX style={{ width: "15px", height: "15px" }} />}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    padding: "6px", borderRadius: "8px", border: "none", cursor: "pointer",
                    background: "transparent", color: "rgba(255,255,255,0.4)",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={e => (e.currentTarget.style.color = "#fff")}
                  onMouseOut={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                >
                  <X style={{ width: "18px", height: "18px" }} />
                </button>
              </div>
            </div>

            {/* ── Listening Banner ── */}
            <AnimatePresence>
              {voiceState !== "idle" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{
                    background: voiceState === "listening"
                      ? "rgba(239, 68, 68, 0.15)"
                      : GOLD_DIM,
                    borderBottom: `1px solid ${voiceState === "listening" ? "rgba(239,68,68,0.3)" : "rgba(212,175,55,0.2)"}`,
                    padding: "8px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12px",
                    color: voiceState === "listening" ? "#FCA5A5" : GOLD,
                    overflow: "hidden"
                  }}
                >
                  {voiceState === "listening" ? (
                    <>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#EF4444", display: "inline-block" }} className="animate-pulse" />
                      Sun raha hoon... (Bolna shuru karo)
                    </>
                  ) : (
                    <>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: GOLD, display: "inline-block" }} className="animate-pulse" />
                      Processing...
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Voice Error ── */}
            <AnimatePresence>
              {voiceError && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    borderBottom: "1px solid rgba(239,68,68,0.2)",
                    padding: "8px 20px",
                    fontSize: "11px",
                    color: "#FCA5A5",
                    overflow: "hidden"
                  }}
                >
                  ⚠️ {voiceError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Messages ── */}
            <div
              style={{
                flex: 1, overflowY: "auto", padding: "20px",
                display: "flex", flexDirection: "column", gap: "14px",
                scrollbarWidth: "thin", scrollbarColor: `rgba(212,175,55,0.2) transparent`
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
                  }}
                >
                  <div style={{ maxWidth: "85%", position: "relative" }}>
                    <div
                      style={{
                        borderRadius: "16px",
                        borderBottomRightRadius: msg.role === "user" ? "4px" : "16px",
                        borderBottomLeftRadius: msg.role === "assistant" ? "4px" : "16px",
                        padding: "10px 14px",
                        fontSize: "13px",
                        lineHeight: "1.6",
                        color: msg.role === "user" ? "#fff" : "#E2E8F0",
                        background: msg.role === "user" ? MAROON_USER : MAROON_CARD,
                        border: msg.role === "user"
                          ? "1px solid rgba(255,255,255,0.1)"
                          : `1px solid rgba(212,175,55,0.15)`,
                        borderLeft: msg.role === "assistant" ? `3px solid ${GOLD}` : undefined,
                        paddingRight: msg.role === "assistant" && voiceSupport.tts ? "32px" : "14px"
                      }}
                    >
                      {msg.content}
                    </div>

                    {/* Speaker button for assistant messages */}
                    {msg.role === "assistant" && voiceSupport.tts && (
                      <button
                        onClick={() =>
                          speakingMsgIdx === idx
                            ? stopSpeaking()
                            : speakText(msg.content, idx)
                        }
                        title={speakingMsgIdx === idx ? "Stop" : "Sunaao"}
                        style={{
                          position: "absolute", bottom: "6px", right: "6px",
                          padding: "3px", borderRadius: "6px", border: "none",
                          cursor: "pointer",
                          background: speakingMsgIdx === idx ? GOLD_DIM : "transparent",
                          color: speakingMsgIdx === idx ? GOLD : "rgba(212,175,55,0.4)",
                          transition: "all 0.2s"
                        }}
                        onMouseOver={e => (e.currentTarget.style.color = GOLD)}
                        onMouseOut={e => {
                          if (speakingMsgIdx !== idx)
                            e.currentTarget.style.color = "rgba(212,175,55,0.4)";
                        }}
                      >
                        {speakingMsgIdx === idx
                          ? <Square style={{ width: "11px", height: "11px" }} />
                          : <Volume2 style={{ width: "11px", height: "11px" }} />
                        }
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing dots */}
              {isLoading && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      borderRadius: "16px", borderBottomLeftRadius: "4px",
                      padding: "12px 16px",
                      background: MAROON_CARD,
                      border: `1px solid rgba(212,175,55,0.15)`,
                      borderLeft: `3px solid ${GOLD}`,
                      display: "flex", gap: "5px", alignItems: "center"
                    }}
                  >
                    {[0, 150, 300].map(delay => (
                      <div
                        key={delay}
                        className="animate-bounce"
                        style={{
                          width: "6px", height: "6px", borderRadius: "50%",
                          background: GOLD, animationDelay: `${delay}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Suggestion chips (first message only) ── */}
            {messages.length === 1 && !isLoading && (
              <div style={{ padding: "0 20px 10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {SUGGESTED_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(prompt)}
                    style={{
                      fontSize: "11px", padding: "5px 12px", borderRadius: "20px",
                      border: `1px solid rgba(212,175,55,0.3)`,
                      background: GOLD_DIM, color: GOLD,
                      cursor: "pointer", transition: "all 0.15s"
                    }}
                    onMouseOver={e => (e.currentTarget.style.background = "rgba(212,175,55,0.25)")}
                    onMouseOut={e => (e.currentTarget.style.background = GOLD_DIM)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* ── Input Area ── */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                background: MAROON_DARKER
              }}
            >
              <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Text input */}
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={voiceState === "listening" ? "Sun raha hoon..." : "Ask about your finances..."}
                  style={{
                    flex: 1,
                    background: "#120709",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    padding: "10px 16px",
                    fontSize: "13px",
                    color: "#fff",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.5)")}
                  onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
                />

                {/* Mic button */}
                {voiceSupport.stt && (
                  <button
                    onClick={voiceState === "listening" ? stopListening : startListening}
                    aria-label={voiceState === "listening" ? "Recording band karo" : "Voice input shuru karo"}
                    style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: "none", cursor: "pointer", flexShrink: 0,
                      transition: "all 0.2s",
                      background: voiceState === "listening"
                        ? "rgba(239, 68, 68, 0.8)"
                        : GOLD_DIM,
                      color: voiceState === "listening" ? "#fff" : GOLD,
                      boxShadow: voiceState === "listening"
                        ? "0 0 0 4px rgba(239,68,68,0.3)"
                        : "none"
                    }}
                  >
                    {voiceState === "listening"
                      ? <MicOff style={{ width: "16px", height: "16px" }} />
                      : <Mic style={{ width: "16px", height: "16px" }} />
                    }
                  </button>
                )}

                {/* Send button */}
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isLoading}
                  style={{
                    width: "38px", height: "38px", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "none", cursor: "pointer", flexShrink: 0,
                    background: input.trim() && !isLoading ? GOLD : GOLD_DIM,
                    color: input.trim() && !isLoading ? "#1A0A0D" : "rgba(212,175,55,0.4)",
                    transition: "all 0.2s",
                    opacity: !input.trim() || isLoading ? 0.5 : 1
                  }}
                >
                  <Send style={{ width: "16px", height: "16px" }} />
                </button>
              </div>

              {/* Voice hint text */}
              {voiceSupport.stt && (
                <div style={{ textAlign: "center", marginTop: "6px", fontSize: "10px", color: "rgba(212,175,55,0.35)" }}>
                  🎙️ Mic tap karo aur bolna shuru karo
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Launch Button ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open FinWise AI Chat Assistant"
        style={{
          width: "64px", height: "64px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #D4AF37, #B8860B)",
          border: "2px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 0 0 4px rgba(212,175,55,0.3), 0 8px 32px rgba(0,0,0,0.6), 0 0 40px rgba(212,175,55,0.4)",
          cursor: "pointer", position: "relative", transition: "transform 0.2s ease",
          flexShrink: 0
        }}
        onMouseOver={e => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
      >
        {/* Outer pulse ring */}
        <div
          className="animate-ping"
          style={{
            position: "absolute", inset: "-6px", borderRadius: "50%",
            border: "2px solid rgba(212,175,55,0.5)",
            opacity: 0.5
          }}
        />
        {isOpen
          ? <X style={{ width: "28px", height: "28px", color: "#1A0A0D", position: "relative", zIndex: 1 }} />
          : <Sparkles style={{ width: "28px", height: "28px", color: "#1A0A0D", position: "relative", zIndex: 1 }} />
        }
        {!isOpen && messages.length > 1 && (
          <div style={{
            position: "absolute", top: "-2px", right: "-2px",
            width: "16px", height: "16px", borderRadius: "50%",
            background: "#EF4444", border: "2px solid white"
          }} />
        )}
      </button>
    </div>
  );
}
