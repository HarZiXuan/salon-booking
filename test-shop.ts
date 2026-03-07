import { fetchShopDetails } from "./app/actions/shop";

async function run() {
    const res = await fetchShopDetails("beauty");
    console.log(JSON.stringify(res, null, 2));
}

run();
