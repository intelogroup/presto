const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// If no OpenAI API key is provided, fall back to a lightweight local echo responder
const USE_LOCAL_FALLBACK = !process.env.OPENAI_API_KEY;

// Initialize OpenAI client only if we have an API key
const openai = USE_LOCAL_FALLBACK ? null : new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function callOpenAIChat(params) {
    if (USE_LOCAL_FALLBACK) {
        // Build a simple echo-like assistant response for local development
        const lastUserMessage = Array.isArray(params.messages) ?
            params.messages.slice().reverse().find(m => m.role === 'user') : null;
        const userText = lastUserMessage?.content || 'Hello';
        
        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            id: `local-${Date.now()}`,
            choices: [
                {
                    message: {
                        role: 'assistant',
                        content: `I understand you want to create a PowerPoint presentation about: "${userText}". 

Here's what I would suggest:
- Title slide with your main topic
- 3-5 content slides covering key points
- Professional design with consistent formatting
- Conclusion slide

To generate the actual PowerPoint, please connect an OpenAI API key. For now, I'm running in demo mode.`
                    }
                }
            ],
            usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            created: Math.floor(Date.now() / 1000)
        };
    }

    // Real OpenAI call
    if (!openai) {
        throw new Error('OpenAI client not initialized');
    }
    return await openai.chat.completions.create(params);
}

// Chat endpoint for PowerPoint generation
app.post('/chat', async (req, res) => {
    try {
        const { messages, model, temperature, max_tokens } = req.body || {};
        
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'messages array is required' });
        }

        const response = await callOpenAIChat({
            model: model || 'gpt-4o-mini',
            messages,
            temperature: typeof temperature === 'number' ? temperature : 0.7,
            max_tokens: typeof max_tokens === 'number' ? max_tokens : 1000,
        });

        const result = {
            id: response.id,
            message: response.choices?.[0]?.message,
            usage: response.usage || null,
            created: response.created,
        };

        res.status(200).json(result);
    } catch (error) {
        console.error('Chat error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        server: 'Presto Slides API Server',
        openai_connected: !USE_LOCAL_FALLBACK
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Presto Slides API',
        version: '1.0.0',
        endpoints: [
            'POST /chat - Chat with AI for PowerPoint generation',
            'GET /health - Health check'
        ],
        openai_status: USE_LOCAL_FALLBACK ? 'demo_mode' : 'connected'
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Presto Slides API Server running on http://localhost:${port}`);
    if (USE_LOCAL_FALLBACK) {
        console.log('⚠️  Running in demo mode (no OpenAI API key)');
        console.log('💡 Set OPENAI_API_KEY environment variable for full functionality');
    } else {
        console.log('✅ OpenAI API connected');
    }
});
