"use client";

import { Button } from "@/components/ui/button/button";
import { VenueNav } from "@/components/venue/venue-nav";
import { TeamList } from "@/components/venue/team-list";
import { ReviewList } from "@/components/venue/review-list";
import { useState } from "react";
import { BookingWizard } from "@/components/venue/booking/wizard";
import { venuesData, serviceCategories, servicesData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useParams, notFound, useRouter } from "next/navigation";

export default function StorePage() {
    const params = useParams();
    const router = useRouter();
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [initialServiceId, setInitialServiceId] = useState<string | undefined>(undefined);
    const [activeCategory, setActiveCategory] = useState("all");

    // Fetch venue based on ID
    const venueId = params?.id as string;
    const venue = venuesData.find(v => v.id === venueId);

    // Filter services for this venue
    const venueServices = servicesData.filter(s => s.venueId === venueId);

    // Filter categories that have services for this venue
    const availableCategories = serviceCategories.filter(cat =>
        cat.id === 'featured' || venueServices.some(s => s.categoryId === cat.id)
    );

    const handleBook = (serviceId?: string) => {
        setInitialServiceId(serviceId);
        setIsBookingOpen(true);
    };

    if (!venue) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Venue not found</h1>
                <p className="text-gray-500">The venue you are looking for does not exist.</p>
                <Button className="mt-4" onClick={() => window.location.href = '/'}>Go Home</Button>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Hero Section */}
            {/* Hero Section */}
            {/* Mobile Hero Layout */}
            <div className="md:hidden pb-4">
                {/* Breadcrumbs */}
                <div className="px-4 py-3 text-xs text-gray-500 font-medium flex items-center gap-1 overflow-x-auto whitespace-nowrap no-scrollbar">
                    <span>Home</span>
                    <span className="text-gray-300">•</span>
                    <span>Barbers</span>
                    <span className="text-gray-300">•</span>
                    <span>Johor Bahru</span>
                    <span className="text-gray-300">•</span>
                    <span className="truncate max-w-[150px]">{venue.name}</span>
                </div>

                {/* Mobile Image Hero */}
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={venue.images[0]} alt={venue.name} className="w-full h-full object-cover" />

                    {/* Overlay Buttons */}
                    <div className="absolute top-4 left-4 z-10">
                        <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full w-10 h-10 bg-white shadow-sm hover:bg-gray-100"
                            onClick={() => router.back()}
                        >
                            <i className="ri-arrow-left-line text-xl"></i>
                        </Button>
                    </div>
                    <div className="absolute top-4 right-4 z-10 flex gap-3">
                        <Button variant="secondary" size="icon" className="rounded-full w-10 h-10 bg-white shadow-sm hover:bg-gray-100">
                            <i className="ri-share-box-line text-xl"></i>
                        </Button>
                        <Button variant="secondary" size="icon" className="rounded-full w-10 h-10 bg-white shadow-sm hover:bg-gray-100">
                            <i className="ri-heart-line text-xl"></i>
                        </Button>
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
                        1/5
                    </div>
                </div>

                {/* Mobile Info Section */}
                <div className="px-4 pt-4 space-y-3">
                    <h1 className="text-2xl font-bold leading-tight text-gray-900">{venue.name}</h1>

                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            {venue.rating} <i className="ri-star-fill text-yellow-500 text-xs"></i>
                        </span>
                        <span className="text-blue-600 text-sm font-semibold">({venue.reviews})</span>
                    </div>

                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>10.4km</span>
                        <span>•</span>
                        <span className="line-clamp-1">{venue.address}</span>
                    </div>

                    <div className="text-sm">
                        <span className="text-green-600 font-medium">Open</span>
                        <span className="text-gray-500 ml-1">until 10:00pm</span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-3 pt-1">
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-purple-700 border border-purple-200 bg-purple-50">
                            Featured
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-green-700 border border-green-200 bg-green-50">
                            Deals
                        </span>
                    </div>
                </div>
            </div>

            {/* Desktop Hero Layout (Previous Design) */}
            <div className="hidden md:block container py-6 space-y-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="space-y-3 w-full">
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight">{venue.name}</h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700">
                            <span className="flex items-center font-bold text-black bg-gray-100 px-2 py-0.5 rounded-md">
                                {venue.rating} <i className="ri-star-fill text-yellow-500 ml-1"></i>
                                <span className="text-gray-500 font-normal ml-1">({venue.reviews})</span>
                            </span>
                            <span className="hidden leading-none text-gray-300 md:inline">•</span>
                            <span className="break-words">{venue.address}</span>
                            <span className="hidden leading-none text-gray-300 md:inline">•</span>
                            <span className="text-green-700 font-medium bg-green-50 px-2 py-0.5 rounded-md">{venue.status}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 self-end md:self-start">
                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-200 hover:border-black hover:bg-transparent"><i className="ri-share-line text-lg"></i></Button>
                        <Button variant="outline" size="icon" className="rounded-full w-10 h-10 border-gray-200 hover:border-black hover:bg-transparent"><i className="ri-heart-line text-lg"></i></Button>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="rounded-2xl overflow-hidden h-[280px] md:h-[400px] grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-2">
                    <div className="relative bg-gray-100 md:col-span-2 md:row-span-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={venue.images[0]} alt="Salon Interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    {venue.images.slice(1).map((img, i) => (
                        <div key={i} className="relative bg-gray-100 hidden md:block overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="Salon Detail" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Section Nav */}
            <VenueNav />

            {/* Main Content Two Column */}
            <div className="container py-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
                <div className="space-y-12 min-w-0">
                    <section id="services">
                        <div className="space-y-8">
                            {/* Category Pills */}
                            <div className="sticky top-14 z-30 bg-background py-4 -mx-4 px-4 overflow-x-auto no-scrollbar md:mx-0 md:px-0">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setActiveCategory("all")}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                                            activeCategory === "all"
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        All Services
                                    </button>
                                    {availableCategories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setActiveCategory(cat.id)}
                                            className={cn(
                                                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                                                activeCategory === cat.id
                                                    ? "bg-black text-white border-black"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                                            )}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Service Rows */}
                            <div className="divide-y border-t border-b md:border md:rounded-lg">
                                {venueServices
                                    .filter((s) => activeCategory === "all" || s.categoryId === activeCategory)
                                    .map((service) => (
                                        <div
                                            key={service.id}
                                            className="flex items-center justify-between py-4 md:p-4 hover:bg-gray-50 transition-colors group"
                                        >
                                            <div className="flex flex-col gap-1">
                                                <h3 className="font-semibold text-gray-900">{service.name}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2">{service.description}</p>
                                                <p className="text-sm text-gray-400 mt-1">{service.duration}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <span className="block font-semibold text-gray-900">RM {service.price}</span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="h-10 px-6 border-gray-300 hover:border-black hover:bg-transparent font-semibold"
                                                    onClick={() => handleBook(service.id)}
                                                >
                                                    Book
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                {venueServices.filter(s => activeCategory === "all" || s.categoryId === activeCategory).length === 0 && (
                                    <div className="p-8 text-center text-gray-500">No services in this category</div>
                                )}
                            </div>
                        </div>
                    </section>
                    <section id="team" className="scroll-mt-32">
                        <TeamList />
                    </section>
                    <section id="reviews" className="scroll-mt-32">
                        <ReviewList />
                    </section>
                    <section id="about" className="scroll-mt-32 pb-20">
                        <h2 className="text-xl font-bold mb-4">About</h2>
                        <p className="text-gray-600 leading-relaxed">
                            {venue.description || "Experienced professionals providing top-tier services in a relaxing atmosphere."}
                        </p>
                    </section>
                </div>

                {/* Desktop Sticky Sidebar */}
                <div className="hidden lg:block relative">
                    <div className="sticky top-24 border rounded-xl p-6 shadow-sm space-y-6">
                        <div className="text-center">
                            <h3 className="font-bold text-lg">{venue.name}</h3>
                            <p className="text-sm text-gray-500">{venue.address}</p>
                        </div>
                        <div className="text-center py-8 text-gray-500 border-t border-b">
                            <p>Self-care is not selfish</p>
                        </div>

                        <Button className="w-full h-12 text-lg" onClick={() => handleBook()}>
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white border-t lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Button className="w-full h-12 text-lg" onClick={() => handleBook()}>
                    Book Now
                </Button>
            </div>

            {/* Booking Wizard Modal */}
            {isBookingOpen && (
                <BookingWizard
                    onClose={() => setIsBookingOpen(false)}
                    initialServiceId={initialServiceId}
                    venue={venue}
                    services={venueServices}
                />
            )}
        </div>
    );
}
