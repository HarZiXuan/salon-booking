"use client";

import { useRouter } from "next/navigation";
import { fnbRewards, fnbUserPoints } from "@/lib/fnb-dummy-data";

export default function FnbRewardsPage() {
    const router = useRouter();
    const points = fnbUserPoints;

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4">
            {/* Points balance mini-card */}
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-xs font-bold text-amber-900/70 uppercase tracking-wider">Your Points</p>
                    <p className="text-3xl font-bold text-amber-900 tabular-nums">{points.toLocaleString()}</p>
                </div>
                <button
                    onClick={() => router.push("/fnb/wallet")}
                    className="text-xs font-semibold text-amber-900/80 underline"
                >
                    View Wallet
                </button>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-4">Available Rewards</h2>

            <div className="flex flex-col gap-4">
                {fnbRewards.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <i className="ri-coupon-line text-5xl" />
                        <p className="mt-2 font-medium">No rewards available</p>
                    </div>
                )}
                {fnbRewards.map((reward) => {
                    const canAfford = points >= reward.points;
                    const isAvailable = reward.isAvailable && canAfford;
                    return (
                        <button
                            key={reward.id}
                            onClick={() => isAvailable && router.push(`/fnb/rewards/${reward.id}`)}
                            disabled={!isAvailable}
                            className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all text-left w-full flex flex-row h-28 ${
                                isAvailable
                                    ? "border-slate-200 hover:shadow-md hover:border-slate-300 cursor-pointer"
                                    : "border-slate-100 opacity-60 cursor-not-allowed"
                            }`}
                        >
                            {/* Thumbnail */}
                            <div
                                className="w-28 flex-shrink-0 bg-slate-200 bg-cover bg-center flex items-center justify-center"
                                style={reward.thumbnail ? { backgroundImage: `url(${reward.thumbnail})` } : {}}
                            >
                                {!reward.thumbnail && <i className="ri-coupon-line text-3xl text-slate-400" />}
                            </div>

                            {/* Info */}
                            <div className="p-4 flex flex-col flex-1 min-w-0 justify-center">
                                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
                                    {reward.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                        {reward.points.toLocaleString()} pts
                                    </span>
                                    {!reward.isAvailable && (
                                        <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full">
                                            Unavailable
                                        </span>
                                    )}
                                    {reward.isAvailable && !canAfford && (
                                        <span className="bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full">
                                            Not enough points
                                        </span>
                                    )}
                                </div>
                            </div>

                            {isAvailable && (
                                <div className="flex items-center pr-3 text-slate-300 flex-shrink-0">
                                    <i className="ri-arrow-right-s-line text-2xl" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
