const crypto = require('crypto');

const BASE_URL = "http://54.169.239.246:8888/api/v1";
const SHOP_SLUG = "service";
const PRODUCT_KEY = "MSIM5PUBCLZ4H5CR";
const SECRET_KEY = "tszZF0ejCLMb4Pq0TEO2kduUIOoTVDY9";

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
    };
    
    const options = { headers, method };
    if (data) {
        options.body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
    }

    try {
        const url = `${BASE_URL}/shops/${SHOP_SLUG}${endpoint}`;
        const res = await fetch(url, options);
        console.log(`[${method}] ${url} - Status: ${res.status}`);
        const text = await res.text();
        return JSON.parse(text);
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

async function run() {
    console.log('Fetching available rewards for service (kapas)...');
    const rewards = await fetchApi('/rewards');
    console.log('Rewards response:', JSON.stringify(rewards, null, 2));
}

run().catch(console.error);
