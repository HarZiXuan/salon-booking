"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
    fnbUserPoints,
    fnbUserTier,
    fnbEarnHistory,
    fnbRedemptionHistory,
    fnbOutlet,
} from "@/lib/fnb-dummy-data";

const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), { ssr: false });

type HistoryTab = "earn" | "redeem";

const TIER_CONFIG = {
    Bronze: { min: 0, max: 499, next: "Silver" as const, nextMin: 500, color: "from-orange-700 to-orange-500" },
    Silver: { min: 500, max: 1199, next: "Gold" as const, nextMin: 1200, color: "from-slate-500 to-slate-400" },
    Gold:   { min: 1200, max: 9999, next: null, nextMin: 9999, color: "from-amber-500 to-yellow-400" },
};

export default function FnbWalletPage() {
    const router = useRouter();
    const [tab, setTab] = useState<HistoryTab>("earn");
    const [showRedeemQR, setShowRedeemQR] = useState(false);

    const tierInfo = TIER_CONFIG[fnbUserTier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.Bronze;
    const progress = tierInfo.next
        ? Math.min(100, ((fnbUserPoints - tierInfo.min) / (tierInfo.nextMin - tierInfo.min)) * 100)
        : 100;
    const pointsToNext = tierInfo.next ? Math.max(0, tierInfo.nextMin - fnbUserPoints) : 0;

    // Stable QR payload based on user identity + timestamp (per session)
    const redeemQRValue = `WALLET-REDEEM-MEMBER-${fnbUserTier.toUpperCase()}-${fnbUserPoints}PTS`;

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4 flex flex-col gap-6">

            {/* ── Redeem QR Modal ── */}
            {showRedeemQR && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
                    onClick={() => setShowRedeemQR(false)}
                >
                    <div
                        className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal header */}
                        <div className={`bg-gradient-to-r ${tierInfo.color} px-6 pt-6 pb-5`}>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-white/70">Redeem Points</p>
                                <button
                                    onClick={() => setShowRedeemQR(false)}
                                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                                    aria-label="Close"
                                >
                                    <i className="ri-close-line text-base" />
                                </button>
                            </div>
                            <p className="text-white font-semibold text-sm truncate">{fnbOutlet.name}</p>
                            <p className="text-white text-2xl font-bold tabular-nums mt-2">
                                {fnbUserPoints.toLocaleString()} <span className="text-sm font-semibold text-white/70">pts available</span>
                            </p>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center gap-4 px-6 py-6">
                            <p className="text-slate-500 text-sm text-center">
                                Show this QR code to our staff to redeem your points at the counter.
                            </p>

                            <div className="bg-white ring-8 ring-amber-50 border border-amber-100 p-4 rounded-2xl shadow-sm">
                                <QRCodeSVG value={redeemQRValue} size={200} />
                            </div>

                            <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                <i className="ri-information-line" />
                                <span>QR code is unique to your membership</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 flex flex-col gap-2">
                            <button
                                onClick={() => router.push("/fnb/rewards")}
                                className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors"
                            >
                                Browse Reward Catalogue
                            </button>
                            <button
                                onClick={() => setShowRedeemQR(false)}
                                className="w-full text-slate-500 font-semibold py-2.5 text-sm hover:text-slate-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Points card */}
            <div className={`rounded-3xl p-6 bg-gradient-to-br ${tierInfo.color} shadow-lg text-white relative overflow-hidden`}>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/70">{fnbUserTier} Member</p>
                            <p className="text-sm font-semibold text-white/90 mt-0.5 truncate max-w-[200px]">{fnbOutlet.name}</p>
                        </div>
                        <i className="ri-vip-crown-fill text-3xl text-white/40" />
                    </div>
                    <p className="text-5xl font-bold tabular-nums tracking-tight">{fnbUserPoints.toLocaleString()}</p>
                    <p className="text-sm text-white/70 mt-1">points</p>

                    {tierInfo.next ? (
                        <div className="mt-5">
                            <div className="flex justify-between text-xs text-white/70 mb-1.5">
                                <span>{fnbUserTier}</span>
                                <span>{tierInfo.next}</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-white/70 mt-1.5">
                                {pointsToNext.toLocaleString()} more points to {tierInfo.next}
                            </p>
                        </div>
                    ) : (
                        <p className="text-xs text-white/70 mt-3">✨ You&apos;re at our highest tier!</p>
                    )}

                    {/* Redeem Points button — inside the card */}
                    <button
                        onClick={() => setShowRedeemQR(true)}
                        className="mt-5 w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all backdrop-blur-sm"
                    >
                        <i className="ri-qr-code-line text-lg" />
                        Redeem Points
                    </button>
                </div>
            </div>

            {/* Reservation shortcut */}
            <button
                onClick={() => router.push("/fnb/reservation")}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <i className="ri-calendar-check-line text-xl text-slate-700" />
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-slate-800 text-sm">Make a Reservation</p>
                        <p className="text-xs text-slate-500">Book your table now</p>
                    </div>
                </div>
                <i className="ri-arrow-right-s-line text-slate-400 text-2xl" />
            </button>

            {/* History tabs */}
            <div>
                <div className="flex border-b border-slate-200 mb-4">
                    {(["earn", "redeem"] as HistoryTab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                                tab === t ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {t === "earn" ? "Earn History" : "Redemption History"}
                            {tab === t && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {tab === "earn" && (
                    <div className="flex flex-col gap-3">
                        {fnbEarnHistory.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between shadow-sm"
                            >
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{item.description}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                                </div>
                                <span className="text-green-600 font-bold text-sm">+{item.points} pts</span>
                            </div>
                        ))}
                    </div>
                )}

                {tab === "redeem" && (
                    <div className="flex flex-col gap-3">
                        {fnbRedemptionHistory.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between shadow-sm"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 text-sm truncate">{item.rewardName}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {item.outlet} · {item.date}
                                    </p>
                                </div>
                                <span className="text-red-500 font-bold text-sm ml-3 flex-shrink-0">
                                    −{item.points} pts
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
