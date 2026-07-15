import os
import json
import numpy as np

import onnxruntime as ort


class FundMLService:
    def __init__(self):
        models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')

        self.model_session = None
        self.scaler_session = None
        self.features = []

        self.category_mapping = {
            0: "Liquid Fund",
            1: "Debt Fund",
            2: "Large Cap Equity",
            3: "Hybrid Fund",
            4: "Mid Cap Equity",
            5: "Small Cap Equity",
            6: "ELSS Tax Saver",
            7: "Sectoral Equity"
        }
        self.ready = False

        try:
            opts = ort.SessionOptions()
            opts.inter_op_num_threads = 1
            opts.intra_op_num_threads = 1

            self.model_session = ort.InferenceSession(
                os.path.join(models_dir, 'fund_model.onnx'),
                sess_options=opts,
                providers=['CPUExecutionProvider']
            )
            self.scaler_session = ort.InferenceSession(
                os.path.join(models_dir, 'fund_scaler.onnx'),
                sess_options=opts,
                providers=['CPUExecutionProvider']
            )
            with open(os.path.join(models_dir, 'fund_features.json'), 'r') as f:
                self.features = json.load(f)
            self.ready = True
            print("FundMLService: ONNX models loaded successfully!")
        except Exception as e:
            print(f"FundMLService Warning: Fund model fallback active. {e}")
            self.ready = False

    # ----- helpers ----------------------------------------------------------
    def _get_goal_encoded(self, goal_str):
        mapping = {"retirement": 0, "home": 1, "education": 2, "wealth": 3}
        return mapping.get(str(goal_str).lower(), 3)

    def _get_income_category(self, monthly_income):
        if monthly_income <= 50000:
            return 0
        elif monthly_income <= 150000:
            return 1
        else:
            return 2

    def _run_scaler(self, X: np.ndarray) -> np.ndarray:
        """Run the ONNX scaler session."""
        input_name = self.scaler_session.get_inputs()[0].name
        result = self.scaler_session.run(None, {input_name: X.astype(np.float32)})
        return result[0]

    def _run_model(self, X_scaled: np.ndarray):
        """Run classifier ONNX session. Returns (labels, probabilities_array)."""
        input_name = self.model_session.get_inputs()[0].name
        output = self.model_session.run(None, {input_name: X_scaled.astype(np.float32)})
        # output[0]: labels, output[1]: probabilities (list[dict] or 2-D array)
        prob_raw = output[1]
        n_classes = len(self.category_mapping)
        if isinstance(prob_raw, list) and len(prob_raw) > 0 and isinstance(prob_raw[0], dict):
            probs = np.zeros(n_classes, dtype=np.float64)
            for cls_idx, p in prob_raw[0].items():
                probs[int(cls_idx)] = float(p)
        else:
            probs = np.array(prob_raw[0], dtype=np.float64)
        return probs

    # ----- public API -------------------------------------------------------
    def predict_categories(self, profile: dict, risk_score: float) -> dict:
        if not self.ready:
            return {"ml_powered": False, "fallback_reason": "Model load failed"}

        try:
            # Prepare input array
            input_data = {
                'risk_score': risk_score,
                'age': profile.get('age', 30),
                'horizon_years': profile.get('horizon_years', 10),
                'goal_encoded': self._get_goal_encoded(profile.get('primary_goal', 'wealth')),
                'monthly_sip': profile.get('monthly_savings', 10000),
                'income_category': self._get_income_category(profile.get('monthly_income', 50000))
            }

            # Feature array in training order
            X = np.array([[input_data[f] for f in self.features]], dtype=np.float32)
            X_scaled = self._run_scaler(X)

            # Predict probabilities via ONNX
            probas = self._run_model(X_scaled)

            # Get top 3 categories
            top_3_idx = np.argsort(probas)[::-1][:3]

            top_categories = []
            for idx in top_3_idx:
                cat_name = self.category_mapping.get(int(idx), "Unknown")
                top_categories.append({
                    "category": cat_name,
                    "confidence": round(float(probas[idx]), 2)
                })

            return {
                "top_categories": top_categories,
                "ml_powered": True,
                "model_used": "XGBoost (ONNX)"
            }

        except Exception as e:
            print(f"FundML prediction error: {e}")
            return {"ml_powered": False, "error": str(e)}

    def get_fund_recommendations(self, profile: dict, risk_score: float, all_funds: list) -> list:
        prediction = self.predict_categories(profile, risk_score)

        if not prediction.get("ml_powered"):
            return []

        recommended_funds = []
        top_cats = prediction["top_categories"]

        for cat_info in top_cats:
            target_cat = cat_info["category"]
            confidence = cat_info["confidence"]

            # Find best fund in this category
            best_fund = None
            highest_return = -1

            for fund in all_funds:
                if fund.get("category") == target_cat:
                    ret_3y = fund.get("returns", {}).get("3y", 0)
                    if ret_3y > highest_return:
                        highest_return = ret_3y
                        best_fund = fund

            if best_fund:
                fund_copy = best_fund.copy()
                fund_copy["ml_confidence"] = confidence
                fund_copy["ml_recommended"] = True
                recommended_funds.append(fund_copy)

        return recommended_funds


# Singleton instance
fund_ml_service = FundMLService()
