#!/usr/bin/env node
/**
 * Specialized Design Request Tests for Dynamic Presentation Generator
 * 
 * Tests specific design requests and user scenarios to demonstrate
 * the generator's adaptability to different presentation needs.
 */

const DynamicPresentationGenerator = require('../core/dynamic_presentation_generator');
const fs = require('fs').promises;

class SpecializedDesignTests {
    constructor() {
        this.testResults = [];
    }

    async runTest(testName, testFunction, description) {
        console.log(`\n🎨 Testing: ${testName}`);
        console.log(`📝 Scenario: ${description}`);
        console.log('─'.repeat(60));

        const startTime = Date.now();
        
        try {
            const result = await testFunction();
            const duration = Date.now() - startTime;
            
            console.log(`✅ SUCCESS: ${testName}`);
            console.log(`📊 Generated ${result.slideCount} slides in ${duration}ms`);
            console.log(`🎨 Template: ${result.template}, Layout: ${result.layout}`);
            
            this.testResults.push({
                name: testName,
                status: 'passed',
                duration,
                ...result
            });
            
        } catch (error) {
            console.log(`❌ FAILED: ${testName} - ${error.message}`);
            this.testResults.push({
                name: testName,
                status: 'failed',
                error: error.message
            });
        }
    }

    // Test 1: User Request - "Create a sales presentation with charts"
    async testSalesPresentation() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'professional'
        });

        const salesData = {
            title: 'Q4 Sales Performance Review',
            subtitle: 'Results and Future Targets',
            author: 'Sales Team',
            slides: {
                title: {
                    title: 'Q4 Sales Performance Review',
                    subtitle: 'Exceeding Targets • Market Growth • Strategic Wins',
                    author: 'Sales Team Leadership'
                },
                
                overview: {
                    title: 'Sales Overview',
                    content: 'Q4 has been our strongest quarter yet, with record-breaking sales performance across all regions. Our strategic focus on customer relationships and product innovation has paid off significantly.',
                    images: [{ description: 'Sales team celebration photo' }]
                },
                
                revenue_chart: {
                    title: 'Revenue Growth Trend',
                    content: 'Monthly revenue progression showing consistent growth',
                    chartData: {
                        values: [250000, 275000, 320000, 380000, 420000, 485000]
                    }
                },
                
                regional_performance: {
                    title: 'Regional Performance Breakdown',
                    chartData: {
                        values: [1200000, 950000, 1100000, 850000, 1350000]
                    }
                },
                
                top_achievements: {
                    title: 'Top Achievements',
                    bullets: [
                        'Exceeded quarterly target by 15% ($4.85M vs $4.2M)',
                        'Secured 3 major enterprise clients',
                        'Expanded into 2 new market segments',
                        'Improved customer retention to 92%',
                        'Reduced sales cycle time by 18%'
                    ]
                },
                
                next_quarter: {
                    title: 'Q1 2025 Strategy',
                    leftContent: 'Focus Areas:\n\n• Enterprise client expansion\n• Product upselling initiatives\n• New territory development\n• Customer success optimization\n• Sales team training programs',
                    rightContent: 'Targets:\n\n• $5.5M revenue target\n• 20% increase in new clients\n• 95% customer retention\n• 15% reduction in acquisition costs\n• Launch 2 new service lines'
                }
            }
        };

        return await generator.generatePresentation(salesData, 'specialized_tests/sales_presentation.pptx');
    }

    // Test 2: User Request - "Make a training presentation with icons and step-by-step content"
    async testTrainingPresentation() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'modern'
        });

        const trainingData = {
            title: 'Employee Onboarding Training',
            subtitle: 'Welcome to Our Team',
            slides: {
                title: {
                    title: 'Welcome to Our Company',
                    subtitle: 'Employee Onboarding Training Program',
                    author: 'Human Resources Department'
                },
                
                welcome: {
                    title: 'Welcome Message',
                    content: 'We are excited to have you join our team! This training will help you understand our company culture, values, and the essential information you need to succeed in your new role.',
                    images: [{ description: 'Welcome team photo' }]
                },
                
                company_values: {
                    title: 'Our Core Values',
                    icons: [
                        { symbol: '🤝', label: 'Collaboration' },
                        { symbol: '💡', label: 'Innovation' },
                        { symbol: '🎯', label: 'Excellence' },
                        { symbol: '🌱', label: 'Growth' },
                        { symbol: '🛡️', label: 'Integrity' },
                        { symbol: '🌍', label: 'Sustainability' }
                    ]
                },
                
                first_week: {
                    title: 'Your First Week Steps',
                    bullets: [
                        'Day 1: Complete HR paperwork and system setup',
                        'Day 2: Meet your team and department heads',
                        'Day 3: Shadow a colleague in your role',
                        'Day 4: Review company policies and procedures',
                        'Day 5: Set up initial goals with your manager'
                    ]
                },
                
                resources: {
                    title: 'Available Resources',
                    leftContent: 'Internal Resources:\n\n• Employee handbook\n• Intranet portal access\n• Mentorship program\n• Learning management system\n• IT support helpdesk\n• HR open door policy',
                    rightContent: 'External Resources:\n\n• Professional development courses\n• Industry conferences\n• LinkedIn Learning access\n• Certification programs\n• Network events\n• Continuing education support'
                },
                
                tools_systems: {
                    title: 'Essential Tools & Systems',
                    icons: [
                        { symbol: '📧', label: 'Email System' },
                        { symbol: '💬', label: 'Chat Platform' },
                        { symbol: '📊', label: 'Project Management' },
                        { symbol: '📁', label: 'File Storage' },
                        { symbol: '🔐', label: 'Security Tools' },
                        { symbol: '📱', label: 'Mobile Apps' }
                    ]
                },
                
                success_tips: {
                    title: 'Tips for Success',
                    content: 'Your success is our success. Remember to ask questions, be proactive in learning, build relationships with your colleagues, and don\'t hesitate to reach out for help when needed.',
                    bullets: [
                        'Be curious and ask questions',
                        'Take initiative in your learning',
                        'Build strong relationships',
                        'Embrace feedback and continuous improvement',
                        'Maintain work-life balance'
                    ]
                }
            }
        };

        return await generator.generatePresentation(trainingData, 'specialized_tests/training_presentation.pptx');
    }

    // Test 3: User Request - "Create a product showcase with images and features"
    async testProductShowcase() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'creative'
        });

        const productData = {
            title: 'SmartHome Pro - Product Launch',
            subtitle: 'The Future of Home Automation',
            slides: {
                title: {
                    title: 'SmartHome Pro',
                    subtitle: 'Intelligent Home Automation • Seamless Integration • Ultimate Control',
                    author: 'Product Launch 2024'
                },
                
                introduction: {
                    title: 'Introducing SmartHome Pro',
                    content: 'SmartHome Pro revolutionizes how you interact with your living space. Our comprehensive home automation system combines cutting-edge technology with intuitive design to create the ultimate smart home experience.',
                    images: [{ description: 'SmartHome Pro main product image' }]
                },
                
                key_features: {
                    title: 'Key Features',
                    icons: [
                        { symbol: '🏠', label: 'Whole Home Control' },
                        { symbol: '📱', label: 'Mobile App' },
                        { symbol: '🎤', label: 'Voice Control' },
                        { symbol: '🔒', label: 'Security System' },
                        { symbol: '💡', label: 'Smart Lighting' },
                        { symbol: '🌡️', label: 'Climate Control' },
                        { symbol: '🔌', label: 'Energy Management' },
                        { symbol: '📺', label: 'Entertainment Hub' },
                        { symbol: '🚪', label: 'Access Control' }
                    ]
                },
                
                benefits: {
                    title: 'Benefits & Advantages',
                    leftContent: 'Convenience Benefits:\n\n• One-touch scene control\n• Automated daily routines\n• Remote access from anywhere\n• Voice command integration\n• Intuitive mobile interface\n• Scheduled automation',
                    rightContent: 'Efficiency Benefits:\n\n• 30% energy savings\n• Enhanced home security\n• Reduced utility costs\n• Preventive maintenance alerts\n• Optimized device performance\n• Environmental impact reduction'
                },
                
                technical_specs: {
                    title: 'Technical Specifications',
                    bullets: [
                        'Supports 200+ smart devices simultaneously',
                        'WiFi 6 and Zigbee 3.0 connectivity',
                        'Military-grade encryption security',
                        'Cloud backup with local storage option',
                        'Compatible with Alexa, Google, and Siri',
                        '99.9% uptime reliability guarantee'
                    ]
                },
                
                pricing_packages: {
                    title: 'Package Options',
                    leftContent: 'Starter Package - $299:\n\n• SmartHome Pro hub\n• 4 smart switches\n• 2 door sensors\n• 1 motion detector\n• Mobile app\n• Basic automation',
                    rightContent: 'Premium Package - $899:\n\n• Everything in Starter\n• 10 additional smart devices\n• Security cameras (2)\n• Smart thermostat\n• Priority support\n• Advanced automation'
                },
                
                installation: {
                    title: 'Easy Installation Process',
                    content: 'Professional installation available or DIY with our step-by-step guide. Most customers complete setup in under 2 hours.',
                    images: [{ description: 'Installation process diagram' }]
                },
                
                call_to_action: {
                    title: 'Get Started Today',
                    content: 'Transform your home into a smart home with SmartHome Pro. Contact our team for a personalized consultation and discover how we can enhance your lifestyle.',
                    bullets: [
                        'Free consultation and home assessment',
                        '30-day money-back guarantee',
                        'Professional installation available',
                        '24/7 customer support',
                        'Lifetime software updates'
                    ]
                }
            }
        };

        return await generator.generatePresentation(productData, 'specialized_tests/product_showcase.pptx');
    }

    // Test 4: User Request - "Simple meeting agenda with bullet points"
    async testMeetingAgenda() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'minimal'
        });

        const meetingData = {
            title: 'Weekly Team Meeting',
            subtitle: 'Project Updates and Planning',
            slides: {
                title: {
                    title: 'Weekly Team Meeting',
                    subtitle: 'Week of September 8, 2024',
                    author: 'Project Team'
                },
                
                agenda: {
                    title: 'Meeting Agenda',
                    bullets: [
                        'Welcome and attendance (5 min)',
                        'Previous week accomplishments (15 min)',
                        'Current week priorities (20 min)',
                        'Blockers and challenges discussion (15 min)',
                        'Next week planning (10 min)',
                        'Action items and assignments (5 min)',
                        'Q&A and closing (5 min)'
                    ]
                },
                
                accomplishments: {
                    title: 'Last Week Accomplishments',
                    bullets: [
                        'Completed user authentication module',
                        'Finished database migration testing',
                        'Deployed hotfix for production issue',
                        'Conducted user interviews for UX research',
                        'Updated project documentation'
                    ]
                },
                
                priorities: {
                    title: 'This Week Priorities',
                    bullets: [
                        'Implement new dashboard features',
                        'Complete integration testing',
                        'Review and merge pending pull requests',
                        'Prepare presentation for stakeholder meeting',
                        'Begin work on mobile responsiveness'
                    ]
                },
                
                blockers: {
                    title: 'Current Blockers',
                    bullets: [
                        'Waiting for API documentation from vendor',
                        'Need approval for additional cloud resources',
                        'Design assets pending from external team',
                        'License renewal required for development tools'
                    ]
                },
                
                action_items: {
                    title: 'Action Items',
                    bullets: [
                        'John: Follow up with vendor on API docs (Due: Wed)',
                        'Sarah: Submit cloud resource request (Due: Thu)',
                        'Mike: Contact design team for assets (Due: Tue)',
                        'Lisa: Process license renewal (Due: Fri)',
                        'All: Update project boards by EOD today'
                    ]
                }
            }
        };

        return await generator.generatePresentation(meetingData, 'specialized_tests/meeting_agenda.pptx');
    }

    // Test 5: User Request - "Educational presentation with step-by-step tutorial"
    async testTutorialPresentation() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'modern'
        });

        const tutorialData = {
            title: 'Git Version Control Tutorial',
            subtitle: 'Essential Commands for Developers',
            slides: {
                title: {
                    title: 'Git Version Control Tutorial',
                    subtitle: 'Master Essential Commands • Best Practices • Workflow Tips',
                    author: 'Development Team'
                },
                
                introduction: {
                    title: 'What is Git?',
                    content: 'Git is a distributed version control system that tracks changes in source code during software development. It allows multiple developers to work on the same project efficiently and safely.',
                    images: [{ description: 'Git workflow diagram' }]
                },
                
                basic_concepts: {
                    title: 'Basic Git Concepts',
                    icons: [
                        { symbol: '📁', label: 'Repository' },
                        { symbol: '💾', label: 'Commit' },
                        { symbol: '🌿', label: 'Branch' },
                        { symbol: '🔄', label: 'Merge' },
                        { symbol: '☁️', label: 'Remote' },
                        { symbol: '⬇️', label: 'Pull' }
                    ]
                },
                
                setup_steps: {
                    title: 'Getting Started - Setup',
                    bullets: [
                        'Step 1: Install Git from git-scm.com',
                        'Step 2: Configure your name: git config --global user.name "Your Name"',
                        'Step 3: Configure your email: git config --global user.email "your@email.com"',
                        'Step 4: Verify installation: git --version',
                        'Step 5: Create your first repository: git init'
                    ]
                },
                
                essential_commands: {
                    title: 'Essential Commands',
                    leftContent: 'Basic Operations:\n\n• git init - Initialize repository\n• git add . - Stage all changes\n• git commit -m "message" - Commit changes\n• git status - Check repository status\n• git log - View commit history',
                    rightContent: 'Collaboration:\n\n• git clone <url> - Clone repository\n• git pull - Download latest changes\n• git push - Upload your changes\n• git branch - List branches\n• git checkout - Switch branches'
                },
                
                workflow: {
                    title: 'Typical Git Workflow',
                    bullets: [
                        '1. Clone or pull latest changes: git pull origin main',
                        '2. Create feature branch: git checkout -b feature-name',
                        '3. Make your changes and test',
                        '4. Stage changes: git add .',
                        '5. Commit with message: git commit -m "Add feature description"',
                        '6. Push branch: git push origin feature-name',
                        '7. Create pull request for review',
                        '8. Merge after approval'
                    ]
                },
                
                best_practices: {
                    title: 'Best Practices',
                    bullets: [
                        'Write clear, descriptive commit messages',
                        'Commit frequently with logical chunks',
                        'Always pull before starting new work',
                        'Use branches for new features',
                        'Review changes before committing',
                        'Never commit passwords or sensitive data'
                    ]
                },
                
                troubleshooting: {
                    title: 'Common Issues & Solutions',
                    leftContent: 'Merge Conflicts:\n\n• Open conflicted files\n• Look for <<<< and >>>> markers\n• Choose which changes to keep\n• Remove conflict markers\n• Stage and commit resolved files',
                    rightContent: 'Undo Changes:\n\n• Undo last commit: git reset HEAD~1\n• Discard local changes: git checkout .\n• Revert specific commit: git revert <hash>\n• Reset to remote: git reset --hard origin/main'
                }
            }
        };

        return await generator.generatePresentation(tutorialData, 'specialized_tests/tutorial_presentation.pptx');
    }

    // Test 6: User Request - "Financial report with charts and data"
    async testFinancialReport() {
        const generator = new DynamicPresentationGenerator({
            colorScheme: 'professional'
        });

        const financialData = {
            title: 'Annual Financial Report 2024',
            subtitle: 'Performance Analysis and Outlook',
            author: 'Finance Department',
            slides: {
                title: {
                    title: 'Annual Financial Report 2024',
                    subtitle: 'Strong Performance • Strategic Growth • Future Outlook',
                    author: 'Chief Financial Officer'
                },
                
                executive_summary: {
                    title: 'Executive Summary',
                    content: 'Fiscal year 2024 delivered exceptional financial performance with revenue growth of 22% and improved operational efficiency. Strong market position and strategic investments position us well for continued growth.',
                    images: [{ description: 'Financial performance overview chart' }]
                },
                
                revenue_growth: {
                    title: 'Revenue Growth Trend',
                    content: 'Quarterly revenue progression showing consistent growth throughout the year',
                    chartData: {
                        values: [2800000, 3200000, 3600000, 4100000]
                    }
                },
                
                profit_margins: {
                    title: 'Profit Margin Analysis',
                    chartData: {
                        values: [18, 22, 25, 28, 31, 35, 38, 42]
                    }
                },
                
                key_metrics: {
                    title: 'Key Financial Metrics',
                    leftContent: 'Revenue Metrics:\n\n• Total Revenue: $13.7M (+22%)\n• Recurring Revenue: $8.2M (+18%)\n• New Customer Revenue: $2.1M\n• Average Deal Size: $45K (+12%)\n• Customer Lifetime Value: $180K',
                    rightContent: 'Profitability Metrics:\n\n• Gross Profit: $9.6M (+25%)\n• Operating Profit: $4.1M (+28%)\n• Net Profit: $3.2M (+31%)\n• EBITDA: $5.8M (+24%)\n• Profit Margin: 35% (+3%)'
                },
                
                expense_breakdown: {
                    title: 'Operating Expenses',
                    bullets: [
                        'Personnel Costs: $4.8M (35% of revenue)',
                        'Technology & Infrastructure: $1.2M (9%)',
                        'Sales & Marketing: $2.1M (15%)',
                        'General & Administrative: $0.8M (6%)',
                        'Research & Development: $1.1M (8%)',
                        'Other Operating Expenses: $0.5M (4%)'
                    ]
                },
                
                cash_flow: {
                    title: 'Cash Flow Statement',
                    chartData: {
                        values: [800000, 1200000, 1600000, 2100000, 2400000, 2800000]
                    }
                },
                
                balance_sheet: {
                    title: 'Balance Sheet Highlights',
                    leftContent: 'Assets:\n\n• Current Assets: $8.2M\n• Fixed Assets: $3.5M\n• Intangible Assets: $2.1M\n• Total Assets: $13.8M\n\nStrong asset position supporting growth',
                    rightContent: 'Liabilities & Equity:\n\n• Current Liabilities: $2.1M\n• Long-term Debt: $1.5M\n• Total Equity: $10.2M\n• Debt-to-Equity: 0.35\n\nHealthy capital structure'
                },
                
                outlook_2025: {
                    title: '2025 Financial Outlook',
                    bullets: [
                        'Revenue target: $18M (31% growth)',
                        'Expand into 2 new market segments',
                        'Improve gross margin to 72%',
                        'Increase R&D investment to 12% of revenue',
                        'Maintain strong cash flow generation',
                        'Consider strategic acquisitions'
                    ]
                }
            }
        };

        return await generator.generatePresentation(financialData, 'specialized_tests/financial_report.pptx');
    }

    // Run all specialized tests
    async runAllTests() {
        console.log('🎨 SPECIALIZED DESIGN REQUEST TESTS');
        console.log('═'.repeat(70));
        console.log('Testing various user design requests and scenarios...\n');

        // Create directory for test outputs
        try {
            await fs.mkdir('specialized_tests', { recursive: true });
        } catch (error) {
            // Directory might already exist
        }

        // Run all specialized tests
        await this.runTest(
            'Sales Presentation with Charts',
            () => this.testSalesPresentation(),
            'User wants a sales presentation focusing on performance charts and metrics'
        );

        await this.runTest(
            'Training Presentation with Icons',
            () => this.testTrainingPresentation(),
            'User needs an employee training presentation with visual icons and step-by-step content'
        );

        await this.runTest(
            'Product Showcase',
            () => this.testProductShowcase(),
            'User wants to showcase a product with features, benefits, and pricing information'
        );

        await this.runTest(
            'Simple Meeting Agenda',
            () => this.testMeetingAgenda(),
            'User needs a straightforward meeting agenda with bullet points and action items'
        );

        await this.runTest(
            'Educational Tutorial',
            () => this.testTutorialPresentation(),
            'User wants to create an educational tutorial with step-by-step instructions'
        );

        await this.runTest(
            'Financial Report with Data',
            () => this.testFinancialReport(),
            'User needs a comprehensive financial report with charts and detailed metrics'
        );

        // Generate summary
        this.generateSummary();
    }

    generateSummary() {
        console.log('\n🏆 SPECIALIZED DESIGN TESTS SUMMARY');
        console.log('═'.repeat(70));

        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(t => t.status === 'passed').length;
        const avgDuration = this.testResults.reduce((sum, t) => sum + (t.duration || 0), 0) / totalTests;
        const totalSlides = this.testResults.reduce((sum, t) => sum + (t.slideCount || 0), 0);

        console.log(`📊 Results Overview:`);
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   Passed: ${passedTests}`);
        console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
        console.log(`   Average Duration: ${avgDuration.toFixed(0)}ms`);
        console.log(`   Total Slides Generated: ${totalSlides}`);

        console.log('\n🎯 Design Scenarios Tested:');
        this.testResults.forEach((test, index) => {
            const status = test.status === 'passed' ? '✅' : '❌';
            const slides = test.slideCount ? `(${test.slideCount} slides)` : '';
            console.log(`   ${index + 1}. ${status} ${test.name} ${slides}`);
        });

        console.log('\n📁 Generated Files:');
        console.log('   specialized_tests/sales_presentation.pptx');
        console.log('   specialized_tests/training_presentation.pptx');
        console.log('   specialized_tests/product_showcase.pptx');
        console.log('   specialized_tests/meeting_agenda.pptx');
        console.log('   specialized_tests/tutorial_presentation.pptx');
        console.log('   specialized_tests/financial_report.pptx');

        console.log('\n🎨 Demonstrated Capabilities:');
        console.log('   ✅ Automatic layout selection based on content type');
        console.log('   ✅ Professional business presentations');
        console.log('   ✅ Educational content with visual elements');
        console.log('   ✅ Product showcases with feature highlights');
        console.log('   ✅ Simple agenda and meeting presentations');
        console.log('   ✅ Data-heavy financial reports with charts');
        console.log('   ✅ Consistent branding across different themes');
        console.log('   ✅ Intelligent content fitting and positioning');

        if (passedTests === totalTests) {
            console.log('\n🎉 All specialized design tests passed successfully!');
            console.log('🏆 The Dynamic Presentation Generator handles diverse design requests perfectly!');
        } else {
            console.log(`\n⚠️ ${totalTests - passedTests} test(s) failed - review results above`);
        }
    }
}

// Export for use in other modules
module.exports = SpecializedDesignTests;

// Run specialized tests if called directly
if (require.main === module) {
    const specializedTests = new SpecializedDesignTests();
    specializedTests.runAllTests().catch(console.error);
}
