"use client";

export default function ProductOrdersPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-full py-20 px-4 animate-in fade-in duration-300">
            <div className="w-24 h-24 mb-6 relative">
                <div className="absolute inset-0 bg-blue-50 rounded-2xl shadow-sm rotate-3 opacity-70"></div>
                <div className="absolute inset-0 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-center">
                    <i className="ri-shopping-bag-3-fill text-5xl text-blue-500"></i>
                </div>
            </div>

            <h1 className="text-[22px] font-bold text-gray-900 mb-3 tracking-tight">
                No product orders yet
            </h1>

            <p className="text-sm font-medium text-gray-500 mb-8 max-w-sm text-center">
                Any products you order from venues will appear here history for easy reordering.
            </p>

            <button className="rounded-full bg-gray-900 text-white hover:bg-black px-8 h-12 text-[15px] font-semibold transition-all shadow-md hover:-translate-y-0.5">
                Browse shops
            </button>
        </div>
    );
}
