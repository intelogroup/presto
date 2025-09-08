#!/usr/bin/env node
/**
 * Battle Testing Suite for Dynamic Presentation Generator
 * 
 * Comprehensive testing of various design requests and edge cases
 * to ensure the generator can handle real-world scenarios robustly.
 */

const DynamicPresentationGenerator = require('../core/dynamic_presentation_generator');
const fs = require('fs').promises;
const path = require('path');

class BattleTestSuite {
    constructor() {
        this.testResults = [];
        this.passedTests = 0;
        this.failedTests = 0;
        this.totalTests = 0;
    }

    async runTest(testName, testFunction, expectedOutcome = 'success') {
        this.totalTests++;
        console.log(`\n🎯 Running Test: ${testName}`);
        console.log('─'.repeat(50));

        const startTime = Date.now();
        let result = {
            name: testName,
            status: 'unknown',
            duration: 0,
            error: null,
            stats: null,
            expectedOutcome
        };

        try {
            const testResult = await testFunction();
            const duration = Date.now() - startTime;
            
            result.status = 'passed';
            result.duration = duration;
            result.stats = testResult;
            
            this.passedTests++;
            console.log(`✅ PASSED: ${testName} (${duration}ms)`);
            
            if (testResult.slideCount) {
                console.log(`📊 Generated ${testResult.slideCount} slides`);
            }
            
        } catch (error) {
            const duration = Date.now() - startTime;
            
            if (expectedOutcome === 'error') {
                result.status = 'passed';
                this.passedTests++;
                console.log(`✅ PASSED: ${testName} - Expected error caught: ${error.message}`);
            } else {
                result.status = 'failed';
                result.error = error.message;
                this.failedTests++;
                console.log(`❌ FAILED: ${testName} - ${error.message}`);
            }
            
            result.duration = duration;
        }

        this.testResults.push(result);
        return result;
    }

    // Test 1: Business Presentation Request
    async testBusinessPresentation() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'professional',
            layout: 'LAYOUT_16x9'
        });

        const businessData = {
            title: 'Q4 Business Review 2024',
            subtitle: 'Performance Analysis and Strategic Planning',
            author: 'Executive Team',
            slides: {
                title: {
                    title: 'Q4 Business Review 2024',
                    subtitle: 'Performance Analysis • Strategic Planning • Future Outlook',
                    author: 'Executive Leadership Team'
                },
                
                executive_summary: {
                    title: 'Executive Summary',
                    content: 'Q4 2024 demonstrated exceptional performance across all business units with revenue growth of 28% year-over-year. Market expansion into three new regions contributed significantly to our success.',
                    images: [{ description: 'Growth trend visualization' }]
                },
                
                key_metrics: {
                    title: 'Key Performance Metrics',
                    chartData: {
                        values: [2800000, 3100000, 2950000, 3400000, 3600000, 3850000]
                    }
                },
                
                achievements: {
                    title: 'Major Achievements',
                    bullets: [
                        'Revenue increased 28% YoY to $3.85M in Q4',
                        'Customer satisfaction reached 94% (highest ever)',
                        'Successfully launched in APAC markets',
                        'Reduced operational costs by 15%',
                        'Team expansion: 45 new hires across departments',
                        'Product line diversification completed'
                    ]
                },
                
                market_analysis: {
                    title: 'Market Position Analysis',
                    leftContent: 'Competitive Advantages:\n\n• Market leadership in core segments\n• Superior product quality ratings\n• Strong brand recognition (top 3)\n• Efficient supply chain operations\n• Experienced management team\n• Robust financial position',
                    rightContent: 'Growth Opportunities:\n\n• Emerging market expansion\n• Digital transformation services\n• Strategic partnership opportunities\n• Product innovation pipeline\n• Acquisition targets identified\n• Sustainability initiatives'
                },
                
                strategy_2025: {
                    title: 'Strategic Initiatives 2025',
                    icons: [
                        { symbol: '🎯', label: 'Market Expansion' },
                        { symbol: '💡', label: 'Innovation Hub' },
                        { symbol: '🤝', label: 'Strategic Partnerships' },
                        { symbol: '📈', label: 'Revenue Growth' },
                        { symbol: '🌱', label: 'Sustainability' },
                        { symbol: '👥', label: 'Talent Acquisition' }
                    ]
                }
            }
        };

        return await generator.generatePresentation(businessData, 'battle_tests/business_presentation.pptx');
    }

    // Test 2: Educational Content Request
    async testEducationalPresentation() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'modern',
            layout: 'LAYOUT_16x9'
        });

        const educationalData = {
            title: 'Introduction to Machine Learning',
            subtitle: 'Fundamentals and Applications',
            author: 'Dr. AI Assistant',
            slides: {
                title: {
                    title: 'Introduction to Machine Learning',
                    subtitle: 'Fundamentals • Algorithms • Real-World Applications',
                    author: 'Dr. AI Assistant, Computer Science Department'
                },
                
                overview: {
                    title: 'What is Machine Learning?',
                    content: 'Machine Learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It uses statistical techniques to give computers the ability to "learn" from data.',
                    images: [{ description: 'ML concept diagram' }]
                },
                
                types: {
                    title: 'Types of Machine Learning',
                    icons: [
                        { symbol: '📚', label: 'Supervised Learning' },
                        { symbol: '🔍', label: 'Unsupervised Learning' },
                        { symbol: '🎯', label: 'Reinforcement Learning' },
                        { symbol: '🔄', label: 'Deep Learning' }
                    ]
                },
                
                algorithms: {
                    title: 'Common Algorithms',
                    bullets: [
                        'Linear Regression - Predicts continuous values',
                        'Decision Trees - Easy to interpret classification',
                        'Random Forest - Ensemble of decision trees',
                        'Support Vector Machines - Effective for classification',
                        'Neural Networks - Mimics human brain processing',
                        'K-Means Clustering - Groups similar data points'
                    ]
                },
                
                applications: {
                    title: 'Real-World Applications',
                    leftContent: 'Current Applications:\n\n• Image recognition in healthcare\n• Recommendation systems (Netflix, Amazon)\n• Fraud detection in banking\n• Natural language processing\n• Autonomous vehicles\n• Predictive maintenance',
                    rightContent: 'Emerging Applications:\n\n• Drug discovery acceleration\n• Climate change modeling\n• Personalized education\n• Smart city optimization\n• Agricultural optimization\n• Space exploration assistance'
                },
                
                performance: {
                    title: 'Model Performance Metrics',
                    chartData: {
                        values: [85, 92, 78, 96, 88, 94, 82, 90]
                    }
                }
            }
        };

        return await generator.generatePresentation(educationalData, 'battle_tests/educational_presentation.pptx');
    }

    // Test 3: Creative Agency Portfolio
    async testCreativePresentation() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'creative',
            layout: 'LAYOUT_16x9'
        });

        const creativeData = {
            title: 'Creative Agency Portfolio',
            subtitle: 'Innovative Design Solutions',
            author: 'Creative Minds Studio',
            slides: {
                title: {
                    title: 'Creative Minds Studio',
                    subtitle: 'Innovative Design Solutions • Brand Identity • Digital Experiences',
                    author: 'Portfolio 2024'
                },
                
                philosophy: {
                    title: 'Our Creative Philosophy',
                    content: 'We believe in the power of design to transform businesses and create meaningful connections. Our approach combines strategic thinking with bold creativity to deliver solutions that not only look amazing but drive real results.',
                    images: [{ description: 'Creative process visualization' }]
                },
                
                services: {
                    title: 'What We Do',
                    icons: [
                        { symbol: '🎨', label: 'Brand Identity' },
                        { symbol: '💻', label: 'Web Design' },
                        { symbol: '📱', label: 'Mobile Apps' },
                        { symbol: '📹', label: 'Video Production' },
                        { symbol: '📸', label: 'Photography' },
                        { symbol: '✨', label: 'UI/UX Design' },
                        { symbol: '📈', label: 'Marketing Design' },
                        { symbol: '🏷️', label: 'Packaging Design' },
                        { symbol: '🎪', label: 'Event Design' }
                    ]
                },
                
                process: {
                    title: 'Our Creative Process',
                    bullets: [
                        'Discovery - Understanding your vision and goals',
                        'Strategy - Developing the creative direction',
                        'Ideation - Brainstorming innovative concepts',
                        'Design - Creating stunning visual solutions',
                        'Refinement - Perfecting every detail',
                        'Delivery - Bringing your vision to life'
                    ]
                },
                
                achievements: {
                    title: 'Awards & Recognition',
                    leftContent: 'Recent Awards:\n\n• Design Excellence Award 2024\n• Best Digital Campaign - Marketing Awards\n• Innovation in Web Design - WebbyX\n• Brand Identity of the Year\n• Creative Agency of the Year\n• Client Satisfaction Award (5 years)',
                    rightContent: 'Client Testimonials:\n\n"Exceptional creativity and professionalism"\n- Tech Startup CEO\n\n"Transformed our brand completely"\n- Retail Chain Director\n\n"Best design partner we\'ve worked with"\n- Non-profit Organization'
                },
                
                portfolio_metrics: {
                    title: 'Portfolio Impact',
                    chartData: {
                        values: [150, 180, 220, 280, 320, 380, 420, 480]
                    }
                }
            }
        };

        return await generator.generatePresentation(creativeData, 'battle_tests/creative_presentation.pptx');
    }

    // Test 4: Technical/Scientific Presentation
    async testTechnicalPresentation() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'minimal',
            layout: 'LAYOUT_16x9'
        });

        const technicalData = {
            title: 'Quantum Computing Research Progress',
            subtitle: 'Recent Breakthroughs and Future Directions',
            author: 'Quantum Research Lab',
            slides: {
                title: {
                    title: 'Quantum Computing Research Progress',
                    subtitle: 'Recent Breakthroughs • Technical Challenges • Future Directions',
                    author: 'Quantum Research Laboratory'
                },
                
                abstract: {
                    title: 'Research Abstract',
                    content: 'Our research focuses on developing fault-tolerant quantum algorithms for practical applications. We have achieved significant improvements in quantum error correction rates and demonstrated quantum advantage in specific computational problems. This presentation outlines our methodology, results, and implications for the future of quantum computing.',
                    images: [{ description: 'Quantum circuit diagram' }]
                },
                
                methodology: {
                    title: 'Research Methodology',
                    bullets: [
                        'Quantum error correction protocol development',
                        'Fidelity measurements using process tomography',
                        'Benchmarking against classical algorithms',
                        'Statistical analysis of quantum gate operations',
                        'Noise characterization in quantum systems',
                        'Scalability testing with increasing qubit counts'
                    ]
                },
                
                results_comparison: {
                    title: 'Results: Quantum vs Classical',
                    leftContent: 'Classical Computing:\n\n• Exponential time complexity\n• Limited by Moore\'s Law\n• Deterministic outcomes\n• Well-established algorithms\n• Current performance ceiling\n• Energy consumption scaling',
                    rightContent: 'Quantum Computing:\n\n• Polynomial time for specific problems\n• Quantum parallelism advantages\n• Probabilistic but powerful\n• Novel algorithmic approaches\n• Exponential performance potential\n• Quantum efficiency benefits'
                },
                
                experimental_data: {
                    title: 'Experimental Results',
                    chartData: {
                        values: [0.65, 0.72, 0.78, 0.84, 0.89, 0.92, 0.95, 0.97]
                    }
                },
                
                applications: {
                    title: 'Potential Applications',
                    icons: [
                        { symbol: '🔬', label: 'Drug Discovery' },
                        { symbol: '🔐', label: 'Cryptography' },
                        { symbol: '📊', label: 'Optimization' },
                        { symbol: '🧬', label: 'Molecular Simulation' },
                        { symbol: '💰', label: 'Financial Modeling' },
                        { symbol: '🌐', label: 'Network Analysis' }
                    ]
                },
                
                future_work: {
                    title: 'Future Research Directions',
                    content: 'Our next phase will focus on scaling quantum error correction to larger systems while maintaining high fidelity rates. We plan to investigate hybrid quantum-classical algorithms for near-term quantum devices and explore applications in machine learning and optimization problems. Collaboration with industry partners will help translate theoretical advances into practical quantum computing solutions.'
                }
            }
        };

        return await generator.generatePresentation(technicalData, 'battle_tests/technical_presentation.pptx');
    }

    // Test 5: Stress Test - Very Long Content
    async testStressLongContent() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'professional',
            enableValidation: true,
            enableFallbacks: true
        });

        const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(100);
        const veryLongText = 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '.repeat(500);

        const stressData = {
            title: 'Stress Test Presentation with Extremely Long Content',
            slides: {
                title: {
                    title: 'Stress Test for Long Content Handling',
                    subtitle: longText
                },
                
                very_long_content: {
                    title: 'Very Long Content Slide',
                    content: veryLongText
                },
                
                many_bullets: {
                    title: 'Many Bullet Points',
                    bullets: Array(50).fill('This is bullet point text that should be handled gracefully even when there are too many bullets')
                },
                
                many_icons: {
                    title: 'Many Icons',
                    icons: Array(20).fill().map((_, i) => ({ 
                        symbol: ['🎯', '⚡', '🛡️', '🎨', '📊'][i % 5], 
                        label: `Icon ${i + 1}` 
                    }))
                }
            }
        };

        return await generator.generatePresentation(stressData, 'battle_tests/stress_long_content.pptx');
    }

    // Test 6: Stress Test - Many Slides
    async testStressManySlides() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'modern',
            maxSlides: 25 // Limit to prevent excessive generation
        });

        const slides = {
            title: {
                title: 'Many Slides Stress Test',
                subtitle: 'Testing Generator with Multiple Slides'
            }
        };

        // Generate 30 slides (should be limited to 25)
        for (let i = 1; i <= 30; i++) {
            slides[`slide_${i}`] = {
                title: `Slide ${i}`,
                content: `This is the content for slide number ${i}. Each slide tests the generator's ability to handle multiple slides efficiently.`,
                bullets: [`Point 1 for slide ${i}`, `Point 2 for slide ${i}`, `Point 3 for slide ${i}`]
            };
        }

        const manySlideData = { title: 'Many Slides Test', slides };
        
        return await generator.generatePresentation(manySlideData, 'battle_tests/stress_many_slides.pptx');
    }

    // Test 7: Edge Case - Minimal Data
    async testMinimalData() {
        const generator = new DynamicPresentationGenerator();

        const minimalData = {
            title: 'Minimal'
        };

        return await generator.generatePresentation(minimalData, 'battle_tests/minimal_data.pptx');
    }

    // Test 8: Edge Case - Empty/Invalid Data
    async testInvalidData() {
        const generator = new DynamicPresentationGenerator({
            enableValidation: true,
            enableFallbacks: false
        });

        const invalidData = {
            title: null,
            slides: {
                invalid: {
                    title: undefined,
                    content: null,
                    bullets: 'not an array',
                    icons: { invalid: 'structure' }
                }
            }
        };

        return await generator.generatePresentation(invalidData, 'battle_tests/invalid_data.pptx');
    }

    // Test 9: Mixed Content Complexity
    async testMixedComplexContent() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'creative'
        });

        const complexData = {
            title: 'Complex Mixed Content Presentation',
            slides: {
                title: {
                    title: 'Complex Content Test',
                    subtitle: 'Testing All Features Simultaneously'
                },
                
                everything: {
                    title: 'Kitchen Sink Slide',
                    content: 'This slide contains every type of content to test the generator\'s ability to handle complex layouts.',
                    bullets: ['Bullet point 1', 'Bullet point 2', 'Bullet point 3'],
                    images: [{ description: 'Test image' }],
                    icons: [
                        { symbol: '🎯', label: 'Target' },
                        { symbol: '⚡', label: 'Speed' }
                    ],
                    chartData: {
                        values: [10, 20, 30, 40, 50]
                    }
                },
                
                two_column_complex: {
                    title: 'Complex Two-Column Layout',
                    leftContent: 'Left side with bullets:\n• Point A\n• Point B\n• Point C\n\nAnd regular text content that flows naturally within the column constraints.',
                    rightContent: 'Right side with different content:\n\n1. Numbered list item\n2. Another numbered item\n3. Final numbered item\n\nPlus additional explanatory text.'
                }
            }
        };

        return await generator.generatePresentation(complexData, 'battle_tests/mixed_complex.pptx');
    }

    // Test 10: Performance Test
    async testPerformance() {
        const generator = new DynamicPresentationGenerator();

        const performanceData = {
            title: 'Performance Test Presentation',
            slides: {
                title: { title: 'Performance Test', subtitle: 'Speed and Efficiency Testing' }
            }
        };

        // Add 10 content slides
        for (let i = 1; i <= 10; i++) {
            performanceData.slides[`perf_${i}`] = {
                title: `Performance Slide ${i}`,
                content: `Content for performance testing slide ${i}. This tests generation speed and memory usage.`,
                chartData: { values: Array(8).fill().map(() => Math.floor(Math.random() * 100)) }
            };
        }

        const startTime = Date.now();
        const result = await generator.generatePresentation(performanceData, 'battle_tests/performance_test.pptx');
        const totalTime = Date.now() - startTime;

        result.totalTime = totalTime;
        result.slidesPerSecond = (result.slideCount / totalTime * 1000).toFixed(2);

        return result;
    }

    // Main battle test execution
    async runBattleTests() {
        console.log('🚀 DYNAMIC PRESENTATION GENERATOR - BATTLE TESTING SUITE');
        console.log('═'.repeat(70));
        console.log(`Starting comprehensive battle tests at ${new Date().toISOString()}`);
        
        // Create battle_tests directory
        try {
            await fs.mkdir('battle_tests', { recursive: true });
        } catch (error) {
            // Directory might already exist
        }

        // Run all tests
        await this.runTest('Business Presentation', () => this.testBusinessPresentation());
        await this.runTest('Educational Content', () => this.testEducationalPresentation());
        await this.runTest('Creative Portfolio', () => this.testCreativePresentation());
        await this.runTest('Technical/Scientific', () => this.testTechnicalPresentation());
        await this.runTest('Stress Test - Long Content', () => this.testStressLongContent());
        await this.runTest('Stress Test - Many Slides', () => this.testStressManySlides());
        await this.runTest('Edge Case - Minimal Data', () => this.testMinimalData());
        await this.runTest('Edge Case - Invalid Data', () => this.testInvalidData(), 'error');
        await this.runTest('Mixed Complex Content', () => this.testMixedComplexContent());
        await this.runTest('Performance Test', () => this.testPerformance());

        // Generate final report
        this.generateBattleReport();
    }

    generateBattleReport() {
        console.log('\n🏆 BATTLE TEST RESULTS');
        console.log('═'.repeat(70));
        
        const successRate = ((this.passedTests / this.totalTests) * 100).toFixed(1);
        
        console.log(`📊 Overall Results:`);
        console.log(`   Total Tests: ${this.totalTests}`);
        console.log(`   Passed: ${this.passedTests}`);
        console.log(`   Failed: ${this.failedTests}`);
        console.log(`   Success Rate: ${successRate}%`);
        
        const avgDuration = this.testResults.reduce((sum, test) => sum + test.duration, 0) / this.testResults.length;
        console.log(`   Average Duration: ${avgDuration.toFixed(0)}ms`);
        
        console.log('\n📋 Detailed Results:');
        this.testResults.forEach((test, index) => {
            const status = test.status === 'passed' ? '✅' : '��';
            const duration = `${test.duration}ms`;
            const slides = test.stats?.slideCount ? `(${test.stats.slideCount} slides)` : '';
            
            console.log(`   ${index + 1}. ${status} ${test.name} - ${duration} ${slides}`);
            
            if (test.error) {
                console.log(`      Error: ${test.error}`);
            }
            
            if (test.stats?.slidesPerSecond) {
                console.log(`      Performance: ${test.stats.slidesPerSecond} slides/second`);
            }
        });
        
        console.log('\n🎯 Test Coverage:');
        console.log('   ✅ Business presentations');
        console.log('   ✅ Educational content');
        console.log('   ✅ Creative portfolios');
        console.log('   ✅ Technical/scientific documents');
        console.log('   ✅ Stress testing (long content, many slides)');
        console.log('   ✅ Edge cases (minimal/invalid data)');
        console.log('   ✅ Mixed complex content');
        console.log('   ✅ Performance benchmarking');
        
        console.log('\n📁 Generated Test Files:');
        console.log('   battle_tests/business_presentation.pptx');
        console.log('   battle_tests/educational_presentation.pptx');
        console.log('   battle_tests/creative_presentation.pptx');
        console.log('   battle_tests/technical_presentation.pptx');
        console.log('   battle_tests/stress_long_content.pptx');
        console.log('   battle_tests/stress_many_slides.pptx');
        console.log('   battle_tests/minimal_data.pptx');
        console.log('   battle_tests/mixed_complex.pptx');
        console.log('   battle_tests/performance_test.pptx');
        
        console.log(`\n🎉 Battle testing completed! Success rate: ${successRate}%`);
        
        if (this.failedTests === 0) {
            console.log('🏆 Perfect score! All tests passed!');
        } else {
            console.log(`��️  ${this.failedTests} test(s) failed - review results above`);
        }
    }
}

// Export for use in other modules
module.exports = BattleTestSuite;

// Run battle tests if called directly
if (require.main === module) {
    const battleTest = new BattleTestSuite();
    battleTest.runBattleTests().catch(console.error);
}
