# Railway Deployment Guide for Presto Presentation Generator

## 🚀 Services Overview

Your Presto setup consists of two Railway services:
1. **Presto Backend** (`railway.toml`) - Express.js PPTX generation API
2. **Ollama Service** (`railway-ollama.toml`) - Local LLM provider

## 📋 Deployment Steps

### Phase 1: Deploy Ollama Service First

1. **Create Ollama Service in Railway**
   - Create new service and upload `railway-ollama.toml`
   - Note down the service name (used for internal DNS)

2. **Configure Ollama Volume (Optional but Recommended)**
   - In Railway dashboard, go to your Ollama service
   - Add a volume named `models` mounted to `/home/ollama/.ollama`
   - This persists downloaded models between deployments

3. **Update Environment Variables**
   - The config should pull Llama 3.1 8B and Mistral 7B automatically
   - Monitor startup logs for model download progress

### Phase 2: Deploy Main Presto Service

1. **Create Main Service**
   - Create new service and upload `railway.toml`
   - Update the service name placeholders in environment variables

2. **Configure Environment Variables**
   ```bash
   # Replace these placeholders in Railway dashboard:

   # Required: Get from OpenRouter.ai dashboard
   OPENROUTER_API_KEY = "sk-or-v1-..."

   # Optional: Update with your Railway app URLs
   SITE_URL = "https://your-presto-service.railway.app"
   SITE_NAME = "My Presto Generator"

   # Critical: Update with your Ollama service name
   OLLAMA_BASE_URL = "http://your-ollama-service-name.railway.internal:11434"
   ```

3. **Service Networking**
   - Ensure both services are in the same Railway project
   - Railway automatically provides internal DNS resolution

## 🔧 Configuration Checklist

- [ ] Ollama service deployed and healthy (`/api/tags` endpoint)
- [ ] Ollama service name noted for internal URL
- [ ] Main service environment variables configured
- [ ] `OLLAMA_BASE_URL` points to correct Ollama service
- [ ] `OPENROUTER_API_KEY` set in main service
- [ ] Both services have public domains or private networking set up

## 🧪 Testing Deployment

1. **Test Ollama Connectivity**
   ```bash
   curl https://your-ollama-service.railway.app/api/tags
   ```

2. **Test Main Service Health**
   ```bash
   curl https://your-presto-service.railway.app/api/health
   ```

3. **Test Presentation Generation**
   ```bash
   curl -X POST https://your-presto-service.railway.app/api/generate-pptx \
        -H "Content-Type: application/json" \
        -d '{"title": "Test", "slides": [{"title": "Slide 1", "content": "Hello World"}]}'
   ```

## 🚨 Troubleshooting

### "Ollama connection failed"
- Check `OLLAMA_BASE_URL` is correct
- Ensure Ollama service is running and healthy
- Verify Railway project networking

### "API key not configured"
- Set `OPENROUTER_API_KEY` in main service environment variables
- Ensure key has credits and is valid

### Model download issues
- Check Ollama startup logs
- Consider increasing deployment timeout
- Models are large - be patient on first deployment

## 📊 Resource Usage

- **Main Service**: 1GB RAM, 500m CPU (PPTX generation)
- **Ollama Service**: 4GB RAM, 2000m CPU (Model inference)
- **Storage**: ~10GB+ for Ollama models (volume recommended)

## 🔄 Updates & Maintenance

- Both services auto-restart on failure
- Railway handles SSL certificates automatically
- Update environment variables via Railway dashboard
- Monitor usage in Railway analytics

## 🆘 Support

If issues persist:
1. Check Railway service logs
2. Verify all environment variables are set
3. Test Ollama service independently
4. Ensure services are in the same project for networking
