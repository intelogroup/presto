const EnhancedPptxGenerator = require('./generators/enhanced_pptx_generator.js');
const fs = require('fs').promises;

async function createRoboticsPresentation() {
    try {
        // Load content and visual description
        const content = JSON.parse(await fs.readFile('robotics_in_medicine_content.json', 'utf8'));
        const visualDescription = await fs.readFile('visual_description.md', 'utf8');

        // Basic parsing of the visual description to extract some styling
        // (This is a simplified approach for demonstration)
        const useDarkMode = visualDescription.includes("dark background");
        const colorScheme = useDarkMode ? 'modern' : 'professional';

        const generator = new EnhancedPptxGenerator({
            colorScheme: colorScheme,
            author: 'AI Assistant',
            company: 'Slidy-presto',
            subject: 'Robotics in Medicine',
            title: 'The Rise of Medical Robotics',
        });

        const presentationData = {
            slides: {
                title: {
                    title: content.title,
                    subtitle: 'A Revolution in Healthcare',
                },
                ...content.slides.reduce((acc, slide, index) => {
                    acc[`slide_${index + 1}`] = {
                        title: slide.title,
                        content: slide.points.join('\n\n')
                    };
                    return acc;
                }, {})
            }
        };

        await generator.generatePresentation(presentationData, 'Robotics_in_Medicine.pptx');

    } catch (error) {
        console.error('Error generating presentation:', error);
    }
}

createRoboticsPresentation();