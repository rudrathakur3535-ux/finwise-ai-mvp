import asyncio
import json
from routes.advisor import get_financial_advice, UserProfile

async def test_profile(profile_data):
    print(f"\n{'='*50}")
    print(f"Testing Profile: {profile_data['name']}")
    print(f"{'='*50}")
    
    # Create Pydantic model
    profile = UserProfile(**profile_data)
    
    # Call the main API endpoint
    try:
        response = await get_financial_advice(profile)
        
        # Print Risk Output
        print("\n--- 1. ML RISK SCORE ---")
        risk = response["risk_assessment"]
        print(f"Category: {risk['category']}")
        print(f"ML Powered: {risk.get('ml_powered', False)}")
        if risk.get('ml_powered'):
            print(f"Final Score: {risk['score']} (ML: {risk['ml_score']} | Rule: {risk['rule_score']})")
            
        # Print Portfolio Allocation
        print("\n--- 2. PORTFOLIO ALLOCATION ---")
        alloc = response["portfolio"]["allocation"]
        for k, v in alloc.items():
            print(f"{k.replace('_percent', '').title()}: {v}%")
            
        # Print Funds and Return Predictions
        print("\n--- 3. ML FUND SELECTION & RETURN PREDICTION ---")
        funds = response["recommended_funds"]
        for i, fund in enumerate(funds, 1):
            print(f"\nFund {i}: {fund['name']} ({fund['category']})")
            print(f"SIP Amount: ₹{fund.get('monthly_sip', 0):,}")
            
            if fund.get('ml_recommended'):
                print(f"ML Fund Confidence: {round(fund.get('ml_confidence', 0)*100)}%")
                
            ret = fund.get('ml_predicted_returns', {})
            if ret:
                print(f"ML Predicted CAGR:")
                print(f"  Pessimistic: {ret.get('pessimistic', 0)}%")
                print(f"  Base:        {ret.get('base', 0)}%")
                print(f"  Optimistic:  {ret.get('optimistic', 0)}%")
            else:
                print("No ML Return Prediction available.")
                
            proj = fund.get('corpus_projection', fund.get('projection', {}))
            print(f"Projected Corpus:")
            print(f"  Base Expected: ₹{proj.get('base', 0):,}")
            
        # Print ML Summary
        print("\n--- 4. ML SUMMARY PIPELINE ---")
        summary = response.get("ml_summary", {})
        print(json.dumps(summary, indent=2))
        
    except Exception as e:
        print(f"Error testing profile: {e}")

async def main():
    print("--- FINWISE AI - FULL ML PIPELINE TEST ---")
    
    # Profile 1: Rahul
    rahul = {
        "name": "Rahul",
        "age": 24,
        "monthly_income": 50000,
        "monthly_savings": 15000,
        "risk_appetite": "aggressive",
        "horizon_years": 10
    }
    
    # Profile 2: Priya
    priya = {
        "name": "Priya",
        "age": 35,
        "monthly_income": 120000,
        "monthly_savings": 35000,
        "risk_appetite": "moderate",
        "horizon_years": 7
    }
    
    # Profile 3: Sharma Ji
    sharma_ji = {
        "name": "Sharma Ji",
        "age": 52,
        "monthly_income": 80000,
        "monthly_savings": 20000,
        "risk_appetite": "conservative",
        "horizon_years": 3
    }
    
    await test_profile(rahul)
    await test_profile(priya)
    await test_profile(sharma_ji)
    
    print("\nAll Tests Completed Successfully!")

if __name__ == "__main__":
    asyncio.run(main())
