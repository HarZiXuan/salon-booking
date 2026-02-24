const crypto = require('crypto');

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const SHOP_SLUG = process.env.NEXT_PUBLIC_SHOP_SLUG;
const PRODUCT_KEY = process.env.API_PRODUCT_KEY;
const SECRET_KEY = process.env.API_SECRET_KEY;

if (!BASE_URL || !SHOP_SLUG || !PRODUCT_KEY || !SECRET_KEY) {
    console.error("Missing env vars");
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
        'X-Signature': signature
    };

    const options = { headers, method };
    if (data) {
        options.body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
    }

    try {
        const res = await fetch(`${BASE_URL}/shops/${SHOP_SLUG}${endpoint}`, options);
        return await res.text();
    } catch (err) {
        console.error("Fetch error:", err);
        return null;
    }
}

async function run() {
    console.log("Without service_id:");
    console.log(await fetchApi('/availability/timeslots', 'POST', { specialist_id: "2", date: "2026-02-25" }));
    console.log("\nWithout date:");
    console.log(await fetchApi('/availability/timeslots', 'POST', { service_id: "48", specialist_id: "2" }));
}
run();
