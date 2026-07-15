# =============================================
# AI EXPLAINER — FinWise AI ka Gemini Brain
# User ke results ko lekar AI se personalized
# financial advice generate karta hai
# =============================================

from google import genai
import os
import logging
from dotenv import load_dotenv

# Logger setup
logger = logging.getLogger("ai_explainer")

# .env file se API key load karo
load_dotenv()

# Gemini client banao (new SDK style)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def generate_advice(
    profile: dict,
    risk_result: dict,
    allocation: dict,
    selected_funds: list
) -> str:
    """
    Gemini AI se personalized financial advice generate karo.

    Input:
        profile        → User ka profile (age, income, etc.)
        risk_result    → Risk score result (score, category, etc.)
        allocation     → Portfolio allocation percentages
        selected_funds → Selected funds with SIP amounts

    Output:
        AI-generated advice string (Hinglish mein)
    """

    # -----------------------------------------
    # Fund summary banao prompt ke liye
    # -----------------------------------------
    fund_summary = ""
    total_sip = 0

    for fund in selected_funds:
        fund_summary += (
            f"  - {fund['name']} ({fund['category']})\n"
            f"    Monthly SIP: ₹{fund['monthly_sip']:,.0f} | "
            f"5Y Return: {fund['returns']['5y']}% CAGR\n"
            f"    Expected Corpus: ₹{fund['projection']['base']:,.0f}\n"
        )
        total_sip += fund["monthly_sip"]

    # -----------------------------------------
    # Mega prompt banao — Gemini ko sab context do
    # -----------------------------------------
    prompt = f"""
You are FinWise AI — a friendly, expert Indian financial advisor.
The user has filled a risk assessment form. Based on their profile,
we have calculated their risk score, portfolio allocation, and
selected mutual funds.

Your job: Give a SHORT, PERSONALIZED financial summary and advice.

===== USER PROFILE =====
- Age: {profile['age']} years
- Monthly Income: ₹{profile['monthly_income']:,}
- Monthly Savings: ₹{profile['monthly_savings']:,}
- Risk Appetite: {profile['risk_appetite']}
- Investment Horizon: {profile['horizon_years']} years

===== RISK ASSESSMENT =====
- Risk Score: {risk_result['score']}/10
- Category: {risk_result['emoji']} {risk_result['category']}
- Tagline: {risk_result['tagline']}

===== PORTFOLIO ALLOCATION =====
{', '.join(f"{k}: {v}%" for k, v in allocation.items())}

===== RECOMMENDED FUNDS =====
{fund_summary}
Total Monthly SIP: ₹{total_sip:,.0f}

===== INSTRUCTIONS =====
1. Write in simple Hinglish (Hindi + English mix)
2. Keep it SHORT — max 150 words
3. Be encouraging and positive
4. Mention their specific risk category
5. Mention 1-2 specific fund names from above
6. Give 1 practical tip for their age group
7. End with a motivational line
8. Use emojis sparingly (2-3 max)
9. DO NOT use markdown formatting
10. DO NOT give any disclaimer or legal warning
"""

    # -----------------------------------------
    # Gemini API call karo (new SDK)
    # Try primary model, fallback to lite model
    # -----------------------------------------
    models_to_try = ["gemini-2.0-flash-lite", "gemini-2.0-flash"]

    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            advice = response.text.strip()
            return advice

        except Exception as e:
            logger.warning(f"[GEMINI] {model_name} failed: {e}")
            continue  # Next model try karo

    # Sab models fail — fallback advice do
    return (
        f"Aapka risk score {risk_result['score']}/10 hai "
        f"({risk_result['category']}). "
        f"Aapke liye {len(selected_funds)} funds select kiye gaye hain "
        f"with total monthly SIP of Rs.{total_sip:,.0f}. "
        f"Consistent SIP se long term mein achhe returns milenge. "
        f"Invest karte raho!"
    )

def explain_fund(fund_name: str, profile: dict) -> str:
    """
    Specific fund ke baare mein AI se explanation maango ki yeh fund user ke liye kyun sahi hai.
    """
    prompt = f"""
    You are an Indian Financial Advisor.
    The user (Age: {profile.get('age')}, Goal: {profile.get('goal')}, Horizon: {profile.get('horizon_years')} years, Risk: {profile.get('risk_appetite')}) 
    has been recommended the mutual fund "{fund_name}".
    
    Explain exactly WHY this specific fund is a good fit for this user's profile.
    Keep it VERY SHORT (max 2-3 sentences).
    Write in simple Hinglish (Hindi + English mix).
    Be encouraging. No disclaimers.
    """

    models_to_try = ["gemini-2.0-flash-lite", "gemini-2.0-flash"]
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            logger.warning(f"[GEMINI EXPLAIN] {model_name} failed: {e}")
            continue
            
    return f"Yeh fund aapke {profile.get('horizon_years')} year horizon aur {profile.get('risk_appetite')} risk profile ke liye perfect match hai."



def generate_tax_advice(monthly_income: float, tax_saved: float, recommended_sip: float) -> str:
    '''Gemini se tax saving advice in Hinglish.'''
    prompt = f'''
    You are 'FinWise AI', a friendly financial expert.
    The user earns ₹{monthly_income}/month.
    By investing ₹{recommended_sip}/month in ELSS Mutual Funds, they can save up to ₹{tax_saved} in taxes under Section 80C.
    
    Give a 3-4 sentence explanation in Hinglish about why ELSS is the best option for tax saving and wealth creation combined, and remind them of the 3-year lock-in period.
    Keep it encouraging, simple, and don't use emojis (we add them in UI).
    '''
    
    models_to_try = ["gemini-2.0-flash-lite", "gemini-2.0-flash"]
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            logger.warning(f"[GEMINI] {model_name} failed: {e}")
            continue
            
    return f"Bhai, tumhari income ke hisaab se ELSS mein ₹{int(recommended_sip)} har mahine daalne se tum ₹{int(tax_saved)} tak ka tax bacha sakte ho. Isme 3 saal ka lock-in hota hai, par returns FD se kahin zyada milte hain!"


def generate_chat_response(messages: list, user_context: dict = None) -> str:
    """
    Handle conversational chat queries for the FinWise Assistant widget.
    """
    # Create system context
    context_str = ""
    if user_context:
        context_str = f"User Name: {user_context.get('name', 'User')}\nTier: {user_context.get('subscription_tier', 'free')}\n"
    
    system_prompt = f"""You are FinWise Assistant, a friendly AI financial advisor for the FinWise AI platform.
{context_str}
Rules:
1. Always answer in Hinglish (a mix of Hindi and English).
2. Be polite, professional, and concise. Use a few emojis.
3. Your scope is limited to personal finance, mutual funds, SIPs, taxes, and using the FinWise platform.
4. If a user asks something unrelated (e.g. coding, general trivia), politely decline and steer them back to finance.
5. You do not have access to real-time market data, speak generally about principles if asked about live stocks.
"""

    # Format history for Gemini
    formatted_contents = [{"role": "user", "parts": [{"text": system_prompt}]}]
    
    for msg in messages:
        role = "user" if msg.get("role") == "user" else "model"
        formatted_contents.append({"role": role, "parts": [{"text": msg.get("content", "")}]})

    models_to_try = ["gemini-2.0-flash-lite", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
    for model_name in models_to_try:
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=formatted_contents
            )
            return response.text.strip()
        except Exception as e:
            logger.warning(f"[GEMINI CHAT] {model_name} failed: {e}")
            continue
            
    return "Maaf karna, abhi main thoda busy hoon. Please thodi der baad try karein."
