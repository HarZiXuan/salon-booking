"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { useUserStore } from "@/global-store/user";

export function UserMenu() {
    const { user, logout } = useUserStore();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        router.push("/");
    };

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <div className="flex items-center gap-2 cursor-pointer outline-none">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        {/* Avatar Image Placeholder. We'll use a random placeholder or initial */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <i className="ri-arrow-down-s-line text-lg text-gray-500 hover:text-gray-900 transition-colors"></i>
                </div>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="z-50 bg-white rounded-xl shadow-xl border border-gray-200 py-3 w-[260px] mt-2 animate-in fade-in zoom-in-95 duration-200" align="end" sideOffset={8}>
                    {/* Header: User Name */}
                    <div className="px-4 py-2 border-b border-gray-100">
                        <h3 className="font-bold text-[13px] uppercase tracking-wider text-black">
                            {user.name}
                        </h3>
                    </div>

                    {/* Main Menu Items */}
                    <div className="py-2">
                        <Link href="/account/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                            <i className="ri-user-line text-lg text-gray-500"></i> Profile
                        </Link>
                        <Link href="/account/appointments" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                            <i className="ri-calendar-line text-lg text-gray-500"></i> Appointments
                        </Link>
                        <Link href="/account/wallet" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                            <i className="ri-wallet-3-line text-lg text-gray-500"></i> Wallet
                        </Link>
                        <Link href="/account/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                            <i className="ri-shopping-bag-line text-lg text-gray-500"></i> Product orders
                        </Link>
                        <Link href="/account/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                            <i className="ri-settings-3-line text-lg text-gray-500"></i> Settings
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                            <i className="ri-logout-box-r-line text-lg text-gray-500 opacity-0 hidden"></i> Log out
                        </button>
                    </div>

                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Secondary Items */}
                    <div className="py-2 space-y-1">
                        <Link href="/app" onClick={() => setIsOpen(false)} className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                            Download the app
                        </Link>
                        <Link href="/help" onClick={() => setIsOpen(false)} className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                            Help and support
                        </Link>
                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                            <i className="ri-global-line text-lg text-gray-500"></i> English
                        </button>
                    </div>

                    <div className="border-t border-gray-100 mt-1 mb-2"></div>

                    {/* For businesses */}
                    <Link href="/for-business" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-4 py-2 text-[15px] font-bold text-black hover:bg-gray-50 transition-colors group">
                        For businesses
                        <i className="ri-arrow-right-line text-gray-400 group-hover:text-black transition-colors"></i>
                    </Link>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
