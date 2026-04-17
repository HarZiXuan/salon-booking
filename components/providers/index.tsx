"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import "@/lib/i18n";
import { useUserStore } from "@/global-store/user";
import { fetchCustomerInfo } from "@/app/actions/auth";
import { useCurrentSession } from "@/hooks/use-current-session";
export default function Providers({ children }: { children: ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                    },
                },
            })
    );

    const { user, shopSlug, logout } = useCurrentSession();
    const setSession = useUserStore((state) => state.setSession);

    useEffect(() => {
        if (user && user.token && user.role === "customer") {
            const loadProfile = async () => {
                const res = await fetchCustomerInfo(shopSlug ?? "", user.token!);
                if (res.success && res.data) {
                    const d = res.data as any;
                    if (shopSlug) {
                        setSession(shopSlug, {
                            ...user,
                            id: String(d.id || user.id),
                            name: d.name || user.name,
                            contact: d.contact || user.contact,
                            email: d.email || user.email,
                        });
                    }
                } else if (!res.success) {
                    if (res.error?.toLowerCase().includes("unauthenticated")) {
                        logout();
                    }
                }
            };
            loadProfile();
        }
        // Run once on mount or when token changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.token, shopSlug]);

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}
