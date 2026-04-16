// Standalone TDD script for loyalty actions with Dotenv
require('dotenv').config({ path: '.env.local' });
const { getRedeemedRewards } = require('../app/actions/loyalty');
const apiParams = require('../lib/api');

// Mocking apiFetch manually
let mockResponse = null;
apiParams.apiFetch = async () => {
    return mockResponse;
};

async function assert(condition, message) {
    if (!condition) {
        throw new Error(`FAIL: ${message}`);
    }
    console.log(`PASS: ${message}`);
}

async function runTests() {
    const shopSlug = 'service';
    const token = 'fake-token';

    console.log('--- Testing getRedeemedRewards ---');
    
    // Test 1: Wrapped array
    mockResponse = {
        success: true,
        data: {
            data: [
                { id: '1', status: 'completed', reward_id: 'r1', created_at: '2024-01-01' }
            ]
        }
    };
    try {
        let result = await getRedeemedRewards(shopSlug, token);
        console.log("Result 1:", JSON.stringify(result));
        await assert(Array.isArray(result.data), "Result data should be an array (wrapped case)");
    } catch (e) {
        console.log("RED 1:", e.message);
    }

    // Test 2: Direct array
    mockResponse = {
        success: true,
        data: [
            { id: '1', status: 'completed', reward_id: 'r1', created_at: '2024-01-01' }
        ]
    };
    try {
        let result = await getRedeemedRewards(shopSlug, token);
        console.log("Result 2:", JSON.stringify(result));
        await assert(Array.isArray(result.data), "Result data should be an array (direct case)");
    } catch (e) {
        console.log("RED 2:", e.message);
    }
}

runTests().catch(e => {
    console.error("Test execution failed:", e);
    process.exit(1);
});
