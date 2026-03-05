/**
 * Persist "my bookings" refs for the logged-in user so the appointments page
 * can show them. Keyed by user id; each ref has booking id, shop slug, and optional merchant slug.
 */

const STORAGE_KEY = "salon_my_booking_refs";

export interface MyBookingRef {
    id: string;
    shopSlug: string;
    merchantSlug?: string;
    addedAt: string; // ISO date
}

function loadAll(): Record<string, MyBookingRef[]> {
    if (typeof window === "undefined") return {};
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as Record<string, MyBookingRef[]>;
        return typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
        return {};
    }
}

function saveAll(data: Record<string, MyBookingRef[]>) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
        // ignore
    }
}

export function getMyBookingRefs(userId: string): MyBookingRef[] {
    const all = loadAll();
    const list = all[userId];
    if (!Array.isArray(list)) return [];
    return [...list].sort((a, b) => (b.addedAt || "").localeCompare(a.addedAt || ""));
}

export function addMyBookingRef(
    userId: string,
    ref: { id: string; shopSlug: string; merchantSlug?: string }
) {
    const all = loadAll();
    const list = all[userId] || [];
    if (list.some((r) => r.id === ref.id && r.shopSlug === ref.shopSlug)) return;
    list.unshift({
        id: ref.id,
        shopSlug: ref.shopSlug,
        merchantSlug: ref.merchantSlug,
        addedAt: new Date().toISOString(),
    });
    all[userId] = list;
    saveAll(all);
}
