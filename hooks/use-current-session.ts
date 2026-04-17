"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useUserStore, User } from "@/global-store/user";
import { getShopSlugFromMerchantUrl } from "@/lib/stores";

/**
 * Returns the authenticated User for the merchant currently in the URL path,
 * plus a scoped logout action.
 *
 * Returns null user if:
 * - The URL path doesn't start with a known merchant slug
 * - No session exists for this merchant
 */
export function useCurrentSession(): {
    user: User | null;
    shopSlug: string | null;
    merchantSlug: string | null;
    logout: () => void;
} {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const sessions = useUserStore((state) => state.sessions);
    const clearSession = useUserStore((state) => state.clearSession);

    // 1. Try search param first: ?shop=kapas-beauty-spa
    let merchantSlug = searchParams.get("shop");
    
    // 2. Fall back to pathname segments
    if (!merchantSlug) {
        const firstSegment = pathname.split("/").filter(Boolean)[0] ?? null;
        // Ignore static route prefixes that aren't merchants
        if (firstSegment && !["account", "search", "login", "register"].includes(firstSegment)) {
            merchantSlug = firstSegment;
        }
    }

    const shopSlug = merchantSlug ? getShopSlugFromMerchantUrl(merchantSlug) : null;
    const user = shopSlug ? (sessions[shopSlug] ?? null) : null;

    const logout = () => {
        if (shopSlug) clearSession(shopSlug);
    };

    return { user, shopSlug, merchantSlug, logout };
}
