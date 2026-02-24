"use client";

import React from "react";

export default function MerchantDashboardHome() {
    const stats = [
        { label: "Today's Revenue", value: "$420.00", trend: "+12%", trendUp: true, icon: "ri-money-dollar-circle-line" },
        { label: "Bookings Today", value: "14", trend: "+2%", trendUp: true, icon: "ri-calendar-check-line" },
        { label: "New Clients", value: "4", trend: "-5%", trendUp: false, icon: "ri-user-add-line" },
        { label: "Completion Rate", value: "98%", trend: "+1%", trendUp: true, icon: "ri-checkbox-circle-line" },
    ];

    const todaySchedule = [
        { id: 1, time: "09:00 AM", client: "Sarah Jenkins", service: "Balayage & Cut", provider: "Emily R.", status: "completed" },
        { id: 2, time: "11:30 AM", client: "Michael Chen", service: "Men's Haircut", provider: "David Lee", status: "in-progress" },
        { id: 3, time: "01:00 PM", client: "Jessica Alba", service: "Gel Manicure", provider: "Sarah K.", status: "pending" },
        { id: 4, time: "02:45 PM", client: "Amanda Cruz", service: "Full Set Acrylics", provider: "Sarah K.", status: "pending" },
        { id: 5, time: "04:30 PM", client: "Chloe Styles", service: "Consultation", provider: "Emily R.", status: "pending" },
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Overview</h1>
                <p className="text-neutral-500 mt-1">Here's what's happening at your salon today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center text-neutral-700">
                                <i className={`${stat.icon} text-2xl`}></i>
                            </div>
                            <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${stat.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {stat.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                            <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Today's Schedule - Takes up 2/3 width on large screens */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-neutral-100 flex justify-between items-center">
                        <h2 className="text-lg font-semibold text-neutral-900">Today's Schedule</h2>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View Calendar</button>
                    </div>

                    <div className="divide-y divide-neutral-100">
                        {todaySchedule.map((appt) => (
                            <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="w-20 text-right">
                                        <span className="text-sm font-medium text-neutral-900">{appt.time.split(" ")[0]}</span>
                                        <span className="text-xs text-neutral-500 ml-1">{appt.time.split(" ")[1]}</span>
                                    </div>

                                    <div className="w-1 h-12 bg-neutral-200 rounded-full"></div>

                                    <div>
                                        <h3 className="text-base font-semibold text-neutral-900">{appt.client}</h3>
                                        <p className="text-sm text-neutral-500 mt-0.5">{appt.service} · {appt.provider}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {appt.status === 'completed' && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-200">
                                            Completed
                                        </span>
                                    )}
                                    {appt.status === 'in-progress' && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                            In Progress
                                        </span>
                                    )}
                                    {appt.status === 'pending' && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                            Pending
                                        </span>
                                    )}
                                    <button className="text-neutral-400 hover:text-neutral-900 p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                                        <i className="ri-more-2-fill text-lg"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions / Activity - Takes up 1/3 width */}
                <div className="space-y-6">
                    <div className="bg-neutral-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-neutral-800 rounded-full opacity-50"></div>
                        <div className="relative z-10">
                            <h3 className="text-lg font-semibold mb-2">New Booking Request</h3>
                            <p className="text-neutral-300 text-sm mb-6 leading-relaxed">
                                Emma W. is requesting a Color & Style with Emily R. for tomorrow at 10:00 AM.
                            </p>
                            <div className="flex gap-3">
                                <button className="bg-white text-neutral-900 px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-100 transition-colors flex-1">
                                    Accept
                                </button>
                                <button className="bg-neutral-800 text-white border border-neutral-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-neutral-700 transition-colors flex-1">
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
                        <h3 className="text-base font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                        <i className="ri-add-line text-lg"></i>
                                    </div>
                                    <span className="font-medium text-neutral-700 group-hover:text-neutral-900 text-sm">New Appointment</span>
                                </div>
                                <i className="ri-arrow-right-s-line text-neutral-400"></i>
                            </button>

                            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                        <i className="ri-user-add-line text-lg"></i>
                                    </div>
                                    <span className="font-medium text-neutral-700 group-hover:text-neutral-900 text-sm">Add Client</span>
                                </div>
                                <i className="ri-arrow-right-s-line text-neutral-400"></i>
                            </button>

                            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-neutral-900 transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600 group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                                        <i className="ri-price-tag-3-line text-lg"></i>
                                    </div>
                                    <span className="font-medium text-neutral-700 group-hover:text-neutral-900 text-sm">Create Offer</span>
                                </div>
                                <i className="ri-arrow-right-s-line text-neutral-400"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
