"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, User, Calendar, MapPin, ArrowRight, IndianRupee, Wallet, 
  PiggyBank, Home, GraduationCap, Plane, TrendingUp, Sparkles, AlertCircle
} from "lucide-react";
import { GradientButton } from "../../components/ui/premium/GradientButton";
import { getInvestmentAdvice } from "../../lib/api";

export default function AdvisorPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    monthly_income: 0,
    monthly_savings: 0,
    risk_appetite: "moderate" as "conservative" | "moderate" | "aggressive",
    goal: "",
    horizon_years: 10,
    existing_amount: 0,
    city: "",
  });

  const [quizAnswers, setQuizAnswers] = useState<number[]>([-1, -1, -1]);

  useEffect(() => {
    const stored = sessionStorage.getItem("demoProfile");
    if (stored) {
      sessionStorage.removeItem("demoProfile");
      const parsed = JSON.parse(stored);
      setFormData(parsed);
      // Auto advance to step 5 if it's a demo profile
      if (parsed.name) setCurrentStep(5);
    }
  }, []);

  const updateData = (fields: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getInvestmentAdvice(formData);
      localStorage.setItem("finwise_result", JSON.stringify(result));
      router.push("/results");
    } catch (err: any) {
      console.warn("Backend unavailable, using mock data for demo.");
      const mockResult = {
        status: "success",
        user_profile: {
          age: formData.age,
          monthly_income: formData.monthly_income,
          monthly_savings: formData.monthly_savings,
          risk_appetite: formData.risk_appetite,
          horizon_years: formData.horizon_years,
        },
        risk_assessment: {
          score: formData.risk_appetite === "aggressive" ? 9 : formData.risk_appetite === "moderate" ? 7 : 4,
          max_score: 10,
          category: formData.risk_appetite === "aggressive" ? "High Risk" : formData.risk_appetite === "moderate" ? "Moderate-Aggressive" : "Conservative",
          emoji: "🚀",
          tagline: formData.risk_appetite === "aggressive" ? "Maximum Growth" : formData.risk_appetite === "moderate" ? "High Growth" : "Capital Protection",
          color: "amber",
          description: "Growth-focused investor",
          breakdown: {}
        },
        portfolio: {
          allocation: {
            equity_percent: 85,
            safe_percent: 10,
            gold_percent: 5,
            detail: { "Large Cap": 40, "Mid Cap": 30, "Small Cap": 15, "Debt": 10, "Gold": 5 }
          },
          total_sip: formData.monthly_savings,
          total_corpus: formData.monthly_savings * 12 * formData.horizon_years * 1.8
        },
        ai_advice: "Based on your inputs, we have selected a balanced approach to maximize growth while managing volatility. This allocation is perfectly suited for your time horizon.",
        recommended_funds: [
          { 
            name: "Parag Parikh Flexi Cap Fund", 
            category: "Flexi Cap", 
            rating: 5, 
            monthly_sip: formData.monthly_savings * 0.4, 
            returns: { "3y": 22.5 }, 
            description: "Excellent downside protection and global exposure." 
          },
          { 
            name: "Quant Small Cap Fund", 
            category: "Small Cap", 
            rating: 5, 
            monthly_sip: formData.monthly_savings * 0.3, 
            returns: { "3y": 35.2 }, 
            description: "High alpha generation for long-term growth." 
          },
          { 
            name: "Axis Bluechip Fund", 
            category: "Large Cap", 
            rating: 4, 
            monthly_sip: formData.monthly_savings * 0.3, 
            returns: { "3y": 15.4 }, 
            description: "Stability during market downturns with consistent returns." 
          }
        ]
      };
      localStorage.setItem("finwise_result", JSON.stringify(mockResult));
      setTimeout(() => router.push("/results"), 800);
    }
  };

  // Steps Configuration
  const steps = [
    { id: 1, title: "Basic Info" },
    { id: 2, title: "Finances" },
    { id: 3, title: "Goals" },
    { id: 4, title: "Risk Quiz" },
    { id: 5, title: "Review" },
  ];

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pt-[64px]">
      
      {/* LEFT PANEL - Sticky Progress */}
      <div className="w-full md:w-[35%] bg-purple-50/50 border-r border-purple-100 p-8 md:p-12 md:sticky md:top-[64px] md:h-[calc(100vh-64px)] flex flex-col justify-between relative z-10">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-10 flex items-center">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-500 flex items-center justify-center mr-3 shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </span>
            Advisor
          </h2>

          <div className="space-y-6 relative">
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-purple-100 -z-10"></div>
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;
              return (
                <div key={step.id} className="flex items-center space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted ? "bg-emerald-500 border-emerald-500 text-white" :
                    isActive ? "bg-purple-100 border-purple-600 text-purple-700 font-bold shadow-[0_0_12px_rgba(124,58,237,0.3)]" :
                    "bg-white border-gray-200 text-gray-400"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : (isActive ? <div className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse" /> : step.id)}
                  </div>
                  <span className={`font-semibold text-lg transition-colors ${
                    isActive ? "text-purple-700" :
                    isCompleted ? "text-gray-900" :
                    "text-gray-400"
                  }`}>{step.title}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-white rounded-2xl p-6 border border-purple-100 shadow-sm">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Your Profile So Far</h4>
            <div className="space-y-2 text-sm text-gray-600 font-medium">
              <p>👤 {formData.name || "—"}{formData.age ? `, ${formData.age} yrs` : ""}</p>
              <p>💰 {formData.monthly_income ? `₹${formData.monthly_income.toLocaleString()} income` : "—"}</p>
              <p>🎯 {formData.goal || "—"}</p>
            </div>
          </div>
        </div>

        <div className="hidden md:block mt-8 text-center text-sm font-bold text-purple-600/60">
          2 minutes to your financial freedom! 🚀
        </div>
      </div>

      {/* RIGHT PANEL - Forms */}
      <div className="w-full md:w-[65%] p-6 md:p-16 lg:p-24 bg-white relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="max-w-xl mx-auto w-full"
          >
            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-center font-medium">
                <AlertCircle className="w-5 h-5 mr-2" /> {error}
              </div>
            )}

            {/* STEP 1 */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Let's get started! 👋</h1>
                  <p className="text-gray-500 text-lg">Tell us a bit about yourself</p>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={(e) => updateData({ name: e.target.value })}
                        placeholder="Enter your full name"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
                    <div className="relative group">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <input 
                        type="number" 
                        value={formData.age || ""} 
                        onChange={(e) => updateData({ age: parseInt(e.target.value) || 0 })}
                        placeholder="Your age (18-80)"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City <span className="text-gray-400 font-normal">(optional)</span></label>
                    <div className="relative group">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <input 
                        type="text" 
                        value={formData.city} 
                        onChange={(e) => updateData({ city: e.target.value })}
                        placeholder="Your city"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <GradientButton 
                    gradient="purple" 
                    onClick={nextStep} 
                    disabled={!formData.name.trim() || formData.age < 18 || formData.age > 80}
                    className="w-full text-lg !py-4"
                  >
                    Next Step <ArrowRight className="ml-2 w-5 h-5" />
                  </GradientButton>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Your finances 💰</h1>
                  <p className="text-gray-500 text-lg">This helps us calculate your investable amount</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Income</label>
                    <div className="relative group">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <input 
                        type="number" 
                        value={formData.monthly_income || ""} 
                        onChange={(e) => updateData({ monthly_income: parseInt(e.target.value) || 0 })}
                        placeholder="e.g. 60000"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-gray-900 text-lg placeholder:text-gray-400 placeholder:font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Monthly Savings</label>
                    <div className="relative group">
                      <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <input 
                        type="number" 
                        value={formData.monthly_savings || ""} 
                        onChange={(e) => updateData({ monthly_savings: parseInt(e.target.value) || 0 })}
                        placeholder="e.g. 15000"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-bold text-gray-900 text-lg placeholder:text-gray-400 placeholder:font-medium"
                      />
                    </div>
                    {formData.monthly_income > 0 && formData.monthly_savings > 0 && (
                      <div className="mt-3">
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (formData.monthly_savings / formData.monthly_income) * 100)}%` }}
                            className={`h-full ${
                              (formData.monthly_savings / formData.monthly_income) > 0.2 ? 'bg-emerald-500' :
                              (formData.monthly_savings / formData.monthly_income) >= 0.1 ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                          />
                        </div>
                        <p className="text-xs font-bold mt-2 text-gray-500">
                          You save {Math.round((formData.monthly_savings / formData.monthly_income) * 100)}% of income
                          {(formData.monthly_savings / formData.monthly_income) > 0.2 ? ' 👍' : ''}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Existing Investments <span className="text-gray-400 font-normal">(optional)</span></label>
                    <div className="relative group">
                      <PiggyBank className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
                      <input 
                        type="number" 
                        value={formData.existing_amount || ""} 
                        onChange={(e) => updateData({ existing_amount: parseInt(e.target.value) || 0 })}
                        placeholder="What you've already invested"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  
                  {formData.monthly_savings > 0 && (
                    <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-xl">
                      <p className="text-sm font-bold text-purple-900">
                        💡 You can invest ₹{Math.round(formData.monthly_savings * 0.6).toLocaleString()}/month 
                        <span className="font-medium text-purple-700 ml-1">(60% of your savings)</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex space-x-4">
                  <button onClick={prevStep} className="px-6 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Back</button>
                  <GradientButton 
                    gradient="purple" 
                    onClick={nextStep} 
                    disabled={!formData.monthly_income || !formData.monthly_savings || formData.monthly_savings > formData.monthly_income}
                    className="flex-1 text-lg !py-4"
                  >
                    Next Step <ArrowRight className="ml-2 w-5 h-5" />
                  </GradientButton>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Your financial goal 🎯</h1>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: "Buy a Home", icon: "🏠", desc: "Save for down payment" },
                    { title: "Child's Education", icon: "🎓", desc: "Secure their future" },
                    { title: "Retirement", icon: "🌴", desc: "Comfortable retired life" },
                    { title: "Wealth Creation", icon: "💎", desc: "Grow your money" },
                  ].map((g) => (
                    <motion.div 
                      key={g.title}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => updateData({ goal: g.title })}
                      className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 ${
                        formData.goal === g.title 
                          ? "border-purple-500 bg-purple-50/50 shadow-md shadow-purple-500/10" 
                          : "border-gray-100 bg-white hover:border-purple-200"
                      }`}
                    >
                      <div className="text-4xl mb-3">{g.icon}</div>
                      <h4 className="font-bold text-gray-900">{g.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 font-medium">{g.desc}</p>
                      {formData.goal === g.title && (
                        <div className="absolute top-4 right-4 text-purple-600">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <label className="block text-sm font-bold text-gray-700">Investment Horizon</label>
                    <span className="text-2xl font-black text-purple-600 bg-purple-50 px-4 py-1 rounded-lg">
                      {formData.horizon_years} <span className="text-sm font-bold">Years</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={formData.horizon_years}
                    onChange={(e) => updateData({ horizon_years: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-purple-600 hover:accent-purple-500 transition-all"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-3 font-semibold px-1">
                    <span>Short (1-3y)</span>
                    <span>Medium (5-7y)</span>
                    <span>Long (10y+)</span>
                    <span>Very Long (20y+)</span>
                  </div>
                </div>

                <div className="pt-4 flex space-x-4">
                  <button onClick={prevStep} className="px-6 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Back</button>
                  <GradientButton 
                    gradient="purple" 
                    onClick={nextStep} 
                    disabled={!formData.goal}
                    className="flex-1 text-lg !py-4"
                  >
                    Next Step <ArrowRight className="ml-2 w-5 h-5" />
                  </GradientButton>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Your risk personality 🎲</h1>
                  <p className="text-gray-500 text-lg">3 quick questions</p>
                </div>
                
                <div className="space-y-10">
                  {[
                    { q: "Market crashes 20%. You?", opts: [{ t: "Sell everything immediately", s: 1, l: "A" }, { t: "Wait and watch", s: 2, l: "B" }, { t: "Buy more — great opportunity!", s: 3, l: "C" }] },
                    { q: "Your ideal investment horizon?", opts: [{ t: "Less than 3 years", s: 1, l: "A" }, { t: "3 to 7 years", s: 2, l: "B" }, { t: "7 years or more", s: 3, l: "C" }] },
                    { q: "If SIP is missed this month?", opts: [{ t: "Very stressed — money is tight", s: 1, l: "A" }, { t: "Slightly concerned", s: 2, l: "B" }, { t: "No problem — I have backup", s: 3, l: "C" }] },
                  ].map((q, qIndex) => (
                    <div key={qIndex}>
                      <h3 className="font-bold text-gray-900 text-xl mb-4">{qIndex + 1}. {q.q}</h3>
                      <div className="space-y-3">
                        {q.opts.map((opt, oIndex) => {
                          const isSelected = quizAnswers[qIndex] === opt.s;
                          return (
                            <motion.div
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              key={oIndex}
                              onClick={() => {
                                const newAnswers = [...quizAnswers];
                                newAnswers[qIndex] = opt.s;
                                setQuizAnswers(newAnswers);
                                
                                // Auto advance/calculate logic
                                if (!newAnswers.includes(-1)) {
                                  const totalScore = newAnswers.reduce((sum, val) => sum + val, 0);
                                  let appetite: "conservative" | "moderate" | "aggressive" = "moderate";
                                  if (totalScore <= 4) appetite = "conservative";
                                  else if (totalScore <= 7) appetite = "moderate";
                                  else appetite = "aggressive";
                                  updateData({ risk_appetite: appetite });
                                  setTimeout(nextStep, 600); // Small delay for UX
                                }
                              }}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 flex items-center ${
                                isSelected 
                                  ? "border-purple-500 bg-purple-50 text-purple-900 font-bold shadow-md shadow-purple-500/10" 
                                  : "border-gray-100 hover:border-purple-200 text-gray-700 bg-white"
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 font-bold text-sm ${isSelected ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                                {opt.l}
                              </div>
                              {opt.t}
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex space-x-4">
                  <button onClick={prevStep} className="px-6 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">Back</button>
                  <GradientButton 
                    gradient="purple" 
                    onClick={nextStep} 
                    disabled={quizAnswers.includes(-1)}
                    className="flex-1 text-lg !py-4"
                  >
                    Next Step <ArrowRight className="ml-2 w-5 h-5" />
                  </GradientButton>
                </div>
              </div>
            )}

            {/* STEP 5 */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Ready to go! 🚀</h1>
                </div>
                
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-8">
                  <div className="grid grid-cols-2 gap-y-8 gap-x-6">
                    {[
                      { label: "Full Name", val: formData.name },
                      { label: "Age", val: `${formData.age} years` },
                      { label: "Monthly Income", val: `₹${formData.monthly_income.toLocaleString()}` },
                      { label: "Monthly Savings", val: `₹${formData.monthly_savings.toLocaleString()}` },
                      { label: "Primary Goal", val: formData.goal },
                      { label: "Time Horizon", val: `${formData.horizon_years} years` },
                    ].map((item, i) => (
                      <div key={i}>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{item.label}</p>
                        <p className="font-bold text-lg text-gray-900">{item.val}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Calculated Risk Appetite</p>
                    <div className="inline-flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
                      <span className="text-xl">⚡</span>
                      <span className="font-black text-lg text-purple-700 capitalize">{formData.risk_appetite} Investor</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex space-x-4">
                  <button onClick={prevStep} disabled={isLoading} className="px-6 py-4 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50">Edit</button>
                  <GradientButton 
                    gradient="purple" 
                    onClick={handleSubmit} 
                    loading={isLoading}
                    className="flex-1 text-lg !py-4 shadow-[0_8px_30px_rgba(124,58,237,0.3)]"
                  >
                    ✨ Generate My Investment Plan
                  </GradientButton>
                </div>
                
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 space-y-3 px-4">
                    {[
                      "🔍 Analyzing your risk profile...",
                      "📊 Fetching 200+ mutual funds...",
                      "🧮 Calculating your allocation...",
                      "🤖 Generating AI explanation..."
                    ].map((t, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: i * 1.2 }} 
                        key={i} 
                        className="flex items-center text-sm font-bold text-gray-600"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2" /> {t}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
