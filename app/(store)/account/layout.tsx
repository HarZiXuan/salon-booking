"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCurrentSession } from "@/hooks/use-current-session";

export default function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, merchantSlug } = useCurrentSession();
    const pathname = usePathname();

    const sidebarItems = [
        { name: "Profile", baseHref: "/account/profile", icon: "ri-user-line" },
        { name: "Appointments", baseHref: "/account/appointments", icon: "ri-calendar-line" },
        { name: "Membership", baseHref: "/account/membership", icon: "ri-vip-crown-2-line" },
        { name: "Rewards", baseHref: "/account/wallet", icon: "ri-gift-line" },
        { name: "Product orders", baseHref: "/account/orders", icon: "ri-shopping-bag-line" },
        { name: "Settings", baseHref: "/account/settings", icon: "ri-settings-3-line" },
    ];

    if (!user) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <p className="text-gray-500">Please log in to view this page.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-1 min-h-[calc(100vh-80px)] bg-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-100 hidden md:block shrink-0">
                <div className="p-6">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-black mb-6">
                        {user.name}
                    </h2>
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = pathname.startsWith(item.baseHref);
                            const href = `${item.baseHref}${merchantSlug ? `?shop=${merchantSlug}` : ""}`;
                            return (
                                <Link
                                    key={item.name}
                                    href={href}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${isActive
                                        ? "bg-blue-50 text-black shadow-sm"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-black"
                                        }`}
                                >
                                    <i className={`${item.icon} text-lg ${isActive ? "text-blue-600" : "text-gray-500"}`}></i>
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 bg-gray-50/30">
                {children}
            </div>
        </div>
    );
}
