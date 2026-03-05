"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/button";
import {
  getVoucherCatalog,
  getPoints,
  redeemVoucher,
} from "@/app/actions/loyalty";
import type { VoucherCatalogItem, ClaimedVoucher } from "@/lib/loyalty-types";
import { VoucherCard } from "./voucher-card";
import { cn } from "@/lib/utils";

interface RedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopSlug: string;
  merchantName?: string;
  token?: string | null;
  onRedeemed?: () => void;
}

function formatVoucherValue(v: VoucherCatalogItem): string {
  if (v.type === "fixed" && v.value) return `RM ${v.value} off`;
  if (v.type === "percent" && v.value) return `${v.value}% off`;
  if (v.type === "free_service" && v.value) return v.value;
  return v.name;
}

export function RedeemModal({
  isOpen,
  onClose,
  shopSlug,
  merchantName,
  token,
  onRedeemed,
}: RedeemModalProps) {
  const [points, setPoints] = useState<number>(0);
  const [catalog, setCatalog] = useState<VoucherCatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [claimedVoucher, setClaimedVoucher] = useState<ClaimedVoucher | null>(null);

  useEffect(() => {
    if (!isOpen || !shopSlug) return;
    setClaimedVoucher(null);
    setError("");
    (async () => {
      setLoading(true);
      try {
        const [pointsRes, catalogRes] = await Promise.all([
          getPoints(shopSlug, token),
          getVoucherCatalog(shopSlug),
        ]);
        if (pointsRes.success && pointsRes.data)
          setPoints(pointsRes.data.points);
        if (catalogRes.success && catalogRes.data)
          setCatalog(catalogRes.data.vouchers as VoucherCatalogItem[]);
      } catch (e) {
        setError("Failed to load rewards");
      } finally {
        setLoading(false);
      }
    })();
  }, [isOpen, shopSlug, token]);

  const handleRedeem = async (voucherId: string) => {
    setError("");
    setRedeemingId(voucherId);
    try {
      const res = await redeemVoucher(shopSlug, voucherId, token);
      if (res.success && res.data) {
        setClaimedVoucher(res.data.voucher);
        setPoints((p) => p - (res.data!.voucher.pointsCost ?? 0));
        onRedeemed?.();
      } else {
        setError(res.error || "Redeem failed");
      }
    } catch (e) {
      setError("Something went wrong");
    } finally {
      setRedeemingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {claimedVoucher ? "Voucher claimed" : "Claim voucher"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            aria-label="Close"
          >
            <i className="ri-close-line text-2xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {claimedVoucher ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                You’ve claimed this voucher. Show the code at{" "}
                {merchantName || "the merchant"} to use it.
              </p>
              <VoucherCard voucher={claimedVoucher} />
              <div className="flex gap-2">
                <Button className="flex-1" onClick={onClose}>
                  Done
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setClaimedVoucher(null);
                  }}
                >
                  Claim another
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-500">Your points</p>
                <p className="text-2xl font-bold text-gray-900">{points} pts</p>
                {merchantName && (
                  <p className="text-xs text-gray-500 mt-1">at {merchantName}</p>
                )}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="py-8 text-center text-gray-500">
                  Loading vouchers…
                </div>
              ) : catalog.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  No vouchers available right now.
                </p>
              ) : (
                <ul className="space-y-3">
                  {catalog.map((v) => {
                    const canRedeem = points >= v.pointsCost;
                    const busy = redeemingId === v.id;
                    return (
                      <li
                        key={v.id}
                        className={cn(
                          "border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                          !canRedeem && "opacity-70"
                        )}
                      >
                        <div>
                          <p className="font-semibold text-gray-900">{v.name}</p>
                          <p className="text-sm text-gray-600 mt-0.5">
                            {v.description}
                          </p>
                          <p className="text-sm font-medium text-gray-700 mt-1">
                            {formatVoucherValue(v)} · {v.pointsCost} pts
                          </p>
                        </div>
                        <Button
                          disabled={!canRedeem || busy}
                          onClick={() => handleRedeem(v.id)}
                          className="shrink-0"
                        >
                          {busy ? "Claiming…" : "Redeem"}
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
