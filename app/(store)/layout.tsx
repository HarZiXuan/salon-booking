"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useUserStore } from "@/global-store/user";
import { useCartStore } from "@/global-store/cart";
import { Button } from "@/components/ui/button/button";
import { CompactSearchBar } from "@/components/layout/compact-search-bar";
import { MainMenu } from "@/components/layout/main-menu";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, logout } = useUserStore();
    const cartItems = useCartStore((state) => state.items);
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.refresh();
    };

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []); return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full bg-white border-b transition-all duration-200">
                <div className="container flex h-20 items-center justify-between px-4 gap-4">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-3xl font-bold tracking-tighter hover:text-gray-700 transition-colors">
                            Zaloon
                        </Link>
                    </div>

                    {/* Compact Search Bar (Visible on non-home pages) */}
                    <CompactSearchBar />

                    {/* Right Navigation */}

                    <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                        {(!isMounted || !user) ? (
                            <Link href="/login" className="text-sm font-bold hover:text-gray-600 px-3 py-2 transition-colors">
                                Log in
                            </Link>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="hidden md:inline-block text-sm font-semibold">Hi, {user.name}</span>
                                <Button variant="ghost" className="font-semibold hover:bg-transparent hover:underline" onClick={handleLogout}>
                                    Log out
                                </Button>
                            </div>
                        )}

                        <Link href="/for-business" className="hidden md:block">
                            <Button variant="outline" className="rounded-full border-gray-300 font-semibold px-6 h-10 hover:bg-gray-100 hover:text-black hover:border-gray-400 transition-all">
                                For partners
                            </Button>
                        </Link>

                        <MainMenu />
                    </div>
                </div>
            </header>
            <main className="flex-1 select-none">{children}</main>
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2024 SalonBook. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
