const crypto = require('crypto');
const fs = require('fs');

const BASE_URL = "http://54.169.239.246:8888/api/v1";
const SHOP_SLUG = "service";
const PRODUCT_KEY = "MSIM5PUBCLZ4H5CR";
const SECRET_KEY = "tszZF0ejCLMb4Pq0TEO2kduUIOoTVDY9";
const TOKEN = process.argv[2]; // Pass token as arg

if (!TOKEN) {
    console.error("Usage: node test-loyalty-api.js <token>");
    process.exit(1);
}

async function fetchApi(endpoint, method = 'GET', data = null) {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    let signatureBody = '';
    if (data) {
        const sortedKeys = Object.keys(data).sort();
        const sortedParams = {};
        sortedKeys.forEach(key => {
            sortedParams[key] = data[key];
        });
        signatureBody = JSON.stringify(sortedParams);
    }
    
    const signString = PRODUCT_KEY + SECRET_KEY + timestamp + signatureBody;
    const signature = crypto.createHash('md5').update(signString).digest('hex');

    const headers = {
        'Accept': 'application/json',
        'X-Product-Key': PRODUCT_KEY,
        'X-Timestamp': timestamp,
        'X-Signature': signature,
        'Authorization': `Bearer ${TOKEN}`
    };
    
    const options = { headers, method };
    if (data) {
        options.body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
    }

    try {
        const res = await fetch(`${BASE_URL}/shops/${SHOP_SLUG}${endpoint}`, options);
        console.log(`[${method}] ${endpoint} - Status: ${res.status}`);
        const text = await res.text();
        return JSON.parse(text);
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

async function run() {
    console.log('Fetching balance...');
    const balance = await fetchApi('/rewards/balance');
    console.log('Balance response:', JSON.stringify(balance, null, 2));

    console.log('\nFetching history...');
    const history = await fetchApi('/rewards/redeemed');
    console.log('History response:', JSON.stringify(history, null, 2));
}

run().catch(console.error);
