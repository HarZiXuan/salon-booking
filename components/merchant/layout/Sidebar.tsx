"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { name: "Dashboard", href: "/merchant", icon: "ri-home-4-line" },
    { name: "Calendar", href: "/merchant/calendar", icon: "ri-calendar-line" },
    { name: "Bookings", href: "/merchant/bookings", icon: "ri-book-read-line" },
    { name: "Clients", href: "/merchant/clients", icon: "ri-group-line" },
    { name: "Settings", href: "/merchant/settings", icon: "ri-settings-4-line" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col h-full flex-shrink-0">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-neutral-200">
                <Link href="/merchant" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-serif font-bold text-lg">
                        S
                    </div>
                    <span className="font-semibold tracking-tight text-neutral-900">SalonBiz Space</span>
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                <p className="px-2 text-xs font-medium text-neutral-400 uppercase tracking-wider mb-4">
                    Main Menu
                </p>
                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/merchant"
                                ? pathname === "/merchant"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive
                                        ? "bg-neutral-900 text-white shadow-sm"
                                        : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                                    }`}
                            >
                                <i
                                    className={`${item.icon} text-lg ${isActive ? "text-white" : "text-neutral-500 group-hover:text-neutral-900"
                                        }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Area / User Profile */}
            <div className="p-4 border-t border-neutral-200">
                <div className="flex items-center gap-3 px-2 py-2">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt="User profile"
                        className="w-10 h-10 rounded-full border border-neutral-200 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">John Doe</p>
                        <p className="text-xs text-neutral-500 truncate">john@example.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
