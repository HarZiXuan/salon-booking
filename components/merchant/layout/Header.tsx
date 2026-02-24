"use client";

import React from "react";

export default function Header() {
    return (
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-8 flex-shrink-0 z-10 sticky top-0">
            <div className="flex items-center gap-4">
                {/* Placeholder for left-side header content if needed, like page title or breadcrumbs */}
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors">
                    <i className="ri-notification-3-line text-xl"></i>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <button className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition-colors hidden sm:block">
                    <i className="ri-search-line text-xl"></i>
                </button>
            </div>
        </header>
    );
}
