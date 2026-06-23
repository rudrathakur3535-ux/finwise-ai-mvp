from services.risk_scorer  import calculate_risk_score
from services.allocator    import get_allocation
from services.fund_selector import select_funds

print("\n" + "="*50)
print("   FinWise AI — Full Pipeline Test")
print("="*50)

# Rahul ka profile
rahul = {
    "age":             24,
    "monthly_income":  60000,
    "monthly_savings": 15000,
    "risk_appetite":   "aggressive",
    "horizon_years":   10
}

# Step 1: Risk Score
risk   = calculate_risk_score(rahul)
print(f"\n✅ Risk Score : {risk['score']}/10 {risk['emoji']} {risk['category']}")

# Step 2: Allocation
alloc  = get_allocation(risk["score"], rahul["horizon_years"])
print(f"✅ Allocation : {len(alloc)} categories")

# Step 3: Fund Selection
funds  = select_funds(alloc, rahul["monthly_savings"], rahul["horizon_years"])
print(f"✅ Funds Selected : {len(funds)} funds")

print(f"\n{'='*50}")
print(f"  RECOMMENDED FUNDS FOR RAHUL")
print(f"{'='*50}")

total_sip = 0

for i, fund in enumerate(funds, 1):
    print(f"\n{i}. {fund['name']}")
    print(f"   Category   : {fund['category']}")
    print(f"   Risk Level : {fund['risk_level']}")
    print(f"   Allocation : {fund['allocated_percentage']}%")
    print(f"   Monthly SIP: ₹{fund['monthly_sip']:,.0f}")
    print(f"   5Y Returns : {fund['returns']['5y']}% CAGR")
    print(f"   5Y Corpus  : ₹{fund['projection']['base']:,.0f}")
    print(f"   (Pessimistic: ₹{fund['projection']['pessimistic']:,.0f}"
          f" | Optimistic: ₹{fund['projection']['optimistic']:,.0f})")
    
    if fund["warning"]:
        print(f"   {fund['warning']}")
    
    total_sip += fund["monthly_sip"]

print(f"\n{'='*50}")
print(f"  TOTAL MONTHLY SIP : ₹{total_sip:,.0f}")
print(f"  (Out of ₹{rahul['monthly_savings']:,} savings)")
print(f"{'='*50}")
print("\n✅ Full Pipeline Working!\n")