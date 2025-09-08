const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const PptxGenJS = require('pptxgenjs');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3003;

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

// Adapter loader for template modules to standardize generatePresentation
async function loadTemplateAdapter(modulePath) {
    // modulePath: absolute path to generator module
    try {
        const Mod = require(modulePath);
        // If module exports a function that directly generates, wrap it
        if (typeof Mod === 'function' && !Mod.prototype) {
            return {
                generatePresentation: async (data, outputPath) => {
                    // try calling as function
                    const res = await Mod(data, outputPath);
                    return res || { success: true, path: outputPath };
                }
            };
        }

        // If it's a class or constructor
        const instance = new Mod();
        // If instance implements generatePresentation directly
        if (typeof instance.generatePresentation === 'function') {
            return {
                generatePresentation: async (data, outputPath) => {
                    return await instance.generatePresentation(data, outputPath);
                }
            };
        }

        // If it implements generateDemo that populates instance.pptx
        if (typeof instance.generateDemo === 'function') {
            return {
                generatePresentation: async (data, outputPath) => {
                    // try calling demo method; some demo methods accept no args
                    await instance.generateDemo(data).catch(() => {});
                    if (instance.pptx) {
                        await instance.pptx.writeFile({ fileName: outputPath });
                        return { success: true, path: outputPath };
                    }
                    return { success: false, error: 'Template demo executed but did not expose pptx instance' };
                }
            };
        }

        // As a last resort, check for a static generate function
        if (typeof Mod.generatePresentation === 'function') {
            return { generatePresentation: async (data, outputPath) => await Mod.generatePresentation(data, outputPath) };
        }

        return null;
    } catch (err) {
        return null;
    }
}

// PowerPoint Generator Class
class PrestoSlidesGenerator {
    constructor() {
        // Color schemes inspired by the enhanced generator
        this.colorSchemes = {
            professional: {
                primary: '1f4e79',
                secondary: '70ad47',
                accent: 'ffc000',
                text: '2f2f2f',
                lightGray: 'f2f2f2',
                white: 'ffffff'
            },
            modern: {
                primary: '2e86ab',
                secondary: 'a23b72',
                accent: '4caf50',
                text: '333333',
                lightGray: 'f5f5f5',
                white: 'ffffff'
            }
        };

        // Font settings
        this.fonts = {
            title: { face: 'Segoe UI', size: 44, bold: true },
            subtitle: { face: 'Segoe UI', size: 24 },
            heading: { face: 'Segoe UI', size: 32, bold: true },
            body: { face: 'Segoe UI', size: 18 },
            caption: { face: 'Segoe UI', size: 14 }
        };

        // Safe layout areas (from content constraint system)
        this.safeArea = { x: 0.5, y: 0.5, width: 9, height: 4.625 };
    }

    sanitizeText(text, maxLength = 1000) {
        if (!text) return '';

        let sanitized = String(text)
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
            .trim();

        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength - 3) + '...';
        }

        return sanitized;
    }

    createTitleSlide(pptx, title, subtitle = '', colorScheme = 'professional') {
        const slide = pptx.addSlide();
        const colors = this.colorSchemes[colorScheme] || this.colorSchemes['professional'];

        // Background
        slide.background = { color: colors.white };

        // Title
        slide.addText(this.sanitizeText(title, 100), {
            x: 1, y: 2, w: 8, h: 1.5,
            fontSize: this.fonts.title.size,
            fontFace: this.fonts.title.face,
            bold: this.fonts.title.bold,
            color: colors.primary,
            align: 'center',
            valign: 'middle'
        });

        // Subtitle
        if (subtitle) {
            slide.addText(this.sanitizeText(subtitle, 200), {
                x: 1, y: 3.5, w: 8, h: 1,
                fontSize: this.fonts.subtitle.size,
                fontFace: this.fonts.subtitle.face,
                color: colors.text,
                align: 'center',
                valign: 'middle'
            });
        }

        // Decorative line
        slide.addShape('line', {
            x: 2, y: 4.8, w: 6, h: 0,
            line: { color: colors.accent, width: 3 }
        });

        return slide;
    }

    createContentSlide(pptx, title, content, colorScheme = 'professional') {
        const slide = pptx.addSlide();
        const colors = this.colorSchemes[colorScheme] || this.colorSchemes['professional'];

        // Background
        slide.background = { color: colors.white };

        // Title
        slide.addText(this.sanitizeText(title, 80), {
            x: this.safeArea.x, y: 0.5, w: this.safeArea.width, h: 0.8,
            fontSize: this.fonts.heading.size,
            fontFace: this.fonts.heading.face,
            bold: this.fonts.heading.bold,
            color: colors.primary,
            align: 'left',
            valign: 'middle'
        });

        // Content
        const contentText = this.sanitizeText(content, 2000);
        slide.addText(contentText, {
            x: this.safeArea.x, y: 1.5, w: this.safeArea.width, h: 3.5,
            fontSize: this.fonts.body.size,
            fontFace: this.fonts.body.face,
            color: colors.text,
            align: 'left',
            valign: 'top',
            wrap: true
        });

        return slide;
    }

    createBulletSlide(pptx, title, bullets, colorScheme = 'professional') {
        const slide = pptx.addSlide();
        const colors = this.colorSchemes[colorScheme] || this.colorSchemes['professional'];

        // Background
        slide.background = { color: colors.white };

        // Title
        slide.addText(this.sanitizeText(title, 80), {
            x: this.safeArea.x, y: 0.5, w: this.safeArea.width, h: 0.8,
            fontSize: this.fonts.heading.size,
            fontFace: this.fonts.heading.face,
            bold: this.fonts.heading.bold,
            color: colors.primary,
            align: 'left',
            valign: 'middle'
        });

        // Bullet points
        const bulletText = bullets.map(bullet => `• ${this.sanitizeText(bullet, 200)}`).join('\n');
        slide.addText(bulletText, {
            x: this.safeArea.x + 0.2, y: 1.5, w: this.safeArea.width - 0.4, h: 3.5,
            fontSize: this.fonts.body.size,
            fontFace: this.fonts.body.face,
            color: colors.text,
            align: 'left',
            valign: 'top',
            wrap: true
        });

        return slide;
    }

    async generatePresentation(data, outputPath) {
        const pptx = new PptxGenJS();

        // Setup presentation
        pptx.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
        pptx.layout = 'LAYOUT_16x9';
        pptx.author = 'Presto Slides - AI PowerPoint Generator';
        pptx.company = 'Presto Slides';
        pptx.subject = data.title || 'AI Generated Presentation';
        pptx.title = data.title || 'Presentation';

        const colorScheme = data.colorScheme || 'professional';

        try {
            // Create title slide
            if (data.title) {
                this.createTitleSlide(pptx, data.title, data.subtitle, colorScheme);
            }

            // Create content slides
            if (data.slides && Array.isArray(data.slides)) {
                data.slides.forEach(slideData => {
                    if (slideData.type === 'bullets' && slideData.bullets) {
                        this.createBulletSlide(pptx, slideData.title, slideData.bullets, colorScheme);
                    } else {
                        this.createContentSlide(pptx, slideData.title, slideData.content, colorScheme);
                    }
                });
            }

            // Write file
            await pptx.writeFile({ fileName: outputPath });
            return { success: true, path: outputPath };

        } catch (error) {
            console.error('PPTX Generation Error:', error);
            return { success: false, error: error.message };
        }
    }
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

// PPTX Generation endpoint
app.post('/generate-pptx', async (req, res) => {
    try {
        const { title, subtitle, slides, colorScheme } = req.body || {};

        if (!title) {
            console.log('PPTX Error: Title is required');
            return res.status(400).json({ error: 'Title is required' });
        }

        // If a specific template is requested, try to load it
        let usedTemplate = 'presto_default';
        let result = null;
        const fileName = `presentation_${uuidv4()}.pptx`;
        const outputPath = path.join(__dirname, 'temp', fileName);

        // Ensure temp directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        // Helper to list available templates
        async function listTemplates() {
            const genDir = path.join(__dirname, 'generators');
            try {
                const files = await fs.readdir(genDir);
                return files.filter(f => f.endsWith('.js')).map(f => path.basename(f, '.js'));
            } catch (e) { return [] }
        }

        if (!req.body.template) {
            // No template specified: pick one at random (weighted selection could be added here)
            const available = await listTemplates();
            if (available.length > 0) {
                const idx = Math.floor(Math.random() * available.length);
                req.body.template = available[idx];
            }
        }

        if (req.body.template) {
            const tpl = String(req.body.template).replace(/\.js$/, '');
            try {
                const modPath = path.join(__dirname, 'generators', `${tpl}.js`);
                const adapter = await loadTemplateAdapter(modPath);
                if (!adapter) {
                    result = { success: false, error: 'Template could not be adapted for programmatic generation' };
                } else {
                    usedTemplate = tpl;
                    result = await adapter.generatePresentation({ title, subtitle, slides, colorScheme }, outputPath);
                }
            } catch (e) {
                console.error('Template load error:', e.message);
                // Fallback to default generator
                usedTemplate = 'presto_default';
            }
        }

        if (!result) {
            const generator = new PrestoSlidesGenerator();
            result = await generator.generatePresentation({
                title,
                subtitle,
                slides,
                colorScheme
            }, outputPath);
            usedTemplate = 'presto_default';
        }

        if (result.success) {
            // Send file as download
            // attach header indicating which template was used
            res.setHeader('X-Presto-Template', usedTemplate);
            res.download(outputPath, `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`, async (err) => {
                // Clean up temp file
                try {
                    await fs.unlink(outputPath);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }

                if (err) {
                    console.error('Download error:', err);
                }
            });
        } else {
            console.error('PPTX Generation failed:', result.error);
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('PPTX generation error:', error.message);
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
            'POST /generate-pptx - Generate PPTX',
            'GET /templates - List available templates (use /api/templates from frontend)',
            'GET /health - Health check'
        ],
        openai_status: USE_LOCAL_FALLBACK ? 'demo_mode' : 'connected'
    });
});

// List available generator templates
app.get('/templates', async (req, res) => {
    try {
        const genDir = path.join(__dirname, 'generators');
        const files = await fs.readdir(genDir);
        const templates = [];
        for (const file of files) {
            if (!file.endsWith('.js')) continue;
            const id = path.basename(file, '.js');
            const filePath = path.join(genDir, file);
            const content = await fs.readFile(filePath, 'utf8');
            // Extract top comment block or first 2 comment lines as description
            const match = content.match(/\/\*([\s\S]*?)\*\//);
            let description = '';
            if (match) {
                description = match[1].split('\n').map(s => s.replace(/^\s*\*?\s?/, '')).slice(0,3).join(' ');
            } else {
                const firstLine = content.split('\n')[0] || '';
                description = firstLine.substring(0, 120);
            }
            templates.push({ id, name: id.replace(/[_-]/g, ' '), description, thumbnail: `/templates/thumb/${id}` });
        }
        res.json({ templates });
    } catch (error) {
        console.error('Error listing templates:', error);
        res.status(500).json({ error: error.message });
    }
});

const axios = require('axios');

// Serve a thumbnail for template id (proxy from picsum.photos as placeholder)
app.get('/templates/thumb/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const thumbsDir = path.join(__dirname, 'generators', 'assets-images', 'thumbs');
        await fs.mkdir(thumbsDir).catch(()=>{});
        const filePath = path.join(thumbsDir, `${id}.jpg`);
        // If cached locally, serve it
        try {
            const stat = await fs.stat(filePath).catch(()=>null);
            if (stat && stat.size > 0) {
                const buf = await fs.readFile(filePath);
                res.setHeader('Content-Type', 'image/jpeg');
                return res.send(buf);
            }
        } catch (e) {
            // continue to fetch
        }

        // Fetch from picsum.photos as placeholder (seeded by id)
        const seed = encodeURIComponent(id);
        const url = `https://picsum.photos/seed/${seed}/400/240`;
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 5000 });
        const data = Buffer.from(response.data, 'binary');
        // Cache locally (best-effort)
        fs.writeFile(filePath, data).catch(()=>{});
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(data);
    } catch (error) {
        // Generate diverse thumbnails
        try {
            const { id } = req.params;
            const title = id.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            let hash = 0;
            for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash) + id.charCodeAt(i);

            // More distinct color schemes
            const colorSchemes = [
                ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
                ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a8edea', '#fed6e3'],
                ['#ff9a9e', '#fecfef'], ['#330867', '#30cfd0'], ['#ff6b6b', '#ffa726']
            ];

            const schemeIndex = Math.abs(hash) % colorSchemes.length;
            const [color1, color2] = colorSchemes[schemeIndex];

            // Add icon/symbol based on template name
            let icon = '📊';
            if (id.includes('dog')) icon = '🐕';
            else if (id.includes('mice') || id.includes('mouse')) icon = '🐭';
            else if (id.includes('robot') || id.includes('tech')) icon = '🤖';
            else if (id.includes('science') || id.includes('research')) icon = '🔬';
            else if (id.includes('flower') || id.includes('plant')) icon = '🌸';
            else if (id.includes('business') || id.includes('professional')) icon = '💼';
            else if (id.includes('education') || id.includes('learning')) icon = '📚';
            else if (id.includes('medical') || id.includes('health')) icon = '⚕️';
            else if (id.includes('sustainable') || id.includes('green')) icon = '🌱';
            else if (id.includes('enhanced') || id.includes('advanced')) icon = '⚡';

            const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'>
  <defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${color1}' />
      <stop offset='1' stop-color='${color2}' />
    </linearGradient>
  </defs>
  <rect width='400' height='240' fill='url(#g)' rx='16' />
  <circle cx='320' cy='60' r='30' fill='white' opacity='0.15'/>
  <rect x='50' y='170' width='50' height='50' fill='white' opacity='0.1' rx='8'/>
  <text x='200' y='100' font-size='36' text-anchor='middle' dominant-baseline='middle'>${icon}</text>
  <text x='200' y='140' font-size='16' font-family='system-ui, sans-serif' font-weight='600' fill='white' text-anchor='middle' opacity='0.95'>${title}</text>
  <text x='200' y='160' font-size='11' font-family='system-ui, sans-serif' fill='white' text-anchor='middle' opacity='0.7'>PowerPoint Template</text>
</svg>`;

            res.setHeader('Content-Type', 'image/svg+xml');
            res.send(svg);
        } catch (err) {
            res.status(500).send('');
        }
    }
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
