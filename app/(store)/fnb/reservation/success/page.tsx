"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { fnbOutlet } from "@/lib/fnb-dummy-data";

function SuccessContent() {
    const params = useSearchParams();
    const router = useRouter();
    const ref = params.get("ref") ?? "BK-000000";
    const date = params.get("date") ?? "";
    const time = params.get("time") ?? "";
    const pax = params.get("pax") ?? "1";

    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-MY", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "—";

    return (
        <div className="max-w-md mx-auto px-4 py-10 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-5xl text-green-500" />
            </div>

            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Booking Requested!</h3>
                <p className="text-slate-500 text-sm">
                    The outlet will contact you shortly to confirm your reservation.
                </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-3 w-full">
                <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mb-1">
                    Booking Reference
                </p>
                <p className="text-2xl font-bold text-amber-900 tracking-widest">{ref}</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 w-full text-left space-y-3 shadow-sm">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Outlet</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[55%]">{fnbOutlet.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[55%]">{formattedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Time</span>
                    <span className="font-semibold text-slate-800">{time}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Guests</span>
                    <span className="font-semibold text-slate-800">{pax} pax</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
                <button
                    onClick={() => router.push("/fnb/wallet")}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    View My Wallet
                </button>
                <button
                    onClick={() => router.push("/fnb/news")}
                    className="w-full border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    Back to Offers
                </button>
            </div>
        </div>
    );
}

export default function FnbReservationSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center py-12">
                    <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
                </div>
            }
        >
            <SuccessContent />
        </Suspense>
    );
}
