#!/bin/bash

# vLLM startup script for Railway deployment
# Optimized for Llama 3.1 8B model

set -e

echo "Starting vLLM server with optimized configuration..."
echo "Model: ${MODEL_NAME:-meta-llama/Meta-Llama-3.1-8B-Instruct}"
echo "Host: ${HOST:-0.0.0.0}"
echo "Port: ${PORT:-8000}"

# Set default values if not provided
export MODEL_NAME=${MODEL_NAME:-"meta-llama/Meta-Llama-3.1-8B-Instruct"}
export HOST=${HOST:-"0.0.0.0"}
export PORT=${PORT:-8000}

# vLLM optimization settings
export VLLM_ATTENTION_BACKEND=${VLLM_ATTENTION_BACKEND:-"FLASHINFER"}
export VLLM_GPU_MEMORY_UTILIZATION=${VLLM_GPU_MEMORY_UTILIZATION:-"0.85"}
export VLLM_MAX_NUM_BATCHED_TOKENS=${VLLM_MAX_NUM_BATCHED_TOKENS:-"8192"}
export VLLM_MAX_NUM_SEQS=${VLLM_MAX_NUM_SEQS:-"256"}
export VLLM_SCHEDULER_MAX_STEPS=${VLLM_SCHEDULER_MAX_STEPS:-"10"}
export VLLM_ENABLE_PREFIX_CACHING=${VLLM_ENABLE_PREFIX_CACHING:-"true"}
export VLLM_DISABLE_LOG_STATS=${VLLM_DISABLE_LOG_STATS:-"false"}

# CUDA optimizations
export CUDA_VISIBLE_DEVICES=${CUDA_VISIBLE_DEVICES:-"0"}
export CUDA_LAUNCH_BLOCKING=${CUDA_LAUNCH_BLOCKING:-"0"}

# Start vLLM server with optimized parameters
python -m vllm.entrypoints.openai.api_server \
    --model "$MODEL_NAME" \
    --host "$HOST" \
    --port "$PORT" \
    --gpu-memory-utilization "$VLLM_GPU_MEMORY_UTILIZATION" \
    --max-num-batched-tokens "$VLLM_MAX_NUM_BATCHED_TOKENS" \
    --max-num-seqs "$VLLM_MAX_NUM_SEQS" \
    --scheduler-max-steps "$VLLM_SCHEDULER_MAX_STEPS" \
    --enable-prefix-caching \
    --served-model-name "llama-3.1-8b" \
    --trust-remote-code \
    --disable-log-requests \
    --tensor-parallel-size 1 \
    --pipeline-parallel-size 1 \
    --worker-use-ray false \
    --engine-use-ray false \
    --disable-log-stats false