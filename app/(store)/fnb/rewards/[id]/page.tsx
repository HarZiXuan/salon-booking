"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fnbRewards, fnbUserPoints } from "@/lib/fnb-dummy-data";

const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), { ssr: false });

type Step = "detail" | "insufficient" | "confirm" | "qr" | "done";

export default function FnbRewardDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const reward = fnbRewards.find((r) => r.id === id);

    const [step, setStep] = useState<Step>("detail");
    const [qrData, setQrData] = useState("");
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [currentPoints, setCurrentPoints] = useState(fnbUserPoints);
    const [termsOpen, setTermsOpen] = useState(false);

    useEffect(() => {
        if (step !== "qr") return;
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

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

    const handleClaimTap = () => {
        if (currentPoints < reward.points) {
            setStep("insufficient");
        } else {
            setStep("confirm");
        }
    };

    const handleConfirm = () => {
        const qr = `REDEEM-${reward.id}-${Date.now()}`;
        setQrData(qr);
        setCurrentPoints((p) => p - reward.points);
        setTimeLeft(15 * 60);
        setStep("qr");
    };

    // ── Step: Detail ──────────────────────────────────────────────
    if (step === "detail") {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="relative w-full aspect-video bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={reward.thumbnail} alt={reward.name} className="w-full h-full object-cover" />
                    <button
                        onClick={() => router.push("/fnb/rewards")}
                        className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white"
                        aria-label="Back"
                    >
                        <i className="ri-arrow-left-line text-lg" />
                    </button>
                </div>

                <div className="px-4 py-5 bg-white">
                    <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
                        {reward.points.toLocaleString()} Points
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-1 leading-tight">{reward.name}</h2>
                    <p className="text-xs text-slate-400 mb-4">{reward.validUntil}</p>

                    <h4 className="font-bold text-slate-800 mb-1">Benefits</h4>
                    <p className="text-slate-600 text-[15px] leading-relaxed mb-4">{reward.benefit}</p>

                    <button
                        onClick={() => setTermsOpen((o) => !o)}
                        className="flex items-center justify-between w-full py-3 border-t border-slate-100 text-sm font-semibold text-slate-700"
                    >
                        <span>Terms &amp; Conditions</span>
                        <i className={`ri-arrow-${termsOpen ? "up" : "down"}-s-line text-lg`} />
                    </button>
                    {termsOpen && (
                        <ul className="list-disc pl-5 text-slate-500 text-sm space-y-1 pb-4">
                            {reward.terms.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    )}
                </div>

                <div className="sticky bottom-0 bg-white border-t px-4 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.07)]">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-500">Your balance</span>
                        <span className="font-bold text-slate-900">{currentPoints.toLocaleString()} pts</span>
                    </div>
                    <button
                        onClick={handleClaimTap}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                    >
                        Claim Reward
                    </button>
                </div>
            </div>
        );
    }

    // ── Step: Insufficient points ─────────────────────────────────
    if (step === "insufficient") {
        const shortfall = reward.points - currentPoints;
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
                <div className="bg-amber-50 rounded-2xl p-4 w-full text-left border border-amber-200">
                    <p className="text-sm font-bold text-amber-800 mb-2">💡 How to earn more points</p>
                    <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                        <li>Dine in or order takeaway</li>
                        <li>Celebrate your birthday with us (+300 pts)</li>
                        <li>Refer a friend</li>
                    </ul>
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

    // ── Step: Confirm ─────────────────────────────────────────────
    if (step === "confirm") {
        const remaining = currentPoints - reward.points;
        return (
            <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
                <button onClick={() => setStep("detail")} className="flex items-center gap-1 text-sm text-slate-500 font-medium w-fit">
                    <i className="ri-arrow-left-line" /> Back
                </button>
                <h3 className="text-2xl font-bold text-slate-900">Confirm Claim</h3>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div
                        className="h-32 bg-slate-200 bg-cover bg-center"
                        style={{ backgroundImage: `url(${reward.thumbnail})` }}
                    />
                    <div className="p-4">
                        <h4 className="font-bold text-slate-900">{reward.name}</h4>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block">
                            {reward.points.toLocaleString()} pts
                        </span>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Current balance</span>
                        <span className="font-semibold">{currentPoints.toLocaleString()} pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Points to deduct</span>
                        <span className="font-semibold text-red-500">−{reward.points.toLocaleString()} pts</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between text-sm">
                        <span className="font-bold text-slate-700">Balance after</span>
                        <span className="font-bold text-slate-900">{remaining.toLocaleString()} pts</span>
                    </div>
                </div>

                <button
                    onClick={handleConfirm}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                >
                    Confirm &amp; Get QR Code
                </button>
                <button
                    onClick={() => setStep("detail")}
                    className="w-full border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        );
    }

    // ── Step: QR Code ─────────────────────────────────────────────
    if (step === "qr") {
        return (
            <div className="max-w-sm mx-auto px-4 py-8 flex flex-col items-center gap-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900">Scan to Redeem</h3>
                    <p className="text-slate-500 text-sm mt-1">Show this to our staff at the counter</p>
                </div>

                <div className="bg-white ring-8 ring-amber-100 p-4 rounded-2xl shadow-sm">
                    <QRCodeSVG value={qrData} size={220} />
                </div>

                <div className={`flex items-center gap-2 text-sm font-semibold ${timeLeft < 60 ? "text-red-500" : "text-slate-600"}`}>
                    <i className="ri-time-line" />
                    Expires in {formatTime(timeLeft)}
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 w-full border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">How to redeem</p>
                    <div className="space-y-3">
                        {[
                            { step: 1, title: "Visit the Outlet", icon: "ri-store-2-line" },
                            { step: 2, title: "Tap Claims", icon: "ri-coupon-line" },
                            { step: 3, title: "Show QR Code", icon: "ri-qr-code-line" },
                            { step: 4, title: "Enjoy!", icon: "ri-emotion-happy-line" },
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

    // ── Step: Done ────────────────────────────────────────────────
    return (
        <div className="max-w-sm mx-auto px-4 py-12 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-5xl text-green-500" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Reward Claimed! 🎉</h3>
                <p className="text-slate-500">Enjoy your <strong>{reward.name}</strong>. Points updated.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 w-full border border-slate-200">
                <p className="text-sm text-slate-500">Updated balance</p>
                <p className="text-3xl font-bold text-slate-900 tabular-nums">{currentPoints.toLocaleString()} pts</p>
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
