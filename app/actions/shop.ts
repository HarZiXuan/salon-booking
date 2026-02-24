"use server";

import { apiFetch } from "@/lib/api";

export async function fetchShopDetails() {
    try {
        const response = await apiFetch<Record<string, unknown>>("");
        if (response.success && response.data) {
            return { success: true, data: response.data };
        }
        return { success: false, error: "Invalid response format" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}

export async function fetchCategories() {
    try {
        const response = await apiFetch<Record<string, unknown>>("/categories");
        if (response.success && response.data) {
            const dataObj = response.data as Record<string, unknown>;
            if (Array.isArray(dataObj.data)) {
                return { success: true, data: dataObj.data };
            }
            return { success: true, data: response.data };
        }
        return { success: false, error: "Invalid response format" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}

export async function fetchServices(category?: string) {
    try {
        const options = category ? { params: { category } } : {};
        const response = await apiFetch<Record<string, unknown>>("/services", options);
        if (response.success && response.data) {
            const dataObj = response.data as Record<string, unknown>;
            if (Array.isArray(dataObj.data)) {
                return { success: true, data: dataObj.data };
            }
            return { success: true, data: response.data };
        }
        return { success: false, error: "Invalid response format" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}

export async function fetchAllSpecialists() {
    try {
        const response = await apiFetch<Record<string, unknown>>("/specialists/all");
        if (response.success && response.data) {
            const dataObj = response.data as Record<string, unknown>;
            if (Array.isArray(dataObj.data)) {
                return { success: true, data: dataObj.data };
            }
            return { success: true, data: response.data };
        }
        return { success: false, error: "Invalid response format" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}

export async function fetchServiceSpecialists(serviceId: string, gender?: string) {
    try {
        const data: Record<string, unknown> = { service_id: serviceId };
        if (gender && gender !== "Any") {
            data.gender = gender;
        }
        const response = await apiFetch<Record<string, unknown>>("/specialists", {
            method: "POST",
            data
        });
        if (response.success && response.data) {
            const dataObj = response.data as Record<string, unknown>;
            if (Array.isArray(dataObj.data)) {
                return { success: true, data: dataObj.data };
            }
            return { success: true, data: response.data };
        }
        return { success: false, error: "Invalid response format" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}

export async function fetchAvailability(serviceId: string, specialistId: string, date: string) {
    try {
        const data: Record<string, unknown> = {
            service_id: serviceId,
            specialist_id: specialistId,
            date: date
        };
        const response = await apiFetch<Record<string, unknown>>("/availability/timeslots", {
            method: "POST",
            data
        });
        if (response.success && response.data) {
            const dataObj = response.data as Record<string, unknown>;
            if (Array.isArray(dataObj.data)) {
                return { success: true, data: dataObj.data };
            }
            return { success: true, data: response.data };
        }
        return { success: false, error: "Invalid response format" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}

export interface BookingPayload {
    service_id: string;
    staff_id: string;
    date: string;
    start_time: string;
    name: string;
    number: string;
    gender: string;
    notes?: string;
    email?: string;
}

export async function createBooking(payload: BookingPayload) {
    try {
        const data: Record<string, unknown> = { ...payload as unknown as Record<string, unknown> };

        const response = await apiFetch<Record<string, unknown>>("/bookings", {
            method: "POST",
            data
        });

        if (response.success) {
            return { success: true, data: response.data };
        }

        const errorMsg = response.message || (response.error as Record<string, unknown>)?.message || "Failed to create booking";
        return { success: false, error: String(errorMsg) };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return { success: false, error: error.message };
        }
        return { success: false, error: String(error) };
    }
}
