"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fnbAvailableTimeSlots, fnbOutlet } from "@/lib/fnb-dummy-data";

export default function FnbReservationPage() {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [pax, setPax] = useState(2);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !selectedTime) {
            setError("Please select a date and time.");
            return;
        }
        setError("");
        const ref = `BK-${String(Date.now()).slice(-6)}`;
        router.push(`/fnb/reservation/success?ref=${ref}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(selectedTime)}&pax=${pax}`);
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Reserve a Table</h2>
            <p className="text-sm text-slate-500 mb-6">at {fnbOutlet.name}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Date */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Date</label>
                    <input
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none bg-white"
                    />
                </div>

                {/* Time slots */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Time</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {fnbAvailableTimeSlots.map((slot) => (
                            <button
                                type="button"
                                key={slot}
                                onClick={() => setSelectedTime(slot)}
                                className={`py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                                    selectedTime === slot
                                        ? "bg-slate-900 text-white border-slate-900"
                                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pax stepper */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Number of Guests</label>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setPax((p) => Math.max(1, p - 1))}
                            className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-xl font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            −
                        </button>
                        <span className="text-xl font-bold text-slate-900 w-8 text-center tabular-nums">{pax}</span>
                        <button
                            type="button"
                            onClick={() => setPax((p) => Math.min(20, p + 1))}
                            className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-xl font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Special notes */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">
                        Special Requests <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. allergies, high chair needed, anniversary..."
                        className="border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none resize-none bg-white"
                    />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                >
                    Request Reservation
                </button>
            </form>
        </div>
    );
}
