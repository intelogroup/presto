// Simple test to isolate the constructor issue
console.log('Testing AssetManagementSystem constructor...');

try {
    const AssetManagementSystem = require('./dynamic-presentation-system/asset-management-system');
    console.log('AssetManagementSystem type:', typeof AssetManagementSystem);
    console.log('AssetManagementSystem constructor:', AssetManagementSystem.constructor.name);
    console.log('Is function:', typeof AssetManagementSystem === 'function');
    
    if (typeof AssetManagementSystem === 'function') {
        const instance = new AssetManagementSystem();
        console.log('✅ Successfully created AssetManagementSystem instance');
        console.log('Instance type:', typeof instance);
    } else {
        console.log('❌ AssetManagementSystem is not a constructor function');
        console.log('Actual value:', AssetManagementSystem);
    }
} catch (error) {
    console.error('❌ Error testing AssetManagementSystem:', error.message);
    console.error('Stack:', error.stack);
}