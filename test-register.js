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
    if (data) {
        options.body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(`${BASE_URL}/shops/${SHOP_SLUG}${endpoint}`, options);

    const text = await res.text();
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

async function run() {
    console.log('Registering Customer...');
    let result = await fetchApi('/customers/register', 'POST', {
        name: "Test Customer",
        contact: "123123123",
        password: "password123",
        password_confirmation: "password123"
    });
    console.log('Result minimal:', result);

    console.log('Registering Customer with empty email...');
    result = await fetchApi('/customers/register', 'POST', {
        name: "Test Customer 2",
        contact: "123123124",
        email: "",
        password: "password123",
        password_confirmation: "password123"
    });
    console.log('Result with empty string email:', result);
}
run();
