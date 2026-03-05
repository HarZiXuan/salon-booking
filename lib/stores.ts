/**
 * Resolves store credentials by slug.
 * Default store uses NEXT_PUBLIC_SHOP_SLUG + API_PRODUCT_KEY + API_SECRET_KEY.
 * Additional stores use STORE_<SLUG_UPPERCASE>_PRODUCT_KEY and STORE_<SLUG_UPPERCASE>_SECRET_KEY.
 */

const DEFAULT_SLUG = process.env.NEXT_PUBLIC_SHOP_SLUG || "";
const DEFAULT_PRODUCT_KEY = process.env.API_PRODUCT_KEY || "";
const DEFAULT_SECRET_KEY = process.env.API_SECRET_KEY || "";

function getEnv(key: string): string {
    if (typeof process === "undefined" || !process.env) return "";
    return process.env[key] || "";
}

export interface StoreCredentials {
    slug: string;
    productKey: string;
    secretKey: string;
}

export function getStoreCredentials(slug: string | undefined): StoreCredentials | null {
    if (!slug) {
        if (DEFAULT_SLUG && DEFAULT_PRODUCT_KEY && DEFAULT_SECRET_KEY) {
            return { slug: DEFAULT_SLUG, productKey: DEFAULT_PRODUCT_KEY, secretKey: DEFAULT_SECRET_KEY };
        }
        return null;
    }
    const s = slug.trim().toLowerCase();
    if (s === DEFAULT_SLUG.toLowerCase()) {
        if (DEFAULT_PRODUCT_KEY && DEFAULT_SECRET_KEY) {
            return { slug: DEFAULT_SLUG, productKey: DEFAULT_PRODUCT_KEY, secretKey: DEFAULT_SECRET_KEY };
        }
        return null;
    }
    const prefix = `STORE_${slug.trim().toUpperCase().replace(/-/g, "_")}`;
    const productKey = getEnv(`${prefix}_PRODUCT_KEY`);
    const secretKey = getEnv(`${prefix}_SECRET_KEY`);
    if (productKey && secretKey) {
        return { slug: s, productKey, secretKey };
    }
    return null;
}

/** List of API shop slugs (service, yishun, etc.). */
export function getStoreSlugs(): string[] {
    const list = process.env.NEXT_PUBLIC_STORE_SLUGS || "";
    if (list.trim()) {
        return list.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (DEFAULT_SLUG) return [DEFAULT_SLUG];
    return [];
}

/** Parsed mapping: merchant URL slug → API shop slug (e.g. kapas-beauty-spa → service). */
let merchantToShopMap: Record<string, string> | null = null;

function getMerchantToShopMap(): Record<string, string> {
    if (merchantToShopMap) return merchantToShopMap;
    const raw = process.env.NEXT_PUBLIC_MERCHANT_TO_SHOP || "";
    merchantToShopMap = {};
    raw.split(",").forEach((pair) => {
        const [merchant, shop] = pair.trim().split(":").map((s) => s.trim());
        if (merchant && shop) merchantToShopMap![merchant.toLowerCase()] = shop;
    });
    return merchantToShopMap;
}

/** Resolve merchant URL slug (e.g. kapas-beauty-spa) to API shop slug (e.g. service). */
export function getShopSlugFromMerchantUrl(merchantSlug: string | undefined): string | null {
    if (!merchantSlug) return null;
    const map = getMerchantToShopMap();
    return map[merchantSlug.trim().toLowerCase()] ?? null;
}

/** List of merchant URL slugs (for routing). There is no default store. */
export function getMerchantSlugs(): string[] {
    return Object.keys(getMerchantToShopMap());
}
