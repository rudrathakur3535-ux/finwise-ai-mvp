"""
ONNX CONVERSION SCRIPT — FinWise AI
Converts all 3 ML model types (risk, fund, return) from pkl to ONNX.
Run ONCE before Docker build: python scripts/convert_to_onnx.py
"""

import os
import sys
import json
import joblib
import numpy as np

# Add parent dir to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'ml', 'models')


def convert_sklearn_to_onnx(pkl_path, onnx_path, n_features, is_classifier=True):
    """Convert a sklearn model (Random Forest / Gradient Boosting) to ONNX."""
    from skl2onnx import convert_sklearn
    from skl2onnx.common.data_types import FloatTensorType

    model = joblib.load(pkl_path)
    initial_type = [('X', FloatTensorType([None, n_features]))]

    options = {}
    if is_classifier:
        options = {id(model): {'zipmap': False}}

    onnx_model = convert_sklearn(model, initial_types=initial_type, options=options)

    with open(onnx_path, 'wb') as f:
        f.write(onnx_model.SerializeToString())

    old_size = os.path.getsize(pkl_path) / (1024 * 1024)
    new_size = os.path.getsize(onnx_path) / (1024 * 1024)
    print(f"  ✅ {os.path.basename(pkl_path)}: {old_size:.1f}MB → {new_size:.1f}MB ({(1-new_size/old_size)*100:.0f}% smaller)")


def convert_xgboost_to_onnx(pkl_path, onnx_path, n_features, n_classes):
    """Convert XGBoost classifier to ONNX."""
    from onnxmltools import convert_xgboost
    from onnxmltools.convert.common.data_types import FloatTensorType

    model = joblib.load(pkl_path)
    initial_type = [('X', FloatTensorType([None, n_features]))]
    onnx_model = convert_xgboost(model, initial_types=initial_type)

    with open(onnx_path, 'wb') as f:
        f.write(onnx_model.SerializeToString())

    old_size = os.path.getsize(pkl_path) / (1024 * 1024)
    new_size = os.path.getsize(onnx_path) / (1024 * 1024)
    print(f"  ✅ {os.path.basename(pkl_path)}: {old_size:.1f}MB → {new_size:.1f}MB ({(1-new_size/old_size)*100:.0f}% smaller)")


def convert_scaler_to_onnx(pkl_path, onnx_path, n_features):
    """Convert a StandardScaler to ONNX."""
    from skl2onnx import convert_sklearn
    from skl2onnx.common.data_types import FloatTensorType

    scaler = joblib.load(pkl_path)
    initial_type = [('X', FloatTensorType([None, n_features]))]
    onnx_model = convert_sklearn(scaler, initial_types=initial_type)

    with open(onnx_path, 'wb') as f:
        f.write(onnx_model.SerializeToString())
    print(f"  ✅ {os.path.basename(pkl_path)} → ONNX scaler")


def main():
    print("=" * 60)
    print("FinWise AI — ONNX Model Conversion")
    print("=" * 60)

    # ── 1. Risk Model (sklearn classifier) ──
    print("\n🔄 Converting Risk Model...")
    with open(os.path.join(MODELS_DIR, 'risk_features.json'), 'r') as f:
        risk_features = json.load(f)
    n_risk = len(risk_features)

    convert_sklearn_to_onnx(
        os.path.join(MODELS_DIR, 'risk_model.pkl'),
        os.path.join(MODELS_DIR, 'risk_model.onnx'),
        n_features=n_risk, is_classifier=True
    )
    convert_scaler_to_onnx(
        os.path.join(MODELS_DIR, 'risk_scaler.pkl'),
        os.path.join(MODELS_DIR, 'risk_scaler.onnx'),
        n_features=n_risk
    )

    # ── 2. Fund Model (XGBoost classifier) ──
    print("\n🔄 Converting Fund Model...")
    with open(os.path.join(MODELS_DIR, 'fund_features.json'), 'r') as f:
        fund_features = json.load(f)
    n_fund = len(fund_features)

    convert_xgboost_to_onnx(
        os.path.join(MODELS_DIR, 'fund_model.pkl'),
        os.path.join(MODELS_DIR, 'fund_model.onnx'),
        n_features=n_fund, n_classes=8
    )
    convert_scaler_to_onnx(
        os.path.join(MODELS_DIR, 'fund_scaler.pkl'),
        os.path.join(MODELS_DIR, 'fund_scaler.onnx'),
        n_features=n_fund
    )

    # ── 3. Return Models (3 sklearn regressors) ──
    print("\n🔄 Converting Return Models (3x)...")
    with open(os.path.join(MODELS_DIR, 'return_features.json'), 'r') as f:
        return_features = json.load(f)
    n_ret = len(return_features)

    for name in ['return_base', 'return_optimistic', 'return_pessimistic']:
        convert_sklearn_to_onnx(
            os.path.join(MODELS_DIR, f'{name}.pkl'),
            os.path.join(MODELS_DIR, f'{name}.onnx'),
            n_features=n_ret, is_classifier=False
        )
    convert_scaler_to_onnx(
        os.path.join(MODELS_DIR, 'return_scaler.pkl'),
        os.path.join(MODELS_DIR, 'return_scaler.onnx'),
        n_features=n_ret
    )

    # ── Summary ──
    print("\n" + "=" * 60)
    print("CONVERSION COMPLETE!")
    print("=" * 60)

    total_pkl = 0
    total_onnx = 0
    for f in os.listdir(MODELS_DIR):
        path = os.path.join(MODELS_DIR, f)
        size = os.path.getsize(path)
        if f.endswith('.pkl'):
            total_pkl += size
        elif f.endswith('.onnx'):
            total_onnx += size

    print(f"\nTotal .pkl size:  {total_pkl / (1024*1024):.1f} MB")
    print(f"Total .onnx size: {total_onnx / (1024*1024):.1f} MB")
    print(f"Savings:          {(total_pkl - total_onnx) / (1024*1024):.1f} MB ({(1-total_onnx/total_pkl)*100:.0f}%)")
    print("\n⚡ You can now delete .pkl files and use ONNX-only inference!")


if __name__ == "__main__":
    main()
