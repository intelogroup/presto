#!/bin/bash

# Deploy Ollama service to Railway
# This script creates a separate Ollama service for Llama 3.1

echo "🚀 Deploying Ollama service to Railway..."

# Create new service for Ollama
echo "📦 Creating Ollama service..."
railway service create ollama-llm

# Switch to the Ollama service
echo "🔄 Switching to Ollama service..."
railway service ollama-llm

# Deploy using the Ollama configuration
echo "🚢 Deploying Ollama with Llama 3.1..."
cp railway-ollama.toml railway.toml
railway up

# Get the service URL
echo "🌐 Getting Ollama service URL..."
OLLAMA_URL=$(railway domain)
echo "Ollama service deployed at: $OLLAMA_URL"

# Switch back to main service
echo "🔄 Switching back to main service..."
railway service presto-frontend

# Update main service environment variables
echo "⚙️ Updating main service environment variables..."
railway variables set OLLAMA_BASE_URL="http://ollama-llm.railway.internal:11434"
railway variables set OLLAMA_ENABLED="true"
railway variables set OLLAMA_LLAMA_MODEL="llama3.1:8b"
railway variables set OLLAMA_MISTRAL_MODEL="mistral:7b"

echo "✅ Ollama service deployment complete!"
echo "🔗 Internal URL: http://ollama-llm.railway.internal:11434"
echo "🔗 Public URL: $OLLAMA_URL"
echo ""
echo "Next steps:"
echo "1. Wait for Ollama service to pull Llama 3.1 model (may take 10-15 minutes)"
echo "2. Test the connection: curl $OLLAMA_URL/api/tags"
echo "3. Redeploy main service to use new Ollama service"