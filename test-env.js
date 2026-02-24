require('dotenv').config({ path: '.env.local' });
console.log("NEXT_PUBLIC_API_BASE_URL", process.env.NEXT_PUBLIC_API_BASE_URL);
console.log("NEXT_PUBLIC_SHOP_SLUG", process.env.NEXT_PUBLIC_SHOP_SLUG);
console.log("API_PRODUCT_KEY", process.env.API_PRODUCT_KEY ? "EXISTS" : "MISSING");
console.log("API_SECRET_KEY", process.env.API_SECRET_KEY ? "EXISTS" : "MISSING");
