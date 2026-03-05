/**
 * Types for Customer Loyalty Program (CLP).
 * Used by mock layer and future API integration.
 */

export type VoucherType = "fixed" | "percent" | "free_service";

export interface VoucherCatalogItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: VoucherType;
  value?: string;
  validUntil?: string;
}

export interface PointsBalance {
  shopSlug: string;
  merchantSlug?: string;
  merchantName?: string;
  points: number;
}

export interface ClaimedVoucher extends VoucherCatalogItem {
  code: string;
  validUntil: string;
  claimedAt: string;
  merchantName?: string;
  merchantLogo?: string;
}

export interface LoyaltyPointsResponse {
  success: boolean;
  data?: {
    points: number;
    merchantName?: string;
  };
  error?: string;
}

export interface LoyaltyVouchersResponse {
  success: boolean;
  data?: {
    vouchers: VoucherCatalogItem[] | ClaimedVoucher[];
  };
  error?: string;
}

export interface LoyaltyRedeemResponse {
  success: boolean;
  data?: {
    voucherCode: string;
    validUntil: string;
    voucher: ClaimedVoucher;
  };
  error?: string;
}
