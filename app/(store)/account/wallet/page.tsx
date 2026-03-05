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

interface MerchantLoyalty {
  merchantSlug: string;
  shopSlug: string;
  merchantName: string;
  points: number;
  vouchers: ClaimedVoucher[];
}

export default function WalletPage() {
  const { user } = useUserStore();
  const [merchants, setMerchants] = useState<MerchantLoyalty[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemModal, setRedeemModal] = useState<{
    shopSlug: string;
    merchantName: string;
  } | null>(null);

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
          : merchantSlug;
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
      setLoading(false);
    })();
  }, [user?.token]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-full p-8 animate-in fade-in duration-300">
        <p className="text-gray-500">Please log in to view your rewards.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full p-8 animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Rewards
        </h1>
        <p className="text-gray-500 mt-2">
          Your points and vouchers at each merchant. Earn points by booking and
          claim vouchers here.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading rewards…</div>
      ) : merchants.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
            <i className="ri-gift-line text-2xl text-gray-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            No rewards yet
          </h2>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Earn points by booking at a merchant. Then come back here to see your
            balance and claim vouchers.
          </p>
          <Link href="/search">
            <Button variant="outline" className="rounded-full">
              Find a merchant
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {merchants.map((m) => (
            <section
              key={m.merchantSlug}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {m.merchantName}
                  </h2>
                  <p className="text-gray-500 text-sm mt-0.5">
                    {m.points} points
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/${m.merchantSlug}`}>
                    <Button variant="outline" size="sm">
                      View store
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    onClick={() =>
                      setRedeemModal({
                        shopSlug: m.shopSlug,
                        merchantName: m.merchantName,
                      })
                    }
                  >
                    Claim voucher
                  </Button>
                </div>
              </div>

              {m.vouchers.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Your vouchers
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {m.vouchers.map((v) => (
                      <VoucherCard key={v.code} voucher={v} />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No vouchers claimed yet. Use points to claim a voucher above.
                </p>
              )}
            </section>
          ))}
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
