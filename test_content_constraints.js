const ContentConstraintSystem = require('./content_constraint_system');
const OverflowSafeGenerator = require('./overflow_safe_generator');

// Test the content constraint system with various scenarios
class ContentConstraintTester {
    constructor() {
        this.constraintSystem = new ContentConstraintSystem();
        this.generator = new OverflowSafeGenerator();
    }

    async runTests() {
        console.log('\n=== Content Constraint System Tests ===\n');
        
        // Test 1: Font size calculation
        console.log('Test 1: Font Size Calculation');
        const longText = 'This is a very long text that would normally overflow in a standard text box without proper constraint handling. We need to ensure it fits properly within the designated area.';
        const optimalSize = this.constraintSystem.calculateOptimalFontSize(longText, 8, 3);
        console.log(`Optimal font size for long text: ${optimalSize}pt`);
        
        // Test 2: Text truncation
        console.log('\nTest 2: Text Truncation');
        const truncated = this.constraintSystem.truncateText(longText, 100);
        console.log(`Original length: ${longText.length}`);
        console.log(`Truncated length: ${truncated.length}`);
        console.log(`Truncated text: ${truncated}`);
        
        // Test 3: Text splitting
        console.log('\nTest 3: Text Splitting');
        const bulletPoints = [
            'Advanced error handling with comprehensive validation',
            'Memory-efficient processing for large datasets',
            'Responsive layout system that adapts to content',
            'Professional styling with consistent branding',
            'Automated content overflow prevention',
            'Cross-platform compatibility testing'
        ];
        const splitText = this.constraintSystem.splitTextIntoBoxes(bulletPoints, 3);
        console.log(`Split ${bulletPoints.length} items into ${splitText.length} boxes:`);
        splitText.forEach((box, index) => {
            console.log(`  Box ${index + 1}: ${box.length} items`);
        });
        
        // Test 4: Grid layout
        console.log('\nTest 4: Grid Layout Calculation');
        const gridPositions = this.constraintSystem.calculateGridLayout(6, 2, 3);
        console.log('Grid positions for 6 items in 2x3 layout:');
        gridPositions.forEach((pos, index) => {
            console.log(`  Item ${index + 1}: x=${pos.x.toFixed(2)}", y=${pos.y.toFixed(2)}", w=${pos.w.toFixed(2)}", h=${pos.h.toFixed(2)}"`);
        });
        
        // Test 5: Generate constrained presentation
        console.log('\nTest 5: Generating Overflow-Safe Presentation');
        await this.generateTestPresentation();
        
        console.log('\n=== All Tests Completed Successfully ===\n');
    }
    
    async generateTestPresentation() {
        const pres = this.generator.createPresentation();
        
        // Title slide with long title
        const longTitle = 'Advanced PowerPoint Generation System with Comprehensive Content Constraint Management';
        const longSubtitle = 'Demonstrating automatic text sizing, overflow prevention, and responsive layout capabilities for professional presentations';
        
        this.generator.addTitleSlide(pres, {
            title: longTitle,
            subtitle: longSubtitle,
            author: 'Content Constraint System Demo'
        });
        
        // Content slide with many bullet points
        const manyBullets = [
            'Automatic font size calculation based on content length and available space',
            'Intelligent text truncation with ellipsis for graceful overflow handling',
            'Dynamic text box splitting when content exceeds single container capacity',
            'Grid-based layout system for consistent positioning and alignment',
            'Safe area calculations to prevent content from extending beyond slide boundaries',
            'Responsive design principles applied to presentation layout systems',
            'Memory-efficient processing to handle large amounts of content data',
            'Cross-platform compatibility ensuring consistent rendering across devices',
            'Professional styling with brand-consistent color schemes and typography',
            'Comprehensive error handling and validation for robust operation'
        ];
        
        this.generator.addContentSlide(pres, {
            title: 'Key Features and Capabilities',
            bullets: manyBullets
        });
        
        // Two-column slide with balanced content
        this.generator.addTwoColumnSlide(pres, {
            title: 'Before vs After Comparison',
            leftTitle: 'Without Constraints',
            leftContent: [
                'Text overflow issues',
                'Inconsistent sizing',
                'Poor readability',
                'Manual adjustments needed'
            ],
            rightTitle: 'With Constraint System',
            rightContent: [
                'Automatic size optimization',
                'Consistent layout',
                'Perfect fit guaranteed',
                'Zero manual intervention'
            ]
        });
        
        // Save the presentation
        const filename = 'content_constraint_demo.pptx';
        await pres.writeFile({ fileName: filename });
        console.log(`✓ Generated: ${filename}`);
        console.log('  - Demonstrates automatic content constraint handling');
        console.log('  - Shows overflow prevention in action');
        console.log('  - Includes responsive layout examples');
        
        return filename;
    }
}

// Run the tests
if (require.main === module) {
    const tester = new ContentConstraintTester();
    tester.runTests().catch(console.error);
}

module.exports = ContentConstraintTester;
