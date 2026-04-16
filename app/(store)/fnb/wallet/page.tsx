"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
    fnbUserPoints,
    fnbUserTier,
    fnbRedemptionHistory,
    type FnbRedemptionTransaction,
} from "@/lib/fnb-dummy-data";

const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), { ssr: false });

const TIER_THRESHOLDS = [
    { name: "Gold", min: 10000, color: "from-amber-500 to-yellow-400", next: null, nextMin: 9999 },
    { name: "Silver", min: 1000, color: "from-slate-500 to-slate-400", next: "Gold", nextMin: 10000 },
    { name: "Bronze", min: 0, color: "from-orange-700 to-orange-500", next: "Silver", nextMin: 1000 },
];

function getTierInfo(points: number) {
    const tier = TIER_THRESHOLDS.find((t) => points >= t.min) ?? TIER_THRESHOLDS[TIER_THRESHOLDS.length - 1];
    const progress = tier.next
        ? Math.min(100, ((points - tier.min) / (tier.nextMin - tier.min)) * 100)
        : 100;
    const toNext = tier.next ? Math.max(0, tier.nextMin - points) : 0;
    return { ...tier, progress, toNext };
}

export default function FnbWalletPage() {
    const router = useRouter();
    const [showRedeemQR, setShowRedeemQR] = useState(false);

    const points = fnbUserPoints;
    const tierInfo = getTierInfo(points);
    const history: FnbRedemptionTransaction[] = fnbRedemptionHistory;
    const redeemQRValue = `WALLET-MEMBER-${points}PTS`;

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
                        <div className={`bg-gradient-to-r ${tierInfo.color} px-6 pt-6 pb-5`}>
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-bold uppercase tracking-widest text-white/70">Redeem Points</p>
                                <button
                                    onClick={() => setShowRedeemQR(false)}
                                    className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white"
                                >
                                    <i className="ri-close-line text-base" />
                                </button>
                            </div>
                            <p className="text-white font-semibold text-sm truncate">{fnbUserTier} Member</p>
                            <p className="text-white text-2xl font-bold tabular-nums mt-2">
                                {points.toLocaleString()} <span className="text-sm font-semibold text-white/70">pts available</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-4 px-6 py-6">
                            <p className="text-slate-500 text-sm text-center">Show this QR code to our staff to redeem your points.</p>
                            <div className="bg-white ring-8 ring-amber-50 border border-amber-100 p-4 rounded-2xl shadow-sm">
                                <QRCodeSVG value={redeemQRValue} size={200} />
                            </div>
                        </div>
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
                            <p className="text-xs font-bold uppercase tracking-widest text-white/70">{tierInfo.name} Member</p>
                            <p className="text-sm font-semibold text-white/90 mt-0.5 truncate max-w-[200px]">
                                {fnbUserTier} Tier
                            </p>
                        </div>
                        <i className="ri-vip-crown-fill text-3xl text-white/40" />
                    </div>
                    <p className="text-5xl font-bold tabular-nums tracking-tight">{points.toLocaleString()}</p>
                    <p className="text-sm text-white/70 mt-1">points</p>

                    {tierInfo.next ? (
                        <div className="mt-5">
                            <div className="flex justify-between text-xs text-white/70 mb-1.5">
                                <span>{tierInfo.name}</span>
                                <span>{tierInfo.next}</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-white rounded-full transition-all" style={{ width: `${tierInfo.progress}%` }} />
                            </div>
                            <p className="text-xs text-white/70 mt-1.5">
                                {tierInfo.toNext.toLocaleString()} more points to {tierInfo.next}
                            </p>
                        </div>
                    ) : (
                        <p className="text-xs text-white/70 mt-3">✨ You&apos;re at our highest tier!</p>
                    )}

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

            {/* Redemption History */}
            <div>
                <div className="flex border-b border-slate-200 mb-4">
                    <button className="flex-1 pb-3 text-sm font-semibold transition-colors relative text-slate-900">
                        Redemption History
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 rounded-full" />
                    </button>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                        <i className="ri-history-line text-4xl" />
                        <p className="mt-2 text-sm font-medium">No redemptions yet</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {history.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between shadow-sm"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 text-sm truncate">{item.rewardName}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{item.outlet}</p>
                                </div>
                                <span className="ml-3 text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 tabular-nums">
                                    -{item.points} pts
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
