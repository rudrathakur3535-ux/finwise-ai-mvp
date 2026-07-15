"""
ONNX Model Quantization — FinWise AI
Converts float32 ONNX models to uint8 dynamic quantization.
Reduces memory ~60-70% with minimal accuracy loss.
Run ONCE: python scripts/quantize_onnx.py
"""

import os
import sys

MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'ml', 'models')


def quantize_model(input_path, output_path):
    """Dynamic quantization: float32 -> uint8"""
    from onnxruntime.quantization import quantize_dynamic, QuantType

    quantize_dynamic(
        model_input=input_path,
        model_output=output_path,
        weight_type=QuantType.QUInt8
    )

    old_size = os.path.getsize(input_path) / (1024 * 1024)
    new_size = os.path.getsize(output_path) / (1024 * 1024)
    print(f"  {os.path.basename(input_path)}: {old_size:.1f}MB -> {new_size:.1f}MB ({(1 - new_size / old_size) * 100:.0f}% smaller)")


def main():
    print("=" * 60)
    print("FinWise AI - ONNX Quantization (float32 -> uint8)")
    print("=" * 60)

    models_to_quantize = [
        "risk_model.onnx",
        "fund_model.onnx",
        "return_base.onnx",
        "return_optimistic.onnx",
        "return_pessimistic.onnx",
    ]

    for model_name in models_to_quantize:
        input_path = os.path.join(MODELS_DIR, model_name)
        output_path = os.path.join(MODELS_DIR, model_name.replace(".onnx", "_q8.onnx"))

        if not os.path.exists(input_path):
            print(f"  SKIP: {model_name} not found")
            continue

        print(f"\nQuantizing {model_name}...")
        try:
            quantize_model(input_path, output_path)
        except Exception as e:
            print(f"  ERROR: {e}")
            # Copy original as fallback
            import shutil
            shutil.copy2(input_path, output_path)
            print(f"  Copied original as fallback")

    # Scalers are tiny, just copy them with _q8 suffix for consistency
    import shutil
    for scaler in ["risk_scaler.onnx", "fund_scaler.onnx", "return_scaler.onnx"]:
        src = os.path.join(MODELS_DIR, scaler)
        dst = os.path.join(MODELS_DIR, scaler.replace(".onnx", "_q8.onnx"))
        if os.path.exists(src):
            shutil.copy2(src, dst)
            print(f"\nCopied scaler: {scaler}")

    # Summary
    print("\n" + "=" * 60)
    total_orig = sum(
        os.path.getsize(os.path.join(MODELS_DIR, f))
        for f in os.listdir(MODELS_DIR)
        if f.endswith('.onnx') and '_q8' not in f
    )
    total_q8 = sum(
        os.path.getsize(os.path.join(MODELS_DIR, f))
        for f in os.listdir(MODELS_DIR)
        if f.endswith('_q8.onnx')
    )
    print(f"Original models: {total_orig / (1024 * 1024):.1f} MB")
    print(f"Quantized models: {total_q8 / (1024 * 1024):.1f} MB")
    print(f"Savings: {(total_orig - total_q8) / (1024 * 1024):.1f} MB ({(1 - total_q8 / total_orig) * 100:.0f}%)")
    print("=" * 60)


if __name__ == "__main__":
    main()
