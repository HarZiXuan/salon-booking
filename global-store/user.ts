import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
    id: string;
    name: string;
    email?: string;
    contact?: string;
    token?: string;
    role: 'customer' | 'merchant';
}

interface UserState {
    sessions: Record<string, User>; // key = shopSlug (e.g. "service")
    setSession: (shopSlug: string, user: User) => void;
    clearSession: (shopSlug: string) => void;
    getSession: (shopSlug: string) => User | null;
    clearAllSessions: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            sessions: {},
            setSession: (shopSlug, user) =>
                set((state) => ({
                    sessions: { ...state.sessions, [shopSlug]: user },
                })),
            clearSession: (shopSlug) =>
                set((state) => {
                    const next = { ...state.sessions };
                    delete next[shopSlug];
                    return { sessions: next };
                }),
            getSession: (shopSlug) => get().sessions[shopSlug] ?? null,
            clearAllSessions: () => set({ sessions: {} }),
        }),
        { name: "user-storage" }
    )
);
