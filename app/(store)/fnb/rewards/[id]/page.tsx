"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { fnbRewards, fnbUserPoints } from "@/lib/fnb-dummy-data";

const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), { ssr: false });

type Step = "detail" | "insufficient" | "qr" | "done";

export default function FnbRewardDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const reward = fnbRewards.find((r) => r.id === id);
    const currentPoints = fnbUserPoints;

    const [step, setStep] = useState<Step>("detail");
    const [claimedPoints, setClaimedPoints] = useState(currentPoints);

    if (!reward) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-4">
                <i className="ri-coupon-line text-5xl text-slate-300" />
                <p className="text-slate-500 font-medium">Reward not found.</p>
                <button onClick={() => router.push("/fnb/rewards")} className="text-sm font-semibold underline text-slate-700">
                    Back to Rewards
                </button>
            </div>
        );
    }

    const shortfall = reward.points - currentPoints;
    const mockQRValue = `REDEEM-${reward.id}-${Date.now()}`;

    const handleClaimTap = () => {
        if (currentPoints < reward.points) {
            setStep("insufficient");
        } else {
            // Simulate success — go straight to QR
            setClaimedPoints(currentPoints - reward.points);
            setStep("qr");
        }
    };

    // ── Step: Detail ──────────────────────────────────────────────────────────
    if (step === "detail") {
        return (
            <div className="max-w-2xl mx-auto">
                {/* Hero */}
                <div className="relative w-full aspect-video bg-slate-200 flex items-center justify-center">
                    {reward.thumbnail
                        ? <img src={reward.thumbnail} alt={reward.name} className="w-full h-full object-cover" />
                        : <i className="ri-coupon-line text-6xl text-slate-400" />
                    }
                    <button
                        onClick={() => router.push("/fnb/rewards")}
                        className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white"
                    >
                        <i className="ri-arrow-left-line text-lg" />
                    </button>
                </div>

                <div className="px-4 py-5 bg-white">
                    <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
                        {reward.points.toLocaleString()} pts
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-1 leading-tight">{reward.name}</h2>
                    <p className="text-xs text-slate-400 mb-3">{reward.validUntil}</p>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{reward.benefit}</p>

                    {reward.terms.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Terms & Conditions</p>
                            <ul className="space-y-1.5">
                                {reward.terms.map((term, i) => (
                                    <li key={i} className="text-xs text-slate-500 flex items-start gap-1.5">
                                        <i className="ri-checkbox-blank-circle-fill text-[6px] text-slate-400 mt-[5px] flex-shrink-0" />
                                        {term}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white border-t px-4 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.07)]">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-500">Your balance</span>
                        <span className="font-bold text-slate-900">{currentPoints.toLocaleString()} pts</span>
                    </div>
                    <button
                        onClick={handleClaimTap}
                        disabled={!reward.isAvailable}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {!reward.isAvailable ? "Currently Unavailable" : "Claim Reward"}
                    </button>
                </div>
            </div>
        );
    }

    // ── Step: Insufficient ────────────────────────────────────────────────────
    if (step === "insufficient") {
        return (
            <div className="max-w-md mx-auto px-4 py-10 flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                    <i className="ri-coin-line text-4xl text-red-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Not Enough Points</h3>
                    <p className="text-slate-500">You need <strong>{shortfall.toLocaleString()} more points</strong> to claim this reward.</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 w-full text-left space-y-2 border border-slate-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Your balance</span>
                        <span className="font-semibold text-slate-800">{currentPoints.toLocaleString()} pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Required</span>
                        <span className="font-semibold text-slate-800">{reward.points.toLocaleString()} pts</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                        <span className="text-red-500 font-semibold">Shortfall</span>
                        <span className="font-bold text-red-500">{shortfall.toLocaleString()} pts</span>
                    </div>
                </div>
                <button
                    onClick={() => router.push("/fnb/rewards")}
                    className="w-full border border-slate-300 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    Back to Rewards
                </button>
            </div>
        );
    }

    // ── Step: QR ──────────────────────────────────────────────────────────────
    if (step === "qr") {
        return (
            <div className="max-w-sm mx-auto px-4 py-8 flex flex-col items-center gap-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900">Scan to Redeem</h3>
                    <p className="text-slate-500 text-sm mt-1">Show this to our staff at the counter</p>
                </div>

                <div className="bg-white ring-8 ring-amber-100 p-4 rounded-2xl shadow-sm">
                    <QRCodeSVG value={mockQRValue} size={220} />
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 w-full border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">How to redeem</p>
                    <div className="space-y-3">
                        {[
                            { step: 1, title: "Visit the Outlet", icon: "ri-store-2-line" },
                            { step: 2, title: "Show QR Code to Staff", icon: "ri-qr-code-line" },
                            { step: 3, title: "Enjoy!", icon: "ri-emotion-happy-line" },
                        ].map((s) => (
                            <div key={s.step} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {s.step}
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className={`${s.icon} text-slate-400`} />
                                    <span className="text-sm font-medium text-slate-700">{s.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setStep("done")}
                    className="w-full bg-slate-100 text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200"
                >
                    Done
                </button>
            </div>
        );
    }

    // ── Step: Done ────────────────────────────────────────────────────────────
    return (
        <div className="max-w-sm mx-auto px-4 py-12 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-5xl text-green-500" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Reward Claimed! 🎉</h3>
                <p className="text-slate-500">Enjoy your <strong>{reward.name}</strong>.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 w-full border border-slate-200">
                <p className="text-sm text-slate-500">Remaining balance</p>
                <p className="text-3xl font-bold text-slate-900 tabular-nums">{claimedPoints.toLocaleString()} pts</p>
            </div>
            <button
                onClick={() => router.push("/fnb/rewards")}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
            >
                Back to Rewards
            </button>
            <button
                onClick={() => router.push("/fnb/wallet")}
                className="text-sm text-slate-500 underline"
            >
                View my wallet
            </button>
        </div>
    );
}
