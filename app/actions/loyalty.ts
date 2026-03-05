"use server";

import type {
  LoyaltyPointsResponse,
  LoyaltyVouchersResponse,
  LoyaltyRedeemResponse,
} from "@/lib/loyalty-types";
import {
  getMockPoints,
  getMockVoucherCatalog,
  getMockMyVouchers,
  redeemMockVoucher,
} from "@/lib/mock-loyalty";

/**
 * Get current customer's points for a shop.
 * Uses mock data; later swap to apiFetch with shopSlug + token.
 */
export async function getPoints(
  shopSlug: string,
  token?: string | null
): Promise<LoyaltyPointsResponse> {
  if (!shopSlug) return { success: false, error: "Shop slug required" };
  return getMockPoints(shopSlug, token ?? undefined);
}

/**
 * Get voucher catalog for a shop.
 */
export async function getVoucherCatalog(
  shopSlug: string
): Promise<LoyaltyVouchersResponse> {
  if (!shopSlug) return { success: false, error: "Shop slug required" };
  return getMockVoucherCatalog(shopSlug);
}

/**
 * Get vouchers claimed by the current customer for a shop.
 */
export async function getMyVouchers(
  shopSlug: string,
  token?: string | null
): Promise<LoyaltyVouchersResponse> {
  if (!shopSlug) return { success: false, error: "Shop slug required" };
  return getMockMyVouchers(shopSlug, token ?? undefined);
}

/**
 * Redeem points for a voucher. Returns the claimed voucher on success.
 */
export async function redeemVoucher(
  shopSlug: string,
  voucherId: string,
  token?: string | null
): Promise<LoyaltyRedeemResponse> {
  if (!shopSlug) return { success: false, error: "Shop slug required" };
  if (!voucherId) return { success: false, error: "Voucher ID required" };
  return redeemMockVoucher(shopSlug, voucherId, token ?? undefined);
}
