import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function ForBusinessPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-[#0d1619]">
            {/* 1. Header (Sticky) */}
            <header className="fixed top-0 w-full h-20 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 flex items-center px-6 lg:px-12 justify-between">
                <Link href="/" className="font-bold text-2xl tracking-tight">SalonBooking</Link>
                <div className="hidden md:flex items-center gap-8 font-medium text-sm">
                    <Link href="#" className="hover:text-violet-600 transition-colors">Features</Link>
                    <Link href="#" className="hover:text-violet-600 transition-colors">Pricing</Link>
                    <Link href="#" className="hover:text-violet-600 transition-colors">Blog</Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-bold hover:text-violet-600 hidden sm:block">Log in</Link>
                    <Button asChild className="rounded-full bg-black text-white hover:bg-gray-800 h-10 px-6 text-sm font-bold">
                        <Link href="/merchant/signup">Join now</Link>
                    </Button>
                </div>
            </header>

            <main className="pt-20">

                {/* 2. Hero Section (Split Layout) */}
                <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 px-6 lg:px-12">
                    <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8 max-w-xl">
                            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                                The #1 booking software for <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">salons and spas</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed">
                                Simplify your business operations with our all-in-one platform.
                                Manage appointments, process payments, and attract new clients—commission free.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button asChild className="h-14 px-8 rounded-full bg-black text-white text-lg font-bold hover:scale-105 transition-transform">
                                    <Link href="/merchant/signup">Start for free</Link>
                                </Button>
                                <Button variant="outline" className="h-14 px-8 rounded-full border-2 text-lg font-bold hover:bg-gray-50">
                                    Watch video <i className="ri-play-circle-line ml-2 text-xl"></i>
                                </Button>
                            </div>
                            <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                <i className="ri-check-line text-green-500 text-lg"></i> No credit card needed
                                <span className="mx-2">•</span>
                                <i className="ri-check-line text-green-500 text-lg"></i> Cancel anytime
                            </p>
                        </div>
                        <div className="relative lg:h-[700px] w-full">
                            {/* Abstract UI Mockup */}
                            <div className="relative w-full h-full bg-gray-100 rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
                                {/* Fake Dashboard UI */}
                                <div className="absolute top-0 left-0 w-full h-16 bg-white border-b flex items-center px-6 gap-4">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="p-8 mt-16 grid grid-cols-3 gap-6">
                                    <div className="col-span-2 space-y-6">
                                        <div className="h-40 bg-white rounded-xl shadow-sm p-6 animate-pulse"></div>
                                        <div className="h-64 bg-white rounded-xl shadow-sm p-6 animate-pulse"></div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="h-full bg-white rounded-xl shadow-sm p-6 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Element */}
                            <div className="absolute -bottom-10 -left-10 w-64 bg-white p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border animate-bounce-slow">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <i className="ri-money-dollar-circle-line text-xl"></i>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold">Revenue today</p>
                                        <p className="font-bold text-lg">$1,240.50</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Sticky Sub-Nav (Pill Style) */}
                <div className="sticky top-20 bg-white/95 backdrop-blur z-40 border-b border-gray-100 py-4 overflow-x-auto">
                    <div className="max-w-[1400px] mx-auto px-6 flex gap-3">
                        {["Calendar", "Payments", "Marketing", "Analytics", "Inventory"].map((item, i) => (
                            <button key={item} className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${i === 0 ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. Feature Section (Zig Zag) */}
                <section className="py-24 px-6 lg:px-12 bg-gray-50/50">
                    <div className="max-w-[1200px] mx-auto space-y-32">

                        {/* Feature 1: Calendar */}
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="order-2 lg:order-1 relative">
                                <div className="aspect-square bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 transform hover:-rotate-1 transition-transform duration-500">
                                    {/* Mock Calendar UI */}
                                    <div className="w-full h-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-300 font-bold text-2xl">
                                        Calendar UI
                                    </div>
                                </div>
                            </div>
                            <div className="order-1 lg:order-2 space-y-6">
                                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 text-2xl mb-4">
                                    <i className="ri-calendar-check-fill"></i>
                                </div>
                                <h2 className="text-4xl font-bold tracking-tight">Master your schedule</h2>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Reduce no-shows and fill your calendar effortlessly. Our smart booking system sends automated reminders and lets clients book 24/7.
                                </p>
                                <ul className="space-y-3 text-gray-700 font-medium pt-2">
                                    <li className="flex items-center gap-3"><i className="ri-checkbox-circle-fill text-green-500 text-xl"></i> Unlimited appointments</li>
                                    <li className="flex items-center gap-3"><i className="ri-checkbox-circle-fill text-green-500 text-xl"></i> Drag & drop interface</li>
                                    <li className="flex items-center gap-3"><i className="ri-checkbox-circle-fill text-green-500 text-xl"></i> Staff management</li>
                                </ul>
                            </div>
                        </div>

                        {/* Feature 2: Marketing */}
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 text-2xl mb-4">
                                    <i className="ri-megaphone-fill"></i>
                                </div>
                                <h2 className="text-4xl font-bold tracking-tight">Attract & retain clients</h2>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Turn one-time visitors into loyal regulars with built-in marketing tools. Send personalized offers and birthday discounts automatically.
                                </p>
                                <Button variant="link" className="p-0 text-lg font-bold text-black hover:underline mt-2 h-auto">
                                    Explore marketing tools <i className="ri-arrow-right-line ml-2"></i>
                                </Button>
                            </div>
                            <div className="relative">
                                <div className="aspect-square bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 transform hover:rotate-1 transition-transform duration-500">
                                    {/* Mock Marketing UI */}
                                    <div className="w-full h-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center text-gray-300 font-bold text-2xl">
                                        Marketing UI
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 5. Big CTA Bottom */}
                <section className="py-24 px-6 bg-black text-white text-center">
                    <div className="max-w-3xl mx-auto space-y-8">
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight">Grow your business with SalonBooking</h2>
                        <p className="text-xl text-gray-400">Join over 100,000 professionals who trust us.</p>
                        <Button asChild className="h-16 px-10 text-xl rounded-full bg-white text-black font-bold hover:bg-gray-200 hover:scale-105 transition-all">
                            <Link href="/merchant/signup">Get started now</Link>
                        </Button>
                    </div>
                </section>

            </main>
        </div>
    );
}
