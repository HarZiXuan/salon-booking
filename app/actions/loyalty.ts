"use server";

import { apiFetch } from "@/lib/api";

// ─── Types mirroring the real API response ────────────────────────────────────

export interface RewardCost {
    id: string;
    cost_type: "point" | "loyalty_card";
    cost_value: string;
}

export interface RewardCampaign {
    id: string;
    image: string | null;
    reward_type: "cashback_voucher" | "free_item" | "discount" | "item_voucher" | "point";
    is_active: boolean;
    value_type: "amount" | "percentage";
    value_amount: string | null;
    validity_days: number | null;
    costs: RewardCost[];
    campaign: { name: string; campaign_type: string } | null;
}

export interface RewardCampaignEntry {
    reward: RewardCampaign;
    is_eligible: boolean;
    reasons: string[];
}

export interface PointBalance {
    customer_id: number;
    name: string;
    phone: string;
    points: number;
    stamps: number;
}

export interface RedeemedReward {
    id: string;
    status: string;
    reward_id: string;
    voucher_code?: string;
    voucher_use_url?: string;
    qr_code_image_base64?: string;
    created_at: string;
    reward?: { reward_type: string; value_amount: string | null };
}

// ─── 1. Get reward catalog ────────────────────────────────────────────────────
export async function getRewards(shopSlug: string, token?: string | null) {
    try {
        const response = await apiFetch<{ success: boolean; data: { campaigns: RewardCampaignEntry[] }; message?: string }>(
            "/rewards",
            { method: "GET", shopSlug, token: token ?? undefined }
        );
        if (response.success && response.data) {
            return { success: true, data: response.data.campaigns };
        }
        return { success: false, error: response.message || "Failed to fetch rewards" };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

// ─── 2. Get point balance ─────────────────────────────────────────────────────
export async function getPointBalance(shopSlug: string, token: string) {
    try {
        const response = await apiFetch<{ success: boolean; data: PointBalance; message?: string }>(
            "/rewards/balance",
            { method: "GET", shopSlug, token }
        );
        if (response.success && response.data) {
            return { success: true, data: response.data };
        }
        return { success: false, error: response.message || "Failed to fetch balance" };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

// ─── 3. Send redemption OTP ───────────────────────────────────────────────────
export async function sendRedemptionOtp(shopSlug: string, rewardId: string, token: string) {
    try {
        const response = await apiFetch<{ success: boolean; message?: string }>(
            "/rewards/redeem/send-otp",
            { method: "POST", shopSlug, token, data: { reward_id: rewardId } }
        );
        if (response.success) {
            return { success: true, message: response.message || "OTP sent" };
        }
        return { success: false, error: response.message || "Failed to send OTP" };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

// ─── 4. Redeem reward ─────────────────────────────────────────────────────────
export async function redeemReward(shopSlug: string, rewardId: string, otp: string, token: string) {
    try {
        const response = await apiFetch<{ success: boolean; data: RedeemedReward; message?: string }>(
            "/rewards/redeem",
            { method: "POST", shopSlug, token, data: { reward_id: rewardId, otp } }
        );
        if (response.success && response.data) {
            return { success: true, data: response.data };
        }
        return { success: false, error: response.message || "Redemption failed" };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

// ─── 5. Get redemption history ────────────────────────────────────────────────
export async function getRedeemedRewards(shopSlug: string, token: string) {
    try {
        const response = await apiFetch<{ success: boolean; data: RedeemedReward[]; message?: string }>(
            "/rewards/redeemed",
            { method: "GET", shopSlug, token }
        );
        if (response.success && response.data) {
            return { success: true, data: response.data };
        }
        return { success: false, error: response.message || "Failed to fetch history" };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

// ─── 6. Get single redeemed reward detail ────────────────────────────────────
export async function getRedeemedRewardDetail(shopSlug: string, redeemedId: string, token: string) {
    try {
        const response = await apiFetch<{ success: boolean; data: RedeemedReward; message?: string }>(
            `/rewards/redeemed/${redeemedId}`,
            { method: "GET", shopSlug, token }
        );
        if (response.success && response.data) {
            return { success: true, data: response.data };
        }
        return { success: false, error: response.message || "Failed to fetch detail" };
    } catch (error: unknown) {
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}
