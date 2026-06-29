import pandas as pd
import numpy as np
import os
import random

np.random.seed(42)
random.seed(42)

def generate_fund_profile():
    # INPUT FEATURES
    risk_score = round(np.random.uniform(1.0, 10.0), 1)
    age = np.random.randint(18, 66)
    horizon_years = np.random.randint(1, 31)
    
    # 0=retirement, 1=home, 2=education, 3=wealth
    goal_encoded = np.random.choice([0, 1, 2, 3])
    
    monthly_sip = np.random.randint(500, 50001)
    
    # 0=low, 1=medium, 2=high
    income_category = np.random.choice([0, 1, 2])
    
    # BASE RULES FOR CATEGORY
    # We will score categories based on rules, and pick the highest score
    
    # Category indices:
    # 0 = Liquid, 1 = Debt, 2 = Large Cap, 3 = Hybrid, 
    # 4 = Mid Cap, 5 = Small Cap, 6 = ELSS, 7 = Sectoral
    scores = np.zeros(8)
    
    # risk 1-3 + horizon <3 -> Liquid(0)/Debt(1)
    if risk_score <= 3.5:
        if horizon_years <= 3:
            scores[0] += 20
            scores[1] += 15
        else:
            scores[1] += 15
            scores[3] += 10 # Hybrid
            
    # risk 4-6 + horizon 5-10 -> Large Cap(2)/Hybrid(3)
    if 3.5 < risk_score <= 6.5:
        if 4 <= horizon_years <= 10:
            scores[2] += 20
            scores[3] += 15
        elif horizon_years > 10:
            scores[2] += 15
            scores[4] += 10 # Mid cap
            
    # risk 7-8 + horizon 7-15 -> Mid Cap(4)
    if 6.5 < risk_score <= 8.5:
        if horizon_years >= 7:
            scores[4] += 20
            scores[2] += 10
        else:
            scores[2] += 15
            
    # risk 9-10 + horizon 10+ -> Small Cap(5)/Sectoral(7)
    if risk_score > 8.5:
        if horizon_years >= 10:
            scores[5] += 20
            scores[7] += 15
        else:
            scores[4] += 15 # Mid cap safer if less horizon
            
    # goal=retirement + age>45 -> Debt heavy
    if goal_encoded == 0 and age > 45:
        scores[1] += 25
        scores[3] += 15
        
    # goal=wealth + young -> Equity heavy (Small/Mid)
    if goal_encoded == 3 and age <= 35:
        scores[5] += 20
        scores[4] += 15
        
    # ELSS is a tax saver. Usually for medium/high income
    if income_category >= 1 and horizon_years >= 3:
        # Give ELSS a chance
        scores[6] += 15
        
    # ADD RANDOM NOISE
    max_score = np.max(scores) if np.max(scores) > 0 else 10
    noise = np.random.uniform(0, max_score * 0.5, size=8) 
    scores += noise
    
    category = int(np.argmax(scores))
    
    return {
        "risk_score": risk_score,
        "age": age,
        "horizon_years": horizon_years,
        "goal_encoded": goal_encoded,
        "monthly_sip": monthly_sip,
        "income_category": income_category,
        "fund_category": category
    }

def main():
    print("Generating 3000 synthetic fund recommendations...")
    data = [generate_fund_profile() for _ in range(3000)]
    df = pd.DataFrame(data)
    
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'fund_dataset.csv')
    df.to_csv(csv_path, index=False)
    
    print(f"Dataset saved to {csv_path}")
    print("\nCategory Distribution:")
    print(df['fund_category'].value_counts().sort_index())

if __name__ == "__main__":
    main()
