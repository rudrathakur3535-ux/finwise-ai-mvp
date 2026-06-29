import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
import xgboost as xgb
from sklearn.metrics import accuracy_score

def main():
    print("--- FUND RECOMMENDER TRAINING ---")
    data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'fund_dataset.csv')
    
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print("Data not found!")
        return
        
    # FEATURES
    features = ['risk_score', 'age', 'horizon_years', 'goal_encoded', 'monthly_sip', 'income_category']
    X = df[features]
    y = df['fund_category']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Models
    models = {
        "Random Forest": RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42),
        "Gradient Boosting": GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42),
        "XGBoost": xgb.XGBClassifier(n_estimators=200, learning_rate=0.1, max_depth=5, random_state=42, use_label_encoder=False, eval_metric='mlogloss')
    }
    
    best_accuracy = 0
    best_model_name = ""
    best_model = None
    
    for name, model in models.items():
        print(f"\nTraining {name}...")
        model.fit(X_train_scaled, y_train)
        
        y_test_pred = model.predict(X_test_scaled)
        test_acc = accuracy_score(y_test, y_test_pred)
        
        print(f"{name} Testing Accuracy: {test_acc:.4f}")
        
        if test_acc > best_accuracy:
            best_accuracy = test_acc
            best_model_name = name
            best_model = model
            
    print(f"\nBest Model: {best_model_name} (Accuracy: {best_accuracy:.4f})")
    
    # Save Model
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(best_model, os.path.join(models_dir, 'fund_model.pkl'))
    joblib.dump(scaler, os.path.join(models_dir, 'fund_scaler.pkl'))
    
    with open(os.path.join(models_dir, 'fund_features.json'), 'w') as f:
        json.dump(features, f)
        
    print("Models saved successfully!")

if __name__ == "__main__":
    main()
