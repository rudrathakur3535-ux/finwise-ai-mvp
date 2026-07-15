import os
import json
import numpy as np
from typing import Dict, Any

import onnxruntime as ort

# Label encoder is tiny (<1KB pkl) — try joblib, else use hardcoded mapping
try:
    import joblib
    _HAS_JOBLIB = True
except ImportError:
    _HAS_JOBLIB = False

_INCOME_CAT_FALLBACK = {'low': 0, 'medium': 1, 'high': 2}


class RiskMLService:
    def __init__(self):
        self.models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
        self.ready = False
        self.model_session = None
        self.scaler_session = None
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
            opts = ort.SessionOptions()
            opts.inter_op_num_threads = 1
            opts.intra_op_num_threads = 1

            self.model_session = ort.InferenceSession(
                os.path.join(self.models_dir, 'risk_model.onnx'),
                sess_options=opts,
                providers=['CPUExecutionProvider']
            )
            self.scaler_session = ort.InferenceSession(
                os.path.join(self.models_dir, 'risk_scaler.onnx'),
                sess_options=opts,
                providers=['CPUExecutionProvider']
            )

            # Label encoder — try joblib, fallback to hardcoded
            if _HAS_JOBLIB:
                try:
                    self.label_encoder = joblib.load(
                        os.path.join(self.models_dir, 'risk_label_encoder.pkl')
                    )
                except Exception:
                    self.label_encoder = None
            else:
                self.label_encoder = None

            with open(os.path.join(self.models_dir, 'risk_features.json'), 'r') as f:
                self.features_list = json.load(f)

            self.ready = True
            print("RiskMLService: ONNX models loaded successfully!")
        except Exception as e:
            print(f"RiskMLService Warning: Risk model fallback active. {e}")
            self.ready = False

    # ----- helpers ----------------------------------------------------------
    def _encode_income_category(self, income_cat: str) -> int:
        """Encode income category string to int using label_encoder or fallback."""
        if self.label_encoder is not None:
            try:
                return int(self.label_encoder.transform([income_cat])[0])
            except Exception:
                pass
        return _INCOME_CAT_FALLBACK.get(income_cat, 1)

    def _run_scaler(self, X: np.ndarray) -> np.ndarray:
        """Run the ONNX scaler session. Input/output shape: (1, n_features)."""
        input_name = self.scaler_session.get_inputs()[0].name
        result = self.scaler_session.run(None, {input_name: X.astype(np.float32)})
        return result[0]

    def _run_model(self, X_scaled: np.ndarray):
        """Run classifier ONNX session. Returns (predicted_label, probabilities)."""
        input_name = self.model_session.get_inputs()[0].name
        output = self.model_session.run(None, {input_name: X_scaled.astype(np.float32)})
        # output[0]: labels array, output[1]: list of dicts or 2-D prob array
        label = int(output[0][0])
        prob_raw = output[1]
        # ONNX classifiers may return list[dict] — normalise to flat array
        if isinstance(prob_raw, list) and len(prob_raw) > 0 and isinstance(prob_raw[0], dict):
            n_classes = len(self.categories)
            probs = np.zeros(n_classes, dtype=np.float64)
            for cls_idx, p in prob_raw[0].items():
                probs[int(cls_idx)] = float(p)
        else:
            probs = np.array(prob_raw[0], dtype=np.float64)
        return label, probs

    # ----- public API -------------------------------------------------------
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

            income_category_encoded = self._encode_income_category(income_cat)

            # Default values (agar missing ho)
            risk_appetite_map = {"low": 0, "medium": 1, "high": 2}
            risk_appetite_encoded = risk_appetite_map.get(
                str(profile.get("risk_appetite", "medium")).lower(), 1
            )

            income_stability = 1 if str(profile.get("income_stability", "stable")).lower() == "stable" else 0

            # Build feature array in exact training order
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

            X = np.array([[input_data[f] for f in self.features_list]], dtype=np.float32)

            # 2. Scale features using ONNX scaler
            X_scaled = self._run_scaler(X)

            # 3. Make prediction via ONNX model
            predicted_class, probs = self._run_model(X_scaled)
            confidence = float(np.max(probs))

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
                "model_used": "Gradient Boosting (ONNX)",
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
            "rule_category": rule_result.get("category"),
            "explanation": explanation
        }


risk_ml_service = RiskMLService()
