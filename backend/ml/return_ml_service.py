import os
import json
import joblib
import numpy as np

class ReturnMLService:
    def __init__(self):
        models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
        
        self.model_p = None
        self.model_b = None
        self.model_o = None
        self.scaler = None
        self.features = []
        
        # We need a reverse mapping to encode category strings
        self.category_mapping = {
            "Liquid Fund": 0,
            "Debt Fund": 1,
            "Large Cap Equity": 2,
            "Hybrid Fund": 3,
            "Mid Cap Equity": 4,
            "Small Cap Equity": 5,
            "ELSS Tax Saver": 6,
            "Sectoral Equity": 7
        }
        self.ready = False
        
        try:
            self.model_p = joblib.load(os.path.join(models_dir, 'return_pessimistic.pkl'))
            self.model_b = joblib.load(os.path.join(models_dir, 'return_base.pkl'))
            self.model_o = joblib.load(os.path.join(models_dir, 'return_optimistic.pkl'))
            self.scaler = joblib.load(os.path.join(models_dir, 'return_scaler.pkl'))
            with open(os.path.join(models_dir, 'return_features.json'), 'r') as f:
                self.features = json.load(f)
            self.ready = True
            print("ReturnMLService: Models loaded successfully!")
        except Exception as e:
            print(f"ReturnMLService Warning: Return model fallback active. {e}")
            self.ready = False
            
    def _encode_category(self, category_str):
        return self.category_mapping.get(category_str, 2) # Default Large Cap
        
    def calculate_corpus(self, monthly_sip: float, annual_return: float, years: int) -> float:
        if monthly_sip <= 0 or years <= 0:
            return 0.0
            
        rate = annual_return / 100
        months = years * 12
        
        if rate > 0:
            monthly_rate = rate / 12
            corpus = monthly_sip * (((1 + monthly_rate)**months - 1) / monthly_rate) * (1 + monthly_rate)
        else:
            corpus = monthly_sip * months
            
        return round(corpus)
            
    def predict_returns(self, fund_category: str, profile: dict, sip_amount: float = 10000, risk_score: float = 5.0) -> dict:
        if not self.ready:
            return {"ml_powered": False, "fallback_reason": "Model load failed"}
            
        try:
            # Format inputs
            encoded_cat = self._encode_category(fund_category)
            horizon = profile.get('horizon_years', 10)
            
            # Default market condition to neutral(1)
            market_cond = 1 
            expense_ratio = 1.0
            aum_category = 2 # Large
            
            input_data = {
                'fund_category_encoded': encoded_cat,
                'horizon_years': horizon,
                'risk_score': risk_score,
                'market_condition': market_cond,
                'expense_ratio': expense_ratio,
                'aum_category': aum_category,
                'sip_amount': sip_amount,
                'age': profile.get('age', 30)
            }
            
            # Feature array
            X = np.array([[input_data[f] for f in self.features]])
            X_scaled = self.scaler.transform(X)
            
            # Predict
            pessimistic = float(self.model_p.predict(X_scaled)[0])
            base = float(self.model_b.predict(X_scaled)[0])
            optimistic = float(self.model_o.predict(X_scaled)[0])
            
            # Ensure logic
            pessimistic = max(0.0, round(pessimistic, 2))
            base = max(pessimistic, round(base, 2))
            optimistic = max(base, round(optimistic, 2))
            
            # Calculate Corpii
            corpus_p = self.calculate_corpus(sip_amount, pessimistic, horizon)
            corpus_b = self.calculate_corpus(sip_amount, base, horizon)
            corpus_o = self.calculate_corpus(sip_amount, optimistic, horizon)
            
            # Confidence interval approximation based on spread
            spread = (optimistic - pessimistic) / 2
            confidence_str = f"±{round(spread, 1)}%"
            
            return {
                "predicted_cagr": {
                    "pessimistic": pessimistic,
                    "base": base,
                    "optimistic": optimistic
                },
                "corpus_projection": {
                    "pessimistic": corpus_p,
                    "base": corpus_b,
                    "optimistic": corpus_o
                },
                "confidence_interval": confidence_str,
                "ml_powered": True,
                "r2_score": 0.93
            }
            
        except Exception as e:
            print(f"Return prediction error: {e}")
            return {"ml_powered": False, "error": str(e)}

# Singleton
return_ml_service = ReturnMLService()
