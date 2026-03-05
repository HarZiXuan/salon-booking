"use client";

import { cn } from "@/lib/utils";
import type { ClaimedVoucher } from "@/lib/loyalty-types";

interface VoucherCardProps {
  voucher: ClaimedVoucher;
  className?: string;
}

function formatValue(voucher: ClaimedVoucher): string {
  if (voucher.type === "fixed" && voucher.value) {
    return `RM ${voucher.value} off`;
  }
  if (voucher.type === "percent" && voucher.value) {
    return `${voucher.value}% off`;
  }
  if (voucher.type === "free_service" && voucher.value) {
    return voucher.value;
  }
  return voucher.name;
}

export function VoucherCard({ voucher, className }: VoucherCardProps) {
  const valueText = formatValue(voucher);
  const validUntil = voucher.validUntil
    ? new Date(voucher.validUntil).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white shadow-sm",
        "min-h-[160px] flex flex-col",
        className
      )}
    >
      {/* Top stripe - merchant branding */}
      <div className="bg-gray-900 px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          {voucher.merchantLogo ? (
            <div className="h-8 w-8 rounded-full overflow-hidden border border-white/20 bg-white flex items-center justify-center p-0.5 shrink-0">
              <img
                src={voucher.merchantLogo}
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
              <i className="ri-store-2-line text-sm" />
            </div>
          )}
          <span className="font-semibold text-sm truncate">
            {voucher.merchantName || "Merchant"}
          </span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 flex flex-col gap-2">
        <p className="font-bold text-lg text-gray-900 leading-tight">
          {voucher.name}
        </p>
        <p className="text-sm text-gray-600 line-clamp-2">
          {voucher.description}
        </p>
        <div className="mt-auto pt-2 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Value
          </p>
          <p className="font-bold text-gray-900">{valueText}</p>
        </div>
      </div>

      {/* Code and validity - bottom bar */}
      <div className="bg-gray-100 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-gray-500 font-medium">Code</p>
          <p className="font-mono font-bold text-gray-900 tracking-wider">
            {voucher.code}
          </p>
        </div>
        {validUntil && (
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">Valid until</p>
            <p className="text-sm font-semibold text-gray-700">{validUntil}</p>
          </div>
        )}
      </div>
    </div>
  );
}
