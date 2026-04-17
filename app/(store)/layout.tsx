"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useUserStore } from "@/global-store/user";
import { useCartStore } from "@/global-store/cart";
import { Button } from "@/components/ui/button/button";
import { CompactSearchBar } from "@/components/layout/compact-search-bar";
import { MainMenu } from "@/components/layout/main-menu";
import { UserMenu } from "@/components/layout/user-menu";
import { fetchShopDetails } from "@/app/actions/shop";
import { getMerchantSlugs, getShopSlugFromMerchantUrl } from "@/lib/stores";
import { normalizeShopToVenue } from "@/lib/normalize";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useUserStore();
    const cartItems = useCartStore((state) => state.items);
    const router = useRouter();
    const pathname = usePathname();

    const [merchantLogo, setMerchantLogo] = useState<string | null>(null);
    const [storeSlug, setStoreSlug] = useState<string | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const handleLogout = () => {
        logout();
        router.refresh();
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        const segment = pathname.split("/").filter(Boolean)[0] || "";
        const merchantSlugs = getMerchantSlugs();
        const shopSlug = getShopSlugFromMerchantUrl(segment);
        if (segment && merchantSlugs.includes(segment.toLowerCase()) && shopSlug) {
            setStoreSlug(segment);
            fetchShopDetails(shopSlug).then((res) => {
                if (res.success && res.data) {
                    const venue = normalizeShopToVenue(res.data);
                    if (venue.image) setMerchantLogo(String(venue.image));
                    else setMerchantLogo(null);
                } else {
                    setMerchantLogo(null);
                }
            }).catch(() => setMerchantLogo(null));
        } else {
            setStoreSlug(null);
            setMerchantLogo(null);
        }
    }, [pathname]);
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full bg-white border-b transition-all duration-200">
                <div className="container flex h-20 items-center justify-between px-4 gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0 h-10 w-[140px] flex items-center justify-center bg-white rounded-lg overflow-hidden">
                        <Link href={storeSlug ? `/${storeSlug}` : "/"} className="block h-full w-full hover:opacity-80 transition-opacity flex items-center justify-center p-1">
                            {merchantLogo ? (
                                <Image
                                    src={merchantLogo}
                                    alt="Merchant logo"
                                    width={140}
                                    height={40}
                                    className="h-full w-full object-contain"
                                />
                            ) : (
                                <span className="text-3xl font-bold tracking-tighter text-gray-900 hover:text-gray-700 transition-colors">
                                    Zaloon
                                </span>
                            )}
                        </Link>
                    </div>

                    {/* Compact Search Bar (Visible on non-home pages) */}
                    <CompactSearchBar />

                    {/* Right Navigation */}

                    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                        {(!isMounted || !user) ? (
                            <>
                                <Link href="/login" className="text-sm font-bold hover:text-gray-600 px-3 py-2 transition-colors">
                                    Log in
                                </Link>

                                <MainMenu />
                            </>
                        ) : (
                            <UserMenu />
                        )}
                    </div>
                </div>
            </header>
            <main className="flex-1 select-none">{children}</main>
        </div>
    );
}
