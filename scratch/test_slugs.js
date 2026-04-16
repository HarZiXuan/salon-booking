
const BASE_URL = "http://54.169.239.246:8888/api/v1";

async function testSlug(slug) {
    const url = `${BASE_URL}/shops/${slug}`;
    console.log(`Testing slug: ${slug} at ${url}`);
    try {
        const res = await fetch(url);
        const data = await res.json();
        console.log(`Response for ${slug}:`, JSON.stringify(data).substring(0, 200));
        return data.success;
    } catch (e) {
        console.error(`Error testing ${slug}:`, e.message);
        return false;
    }
}

async function run() {
    await testSlug("service");
    await testSlug("kapas-beauty-spa");
    await testSlug("yishun");
}

run();
