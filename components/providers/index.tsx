"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect, type ReactNode } from "react";
import "@/lib/i18n";
import { useUserStore } from "@/global-store/user";
import { fetchCustomerInfo } from "@/app/actions/auth";

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

    const { user, setUser, logout, isAuthenticated } = useUserStore();

    useEffect(() => {
        if (isAuthenticated && user?.token && user.role === "customer") {
            const loadProfile = async () => {
                const res = await fetchCustomerInfo(user.token!);
                if (res.success && res.data) {
                    const d = res.data as any;
                    // Keep token, update other info
                    setUser({
                        ...user,
                        id: String(d.id || user.id),
                        name: d.name || user.name,
                        contact: d.contact || user.contact,
                        email: d.email || user.email,
                    });
                } else if (!res.success) {
                    // Token might be invalid, but we'll leave session active to not disrupt flow
                    // or we could logout. Usually soft-fail is better unless strictly unauthorized
                    if (res.error?.toLowerCase().includes("unauthenticated")) {
                        logout();
                    }
                }
            };
            loadProfile();
        }
        // Run once on mount or when token changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.token, isAuthenticated]);

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
}
