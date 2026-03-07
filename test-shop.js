const crypto = require('crypto');
async function run() {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const SHOP_SLUG = process.env.NEXT_PUBLIC_SHOP_SLUG;
    const PRODUCT_KEY = process.env.API_PRODUCT_KEY;
    const SECRET_KEY = process.env.API_SECRET_KEY;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const signString = PRODUCT_KEY + SECRET_KEY + timestamp + "";
    const signature = crypto.createHash('md5').update(signString).digest('hex');
    const options = { headers: { 'X-Product-Key': PRODUCT_KEY, 'X-Timestamp': timestamp, 'X-Signature': signature } };
    const res = await fetch(`${BASE_URL}/shops/beauty`, options);
    console.log(await res.json());
}
run();
