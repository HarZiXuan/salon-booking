"use client";

import { useRouter } from "next/navigation";
import { fnbRewards, fnbUserPoints } from "@/lib/fnb-dummy-data";

export default function FnbRewardsPage() {
    const router = useRouter();

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4">
            {/* Points balance mini-card */}
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-xs font-bold text-amber-900/70 uppercase tracking-wider">Your Points</p>
                    <p className="text-3xl font-bold text-amber-900 tabular-nums">{fnbUserPoints.toLocaleString()}</p>
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
                {fnbRewards.map((reward) => (
                    <button
                        key={reward.id}
                        onClick={() => reward.availability === "available" && router.push(`/fnb/rewards/${reward.id}`)}
                        disabled={reward.availability === "unavailable"}
                        className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all text-left w-full flex flex-row h-28 ${
                            reward.availability === "available"
                                ? "border-slate-200 hover:shadow-md hover:border-slate-300 cursor-pointer"
                                : "border-slate-100 opacity-60 cursor-not-allowed"
                        }`}
                    >
                        <div
                            className="w-28 flex-shrink-0 bg-slate-200 bg-cover bg-center"
                            style={{ backgroundImage: `url(${reward.thumbnail})` }}
                        />
                        <div className="p-4 flex flex-col flex-1 min-w-0 justify-center">
                            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{reward.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {reward.points.toLocaleString()} pts
                                </span>
                                {reward.availability === "unavailable" && (
                                    <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                                        Out of stock
                                    </span>
                                )}
                            </div>
                        </div>
                        {reward.availability === "available" && (
                            <div className="flex items-center pr-3 text-slate-300 flex-shrink-0">
                                <i className="ri-arrow-right-s-line text-2xl" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
