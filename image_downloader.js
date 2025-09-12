#!/usr/bin/env node

/**
 * Quality Image Downloader
 * Downloads high-quality PNG and SVG images from various sources:
 * - Unsplash (PNG/JPG - high quality)
 * - Pexels (PNG/JPG - high quality)
 * - Free SVG libraries (SVG)
 * - Hero Icons (SVG - scalable)
 * - Tabler Icons (SVG - scalable)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

class QualityImageDownloader {
    constructor() {
        this.outputDir = path.join(__dirname, 'assets-images');
        this.catalogFile = path.join(__dirname, 'assets-images', 'image_catalog.json');

        // High-quality image sources
        this.sources = {
            pexels: {
                name: 'Pexels',
                baseUrl: 'https://api.pexels.com/v1',
                apiKey: 'OAK8H87MhVnG0QpmqenuKKwm8VXISWRTSU64jz7Th4MdXZXoyAlw45vy',
                categories: ['business', 'technology', 'nature', 'abstract'],
                imageTypes: ['png', 'jpg'],
                quality: 'high',
                description: 'Beautiful, free, high-quality stock photos from Pexels API',
                searchQueries: [
                    'business office',
                    'technology computer',
                    'nature landscape',
                    'abstract modern design',
                    'corporate meeting',
                    'digital workspace',
                    'minimalist design',
                    'professional portrait',
                    'modern workspace',
                    'creative design',
                    'data visualization',
                    'team collaboration',
                    'work flow',
                    'product showcase',
                    'office interior',
                    'tech gadgets',
                    'data analytics',
                    'product upgrade',
                    'software development',
                    'mobile applications',
                    'web development',
                    'artificial intelligence',
                    'machine learning',
                    'cloud computing',
                    'cybersecurity',
                    'fintech innovation',
                    'healthcare technology',
                    'educational platform',
                    'e-commerce solution'
                ]
            },
            simpleicons: {
                name: 'Simple Icons',
                baseUrl: 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons',
                categories: ['brand'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Popular brand logos in SVG format',
                sampleIcons: [
                    'react.svg', 'javascript.svg', 'python.svg', 'github.svg',
                    'nodejs.svg', 'npm.svg', 'vercel.svg', 'aws.svg',
                    'docker.svg', 'kubernetes.svg', 'mongodb.svg', 'postgresql.svg',
                    'tailwindcss.svg', 'figma.svg', 'notion.svg', 'slack.svg',
                    'typescript.svg', 'nextdotjs.svg', 'prisma.svg', 'planetscale.svg',
                    'stripe.svg', 'paypal.svg', 'googlecloud.svg', 'firebase.svg',
                    'adobe.svg', 'photoshop.svg', 'illustrator.svg', 'xd.svg',
                    'microsoft.svg', 'apple.svg', 'google.svg', 'amazon.svg',
                    'spotify.svg', 'netflix.svg', 'youtube.svg', 'linkedin.svg',
                    'instagram.svg', 'twitter.svg', 'facebook.svg', 'tiktok.svg',
                    'zoom.svg', 'discord.svg', 'reddit.svg', 'twitch.svg',
                    'dropbox.svg', 'googledrive.svg', 'onedrive.svg', 'box.svg',
                    'airbnb.svg', 'uber.svg', 'shopify.svg', 'squarespace.svg',
                    'wordpress.svg', 'woocommerce.svg', 'magento.svg', 'laravel.svg'
                ]
            },
            devicons: {
                name: 'DevIcons',
                baseUrl: 'https://raw.githubusercontent.com/devicons/devicon/master/icons',
                categories: ['tech'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Developer tool and technology icons',
                sampleIcons: [
                    'javascript/javascript-original.svg', 'python/python-original.svg',
                    'nodejs/nodejs-original.svg', 'react/react-original.svg',
                    'html5/html5-original.svg', 'css3/css3-original.svg',
                    'git/git-original.svg', 'github/github-original.svg',
                    'linux/linux-original.svg', 'windows8/windows8-original.svg',
                    'typescript/typescript-original.svg', 'nextjs/nextjs-original.svg',
                    'express/express-original.svg', 'mongodb/mongodb-original.svg',
                    'postgresql/postgresql-original.svg', 'mysql/mysql-original.svg',
                    'redis/redis-original.svg', 'docker/docker-original.svg',
                    'kubernetes/kubernetes-plain.svg', 'aws/aws-original.svg',
                    'azure/azure-original.svg', 'firebase/firebase-plain.svg'
                ]
            },
            tabler: {
                name: 'Tabler Icons',
                baseUrl: 'https://raw.githubusercontent.com/tabler/tabler-icons/main/icons',
                categories: ['general', 'education', 'science', 'nature'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Comprehensive icon set with education, science, and nature themes',
                sampleIcons: [
                    'school.svg', 'book.svg', 'certificate.svg', 'graduation-cap.svg',
                    'microscope.svg', 'beaker.svg', 'atom.svg', 'planet.svg',
                    'dna.svg', 'math.svg', 'calculator.svg', 'compass.svg',
                    'tree.svg', 'leaf.svg', 'mountain.svg', 'flower.svg',
                    'arrow-right.svg', 'check.svg', 'x.svg', 'circle.svg',
                    'pentagon.svg', 'hexagon.svg', 'star.svg', 'chart-line.svg',
                    'chart-bar.svg', 'chart-pie.svg', 'brand-google.svg', 'camera.svg',
                    'palette.svg', 'pencil.svg', 'eraser.svg', 'color-picker.svg',
                    'bulb.svg', 'brain.svg', 'target.svg', 'flag.svg'
                ]
            },
            // Working illustration sources
            kyaan: {
                name: 'Kyaan (Illustrations)',
                baseUrl: 'https://raw.githubusercontent.com/kyaan/kysely/main/static',
                categories: ['illustrations', 'education', 'business', 'tech'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Open-source illustration library with educational themes',
                sampleIllustrations: [
                    'design-process.svg', 'programming.svg', 'learning.svg',
                    'innovation.svg', 'creativity.svg', 'knowledge.svg',
                    'research.svg', 'education.svg', 'collaboration.svg'
                ]
            },
            mumamsa: {
                name: 'Mumamsa (Illustrations)',
                baseUrl: 'https://raw.githubusercontent.com/MumamsaArts/mumamsa/main',
                categories: ['illustrations', 'art', 'graphics'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Open-source art and illustration collection',
                sampleIllustrations: [
                    'creativity.svg', 'art.svg', 'design.svg', 'innovation.svg'
                ]
            },
            // Generate basic educational illustrations
            generated: {
                name: 'Generated Educational Illustrations',
                categories: ['illustrations', 'education', 'science', 'nature'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Programmatically generated educational illustrations',
                generatedIllustrations: true
            },
            undraw: {
                name: 'UnDraw Illustrations',
                baseUrl: 'https://raw.githubusercontent.com/TanZng/undraw/master/svg',
                categories: ['illustrations', 'education', 'science', 'nature', 'business', 'infographics'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Beautiful illustrations for education, science, and professional presentations',
                sampleIllustrations: [
                    'undraw_code_thinking.svg',
                    'undraw_programming.svg',
                    'undraw_dev_focus.svg',
                    'undraw_learning_streak.svg',
                    'undraw_mathematics.svg',
                    'undraw_science_experiment.svg',
                    'undraw_robotics.svg',
                    'undraw_design_inspiration.svg',
                    'undraw_good_team.svg',
                    'undraw_team_effort.svg',
                    'undraw_developer_activity.svg',
                    'undraw_data_visualization.svg',
                    'undraw_book_lover.svg',
                    'undraw_online_learning.svg',
                    'undraw_user_interface.svg',
                    'undraw_dashboard.svg',
                    'undraw_mobile_development.svg',
                    'undraw_virtual_reality.svg',
                    'undraw_flowers.svg',
                    'undraw_environmental_study.svg',
                    'undraw_road_to_knowledge.svg',
                    'undraw_social_growth.svg',
                    'undraw_chatting.svg',
                    'undraw_group_video.svg',
                    'undraw_team_spirit.svg',
                    'undraw_collaboration.svg',
                    'undraw_working_late.svg',
                    'undraw_business_plan.svg',
                    'undraw_target.svg',
                    'undraw_to_do_list.svg'
                ]
            },
            infographics: {
                name: 'Infographics Collection',
                baseUrl: 'https://raw.githubusercontent.com/infographics-collection/master',
                categories: ['infographics', 'charts', 'data', 'business', 'education'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Professional infographics and data visualization graphics',
                sampleIllustrations: [
                    'pie-chart.svg', 'bar-chart.svg', 'line-chart.svg',
                    'flowchart.svg', 'org-chart.svg', 'data-infographic.svg',
                    'timeline.svg', 'statistics.svg', 'graduation-chart.svg'
                ]
            },
            diagrams: {
                name: 'Diagrams & Charts',
                baseUrl: 'https://raw.githubusercontent.com/diagrams-library/main/svg',
                categories: ['diagrams', 'charts', 'infographics', 'business', 'education'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Professional diagrams, flowcharts and chart graphics',
                sampleIllustrations: [
                    'mind-map.svg', 'swot-analysis.svg', 'venn-diagram.svg',
                    'gantt-chart.svg', 'radar-chart.svg', 'funnel-chart.svg',
                    'tree-diagram.svg', 'network-diagram.svg'
                ]
            },
            // Add Illlustrations.co as backup (if working)
            illlustrations: {
                name: 'Illlustrations.co',
                baseUrl: 'https://raw.githubusercontent.com/Midway91/Hugo-Theme-Pure-Single/master/layouts/partials',
                categories: ['illustrations', 'general', 'tech'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Open-source illustration library',
                sampleIllustrations: [
                    'illustration-browser-stats.svg',
                    'illustration-code.svg',
                    'illustration-javascript.svg',
                    'illustration-team.svg',
                    'illustration-coding.svg'
                ]
            },
            lucide: {
                name: 'Lucide Icons',
                baseUrl: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons',
                categories: ['general', 'education', 'science', 'nature'],
                imageTypes: ['svg'],
                quality: 'vector',
                description: 'Beautiful & consistent icon toolkit with educational themes',
                sampleIcons: [
                    // Education & Learning
                    'graduation-cap.svg', 'school.svg', 'book-open.svg', 'book.svg',
                    'brain.svg', 'lightbulb.svg', 'target.svg', 'award.svg',
                    'presentation.svg', 'blackboard.svg', 'chalkboard.svg', 'pencil.svg',
                    'ruler.svg', 'eraser.svg', 'notebook.svg', 'tablet.svg',
                    'certificate.svg', 'trophy.svg', 'medal.svg', 'star.svg',

                    // Science & Research
                    'microscope.svg', 'flask.svg', 'beaker.svg', 'atom.svg',
                    'atom-2.svg', 'dna.svg', 'dna-2.svg', 'quantum.svg',
                    'zap.svg', 'battery.svg', 'battery-charging.svg', 'solar.svg',
                    'wind.svg', 'thermometer.svg', 'test-tube.svg', 'petri-dish.svg',
                    'bunsen-burner.svg', 'experimental-flask.svg', 'magnifying-glass.svg',

                    // Nature & Environment
                    'tree-pine.svg', 'mountain.svg', 'flower-2.svg', 'leaf.svg',
                    'sprout.svg', 'seedling.svg', 'nature.svg', 'sun.svg',
                    'moon.svg', 'cloud.svg', 'rain.svg', 'snow.svg',
                    'droplet.svg', 'waves.svg', 'wind.svg', 'compass.svg',
                    'globe.svg', 'map.svg', 'map-pin.svg', 'sailboat.svg',
                    'fish.svg', 'bird.svg', 'butterfly.svg', 'flower.svg',

                    // General Presentation
                    'arrow-right.svg', 'check.svg', 'x.svg', 'circle.svg',
                    'square.svg', 'triangle.svg', 'diamond.svg', 'hexagon.svg',
                    'pentagon.svg', 'octagon.svg', 'plus.svg', 'minus.svg',
                    'move.svg', 'rotate-cw.svg', 'flip-horizontal.svg', 'flip-vertical.svg',
                    'zoom-in.svg', 'zoom-out.svg', 'fullscreen.svg', 'minimize.svg',
                    'clipboard.svg', 'clipboard-list.svg', 'clipboard-check.svg',

                    // Communication & Social
                    'users.svg', 'user.svg', 'user-plus.svg', 'user-minus.svg',
                    'user-check.svg', 'user-x.svg', 'users-2.svg', 'group.svg',
                    'phone.svg', 'phone-call.svg', 'phone-incoming.svg', 'phone-outgoing.svg',
                    'mail.svg', 'mail-open.svg', 'send.svg', 'message-square.svg',
                    'message-circle.svg', 'speech.svg', 'chat.svg',

                    // Productivity & Work
                    'briefcase.svg', 'building.svg', 'building-2.svg', 'factory.svg',
                    'calendar.svg', 'clock.svg', 'timer.svg', 'hourglass.svg',
                    'alarm-clock.svg', 'watch.svg', 'calendar-days.svg', 'calendar-week.svg',
                    'file.svg', 'file-text.svg', 'file-image.svg', 'file-audio.svg',
                    'file-video.svg', 'folder.svg', 'folder-open.svg', 'archive.svg',
                    'download.svg', 'upload.svg', 'link.svg', 'share.svg',

                    // Math & Numbers
                    'hash.svg', 'at-sign.svg', 'percent.svg', 'divide.svg',
                    'equal.svg', 'plus-minus.svg', 'move-horizontal.svg', 'move-vertical.svg',
                    'chart-line.svg', 'chart-bar.svg', 'chart-pie.svg', 'chart-scatter.svg',
                    'bar-chart.svg', 'trending-up.svg', 'trending-down.svg', 'activity.svg',
                    'pie-chart.svg', 'line-chart.svg', 'area-chart.svg', 'scatter-chart.svg',

                    // UI & Interface
                    'settings.svg', 'settings-2.svg', 'tool.svg', 'wrench.svg',
                    'hammer.svg', 'screwdriver.svg', 'gear.svg', 'gears.svg',
                    'bar-chart-3.svg', 'pie-chart-2.svg', 'activity-2.svg', 'eye.svg',
                    'eye-off.svg', 'camera.svg', 'video.svg', 'mic.svg',
                    'mic-off.svg', 'speaker.svg', 'volume-2.svg', 'headphones.svg',
                    'mouse.svg', 'keyboard.svg', 'monitor.svg', 'tablet.svg',

                    // Business & Finance
                    'dollar-sign.svg', 'euro.svg', 'pound-sterling.svg', 'yen.svg',
                    'wallet.svg', 'credit-card.svg', 'receipt.svg', 'shopping-cart.svg',
                    'shopping-bag.svg', 'store.svg', 'building-storefront.svg', 'package.svg',
                    'truck.svg', 'train.svg', 'plane.svg', 'ship.svg',

                    // Medical & Health
                    'heart.svg', 'stethoscope.svg', 'syringe.svg', 'pill.svg',
                    'bandaid.svg', 'user-md.svg', 'first-aid-kit.svg', 'shield.svg',
                    'shield-check.svg', 'shield-x.svg', 'stethoscope-2.svg', 'pulse.svg',

                    // Weather & Climate
                    'cloud.svg', 'cloud-rain.svg', 'cloud-snow.svg', 'sunrise.svg',
                    'sunset.svg', 'cloud-moon.svg', 'cloud-sun.svg', 'cloud-drizzle.svg',
                    'smog.svg', 'wind-2.svg', 'flame.svg', 'tornado.svg',

                    // Art & Design
                    'palette.svg', 'brush.svg', 'paint-brush.svg', 'paint-bucket.svg',
                    'crop.svg', 'scissors.svg', 'color-palette.svg', 'contrast.svg',
                    'image.svg', 'camera-photo.svg', 'frame.svg', 'tool-palette.svg',

                    // Gaming & Entertainment
                    'gamepad.svg', 'controller.svg', 'play.svg', 'pause.svg',
                    'skip-back.svg', 'skip-forward.svg', 'repeat.svg', 'shuffle.svg',
                    'music.svg', 'headphones-2.svg', 'radio.svg', 'television.svg',
                    'film.svg', 'file-video-2.svg', 'game-controller.svg', 'trophy-2.svg',

                    // Network & Technology
                    'wifi.svg', 'signal.svg', 'router.svg', 'server.svg',
                    'database.svg', 'cpu.svg', 'hard-drive.svg', 'memory-stick.svg',
                    'webcam.svg', 'printer.svg', 'scan.svg', 'mobile-phone.svg',
                    'laptop.svg', 'desktop.svg', 'smartphone.svg', 'watch.svg',

                    // Time & Schedule
                    'time-forward.svg', 'time-back.svg', 'alarm-clock-2.svg',
                    'stopwatch.svg', 'sand-timer.svg', 'calendar-range.svg',

                    // Status & Feedback
                    'check-circle.svg', 'x-circle.svg', 'alert-triangle.svg',
                    'alert-circle.svg', 'info-circle.svg', 'help-circle.svg',
                    'loading.svg', 'loader.svg', 'progress.svg', 'complete.svg',

                    // Security & Access
                    'lock.svg', 'unlock.svg', 'key.svg', 'key-round.svg',
                    'fingerprint.svg', 'face-id.svg', 'shield-2.svg', 'bell-notification.svg',

                    // Travel & Navigation
                    'compass-2.svg', 'navigation.svg', 'map-2.svg', 'location.svg',
                    'flag-2.svg', 'anchor.svg', 'sail.svg', 'boat.svg',

                    // Icons & Symbols (Extra)
                    'hash-2.svg', 'symbol.svg', 'badge.svg', 'ribbon.svg',
                    'stamp.svg', 'ticket.svg', 'tag.svg', 'tags.svg',
                    'crown.svg', 'gem.svg', 'sparkles.svg', 'fire.svg',

                    // More UI Elements
                    'sidebar.svg', 'columns.svg', 'layout.svg', 'gird.svg',
                    'grid-2.svg', 'layout-2.svg', 'maximize.svg', 'shrink.svg',
                    'expand.svg', 'contract.svg', 'toggle-left.svg', 'toggle-right.svg'
                ]
            }
        };

        this.downloadedCatalog = {
            totalDownloaded: 0,
            sources: {},
            categories: {},
            files: []
        };

        this.ensureDirectories();
    }

    ensureDirectories() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }

        // Create source subdirectories
        Object.keys(this.sources).forEach(source => {
            const sourceDir = path.join(this.outputDir, source);
            if (!fs.existsSync(sourceDir)) {
                fs.mkdirSync(sourceDir, { recursive: true });
            }

            // Create category subdirectories
            this.sources[source].categories.forEach(category => {
                const categoryDir = path.join(sourceDir, category);
                if (!fs.existsSync(categoryDir)) {
                    fs.mkdirSync(categoryDir, { recursive: true });
                }
            });
        });
    }

    /**
     * Download image from URL
     */
    async downloadImage(url, filename, source, category) {
        return new Promise((resolve, reject) => {
            try {
                const parsedUrl = new URL(url);
                const protocol = parsedUrl.protocol === 'https:' ? https : http;
                const categoryDir = path.join(this.outputDir, source, category);
                const filePath = path.join(categoryDir, filename);

                protocol.get(url, (response) => {
                    if (response.statusCode === 200) {
                        const file = fs.createWriteStream(filePath);
                        response.pipe(file);

                        file.on('finish', () => {
                            file.close();
                            console.log(`✅ Downloaded: ${source}/${category}/${filename}`);
                            resolve({ success: true, path: filePath, filename, source, category });
                        });

                        file.on('error', (err) => {
                            fs.unlink(filePath, () => {});
                            reject(err);
                        });
                    } else if (response.statusCode === 404) {
                        resolve({ success: false, error: 'Not found', filename, source, category });
                    } else {
                        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                    }
                }).on('error', reject);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Search Pexels API for photos
     */
    async searchPexels(query, perPage = 1) {
        return new Promise((resolve, reject) => {
            const searchUrl = `${this.sources.unsplash.baseUrl}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;

            const options = {
                headers: {
                    'Authorization': this.sources.unsplash.apiKey
                }
            };

            https.get(searchUrl, options, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    try {
                        const parsedData = JSON.parse(data);
                        if (parsedData.photos && parsedData.photos.length > 0) {
                            resolve(parsedData.photos[0]); // Return first photo
                        } else {
                            resolve(null);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    /**
     * Download high-quality images from Pexels API
     */
    async downloadFromUnsplash(imageCount = 8) {
        console.log(`\n🌅 Downloading from Pexels API (High Quality Photos)`);
        console.log(`🔑 Using API Key: ${this.sources.unsplash.apiKey.substring(0, 10)}...`);

        const results = [];
        const searchQueries = this.sources.unsplash.searchQueries.slice(0, imageCount);

        for (const [index, query] of searchQueries.entries()) {
            try {
                console.log(`\n🔍 Searching for: "${query}"`);

                // Search for photo using Pexels API
                const photoData = await this.searchPexels(query);

                if (!photoData) {
                    console.log(`⚠️ No photo found for: "${query}"`);
                    continue;
                }

                // Use the large size image (usually around 1280x853)
                const imageUrl = photoData.src.large;
                const filename = `pexels_${query.replace(/\s+/g, '_')}_${index + 1}.jpg`;
                const category = 'business';

                console.log(`📸 Found photo by ${photoData.photographer} (${photoData.width}x${photoData.height})`);

                try {
                    const result = await this.downloadImage(imageUrl, filename, 'unsplash', category);

                    if (result.success) {
                        results.push(result);

                        // Add to catalog with Pexels metadata
                        this.downloadedCatalog.files.push({
                            filename: result.filename,
                            source: 'pexels',
                            category: category,
                            path: result.path,
                            searchQuery: query,
                            photographer: photoData.photographer,
                            photographerUrl: photoData.photographer_url,
                            pexelsUrl: photoData.url,
                            resolution: `${photoData.width}x${photoData.height}`,
                            format: 'jpeg',
                            quality: 'high',
                            apiSource: 'pexels',
                            downloadedAt: new Date().toISOString()
                        });

                        this.downloadedCatalog.totalDownloaded++;
                        this.updateSourceStats('unsplash');
                        this.updateCategoryStats(category);
                    } else {
                        console.log(`⚠️ Failed to download: ${result.filename}`);
                    }

                } catch (error) {
                    console.error(`❌ Download error for "${query}":`, error.message);
                }

            } catch (error) {
                console.error(`❌ Search error for "${query}":`, error.message);
            }

            // Rate limiting (Pexels has generous limits but we keep it conservative)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return results;
    }

    /**
     * Download SVG brand logos from Simple Icons
     */
    async downloadFromSimpleIcons(imageCount = 16) {
        console.log(`\n🏷️ Downloading from Simple Icons (Brand Logos SVG)`);

        const results = [];
        const iconsToDownload = this.sources.simpleicons.sampleIcons.slice(0, imageCount);
        const category = 'brand';

        for (const iconName of iconsToDownload) {
            const url = `${this.sources.simpleicons.baseUrl}/${iconName}`;
            const filename = `simple_${iconName}`;

            try {
                const result = await this.downloadImage(url, filename, 'simpleicons', category);

                if (result.success) {
                    results.push(result);

                    // Add to catalog
                    this.downloadedCatalog.files.push({
                        filename: result.filename,
                        source: 'simpleicons',
                        category: category,
                        path: result.path,
                        format: 'svg',
                        quality: 'vector',
                        downloadedAt: new Date().toISOString()
                    });

                    this.downloadedCatalog.totalDownloaded++;
                    this.updateSourceStats('simpleicons');
                    this.updateCategoryStats(category);
                } else {
                    console.log(`⚠️ Skipped: ${result.filename} (${result.error})`);
                }

            } catch (error) {
                console.error(`❌ Failed to download ${filename}:`, error.message);
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return results;
    }

    /**
     * Download SVG developer icons from DevIcons
     */
    async downloadFromDevIcons(imageCount = 10) {
        console.log(`\n👨‍💻 Downloading from DevIcons (Developer Tools SVG)`);

        const results = [];
        const iconsToDownload = this.sources.devicons.sampleIcons.slice(0, imageCount);
        const category = 'tech';

        for (const iconName of iconsToDownload) {
            const url = `${this.sources.devicons.baseUrl}/${iconName}`;
            const filename = `devicon_${iconName.split('/').pop()}.svg`;

            try {
                const result = await this.downloadImage(url, filename, 'devicons', category);

                if (result.success) {
                    results.push(result);

                    // Add to catalog
                    this.downloadedCatalog.files.push({
                        filename: result.filename,
                        source: 'devicons',
                        category: category,
                        path: result.path,
                        format: 'svg',
                        quality: 'vector',
                        downloadedAt: new Date().toISOString()
                    });

                    this.downloadedCatalog.totalDownloaded++;
                    this.updateSourceStats('devicons');
                    this.updateCategoryStats(category);
                } else {
                    console.log(`⚠️ Skipped: ${result.filename} (${result.error})`);
                }

            } catch (error) {
                console.error(`❌ Failed to download ${filename}:`, error.message);
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return results;
    }

    updateSourceStats(source) {
        if (!this.downloadedCatalog.sources[source]) {
            this.downloadedCatalog.sources[source] = 0;
        }
        this.downloadedCatalog.sources[source]++;
    }

    updateCategoryStats(category) {
        if (!this.downloadedCatalog.categories[category]) {
            this.downloadedCatalog.categories[category] = 0;
        }
        this.downloadedCatalog.categories[category]++;
    }

    /**
     * Download quality images from all sources
     */
    async downloadQualityImages(imagesPerSource = 10) {
        console.log('🚀 Starting quality image downloads...');
        console.log(`📊 Downloading ${imagesPerSource} images per source\n`);

        const allResults = [];

        try {
            console.log('\n' + '='.repeat(60));
            console.log('📸 PHASE 1: DOWNLOADING HIGH-QUALITY PHOTOS (PNG/JPG)');
            console.log('='.repeat(60));

            const unsplashResults = await this.downloadFromUnsplash(imagesPerSource);
            allResults.push(...unsplashResults);

        } catch (error) {
            console.error('Error downloading from Unsplash:', error.message);
        }

        try {
            const simpleResults = await this.downloadFromSimpleIcons(imagesPerSource);
            allResults.push(...simpleResults);

        } catch (error) {
            console.error('Error downloading from Simple Icons:', error.message);
        }

        try {
            const devResults = await this.downloadFromDevIcons(imagesPerSource);
            allResults.push(...devResults);

        } catch (error) {
            console.error('Error downloading from DevIcons:', error.message);
        }

        // Save catalog
        this.saveCatalog();

        console.log(`\n✅ Quality image download complete! ${allResults.length} images saved.`);
        console.log(`📁 Images organized in: ${this.outputDir}`);
        console.log(`📊 File formats: JPG (photos), SVG (vectors)`);

        return allResults;
    }

    /**
     * Save download catalog
     */
    saveCatalog() {
        fs.writeFileSync(this.catalogFile, JSON.stringify(this.downloadedCatalog, null, 2));
        console.log(`📋 Catalog updated: ${this.catalogFile}`);
    }

    /**
     * Download SVG icons from Tabler Icons
     */
    async downloadFromTabler(imageCount = 30) {
        console.log(`\n🎨 Downloading from Tabler Icons (Education, Science & Nature SVG)`);

        const results = [];
        const iconsToDownload = this.sources.tabler.sampleIcons.slice(0, imageCount);
        const category = 'general'; // Or based on icon type

        for (const iconName of iconsToDownload) {
            const url = `${this.sources.tabler.baseUrl}/${iconName}`;
            const filename = `tabler_${iconName}`;

            try {
                const result = await this.downloadImage(url, filename, 'tabler', 'general');

                if (result.success) {
                    results.push(result);

                    // Add to catalog
                    this.downloadedCatalog.files.push({
                        filename: result.filename,
                        source: 'tabler',
                        category: this.getCategoryForIcon(iconName),
                        path: result.path,
                        format: 'svg',
                        quality: 'vector',
                        downloadedAt: new Date().toISOString()
                    });

                    this.downloadedCatalog.totalDownloaded++;
                    this.updateSourceStats('tabler');
                    this.updateCategoryStats(this.getCategoryForIcon(iconName));
                } else {
                    console.log(`⚠️ Skipped: ${result.filename} (${result.error})`);
                }

            } catch (error) {
                console.error(`❌ Failed to download ${filename}:`, error.message);
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 50));
        }

        return results;
    }

    /**
     * Download SVG icons from Lucide Icons
     */
    async downloadFromLucide(imageCount = 150) {
        console.log(`\n✨ Downloading from Lucide Icons (Educational & General SVG)`);
        console.log(`📊 Attempting to download ${Math.min(imageCount, this.sources.lucide.sampleIcons.length)} icons...`);

        const results = [];
        const totalIcons = this.sources.lucide.sampleIcons.length;
        const iconsToDownload = this.sources.lucide.sampleIcons.slice(0, Math.min(imageCount, totalIcons));

        console.log(`🎯 Starting download of ${iconsToDownload.length} Lucide icons...\n`);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < iconsToDownload.length; i++) {
            const iconName = iconsToDownload[i];
            const url = `${this.sources.lucide.baseUrl}/${iconName}`;
            const filename = `lucide_${iconName}`;

            try {
                const result = await this.downloadImage(url, filename, 'lucide', 'general');

                if (result.success) {
                    results.push(result);
                    successCount++;

                    // Add to catalog
                    this.downloadedCatalog.files.push({
                        filename: result.filename,
                        source: 'lucide',
                        category: this.getCategoryForIcon(iconName),
                        path: result.path,
                        format: 'svg',
                        quality: 'vector',
                        downloadedAt: new Date().toISOString()
                    });

                    this.downloadedCatalog.totalDownloaded++;
                    this.updateSourceStats('lucide');
                    this.updateCategoryStats(this.getCategoryForIcon(iconName));

                    // Progress indicator
                    if (successCount % 20 === 0) {
                        console.log(`⏳ Progress: ${successCount}/${iconsToDownload.length} downloaded`);
                    }
                } else {
                    failCount++;
                }

            } catch (error) {
                failCount++;
                if (failCount % 10 === 0) {
                    console.log(`📝 So far: ${successCount} success, ${failCount} skipped`);
                }
            }

            // Rate limiting (faster for Lucide since they're reliable)
            await new Promise(resolve => setTimeout(resolve, 30));
        }

        console.log(`\n🎉 Lucide Icons download complete!`);
        console.log(`✅ Successfully downloaded: ${successCount} icons`);
        if (failCount > 0) {
            console.log(`⚠️ Skipped: ${failCount} icons (not found)`);
        }
        console.log(`📁 Total Lucide icons available: ${totalIcons}\n`);

        return results;
    }

    /**
     * Download illustrations from UnDraw
     */
    async downloadFromUnDraw(imageCount = 30) {
        console.log(`\n🎨 Downloading from UnDraw (Beautiful Illustrations for Education & Science)`);
        console.log(`📊 Attempting to download ${Math.min(imageCount, this.sources.undraw.sampleIllustrations.length)} illustrations...`);

        const results = [];
        const totalIllustrations = this.sources.undraw.sampleIllustrations.length;
        const illustrationsToDownload = this.sources.undraw.sampleIllustrations.slice(0, Math.min(imageCount, totalIllustrations));

        console.log(`🎯 Starting download of ${illustrationsToDownload.length} UnDraw illustrations...\n`);

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < illustrationsToDownload.length; i++) {
            const illustrationName = illustrationsToDownload[i];
            const url = `${this.sources.undraw.baseUrl}/${illustrationName}`;
            const filename = illustrationName;

            try {
                const result = await this.downloadImage(url, filename, 'undraw', 'illustrations');

                if (result.success) {
                    results.push(result);
                    successCount++;

                    // Add to catalog
                    this.downloadedCatalog.files.push({
                        filename: result.filename,
                        source: 'undraw',
                        category: this.getCategoryForIllustration(result.filename),
                        path: result.path,
                        format: 'svg',
                        quality: 'vector',
                        downloadedAt: new Date().toISOString()
                    });

                    this.downloadedCatalog.totalDownloaded++;
                    this.updateSourceStats('undraw');
                    this.updateCategoryStats(this.getCategoryForIllustration(result.filename));

                    // Progress indicator
                    if (successCount % 10 === 0) {
                        console.log(`⏳ Progress: ${successCount}/${illustrationsToDownload.length} downloaded`);
                    }
                } else {
                    failCount++;
                }

            } catch (error) {
                failCount++;
                if (failCount % 5 === 0) {
                    console.log(`📝 So far: ${successCount} success, ${failCount} skipped`);
                }
            }

            // Rate limiting for external API
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        console.log(`\n🎉 UnDraw illustrations download complete!`);
        console.log(`✅ Successfully downloaded: ${successCount} illustrations`);
        if (failCount > 0) {
            console.log(`⚠️ Skipped: ${failCount} illustrations (not found)`);
        }
        console.log(`📁 Total UnDraw illustrations available: ${totalIllustrations}\n`);

        return results;
    }

    /**
     * Download illustrations from HeroIcons
     */
    async downloadFromHeroIcons(imageCount = 20) {
        console.log(`\n🎨 Downloading from HeroIcons Illustrations (Professional Vector Graphics)`);

        const results = [];
        const illustrationsToDownload = this.sources.heroicons.sampleIllustrations.slice(0, Math.min(imageCount, this.sources.heroicons.sampleIllustrations.length));

        for (const illustrationName of illustrationsToDownload) {
            const url = `${this.sources.heroicons.baseUrl}/${illustrationName}`;
            const filename = `hericons_${illustrationName}`;

            try {
                const result = await this.downloadImage(url, filename, 'heroicons', 'illustrations');

                if (result.success) {
                    results.push(result);

                    // Add to catalog
                    this.downloadedCatalog.files.push({
                        filename: result.filename,
                        source: 'heroicons',
                        category: 'illustrations',
                        path: result.path,
                        format: 'svg',
                        quality: 'vector',
                        downloadedAt: new Date().toISOString()
                    });

                    this.downloadedCatalog.totalDownloaded++;
                    this.updateSourceStats('heroicons');
                    this.updateCategoryStats('illustrations');
                } else {
                    console.log(`⚠️ Skipped: ${result.filename} (${result.error})`);
                }

            } catch (error) {
                console.error(`❌ Failed to download ${filename}:`, error.message);
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log(`\n🎉 HeroIcons illustrations downloaded: ${results.length} illustrations`);
        return results;
    }

    /**
     * Download all illustrations from available sources
     */
    async downloadIllustrations(illustrationsPerSource = 30) {
        console.log('🚀 Starting illustration downloads from multiple sources...');
        console.log(`📊 Downloading ${illustrationsPerSource} illustrations per source\n`);

        const allResults = [];

        // Download from UnDraw (education/science themed)
        try {
            console.log('\n' + '='.repeat(60));
            console.log('🎨 ILLUSTRAING FROM GOOGLE UNDRAW (EDUCATION & SCIENCE FOCUS)');
            console.log('='.repeat(60));

            const unDrawResults = await this.downloadFromUnDraw(illustrationsPerSource);
            allResults.push(...unDrawResults);
        } catch (error) {
            console.error('Error downloading from UnDraw:', error.message);
        }

        // Download from HeroIcons Illustrations
        try {
            console.log('\n' + '='.repeat(60));
            console.log('🏢 DOWNLOADING FROM HEROICONS ILLUSTRATIONS');
            console.log('='.repeat(60));

            const heroResults = await this.downloadFromHeroIcons(illustrationsPerSource);
            allResults.push(...heroResults);
        } catch (error) {
            console.error('Error downloading from HeroIcons:', error.message);
        }

        this.saveCatalog();

        console.log(`\n🎉 Illustration download complete! ${allResults.length} illustrations saved.`);
        console.log(`📁 Illustrations organized in: ${this.outputDir}`);
        console.log(`📊 File format: SVG (scalable vector graphics)`);

        return allResults;
    }

    /**
     * Get appropriate category for illustration based on name
     */
    getCategoryForIllustration(illustrationName) {
        const lowerName = illustrationName.toLowerCase();

        if (lowerName.includes('book') || lowerName.includes('learning') ||
            lowerName.includes('teaching') || lowerName.includes('education') ||
            lowerName.includes('study') || lowerName.includes('knowledge')) {
            return 'education';
        }

        if (lowerName.includes('science') || lowerName.includes('experiment') ||
            lowerName.includes('math') || lowerName.includes('mathematics') ||
            lowerName.includes('robot') || lowerName.includes('robotics') ||
            lowerName.includes('data_visualization') || lowerName.includes('programming')) {
            return 'science';
        }

        if (lowerName.includes('nature') || lowerName.includes('environment') ||
            lowerName.includes('environmental') || lowerName.includes('adventure') ||
            lowerName.includes('map')) {
            return 'nature';
        }

        if (lowerName.includes('business') || lowerName.includes('collaboration') ||
            lowerName.includes('team') || lowerName.includes('organization') ||
            lowerName.includes('process_flow') || lowerName.includes('design_inspiration')) {
            return 'business';
        }

        return 'illustrations';
    }

    /**
     * Get appropriate category for icon based on name
     */
    getCategoryForIcon(iconName) {
        const education = ['school', 'book', 'graduation-cap', 'certificate', 'pencil', 'eraser'];
        const science = ['microscope', 'beaker', 'atom', 'dna', 'dna', 'atom-2', 'flask'];
        const nature = ['tree', 'leaf', 'mountain', 'flower', 'tree-pine', 'flower-2'];

        if (education.some(term => iconName.includes(term))) return 'education';
        if (science.some(term => iconName.includes(term))) return 'science';
        if (nature.some(term => iconName.includes(term))) return 'nature';

        return 'general';
    }

    /**
     * Download from specific source only
     */
    async downloadSpecificSource(sourceName, imageCount = 20) {
        if (!this.sources[sourceName]) {
            console.error(`❌ Unknown source: ${sourceName}`);
            console.log(`Available sources: ${Object.keys(this.sources).join(', ')}`);
            return [];
        }

        console.log(`🎯 Downloading from ${this.sources[sourceName].name} only...`);

        let results = [];

        switch (sourceName) {
            case 'unsplash':
                results = await this.downloadFromUnsplash(imageCount);
                break;
            case 'simpleicons':
                results = await this.downloadFromSimpleIcons(imageCount);
                break;
            case 'devicons':
                results = await this.downloadFromDevIcons(imageCount);
                break;
            case 'tabler':
                results = await this.downloadFromTabler(imageCount);
                break;
            case 'lucide':
                results = await this.downloadFromLucide(imageCount);
                break;
        }

        this.saveCatalog();

        console.log(`\n✅ Downloaded ${results.length} images from ${this.sources[sourceName].name}`);
        return results;
    }

    /**
     * Get download statistics
     */
    getStats() {
        console.log('\n📊 Download Statistics:');
        console.log(`Total images downloaded: ${this.downloadedCatalog.totalDownloaded}`);
        console.log('\n📁 By Source:');
        Object.entries(this.downloadedCatalog.sources).forEach(([source, count]) => {
            console.log(`  ${source}: ${count} images`);
        });
        console.log('\n📂 By Category:');
        Object.entries(this.downloadedCatalog.categories).forEach(([category, count]) => {
            console.log(`  ${category}: ${count} images`);
        });
    }

    /**
     * Display available sources and usage
     */
    displayInfo() {
        console.log('\n🎨 Quality Image Downloader');
        console.log('==================================');

        console.log('\n📚 Available Image Libraries:');
        Object.entries(this.sources).forEach(([key, source]) => {
            console.log(`\n• ${source.name} (${key})`);
            console.log(`  📄 Format: ${source.imageTypes.join(', ').toUpperCase()}`);
            console.log(`  ⚡ Quality: ${source.quality}`);
            console.log(`  📝 ${source.description}`);
            const sampleCount = source.sampleIcons ? source.sampleIcons.length : (source.sampleIllustrations ? source.sampleIllustrations.length : (source.searchQueries ? source.searchQueries.length : 0));
            console.log(`  🔢 Sample images: ${sampleCount}`);
        });

        console.log('\n🚀 Usage Examples:');
        console.log('• --all: Download quality images from all sources (8-16 per source)');
        console.log('• --source unsplash: Download high-quality photos only');
        console.log('• --source simpleicons: Download brand logos (SVG) only');
        console.log('• --source devicons: Download developer tools (SVG) only');
        console.log('• --help: Show this information');

        console.log('\n📁 Output Structure:');
        console.log('assets-images/');
        console.log('├── unsplash/');
        console.log('│   └── business/ (high-quality JPEG photos)');
        console.log('├── simpleicons/');
        console.log('│   └── brand/ (brand logos SVG)');
        console.log('├── devicons/');
        console.log('│   └── tech/ (developer tools SVG)');
        console.log('└── image_catalog.json');

        console.log('\n💡 Image Quality Features:');
        console.log('• 🖼️  High-resolution photos (1600x900, JPG)');
        console.log('• 🎨 Vector graphics (SVG, scalable to any size)');
        console.log('• 📂 Organized by source and category');
        console.log('• 📋 Cataloged with metadata and download dates');
        console.log('• 🔄 Batch downloads with error handling');
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const downloader = new QualityImageDownloader();

    if (args.includes('--all')) {
        downloader.downloadQualityImages();
    } else if (args.includes('--illustrations') || args.includes('--ill')) {
        const illustrationCount = args.includes('--count') ?
            parseInt(args[args.indexOf('--count') + 1]) : 30;
        downloader.downloadIllustrations(illustrationCount);
    } else if (args.includes('--source')) {
        const sourceIndex = args.indexOf('--source');
        const sourceName = args[sourceIndex + 1];
        let imageCount = 30; // Default count

        if (sourceName) {
            // Check if there's a --count parameter
            const countIndex = args.indexOf('--count');
            if (countIndex !== -1 && countIndex + 1 < args.length) {
                imageCount = parseInt(args[countIndex + 1]);
                if (isNaN(imageCount) || imageCount < 1) {
                    imageCount = 30;
                }
            }

            if (sourceName === 'lucide') {
                // For Lucide, use the maximum available icons
                imageCount = Math.min(313, imageCount);
            }

            console.log(`🎯 Downloading ${imageCount} ${sourceName} icons...`);
            downloader.downloadSpecificSource(sourceName, imageCount);
        } else {
            console.error('❌ Please specify a source name after --source');
            downloader.displayInfo();
        }
    } else if (args.includes('--stats')) {
        downloader.getStats();
    } else if (args.includes('--help')) {
        downloader.displayInfo();
    } else {
        downloader.displayInfo();
    }
}

module.exports = QualityImageDownloader;
