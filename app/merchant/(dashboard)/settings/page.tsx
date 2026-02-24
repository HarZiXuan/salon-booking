"use client";

import React, { useState } from "react";

export default function MerchantSettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");

    const tabs = [
        { id: "profile", label: "Business Profile", icon: "ri-store-2-line" },
        { id: "services", label: "Services & Pricing", icon: "ri-list-check-2" },
        { id: "hours", label: "Operating Hours", icon: "ri-time-line" },
        { id: "staff", label: "Staff Members", icon: "ri-group-line" },
        { id: "billing", label: "Billing & Payouts", icon: "ri-bank-card-line" },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Settings</h1>
                <p className="text-neutral-500 mt-1">Manage your business configuration and preferences.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-2 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible hide-scrollbar gap-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap lg:whitespace-normal text-left ${activeTab === tab.id
                                        ? "bg-neutral-900 text-white"
                                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                                    }`}
                            >
                                <i className={`${tab.icon} text-lg ${activeTab === tab.id ? "text-white" : "text-neutral-400"}`}></i>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Settings Content Area */}
                <div className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm">
                    {activeTab === "profile" && (
                        <div className="p-6 md:p-8">
                            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Business Profile</h2>

                            <div className="space-y-8 max-w-2xl">
                                {/* Logo Section */}
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-4">Business Logo</label>
                                    <div className="flex items-center gap-6">
                                        <div className="w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200">
                                            <span className="text-2xl font-serif text-neutral-400">BS</span>
                                        </div>
                                        <div>
                                            <div className="flex gap-3">
                                                <button className="px-4 py-2 bg-white border border-neutral-200 text-sm font-medium rounded-xl hover:bg-neutral-50 transition-colors shadow-sm">
                                                    Change
                                                </button>
                                                <button className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                                    Remove
                                                </button>
                                            </div>
                                            <p className="mt-2 text-xs text-neutral-500">JPG, GIF or PNG. Max size of 800K</p>
                                        </div>
                                    </div>
                                </div>

                                <hr className="border-neutral-100" />

                                {/* Info Section */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Business Name</label>
                                        <input type="text" defaultValue="Bella Salon & Spa" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-colors" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                                        <input type="email" defaultValue="contact@bellasalon.com" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-colors" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</label>
                                        <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-colors" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Website</label>
                                        <input type="url" defaultValue="https://www.bellasalon.com" className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-colors" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                                        <textarea rows={4} defaultValue="Premium salon services in the heart of downtown. We specialize in color correction, balayage, and luxury extensions." className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 outline-none transition-colors resize-none"></textarea>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button className="px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors shadow-sm">
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== "profile" && (
                        <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                    <i className="ri-tools-fill text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-medium text-neutral-900">Module Coming Soon</h3>
                                <p className="text-neutral-500 mt-2 max-w-sm mx-auto">
                                    The {tabs.find(t => t.id === activeTab)?.label} configuration is under development.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
