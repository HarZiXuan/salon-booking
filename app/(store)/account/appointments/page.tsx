"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button/button";

export default function AppointmentsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-full py-20 px-4 animate-in fade-in duration-300">
            <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#E2E8FF] via-[#E9D5FF] to-[#FCE7F3] rounded-2xl shadow-sm rotate-3 opacity-70"></div>
                <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex items-center justify-center">
                    <i className="ri-calendar-2-fill text-5xl bg-gradient-to-br from-blue-400 to-purple-500 text-transparent bg-clip-text"></i>
                </div>
            </div>

            <h1 className="text-[22px] font-bold text-gray-900 mb-3 tracking-tight">
                No appointments yet
            </h1>

            <p className="text-sm font-medium text-gray-500 mb-8 max-w-sm text-center">
                Your upcoming and past appointments will appear when you book
            </p>

            <Link href="/search">
                <Button
                    variant="outline"
                    className="rounded-full border-gray-300 px-8 h-12 text-[15px] font-semibold hover:border-black hover:text-black hover:bg-gray-50 transition-all"
                >
                    Start searching
                </Button>
            </Link>
        </div>
    );
}
