const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const OpenAI = require('openai');

const app = express();
const port = 3000;

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
        return {
            id: `local-${Date.now()}`,
            choices: [
                {
                    message: {
                        role: 'assistant',
                        content: `Local echo (no OPENAI_API_KEY): ${userText}`
                    }
                }
            ],
            usage: null,
            created: Math.floor(Date.now() / 1000)
        };
    }

    // Real OpenAI call
    if (!openai) {
        throw new Error('OpenAI client not initialized');
    }
    return await openai.chat.completions.create(params);
}

// Helper function to create directory if it doesn't exist
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Set up storage for uploaded files with organized folders
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Get category from request body or default to 'general'
        const category = req.body.category || 'general';
        const uploadPath = path.join('uploads', category);
        
        // Ensure the directory exists
        ensureDirectoryExists(uploadPath);
        
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Create filename with timestamp and original name
        const timestamp = Date.now();
        const originalName = path.parse(file.originalname).name;
        const extension = path.extname(file.originalname);
        const filename = `${timestamp}_${originalName}${extension}`;
        
        cb(null, filename);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Helper function to convert image to base64
function imageToBase64(filePath) {
    try {
        const imageBuffer = fs.readFileSync(filePath);
        return imageBuffer.toString('base64');
    } catch (error) {
        throw new Error(`Failed to read image file: ${error.message}`);
    }
}

// Helper function for vision analysis
async function analyzeImage(filePath, filename) {
    try {
        // Convert image to base64
        const base64Image = imageToBase64(filePath);

        // Determine MIME type
        const ext = path.extname(filename).toLowerCase();
        let mimeType = 'image/jpeg'; // default
        if (ext === '.png') mimeType = 'image/png';
        else if (ext === '.gif') mimeType = 'image/gif';
        else if (ext === '.webp') mimeType = 'image/webp';

        // Call OpenAI Vision API
        const response = await callOpenAIChat({
            model: "gpt-4o",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Analyze this slide image and provide a structured JSON description for recreating it in a presentation. If there is images or icons or any art you should describe each is positionned ,how likely their size is, and if there is image display in a frame try describe what shape or type of powerpoint frame it is. The JSON should include the following fields: 'slideType', 'layout', 'colorPalette', 'typography', 'shapesAndGraphics', and 'contentPlaceholders'. Describe the position and size of elements in terms of percentages of the slide's width and height. For example: { 'type': 'rectangle', 'position': {'x': '10%', 'y': '15%'}, 'size': {'width': '80%', 'height': '20%'}, 'color': '#FFFFFF' }."
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            max_tokens: 2000
        });

        return {
            success: true,
            filename: filename,
            analysis: response.choices[0].message.content,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            filename: filename,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
}

// Middleware to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from profesional blanco directory
app.use('/profesional-blanco', express.static(path.join(__dirname, '..', 'profesional blanco')));

// Middleware to parse JSON
app.use(express.json());

// Upload with optional analysis endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        const category = req.body.category || 'general';
        const relativePath = path.relative('uploads', req.file.path).replace(/\\/g, '/');
        
        const result = {
            filename: req.file.filename,
            originalName: req.file.originalname,
            category: category,
            path: `/uploads/${relativePath}`,
            fullPath: req.file.path,
            size: req.file.size,
            mimetype: req.file.mimetype,
            timestamp: new Date().toISOString()
        };

        // Check if analysis was requested
        const shouldAnalyze = req.body.analyze === 'true' || req.body.analyze === true;

        if (shouldAnalyze) {
            const analysis = await analyzeImage(req.file.path, req.file.filename);
            result.analysis = analysis;
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Dedicated analysis endpoint
app.post('/analyze-image', async (req, res) => {
    try {
        const { filename, category } = req.body;

        if (!filename) {
            return res.status(400).json({ error: 'Filename is required' });
        }
        console.log(`Analyzing ${filename}, category: ${category}`);


        const uploadsDir = path.join(__dirname, 'uploads');
        ensureDirectoryExists(uploadsDir);

        // Try to find the file in the specified category or search all categories
        let filePath;
        if (category) {
            filePath = path.join(uploadsDir, category, filename);
            console.log(`Checking path: ${filePath}`);
        } else {
            // Search in all category folders
            console.log(`Searching in all categories in ${uploadsDir}`);
            const categories = fs.readdirSync(uploadsDir, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
            
            for (const cat of categories) {
                const testPath = path.join(uploadsDir, cat, filename);
                console.log(`Checking path: ${testPath}`);
                if (fs.existsSync(testPath)) {
                    filePath = testPath;
                    break;
                }
            }
        }

        if (!filePath || !fs.existsSync(filePath)) {
            // If not found in uploads, check the 'profesional blanco' directory
            const professionalBlancoPath = path.join(__dirname, '..', 'profesional blanco', filename);
            console.log(`Not found in uploads, checking professionalBlancoPath: ${professionalBlancoPath}`);
            if (fs.existsSync(professionalBlancoPath)) {
                filePath = professionalBlancoPath;
            }
        }

        if (!filePath || !fs.existsSync(filePath)) {
            console.error(`File not found at any checked path for ${filename}`);
            return res.status(404).json({ error: `File not found: ${filename}` });
        }

        console.log(`File found at: ${filePath}`);
        const analysis = await analyzeImage(filePath, filename);
        res.status(200).json(analysis);
    } catch (error) {
        console.error(`Error in /analyze-image: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// List all categories endpoint
app.get('/categories', (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, 'uploads');
        
        // List all categories and their file counts
        const categories = fs.readdirSync(uploadsDir, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => {
                const categoryPath = path.join(uploadsDir, dirent.name);
                const fileCount = fs.readdirSync(categoryPath)
                    .filter(file => fs.statSync(path.join(categoryPath, file)).isFile())
                    .length;
                return {
                    name: dirent.name,
                    fileCount: fileCount
                };
            });
        
        res.json({ categories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List files in specific category endpoint
app.get('/files/:category', (req, res) => {
    try {
        const category = req.params.category;
        const uploadsDir = path.join(__dirname, 'uploads');
        const categoryDir = path.join(uploadsDir, category);
        
        if (!fs.existsSync(categoryDir)) {
            return res.status(404).json({ error: 'Category not found' });
        }
        
        const files = fs.readdirSync(categoryDir)
            .filter(file => {
                const filePath = path.join(categoryDir, file);
                return fs.statSync(filePath).isFile();
            })
            .map(file => {
                const filePath = path.join(categoryDir, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    category: category,
                    path: `/uploads/${category}/${file}`,
                    size: stats.size,
                    modified: stats.mtime.toISOString()
                };
            });
        
        res.json({ category, files, count: files.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// List professional template images endpoint
app.get('/profesional-blanco', (req, res) => {
    try {
        const templatesDir = path.join(__dirname, '..', 'profesional blanco');
        
        if (!fs.existsSync(templatesDir)) {
            return res.status(404).json({ error: 'Professional templates directory not found' });
        }
        
        const files = fs.readdirSync(templatesDir)
            .filter(file => {
                const filePath = path.join(templatesDir, file);
                return fs.statSync(filePath).isFile() && /\.(png|jpg|jpeg|gif|bmp)$/i.test(file);
            })
            .map(file => {
                const filePath = path.join(templatesDir, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    path: `/profesional-blanco/${file}`,
                    size: stats.size,
                    modified: stats.mtime.toISOString()
                };
            })
            .sort((a, b) => {
                // Sort numerically by filename (1.png, 2.png, etc.)
                const aNum = parseInt(a.filename.match(/\d+/)?.[0] || '0');
                const bNum = parseInt(b.filename.match(/\d+/)?.[0] || '0');
                return aNum - bNum;
            });
        
        res.json({ 
            category: 'Professional Templates', 
            files, 
            count: files.length,
            description: 'Professional white theme presentation templates'
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Simple chat completion endpoint
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
            max_tokens: typeof max_tokens === 'number' ? max_tokens : 800,
        });
        const out = {
            id: response.id,
            message: response.choices?.[0]?.message,
            usage: response.usage || null,
            created: response.created,
        };
        res.status(200).json(out);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        server: 'Image Upload Server with Vision Analysis'
    });
});

// Enhanced HTML interface
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Image Upload Server with Vision Analysis</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                form { margin-bottom: 30px; padding: 20px; border: 1px solid #ccc; border-radius: 5px; }
                .result { margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 5px; }
                img { max-width: 300px; max-height: 300px; margin-top: 10px; }
            </style>
        </head>
        <body>
            <h1>Image Upload Server with Vision Analysis</h1>

            <form id="uploadForm" action="/upload" method="POST" enctype="multipart/form-data">
                <h3>Upload Image</h3>
                <input type="file" name="image" accept="image/*" required />
                <br><br>
                <label for="category">Category:</label>
                <select name="category" id="category">
                    <option value="general">General</option>
                    <option value="presentations">Presentations</option>
                    <option value="templates">Templates</option>
                    <option value="analysis">Analysis</option>
                    <option value="backgrounds">Backgrounds</option>
                    <option value="icons">Icons</option>
                    <option value="charts">Charts & Graphs</option>
                    <option value="photos">Photos</option>
                </select>
                <br><br>
                <label>
                    <input type="checkbox" name="analyze" value="true" checked>
                    Analyze image with AI vision
                </label>
                <br><br>
                <button type="submit">Upload & Analyze</button>
            </form>

            <div id="results"></div>

            <div style="margin-top: 40px; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
                <h3>Professional Templates</h3>
                <p>Browse professional white theme presentation templates:</p>
                <button onclick="loadProfessionalTemplates()" style="padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 3px; cursor: pointer;">Load Templates</button>
                <div id="templates-gallery" style="margin-top: 20px;"></div>
            </div>

            <script>
                async function loadProfessionalTemplates() {
                    const gallery = document.getElementById('templates-gallery');
                    gallery.innerHTML = '<p>Loading templates...</p>';
                    
                    try {
                        const response = await fetch('/profesional-blanco');
                        const data = await response.json();
                        
                        if (response.ok) {
                            let html = '<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">';
                            
                            data.files.forEach(file => {
                                html += '<div style="border: 1px solid #ccc; border-radius: 5px; padding: 10px; text-align: center;">' +
                                    '<img src="' + file.path + '" alt="' + file.filename + '" style="max-width: 100%; height: 150px; object-fit: contain; margin-bottom: 10px;">' +
                                    '<p style="margin: 5px 0; font-size: 14px; font-weight: bold;">' + file.filename + '</p>' +
                                    '<p style="margin: 5px 0; font-size: 12px; color: #666;">Size: ' + (file.size / 1024).toFixed(2) + ' KB</p>' +
                                    '</div>';
                            });
                            
                            html += '</div>';
                            html += '<p style="margin-top: 20px; text-align: center; color: #666;">Total templates: ' + data.count + '</p>';
                            gallery.innerHTML = html;
                        } else {
                            gallery.innerHTML = '<p style="color: red;">Error loading templates: ' + data.error + '</p>';
                        }
                    } catch (error) {
                        gallery.innerHTML = '<p style="color: red;">Network error: ' + error.message + '</p>';
                    }
                }

                 const form = document.getElementById('uploadForm');
                const results = document.getElementById('results');

                form.addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const formData = new FormData(form);
                    results.innerHTML = '<div class="result">Processing...</div>';

                    try {
                        const response = await fetch('/upload', {
                            method: 'POST',
                            body: formData
                        });

                        const data = await response.json();

                        if (response.ok) {
                            let html = '<div class="result">' +
                                '<h3>Upload Successful</h3>' +
                                '<p><strong>Original Name:</strong> ' + data.originalName + '</p>' +
                                '<p><strong>Filename:</strong> ' + data.filename + '</p>' +
                                '<p><strong>Category:</strong> ' + data.category + '</p>' +
                                '<img src="' + data.path + '" alt="Uploaded image">' +
                                '<p><strong>Size:</strong> ' + (data.size / 1024).toFixed(2) + ' KB</p>';

                            if (data.analysis) {
                                if (data.analysis.success) {
                                    html += '<h4>AI Analysis:</h4>' +
                                        '<p>' + data.analysis.analysis + '</p>';
                                } else {
                                    html += '<h4>Analysis Error:</h4>' +
                                        '<p>' + data.analysis.error + '</p>';
                                }
                            }

                            html += '</div>';
                            results.innerHTML = html;
                        } else {
                            results.innerHTML = '<div class="result" style="color: red;">Error: ' + data.error + '</div>';
                        }
                    } catch (error) {
                        results.innerHTML = '<div class="result" style="color: red;">Network Error: ' + error.message + '</div>';
                    }
                });
            </script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Image analysis server running on http://localhost:${port}`);
});
