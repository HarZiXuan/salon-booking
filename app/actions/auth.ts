"use server";

import { apiFetch } from "@/lib/api";

export async function loginCustomer(payload: { contact: string; password: string; email?: string }) {
    try {
        const response = await apiFetch<Record<string, unknown>>("/customers/login", {
            method: "POST",
            data: payload
        });

        if (response.success && response.data) {
            return { success: true, data: response.data };
        }

        const errorMsg = response.message || (response.error as Record<string, unknown>)?.message || "Login failed";
        return { success: false, error: String(errorMsg) };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}

export async function registerCustomer(payload: { contact: string; password: string; password_confirmation: string; name?: string; email?: string; gender?: string; birthday?: string }) {
    try {
        const response = await apiFetch<Record<string, unknown>>("/customers/register", {
            method: "POST",
            data: payload
        });

        if (response.success && response.data) {
            return { success: true, data: response.data };
        }

        const errorMsg = response.message || (response.error as Record<string, unknown>)?.message || "Registration failed";
        return { success: false, error: String(errorMsg) };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}

export async function fetchCustomerInfo(token: string) {
    try {
        const response = await apiFetch<Record<string, unknown>>("/customers/me", {
            method: "GET",
            token
        });

        if (response.success && response.data) {
            return { success: true, data: response.data };
        }
        return { success: false, error: "Failed to fetch customer info" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}

export async function logoutCustomer(token: string) {
    try {
        const response = await apiFetch<Record<string, unknown>>("/customers/logout", {
            method: "POST",
            token
        });

        if (response.success) {
            return { success: true };
        }
        return { success: false, error: "Logout failed" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}
