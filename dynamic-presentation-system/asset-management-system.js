/**
 * Optimized Asset Management System with Better Fallback Strategies
 * Provides robust asset handling, caching, fallback mechanisms, and optimization
 * for the dynamic presentation system
 */

const fs = require('fs');
const path = require('path');

class AssetManagementSystem {
    constructor() {
        this.assetCache = new Map();
        this.fallbackAssets = this.initializeFallbackAssets();
        this.assetTypes = this.initializeAssetTypes();
        this.optimizationStrategies = this.initializeOptimizationStrategies();
        this.assetMetrics = this.initializeAssetMetrics();
        this.cacheConfig = this.initializeCacheConfig();
        this.fallbackStrategies = this.initializeFallbackStrategies();
    }

    /**
     * Initialize fallback assets
     */
    initializeFallbackAssets() {
        return {
            images: {
                placeholder: {
                    type: 'svg',
                    content: this.generatePlaceholderSVG(400, 300, 'Image Placeholder'),
                    size: { width: 400, height: 300 },
                    format: 'svg'
                },
                icon: {
                    type: 'svg',
                    content: this.generateIconSVG(24, 24, 'icon'),
                    size: { width: 24, height: 24 },
                    format: 'svg'
                },
                logo: {
                    type: 'svg',
                    content: this.generateLogoSVG(120, 40, 'LOGO'),
                    size: { width: 120, height: 40 },
                    format: 'svg'
                },
                chart: {
                    type: 'svg',
                    content: this.generateChartSVG(300, 200),
                    size: { width: 300, height: 200 },
                    format: 'svg'
                },
                background: {
                    type: 'svg',
                    content: this.generateBackgroundSVG(800, 600),
                    size: { width: 800, height: 600 },
                    format: 'svg'
                }
            },
            
            fonts: {
                primary: {
                    family: 'Arial, sans-serif',
                    weights: ['400', '600', '700'],
                    fallback: 'sans-serif',
                    webSafe: true
                },
                secondary: {
                    family: 'Georgia, serif',
                    weights: ['400', '600'],
                    fallback: 'serif',
                    webSafe: true
                },
                monospace: {
                    family: 'Courier New, monospace',
                    weights: ['400'],
                    fallback: 'monospace',
                    webSafe: true
                }
            },
            
            colors: {
                primary: '#2563eb',
                secondary: '#64748b',
                accent: '#f59e0b',
                success: '#10b981',
                warning: '#f59e0b',
                error: '#ef4444',
                background: '#ffffff',
                surface: '#f8fafc',
                text: '#1e293b',
                textSecondary: '#64748b'
            },
            
            layouts: {
                default: {
                    type: 'single-column',
                    padding: '2rem',
                    maxWidth: '800px',
                    spacing: '1.5rem'
                },
                presentation: {
                    type: 'slide',
                    aspectRatio: '16:9',
                    padding: '3rem',
                    maxWidth: '1200px'
                },
                grid: {
                    type: 'grid',
                    columns: 2,
                    gap: '2rem',
                    padding: '2rem'
                }
            },
            
            styles: {
                base: {
                    fontSize: '16px',
                    lineHeight: '1.6',
                    fontFamily: 'Arial, sans-serif',
                    color: '#1e293b'
                },
                heading: {
                    fontSize: '2rem',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    marginBottom: '1rem'
                },
                paragraph: {
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    marginBottom: '1rem'
                }
            }
        };
    }

    /**
     * Initialize asset types configuration
     */
    initializeAssetTypes() {
        return {
            image: {
                extensions: ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'],
                mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'],
                maxSize: 5 * 1024 * 1024, // 5MB
                optimizable: true,
                cacheable: true,
                fallbackType: 'placeholder'
            },
            
            font: {
                extensions: ['.woff', '.woff2', '.ttf', '.otf', '.eot'],
                mimeTypes: ['font/woff', 'font/woff2', 'font/ttf', 'font/otf'],
                maxSize: 2 * 1024 * 1024, // 2MB
                optimizable: false,
                cacheable: true,
                fallbackType: 'webSafe'
            },
            
            style: {
                extensions: ['.css'],
                mimeTypes: ['text/css'],
                maxSize: 1024 * 1024, // 1MB
                optimizable: true,
                cacheable: true,
                fallbackType: 'inline'
            },
            
            script: {
                extensions: ['.js'],
                mimeTypes: ['application/javascript', 'text/javascript'],
                maxSize: 2 * 1024 * 1024, // 2MB
                optimizable: true,
                cacheable: true,
                fallbackType: 'minimal'
            },
            
            data: {
                extensions: ['.json', '.xml', '.csv'],
                mimeTypes: ['application/json', 'application/xml', 'text/csv'],
                maxSize: 10 * 1024 * 1024, // 10MB
                optimizable: false,
                cacheable: true,
                fallbackType: 'empty'
            }
        };
    }

    /**
     * Initialize optimization strategies
     */
    initializeOptimizationStrategies() {
        return {
            image: {
                compress: {
                    name: 'Image Compression',
                    description: 'Reduce image file size while maintaining quality',
                    execute: (asset) => this.compressImage(asset)
                },
                resize: {
                    name: 'Image Resizing',
                    description: 'Resize images to appropriate dimensions',
                    execute: (asset, dimensions) => this.resizeImage(asset, dimensions)
                },
                format: {
                    name: 'Format Optimization',
                    description: 'Convert to optimal format (WebP, SVG)',
                    execute: (asset) => this.optimizeImageFormat(asset)
                }
            },
            
            style: {
                minify: {
                    name: 'CSS Minification',
                    description: 'Remove whitespace and comments from CSS',
                    execute: (asset) => this.minifyCSS(asset)
                },
                inline: {
                    name: 'CSS Inlining',
                    description: 'Inline critical CSS for faster loading',
                    execute: (asset) => this.inlineCSS(asset)
                }
            },
            
            script: {
                minify: {
                    name: 'JavaScript Minification',
                    description: 'Minify JavaScript code',
                    execute: (asset) => this.minifyJS(asset)
                },
                bundle: {
                    name: 'Script Bundling',
                    description: 'Bundle multiple scripts together',
                    execute: (assets) => this.bundleScripts(assets)
                }
            }
        };
    }

    /**
     * Initialize asset metrics
     */
    initializeAssetMetrics() {
        return {
            totalAssets: 0,
            cachedAssets: 0,
            optimizedAssets: 0,
            fallbacksUsed: 0,
            totalSize: 0,
            optimizedSize: 0,
            cacheHits: 0,
            cacheMisses: 0,
            loadTimes: [],
            errors: []
        };
    }

    /**
     * Initialize cache configuration
     */
    initializeCacheConfig() {
        return {
            maxSize: 100 * 1024 * 1024, // 100MB
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            maxEntries: 1000,
            cleanupInterval: 60 * 60 * 1000, // 1 hour
            compressionEnabled: true,
            persistToDisk: false
        };
    }

    /**
     * Initialize fallback strategies
     */
    initializeFallbackStrategies() {
        return {
            cascade: {
                name: 'Cascade Fallback',
                description: 'Try multiple fallback options in order',
                execute: (assetPath, alternatives) => this.cascadeFallback(assetPath, alternatives)
            },
            
            generate: {
                name: 'Generate Fallback',
                description: 'Generate appropriate fallback content',
                execute: (assetType, context) => this.generateFallback(assetType, context)
            },
            
            substitute: {
                name: 'Substitute Fallback',
                description: 'Use similar asset as substitute',
                execute: (assetPath, assetType) => this.substituteFallback(assetPath, assetType)
            },
            
            graceful: {
                name: 'Graceful Degradation',
                description: 'Degrade gracefully without the asset',
                execute: (assetPath, context) => this.gracefulDegradation(assetPath, context)
            }
        };
    }

    /**
     * Main asset loading method
     */
    async loadAsset(assetPath, options = {}) {
        try {
            const loadOptions = {
                cache: options.cache !== false,
                optimize: options.optimize !== false,
                fallback: options.fallback !== false,
                timeout: options.timeout || 5000,
                retries: options.retries || 2,
                ...options
            };
            
            const startTime = Date.now();
            
            // Check cache first
            if (loadOptions.cache) {
                const cachedAsset = this.getCachedAsset(assetPath);
                if (cachedAsset) {
                    this.assetMetrics.cacheHits++;
                    this.recordLoadTime(Date.now() - startTime);
                    return cachedAsset;
                }
                this.assetMetrics.cacheMisses++;
            }
            
            // Attempt to load asset
            let asset = await this.attemptAssetLoad(assetPath, loadOptions);
            
            // Apply optimizations if requested
            if (asset && loadOptions.optimize) {
                asset = await this.optimizeAsset(asset, loadOptions);
            }
            
            // Cache the asset
            if (asset && loadOptions.cache) {
                this.cacheAsset(assetPath, asset);
            }
            
            // Update metrics
            this.updateAssetMetrics(asset, Date.now() - startTime);
            
            return asset;
            
        } catch (error) {
            console.error(`Asset loading failed for ${assetPath}:`, error.message);
            
            // Try fallback if enabled
            if (options.fallback !== false) {
                return await this.handleAssetFallback(assetPath, error, options);
            }
            
            throw error;
        }
    }

    /**
     * Attempt to load asset with retries
     */
    async attemptAssetLoad(assetPath, options) {
        let lastError;
        
        for (let attempt = 0; attempt <= options.retries; attempt++) {
            try {
                return await this.loadAssetDirect(assetPath, options);
            } catch (error) {
                lastError = error;
                
                if (attempt < options.retries) {
                    // Wait before retry (exponential backoff)
                    await this.delay(Math.pow(2, attempt) * 100);
                }
            }
        }
        
        throw lastError;
    }

    /**
     * Direct asset loading
     */
    async loadAssetDirect(assetPath, options) {
        // Determine asset type
        const assetType = this.determineAssetType(assetPath);
        const typeConfig = this.assetTypes[assetType];
        
        if (!typeConfig) {
            throw new Error(`Unsupported asset type for: ${assetPath}`);
        }
        
        // Load based on path type
        if (this.isUrl(assetPath)) {
            return await this.loadRemoteAsset(assetPath, typeConfig, options);
        } else if (this.isDataUrl(assetPath)) {
            return this.loadDataUrlAsset(assetPath, typeConfig);
        } else {
            return await this.loadLocalAsset(assetPath, typeConfig, options);
        }
    }

    /**
     * Load remote asset
     */
    async loadRemoteAsset(url, typeConfig, options) {
        // For this implementation, we'll simulate remote loading
        // In a real implementation, you'd use fetch or similar
        
        return {
            path: url,
            type: this.determineAssetType(url),
            content: null, // Would contain actual content
            size: 0,
            mimeType: typeConfig.mimeTypes[0],
            loaded: true,
            remote: true,
            timestamp: Date.now()
        };
    }

    /**
     * Load data URL asset
     */
    loadDataUrlAsset(dataUrl, typeConfig) {
        try {
            const [header, data] = dataUrl.split(',');
            const mimeMatch = header.match(/data:([^;]+)/);
            const mimeType = mimeMatch ? mimeMatch[1] : typeConfig.mimeTypes[0];
            
            return {
                path: dataUrl,
                type: this.determineAssetType(dataUrl),
                content: data,
                size: data.length,
                mimeType: mimeType,
                loaded: true,
                dataUrl: true,
                timestamp: Date.now()
            };
        } catch (error) {
            throw new Error(`Invalid data URL: ${error.message}`);
        }
    }

    /**
     * Load local asset
     */
    async loadLocalAsset(filePath, typeConfig, options) {
        try {
            // Check if file exists
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${filePath}`);
            }
            
            // Check file size
            const stats = fs.statSync(filePath);
            if (stats.size > typeConfig.maxSize) {
                throw new Error(`File too large: ${stats.size} > ${typeConfig.maxSize}`);
            }
            
            // Read file content
            const content = fs.readFileSync(filePath);
            
            return {
                path: filePath,
                type: this.determineAssetType(filePath),
                content: content,
                size: stats.size,
                mimeType: this.getMimeType(filePath),
                loaded: true,
                local: true,
                timestamp: Date.now()
            };
            
        } catch (error) {
            throw new Error(`Failed to load local asset: ${error.message}`);
        }
    }

    /**
     * Handle asset fallback
     */
    async handleAssetFallback(assetPath, error, options) {
        try {
            const assetType = this.determineAssetType(assetPath);
            const fallbackStrategy = options.fallbackStrategy || 'cascade';
            
            this.assetMetrics.fallbacksUsed++;
            
            // Try different fallback strategies
            switch (fallbackStrategy) {
                case 'cascade':
                    return await this.cascadeFallback(assetPath, options.alternatives || []);
                    
                case 'generate':
                    return this.generateFallback(assetType, options.context || {});
                    
                case 'substitute':
                    return await this.substituteFallback(assetPath, assetType);
                    
                case 'graceful':
                    return this.gracefulDegradation(assetPath, options.context || {});
                    
                default:
                    return this.getDefaultFallback(assetType);
            }
            
        } catch (fallbackError) {
            console.error(`Fallback failed for ${assetPath}:`, fallbackError.message);
            
            // Return minimal fallback
            return this.getMinimalFallback(this.determineAssetType(assetPath));
        }
    }

    /**
     * Cascade fallback - try multiple alternatives
     */
    async cascadeFallback(assetPath, alternatives) {
        const allPaths = [assetPath, ...alternatives];
        
        for (const path of allPaths) {
            try {
                return await this.loadAssetDirect(path, { retries: 0 });
            } catch (error) {
                continue; // Try next alternative
            }
        }
        
        // If all alternatives fail, generate fallback
        const assetType = this.determineAssetType(assetPath);
        return this.generateFallback(assetType, { originalPath: assetPath });
    }

    /**
     * Generate appropriate fallback content
     */
    generateFallback(assetType, context = {}) {
        const fallbacks = this.fallbackAssets;
        
        switch (assetType) {
            case 'image':
                const imageType = context.imageType || 'placeholder';
                const fallbackImage = fallbacks.images[imageType] || fallbacks.images.placeholder;
                return {
                    path: `fallback:image:${imageType}`,
                    type: 'image',
                    content: fallbackImage.content,
                    size: fallbackImage.content.length,
                    mimeType: 'image/svg+xml',
                    loaded: true,
                    fallback: true,
                    timestamp: Date.now()
                };
                
            case 'font':
                const fontType = context.fontType || 'primary';
                const fallbackFont = fallbacks.fonts[fontType] || fallbacks.fonts.primary;
                return {
                    path: `fallback:font:${fontType}`,
                    type: 'font',
                    content: `font-family: ${fallbackFont.family};`,
                    size: fallbackFont.family.length,
                    mimeType: 'text/css',
                    loaded: true,
                    fallback: true,
                    timestamp: Date.now()
                };
                
            case 'style':
                return {
                    path: 'fallback:style:base',
                    type: 'style',
                    content: this.generateBasicCSS(),
                    size: 0,
                    mimeType: 'text/css',
                    loaded: true,
                    fallback: true,
                    timestamp: Date.now()
                };
                
            default:
                return this.getMinimalFallback(assetType);
        }
    }

    /**
     * Substitute fallback - use similar asset
     */
    async substituteFallback(assetPath, assetType) {
        // Find similar assets in cache
        const similarAssets = this.findSimilarAssets(assetPath, assetType);
        
        if (similarAssets.length > 0) {
            const substitute = similarAssets[0];
            return {
                ...substitute,
                path: `substitute:${substitute.path}`,
                substitute: true,
                originalPath: assetPath
            };
        }
        
        // No similar assets found, generate fallback
        return this.generateFallback(assetType, { originalPath: assetPath });
    }

    /**
     * Graceful degradation - continue without asset
     */
    gracefulDegradation(assetPath, context) {
        return {
            path: assetPath,
            type: this.determineAssetType(assetPath),
            content: null,
            size: 0,
            mimeType: 'text/plain',
            loaded: false,
            degraded: true,
            timestamp: Date.now()
        };
    }

    /**
     * Get default fallback for asset type
     */
    getDefaultFallback(assetType) {
        const typeConfig = this.assetTypes[assetType];
        if (!typeConfig) {
            return this.getMinimalFallback('unknown');
        }
        
        return this.generateFallback(assetType, {});
    }

    /**
     * Get minimal fallback
     */
    getMinimalFallback(assetType) {
        return {
            path: `minimal:${assetType}`,
            type: assetType,
            content: '',
            size: 0,
            mimeType: 'text/plain',
            loaded: true,
            minimal: true,
            timestamp: Date.now()
        };
    }

    /**
     * Optimize asset based on type
     */
    async optimizeAsset(asset, options) {
        try {
            const strategies = this.optimizationStrategies[asset.type];
            if (!strategies) {
                return asset; // No optimization available
            }
            
            let optimizedAsset = { ...asset };
            
            // Apply requested optimizations
            for (const [strategyName, strategy] of Object.entries(strategies)) {
                if (options[strategyName] !== false) {
                    try {
                        optimizedAsset = await strategy.execute(optimizedAsset, options);
                        optimizedAsset.optimizations = optimizedAsset.optimizations || [];
                        optimizedAsset.optimizations.push(strategyName);
                    } catch (error) {
                        console.warn(`Optimization ${strategyName} failed:`, error.message);
                    }
                }
            }
            
            if (optimizedAsset.optimizations && optimizedAsset.optimizations.length > 0) {
                this.assetMetrics.optimizedAssets++;
                this.assetMetrics.optimizedSize += (asset.size - optimizedAsset.size);
            }
            
            return optimizedAsset;
            
        } catch (error) {
            console.warn(`Asset optimization failed:`, error.message);
            return asset; // Return original asset if optimization fails
        }
    }

    /**
     * Cache management
     */
    getCachedAsset(assetPath) {
        const cached = this.assetCache.get(assetPath);
        
        if (!cached) {
            return null;
        }
        
        // Check if cache entry is still valid
        const now = Date.now();
        if (now - cached.timestamp > this.cacheConfig.maxAge) {
            this.assetCache.delete(assetPath);
            return null;
        }
        
        return cached.asset;
    }

    cacheAsset(assetPath, asset) {
        // Check cache size limits
        if (this.assetCache.size >= this.cacheConfig.maxEntries) {
            this.cleanupCache();
        }
        
        // Check total cache size
        const totalSize = this.calculateCacheSize();
        if (totalSize + asset.size > this.cacheConfig.maxSize) {
            this.cleanupCache();
        }
        
        this.assetCache.set(assetPath, {
            asset: asset,
            timestamp: Date.now(),
            accessCount: 1,
            lastAccess: Date.now()
        });
        
        this.assetMetrics.cachedAssets++;
    }

    cleanupCache() {
        const now = Date.now();
        const entries = Array.from(this.assetCache.entries());
        
        // Sort by last access time (least recently used first)
        entries.sort((a, b) => a[1].lastAccess - b[1].lastAccess);
        
        // Remove oldest entries until we're under limits
        const targetSize = Math.floor(this.cacheConfig.maxEntries * 0.8);
        
        while (this.assetCache.size > targetSize && entries.length > 0) {
            const [path] = entries.shift();
            this.assetCache.delete(path);
        }
    }

    calculateCacheSize() {
        let totalSize = 0;
        for (const [, cached] of this.assetCache) {
            totalSize += cached.asset.size || 0;
        }
        return totalSize;
    }

    /**
     * Asset type detection
     */
    determineAssetType(assetPath) {
        if (this.isDataUrl(assetPath)) {
            const mimeMatch = assetPath.match(/data:([^;]+)/);
            if (mimeMatch) {
                const mimeType = mimeMatch[1];
                if (mimeType.startsWith('image/')) return 'image';
                if (mimeType.startsWith('font/')) return 'font';
                if (mimeType === 'text/css') return 'style';
                if (mimeType.includes('javascript')) return 'script';
            }
        }
        
        const extension = path.extname(assetPath).toLowerCase();
        
        for (const [type, config] of Object.entries(this.assetTypes)) {
            if (config.extensions.includes(extension)) {
                return type;
            }
        }
        
        return 'unknown';
    }

    getMimeType(assetPath) {
        const assetType = this.determineAssetType(assetPath);
        const typeConfig = this.assetTypes[assetType];
        return typeConfig ? typeConfig.mimeTypes[0] : 'application/octet-stream';
    }

    isUrl(path) {
        return /^https?:\/\//i.test(path);
    }

    isDataUrl(path) {
        return /^data:/i.test(path);
    }

    /**
     * Asset optimization implementations
     */
    compressImage(asset) {
        // Simulate image compression
        const compressionRatio = 0.7; // 30% reduction
        return {
            ...asset,
            size: Math.floor(asset.size * compressionRatio),
            compressed: true
        };
    }

    resizeImage(asset, dimensions) {
        // Simulate image resizing
        return {
            ...asset,
            dimensions: dimensions,
            resized: true
        };
    }

    optimizeImageFormat(asset) {
        // Simulate format optimization
        return {
            ...asset,
            mimeType: 'image/webp',
            formatOptimized: true
        };
    }

    minifyCSS(asset) {
        if (typeof asset.content === 'string') {
            // Simple CSS minification simulation
            const minified = asset.content
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .trim();
            
            return {
                ...asset,
                content: minified,
                size: minified.length,
                minified: true
            };
        }
        return asset;
    }

    inlineCSS(asset) {
        return {
            ...asset,
            inline: true
        };
    }

    minifyJS(asset) {
        if (typeof asset.content === 'string') {
            // Simple JS minification simulation
            const minified = asset.content
                .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
                .replace(/\/\/.*$/gm, '') // Remove line comments
                .replace(/\s+/g, ' ') // Collapse whitespace
                .trim();
            
            return {
                ...asset,
                content: minified,
                size: minified.length,
                minified: true
            };
        }
        return asset;
    }

    bundleScripts(assets) {
        const bundledContent = assets
            .map(asset => asset.content)
            .join(';\n');
        
        return {
            path: 'bundle.js',
            type: 'script',
            content: bundledContent,
            size: bundledContent.length,
            mimeType: 'application/javascript',
            loaded: true,
            bundled: true,
            timestamp: Date.now()
        };
    }

    /**
     * Fallback asset generators
     */
    generatePlaceholderSVG(width, height, text) {
        return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f3f4f6" stroke="#d1d5db" stroke-width="2"/>
            <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">${text}</text>
        </svg>`;
    }

    generateIconSVG(width, height, type) {
        const icons = {
            icon: `<circle cx="12" cy="12" r="10" fill="#6b7280"/>`,
            check: `<path d="M9 12l2 2 4-4" stroke="#10b981" stroke-width="2" fill="none"/>`,
            error: `<path d="M12 8v4m0 4h.01" stroke="#ef4444" stroke-width="2" fill="none"/>`,
            info: `<path d="M12 16v-4m0-4h.01" stroke="#3b82f6" stroke-width="2" fill="none"/>`
        };
        
        const iconPath = icons[type] || icons.icon;
        
        return `<svg width="${width}" height="${height}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            ${iconPath}
        </svg>`;
    }

    generateLogoSVG(width, height, text) {
        return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#2563eb" rx="4"/>
            <text x="50%" y="50%" text-anchor="middle" dy="0.3em" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="white">${text}</text>
        </svg>`;
    }

    generateChartSVG(width, height) {
        return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f9fafb" stroke="#e5e7eb"/>
            <line x1="40" y1="20" x2="40" y2="180" stroke="#6b7280" stroke-width="2"/>
            <line x1="40" y1="180" x2="280" y2="180" stroke="#6b7280" stroke-width="2"/>
            <rect x="60" y="120" width="40" height="60" fill="#3b82f6"/>
            <rect x="120" y="80" width="40" height="100" fill="#10b981"/>
            <rect x="180" y="100" width="40" height="80" fill="#f59e0b"/>
            <rect x="240" y="60" width="40" height="120" fill="#ef4444"/>
            <text x="150" y="15" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#374151">Chart Placeholder</text>
        </svg>`;
    }

    generateBackgroundSVG(width, height) {
        return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#f8fafc;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#e2e8f0;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#bg)"/>
        </svg>`;
    }

    generateBasicCSS() {
        return `
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            h1, h2, h3 { color: #2563eb; margin-bottom: 1rem; }
            p { margin-bottom: 1rem; }
            .container { max-width: 800px; margin: 0 auto; padding: 2rem; }
        `;
    }

    /**
     * Utility methods
     */
    findSimilarAssets(assetPath, assetType) {
        const similar = [];
        
        for (const [path, cached] of this.assetCache) {
            if (cached.asset.type === assetType && path !== assetPath) {
                similar.push(cached.asset);
            }
        }
        
        return similar;
    }

    updateAssetMetrics(asset, loadTime) {
        this.assetMetrics.totalAssets++;
        this.assetMetrics.totalSize += asset ? asset.size || 0 : 0;
        this.recordLoadTime(loadTime);
        
        if (asset && asset.fallback) {
            this.assetMetrics.fallbacksUsed++;
        }
    }

    recordLoadTime(time) {
        this.assetMetrics.loadTimes.push(time);
        
        // Keep only last 100 load times
        if (this.assetMetrics.loadTimes.length > 100) {
            this.assetMetrics.loadTimes.shift();
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Public API methods
     */
    async loadMultipleAssets(assetPaths, options = {}) {
        const promises = assetPaths.map(path => this.loadAsset(path, options));
        return await Promise.allSettled(promises);
    }

    preloadAssets(assetPaths, options = {}) {
        // Start loading assets in background
        assetPaths.forEach(path => {
            this.loadAsset(path, { ...options, cache: true }).catch(() => {
                // Ignore preload errors
            });
        });
    }

    clearCache() {
        this.assetCache.clear();
        this.assetMetrics.cachedAssets = 0;
    }

    getAssetMetrics() {
        const avgLoadTime = this.assetMetrics.loadTimes.length > 0 ?
            this.assetMetrics.loadTimes.reduce((a, b) => a + b, 0) / this.assetMetrics.loadTimes.length : 0;
        
        return {
            ...this.assetMetrics,
            averageLoadTime: avgLoadTime,
            cacheHitRate: this.assetMetrics.totalAssets > 0 ?
                (this.assetMetrics.cacheHits / (this.assetMetrics.cacheHits + this.assetMetrics.cacheMisses)) * 100 : 0,
            optimizationRate: this.assetMetrics.totalAssets > 0 ?
                (this.assetMetrics.optimizedAssets / this.assetMetrics.totalAssets) * 100 : 0,
            fallbackRate: this.assetMetrics.totalAssets > 0 ?
                (this.assetMetrics.fallbacksUsed / this.assetMetrics.totalAssets) * 100 : 0,
            cacheSize: this.calculateCacheSize(),
            cacheEntries: this.assetCache.size
        };
    }

    getFallbackAssets() {
        return this.fallbackAssets;
    }

    getOptimizationStrategies() {
        return Object.keys(this.optimizationStrategies).reduce((acc, type) => {
            acc[type] = Object.keys(this.optimizationStrategies[type]);
            return acc;
        }, {});
    }

    resetMetrics() {
        this.assetMetrics = this.initializeAssetMetrics();
    }
}

module.exports = AssetManagementSystem;