/**
 * Mock loyalty data and in-memory store for CLP.
 * Replace with real apiFetch calls when backend implements LOYALTY_API.md.
 */

import type {
  VoucherCatalogItem,
  ClaimedVoucher,
  LoyaltyPointsResponse,
  LoyaltyVouchersResponse,
  LoyaltyRedeemResponse,
} from "./loyalty-types";

const DEFAULT_POINTS = 150;

const MERCHANT_NAMES: Record<string, string> = {
  service: "Kapas Beauty Spa",
  yishun: "Yishun Salon",
};

const MOCK_CATALOG: Record<string, VoucherCatalogItem[]> = {
  service: [
    {
      id: "v1",
      name: "RM10 Off",
      description: "RM10 off your next visit",
      pointsCost: 100,
      type: "fixed",
      value: "10",
    },
    {
      id: "v2",
      name: "15% Off",
      description: "15% off any service",
      pointsCost: 150,
      type: "percent",
      value: "15",
    },
    {
      id: "v3",
      name: "Free Add-on",
      description: "Free aromatherapy add-on (60 min)",
      pointsCost: 80,
      type: "free_service",
      value: "Aromatherapy Add-on",
    },
  ],
  yishun: [
    {
      id: "vy1",
      name: "RM15 Off",
      description: "RM15 off next booking",
      pointsCost: 120,
      type: "fixed",
      value: "15",
    },
    {
      id: "vy2",
      name: "20% Off",
      description: "20% off any treatment",
      pointsCost: 200,
      type: "percent",
      value: "20",
    },
  ],
};

interface PerShopState {
  points: number;
  claimed: ClaimedVoucher[];
}

const mockStore = new Map<string, PerShopState>();

function storeKey(token: string | undefined, shopSlug: string): string {
  return `${token || "anon"}:${shopSlug}`;
}

function getState(token: string | undefined, shopSlug: string): PerShopState {
  const key = storeKey(token, shopSlug);
  if (!mockStore.has(key)) {
    mockStore.set(key, { points: DEFAULT_POINTS, claimed: [] });
  }
  return mockStore.get(key)!;
}

function addClaimed(
  token: string | undefined,
  shopSlug: string,
  item: VoucherCatalogItem,
  code: string
): ClaimedVoucher {
  const state = getState(token, shopSlug);
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);
  const claimed: ClaimedVoucher = {
    ...item,
    code,
    validUntil: validUntil.toISOString().slice(0, 10),
    claimedAt: new Date().toISOString(),
    merchantName: MERCHANT_NAMES[shopSlug],
  };
  state.claimed.push(claimed);
  return claimed;
}

export function getMockPoints(
  shopSlug: string,
  token?: string
): LoyaltyPointsResponse {
  const state = getState(token, shopSlug);
  return {
    success: true,
    data: {
      points: state.points,
      merchantName: MERCHANT_NAMES[shopSlug],
    },
  };
}

export function getMockVoucherCatalog(
  shopSlug: string
): LoyaltyVouchersResponse {
  const vouchers = MOCK_CATALOG[shopSlug] ?? [];
  return {
    success: true,
    data: { vouchers },
  };
}

export function getMockMyVouchers(
  shopSlug: string,
  token?: string
): LoyaltyVouchersResponse {
  const state = getState(token, shopSlug);
  return {
    success: true,
    data: { vouchers: [...state.claimed] },
  };
}

export function redeemMockVoucher(
  shopSlug: string,
  voucherId: string,
  token?: string
): LoyaltyRedeemResponse {
  const catalog = MOCK_CATALOG[shopSlug] ?? [];
  const item = catalog.find((v) => v.id === voucherId);
  if (!item) {
    return { success: false, error: "Voucher not found" };
  }
  const state = getState(token, shopSlug);
  if (state.points < item.pointsCost) {
    return { success: false, error: "Insufficient points" };
  }
  state.points -= item.pointsCost;
  const code = `SPA-${shopSlug.toUpperCase().slice(0, 2)}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const voucher = addClaimed(token, shopSlug, item, code);
  const validUntil = voucher.validUntil;
  return {
    success: true,
    data: { voucherCode: code, validUntil, voucher },
  };
}

export function getDefaultMerchantName(shopSlug: string): string {
  return MERCHANT_NAMES[shopSlug] ?? shopSlug;
}
