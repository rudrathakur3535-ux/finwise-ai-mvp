"""
LIGHTWEIGHT MODEL RETRAINING — FinWise AI
Retrains all models with fewer trees/lower depth for Render 512MB RAM limit.
Then converts to ONNX directly.

Target: Total ONNX models < 30MB (vs current 150MB)
Run: python scripts/retrain_lightweight.py
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import GradientBoostingClassifier, GradientBoostingRegressor
from sklearn.metrics import accuracy_score, r2_score

# ONNX conversion
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(BASE_DIR, 'ml')
MODELS_DIR = os.path.join(ML_DIR, 'models')
DATA_DIR = os.path.join(ML_DIR, 'data')

os.makedirs(MODELS_DIR, exist_ok=True)


def save_as_onnx(model, n_features, output_path, is_classifier=True):
    """Convert sklearn model to ONNX and save."""
    initial_type = [('X', FloatTensorType([None, n_features]))]
    options = {}
    if is_classifier:
        options = {id(model): {'zipmap': False}}
    onnx_model = convert_sklearn(model, initial_types=initial_type, options=options)
    with open(output_path, 'wb') as f:
        f.write(onnx_model.SerializeToString())
    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"    Saved: {os.path.basename(output_path)} ({size_mb:.1f} MB)")


def save_scaler_onnx(scaler, n_features, output_path):
    """Convert scaler to ONNX."""
    initial_type = [('X', FloatTensorType([None, n_features]))]
    onnx_model = convert_sklearn(scaler, initial_types=initial_type)
    with open(output_path, 'wb') as f:
        f.write(onnx_model.SerializeToString())


# ══════════════════════════════════════════════════════════════════
# 1. RISK CLASSIFIER — GradientBoosting (small & accurate)
# ══════════════════════════════════════════════════════════════════

def train_risk():
    print("\n" + "=" * 50)
    print("RISK CLASSIFIER — Lightweight Gradient Boosting")
    print("=" * 50)

    df = pd.read_csv(os.path.join(DATA_DIR, 'risk_dataset.csv'))
    df['savings_to_income_ratio'] = df['monthly_savings'] / df['monthly_income']

    bins = [0, 50000, 150000, float('inf')]
    labels = ['low', 'medium', 'high']
    df['income_category'] = pd.cut(df['monthly_income'], bins=bins, labels=labels)

    le = LabelEncoder()
    df['income_category_encoded'] = le.fit_transform(df['income_category'])

    features = [
        'age', 'monthly_income', 'monthly_savings', 'savings_to_income_ratio',
        'horizon_years', 'risk_appetite_encoded', 'existing_investments',
        'dependents', 'income_stability', 'income_category_encoded'
    ]
    X = df[features]
    y = df['risk_category']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Lightweight: 50 trees, depth 4 (vs 300 trees depth 15)
    model = GradientBoostingClassifier(
        n_estimators=50, learning_rate=0.1, max_depth=4, random_state=42
    )
    model.fit(X_train_scaled, y_train)

    acc = accuracy_score(y_test, model.predict(X_test_scaled))
    print(f"  Accuracy: {acc:.4f}")

    # Save ONNX
    save_as_onnx(model, len(features), os.path.join(MODELS_DIR, 'risk_model.onnx'), is_classifier=True)
    save_scaler_onnx(scaler, len(features), os.path.join(MODELS_DIR, 'risk_scaler.onnx'))
    joblib.dump(le, os.path.join(MODELS_DIR, 'risk_label_encoder.pkl'))
    with open(os.path.join(MODELS_DIR, 'risk_features.json'), 'w') as f:
        json.dump(features, f)

    return acc


# ══════════════════════════════════════════════════════════════════
# 2. FUND RECOMMENDER — GradientBoosting (replaces XGBoost)
# ══════════════════════════════════════════════════════════════════

def train_fund():
    print("\n" + "=" * 50)
    print("FUND RECOMMENDER — Lightweight Gradient Boosting")
    print("=" * 50)

    df = pd.read_csv(os.path.join(DATA_DIR, 'fund_dataset.csv'))

    features = ['risk_score', 'age', 'horizon_years', 'goal_encoded', 'monthly_sip', 'income_category']
    X = df[features]
    y = df['fund_category']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Lightweight: 80 trees, depth 5
    model = GradientBoostingClassifier(
        n_estimators=80, learning_rate=0.1, max_depth=5, random_state=42
    )
    model.fit(X_train_scaled, y_train)

    acc = accuracy_score(y_test, model.predict(X_test_scaled))
    print(f"  Accuracy: {acc:.4f}")

    save_as_onnx(model, len(features), os.path.join(MODELS_DIR, 'fund_model.onnx'), is_classifier=True)
    save_scaler_onnx(scaler, len(features), os.path.join(MODELS_DIR, 'fund_scaler.onnx'))
    with open(os.path.join(MODELS_DIR, 'fund_features.json'), 'w') as f:
        json.dump(features, f)

    return acc


# ══════════════════════════════════════════════════════════════════
# 3. RETURN PREDICTOR — 3x GradientBoosting Regressors
# ══════════════════════════════════════════════════════════════════

def train_return():
    print("\n" + "=" * 50)
    print("RETURN PREDICTOR — 3x Lightweight GB Regressors")
    print("=" * 50)

    df = pd.read_csv(os.path.join(DATA_DIR, 'return_dataset.csv'))

    features = [
        'fund_category_encoded', 'horizon_years', 'risk_score',
        'market_condition', 'expense_ratio', 'aum_category',
        'sip_amount', 'age'
    ]
    X = df[features]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    indices = np.arange(len(df))
    train_idx, test_idx = train_test_split(indices, test_size=0.2, random_state=42)
    X_train, X_test = X_scaled[train_idx], X_scaled[test_idx]

    targets = {
        'pessimistic': df['pessimistic_return'],
        'base': df['base_return'],
        'optimistic': df['optimistic_return']
    }

    r2_scores = []
    for scenario, y in targets.items():
        y_train, y_test = y.iloc[train_idx], y.iloc[test_idx]

        # Lightweight: 60 trees, depth 5 (vs 300 trees depth 15 Random Forest)
        model = GradientBoostingRegressor(
            n_estimators=60, learning_rate=0.1, max_depth=5, random_state=42
        )
        model.fit(X_train, y_train)

        r2 = r2_score(y_test, model.predict(X_test))
        r2_scores.append(r2)
        print(f"  {scenario.capitalize()} R2: {r2:.4f}")

        save_as_onnx(
            model, len(features),
            os.path.join(MODELS_DIR, f'return_{scenario}.onnx'),
            is_classifier=False
        )

    save_scaler_onnx(scaler, len(features), os.path.join(MODELS_DIR, 'return_scaler.onnx'))
    with open(os.path.join(MODELS_DIR, 'return_features.json'), 'w') as f:
        json.dump(features, f)

    return np.mean(r2_scores)


# ══════════════════════════════════════════════════════════════════

def main():
    print("=" * 60)
    print("FinWise AI — Lightweight Model Retraining + ONNX Export")
    print("Target: < 30MB total models for Render 512MB RAM")
    print("=" * 60)

    risk_acc = train_risk()
    fund_acc = train_fund()
    return_r2 = train_return()

    # Final summary
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"  Risk Classifier Accuracy:  {risk_acc:.4f}")
    print(f"  Fund Recommender Accuracy: {fund_acc:.4f}")
    print(f"  Return Predictor Avg R2:   {return_r2:.4f}")

    total_onnx = sum(
        os.path.getsize(os.path.join(MODELS_DIR, f))
        for f in os.listdir(MODELS_DIR)
        if f.endswith('.onnx')
    )
    print(f"\n  Total ONNX model size: {total_onnx / (1024 * 1024):.1f} MB")
    print("=" * 60)


if __name__ == "__main__":
    main()
