"use client";

export default function ProfilePage() {
    return (
        <div className="flex flex-col min-h-full p-8 animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile</h1>
                <p className="text-gray-500 mt-2">Manage your personal information and preferences.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border-4 border-white shadow-md flex items-center justify-center">
                        <i className="ri-user-line text-4xl text-gray-400"></i>
                    </div>
                    <div>
                        <button className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-sm font-semibold rounded-lg transition-colors border border-gray-200">
                            Change Photo
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" defaultValue="Test Customer" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" defaultValue="customer@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="+60 12-345 6789" />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <button className="px-6 py-3 bg-black text-white text-sm font-bold rounded-xl shadow-lg shadow-black/10 hover:bg-gray-800 transition-all hover:-translate-y-0.5">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
