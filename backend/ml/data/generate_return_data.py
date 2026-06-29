import pandas as pd
import numpy as np
import os
import random

np.random.seed(42)
random.seed(42)

def generate_return_sample():
    # INPUT FEATURES
    fund_category_encoded = np.random.choice([0, 1, 2, 3, 4, 5, 6, 7])
    horizon_years = np.random.randint(1, 31)
    risk_score = round(np.random.uniform(1.0, 10.0), 1)
    
    # 0=bear, 1=neutral, 2=bull
    market_condition = np.random.choice([0, 1, 2])
    
    expense_ratio = round(np.random.uniform(0.1, 2.5), 2)
    
    # 0=small, 1=medium, 2=large
    aum_category = np.random.choice([0, 1, 2])
    
    sip_amount = np.random.randint(500, 50001)
    age = np.random.randint(18, 66)
    
    # OUTPUTS (Initialize targets)
    pessimistic_return = 0.0
    base_return = 0.0
    optimistic_return = 0.0
    
    # REALISTIC BASE RULES BY CATEGORY
    if fund_category_encoded == 0: # Liquid
        pessimistic_return = np.random.uniform(5.0, 6.0)
        base_return = np.random.uniform(6.0, 7.0)
        optimistic_return = np.random.uniform(7.0, 8.0)
        
    elif fund_category_encoded == 1: # Debt
        pessimistic_return = np.random.uniform(6.0, 7.0)
        base_return = np.random.uniform(7.0, 8.0)
        optimistic_return = np.random.uniform(8.0, 10.0)
        
    elif fund_category_encoded == 2: # Large Cap
        pessimistic_return = np.random.uniform(10.0, 12.0)
        base_return = np.random.uniform(12.0, 15.0)
        optimistic_return = np.random.uniform(15.0, 18.0)
        
    elif fund_category_encoded == 3: # Hybrid
        pessimistic_return = np.random.uniform(9.0, 11.0)
        base_return = np.random.uniform(11.0, 14.0)
        optimistic_return = np.random.uniform(14.0, 17.0)
        
    elif fund_category_encoded == 4: # Mid Cap
        pessimistic_return = np.random.uniform(12.0, 15.0)
        base_return = np.random.uniform(15.0, 20.0)
        optimistic_return = np.random.uniform(20.0, 26.0)
        
    elif fund_category_encoded == 5: # Small Cap
        pessimistic_return = np.random.uniform(10.0, 15.0)
        base_return = np.random.uniform(18.0, 25.0)
        optimistic_return = np.random.uniform(25.0, 35.0)
        
    elif fund_category_encoded == 6: # ELSS
        pessimistic_return = np.random.uniform(10.0, 13.0)
        base_return = np.random.uniform(13.0, 16.0)
        optimistic_return = np.random.uniform(16.0, 20.0)
        
    elif fund_category_encoded == 7: # Sectoral
        pessimistic_return = np.random.uniform(8.0, 12.0)
        base_return = np.random.uniform(15.0, 22.0)
        optimistic_return = np.random.uniform(22.0, 32.0)
        
    # ADJUSTMENTS
    # Longer horizon -> higher returns (smooths out volatility, compounded growth)
    if horizon_years > 10:
        base_return += 1.5
        optimistic_return += 2.5
    elif horizon_years > 5:
        base_return += 0.5
        optimistic_return += 1.0
        
    # Higher risk score -> higher range (especially in equity)
    if risk_score > 7.0 and fund_category_encoded >= 2:
        optimistic_return += 2.0
        pessimistic_return -= 1.0
        
    # Market condition (Bull=2, Bear=0)
    if market_condition == 2:
        pessimistic_return += 2.5
        base_return += 2.5
        optimistic_return += 2.5
    elif market_condition == 0:
        pessimistic_return -= 3.5
        base_return -= 3.5
        optimistic_return -= 3.5
        
    # High expense ratio -> slightly lower returns
    if expense_ratio > 1.5:
        pessimistic_return -= 1.0
        base_return -= 1.0
        optimistic_return -= 1.0
        
    # ADD 5% REALISTIC NOISE
    # Normal distribution with mean=0 and std = 5% of the return value
    pessimistic_return += np.random.normal(0, max(0.5, pessimistic_return * 0.05))
    base_return += np.random.normal(0, max(0.5, base_return * 0.05))
    optimistic_return += np.random.normal(0, max(0.5, optimistic_return * 0.05))
    
    # Ensure logical ordering (pessimistic < base < optimistic)
    returns = sorted([pessimistic_return, base_return, optimistic_return])
    pessimistic_return = max(0, round(returns[0], 2))
    base_return = round(returns[1], 2)
    optimistic_return = round(returns[2], 2)
    
    return {
        "fund_category_encoded": fund_category_encoded,
        "horizon_years": horizon_years,
        "risk_score": risk_score,
        "market_condition": market_condition,
        "expense_ratio": expense_ratio,
        "aum_category": aum_category,
        "sip_amount": sip_amount,
        "age": age,
        "pessimistic_return": pessimistic_return,
        "base_return": base_return,
        "optimistic_return": optimistic_return
    }

def main():
    print("Generating 4000 synthetic return prediction samples...")
    data = [generate_return_sample() for _ in range(4000)]
    df = pd.DataFrame(data)
    
    os.makedirs(os.path.dirname(os.path.abspath(__file__)), exist_ok=True)
    csv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'return_dataset.csv')
    df.to_csv(csv_path, index=False)
    
    print(f"Dataset saved to {csv_path}")
    print("\nSample Data:")
    print(df.head())
    
    print("\nAverage Base Returns by Category:")
    cat_names = {0:"Liquid", 1:"Debt", 2:"Large Cap", 3:"Hybrid", 4:"Mid Cap", 5:"Small Cap", 6:"ELSS", 7:"Sectoral"}
    avg_returns = df.groupby('fund_category_encoded')['base_return'].mean()
    for cat, ret in avg_returns.items():
        print(f"{cat_names[cat]}: {ret:.2f}%")

if __name__ == "__main__":
    main()
