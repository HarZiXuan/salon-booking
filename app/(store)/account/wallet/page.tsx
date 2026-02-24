"use client";

export default function WalletPage() {
    return (
        <div className="flex flex-col min-h-full p-8 animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Wallet</h1>
                <p className="text-gray-500 mt-2">Manage your saved payment methods and balance.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {/* Balance Card */}
                <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-6 shadow-xl shadow-gray-900/10 relative overflow-hidden h-40">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <i className="ri-wallet-3-fill text-8xl"></i>
                    </div>
                    <p className="text-gray-400 font-medium text-sm mb-1 z-10 relative">Current Balance</p>
                    <h2 className="text-4xl font-bold mb-4 tracking-tight z-10 relative">RM 0.00</h2>
                    <button className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-lg px-4 py-2 border border-white/10 transition-colors backdrop-blur-sm z-10 relative">
                        Top up balance
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center h-40">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                        <i className="ri-bank-card-line text-2xl"></i>
                    </div>
                    <p className="font-semibold text-gray-900">No payment methods added</p>
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700 mt-2 hover:underline">
                        Add a new card
                    </button>
                </div>
            </div>
        </div>
    );
}
