"""
Quick test — Gemini API key check karo
"""
from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key loaded: {api_key[:10]}...{api_key[-5:]}")

client = genai.Client(api_key=api_key)

# Dono models try karo
models = ["gemini-2.0-flash-lite", "gemini-2.0-flash"]

for model in models:
    print(f"\nTrying: {model}...")
    try:
        response = client.models.generate_content(
            model=model,
            contents="Say 'Hello FinWise!' in one line"
        )
        print(f"Response: {response.text}")
        print(f"[SUCCESS] {model} is working!")
        break
    except Exception as e:
        print(f"[FAILED] {model}: {e}")
