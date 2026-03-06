/**
 * Returns a URL safe for use in <img src> on the client.
 * When the page is served over HTTPS and the image URL is HTTP, browsers block it (mixed content).
 * We rewrite such URLs to go through our /api/image proxy so the request is same-origin HTTPS.
 */
export function getSafeImageSrc(url: string | null | undefined): string {
    if (!url || typeof url !== "string") return "";
    if (typeof window === "undefined") return url;
    if (url.startsWith("http://") && window.location?.protocol === "https:") {
        return `/api/image?url=${encodeURIComponent(url)}`;
    }
    return url;
}
