# ═══════════════════════════════════════════════════════════════
# FinWise AI Backend — Multi-Stage Docker Build (Render-Ready)
# Target: <300MB final image, dynamic PORT for Render
# ═══════════════════════════════════════════════════════════════

# ── Stage 1: Builder ──────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# System deps for building native extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ── Stage 2: Runtime ──────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY . .

# Remove files not needed at runtime
RUN rm -rf scripts/ tests/ __pycache__ ml/data/ ml/train_*.py \
    ml/demo_for_judges.py ml/model_report.py \
    test_*.py append_*.py \
    ml/models/*.pkl \
    .env .git README.md *.md \
    requirements.onnx.txt

# Render assigns PORT dynamically, default 8000 for local
ENV PORT=8000

EXPOSE ${PORT}

# Use shell form so $PORT gets expanded at runtime
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
