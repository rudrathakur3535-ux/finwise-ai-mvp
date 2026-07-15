# =============================================================
# SIMULATOR SERVICE — FinWise AI "What-If Life Simulator"
# Existing ML models reuse karke financial scenarios simulate
# =============================================================

import math
from typing import Optional


# ── Health Score Calculator ───────────────────────────────────────────────────

def calculate_health_score(
    monthly_income: float,
    monthly_expenses: float,
    monthly_savings: float,
    monthly_sip: float,
    monthly_emi: float,
    existing_corpus: float,
    age: int,
    horizon_years: int
) -> int:
    """
    Financial Health Score (0-100) calculate karo.
    Multiple factors: savings rate, debt load, investment discipline.
    """
    score = 0

    # 1. Savings Rate (max 30 pts)
    net_income = monthly_income - monthly_emi
    savings_rate = (monthly_savings / net_income) if net_income > 0 else 0
    score += min(30, int(savings_rate * 100))

    # 2. Debt-to-Income Ratio (max 25 pts)
    dti = monthly_emi / monthly_income if monthly_income > 0 else 1
    if dti < 0.2:
        score += 25
    elif dti < 0.35:
        score += 18
    elif dti < 0.5:
        score += 10
    else:
        score += 0

    # 3. SIP discipline (max 20 pts)
    sip_rate = monthly_sip / monthly_income if monthly_income > 0 else 0
    score += min(20, int(sip_rate * 100))

    # 4. Existing corpus buffer (max 15 pts)
    months_buffer = existing_corpus / monthly_expenses if monthly_expenses > 0 else 0
    if months_buffer >= 12:
        score += 15
    elif months_buffer >= 6:
        score += 10
    elif months_buffer >= 3:
        score += 5

    # 5. Age-horizon alignment (max 10 pts)
    # Younger age with longer horizon = higher score
    age_score = max(0, min(10, int((60 - age) / 5)))
    score += age_score

    return max(0, min(100, score))


# ── Net Worth Projection ──────────────────────────────────────────────────────

def project_net_worth(
    monthly_sip: float,
    annual_income: float,
    monthly_emi: float,
    one_time_expense: float,
    existing_corpus: float,
    risk_profile: str,
    horizon_years: int
) -> dict:
    """
    SIP compounding + income growth + debt drag model.
    Returns projected net worth at 1yr, 5yr, 10yr marks.
    """
    # Expected annual returns based on risk profile
    return_rates = {
        "conservative": 0.07,
        "moderate": 0.11,
        "aggressive": 0.14,
    }
    cagr = return_rates.get(risk_profile.lower(), 0.11)

    projections = {}
    for years in [1, 5, 10]:
        # SIP corpus using future value of annuity formula
        months = years * 12
        monthly_rate = cagr / 12
        if monthly_sip > 0 and monthly_rate > 0:
            sip_corpus = monthly_sip * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)
        else:
            sip_corpus = monthly_sip * months

        # Existing corpus grows at same CAGR
        existing_grown = existing_corpus * ((1 + cagr) ** years)

        # Income savings accumulated (30% of take-home savings beyond SIP)
        monthly_disposable = (annual_income / 12) - monthly_emi - monthly_sip
        cash_savings = max(0, monthly_disposable * 0.3) * months

        # One-time expense deducted (treated as immediate)
        total = existing_grown + sip_corpus + cash_savings - one_time_expense

        projections[f"{years}yr"] = max(0, round(total))

    return projections


# ── Risk Category from Profile ────────────────────────────────────────────────

def determine_risk_category(
    risk_appetite: str,
    age: int,
    savings_rate: float,
    dti: float
) -> str:
    """
    Heuristic risk re-classification after scenario changes.
    Reuses existing ML service if available, falls back to rules.
    """
    try:
        from ml.risk_ml_service import risk_ml_service
        from services.risk_scorer import calculate_risk_score

        profile = {
            "age": age,
            "monthly_income": 50000,  # normalized
            "monthly_savings": int(50000 * savings_rate),
            "risk_appetite": risk_appetite,
            "horizon_years": max(1, int((60 - age)))
        }
        rule_result = calculate_risk_score(profile)
        ml_result = risk_ml_service.predict_risk(profile, rule_result["score"])
        return ml_result.get("ml_category", rule_result["category"])
    except Exception:
        # Rule-based fallback
        if dti > 0.5 or savings_rate < 0.1:
            return "Conservative"
        if risk_appetite == "aggressive" and savings_rate > 0.25:
            return "Aggressive"
        return "Moderate"


# ── Recommended Action ────────────────────────────────────────────────────────

def get_recommended_action(
    health_score: int,
    dti: float,
    monthly_sip: float,
    monthly_income: float,
    one_time_expense: float
) -> str:
    """Generate one actionable insight based on the scenario."""
    if dti > 0.5:
        return "EMI load bahut zyada hai — pehle existing loans prepay karo ya SIP thoda kam karo."
    if health_score >= 80:
        return "Excellent! Aapki financial health score bahut strong hai. SIP maintain karte raho."
    if health_score >= 60:
        return "Achhi position hai. SIP ₹{:,.0f} tak badhane se 5-saal corpus significantly improve hoga.".format(
            monthly_sip * 1.25
        )
    if one_time_expense > monthly_income * 6:
        return "Ye ek-time expense bohot bada hai — loan lene ki bajay SIP pause karke corpus build karo."
    if monthly_sip < monthly_income * 0.15:
        return "Income ka kam se kam 15% SIP mein daalo — abhi sirf {:.0f}% invest ho raha hai.".format(
            (monthly_sip / monthly_income * 100) if monthly_income > 0 else 0
        )
    return "Scenario theek hai — monthly expenses review karo aur emergency fund ₹{:,.0f} tak banao.".format(
        monthly_income * 6
    )


# ── Main Simulate Function ────────────────────────────────────────────────────

def run_simulation(payload: dict) -> dict:
    """
    Main entry point.
    payload keys:
      - monthly_income, monthly_expenses, monthly_savings
      - existing_investments (existing corpus)
      - age, horizon_years
      - risk_profile: "conservative"/"moderate"/"aggressive"
      - delta_sip, delta_emi, emi_tenure_months
      - income_change_pct (-20 to +100)
      - one_time_expense
      - new_risk_profile (optional override)
    """
    # Base values
    monthly_income = float(payload.get("monthly_income", 50000))
    monthly_expenses = float(payload.get("monthly_expenses", 30000))
    monthly_savings = float(payload.get("monthly_savings", 20000))
    existing_corpus = float(payload.get("existing_investments", 0))
    age = int(payload.get("age", 30))
    horizon_years = int(payload.get("horizon_years", 10))
    base_risk = payload.get("risk_profile", "moderate").lower()

    # Scenario deltas
    delta_sip = float(payload.get("delta_sip", 0))
    delta_emi = float(payload.get("delta_emi", 0))
    income_change_pct = float(payload.get("income_change_pct", 0))
    one_time_expense = float(payload.get("one_time_expense", 0))
    new_risk_profile = payload.get("new_risk_profile", base_risk).lower()

    # Apply scenario
    new_income = monthly_income * (1 + income_change_pct / 100)
    new_sip = max(0, float(payload.get("base_sip", monthly_savings * 0.5)) + delta_sip)
    new_emi = float(payload.get("base_emi", 0)) + delta_emi

    net_monthly = new_income - new_emi - new_sip
    savings_rate = max(0, net_monthly / new_income) if new_income > 0 else 0
    dti = new_emi / new_income if new_income > 0 else 0

    # Health Score
    health_score = calculate_health_score(
        monthly_income=new_income,
        monthly_expenses=monthly_expenses,
        monthly_savings=net_monthly,
        monthly_sip=new_sip,
        monthly_emi=new_emi,
        existing_corpus=existing_corpus,
        age=age,
        horizon_years=horizon_years
    )

    # Net worth projections
    projected = project_net_worth(
        monthly_sip=new_sip,
        annual_income=new_income * 12,
        monthly_emi=new_emi,
        one_time_expense=one_time_expense,
        existing_corpus=existing_corpus,
        risk_profile=new_risk_profile,
        horizon_years=horizon_years
    )

    # Risk category
    risk_category = determine_risk_category(new_risk_profile, age, savings_rate, dti)

    # Recommended action
    recommended_action = get_recommended_action(
        health_score=health_score,
        dti=dti,
        monthly_sip=new_sip,
        monthly_income=new_income,
        one_time_expense=one_time_expense
    )

    return {
        "healthScore": health_score,
        "riskCategory": risk_category,
        "projectedNetWorth": projected,
        "recommendedAction": recommended_action,
        "computedValues": {
            "newMonthlyIncome": round(new_income),
            "newMonthlyEmi": round(new_emi),
            "newMonthlySip": round(new_sip),
            "savingsRate": round(savings_rate * 100, 1),
            "debtToIncomeRatio": round(dti * 100, 1)
        }
    }
