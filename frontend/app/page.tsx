"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Brain, TrendingUp, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const handleDemo = (profile: any) => {
    sessionStorage.setItem("demoProfile", JSON.stringify(profile));
    router.push("/advisor");
  };

  const demos = [
    {
      name: "Rahul",
      desc: "Young & Aggressive",
      profile: {
        name: "Rahul",
        age: 24,
        monthly_income: 60000,
        monthly_savings: 15000,
        risk_appetite: "aggressive",
        goal: "Wealth Creation",
        horizon_years: 10,
        existing_amount: 0,
        city: "Pune"
      }
    },
    {
      name: "Priya",
      desc: "Balanced & Moderate",
      profile: {
        name: "Priya",
        age: 35,
        monthly_income: 120000,
        monthly_savings: 30000,
        risk_appetite: "moderate",
        goal: "Home Purchase",
        horizon_years: 7,
        existing_amount: 500000,
        city: "Bengaluru"
      }
    },
    {
      name: "Sharma ji",
      desc: "Safe & Conservative",
      profile: {
        name: "Ramesh Sharma",
        age: 52,
        monthly_income: 90000,
        monthly_savings: 40000,
        risk_appetite: "conservative",
        goal: "Retirement",
        horizon_years: 3,
        existing_amount: 1500000,
        city: "Delhi"
      }
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          Meet <span className="text-blue-600">FinWise AI</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Your personal AI-powered financial investment advisor. Get a tailor-made mutual fund portfolio based on your unique risk profile in seconds.
        </p>
        <button
          onClick={() => router.push("/advisor")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center mx-auto"
        >
          Get My Free Investment Plan
          <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>

      {/* Demo Profiles */}
      <div className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-8">Or try a 1-click Demo Profile</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {demos.map((demo) => (
              <button
                key={demo.name}
                onClick={() => handleDemo(demo.profile)}
                className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-4 transition-colors text-left flex-1 max-w-xs mx-auto w-full"
              >
                <div className="font-bold text-lg text-gray-900">Try as {demo.name}</div>
                <div className="text-sm text-gray-500">{demo.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Powered</h3>
            <p className="text-gray-600">Uses Google Gemini AI to analyze your profile and give personalized Hinglish advice.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <TrendingUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Smart Allocation</h3>
            <p className="text-gray-600">Automatically distributes your SIP into Large, Mid, Small Cap and Safe funds.</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Risk Assessed</h3>
            <p className="text-gray-600">Custom risk-scoring algorithm ensures you only take risks you are comfortable with.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
