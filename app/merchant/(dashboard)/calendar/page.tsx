"use client";

import React, { useState } from "react";
import { format, addDays, startOfWeek } from "date-fns";

export default function MerchantCalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Generate days for the week view
    const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start on Monday
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

    // Mock time slots (9 AM to 6 PM)
    const timeSlots = Array.from({ length: 10 }).map((_, i) => i + 9);

    // Mock appointments for the visual calendar
    const appointments = [
        { id: 1, day: 1, startHour: 9, duration: 2, title: "Balayage & Cut", client: "Sarah J.", color: "bg-purple-100 text-purple-700 border-purple-200" },
        { id: 2, day: 1, startHour: 11.5, duration: 1, title: "Men's Haircut", client: "Mike C.", color: "bg-blue-100 text-blue-700 border-blue-200" },
        { id: 3, day: 2, startHour: 10, duration: 1.5, title: "Gel Manicure", client: "Jessica A.", color: "bg-pink-100 text-pink-700 border-pink-200" },
        { id: 4, day: 3, startHour: 14, duration: 1, title: "Consultation", client: "Chloe S.", color: "bg-amber-100 text-amber-700 border-amber-200" },
        { id: 5, day: 4, startHour: 13, duration: 2.5, title: "Color Correction", client: "Emma W.", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    ];

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
            {/* Calendar Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold text-neutral-900">
                        {format(currentDate, "MMMM yyyy")}
                    </h1>
                    <div className="flex items-center rounded-lg border border-neutral-200 bg-neutral-50 p-1">
                        <button className="px-3 py-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-md hover:bg-white hover:shadow-sm transition-all">Day</button>
                        <button className="px-3 py-1 text-sm font-medium text-neutral-900 bg-white shadow-sm rounded-md transition-all">Week</button>
                        <button className="px-3 py-1 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-md hover:bg-white hover:shadow-sm transition-all">Month</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-2 border border-neutral-200 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                        <i className="ri-arrow-left-s-line"></i>
                    </button>
                    <button className="px-4 py-2 text-sm font-medium border border-neutral-200 rounded-xl text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                        Today
                    </button>
                    <button className="p-2 border border-neutral-200 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors">
                        <i className="ri-arrow-right-s-line"></i>
                    </button>
                    <button className="ml-2 px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-xl hover:bg-neutral-800 transition-colors flex items-center gap-2">
                        <i className="ri-add-line"></i> New
                    </button>
                </div>
            </div>

            {/* Calendar Grid (Week View) */}
            <div className="flex-1 overflow-auto flex flex-col">
                {/* Days Header */}
                <div className="flex border-b border-neutral-200 sticky top-0 bg-white z-10">
                    <div className="w-16 border-r border-neutral-200 flex-shrink-0"></div>
                    <div className="flex-1 grid grid-cols-7">
                        {weekDays.map((date, i) => {
                            const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                            return (
                                <div key={i} className="text-center py-3 border-r border-neutral-200 last:border-r-0">
                                    <p className="text-xs font-medium text-neutral-500 uppercase">{format(date, 'EEE')}</p>
                                    <div className={`mt-1 mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold ${isToday ? 'bg-neutral-900 text-white' : 'text-neutral-900'}`}>
                                        {format(date, 'd')}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Time Slots Grid */}
                <div className="flex flex-1 relative min-h-[600px]">
                    {/* Time axis */}
                    <div className="w-16 flex-shrink-0 border-r border-neutral-200 bg-neutral-50">
                        {timeSlots.map((hour) => (
                            <div key={hour} className="h-20 border-b border-neutral-200 relative">
                                <span className="absolute -top-3 right-2 text-xs text-neutral-500 bg-neutral-50 px-1">
                                    {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Grid Area */}
                    <div className="flex-1 grid grid-cols-7 relative">
                        {/* Grid lines */}
                        {Array.from({ length: 7 }).map((_, colIndex) => (
                            <div key={`col-${colIndex}`} className="border-r border-neutral-200 last:border-r-0 relative">
                                {timeSlots.map((_, rowIndex) => (
                                    <div key={`cell-${colIndex}-${rowIndex}`} className="h-20 border-b border-neutral-100 last:border-b-0 group">
                                        <div className="hidden group-hover:block absolute w-full h-full bg-blue-50/50 cursor-pointer">
                                            {/* Hover state for creating new appt */}
                                        </div>
                                    </div>
                                ))}

                                {/* Render appointments for this column (day) */}
                                {appointments.filter(a => a.day === colIndex).map((appt) => {
                                    const topOffset = (appt.startHour - 9) * 80; // 80px per hour
                                    const height = appt.duration * 80;

                                    return (
                                        <div
                                            key={appt.id}
                                            className={`absolute left-1 right-1 rounded-lg border ${appt.color} p-2 text-xs overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer z-10`}
                                            style={{ top: `${topOffset}px`, height: `${height}px` }}
                                        >
                                            <p className="font-semibold truncate">{appt.title}</p>
                                            <p className="truncate opacity-80">{appt.client}</p>
                                            <p className="mt-1 opacity-70">
                                                {Math.floor(appt.startHour) > 12 ? Math.floor(appt.startHour) - 12 : Math.floor(appt.startHour)}
                                                {appt.startHour % 1 !== 0 ? ':30' : ':00'}
                                                {appt.startHour >= 12 ? ' PM' : ' AM'}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}

                        {/* Current Time Line (Mocked at 10:45 AM) */}
                        <div className="absolute left-0 right-0 h-px bg-red-400 z-20 pointer-events-none flex items-center" style={{ top: `${(10.75 - 9) * 80}px` }}>
                            <div className="w-2 h-2 rounded-full bg-red-500 absolute -left-1"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
