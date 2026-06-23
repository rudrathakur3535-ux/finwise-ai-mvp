# =============================================
# RISK SCORER — FinWise AI ka Brain
# User profile lekar 1-10 risk score deta hai
# =============================================

def calculate_risk_score(profile: dict) -> dict:
    """
    Yeh function user ka risk score calculate karta hai.
    
    Input: profile dictionary (age, income, savings, etc.)
    Output: score (1-10), category, description
    
    Score kaise banta hai:
    - Age se        → max 3 points
    - Savings rate  → max 2 points
    - Risk appetite → max 3 points  
    - Horizon       → max 2 points
    - Total         → max 10 points
    """
    
    score = 0
    breakdown = {}  # Har factor ka score track karenge
    
    # ----------------------------------------
    # FACTOR 1: Age (max 3 points)
    # Younger = higher score
    # Kyun? Younger log zyada risk le sakte hain
    # unke paas recover karne ka time hota hai
    # ----------------------------------------
    age = profile["age"]
    
    if age < 25:
        age_score = 3.0
        age_reason = "Young investor, maximum time to recover from losses"
    elif age < 30:
        age_score = 2.5
        age_reason = "Early career, good time horizon for equity"
    elif age < 35:
        age_score = 2.0
        age_reason = "Mid-career, balanced approach suitable"
    elif age < 40:
        age_score = 1.5
        age_reason = "Responsibilities increasing, moderate risk"
    elif age < 50:
        age_score = 1.0
        age_reason = "Pre-retirement phase, capital protection important"
    elif age < 55:
        age_score = 0.5
        age_reason = "Near retirement, safety preferred"
    else:
        age_score = 0.0
        age_reason = "Retirement age, capital preservation priority"
    
    score += age_score
    breakdown["age"] = {"score": age_score, "reason": age_reason}
    
    # ----------------------------------------
    # FACTOR 2: Savings Rate (max 2 points)
    # Savings / Income ratio
    # Zyada savings = zyada invest kar sakte hain = zyada risk le sakte hain
    # ----------------------------------------
    income = profile["monthly_income"]
    savings = profile["monthly_savings"]
    
    if income > 0:
        savings_rate = savings / income
    else:
        savings_rate = 0
    
    if savings_rate >= 0.40:
        savings_score = 2.0
        savings_reason = f"Excellent savings rate ({savings_rate*100:.0f}%), high investable surplus"
    elif savings_rate >= 0.25:
        savings_score = 1.5
        savings_reason = f"Good savings rate ({savings_rate*100:.0f}%), decent investable surplus"
    elif savings_rate >= 0.15:
        savings_score = 1.0
        savings_reason = f"Average savings rate ({savings_rate*100:.0f}%), moderate surplus"
    elif savings_rate >= 0.05:
        savings_score = 0.5
        savings_reason = f"Low savings rate ({savings_rate*100:.0f}%), limited surplus"
    else:
        savings_score = 0.0
        savings_reason = f"Very low savings rate ({savings_rate*100:.0f}%), minimal surplus"
    
    score += savings_score
    breakdown["savings"] = {"score": savings_score, "reason": savings_reason}
    
    # ----------------------------------------
    # FACTOR 3: Self-Stated Risk Appetite (max 3 points)
    # User khud kitna risk lena chahta hai
    # ----------------------------------------
    risk_appetite = profile["risk_appetite"].lower()
    
    if risk_appetite == "aggressive":
        appetite_score = 3.0
        appetite_reason = "User prefers high risk, high reward strategy"
    elif risk_appetite == "moderate":
        appetite_score = 2.0
        appetite_reason = "User prefers balanced risk-return approach"
    elif risk_appetite == "conservative":
        appetite_score = 1.0
        appetite_reason = "User prefers capital safety over high returns"
    else:
        appetite_score = 1.5
        appetite_reason = "Risk appetite unclear, using moderate assumption"
    
    score += appetite_score
    breakdown["risk_appetite"] = {
        "score": appetite_score,
        "reason": appetite_reason
    }
    
    # ----------------------------------------
    # FACTOR 4: Investment Horizon (max 2 points)
    # Kitne saal ke liye invest karna chahta hai
    # Zyada time = zyada risk le sakte hain
    # ----------------------------------------
    horizon = profile["horizon_years"]
    
    if horizon >= 15:
        horizon_score = 2.0
        horizon_reason = f"{horizon} years — very long horizon, equity is ideal"
    elif horizon >= 10:
        horizon_score = 1.75
        horizon_reason = f"{horizon} years — long horizon, equity works well"
    elif horizon >= 7:
        horizon_score = 1.5
        horizon_reason = f"{horizon} years — good horizon for equity"
    elif horizon >= 5:
        horizon_score = 1.0
        horizon_reason = f"{horizon} years — moderate horizon, balanced approach"
    elif horizon >= 3:
        horizon_score = 0.5
        horizon_reason = f"{horizon} years — short horizon, limit equity exposure"
    else:
        horizon_score = 0.0
        horizon_reason = f"{horizon} year(s) — very short, use liquid/debt funds"
    
    score += horizon_score
    breakdown["horizon"] = {
        "score": horizon_score,
        "reason": horizon_reason
    }
    
    # ----------------------------------------
    # FINAL SCORE: 1 se 10 ke beech clamp karo
    # ----------------------------------------
    final_score = round(min(10.0, max(1.0, score)), 1)
    
    # ----------------------------------------
    # CATEGORY: Score ke basis pe category decide karo
    # ----------------------------------------
    if final_score <= 3.0:
        category = "Conservative"
        color = "green"
        emoji = "🛡️"
        tagline = "Safety First Investor"
    elif final_score <= 5.0:
        category = "Moderate-Conservative"
        color = "blue"
        emoji = "⚖️"
        tagline = "Careful Balanced Investor"
    elif final_score <= 7.0:
        category = "Moderate"
        color = "yellow"
        emoji = "📈"
        tagline = "Balanced Growth Investor"
    elif final_score <= 8.5:
        category = "Moderate-Aggressive"
        color = "orange"
        emoji = "🚀"
        tagline = "Growth-Focused Investor"
    else:
        category = "Aggressive"
        color = "red"
        emoji = "⚡"
        tagline = "High Risk, High Reward Investor"
    
    # ----------------------------------------
    # DESCRIPTION: User ko samjhane ke liye
    # ----------------------------------------
    descriptions = {
        "Conservative": (
            "Aap apna paisa safe rakhna chahte ho. "
            "Returns thode kam honge, lekin paisa secure rahega. "
            "Debt funds aur liquid funds tumhare liye best hain."
        ),
        "Moderate-Conservative": (
            "Aap thoda risk le sakte ho lekin safety prefer karte ho. "
            "Thoda equity, zyada debt — yeh balance tumhare liye sahi hai."
        ),
        "Moderate": (
            "Aap balanced approach prefer karte ho — "
            "thoda risk lekar achhe returns banana chahte ho. "
            "Large cap aur hybrid funds ideal hain."
        ),
        "Moderate-Aggressive": (
            "Aap growth ke liye risk lene ko taiyaar ho. "
            "Mid cap aur flexi cap funds tumhare portfolio mein "
            "achha return de sakte hain long term mein."
        ),
        "Aggressive": (
            "Aap maximum returns chahte ho aur market ups-downs "
            "ke liye mentally prepared ho. Small cap aur sectoral "
            "funds high returns de sakte hain 10+ years mein."
        ),
    }
    
    return {
        "score":       final_score,
        "category":    category,
        "emoji":       emoji,
        "tagline":     tagline,
        "color":       color,
        "description": descriptions[category],
        "breakdown":   breakdown,
        "max_score":   10.0,
    }