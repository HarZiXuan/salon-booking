"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button/button";
import {
    getRewards,
    getPointBalance,
    sendRedemptionOtp,
    redeemReward,
    type RewardCampaignEntry,
    type RedeemedReward,
} from "@/app/actions/loyalty";
import { cn } from "@/lib/utils";

interface RedeemModalProps {
    isOpen: boolean;
    onClose: () => void;
    shopSlug: string;
    merchantName?: string;
    token?: string | null;
    onRedeemed?: () => void;
    preselectedReward?: RewardCampaignEntry | null;
}

function costLabel(entry: RewardCampaignEntry) {
    const cost = entry.reward.costs[0];
    if (!cost) return "Free";
    const val = parseFloat(cost.cost_value);
    const display = val % 1 === 0 ? val.toFixed(0) : String(val);
    return cost.cost_type === "point" ? `${display} pts` : `${display} stamps`;
}

function rewardTitle(entry: RewardCampaignEntry) {
    const r = entry.reward;
    if (r.value_amount) {
        return r.value_type === "percentage"
            ? `${r.value_amount}% Off`
            : `RM${r.value_amount} Cashback`;
    }
    switch (r.reward_type) {
        case "free_item": return "Free Item";
        case "item_voucher": return "Item Voucher";
        case "discount": return "Discount";
        case "point": return "Points Reward";
        default: return "Reward";
    }
}

// ── OTP countdown ─────────────────────────────────────────────────────────────
function useCountdown(seconds = 30) {
    const [countdown, setCountdown] = useState(0);
    const timer = useRef<ReturnType<typeof setInterval> | null>(null);
    const start = () => {
        setCountdown(seconds);
        timer.current = setInterval(() =>
            setCountdown((p) => { if (p <= 1) { clearInterval(timer.current!); return 0; } return p - 1; }), 1000);
    };
    useEffect(() => () => { if (timer.current) clearInterval(timer.current); }, []);
    return { countdown, start, isActive: countdown > 0 };
}

// ── Component ─────────────────────────────────────────────────────────────────
export function RedeemModal({ isOpen, onClose, shopSlug, merchantName, token, onRedeemed, preselectedReward }: RedeemModalProps) {
    const [points, setPoints] = useState(0);
    const [catalog, setCatalog] = useState<RewardCampaignEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Selected reward → OTP flow
    const [selected, setSelected] = useState<RewardCampaignEntry | null>(null);
    const [otp, setOtp] = useState("");
    const [otpSending, setOtpSending] = useState(false);
    const [otpMsg, setOtpMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [redeeming, setRedeeming] = useState(false);
    const [result, setResult] = useState<RedeemedReward | null>(null);

    const { countdown, start: startCountdown, isActive: isCoolingDown } = useCountdown(30);

    // Load on open
    useEffect(() => {
        if (!isOpen || !shopSlug) return;
        setSelected(preselectedReward || null);
        setResult(null);
        setError("");
        setOtp("");
        setOtpMsg(null);
        (async () => {
            setLoading(true);
            try {
                const [balRes, rewardsRes] = await Promise.all([
                    token ? getPointBalance(shopSlug, token) : Promise.resolve({ success: false, data: null, error: "" }),
                    getRewards(shopSlug, token ?? undefined),
                ]);
                if (balRes.success && balRes.data) setPoints(balRes.data.points);
                if (rewardsRes.success && rewardsRes.data) setCatalog(rewardsRes.data);
                else setError(rewardsRes.error ?? "Failed to load rewards");
            } catch {
                setError("Failed to load rewards");
            } finally {
                setLoading(false);
            }
        })();
    }, [isOpen, shopSlug, token]);

    const handleSendOtp = async () => {
        if (!selected || !token) return;
        setOtpSending(true);
        setOtpMsg(null);
        const res = await sendRedemptionOtp(shopSlug, selected.reward.id, token);
        setOtpSending(false);
        if (res.success) {
            setOtpMsg({ type: "success", text: "OTP sent! Check your phone." });
            startCountdown();
        } else {
            setOtpMsg({ type: "error", text: res.error ?? "Failed to send OTP" });
        }
    };

    const handleRedeem = async () => {
        if (!selected || !token || !otp.trim()) return;
        setRedeeming(true);
        setError("");
        const res = await redeemReward(shopSlug, selected.reward.id, otp.trim(), token);
        setRedeeming(false);
        if (res.success && res.data) {
            setResult(res.data);
            setPoints((p) => {
                const cost = parseFloat(selected.reward.costs[0]?.cost_value ?? "0");
                return Math.max(0, p - cost);
            });
            onRedeemed?.();
        } else {
            setError(res.error ?? "Redemption failed. Check your OTP.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
            <div
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-900">
                        {result ? "Reward Claimed 🎉" : selected ? "Verify & Redeem" : "Claim Reward"}
                    </h2>
                    <button type="button" onClick={() => { setSelected(null); setResult(null); onClose(); }}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Close">
                        <i className="ri-close-line text-2xl" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {/* ── Success screen ── */}
                    {result && (
                        <div className="flex flex-col items-center gap-4 py-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <i className="ri-checkbox-circle-line text-4xl text-green-500" />
                            </div>
                            <p className="text-slate-600 text-sm text-center">
                                Your reward has been redeemed successfully.
                            </p>
                            {result.voucher_code && (
                                <div className="bg-slate-50 rounded-xl border px-5 py-3 text-center w-full">
                                    <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Voucher Code</p>
                                    <p className="text-lg font-mono font-bold text-slate-900">{result.voucher_code}</p>
                                </div>
                            )}
                            {result.qr_code_image_base64 && (
                                <div className="bg-white p-3 border rounded-xl">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={`data:image/png;base64,${result.qr_code_image_base64}`}
                                        alt="QR Code" className="w-40 h-40 object-contain" />
                                </div>
                            )}
                            <div className="flex gap-2 w-full">
                                <Button className="flex-1" onClick={onClose}>Done</Button>
                                <Button variant="outline" onClick={() => { setSelected(null); setResult(null); setOtp(""); setOtpMsg(null); }}>
                                    Claim another
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ── OTP step ── */}
                    {!result && selected && (
                        <div className="flex flex-col gap-4">
                            <button onClick={() => { setSelected(null); setOtp(""); setOtpMsg(null); }}
                                className="flex items-center gap-1 text-sm text-slate-500 w-fit">
                                <i className="ri-arrow-left-line" /> Back
                            </button>

                            <div className="bg-slate-50 rounded-xl p-4 border">
                                <p className="font-bold text-slate-900">{rewardTitle(selected)}</p>
                                <p className="text-sm text-amber-700 font-semibold mt-1">{costLabel(selected)}</p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
                            )}

                            <p className="text-sm font-semibold text-slate-700">Enter OTP sent to your phone</p>
                            <div className="flex gap-2">
                                <input
                                    type="text" inputMode="numeric" maxLength={8}
                                    value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                    placeholder="000000"
                                    className="flex-1 h-10 border rounded-md px-3 text-center tracking-widest text-lg font-bold focus:outline-none focus:ring-2 focus:ring-slate-400"
                                />
                                <button type="button" onClick={handleSendOtp}
                                    disabled={otpSending || isCoolingDown || !token}
                                    className="shrink-0 px-4 h-10 rounded-md border border-slate-900 text-slate-900 text-sm font-medium hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap">
                                    {otpSending ? "Sending…" : isCoolingDown ? `Resend in ${countdown}s` : "Send OTP"}
                                </button>
                            </div>
                            {otpMsg && (
                                <p className={cn("text-sm flex items-center gap-1",
                                    otpMsg.type === "success" ? "text-green-600" : "text-red-500")}>
                                    <i className={otpMsg.type === "success" ? "ri-checkbox-circle-line" : "ri-error-warning-line"} />
                                    {otpMsg.text}
                                </p>
                            )}
                            <Button onClick={handleRedeem} disabled={!otp.trim() || redeeming} className="w-full">
                                {redeeming ? "Redeeming…" : "Confirm & Redeem"}
                            </Button>
                        </div>
                    )}

                    {/* ── Catalog ── */}
                    {!result && !selected && (
                        <>
                            {/* Balance */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                                <p className="text-sm text-gray-500">Your points</p>
                                <p className="text-2xl font-bold text-gray-900">{points.toLocaleString()} pts</p>
                                {merchantName && <p className="text-xs text-gray-500 mt-1">at {merchantName}</p>}
                            </div>

                            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

                            {loading ? (
                                <div className="py-8 text-center text-gray-500">Loading rewards…</div>
                            ) : catalog.length === 0 ? (
                                <p className="py-8 text-center text-gray-500">No rewards available right now.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {catalog.map((entry) => {
                                        const cost = parseFloat(entry.reward.costs[0]?.cost_value ?? "0");
                                        const canRedeem = entry.is_eligible;
                                        return (
                                            <li key={entry.reward.id}
                                                className={cn("border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                                                    !canRedeem && "opacity-70")}>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{rewardTitle(entry)}</p>
                                                    {!canRedeem && entry.reasons[0] && (
                                                        <p className="text-xs text-red-500 mt-0.5">{entry.reasons[0]}</p>
                                                    )}
                                                    <p className="text-sm font-medium text-gray-700 mt-1">{costLabel(entry)}</p>
                                                </div>
                                                <Button
                                                    disabled={!canRedeem || !token}
                                                    onClick={() => { setSelected(entry); setError(""); setOtp(""); setOtpMsg(null); }}
                                                    className="shrink-0"
                                                >
                                                    {token ? "Redeem" : "Sign in"}
                                                </Button>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
