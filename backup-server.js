const express = require('express');
const cors = require('cors');
const PptxGenJS = require('pptxgenjs');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3005; // Different port from main server

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Simple PPTX Generator that always works
class ReliablePptxGenerator {
    constructor() {
        this.colors = {
            primary: '0ea5e9',
            secondary: '64748b', 
            text: '1f2937',
            background: 'ffffff'
        };
    }

    sanitize(text, maxLength = 1000) {
        if (!text) return '';
        return String(text)
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            .trim()
            .substring(0, maxLength);
    }

    async generate(data, outputPath) {
        try {
            console.log('🛡️ Backup generator: Creating presentation...');
            
            const pptx = new PptxGenJS();
            pptx.author = 'Backup Generator';
            pptx.title = this.sanitize(data.title, 100);

            // Title slide
            const titleSlide = pptx.addSlide();
            titleSlide.addText(this.sanitize(data.title, 100), {
                x: 1, y: 2, w: 8, h: 1.5,
                fontSize: 40, fontFace: 'Arial', bold: true,
                color: this.colors.primary, align: 'center'
            });

            if (data.subtitle) {
                titleSlide.addText(this.sanitize(data.subtitle, 200), {
                    x: 1, y: 3.5, w: 8, h: 1,
                    fontSize: 20, fontFace: 'Arial',
                    color: this.colors.secondary, align: 'center'
                });
            }

            // Content slides
            if (data.slides && Array.isArray(data.slides)) {
                data.slides.slice(0, 50).forEach((slideData, index) => {
                    if (!slideData) return;
                    
                    const slide = pptx.addSlide();
                    
                    // Title
                    slide.addText(this.sanitize(slideData.title || `Slide ${index + 1}`, 80), {
                        x: 0.5, y: 0.5, w: 9, h: 0.8,
                        fontSize: 28, fontFace: 'Arial', bold: true,
                        color: this.colors.primary
                    });

                    // Content
                    if (slideData.type === 'bullets' && slideData.bullets) {
                        const bullets = slideData.bullets
                            .filter(b => b && b.trim())
                            .slice(0, 8)
                            .map(b => `• ${this.sanitize(b, 150)}`)
                            .join('\n');

                        slide.addText(bullets, {
                            x: 0.8, y: 1.5, w: 8.5, h: 3.5,
                            fontSize: 16, fontFace: 'Arial',
                            color: this.colors.text, valign: 'top'
                        });
                    } else if (slideData.content) {
                        slide.addText(this.sanitize(slideData.content, 1500), {
                            x: 0.5, y: 1.5, w: 9, h: 3.5,
                            fontSize: 16, fontFace: 'Arial',
                            color: this.colors.text, valign: 'top'
                        });
                    }
                });
            }

            await pptx.writeFile({ fileName: outputPath });
            console.log('✅ Backup generator: Success!');
            
            return { success: true, path: outputPath };
        } catch (error) {
            console.error('❌ Backup generator error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Backup PPTX generation endpoint
app.post('/generate-pptx', async (req, res) => {
    console.log('🛡️ BACKUP SERVER: PPTX Generation Request');
    
    try {
        const data = req.body || {};
        
        if (!data.title) {
            return res.status(400).json({ error: 'Title is required' });
        }

        const fileName = `backup_presentation_${uuidv4()}.pptx`;
        const outputPath = path.join(__dirname, 'temp', fileName);

        // Ensure temp directory exists
        await fs.mkdir(path.dirname(outputPath), { recursive: true });

        const generator = new ReliablePptxGenerator();
        const result = await generator.generate(data, outputPath);

        if (result.success) {
            res.setHeader('X-Generator', 'BackupServer');
            res.download(outputPath, `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`, async (err) => {
                try {
                    await fs.unlink(outputPath);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
                if (err) console.error('Download error:', err);
            });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (error) {
        console.error('Backup server error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        server: 'Backup PPTX Server',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🛡️ Backup PPTX Server running on port ${PORT}`);
});
