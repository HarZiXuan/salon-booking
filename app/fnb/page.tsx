"use client";

import { useState } from "react";
import dynamic from 'next/dynamic';
import { fnbNews, fnbRewards, fnbOutlet } from "@/lib/fnb-dummy-data";
import { FnbNav } from "@/components/fnb/fnb-nav";

const QRCodeSVG = dynamic(() => import('qrcode.react').then((mod) => mod.QRCodeSVG), { ssr: false });

export default function FnbPage() {
    const [selectedReward, setSelectedReward] = useState<string | null>(null);
    const [bookingSubmitted, setBookingSubmitted] = useState(false);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: fnbOutlet.name, url: window.location.href }).catch(() => { });
        }
    };

    const scrollToReservation = () => {
        const element = document.getElementById("reservation");
        if (element) {
            const offset = 140;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            window.scrollTo({ top: elementRect - bodyRect - offset, behavior: "smooth" });
        }
    };

    return (
        <div className="relative">
            {/* Mobile Hero Layout */}
            <div className="md:hidden p-4 pb-4">
                <div className="relative w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                    <img src={fnbOutlet.images[0]} alt={fnbOutlet.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none z-10"></div>
                    <div className="absolute top-4 right-4 z-20 flex gap-2">
                        <button
                            onClick={handleShare}
                            className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 border border-white/50 flex items-center justify-center text-white backdrop-blur-md transition-all"
                        >
                            <i className="ri-share-line text-lg"></i>
                        </button>
                    </div>
                </div>
                <div className="pt-4 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-[50px] h-[50px] rounded-full border border-gray-200 overflow-hidden bg-white shrink-0 shadow-sm flex items-center justify-center">
                            <span className="text-xl font-bold font-serif text-slate-800">Z</span>
                        </div>
                        <h1 className="text-2xl font-bold leading-tight text-gray-900">{fnbOutlet.name}</h1>
                    </div>
                    <div className="flex items-start gap-1.5 text-[13px] text-gray-900 font-medium">
                        <i className="ri-map-pin-fill text-black mt-[1px]"></i>
                        <span className="line-clamp-2 leading-snug">{fnbOutlet.address}</span>
                    </div>
                    <div className="flex flex-wrap items-center text-[12px] text-gray-800 gap-2 font-medium bg-white">
                        <span className="text-gray-900">Open</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                        <span>{fnbOutlet.hours[0].hours}</span>
                    </div>
                    
                    {/* VIP Mobile Membership Card Placeholder */}
                    <div className="rounded-2xl overflow-hidden ring-1 ring-inset ring-[#e4cb93]/30 shadow-2xl bg-gradient-to-br from-[#dec081] via-[#fae7b9] to-[#c6a04f] xl:from-[#dabb7c] xl:via-[#fdf0cc] xl:to-[#cda652] text-[#624615] relative mt-1">
                        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>
                        <div className="p-4 flex items-center justify-between gap-3 relative z-10">
                            <div className="min-w-0 pt-1">
                                <p className="text-[10px] font-bold text-[#8a6522] uppercase tracking-[0.1em] mb-[1px]">VIP Member</p>
                                <p className="font-bold text-[#4a350f] truncate">{fnbOutlet.name}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-2xl font-bold tabular-nums tracking-tight text-[#4a350f] drop-shadow-sm">1,200</p>
                                <p className="text-[10px] font-semibold text-[#8a6522] uppercase tracking-wider">Points</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Hero Layout */}
            <div className="hidden md:block container py-6">
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden group shadow-lg">
                    <img src={fnbOutlet.images[0]} alt={fnbOutlet.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div>
                    <div className="absolute top-6 right-6 flex gap-3">
                        <button onClick={handleShare} className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 border border-white/50 flex items-center justify-center text-white backdrop-blur-md transition-all">
                            <i className="ri-share-line text-lg"></i>
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                        <div className="flex flex-col gap-3">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] border-white overflow-hidden bg-white shadow-lg mb-2 flex items-center justify-center flex-shrink-0">
                                <span className="text-4xl font-bold font-serif text-slate-800">Z</span>
                            </div>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">{fnbOutlet.name}</h1>
                                <div className="flex items-center text-white/90 text-sm md:text-base gap-1.5 font-medium">
                                    <i className="ri-map-pin-2-fill text-lg"></i>
                                    <span>{fnbOutlet.address}</span>
                                </div>
                            </div>
                            <div className="flex items-center text-sm text-white/90 gap-2 md:gap-3 font-medium mt-1">
                                <span className="text-green-400">Open</span>
                                <span className="w-1 h-1 rounded-full bg-white/40"></span>
                                <span>{fnbOutlet.hours[0].hours}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Section Nav */}
            <FnbNav />

            {/* Main Content Two Column */}
            <div className="container py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                <div className="space-y-16 min-w-0">
                    
                    {/* NEWS SECTION */}
                    <section id="news" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-2">News & Promos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fnbNews.map((news) => (
                                <div key={news.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                                    <div className="h-48 w-full bg-slate-200 bg-cover bg-center" style={{ backgroundImage: `url(${news.image})` }} />
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-slate-800">{news.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{news.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* REWARDS SECTION */}
                    <section id="rewards" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-2">Rewards</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {fnbRewards.map((reward) => (
                                <div key={reward.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{reward.name}</h3>
                                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full inline-block mt-2">
                                            {reward.points} Points Cost
                                        </span>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedReward(reward.id)}
                                        className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors whitespace-nowrap"
                                    >
                                        Redeem
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* RESERVATION SECTION */}
                    <section id="reservation" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-2">Reserve a Table</h2>
                        {bookingSubmitted ? (
                            <div className="p-8 flex flex-col items-center justify-center bg-white border border-green-100 rounded-2xl shadow-sm">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4">✓</div>
                                <h3 className="text-xl font-bold text-slate-800">Booking Requested!</h3>
                                <p className="text-slate-500">The outlet will contact you shortly to confirm your table.</p>
                                <button onClick={() => setBookingSubmitted(false)} className="mt-4 text-slate-900 font-bold underline">Make another booking</button>
                            </div>
                        ) : (
                            <form className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); setBookingSubmitted(true); }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Date</label>
                                        <input type="date" required className="border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none w-full" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-slate-700">Time</label>
                                        <select required className="border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none w-full bg-white">
                                            <option value="">Select a time</option>
                                            <option value="12:00">12:00 PM</option>
                                            <option value="18:30">6:30 PM</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Number of Guests</label>
                                    <input type="number" min="1" max="20" placeholder="e.g. 2" required className="border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none w-full" />
                                </div>
                                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors mt-2">
                                    Request Reservation
                                </button>
                            </form>
                        )}
                    </section>

                    {/* ABOUT SECTION */}
                    <section id="about" className="scroll-mt-32">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-2">About</h2>
                        <p className="text-slate-600 leading-relaxed mb-6">{fnbOutlet.description}</p>
                        
                        <div className="bg-slate-100 h-64 rounded-2xl mb-6 relative overflow-hidden flex items-center justify-center border border-slate-200">
                            <iframe
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(fnbOutlet.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                className="absolute inset-0 w-full h-full border-0 pointer-events-none opacity-50 grayscale"
                                loading="lazy"
                            ></iframe>
                            <span className="relative z-10 bg-white/80 px-4 py-2 rounded-lg font-bold text-slate-600 backdrop-blur-sm shadow-sm">{fnbOutlet.address}</span>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                            <h3 className="font-bold text-lg mb-4 text-slate-800">Opening Hours</h3>
                            <ul className="space-y-3">
                                {fnbOutlet.hours.map((schedule, idx) => (
                                    <li key={idx} className="flex justify-between border-b border-slate-200 last:border-0 pb-2 last:pb-0">
                                        <span className="font-medium text-slate-700">{schedule.day}</span>
                                        <span className="text-slate-500">{schedule.hours}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* GUIDE SECTION */}
                    <section id="guide" className="scroll-mt-32 pb-16">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900 border-b pb-2">Rewards Guide</h2>
                        <div className="flex flex-col gap-6 relative ml-2">
                            <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-slate-200"></div>
                            
                            {[
                                { step: 1, title: "Visit the Outlet", desc: "Head down to any of our participating locations." },
                                { step: 2, title: "Tap Redeem", desc: "Choose an item from the Rewards tab and tap Redeem. A unique QR code will appear." },
                                { step: 3, title: "Show QR Code", desc: "Present the QR code on your screen to our friendly staff for them to scan." },
                                { step: 4, title: "Enjoy!", desc: "Collect your freshly prepared reward.", color: "green" }
                            ].map((s, i) => (
                                <div key={i} className="flex gap-4 relative z-10 items-start">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm border-4 border-white ${s.color === "green" ? "bg-green-500 text-white ring-2 ring-green-100" : "bg-slate-900 text-white"}`}>
                                        {s.color === "green" ? "✓" : s.step}
                                    </div>
                                    <div className={`p-4 rounded-xl shadow-sm border flex-1 mt-1 ${s.color === "green" ? "bg-green-50 border-green-100" : "bg-white border-slate-100"}`}>
                                        <h3 className={`font-bold ${s.color === "green" ? "text-green-800" : "text-slate-800"}`}>{s.title}</h3>
                                        <p className="text-sm text-slate-600 mt-1">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Desktop Sticky Sidebar */}
                <div className="hidden lg:block relative">
                    <div className="sticky top-40 border rounded-2xl p-6 shadow-sm space-y-6 bg-white">
                        <div className="text-center">
                            <h3 className="font-bold text-lg text-slate-900">{fnbOutlet.name}</h3>
                            <p className="text-sm text-slate-500">{fnbOutlet.address}</p>
                        </div>
                        
                        <button onClick={scrollToReservation} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                            Reserve Now
                        </button>

                        <div className="rounded-2xl overflow-hidden ring-1 ring-inset ring-[#e4cb93]/30 shadow-xl bg-gradient-to-br from-[#dec081] via-[#fae7b9] to-[#c6a04f] xl:from-[#dabb7c] xl:via-[#fdf0cc] xl:to-[#cda652] text-[#624615] relative mt-4">
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none"></div>
                            <div className="p-5 flex items-center justify-between gap-3 relative z-10">
                                <div className="min-w-0 pt-1">
                                    <p className="text-[10px] font-bold text-[#8a6522] uppercase tracking-[0.1em] mb-[1px]">VIP Member</p>
                                    <p className="font-bold text-base text-[#4a350f] truncate">{fnbOutlet.name}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-2xl font-bold tabular-nums tracking-tight text-[#4a350f] drop-shadow-sm">1,200</p>
                                    <p className="text-[10px] font-semibold text-[#8a6522] uppercase tracking-wider">Points</p>
                                </div>
                            </div>
                            <div className="px-5 pb-5 flex flex-col gap-2 relative z-10">
                                <button className="w-full rounded-xl bg-gradient-to-b from-[#4a350f] to-[#342407] text-[#fae7b9] py-2 text-sm font-semibold border border-[#342407] tracking-wide shadow-md hover:scale-[1.02] transition-transform">
                                    Claim voucher
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white border-t lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <button onClick={scrollToReservation} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-md">
                    Reserve Now
                </button>
            </div>

            {/* QR Modal Overlay */}
            {selectedReward && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-200">
                        <h3 className="font-bold text-xl mb-6 text-slate-900">Scan to Redeem</h3>
                        <div className="bg-white ring-4 ring-slate-100 p-4 rounded-xl mb-6">
                            <QRCodeSVG value={`REDEEM-${selectedReward}-${Date.now()}`} size={200} />
                        </div>
                        <p className="text-sm text-slate-500 mb-6 text-center leading-relaxed">
                            Show this QR code to our staff at the cashier to claim your chosen reward.
                        </p>
                        <button onClick={() => setSelectedReward(null)} className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
