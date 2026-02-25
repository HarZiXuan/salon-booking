import CryptoJS from 'crypto-js';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
const SHOP_SLUG = process.env.NEXT_PUBLIC_SHOP_SLUG || "";
const PRODUCT_KEY = process.env.API_PRODUCT_KEY || "";
const SECRET_KEY = process.env.API_SECRET_KEY || "";

type FetchOptions = RequestInit & {
    params?: Record<string, string>;
    data?: unknown;
    token?: string;
};

export async function apiFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, data, token, ...init } = options;
    const url = new URL(`${BASE_URL}/shops/${SHOP_SLUG}${endpoint}`);

    // Parse and attach query params
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    // Prepare body
    if (data && !init.body) {
        init.body = JSON.stringify(data);
    }

    // Signature logic
    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // Sort parameters alphabetically if there is a payload
    let signatureBody = "";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allParams: Record<string, any> = { ...params, ...(data as Record<string, unknown>) };
    
    if (Object.keys(allParams).length > 0) {
        const sortedKeys = Object.keys(allParams).sort();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sortedParams: Record<string, any> = {};
        sortedKeys.forEach(key => {
            sortedParams[key] = allParams[key];
        });
        signatureBody = JSON.stringify(sortedParams);
    }

    // Generate MD5 Document Signature
    const signString = PRODUCT_KEY + SECRET_KEY + timestamp + signatureBody;
    const signature = CryptoJS.MD5(signString).toString();

    // Attach headers
    const headers: Record<string, string> = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Product-Key": PRODUCT_KEY,
        "X-Timestamp": timestamp,
        "X-Signature": signature,
        ...(init.headers as Record<string, string> || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url.toString(), {
        ...init,
        headers,
    });

    if (!response.ok) {
        let errorMessage = `API Error: ${response.statusText}`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // Error not in JSON format
        }
        throw new Error(errorMessage);
    }

    const responseData = await response.json();
    return responseData;
}
