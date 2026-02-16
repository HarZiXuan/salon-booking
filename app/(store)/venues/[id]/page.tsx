"use client";

import { Button } from "@/components/ui/button";
import { VenueNav } from "@/components/venue/venue-nav";
import { TeamList } from "@/components/venue/team-list";
import { ReviewList } from "@/components/venue/review-list";
import { useState } from "react";
import { BookingWizard } from "@/components/venue/booking/wizard";
import { venuesData, serviceCategories, servicesData } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useParams, notFound } from "next/navigation";

export default function StorePage() {
    const params = useParams();
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
            <div className="container py-6 space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">{venue.name}</h1>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center font-semibold text-black">
                                {venue.rating} <i className="ri-star-fill text-yellow-500 ml-1"></i>
                                <span className="text-gray-500 font-normal ml-1">({venue.reviews} reviews)</span>
                            </span>
                            <span>•</span>
                            <span>{venue.address}</span>
                            <span>•</span>
                            <span className="text-green-600 font-medium">{venue.status}</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon"><i className="ri-share-line"></i></Button>
                        <Button variant="outline" size="icon"><i className="ri-heart-line"></i></Button>
                    </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                    <div className="col-span-2 row-span-2 relative bg-gray-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={venue.images[0]} alt="Salon Interior" className="w-full h-full object-cover" />
                    </div>
                    {venue.images.slice(1).map((img, i) => (
                        <div key={i} className="relative bg-gray-200 hidden md:block">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt="Salon Detail" className="w-full h-full object-cover" />
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
                                            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
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
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
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
