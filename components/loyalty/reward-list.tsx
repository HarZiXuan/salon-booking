"use client";

import { useEffect, useState } from "react";
import { getRewards, RewardCampaignEntry } from "@/app/actions/loyalty";
import { getSafeImageSrc } from "@/lib/image-url";
import { cn } from "@/lib/utils";

interface RewardListProps {
    shopSlug: string;
    token?: string | null;
    onSelectReward?: (reward: RewardCampaignEntry) => void;
}

function resolveRewardImageUrl(url: string | null | undefined): string | undefined {
    if (!url) return undefined;
    if (url.startsWith("http")) return url;
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ? process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/api\/v1\/?$/, "") : "";
    return `${base}/${url.startsWith("/") ? url.slice(1) : url}`;
}

export function RewardList({ shopSlug, token, onSelectReward }: RewardListProps) {
    const [campaigns, setCampaigns] = useState<RewardCampaignEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        getRewards(shopSlug, token)
            .then((res) => {
                if (!isMounted) return;
                if (res.success && res.data) {
                    setCampaigns(res.data);
                    setError(null);
                } else {
                    // Fail gracefully. 401 is expected for guests currently.
                    setCampaigns([]);
                    if (res.error && !res.error.toLowerCase().includes("unauthenticated")) {
                        setError(res.error);
                    }
                }
            })
            .catch((e) => {
                if (isMounted) setError("Failed to fetch rewards.");
                console.error("Fetch rewards error:", e);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
            
        return () => { isMounted = false; };
    }, [shopSlug, token]);

    if (loading) {
        return (
            <div className="flex flex-col gap-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center bg-white rounded-2xl border border-gray-100 p-2 pr-4 animate-pulse h-[96px] sm:h-[116px]">
                        <div className="w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] flex-shrink-0 bg-gray-100 rounded-xl mr-4"></div>
                        <div className="flex-1 flex flex-col gap-2">
                            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-5 bg-gray-100 rounded w-1/4 mt-1"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!campaigns.length) {
        if (error) {
            return <div className="text-gray-500 py-4 bg-gray-50 rounded-xl px-4 border border-dashed border-gray-200 text-center">Failed to load rewards.</div>;
        }
        return <div className="text-gray-500 py-4 bg-gray-50 rounded-xl px-4 border border-dashed border-gray-200 text-center">No rewards available at the moment.</div>;
    }

    return (
        <div className="flex flex-col gap-3">
            {campaigns.map((entry) => {
                const { reward, is_eligible } = entry;
                
                // Get the cost representation (e.g. "500 pts")
                const pointCost = reward.costs.find(c => c.cost_type === 'point');
                const stampCost = reward.costs.find(c => c.cost_type === 'loyalty_card');
                let costStr = "";
                if (pointCost) costStr = `${parseInt(pointCost.cost_value).toLocaleString()} pts`;
                else if (stampCost) costStr = `${parseInt(stampCost.cost_value)} stamps`;
                
                // Determine title
                let title = reward.campaign?.name;
                if (!title) {
                    if (reward.reward_type === 'cashback_voucher') {
                        title = `${reward.value_type === 'amount' ? 'RM' : ''}${parseFloat(reward.value_amount || "0")}${reward.value_type === 'percentage' ? '%' : ''} Cashback`;
                    } else if (reward.reward_type === 'free_item') {
                        title = "Free Item";
                    } else if (reward.reward_type === 'discount') {
                        title = `${reward.value_type === 'amount' ? 'RM' : ''}${parseFloat(reward.value_amount || "0")}${reward.value_type === 'percentage' ? '%' : ''} Off`;
                    } else {
                        title = "Reward";
                    }
                }
                
                return (
                    <div 
                        key={reward.id} 
                        onClick={() => {
                            if (is_eligible && onSelectReward) {
                                onSelectReward(entry);
                            }
                        }}
                        className={cn(
                            "flex items-center bg-white rounded-2xl border border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)] p-[6px] pr-4 transition-colors",
                            is_eligible ? "cursor-pointer hover:bg-gray-50 hover:shadow" : "opacity-90"
                        )}
                    >
                        {/* Left image area */}
                        <div className="w-[80px] sm:w-[96px] h-[80px] sm:h-[96px] flex-shrink-0 bg-gray-100/80 rounded-xl overflow-hidden mr-4 relative flex items-center justify-center">
                            {reward.image ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={getSafeImageSrc(resolveRewardImageUrl(reward.image))} alt={title} className="w-full h-full object-cover" />
                            ) : (
                                <i className="ri-gift-line text-2xl text-gray-300"></i>
                            )}
                        </div>
                        
                        {/* Middle content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                            <h4 className="font-bold text-[15px] sm:text-[16px] leading-tight mb-2.5 line-clamp-2" style={{ color: "#1a2538", letterSpacing: "-0.01em" }}>
                                {title}
                            </h4>
                            
                            <div className="flex items-center gap-2 flex-wrap mt-auto">
                                {costStr && (
                                    <span className="inline-flex items-center px-2.5 py-[3px] rounded-full bg-[#fcf2df] text-[#b67323] text-[11px] font-bold tracking-wide whitespace-nowrap">
                                        {costStr}
                                    </span>
                                )}
                                {!is_eligible && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-50 text-gray-400 text-[11px] font-semibold tracking-wide whitespace-nowrap border border-gray-100">
                                        Unavailable
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Right arrow */}
                        <div className="flex-shrink-0 ml-3">
                            <i className="ri-arrow-right-s-line text-gray-300 text-xl font-bold"></i>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
