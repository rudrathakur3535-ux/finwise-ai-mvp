import joblib

model = joblib.load('ml/models/risk_model.pkl')
print('Model type:', type(model).__name__)
print('Model loaded successfully!')