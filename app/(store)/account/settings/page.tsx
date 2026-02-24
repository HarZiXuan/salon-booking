"use client";

export default function SettingsPage() {
    return (
        <div className="flex flex-col min-h-full p-8 animate-in fade-in duration-300">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
                <p className="text-gray-500 mt-2">Manage your app preferences and notifications.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-2xl space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="ri-notification-3-line text-blue-600"></i> Notifications
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-50">
                            <div>
                                <p className="font-semibold text-gray-900">Email Updates</p>
                                <p className="text-sm text-gray-500">Receive appointment reminders and promos via email.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between py-3 border-b border-gray-50">
                            <div>
                                <p className="font-semibold text-gray-900">SMS Reminders</p>
                                <p className="text-sm text-gray-500">Get text messages before your appointments.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="ri-shield-keyhole-line text-blue-600"></i> Security
                    </h3>
                    <div className="space-y-4">
                        <button className="flex items-center justify-between w-full p-4 rounded-xl border border-gray-200 hover:border-gray-900 hover:shadow-md transition-all text-left bg-gray-50/50">
                            <div>
                                <p className="font-bold text-gray-900">Change Password</p>
                                <p className="text-xs font-medium text-gray-500 mt-1">Update your account password</p>
                            </div>
                            <i className="ri-arrow-right-s-line text-xl text-gray-400"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
