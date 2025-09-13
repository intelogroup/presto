# Complete Railway Deployment Guide for Presto Presentation Generator

## 🚀 Services Overview

Your complete Presto setup consists of **three interconnected Railway services**:

1. **Presto Frontend** (`frontend/railway.toml`) - React.js UI Application
2. **Presto Backend** (`railway.toml`) - Express.js PPTX generation API
3. **Ollama Service** (`railway-ollama.toml`) - Local LLM provider

## 📋 Recommended Deployment Order

### Phase 1: Deploy Ollama Service First

1. **Create Ollama Service in Railway**
   - Create new service in Railway dashboard
   - Upload `railway-ollama.toml` from root directory
   - Note down the service name (used for internal DNS)

2. **Configure Ollama Volume (Optional but Recommended)**
   - In Railway dashboard, go to your Ollama service
   - Add a volume named `models` mounted to `/home/ollama/.ollama`
   - This persists downloaded models between deployments

3. **Monitor Startup**
   - The service will automatically pull Llama 3.1 8B and Mistral 7B models
   - Initial deployment may take 10-15 minutes due to model downloads

### Phase 2: Deploy Backend Service

1. **Create Backend Service**
   - Create new service and upload `railway.toml` (from root directory)
   - Note the service name for frontend configuration

2. **Configure Environment Variables**
   ```bash
   # Required: Get from OpenRouter.ai dashboard
   OPENROUTER_API_KEY = "sk-or-v1-..."

   # Optional: Update with your Railway app URLs
   SITE_URL = "https://your-presto-backend.railway.app"
   SITE_NAME = "My Presto Generator"

   # Critical: Update with your Ollama service name
   OLLAMA_BASE_URL = "http://your-ollama-service-name.railway.internal:11434"
   ```

### Phase 3: Deploy Frontend Service

1. **Create Frontend Service**
   - Create new service using `frontend/railway.toml` from `frontend/` directory
   - This is a static React application

2. **Configure API Endpoint**
   ```bash
   # Update with your deployed backend URL
   VITE_API_BASE_URL = "https://your-presto-backend.railway.app"
   ```

## 🔧 Configuration Checklist

- [ ] Ollama service deployed and healthy (`/api/tags` endpoint accessible)
- [ ] Ollama service name noted for backend `OLLAMA_BASE_URL`
- [ ] Backend service environment variables configured (`OPENROUTER_API_KEY`, etc.)
- [ ] Frontend `VITE_API_BASE_URL` points to backend service
- [ ] All services are in the same Railway project (enables internal networking)
- [ ] Frontend can make API calls to backend

## 🧪 Testing Complete Deployment

1. **Test Ollama Service**
   ```bash
   curl https://your-ollama-service.railway.app/api/tags
   ```

2. **Test Backend Service**
   ```bash
   curl https://your-presto-backend.railway.app/api/health
   ```

3. **Test Presentation Generation**
   ```bash
   curl -X POST https://your-presto-backend.railway.app/api/generate-pptx \
        -H "Content-Type: application/json" \
        -d '{"title": "Test", "slides": [{"title": "Slide 1", "content": "Hello World"}]}'
   ```

4. **Test Frontend Loading**
   - Visit: `https://your-presto-frontend.railway.app`
   - Try generating a presentation through the UI

5. **Run Complete Validation Script**
   ```bash
   # Update these URLs in your environment
   export OLLAMA_SERVICE_URL="https://your-ollama-service.railway.app"
   export PRESTO_SERVICE_URL="https://your-presto-backend.railway.app"
   npm run test-deployment
   ```

## 📊 Resource Requirements

| Service | Memory | CPU | Storage | Purpose |
|---------|---------|-----|---------|---------|
| **Frontend** | 512MB | 200m | ~50MB | Static React app |
| **Backend** | 1GB | 500m | ~200MB | PPTX generation |
| **Ollama** | 4GB | 2000m | ~10GB+ | Model inference |

## 🚨 Troubleshooting

### "Frontend can't connect to API"
- Check `VITE_API_BASE_URL` in frontend environment variables
- Ensure backend service is running and accessible
- Verify CORS settings allow frontend domain

### "Ollama connection failed"
- Verify `OLLAMA_BASE_URL` uses correct service name
- Ensure Ollama service is healthy (`/api/tags` endpoint)
- Check Railway project internal networking

### "API key not configured"
- Set `OPENROUTER_API_KEY` in backend service
- Verify key is valid and has credits

### "Presentation generation fails"
- Check backend logs for detailed errors
- Ensure Ollama service is responding
- Verify all environment variables are set correctly

### "Models won't download"
- Increase Railway deployment timeout
- Check Ollama service logs
- Models are large (4-8GB each) - be patient

## 🔄 Updates & Maintenance

- **All services** auto-restart on failure
- Railway provides automatic SSL certificates
- Update environment variables via Railway dashboard
- Monitor resource usage in Railway analytics
- Use Railway's deployment history for rollbacks

## 🆘 Support & Next Steps

If deployment issues persist:
1. Check Railway service logs in dashboard
2. Verify all environment variables are set
3. Test services independently using curl commands
4. Ensure services are in the same Railway project
5. Use the validation script to identify specific failures

## 🎯 Production Readiness Checklist

- [ ] All three services deployed successfully
- [ ] End-to-end testing completed (UI → API → Ollama)
- [ ] Environment variables properly configured
- [ ] Service domains noted for any external integrations
- [ ] Monitoring and alerting set up in Railway
- [ ] Backup/rollback strategy in place

**Your complete Presto stack is now ready for production! 🚀**
