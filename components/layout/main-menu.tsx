"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button/button";
import * as Popover from "@radix-ui/react-popover";
import { useUserStore } from "@/global-store/user";

export function MainMenu() {
    const { user, logout } = useUserStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    const languages = [
        { code: "en", label: "English" },
        { code: "ms", label: "Bahasa Melayu" },
        { code: "zh", label: "中文" },
    ];

    return (
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
            <Popover.Trigger asChild>
                <Button variant="outline" className="rounded-full border-gray-300 font-semibold px-5 h-10 gap-3 hover:bg-gray-100 hover:text-black hover:border-gray-400 transition-all ml-1">
                    Menu <i className="ri-menu-line text-lg font-normal"></i>
                </Button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-2 w-[300px] mt-2 animate-in fade-in zoom-in-95 duration-200" align="end" sideOffset={8}>

                    {/* For customers section */}
                    <div className="px-4 py-3 pb-2">
                        <h3 className="text-sm font-bold text-gray-900">For customers</h3>
                    </div>

                    <div className="space-y-1">
                        {!user ? (
                            <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-blue-600 hover:bg-gray-50 rounded-lg transition-colors">
                                Log in or sign up
                            </Link>
                        ) : (
                            <button onClick={() => { logout(); setIsOpen(false); }} className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                                Log out
                            </button>
                        )}

                        <Link href="/help" onClick={() => setIsOpen(false)} className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            Help and support
                        </Link>

                        {/* Language Selector */}
                        <div className="relative">
                            <button
                                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <i className="ri-global-line text-lg text-gray-500"></i>
                                    <span>{selectedLanguage}</span>
                                </div>
                                <i className={`ri-arrow-down-s-line transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`}></i>
                            </button>

                            {isLanguageOpen && (
                                <div className="mx-2 mt-1 mb-2 bg-gray-50 rounded-lg border border-gray-100 overflow-hidden">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                setSelectedLanguage(lang.label);
                                                setIsLanguageOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-gray-100 ${selectedLanguage === lang.label ? 'font-bold text-black' : 'text-gray-600'}`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="my-2 border-t border-gray-100"></div>

                    {/* For businesses section */}
                    <div className="p-2">
                        <Link href="/for-business" onClick={() => setIsOpen(false)} className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors group">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm text-gray-900">For businesses</span>
                                <i className="ri-arrow-right-line text-gray-400 group-hover:text-gray-900 transition-colors"></i>
                            </div>
                            <p className="text-xs text-gray-500">List your business and grow</p>
                        </Link>
                    </div>

                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}

// Add these to globals.css if not present
/* 
@keyframes slideDownAndFade {
  from { opacity: 0; transform: translateY(-2px); }
  to { opacity: 1; transform: translateY(0); }
}
*/
