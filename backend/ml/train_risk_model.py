import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import xgboost as xgb
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

def main():
    # STEP 1: Load and explore data
    data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'risk_dataset.csv')
    df = pd.DataFrame()
    try:
        df = pd.read_csv(data_path)
        print("Data loaded successfully!")
    except FileNotFoundError:
        print(f"Error: Dataset {data_path} nahi mila. Pehle generate_risk_data.py run karein.")
        return

    # STEP 2: Feature Engineering
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

    # STEP 3: Train-Test Split (80/20)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # STEP 4: Feature Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # STEP 5 & 6: Train Multiple Models & Evaluate with CV
    print("\n--- MODEL TRAINING & EVALUATION ---")
    
    models = {
        "Random Forest": RandomForestClassifier(n_estimators=300, max_depth=15, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=200, learning_rate=0.05, max_depth=5, random_state=42),
        "XGBoost": xgb.XGBClassifier(n_estimators=300, learning_rate=0.05, max_depth=5, random_state=42, use_label_encoder=False, eval_metric='mlogloss')
    }

    results = {}
    best_model_name = ""
    best_accuracy = 0
    best_model = None

    for name, model in models.items():
        # Cross validation (5-fold) taaki overfitting na ho
        cv_scores = cross_val_score(model, X_train_scaled, y_train, cv=5)
        print(f"\n{name} CV Accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std() * 2:.4f})")
        
        # Model train karte hain poore train data par
        model.fit(X_train_scaled, y_train)
        
        # Predictions nikaalte hain
        y_test_pred = model.predict(X_test_scaled)
        
        # Final Test Accuracy calculate karte hain
        test_acc = accuracy_score(y_test, y_test_pred)
        results[name] = test_acc
        
        print(f"{name} Testing Accuracy: {test_acc:.4f}")
        
        if test_acc > best_accuracy:
            best_accuracy = test_acc
            best_model_name = name
            best_model = model

    # STEP 7: Select Best Model
    print("\n--- MODEL SELECTION ---")
    print(f"Sabse high test accuracy '{best_model_name}' ki hai ({best_accuracy:.4f}).")

    # STEP 9: Save Best Model
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(best_model, os.path.join(models_dir, 'risk_model.pkl'))
    joblib.dump(scaler, os.path.join(models_dir, 'risk_scaler.pkl'))
    joblib.dump(le, os.path.join(models_dir, 'risk_label_encoder.pkl'))
    
    with open(os.path.join(models_dir, 'risk_features.json'), 'w') as f:
        json.dump(features, f)

    print("\n--- FINAL SUMMARY ---")
    print(f"Best Model: {best_model_name}")
    print(f"Test Accuracy: {best_accuracy * 100:.1f}%")
    print("Model saved successfully!")

if __name__ == "__main__":
    main()
