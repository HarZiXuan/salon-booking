"use client";

import React, { useState } from "react";

export default function MerchantClientsPage() {
    const clients = [
        { id: 1, name: "Sarah Jenkins", email: "sarah.j@example.com", phone: "+1 555-0102", lastVisit: "Oct 24, 2023", totalVisits: 12, totalSpent: "$1,850" },
        { id: 2, name: "Michael Chen", email: "m.chen@example.com", phone: "+1 555-0199", lastVisit: "Oct 24, 2023", totalVisits: 3, totalSpent: "$135" },
        { id: 3, name: "Jessica Alba", email: "jessica@example.com", phone: "+1 555-0821", lastVisit: "Sep 15, 2023", totalVisits: 8, totalSpent: "$520" },
        { id: 4, name: "Emma Watson", email: "emma.w@example.com", phone: "+1 555-0344", lastVisit: "Oct 10, 2023", totalVisits: 22, totalSpent: "$4,200" },
        { id: 5, name: "Robert Downey", email: "robert.d@example.com", phone: "+1 555-0991", lastVisit: "Aug 02, 2023", totalVisits: 1, totalSpent: "$30" },
    ];

    return (
        <div className="space-y-6 flex flex-col h-full overflow-hidden">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Clients</h1>
                    <p className="text-neutral-500 mt-1">Manage your customer relationships.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-neutral-200 text-neutral-700 font-medium rounded-xl hover:bg-neutral-50 transition-colors shadow-sm flex items-center gap-2">
                        <i className="ri-download-2-line"></i> Export
                    </button>
                    <button className="px-4 py-2 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors shadow-sm flex items-center gap-2">
                        <i className="ri-user-add-line"></i> Add Client
                    </button>
                </div>
            </div>

            {/* Main Content Area - Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">
                {/* Table Toolbar */}
                <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative w-full sm:w-80">
                        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></i>
                        <input
                            type="text"
                            placeholder="Search clients by name, email, or phone..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none text-sm transition-colors"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-2 text-sm font-medium text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-1.5">
                            <i className="ri-filter-3-line"></i> Filter
                        </button>
                        <button className="px-3 py-2 text-sm font-medium text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-lg hover:bg-neutral-100 transition-colors flex items-center gap-1.5">
                            <i className="ri-arrow-up-down-line"></i> Sort
                        </button>
                    </div>
                </div>

                {/* Client List */}
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left text-sm text-neutral-600">
                        <thead className="bg-neutral-50/50 sticky top-0 z-10 border-b border-neutral-200 text-neutral-500 font-medium select-none">
                            <tr>
                                <th className="px-6 py-3.5 w-10">
                                    <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                                </th>
                                <th className="px-6 py-3.5">Client Info</th>
                                <th className="px-6 py-3.5">Contact</th>
                                <th className="px-6 py-3.5">Last Visit</th>
                                <th className="px-6 py-3.5">Total Visits</th>
                                <th className="px-6 py-3.5">Total Spent</th>
                                <th className="px-6 py-3.5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-neutral-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 font-medium font-serif shrink-0">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors cursor-pointer">{client.name}</span>
                                                <p className="text-xs text-neutral-500 mt-0.5">ID: CLI-{1000 + client.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-neutral-900">{client.email}</p>
                                        <p className="text-xs text-neutral-500 mt-0.5">{client.phone}</p>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-700">{client.lastVisit}</td>
                                    <td className="px-6 py-4 font-medium text-neutral-900">{client.totalVisits}</td>
                                    <td className="px-6 py-4 font-semibold text-green-700">{client.totalSpent}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="px-3 py-1.5 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors">
                                            View Profile
                                        </button>
                                        <button className="p-1.5 ml-2 text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                                            <i className="ri-more-2-fill"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 text-xs text-neutral-500 flex justify-between items-center">
                    <p>Showing 1 to 5 of 124 clients</p>
                    <div className="flex gap-1">
                        <button className="w-8 h-8 rounded border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 disabled:opacity-50 text-neutral-400"><i className="ri-arrow-left-s-line"></i></button>
                        <button className="w-8 h-8 rounded border border-neutral-900 bg-neutral-900 text-white flex items-center justify-center font-medium">1</button>
                        <button className="w-8 h-8 rounded border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 font-medium text-neutral-700">2</button>
                        <button className="w-8 h-8 rounded border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 font-medium text-neutral-700">3</button>
                        <button className="w-8 h-8 rounded border border-neutral-200 bg-white flex items-center justify-center hover:bg-neutral-50 text-neutral-700"><i className="ri-arrow-right-s-line"></i></button>
                    </div>
                </div>
            </div>
        </div>
    );
}
