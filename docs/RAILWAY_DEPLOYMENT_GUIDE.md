# Railway Deployment Guide for Presto Presentation Generator

## 🚀 Services Overview

Your Presto setup consists of two Railway services:
1. **Presto Backend** (`railway.toml`) - Express.js PPTX generation API
2. **vLLM Service** (`railway-vllm.toml`) - Local LLM provider

## 📋 Deployment Steps

### Phase 1: Deploy vLLM Service First

1. **Create vLLM Service in Railway**
- Create new service and upload `railway-vllm.toml`
- Deploy and wait for successful startup

2. **Configure vLLM Resources**
- In Railway dashboard, go to your vLLM service
- Ensure adequate GPU/CPU resources for model inference
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

   # Critical: Update with your vLLM service name
VLLM_BASE_URL = "http://your-vllm-service-name.railway.internal:8000"
   ```

3. **Service Networking**
   - Ensure both services are in the same Railway project
   - Railway automatically provides internal DNS resolution

## 🔧 Configuration Checklist

- [ ] vLLM service deployed and healthy (`/v1/models` endpoint)
- [ ] vLLM service name noted for internal URL
- [ ] Main service environment variables configured
- [ ] `VLLM_BASE_URL` points to correct vLLM service
- [ ] `OPENROUTER_API_KEY` set in main service
- [ ] Both services have public domains or private networking set up

## 🧪 Testing Deployment

1. **Test vLLM Connectivity**
   ```bash
   curl https://your-vllm-service.railway.app/v1/models
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

### "vLLM connection failed"
- Check `VLLM_BASE_URL` is correct
- Ensure vLLM service is running and healthy
- Verify Railway project networking

### "API key not configured"
- Set `OPENROUTER_API_KEY` in main service environment variables
- Ensure key has credits and is valid

### Model download issues
- Check vLLM startup logs
- Consider increasing deployment timeout
- Models are large - be patient on first deployment

## 📊 Resource Usage

- **Main Service**: 1GB RAM, 500m CPU (PPTX generation)
- **vLLM Service**: 4GB RAM, 2000m CPU (Model inference)
- **Storage**: ~10GB+ for vLLM models (volume recommended)

## 🔄 Updates & Maintenance

- Both services auto-restart on failure
- Railway handles SSL certificates automatically
- Update environment variables via Railway dashboard
- Monitor usage in Railway analytics

## 🆘 Support

If issues persist:
1. Check Railway service logs
2. Verify all environment variables are set
3. Test vLLM service independently
4. Ensure services are in the same project for networking
