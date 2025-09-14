#!/bin/bash

# Deploy LLM service to Railway
# Choose between vLLM or TGI for serving Llama 3.1

echo "🚀 Deploying LLM service to Railway..."
echo ""
echo "Available options:"
echo "1. vLLM (Recommended - High performance, better throughput)"
echo "2. TGI (Hugging Face Text Generation Inference)"
echo ""

# Default to vLLM if no argument provided
SERVICE_TYPE=${1:-"vllm"}

if [ "$SERVICE_TYPE" = "vllm" ]; then
    echo "📦 Deploying vLLM service..."
    CONFIG_FILE="railway-vllm.toml"
    SERVICE_NAME="llm-vllm"
elif [ "$SERVICE_TYPE" = "tgi" ]; then
    echo "📦 Deploying TGI service..."
    CONFIG_FILE="railway-tgi.toml"
    SERVICE_NAME="llm-tgi"
else
    echo "❌ Invalid service type. Use 'vllm' or 'tgi'"
    exit 1
fi

# Create new service for LLM
echo "📦 Creating $SERVICE_NAME service..."
railway service create $SERVICE_NAME

# Switch to the LLM service
echo "🔄 Switching to $SERVICE_NAME service..."
railway service $SERVICE_NAME

# Deploy using the selected configuration
echo "🚢 Deploying $SERVICE_TYPE with Llama 3.1..."
cp $CONFIG_FILE railway.toml

# Set Hugging Face token (you need to set this manually)
echo "⚠️  IMPORTANT: You need to set your Hugging Face token:"
echo "   railway variables --set \"HUGGING_FACE_HUB_TOKEN=your-token-here\""
echo "   or for TGI: railway variables --set \"HF_TOKEN=your-token-here\""
echo ""

# Deploy the service
railway up --detach

# Get the service URL
echo "🌐 Getting LLM service URL..."
LLM_URL=$(railway domain)
echo "LLM service deployed at: $LLM_URL"

# Switch back to main service
echo "🔄 Switching back to main service..."
railway service presto-frontend

# Update main service environment variables
echo "⚙️ Updating main service environment variables..."
if [ "$SERVICE_TYPE" = "vllm" ]; then
    # vLLM configuration - no Ollama needed
else
    # TGI configuration - no Ollama needed
fi

echo "✅ LLM service deployment complete!"
echo "🔗 Internal URL: http://$SERVICE_NAME.railway.internal:8000"
echo "🔗 Public URL: $LLM_URL"
echo "🔗 API Endpoint: $LLM_URL/v1/chat/completions"
echo ""
echo "Next steps:"
echo "1. Set your Hugging Face token in Railway dashboard"
echo "2. Wait for LLM service to download model (may take 10-15 minutes)"
echo "3. Test the connection: curl $LLM_URL/v1/models"
echo "4. Redeploy main service to use new LLM service"
echo ""
echo "Usage examples:"
echo "  Deploy vLLM: ./deploy-llm-service.sh vllm"
echo "  Deploy TGI:  ./deploy-llm-service.sh tgi"