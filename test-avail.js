const crypto = require('crypto');
const fs = require('fs');


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
    return res.json();
}

async function run() {
    console.log('Fetching all specialists...');
    const specialists = await fetchApi('/specialists/all');
    console.log('Specialists found:', specialists?.data?.length);
    
    if (specialists?.data?.length > 0) {
        const p = specialists.data[0];
        console.log('First specialist:', p.id, p.name);
        
        // Find a service they offer
        console.log('Fetching services...');
        const services = await fetchApi('/services');
        const s = services?.data?.[0];
        console.log('First service:', s?.id, s?.name);

        console.log(`Checking availability for service ${s?.id} and specialist ${p?.id} for the next 7 days...`);
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const dateStr = d.toISOString().split('T')[0];
            const avail = await fetchApi('/availability/timeslots', 'POST', { service_id: String(s?.id), specialist_id: String(p?.id), date: dateStr });
            console.log(`Date: ${dateStr}:`, avail?.data?.timeslots?.length ? avail.data.timeslots.length + ' slots' : avail?.message);
            if (avail?.data?.timeslots?.length > 0) {
              console.log(avail.data.timeslots);
            }
        }
    }
}
run();
