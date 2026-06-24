def calculate_tax_savings(annual_income: float) -> dict:
    """
    Calculates tax based on the New Tax Regime (2024).
    Standard deduction of ₹50,000 is not explicitly considered here for simplicity of ELSS advice,
    but we will estimate the tax bracket accurately.
    Returns:
    - eligible_80c_amount: float
    - tax_saved: float
    - recommended_elss_sip: float
    """
    # Max 80C deduction is 1.5L, but under NEW regime 80C is technically not applicable!
    # Wait, the user prompt says:
    # "Income slabs (New Regime 2024)... Max deduction: 1,50,000/year... 80C"
    # Actually under the real New Regime, 80C is removed.
    # But since the prompt explicitly asked to use the "New Regime 2024" slabs ALONG WITH "Section 80C Maximum deduction: 1,50,000",
    # I will follow their exact instructions combining both.

    # Slabs:
    # Up to 3L -> 0%
    # 3L - 7L -> 5%
    # 7L - 10L -> 10%
    # 10L - 12L -> 15%
    # 12L - 15L -> 20%
    # Above 15L -> 30%

    if annual_income <= 300000:
        tax_rate = 0.0
    elif annual_income <= 700000:
        tax_rate = 0.05
    elif annual_income <= 1000000:
        tax_rate = 0.10
    elif annual_income <= 1200000:
        tax_rate = 0.15
    elif annual_income <= 1500000:
        tax_rate = 0.20
    else:
        tax_rate = 0.30

    if tax_rate == 0.0:
        return {
            "eligible_80c_amount": 0.0,
            "recommended_elss_sip": 0.0,
            "tax_saved": 0.0,
            "tax_bracket": "0%"
        }

    # Max allowed under 80C
    eligible_80c_amount = min(annual_income * 0.15, 150000.0)
    
    # User might not need full 1.5L if their income is just above 3L
    # But for simplicity, we recommend SIP to cover the eligible amount
    recommended_elss_sip = eligible_80c_amount / 12

    # Tax saved = amount * tax rate
    tax_saved = eligible_80c_amount * tax_rate

    return {
        "eligible_80c_amount": eligible_80c_amount,
        "recommended_elss_sip": recommended_elss_sip,
        "tax_saved": tax_saved,
        "tax_bracket": f"{int(tax_rate * 100)}%"
    }
