"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button/button";
import { useUserStore } from "@/global-store/user";
import { getMyBookingRefs, type MyBookingRef } from "@/lib/my-bookings";
import { fetchBookingDetails } from "@/app/actions/shop";

type BookingDetail = Record<string, unknown> | null;

export default function AppointmentsPage() {
    const user = useUserStore((s) => s.user);
    const [refs, setRefs] = useState<MyBookingRef[]>([]);
    const [details, setDetails] = useState<Record<string, BookingDetail>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) {
            setRefs([]);
            setDetails({});
            setLoading(false);
            return;
        }
        const list = getMyBookingRefs(user.id);
        setRefs(list);
        if (list.length === 0) {
            setLoading(false);
            return;
        }
        let cancelled = false;
        (async () => {
            const out: Record<string, BookingDetail> = {};
            for (const ref of list) {
                if (cancelled) break;
                try {
                    const res = await fetchBookingDetails(ref.id, ref.shopSlug);
                    if (res.success && res.data) {
                        const data = res.data as Record<string, unknown>;
                        out[ref.id] = (data.data as Record<string, unknown>) || data;
                    } else {
                        out[ref.id] = null;
                    }
                } catch {
                    out[ref.id] = null;
                }
            }
            if (!cancelled) setDetails(out);
            if (!cancelled) setLoading(false);
        })();
        return () => {
            cancelled = true;
        };
    }, [user?.id]);

    if (!user) return null;

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full py-20 px-4 animate-in fade-in duration-300">
                <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
                <p className="mt-4 text-sm text-gray-500">Loading appointments...</p>
            </div>
        );
    }

    if (refs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full py-20 px-4 animate-in fade-in duration-300">
                <div className="w-24 h-24 mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E2E8FF] via-[#E9D5FF] to-[#FCE7F3] rounded-2xl shadow-sm rotate-3 opacity-70"></div>
                    <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 flex items-center justify-center">
                        <i className="ri-calendar-2-fill text-5xl bg-gradient-to-br from-blue-400 to-purple-500 text-transparent bg-clip-text"></i>
                    </div>
                </div>
                <h1 className="text-[22px] font-bold text-gray-900 mb-3 tracking-tight">
                    No appointments yet
                </h1>
                <p className="text-sm font-medium text-gray-500 mb-8 max-w-sm text-center">
                    Your upcoming and past appointments will appear when you book
                </p>
                <Link href="/search">
                    <Button
                        variant="outline"
                        className="rounded-full border-gray-300 px-8 h-12 text-[15px] font-semibold hover:border-black hover:text-black hover:bg-gray-50 transition-all"
                    >
                        Start searching
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="py-8 px-4 max-w-2xl mx-auto animate-in fade-in duration-300">
            <h1 className="text-[22px] font-bold text-gray-900 mb-6 tracking-tight">
                My appointments
            </h1>
            <ul className="space-y-4">
                {refs.map((ref) => {
                    const d = details[ref.id];
                    const date = d && typeof d.date === "string" ? d.date : null;
                    const startTime = d && typeof d.start_time === "string" ? d.start_time : (d && typeof (d as any).start_time === "string" ? (d as any).start_time : null);
                    const status = d && typeof d.status === "string" ? d.status : "Pending";
                    const serviceName = d && (d.service as Record<string, unknown>)?.name != null
                        ? String((d.service as Record<string, unknown>).name)
                        : d && typeof (d as any).service_name === "string"
                            ? (d as any).service_name
                            : "Service";
                    const venueName = d && typeof (d as any).venue?.name === "string"
                        ? (d as any).venue.name
                        : d && typeof (d as any).shop_name === "string"
                            ? (d as any).shop_name
                            : null;
                    const href = ref.merchantSlug ? `/${ref.merchantSlug}` : "/search";
                    return (
                        <li
                            key={`${ref.shopSlug}-${ref.id}`}
                            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 truncate">{serviceName}</p>
                                    {(venueName || date || startTime) && (
                                        <p className="text-sm text-gray-500 mt-0.5">
                                            {[venueName, date, startTime].filter(Boolean).join(" · ")}
                                        </p>
                                    )}
                                    <span
                                        className={`
                                            inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full
                                            ${status === "completed" ? "bg-gray-100 text-gray-600" : ""}
                                            ${status === "cancelled" ? "bg-red-50 text-red-600" : ""}
                                            ${status === "pending" || status === "confirmed" ? "bg-amber-50 text-amber-700" : ""}
                                            ${!["completed", "cancelled", "pending", "confirmed"].includes(status) ? "bg-gray-100 text-gray-600" : ""}
                                        `}
                                    >
                                        {status}
                                    </span>
                                </div>
                                <Link
                                    href={href}
                                    className="shrink-0 text-sm font-medium text-black hover:underline"
                                >
                                    View
                                </Link>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
