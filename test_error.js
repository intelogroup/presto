const fetch = require('node-fetch');

async function testProblematicData() {
    // Test data that might cause the error
    const testCases = [
        {
            name: "Unsupported color scheme",
            data: {
                title: "Test Presentation",
                subtitle: "Testing error",
                slides: [{ title: "Test", content: "Content" }],
                colorScheme: "blue" // This doesn't exist in the server
            }
        },
        {
            name: "Empty slides array",
            data: {
                title: "Test Presentation",
                slides: []
            }
        },
        {
            name: "Undefined slides",
            data: {
                title: "Test Presentation"
                // No slides property
            }
        },
        {
            name: "Long text content",
            data: {
                title: "Test Presentation",
                slides: [{
                    title: "Very long title that might cause issues with text fitting and overflow in the presentation system",
                    content: "Very long content ".repeat(200)
                }]
            }
        }
    ];

    for (const testCase of testCases) {
        console.log(`\n=== Testing: ${testCase.name} ===`);
        
        try {
            const response = await fetch('http://localhost:3003/generate-pptx', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(testCase.data)
            });

            if (response.ok) {
                console.log('✅ Success:', response.headers.get('content-length'), 'bytes');
            } else {
                const error = await response.text();
                console.log('❌ Failed:', error);
            }
        } catch (error) {
            console.log('❌ Error:', error.message);
        }
    }
}

testProblematicData();
