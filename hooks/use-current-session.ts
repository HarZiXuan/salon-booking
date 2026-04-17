"use client";

import { usePathname } from "next/navigation";
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
    logout: () => void;
} {
    const pathname = usePathname();
    const { getSession, clearSession } = useUserStore();

    // Extract the first URL segment e.g. /kapas-beauty-spa/... → "kapas-beauty-spa"
    const merchantSlug = pathname.split("/").filter(Boolean)[0] ?? null;
    const shopSlug = merchantSlug ? getShopSlugFromMerchantUrl(merchantSlug) : null;

    const user = shopSlug ? getSession(shopSlug) : null;

    const logout = () => {
        if (shopSlug) clearSession(shopSlug);
    };

    return { user, shopSlug, logout };
}
