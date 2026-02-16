const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

type FetchOptions = RequestInit & {
    params?: Record<string, string>;
};

export async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { params, ...init } = options;

    const url = new URL(`${BASE_URL}${endpoint}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
    }

    // TODO: Add Authorization header from global store or cookies
    const headers = {
        "Content-Type": "application/json",
        ...init.headers,
    };

    const response = await fetch(url.toString(), {
        ...init,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login)
            // window.location.href = "/login";
        }
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
}

export default fetcher;
