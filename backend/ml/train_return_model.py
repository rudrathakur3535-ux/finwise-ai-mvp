import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def train_and_evaluate(X_train, X_test, y_train, y_test, model_name):
    # RFR is highly accurate and handles non-linear interactions well
    model = RandomForestRegressor(n_estimators=300, max_depth=15, random_state=42, n_jobs=-1)
    
    print(f"Training {model_name} Model...")
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    
    print(f"{model_name} Metrics:")
    print(f"  MAE: {mae:.4f}")
    print(f"  RMSE: {rmse:.4f}")
    print(f"  R² Score: {r2:.4f}")
    
    return model, r2

def main():
    print("--- RETURN PREDICTOR TRAINING ---")
    data_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'return_dataset.csv')
    
    try:
        df = pd.read_csv(data_path)
        print("Data loaded successfully!")
    except FileNotFoundError:
        print("Data not found!")
        return
        
    features = [
        'fund_category_encoded', 'horizon_years', 'risk_score', 
        'market_condition', 'expense_ratio', 'aum_category', 
        'sip_amount', 'age'
    ]
    
    X = df[features]
    
    # 3 Targets
    y_pessimistic = df['pessimistic_return']
    y_base = df['base_return']
    y_optimistic = df['optimistic_return']
    
    # Scale Features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train-test split (We split indices so all 3 models train on same train rows)
    indices = np.arange(len(df))
    train_idx, test_idx = train_test_split(indices, test_size=0.2, random_state=42)
    
    X_train = X_scaled[train_idx]
    X_test = X_scaled[test_idx]
    
    # Train 3 models
    print("\n--- PESSIMISTIC RETURN MODEL ---")
    model_p, r2_p = train_and_evaluate(X_train, X_test, y_pessimistic.iloc[train_idx], y_pessimistic.iloc[test_idx], "Pessimistic")
    
    print("\n--- BASE RETURN MODEL ---")
    model_b, r2_b = train_and_evaluate(X_train, X_test, y_base.iloc[train_idx], y_base.iloc[test_idx], "Base")
    
    print("\n--- OPTIMISTIC RETURN MODEL ---")
    model_o, r2_o = train_and_evaluate(X_train, X_test, y_optimistic.iloc[train_idx], y_optimistic.iloc[test_idx], "Optimistic")
    
    avg_r2 = (r2_p + r2_b + r2_o) / 3
    print(f"\nAverage R² Score: {avg_r2:.4f}")
    if avg_r2 < 0.80:
        print("ALERT: R² is below 0.80. To improve, reduce noise in generate_return_data.py or add more trees to RandomForestRegressor.")
    
    # Save models
    models_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models')
    os.makedirs(models_dir, exist_ok=True)
    
    joblib.dump(model_p, os.path.join(models_dir, 'return_pessimistic.pkl'))
    joblib.dump(model_b, os.path.join(models_dir, 'return_base.pkl'))
    joblib.dump(model_o, os.path.join(models_dir, 'return_optimistic.pkl'))
    joblib.dump(scaler, os.path.join(models_dir, 'return_scaler.pkl'))
    
    with open(os.path.join(models_dir, 'return_features.json'), 'w') as f:
        json.dump(features, f)
        
    print("\nModels and scaler saved successfully!")

if __name__ == "__main__":
    main()
