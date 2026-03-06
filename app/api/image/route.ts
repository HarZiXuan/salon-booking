import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * Proxy image requests to avoid mixed content when the site is HTTPS
 * but the API serves images over HTTP. Only allows URLs under API_BASE.
 */
export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
        return NextResponse.json({ error: "Missing url" }, { status: 400 });
    }
    if (!API_BASE) {
        return NextResponse.json({ error: "API base not configured" }, { status: 500 });
    }
    const decoded = decodeURIComponent(url);
    const base = API_BASE.replace(/\/$/, "");
    if (!decoded.startsWith(base + "/") && decoded !== base) {
        return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
    }
    try {
        const res = await fetch(decoded, { headers: { Accept: "image/*" } });
        if (!res.ok) {
            return new NextResponse(null, { status: res.status });
        }
        const contentType = res.headers.get("content-type") || "image/jpeg";
        const body = res.body;
        if (!body) {
            return new NextResponse(null, { status: 502 });
        }
        return new NextResponse(body, {
            headers: {
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch {
        return new NextResponse(null, { status: 502 });
    }
}
