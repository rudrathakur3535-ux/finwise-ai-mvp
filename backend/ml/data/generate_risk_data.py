import pandas as pd
import numpy as np
import os
import random

# Reproducibility ke liye seed fix kar rahe hain
np.random.seed(42)
random.seed(42)

def generate_profile():
    age = np.random.randint(18, 66)
    monthly_income = np.random.randint(20000, 500001)
    
    # Savings ko realistically cap karte hain
    max_savings = int(monthly_income * 0.6)
    monthly_savings = np.random.randint(5000, max(5001, max_savings))
    
    savings_rate = round(monthly_savings / monthly_income, 3)
    horizon_years = np.random.randint(1, 31)
    
    # conservative=0, moderate=1, aggressive=2
    risk_appetite_encoded = np.random.choice([0, 1, 2])
    existing_investments = np.random.randint(0, 1000001)
    dependents = np.random.randint(0, 6)
    
    # 0=variable, 1=stable salary
    income_stability = np.random.choice([0, 1], p=[0.3, 0.7]) 

    # ----- BETTER REALISTIC RULES -----
    # Base score out of 100
    score = 50 
    
    # Age factor: Younger log zyada risk le sakte hain
    if age <= 28:
        score += 15
    elif age <= 35:
        score += 10
    elif age >= 50:
        score -= 20
        
    # Horizon factor: Lamba horizon = zyada risk tolerance
    if horizon_years >= 15:
        score += 15
    elif horizon_years >= 7:
        score += 5
    elif horizon_years <= 3:
        score -= 20
        
    # Declared risk appetite ka sabse bada asar
    if risk_appetite_encoded == 2:
        score += 25
    elif risk_appetite_encoded == 0:
        score -= 25
        
    # Savings rate factor
    if savings_rate > 0.4:
        score += 10
        
    # Dependents factor
    if dependents >= 3:
        score -= 15
        
    # Income stability factor
    if income_stability == 0:
        score -= 15
        
    # 5% Realistic noise (Pehle 10% tha, ab reduce kar diya for better accuracy)
    noise = np.random.normal(0, 2)
    score += noise
    
    # Extreme scores handle karna
    score = max(0, min(100, score))
    
    # Map score to category 0-4
    if score <= 25:
        category = 0 # Conservative
    elif score <= 45:
        category = 1 # Moderate-Conservative
    elif score <= 60:
        category = 2 # Moderate
    elif score <= 80:
        category = 3 # Moderate-Aggressive
    else:
        category = 4 # Aggressive
        
    return {
        "age": age,
        "monthly_income": monthly_income,
        "monthly_savings": monthly_savings,
        "savings_rate": savings_rate,
        "horizon_years": horizon_years,
        "risk_appetite_encoded": risk_appetite_encoded,
        "existing_investments": existing_investments,
        "dependents": dependents,
        "income_stability": income_stability,
        "risk_category": category
    }

def main():
    print("Generating 5000 synthetic investor profiles...")
    # Dataset size 2000 se badha kar 5000 kar diya hai
    data = [generate_profile() for _ in range(5000)]
    df = pd.DataFrame(data)
    
    # Save the dataset
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'risk_dataset.csv')
    df.to_csv(csv_path, index=False)
    
    print(f"Dataset saved to {csv_path}")
    print("\nCategory Distribution:")
    print(df['risk_category'].value_counts().sort_index())

if __name__ == "__main__":
    main()
