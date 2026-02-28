"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { useUserStore } from "@/global-store/user";
import { logoutCustomer } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

export function UserMenu() {
    const { user, logout } = useUserStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !user) return null;

    const handleLogout = async () => {
        if (user.token && user.role === "customer") {
            try {
                await logoutCustomer(user.token);
            } catch (e) {
                // Ignore API failure, still log them out locally
            }
        }
        logout();
        setIsOpen(false);
        router.push("/");
    };

    const mainMenuItems = [
        { label: "Profile", href: "/account/profile", icon: "ri-user-line" },
        { label: "Appointments", href: "/account/appointments", icon: "ri-calendar-line" },
        { label: "Membership", href: "/account/membership", icon: "ri-vip-crown-2-line" },
    ];

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <button className="flex items-center gap-2 px-1 py-1 rounded-full border border-gray-300 hover:shadow-md transition-all outline-none bg-white">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                            alt={user.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <i className={cn("text-xl text-black transition-transform pr-1.5 leading-none", isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line")}></i>
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content
                    className="z-50 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-2 w-[280px] mt-2 animate-in fade-in zoom-in-95 duration-200"
                    align="end"
                    sideOffset={8}
                >
                    {/* Header: User Name */}
                    <div className="px-4 pt-4 pb-3">
                        <h3 className="font-bold text-[17px] uppercase tracking-wide text-black leading-none m-0">
                            {user.name}
                        </h3>
                    </div>

                    {/* Main Menu Items */}
                    <div className="flex flex-col gap-1 mt-1">
                        {mainMenuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-4 px-4 py-3 rounded-xl text-[16px] transition-colors focus:outline-none",
                                        isActive ? "bg-gray-100 font-medium text-black" : "font-normal text-black hover:bg-gray-50/80"
                                    )}
                                >
                                    <i className={cn("text-[20px] leading-none text-black font-normal", item.icon)}></i>
                                    {item.label}
                                </Link>
                            );
                        })}

                        {/* Log out item without icon */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-4 py-3 rounded-xl text-[16px] font-normal text-black hover:bg-gray-50/80 transition-colors focus:outline-none w-full text-left"
                        >
                            Log out
                        </button>
                    </div>

                    <div className="border-t border-gray-100 my-2 mx-4"></div>

                    {/* Secondary Items (Keep) */}
                    <div className="flex flex-col gap-1 pb-2">
                        <Link
                            href="/help"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-3 rounded-xl text-[16px] font-normal text-black hover:bg-gray-50/80 transition-colors focus:outline-none"
                        >
                            Help and support
                        </Link>
                        <button
                            className="flex items-center px-4 py-3 rounded-xl text-[16px] font-normal text-black hover:bg-gray-50/80 transition-colors focus:outline-none w-full text-left"
                        >
                            Language
                        </button>
                        <Link
                            href="/for-business"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center px-4 py-3 rounded-xl text-[16px] font-normal text-black hover:bg-gray-50/80 transition-colors focus:outline-none"
                        >
                            For business
                        </Link>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
