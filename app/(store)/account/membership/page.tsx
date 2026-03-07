"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/global-store/user";
import { getMerchantSlugs, getShopSlugFromMerchantUrl } from "@/lib/stores";
import { getPoints, getMyVouchers } from "@/app/actions/loyalty";
import { VoucherCard } from "@/components/loyalty/voucher-card";
import { RedeemModal } from "@/components/loyalty/redeem-modal";
import { Button } from "@/components/ui/button/button";
import type { ClaimedVoucher } from "@/lib/loyalty-types";
import { cn } from "@/lib/utils";

interface MerchantLoyalty {
    merchantSlug: string;
    shopSlug: string;
    merchantName: string;
    points: number;
    vouchers: ClaimedVoucher[];
}

export default function MembershipPage() {
    const { user } = useUserStore();
    const [merchants, setMerchants] = useState<MerchantLoyalty[]>([]);
    const [loading, setLoading] = useState(true);
    const [redeemModal, setRedeemModal] = useState<{
        shopSlug: string;
        merchantName: string;
    } | null>(null);

    // active merchant card to show details
    const [activeMerchant, setActiveMerchant] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.token) {
            setLoading(false);
            return;
        }
        const merchantSlugs = getMerchantSlugs();
        if (merchantSlugs.length === 0) {
            setLoading(false);
            return;
        }
        (async () => {
            setLoading(true);
            const results: MerchantLoyalty[] = [];
            for (const merchantSlug of merchantSlugs) {
                const shopSlug = getShopSlugFromMerchantUrl(merchantSlug);
                if (!shopSlug) continue;
                const [pointsRes, vouchersRes] = await Promise.all([
                    getPoints(shopSlug, user.token),
                    getMyVouchers(shopSlug, user.token),
                ]);
                const points = pointsRes.success && pointsRes.data ? pointsRes.data.points : 0;
                const merchantName = pointsRes.success && pointsRes.data?.merchantName
                    ? pointsRes.data.merchantName
                    : merchantSlug.replace(/-/g, ' ');

                const vouchers =
                    vouchersRes.success && vouchersRes.data
                        ? (vouchersRes.data.vouchers as ClaimedVoucher[])
                        : [];
                results.push({
                    merchantSlug,
                    shopSlug,
                    merchantName,
                    points,
                    vouchers,
                });
            }
            setMerchants(results);
            if (results.length > 0) {
                setActiveMerchant(results[0].merchantSlug);
            }
            setLoading(false);
        })();
    }, [user?.token]);

    if (!user) {
        return (
            <div className="flex flex-col min-h-full p-8 animate-in fade-in duration-300">
                <p className="text-gray-500">Please log in to view your memberships.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-full p-8 animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Membership Cards
                </h1>
                <p className="text-gray-500 mt-2">
                    View your merchant membership cards, points, and vouchers.
                </p>
            </div>

            {loading ? (
                <div className="py-12 text-center text-gray-500">Loading memberships…</div>
            ) : merchants.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-12 text-center">
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                        <i className="ri-vip-crown-2-line text-2xl text-gray-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        No memberships yet
                    </h2>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Earn points by booking at a merchant to unlock your membership cards.
                    </p>
                    <Link href="/search">
                        <Button variant="outline" className="rounded-full">
                            Find a merchant
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN: Membership Cards List */}
                    <div className="lg:col-span-5 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Cards</h2>
                        {merchants.map((m, idx) => {
                            const isActive = activeMerchant === m.merchantSlug;
                            const isGold = m.points > 1000 || idx % 2 === 0;

                            return (
                                <div
                                    key={m.merchantSlug}
                                    onClick={() => setActiveMerchant(m.merchantSlug)}
                                    className={cn(
                                        "relative group perspective-1000 cursor-pointer transition-all duration-300",
                                        isActive ? "scale-100 z-10" : "opacity-60 hover:opacity-100 hover:scale-[1.02] grayscale-[30%]"
                                    )}
                                >
                                    {isGold ? (
                                        <div className={cn(
                                            "w-full h-[180px] rounded-2xl overflow-hidden ring-1 ring-inset shadow-xl relative text-[#624615]",
                                            isActive ? "ring-[#e4cb93]/50 shadow-[0_20px_50px_-12px_rgba(195,155,75,0.4)]" : "ring-[#e4cb93]/30",
                                            "bg-gradient-to-br from-[#dec081] via-[#fae7b9] to-[#c6a04f] xl:from-[#dabb7c] xl:via-[#fdf0cc] xl:to-[#cda652]"
                                        )}>
                                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/40 rounded-full blur-3xl pointer-events-none"></div>
                                            <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-[#4a350f] tracking-tight truncate max-w-[200px] capitalize">{m.merchantName}</h3>
                                                        <p className="text-[10px] font-bold text-[#8a6522] uppercase tracking-[0.2em] mt-1">VIP Card</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#4a350f] text-[#fae7b9] shadow-inner">
                                                            <i className="ri-vip-crown-fill text-xs"></i>
                                                            <span className="text-[10px] font-bold tracking-widest uppercase">Gold</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-end relative z-10 w-full">
                                                    <div>
                                                        <p className="text-[9px] font-bold text-[#8a6522] uppercase tracking-[0.1em] mb-1">Member</p>
                                                        <p className="text-sm font-bold text-[#4a350f] tracking-wide uppercase">{user.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "w-full h-[180px] rounded-2xl overflow-hidden ring-1 ring-inset shadow-xl relative text-gray-800",
                                            isActive ? "ring-gray-300 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300" : "ring-gray-200 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200"
                                        )}>
                                            <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-800 tracking-tight truncate max-w-[200px] capitalize">{m.merchantName}</h3>
                                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-1">Member Card</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-800 text-white shadow-inner">
                                                            <i className="ri-medal-fill text-xs"></i>
                                                            <span className="text-[10px] font-bold tracking-widest uppercase">Silver</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-end relative z-10 w-full">
                                                    <div>
                                                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.1em] mb-1">Member</p>
                                                        <p className="text-sm font-bold text-gray-800 tracking-wide uppercase">{user.name}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* RIGHT COLUMN: Active Merchant Details */}
                    <div className="lg:col-span-7">
                        {activeMerchant && (() => {
                            const activeData = merchants.find(m => m.merchantSlug === activeMerchant);
                            if (!activeData) return null;

                            return (
                                <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm animate-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6 mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeData.merchantName}</h2>
                                            <Link href={`/${activeData.merchantSlug}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                                Visit store page &rarr;
                                            </Link>
                                        </div>
                                        <div className="text-left sm:text-right bg-gray-50 px-4 py-3 rounded-xl border w-full sm:w-auto">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Loyalty Points</p>
                                            <p className="text-3xl font-bold tabular-nums tracking-tighter text-gray-900 leading-none">
                                                {activeData.points}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-gray-900">Your Vouchers</h3>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                setRedeemModal({
                                                    shopSlug: activeData.shopSlug,
                                                    merchantName: activeData.merchantName,
                                                })
                                            }
                                            className="rounded-full"
                                        >
                                            <i className="ri-ticket-2-line mr-2"></i> Redeem Points
                                        </Button>
                                    </div>

                                    {activeData.vouchers.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {activeData.vouchers.map((v) => (
                                                <div key={v.code} className="transform transition-transform hover:scale-[1.02]">
                                                    <VoucherCard voucher={v} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed">
                                            <i className="ri-coupon-3-line text-4xl text-gray-300 mb-3 block"></i>
                                            <p className="text-gray-500 font-medium text-sm">No vouchers claimed yet.</p>
                                            <p className="text-gray-400 text-xs mt-1">Earn points by making bookings, then redeem them here.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            {redeemModal && (
                <RedeemModal
                    isOpen={!!redeemModal}
                    onClose={() => setRedeemModal(null)}
                    shopSlug={redeemModal.shopSlug}
                    merchantName={redeemModal.merchantName}
                    token={user?.token}
                    onRedeemed={() => {
                        if (!user?.token) return;
                        const m = merchants.find((x) => x.shopSlug === redeemModal.shopSlug);
                        if (m) {
                            getMyVouchers(redeemModal.shopSlug, user.token).then((res) => {
                                if (res.success && res.data) {
                                    setMerchants((prev) =>
                                        prev.map((x) =>
                                            x.shopSlug === redeemModal.shopSlug
                                                ? {
                                                    ...x,
                                                    vouchers: res.data!.vouchers as ClaimedVoucher[],
                                                }
                                                : x
                                        )
                                    );
                                }
                            });
                            getPoints(redeemModal.shopSlug, user.token).then((res) => {
                                if (res.success && res.data) {
                                    setMerchants((prev) =>
                                        prev.map((x) =>
                                            x.shopSlug === redeemModal.shopSlug
                                                ? { ...x, points: res.data!.points }
                                                : x
                                        )
                                    );
                                }
                            });
                        }
                    }}
                />
            )}
        </div>
    );
}
