code = """
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
"""
with open("c:/Users/rudra/OneDrive/Desktop/finence ai/backend/services/ai_explainer.py", "a", encoding="utf-8") as f:
    f.write("\n" + code + "\n")
