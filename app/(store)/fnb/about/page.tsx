"use client";

import { useRouter } from "next/navigation";
import { fnbOutlet } from "@/lib/fnb-dummy-data";

export default function FnbAboutPage() {
    const router = useRouter();

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4 flex flex-col gap-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-2">About Us</h2>
                <p className="text-slate-600 text-[15px] leading-relaxed">{fnbOutlet.description}</p>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="relative h-48">
                    <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(fnbOutlet.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        className="w-full h-full border-0 pointer-events-none"
                        loading="lazy"
                        title="Location map"
                    />
                    <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(fnbOutlet.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-10"
                        aria-label="Open in Google Maps"
                    />
                </div>
                <div className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                        <i className="ri-map-pin-fill text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 leading-snug">{fnbOutlet.address}</span>
                    </div>
                    <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(fnbOutlet.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 px-4 py-2 rounded-xl border-2 border-slate-900 text-slate-900 font-semibold text-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                        Directions
                    </a>
                </div>
            </div>

            {/* Opening hours */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <i className="ri-time-line text-slate-400" /> Opening Hours
                </h3>
                <ul className="space-y-3">
                    {fnbOutlet.hours.map((schedule, idx) => (
                        <li
                            key={idx}
                            className="flex justify-between text-sm border-b border-slate-100 last:border-0 pb-2 last:pb-0"
                        >
                            <span className="font-medium text-slate-700">{schedule.day}</span>
                            <span
                                className={
                                    schedule.hours === "Closed"
                                        ? "text-red-500 font-semibold"
                                        : "text-slate-500"
                                }
                            >
                                {schedule.hours}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Contact & socials */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <i className="ri-customer-service-2-line text-slate-400" /> Contact &amp; Socials
                </h3>
                <div className="flex flex-col gap-3">
                    <a
                        href={`https://wa.me/${fnbOutlet.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                            <i className="ri-whatsapp-line text-xl text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">WhatsApp Us</p>
                            <p className="text-xs text-slate-500">+{fnbOutlet.phone}</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-slate-300 text-xl ml-auto" />
                    </a>

                    <a
                        href={fnbOutlet.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <i className="ri-instagram-line text-xl text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">Instagram</p>
                            <p className="text-xs text-slate-500">@ydt.dessert</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-slate-300 text-xl ml-auto" />
                    </a>

                    <a
                        href={fnbOutlet.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <i className="ri-facebook-fill text-xl text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">Facebook</p>
                            <p className="text-xs text-slate-500">YDT Dessert</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-slate-300 text-xl ml-auto" />
                    </a>
                </div>
            </div>

            {/* Reserve CTA */}
            <button
                onClick={() => router.push("/fnb/reservation")}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
            >
                Reserve a Table
            </button>
        </div>
    );
}
