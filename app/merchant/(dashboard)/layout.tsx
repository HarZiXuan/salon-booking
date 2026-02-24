import React from "react";
import Sidebar from "@/components/merchant/layout/Sidebar";
import Header from "@/components/merchant/layout/Header";

export default function MerchantDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden bg-neutral-50">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile / Tablet overlay could go here in a fully responsive setup */}

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <Header />

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto w-full">
                    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
