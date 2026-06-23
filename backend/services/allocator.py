# =============================================
# ALLOCATOR ENGINE — FinWise AI
# Risk Score lekar portfolio allocation deta hai
# =============================================

def get_allocation(risk_score: float, horizon_years: int) -> dict:
    """
    Risk score aur horizon ke basis pe
    portfolio allocation percentages decide karta hai.

    Input:
        risk_score    → float (1.0 to 10.0)
        horizon_years → int (investment kitne saal ke liye)

    Output:
        Dictionary with category → percentage
        (Sab percentages ka total = 100)
    """

    # ----------------------------------------
    # Horizon adjustment
    # Agar horizon bahut chhota hai toh
    # equity automatically kam kar do
    # ----------------------------------------
    if horizon_years < 3:
        # Very short term — mostly safe funds
        return {
            "Large Cap Equity":  10,
            "Hybrid":            10,
            "Debt":              40,
            "Liquid":            35,
            "Gold":               5,
            "Mid Cap Equity":     0,
            "Small Cap Equity":   0,
            "Sectoral Equity":    0,
        }

    # ----------------------------------------
    # Score 1.0 - 3.0 → CONSERVATIVE
    # Safety first, minimal equity
    # ----------------------------------------
    if risk_score <= 3.0:
        allocation = {
            "Large Cap Equity":  15,
            "Hybrid":            10,
            "Debt":              40,
            "Liquid":            20,
            "Gold":              15,
            "Mid Cap Equity":     0,
            "Small Cap Equity":   0,
            "Sectoral Equity":    0,
        }

    # ----------------------------------------
    # Score 3.1 - 5.0 → MODERATE-CONSERVATIVE
    # Thoda equity, zyada safety
    # ----------------------------------------
    elif risk_score <= 5.0:
        allocation = {
            "Large Cap Equity":  30,
            "Hybrid":            15,
            "Debt":              25,
            "Liquid":            15,
            "Gold":              10,
            "Mid Cap Equity":     5,
            "Small Cap Equity":   0,
            "Sectoral Equity":    0,
        }

    # ----------------------------------------
    # Score 5.1 - 7.0 → MODERATE
    # Balanced — equity aur debt dono
    # ----------------------------------------
    elif risk_score <= 7.0:
        allocation = {
            "Large Cap Equity":  40,
            "Hybrid":            15,
            "Debt":              15,
            "Liquid":             5,
            "Gold":              10,
            "Mid Cap Equity":    10,
            "Small Cap Equity":   5,
            "Sectoral Equity":    0,
        }

    # ----------------------------------------
    # Score 7.1 - 8.5 → MODERATE-AGGRESSIVE
    # Growth focused, limited safety net
    # ----------------------------------------
    elif risk_score <= 8.5:
        allocation = {
            "Large Cap Equity":  35,
            "Hybrid":            10,
            "Debt":               5,
            "Liquid":             5,
            "Gold":               5,
            "Mid Cap Equity":    25,
            "Small Cap Equity":  10,
            "Sectoral Equity":    5,
        }

    # ----------------------------------------
    # Score 8.6 - 10.0 → AGGRESSIVE
    # Maximum growth, high risk
    # ----------------------------------------
    else:
        allocation = {
            "Large Cap Equity":  25,
            "Hybrid":             5,
            "Debt":               0,
            "Liquid":             5,
            "Gold":               5,
            "Mid Cap Equity":    30,
            "Small Cap Equity":  25,
            "Sectoral Equity":   10,
        }

    # ----------------------------------------
    # Horizon adjustment for 3-5 year horizon
    # Equity thodi kam karo, debt thodi badha do
    # ----------------------------------------
    if 3 <= horizon_years <= 5:
        # Small cap aur sectoral bahut risky hain
        # short horizon mein — inhe reduce karo
        small_cap = allocation.get("Small Cap Equity", 0)
        sectoral  = allocation.get("Sectoral Equity", 0)

        if small_cap > 0:
            allocation["Small Cap Equity"] = max(0, small_cap - 10)
            allocation["Large Cap Equity"] += 5
            allocation["Debt"]             += 5

        if sectoral > 0:
            allocation["Sectoral Equity"]  = max(0, sectoral - 5)
            allocation["Debt"]             += 5

    # ----------------------------------------
    # Zero values remove karo — clean output
    # ----------------------------------------
    allocation = {k: v for k, v in allocation.items() if v > 0}

    return allocation


def get_allocation_summary(allocation: dict) -> dict:
    """
    Allocation ko broad categories mein summarize karo.
    Frontend pe pie chart ke liye useful.
    """

    equity_categories = [
        "Large Cap Equity",
        "Mid Cap Equity",
        "Small Cap Equity",
        "Sectoral Equity",
        "Hybrid"
    ]

    safe_categories = [
        "Debt",
        "Liquid"
    ]

    total_equity = sum(
        v for k, v in allocation.items()
        if k in equity_categories
    )

    total_safe = sum(
        v for k, v in allocation.items()
        if k in safe_categories
    )

    total_gold = allocation.get("Gold", 0)

    return {
        "equity_percent": total_equity,
        "safe_percent":   total_safe,
        "gold_percent":   total_gold,
        "detail":         allocation,
    }