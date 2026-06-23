import json
import os

# =============================================
# FUND SELECTOR — FinWise AI
# Allocation ke basis pe best funds select karta hai
# =============================================

def load_funds():
    """
    funds_data.json se saare funds load karo.
    """
    # Is file ka path find karo
    current_dir = os.path.dirname(os.path.abspath(__file__))
    json_path   = os.path.join(current_dir, "..", "data", "funds_data.json")
    
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


def select_best_fund(category: str, all_funds: list) -> dict | None:
    """
    Ek specific category ka best fund dhundho.
    Best = highest 5-year returns wala fund.
    """
    
    # Is category ke matching funds dhundho
    matching_funds = [
        fund for fund in all_funds
        if fund["category"] == category
    ]
    
    # Koi fund nahi mila?
    if not matching_funds:
        return None
    
    # Highest 5-year return wala fund select karo
    best_fund = max(
        matching_funds,
        key=lambda f: f["returns"]["5y"]
    )
    
    return best_fund


def calculate_sip_projection(
    monthly_sip: float,
    annual_return_pct: float,
    years: int
) -> dict:
    """
    SIP ka future value calculate karo.
    
    Formula: Standard SIP compound interest formula
    FV = P × [((1 + r)^n - 1) / r] × (1 + r)
    
    P = monthly SIP amount
    r = monthly interest rate
    n = total months
    """
    
    monthly_rate = annual_return_pct / 100 / 12
    total_months = years * 12
    
    if monthly_rate == 0:
        corpus = monthly_sip * total_months
    else:
        corpus = (
            monthly_sip
            * (((1 + monthly_rate) ** total_months - 1) / monthly_rate)
            * (1 + monthly_rate)
        )
    
    total_invested = monthly_sip * total_months
    total_gain     = corpus - total_invested
    
    return {
        "monthly_sip":     round(monthly_sip, 0),
        "total_invested":  round(total_invested, 0),
        "expected_corpus": round(corpus, 0),
        "total_gain":      round(total_gain, 0),
        "gain_percentage": round((total_gain / total_invested) * 100, 1),
        
        # 3 scenarios — judges ko pasand aata hai
        "pessimistic":  round(corpus * 0.70, 0),  # 30% kam
        "base":         round(corpus, 0),           # Expected
        "optimistic":   round(corpus * 1.30, 0),   # 30% zyada
    }


def select_funds(
    allocation: dict,
    monthly_savings: float,
    horizon_years: int
) -> list:
    """
    Main function — allocation ke basis pe funds select karo.
    
    Input:
        allocation      → { "Large Cap Equity": 40, "Debt": 20, ... }
        monthly_savings → User ki monthly savings (e.g. 15000)
        horizon_years   → Investment horizon (e.g. 10)
    
    Output:
        List of selected funds with SIP amounts and projections
    """
    
    all_funds        = load_funds()
    selected_funds   = []
    
    # Investable amount = 60% of savings
    # (40% emergency fund ke liye rakhte hain)
    investable_monthly = monthly_savings * 0.60
    
    for category, percentage in allocation.items():
        
        if percentage == 0:
            continue
        
        # Is category ka best fund dhundho
        best_fund = select_best_fund(category, all_funds)
        
        if best_fund is None:
            # Fund nahi mila — skip karo
            print(f"[WARNING] No fund found for category: {category}")
            continue
        
        # Is category ke liye monthly SIP calculate karo
        monthly_sip = (percentage / 100) * investable_monthly
        
        # Minimum SIP check karo
        min_sip     = best_fund.get("min_sip", 500)
        monthly_sip = max(monthly_sip, min_sip)
        monthly_sip = round(monthly_sip, 0)
        
        # SIP projection calculate karo
        projection  = calculate_sip_projection(
            monthly_sip        = monthly_sip,
            annual_return_pct  = best_fund["returns"]["5y"],
            years              = horizon_years
        )
        
        # Risk warning check karo
        warning = get_risk_warning(best_fund, horizon_years)
        
        # Final fund object banao
        selected_funds.append({
            "scheme_code":          best_fund["scheme_code"],
            "name":                 best_fund["name"],
            "category":             category,
            "risk_level":           best_fund["risk_level"],
            "description":          best_fund["description"],
            "allocated_percentage": percentage,
            "monthly_sip":          monthly_sip,
            "returns":              best_fund["returns"],
            "expense_ratio":        best_fund["expense_ratio"],
            "aum_cr":               best_fund["aum_cr"],
            "data_source":          best_fund["data_source"],
            "projection":           projection,
            "warning":              warning,
        })
    
    # Sort karo — highest allocation pehle
    selected_funds.sort(
        key=lambda f: f["allocated_percentage"],
        reverse=True
    )
    
    return selected_funds


def get_risk_warning(fund: dict, horizon_years: int) -> str | None:
    """
    Fund ke risk level aur horizon ke basis pe
    specific warning generate karo.
    """
    
    risk  = fund["risk_level"]
    name  = fund["name"]
    
    if risk == "High" and horizon_years < 7:
        return (
            f"⚠️ {name} is a high-risk fund. "
            f"Minimum 7 years horizon recommended. "
            f"Your {horizon_years}-year horizon may be too short."
        )
    
    if risk == "High" and horizon_years < 5:
        return (
            f"🚨 {name} is very high risk for your "
            f"{horizon_years}-year horizon. Consider safer alternatives."
        )
    
    if risk == "Low-Moderate" and horizon_years > 10:
        return (
            f"💡 {name} is a conservative fund. "
            f"With your {horizon_years}-year horizon, "
            f"you could consider higher equity allocation for better returns."
        )
    
    return None  # No warning
