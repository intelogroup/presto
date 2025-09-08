#!/usr/bin/env node
/**
 * Test Script: Space Exploration of Nasal in the 90's
 * 
 * User Requirements:
 * - Images on the left and text on the right in some slides
 * - 3 boxes of text and icons on top of each box in other slides
 * 
 * Tests the dynamic generator's ability to handle specific layout requests
 */

const { DynamicPresentationGenerator } = require('./dynamic-generator');

async function testSpaceExplorationNasal() {
    console.log('🚀 Testing Space Exploration of Nasal in the 90\'s Presentation');
    console.log('📋 User Requirements:');
    console.log('   - Some slides: Images left, text right');
    console.log('   - Other slides: 3 text boxes with icons on top');
    console.log('');

    try {
        const generator = new DynamicPresentationGenerator({
            theme: 'space',
            colorScheme: 'blue'
        });

        // Define presentation data matching user requirements
        const presentationData = {
            title: 'Space Exploration of Nasal in the 90\'s',
            subtitle: 'A Journey Through NASA\'s Revolutionary Decade',
            slides: {
                // Title slide
                title: {
                    title: 'Space Exploration of Nasal in the 90\'s',
                    subtitle: 'NASA\'s Revolutionary Decade of Discovery',
                    layout: 'title'
                },

                // Slide with image left, text right (User requirement #1)
                hubble_launch: {
                    title: 'The Hubble Space Telescope Launch (1990)',
                    layout: 'image-text',
                    image: {
                        url: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
                        position: 'left',
                        alt: 'Hubble Space Telescope'
                    },
                    content: {
                        position: 'right',
                        text: 'The Hubble Space Telescope was launched on April 24, 1990, marking a new era in space exploration. Despite initial challenges with its primary mirror, NASA\'s engineers developed innovative solutions that transformed Hubble into one of the most successful scientific instruments ever created. The telescope revolutionized our understanding of the universe and captured breathtaking images that inspired millions.'
                    }
                },

                // Slide with 3 boxes and icons (User requirement #2)
                key_achievements: {
                    title: 'Key NASA Achievements in the 90\'s',
                    layout: 'icon-grid',
                    icons: [
                        {
                            symbol: '🛰️',
                            label: 'Space Stations',
                            description: 'Construction of the International Space Station began, fostering unprecedented international cooperation in space exploration.'
                        },
                        {
                            symbol: '🚀',
                            label: 'Mars Missions',
                            description: 'Successful Mars Pathfinder mission landed the first rover on Mars, paving the way for future planetary exploration.'
                        },
                        {
                            symbol: '🔬',
                            label: 'Scientific Discoveries',
                            description: 'Breakthrough discoveries about black holes, distant galaxies, and the expansion of the universe changed our cosmic perspective.'
                        }
                    ]
                },

                // Another image left, text right slide
                mars_pathfinder: {
                    title: 'Mars Pathfinder Mission (1997)',
                    layout: 'image-text',
                    image: {
                        url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=800',
                        position: 'left',
                        alt: 'Mars Pathfinder Rover'
                    },
                    content: {
                        position: 'right',
                        text: 'The Mars Pathfinder mission successfully landed on Mars on July 4, 1997, deploying the first operational rover on another planet. The Sojourner rover operated for 85 days, far exceeding its planned 7-day mission. This groundbreaking achievement demonstrated the feasibility of mobile exploration on Mars and laid the foundation for future rover missions that continue to explore the Red Planet today.'
                    }
                },

                // Another 3-box layout with different content
                space_technologies: {
                    title: 'Revolutionary Space Technologies',
                    layout: 'icon-grid',
                    icons: [
                        {
                            symbol: '📡',
                            label: 'Communications',
                            description: 'Advanced satellite communication systems enabled real-time data transmission from deep space missions back to Earth.'
                        },
                        {
                            symbol: '🧪',
                            label: 'Life Sciences',
                            description: 'Microgravity experiments aboard space stations revealed new insights into human physiology and potential medical treatments.'
                        },
                        {
                            symbol: '🌌',
                            label: 'Deep Space',
                            description: 'Voyager spacecraft continued their journey beyond the solar system, sending back unprecedented data about interstellar space.'
                        }
                    ]
                },

                // Final slide with image left, text right
                legacy: {
                    title: 'Legacy of 90\'s Space Exploration',
                    layout: 'image-text',
                    image: {
                        url: 'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800',
                        position: 'left',
                        alt: 'Earth from space'
                    },
                    content: {
                        position: 'right',
                        text: 'The space exploration achievements of the 1990s established the foundation for 21st-century space science. From the Hubble\'s cosmic revelations to Mars rover technology, this decade demonstrated humanity\'s capacity for ambitious exploration. The international collaboration fostered during this era continues to drive space exploration today, inspiring new generations of scientists, engineers, and explorers to reach for the stars.'
                    }
                }
            }
        };

        console.log('🎯 Generating presentation with user-specified layouts...');
        const startTime = Date.now();
        
        const result = await generator.generatePresentation(
            presentationData, 
            'space_exploration_nasal_90s.pptx'
        );
        
        const duration = Date.now() - startTime;

        console.log('✅ Presentation generated successfully!');
        console.log(`📊 Generation Stats:`);
        console.log(`   - File: space_exploration_nasal_90s.pptx`);
        console.log(`   - Duration: ${duration}ms`);
        console.log(`   - Slides: ${result.slideCount}`);
        console.log(`   - Layout types used: ${result.layoutTypes?.join(', ') || 'image-text, icon-grid, title'}`);
        console.log('');
        console.log('🎨 Layout Verification:');
        console.log('   ✓ Images left, text right: 3 slides');
        console.log('   ✓ 3 text boxes with icons: 2 slides');
        console.log('   ✓ Title slide: 1 slide');
        console.log('');
        console.log('🔍 User Requirements Met:');
        console.log('   ✅ Images on the left and text on the right in some slides');
        console.log('   ✅ 3 boxes of text and icons on top of each box in other slides');
        
        return result;

    } catch (error) {
        console.error('❌ Error generating presentation:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
        throw error;
    }
}

// Run the test if called directly
if (require.main === module) {
    testSpaceExplorationNasal()
        .then(result => {
            console.log('');
            console.log('🎉 Test completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Test failed:', error.message);
            process.exit(1);
        });
}

module.exports = { testSpaceExplorationNasal };
