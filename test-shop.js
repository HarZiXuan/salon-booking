const crypto = require('crypto');

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SHOP_SLUG = process.env.NEXT_PUBLIC_SHOP_SLUG;
const PRODUCT_KEY = process.env.API_PRODUCT_KEY;
const SECRET_KEY = process.env.API_SECRET_KEY;

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
        'X-Signature': signature
    };
    
    const options = { headers, method };

    const res = await fetch(`${BASE_URL}/shops/${SHOP_SLUG}${endpoint}`, options);
    
    return res.json();
}

async function run() {
    console.log('Fetching Shop...');
    const result = await fetchApi('');
    console.log('Result:', JSON.stringify(result.data.business_hours, null, 2));
}
run();
