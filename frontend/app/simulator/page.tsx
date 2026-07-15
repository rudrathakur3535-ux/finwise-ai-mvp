"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis
} from "recharts";
import {
  TrendingUp, Zap, AlertCircle, RefreshCw, Sparkles,
  IndianRupee, Activity, ShieldCheck, Target, Clock
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────

interface SimResult {
  healthScore: number;
  riskCategory: string;
  projectedNetWorth: { "1yr": number; "5yr": number; "10yr": number };
  recommendedAction: string;
  aiSummary: string;
  computedValues: {
    newMonthlyIncome: number;
    newMonthlyEmi: number;
    newMonthlySip: number;
    savingsRate: number;
    debtToIncomeRatio: number;
  };
}

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const fmt = (n: number) =>
  n >= 1_00_00_000
    ? `₹${(n / 1_00_00_000).toFixed(2)}Cr`
    : n >= 1_00_000
    ? `₹${(n / 1_00_000).toFixed(1)}L`
    : `₹${n.toLocaleString("en-IN")}`;

// ── Health Score Colour ────────────────────────────────────────────────────

function scoreColor(s: number) {
  if (s >= 75) return "#22C55E";
  if (s >= 50) return "#F59E0B";
  if (s >= 30) return "#F97316";
  return "#EF4444";
}

// ── Slider ────────────────────────────────────────────────────────────────

function Slider({
  label, value, min, max, step = 1, prefix = "", suffix = "",
  onChange, color = "#D4AF37", formatValue,
}: {
  label: string; value: number; min: number; max: number;
  step?: number; prefix?: string; suffix?: string;
  onChange: (v: number) => void; color?: string;
  formatValue?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : `${prefix}${value.toLocaleString("en-IN")}${suffix}`;
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <span style={{ fontSize: "12px", color: "rgba(241,245,249,0.7)", fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "13px", color, fontWeight: 700 }}>{display}</span>
      </div>
      <div style={{ position: "relative", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.08)" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${pct}%`, borderRadius: "3px",
          background: `linear-gradient(90deg, rgba(212,175,55,0.5), ${color})`
        }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{
            position: "absolute", inset: "-8px 0", width: "100%",
            opacity: 0, cursor: "pointer", zIndex: 1
          }}
        />
        <div style={{
          position: "absolute", top: "50%", left: `${pct}%`,
          transform: "translate(-50%,-50%)",
          width: "16px", height: "16px", borderRadius: "50%",
          background: color, border: "2px solid rgba(255,255,255,0.8)",
          boxShadow: `0 0 8px ${color}80`, pointerEvents: "none"
        }} />
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function SimulatorPage() {
  // Inputs
  const [monthlyIncome, setMonthlyIncome] = useState(60000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(35000);
  const [baseSip, setBaseSip] = useState(5000);
  const [baseEmi, setBaseEmi] = useState(0);
  const [existingCorpus, setExistingCorpus] = useState(100000);
  const [age, setAge] = useState(28);
  const [horizonYears, setHorizonYears] = useState(10);
  const [riskProfile, setRiskProfile] = useState<"conservative" | "moderate" | "aggressive">("moderate");

  // Scenario deltas
  const [deltaSip, setDeltaSip] = useState(0);
  const [deltaEmi, setDeltaEmi] = useState(0);
  const [incomeChangePct, setIncomeChangePct] = useState(0);
  const [oneTimeExpense, setOneTimeExpense] = useState(0);
  const [newRiskProfile, setNewRiskProfile] = useState<"conservative" | "moderate" | "aggressive">("moderate");

  // Result
  const [result, setResult] = useState<SimResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const runSimulation = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const res = await fetch(`${API}/api/simulate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          monthly_income: monthlyIncome,
          monthly_expenses: monthlyExpenses,
          monthly_savings: monthlyIncome - monthlyExpenses,
          existing_investments: existingCorpus,
          age,
          horizon_years: horizonYears,
          risk_profile: riskProfile,
          base_sip: baseSip,
          base_emi: baseEmi,
          delta_sip: deltaSip,
          delta_emi: deltaEmi,
          income_change_pct: incomeChangePct,
          one_time_expense: oneTimeExpense,
          new_risk_profile: newRiskProfile,
        }),
      });
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Simulation failed");
    } finally {
      setLoading(false);
    }
  }, [monthlyIncome, monthlyExpenses, baseSip, baseEmi, existingCorpus, age,
      horizonYears, riskProfile, deltaSip, deltaEmi, incomeChangePct, oneTimeExpense, newRiskProfile]);

  // Debounced auto-run
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(runSimulation, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [runSimulation]);

  // Chart data
  const chartData = result
    ? [
        { year: "Now", worth: existingCorpus },
        { year: "1 Yr", worth: result.projectedNetWorth["1yr"] },
        { year: "5 Yr", worth: result.projectedNetWorth["5yr"] },
        { year: "10 Yr", worth: result.projectedNetWorth["10yr"] },
      ]
    : [];

  const healthGaugeData = result
    ? [{ name: "Score", value: result.healthScore, fill: scoreColor(result.healthScore) }]
    : [];

  // ── Styles ──────────────────────────────────────────────────────────────

  const card = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "16px",
    padding: "24px",
    backdropFilter: "blur(12px)",
  };

  const riskOptions: Array<"conservative" | "moderate" | "aggressive"> = ["conservative", "moderate", "aggressive"];
  const riskColors: Record<string, string> = { conservative: "#22C55E", moderate: "#F59E0B", aggressive: "#EF4444" };

  return (
    <div
      className="theme-maroon theme-page-bg"
      style={{ minHeight: "100vh", paddingTop: "80px", paddingBottom: "60px" }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center", marginBottom: "48px" }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
            <div style={{
              padding: "10px 20px", borderRadius: "24px",
              background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)",
              display: "flex", alignItems: "center", gap: "8px",
              fontSize: "12px", fontWeight: 700, color: "#D4AF37", letterSpacing: "0.05em"
            }}>
              <Sparkles style={{ width: "14px", height: "14px" }} />
              AI-POWERED SCENARIO SIMULATOR
            </div>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800,
            color: "#F9FAFB", lineHeight: 1.1, marginBottom: "16px"
          }}>
            What-If{" "}
            <span style={{
              background: "linear-gradient(135deg, #D4AF37, #F59E0B)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              Life Simulator
            </span>
          </h1>
          <p style={{ color: "rgba(241,245,249,0.6)", fontSize: "16px", maxWidth: "540px", margin: "0 auto" }}>
            Sliders move karo aur dekho — ek bike lena, job switch karna, ya SIP badhana
            aapke financial future ko kaise badalta hai.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "24px" }}>

          {/* ── LEFT: Controls ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Base Profile */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <Activity style={{ width: "16px", height: "16px", color: "#D4AF37" }} />
                <span style={{ fontWeight: 700, color: "#F9FAFB", fontSize: "14px" }}>Base Profile</span>
              </div>
              <Slider label="Monthly Income" value={monthlyIncome} min={15000} max={500000} step={1000}
                prefix="₹" onChange={setMonthlyIncome} />
              <Slider label="Monthly Expenses" value={monthlyExpenses} min={5000} max={300000} step={1000}
                prefix="₹" onChange={setMonthlyExpenses} color="#94A3B8" />
              <Slider label="Current SIP" value={baseSip} min={0} max={50000} step={500}
                prefix="₹" onChange={setBaseSip} />
              <Slider label="Current EMI" value={baseEmi} min={0} max={100000} step={1000}
                prefix="₹" onChange={setBaseEmi} color="#F97316" />
              <Slider label="Existing Investments/Corpus" value={existingCorpus} min={0} max={5000000} step={10000}
                prefix="₹" onChange={setExistingCorpus} />
              <Slider label="Your Age" value={age} min={18} max={60} onChange={setAge}
                suffix=" yrs" color="#A78BFA" />
              <Slider label="Investment Horizon" value={horizonYears} min={1} max={30} onChange={setHorizonYears}
                suffix=" yrs" color="#38BDF8" />

              {/* Base Risk Profile */}
              <div style={{ marginTop: "4px" }}>
                <span style={{ fontSize: "12px", color: "rgba(241,245,249,0.7)", fontWeight: 500 }}>Current Risk Profile</span>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  {riskOptions.map(r => (
                    <button key={r} onClick={() => setRiskProfile(r)} style={{
                      flex: 1, padding: "6px 4px", borderRadius: "8px", fontSize: "11px",
                      fontWeight: 700, textTransform: "capitalize", cursor: "pointer",
                      border: riskProfile === r ? `1px solid ${riskColors[r]}` : "1px solid rgba(255,255,255,0.1)",
                      background: riskProfile === r ? `${riskColors[r]}20` : "transparent",
                      color: riskProfile === r ? riskColors[r] : "rgba(255,255,255,0.4)",
                      transition: "all 0.2s"
                    }}>{r}</button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Scenario Deltas */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }} style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                <Zap style={{ width: "16px", height: "16px", color: "#F59E0B" }} />
                <span style={{ fontWeight: 700, color: "#F9FAFB", fontSize: "14px" }}>What-If Scenarios</span>
              </div>
              <Slider label="Additional SIP" value={deltaSip} min={0} max={50000} step={500}
                prefix="+₹" onChange={setDeltaSip} />
              <Slider label="New EMI/Loan" value={deltaEmi} min={0} max={30000} step={500}
                prefix="+₹" onChange={setDeltaEmi} color="#EF4444" />
              <Slider label="Income Change" value={incomeChangePct} min={-20} max={100}
                onChange={setIncomeChangePct} color={incomeChangePct >= 0 ? "#22C55E" : "#EF4444"}
                formatValue={v => `${v >= 0 ? "+" : ""}${v}%`} />
              <Slider label="One-Time Expense (wedding/bike/etc)"
                value={oneTimeExpense} min={0} max={2000000} step={10000}
                prefix="₹" onChange={setOneTimeExpense} color="#F97316" />

              {/* New Risk Profile */}
              <div style={{ marginTop: "4px" }}>
                <span style={{ fontSize: "12px", color: "rgba(241,245,249,0.7)", fontWeight: 500 }}>New Risk Profile (after scenario)</span>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  {riskOptions.map(r => (
                    <button key={r} onClick={() => setNewRiskProfile(r)} style={{
                      flex: 1, padding: "6px 4px", borderRadius: "8px", fontSize: "11px",
                      fontWeight: 700, textTransform: "capitalize", cursor: "pointer",
                      border: newRiskProfile === r ? `1px solid ${riskColors[r]}` : "1px solid rgba(255,255,255,0.1)",
                      background: newRiskProfile === r ? `${riskColors[r]}20` : "transparent",
                      color: newRiskProfile === r ? riskColors[r] : "rgba(255,255,255,0.4)",
                      transition: "all 0.2s"
                    }}>{r}</button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT: Results ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Loading overlay */}
            {loading && !result && (
              <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
                <div style={{ textAlign: "center" }}>
                  <RefreshCw style={{ width: "32px", height: "32px", color: "#D4AF37", margin: "0 auto 12px" }} className="animate-spin" />
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Calculating your future...</p>
                </div>
              </div>
            )}

            {error && (
              <div style={{ ...card, borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FCA5A5" }}>
                  <AlertCircle style={{ width: "16px", height: "16px" }} />
                  <span style={{ fontSize: "13px" }}>{error} — Backend chal raha hai? Check karo.</span>
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key={JSON.stringify(result.projectedNetWorth)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "flex", flexDirection: "column", gap: "16px" }}
                >
                  {/* Metrics Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    {/* Health Score */}
                    <div style={{ ...card, textAlign: "center", padding: "16px" }}>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "8px", fontWeight: 600 }}>
                        HEALTH SCORE
                      </div>
                      <div style={{ height: "80px" }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart
                            innerRadius="70%" outerRadius="100%"
                            data={[{ value: result.healthScore, fill: scoreColor(result.healthScore) }]}
                            startAngle={90} endAngle={-270}
                          >
                            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                            <RadialBar background={{ fill: "rgba(255,255,255,0.05)" }}
                              dataKey="value" cornerRadius={8} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                      </div>
                      <div style={{ fontSize: "24px", fontWeight: 800, color: scoreColor(result.healthScore), marginTop: "-8px" }}>
                        {result.healthScore}
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>/ 100</div>
                    </div>

                    {/* Risk Category */}
                    <div style={{ ...card, textAlign: "center", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <ShieldCheck style={{ width: "24px", height: "24px", margin: "0 auto 8px", color: riskColors[result.riskCategory.toLowerCase()] || "#D4AF37" }} />
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", fontWeight: 600 }}>RISK PROFILE</div>
                      <div style={{ fontSize: "16px", fontWeight: 800, color: riskColors[result.riskCategory.toLowerCase()] || "#D4AF37" }}>
                        {result.riskCategory}
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>
                        DTI: {result.computedValues.debtToIncomeRatio}%
                      </div>
                    </div>

                    {/* Savings Rate */}
                    <div style={{ ...card, textAlign: "center", padding: "16px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <Target style={{ width: "24px", height: "24px", margin: "0 auto 8px", color: "#D4AF37" }} />
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "6px", fontWeight: 600 }}>SAVINGS RATE</div>
                      <div style={{ fontSize: "24px", fontWeight: 800, color: "#D4AF37" }}>
                        {result.computedValues.savingsRate}%
                      </div>
                      <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>
                        SIP: ₹{result.computedValues.newMonthlySip.toLocaleString("en-IN")}
                      </div>
                    </div>
                  </div>

                  {/* Projected Net Worth Chart */}
                  <div style={card}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <TrendingUp style={{ width: "16px", height: "16px", color: "#D4AF37" }} />
                        <span style={{ fontWeight: 700, color: "#F9FAFB", fontSize: "14px" }}>Projected Net Worth</span>
                      </div>
                      {loading && <RefreshCw style={{ width: "14px", height: "14px", color: "#D4AF37" }} className="animate-spin" />}
                    </div>

                    {/* Milestone cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "20px" }}>
                      {[
                        { label: "1 Year", val: result.projectedNetWorth["1yr"], icon: Clock },
                        { label: "5 Years", val: result.projectedNetWorth["5yr"], icon: TrendingUp },
                        { label: "10 Years", val: result.projectedNetWorth["10yr"], icon: Target },
                      ].map(({ label, val, icon: Icon }) => (
                        <div key={label} style={{
                          background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)",
                          borderRadius: "12px", padding: "12px", textAlign: "center"
                        }}>
                          <Icon style={{ width: "16px", height: "16px", color: "#D4AF37", margin: "0 auto 6px" }} />
                          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>{label}</div>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: "#D4AF37" }}>{fmt(val)}</div>
                        </div>
                      ))}
                    </div>

                    {/* Area Chart */}
                    <div style={{ height: "180px" }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <defs>
                            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                          <XAxis dataKey="year" tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tickFormatter={v => v >= 100000 ? `${(v / 100000).toFixed(0)}L` : `${v}`}
                            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                          <Tooltip
                            contentStyle={{ background: "#1A0A0D", border: "1px solid rgba(212,175,55,0.3)", borderRadius: "10px", fontSize: "12px" }}
                            labelStyle={{ color: "#D4AF37", fontWeight: 700 }}
                            formatter={(v: any) => [fmt(v), "Net Worth"]}
                          />
                          <Area type="monotone" dataKey="worth" stroke="#D4AF37" strokeWidth={2}
                            fill="url(#goldGrad)" dot={{ fill: "#D4AF37", r: 4 }} activeDot={{ r: 6 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* AI Summary */}
                  {result.aiSummary && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      style={{
                        ...card,
                        background: "rgba(212,175,55,0.06)",
                        border: "1px solid rgba(212,175,55,0.25)",
                        borderLeft: "4px solid #D4AF37"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        <Sparkles style={{ width: "18px", height: "18px", color: "#D4AF37", flexShrink: 0, marginTop: "2px" }} />
                        <div>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "#D4AF37", marginBottom: "6px", letterSpacing: "0.05em" }}>
                            FINWISE AI SUMMARY
                          </div>
                          <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(241,245,249,0.85)" }}>
                            {result.aiSummary}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Recommended Action */}
                  <div style={{
                    ...card,
                    background: "rgba(239,68,68,0.05)",
                    border: "1px solid rgba(239,68,68,0.2)"
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                      <AlertCircle style={{ width: "16px", height: "16px", color: "#F87171", flexShrink: 0, marginTop: "2px" }} />
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: "#F87171", marginBottom: "6px", letterSpacing: "0.05em" }}>
                          RECOMMENDED ACTION
                        </div>
                        <p style={{ fontSize: "13px", color: "rgba(241,245,249,0.8)", lineHeight: 1.6 }}>
                          {result.recommendedAction}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Inline slider thumb styles */}
      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:0; height:0; }
        input[type=range]::-moz-range-thumb { width:0; height:0; border:none; }
      `}</style>
    </div>
  );
}
