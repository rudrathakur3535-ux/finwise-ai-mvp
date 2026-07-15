import sys
import os

try:
    print("Testing ONNX imports...")
    import onnxruntime as ort
    print(f"ONNX Runtime Version: {ort.__version__}")
    
    models_dir = os.path.join(os.path.dirname(__file__), "ml", "models")
    print(f"Models directory: {models_dir}")
    
    test_model = os.path.join(models_dir, "risk_model.onnx")
    print(f"Attempting to load: {test_model}")
    
    session = ort.InferenceSession(test_model, providers=['CPUExecutionProvider'])
    print("Success: Loaded risk_model.onnx")
    
except Exception as e:
    print(f"Error occurred: {e}")
    sys.exit(1)

print("Test complete.")
