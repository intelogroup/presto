#!/bin/bash

# Ollama startup script for Railway
# Pulls and serves Llama 3.1 and Mistral models

set -e

echo "🚀 Starting Ollama service..."

# Start Ollama in the background
ollama serve &
OLLAMA_PID=$!

echo "⏳ Waiting for Ollama to be ready..."
# Wait for Ollama to be ready
while ! curl -s http://localhost:11434/api/tags > /dev/null; do
    echo "Waiting for Ollama to start..."
    sleep 2
done

echo "✅ Ollama is ready!"

# Function to pull model with retry logic
pull_model() {
    local model=$1
    local max_retries=3
    local retry=0
    
    while [ $retry -lt $max_retries ]; do
        echo "📥 Pulling model: $model (attempt $((retry + 1))/$max_retries)"
        if ollama pull "$model"; then
            echo "✅ Successfully pulled: $model"
            return 0
        else
            echo "❌ Failed to pull: $model"
            retry=$((retry + 1))
            if [ $retry -lt $max_retries ]; then
                echo "⏳ Retrying in 10 seconds..."
                sleep 10
            fi
        fi
    done
    
    echo "💥 Failed to pull $model after $max_retries attempts"
    return 1
}

# Pull required models
echo "📦 Pulling required models..."

# Pull Llama 3.1 8B (quantized for better performance on CPU)
if [ "${PULL_LLAMA:-true}" = "true" ]; then
    pull_model "llama3.1:8b" || echo "⚠️ Warning: Failed to pull Llama 3.1"
fi

# Pull Mistral 7B
if [ "${PULL_MISTRAL:-true}" = "true" ]; then
    pull_model "mistral:7b" || echo "⚠️ Warning: Failed to pull Mistral"
fi

# List available models
echo "📋 Available models:"
ollama list

echo "🎉 Ollama setup complete! Service is running on port 11434"

# Keep the service running
wait $OLLAMA_PID