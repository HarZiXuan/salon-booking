"use client";

import React, { useState } from "react";

export default function MerchantBookingsPage() {
    const [activeTab, setActiveTab] = useState("all");

    const bookings = [
        { id: "BKG-1092", client: "Sarah Jenkins", service: "Balayage & Cut", date: "Oct 24, 2023", time: "09:00 AM", amount: "$185.00", status: "completed", provider: "Emily R." },
        { id: "BKG-1093", client: "Michael Chen", service: "Men's Haircut", date: "Oct 24, 2023", time: "11:30 AM", amount: "$45.00", status: "in-progress", provider: "David L." },
        { id: "BKG-1094", client: "Jessica Alba", service: "Gel Manicure", date: "Oct 24, 2023", time: "01:00 PM", amount: "$65.00", status: "pending", provider: "Sarah K." },
        { id: "BKG-1095", client: "Emma Watson", service: "Color Correction", date: "Oct 25, 2023", time: "10:00 AM", amount: "$220.00", status: "pending", provider: "Emily R." },
        { id: "BKG-1096", client: "Robert Downey", service: "Beard Trim", date: "Oct 25, 2023", time: "02:00 PM", amount: "$30.00", status: "cancelled", provider: "David L." },
        { id: "BKG-1097", client: "Chris Evans", service: "Haircut & Wash", date: "Oct 26, 2023", time: "11:00 AM", amount: "$55.00", status: "pending", provider: "David L." },
        { id: "BKG-1098", client: "Scarlett J.", service: "Full Set Acrylics", date: "Oct 26, 2023", time: "03:30 PM", amount: "$85.00", status: "completed", provider: "Sarah K." },
    ];

    const filteredBookings = activeTab === "all" ? bookings : bookings.filter(b => b.status === activeTab);

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case "completed":
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">Completed</span>;
            case "in-progress":
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">In Progress</span>;
            case "pending":
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">Pending</span>;
            case "cancelled":
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">Cancelled</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Bookings</h1>
                    <p className="text-neutral-500 mt-1">Manage and track all your appointments.</p>
                </div>
                <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
                    <i className="ri-add-line"></i> New Booking
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                    {[
                        { id: "all", label: "All Bookings" },
                        { id: "pending", label: "Pending" },
                        { id: "in-progress", label: "In Progress" },
                        { id: "completed", label: "Completed" },
                        { id: "cancelled", label: "Cancelled" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                    ? "bg-neutral-100 text-neutral-900"
                                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
                    <input
                        type="text"
                        placeholder="Search client or ID..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none text-sm transition-colors"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-neutral-600">
                        <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">Client</th>
                                <th className="px-6 py-4">Service & Provider</th>
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-neutral-900">{booking.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 font-medium font-serif">
                                                {booking.client.charAt(0)}
                                            </div>
                                            <span className="font-medium text-neutral-900">{booking.client}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-neutral-900">{booking.service}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">{booking.provider}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-neutral-900">{booking.date}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">{booking.time}</p>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-neutral-900">{booking.amount}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={booking.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                                            <i className="ri-more-2-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between text-sm">
                    <p className="text-neutral-500">
                        Showing <span className="font-medium text-neutral-900">1</span> to <span className="font-medium text-neutral-900">{filteredBookings.length}</span> of <span className="font-medium text-neutral-900">{filteredBookings.length}</span> entries
                    </p>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors disabled:opacity-50">
                            Previous
                        </button>
                        <button className="px-3 py-1.5 rounded-lg border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 transition-colors disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
