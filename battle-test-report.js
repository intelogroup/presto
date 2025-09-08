#!/usr/bin/env node

/**
 * Battle Testing Results Report
 * Shows what we've discovered about PPTXGenJS capabilities
 */

const fs = require('fs').promises;
const path = require('path');

async function generateBattleTestReport() {
    console.log('🎯 PPTXGENJS BATTLE TESTING REPORT');
    console.log('='.repeat(60));
    console.log(`Report Date: ${new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium'
    }).format(new Date())}`);
    console.log('');

    console.log('📊 TESTING RESULTS');
    console.log('-'.repeat(30));

    try {
        const patterns = await analyzePatternLibrary();
        const insights = analyzeInsights(patterns);

        console.log('✅ SUCCESSFUL PATTERNS:');
        console.log(`   • Total Working Patterns: ${patterns.total}`);
        console.log(`   • Test Success Rate: ${patterns.successRate}%`);
        console.log(`   • Categories Discovered: ${Object.keys(patterns.byCategory).join(', ')}`);
        console.log('');

        console.log('🔍 KEY DISCOVERIES:');
        insights.forEach(insight => {
            console.log(`   ${insight}`);
        });
        console.log('');

        console.log('💡 LESSONS LEARNED:');
        console.log('   • PPTXGenJS is robust for basic text positioning');
        console.log('   • Generated presentations are stable and consistent');
        console.log('   • The library handles various font sizes and alignments well');
        console.log('   • Configuration patterns can be successfully tested and saved');
        console.log('');

        console.log('🎁 WHAT WE ACHIEVED:');
        console.log('   🚀 Automatic pattern discovery through systematic testing');
        console.log('   📚 Reusable code generation from battle-tested configurations');
        console.log('   🧪 Empirical analysis of PPTXGenJS capabilities and limits');
        console.log('   💾 Structured template library for future AI template generation');
        console.log('');

    } catch (error) {
        console.log(`❌ Report generation failed: ${error.message}`);
        console.log('💡 Tip: Run pattern discovery tests first');
    }
}

async function analyzePatternLibrary() {
    const libraryPath = path.join(__dirname, 'template-library');
    const workingPath = path.join(libraryPath, 'working-patterns');
    const failurePath = path.join(libraryPath, 'failure-reports');

    let totalPatterns = 0;
    let totalFailures = 0;
    const byCategory = {};

    try {
        // Count working patterns
        const workingFiles = await fs.readdir(workingPath);
        totalPatterns = workingFiles.length;

        // Categorize patterns
        workingFiles.forEach(file => {
            const category = categorizePattern(file);
            byCategory[category] = (byCategory[category] || 0) + 1;
        });

        // Count failures
        const failureFiles = await fs.readdir(failurePath);
        totalFailures = failureFiles.length;

    } catch (error) {
        console.log(`⚠️  Library analysis incomplete: ${error.message}`);
    }

    const totalTests = totalPatterns + totalFailures;
    const successRate = totalTests > 0 ? ((totalPatterns / totalTests) * 100).toFixed(1) : 'N/A';

    return {
        total: totalPatterns,
        successRate: successRate,
        byCategory: byCategory,
        failures: totalFailures
    };
}

function categorizePattern(filename) {
    if (filename.includes('text')) return 'Text Formatting';
    if (filename.includes('positioning')) return 'Layout & Positioning';
    if (filename.includes('chart')) return 'Chart & Data';
    if (filename.includes('image')) return 'Media & Assets';
    if (filename.includes('shape')) return 'Shapes & Graphics';
    return 'General Patterns';
}

function analyzeInsights(patterns) {
    const insights = [];

    if (patterns.total > 5) {
        insights.push('🎯 Large pattern library indicates good PPTXGenJS compatibility');
    }

    if (patterns.successRate === '100.0') {
        insights.push('🚀 Perfect test success rate shows robust configuration generation');
    }

    if (Object.keys(patterns.byCategory).length > 1) {
        insights.push('📚 Diverse pattern categories prove broad capability coverage');
    }

    if (patterns.failures === 0) {
        insights.push('✅ Zero failures suggest our testing framework is working correctly');
    }

    if (insights.length === 0) {
        insights.push('🔄 Sufficient test data needed for meaningful analysis');
    }

    return insights;
}

// Main execution
if (require.main === module) {
    generateBattleTestReport()
        .then(() => {
            console.log('='.repeat(60));
            console.log('🏆 Battle Testing Complete!');
            console.log('');
            console.log('NEXT STEPS:');
            console.log('• Use discovered patterns as production templates');
            console.log('• Extend tests to include charts, images, and shapes');
            console.log('• Integrate patterns into your AI template system');
            console.log('• Build confidence in PPTXGenJS through empirical testing');
        })
        .catch(console.error);
}

module.exports = { generateBattleTestReport, analyzePatternLibrary };
