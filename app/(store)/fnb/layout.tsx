"use client";

import { usePathname, useRouter } from "next/navigation";
import { fnbOutlet } from "@/lib/fnb-dummy-data";

const FNB_TABS = [
    { id: "news",        label: "Featured Offers",    href: "/fnb/news" },
    { id: "rewards",     label: "Rewards", href: "/fnb/rewards" },
    { id: "reservation", label: "Reserve", href: "/fnb/reservation" },
    { id: "wallet",      label: "Wallet",  href: "/fnb/wallet" },
    { id: "about",       label: "About",   href: "/fnb/about" },
];

export default function FnbLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const activeTab = FNB_TABS.find(tab => pathname.startsWith(tab.href))?.id ?? "news";

    const handleShare = () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            navigator.share({ title: fnbOutlet.name, url: window.location.href }).catch(() => {});
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Mobile Header — Banner + Info */}
            <div className="md:hidden">
                {/* Banner with overlaid logo */}
                <div className="relative w-full aspect-[21/9] bg-gray-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={fnbOutlet.images[0]}
                        alt={fnbOutlet.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

                    {/* Logo overlay */}
                    <div className="absolute left-4 bottom-3 z-20">
                        <div className="w-[50px] h-[50px] rounded-full border-2 border-white overflow-hidden bg-white shadow-md flex items-center justify-center shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={fnbOutlet.image} alt="Logo" className="w-full h-full object-contain p-1" />
                        </div>
                    </div>

                    {/* Share button */}
                    <div className="absolute top-3 right-3 z-20">
                        <button
                            onClick={handleShare}
                            className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all"
                            aria-label="Share"
                        >
                            <i className="ri-share-line text-lg" />
                        </button>
                    </div>
                </div>

                {/* Merchant info row */}
                <div className="pt-3 pb-2 px-4 bg-white">
                    <h1 className="text-lg font-bold leading-tight text-gray-900 truncate">{fnbOutlet.name}</h1>
                    <div className="flex items-center text-[12px] text-gray-500 gap-2 font-medium mt-0.5">
                        <span className="text-green-600 font-semibold">Open</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{fnbOutlet.hours[0].hours}</span>
                    </div>
                </div>
            </div>

            {/* Desktop Hero — only shown on desktop */}
            <div className="hidden md:block container py-6">
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden group shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={fnbOutlet.images[0]}
                        alt={fnbOutlet.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                    <div className="absolute top-6 right-6 flex gap-3">
                        <button
                            onClick={handleShare}
                            className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 border border-white/50 flex items-center justify-center text-white backdrop-blur-md transition-all"
                            aria-label="Share"
                        >
                            <i className="ri-share-line text-lg" />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="w-20 h-20 rounded-full border-[3px] border-white overflow-hidden bg-white shadow-lg mb-3 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={fnbOutlet.image} alt="Logo" className="w-full h-full object-contain p-1" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">{fnbOutlet.name}</h1>
                        <div className="flex items-center text-white/90 text-sm gap-1.5 font-medium">
                            <i className="ri-map-pin-2-fill text-base" />
                            <span>{fnbOutlet.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-white/90 gap-2 font-medium mt-1">
                            <span className="text-green-400">Open</span>
                            <span className="w-1 h-1 rounded-full bg-white/40" />
                            <span>{fnbOutlet.hours[0].hours}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Tab Navigation */}
            <div className="sticky top-20 z-40 bg-white border-b shadow-sm">
                <div className="overflow-x-auto no-scrollbar">
                    <div className="flex items-center justify-center gap-6 md:gap-8 px-4 h-12 md:h-14 min-w-max mx-auto">
                        {FNB_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => router.push(tab.href)}
                                className={`relative flex flex-col items-center justify-center h-full text-[14px] md:text-[15px] font-semibold transition-all whitespace-nowrap ${
                                    activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Page content */}
            <div className="pb-8">
                {children}
            </div>
        </div>
    );
}
