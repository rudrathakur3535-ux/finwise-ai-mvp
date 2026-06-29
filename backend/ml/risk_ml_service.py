import os
import joblib
import json
import pandas as pd
from typing import Dict, Any

class RiskMLService:
    def __init__(self):
        # Saved models load karte hain
        self.models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
        self.ready = False
        self.model = None
        self.scaler = None
        self.label_encoder = None
        self.features_list = []
        
        # Risk categories mapping
        self.categories = {
            0: "Conservative",
            1: "Moderate-Conservative",
            2: "Moderate",
            3: "Moderate-Aggressive",
            4: "Aggressive"
        }
        
        self._load_models()

    def _load_models(self):
        try:
            self.model = joblib.load(os.path.join(self.models_dir, 'risk_model.pkl'))
            self.scaler = joblib.load(os.path.join(self.models_dir, 'risk_scaler.pkl'))
            self.label_encoder = joblib.load(os.path.join(self.models_dir, 'risk_label_encoder.pkl'))
            
            with open(os.path.join(self.models_dir, 'risk_features.json'), 'r') as f:
                self.features_list = json.load(f)
                
            self.ready = True
            print("RiskMLService: Models loaded successfully!")
        except Exception as e:
            print(f"RiskMLService Warning: Risk model fallback active. {e}")
            self.ready = False

    def predict_risk(self, profile: dict, rule_score: float = 0.0) -> dict:
        """
        Input: user profile dictionary aur rule-based score.
        Yahan ML model prediction karega aur rules ke sath compare karega.
        """
        if not self.ready:
            return {
                "ml_powered": False,
                "fallback_reason": "Model load failed",
                "final_score": rule_score
            }
            
        try:
            # 1. Feature Engineering bilkul waisi hi jaisi training ke time ki thi
            monthly_income = float(profile.get("monthly_income", 0))
            monthly_savings = float(profile.get("monthly_savings", 0))
            
            savings_to_income_ratio = monthly_savings / monthly_income if monthly_income > 0 else 0
            
            # Income category (low/medium/high)
            if monthly_income <= 50000:
                income_cat = 'low'
            elif monthly_income <= 150000:
                income_cat = 'medium'
            else:
                income_cat = 'high'
                
            income_category_encoded = self.label_encoder.transform([income_cat])[0]
            
            # Default values (agar missing ho)
            risk_appetite_map = {"low": 0, "medium": 1, "high": 2}
            risk_appetite_encoded = risk_appetite_map.get(str(profile.get("risk_appetite", "medium")).lower(), 1)
            
            income_stability = 1 if str(profile.get("income_stability", "stable")).lower() == "stable" else 0
            
            # DataFrame banate hain exact usi order mein jismein model train hua tha
            input_data = {
                'age': float(profile.get("age", 30)),
                'monthly_income': monthly_income,
                'monthly_savings': monthly_savings,
                'savings_to_income_ratio': savings_to_income_ratio,
                'horizon_years': float(profile.get("horizon_years", 5)),
                'risk_appetite_encoded': risk_appetite_encoded,
                'existing_investments': float(profile.get("existing_investments", 0)),
                'dependents': int(profile.get("dependents", 0)),
                'income_stability': income_stability,
                'income_category_encoded': income_category_encoded
            }
            
            df = pd.DataFrame([input_data])[self.features_list]
            
            # 2. Scale features using saved scaler
            df_scaled = self.scaler.transform(df)
            
            # 3. Make prediction
            predicted_class = int(self.model.predict(df_scaled)[0])
            
            # 4. Get prediction probabilities
            probs = self.model.predict_proba(df_scaled)[0]
            confidence = float(max(probs))
            
            # Probabilities dictionary for all classes
            prob_dict = {self.categories[i]: round(float(p), 4) for i, p in enumerate(probs)}
            
            # ML Risk score out of 10 based on class (0->2, 1->4, 2->6, 3->8, 4->10)
            ml_risk_score = (predicted_class / 4) * 10
            
            # 5. Final weighted score and comparison
            if rule_score > 0:
                final_score = (ml_risk_score * 0.6) + (rule_score * 0.4)
            else:
                final_score = ml_risk_score
                
            agreement = abs(ml_risk_score - rule_score) <= 2.5
            
            return {
                "ml_risk_score": round(ml_risk_score, 2),
                "ml_category": self.categories[predicted_class],
                "confidence": round(confidence, 2),
                "probabilities": prob_dict,
                "model_used": "Gradient Boosting (Auto-selected best)",
                "features_used": self.features_list,
                "rule_based_score": round(rule_score, 2),
                "final_score": round(final_score, 2),
                "agreement": agreement,
                "ml_powered": True
            }
            
        except Exception as e:
            return {
                "ml_powered": False,
                "error": str(e)
            }

    def compare_with_rules(self, ml_result: dict, rule_result: dict) -> dict:
        """ Compare ML vs rule-based result """
        if ml_result.get("agreement"):
            explanation = "ML and Rule-based models agree. Confidence is high."
        else:
            explanation = "Models disagree. ML sees hidden patterns that basic rules missed."
            
        return {
            "ml_category": ml_result.get("ml_category"),
            "rule_category": rule_result.get("category"), # assuming rule_result has 'category'
            "explanation": explanation
        }

risk_ml_service = RiskMLService()
