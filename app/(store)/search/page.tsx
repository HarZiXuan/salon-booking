"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button/button";
import { venuesData, servicesData } from "@/lib/mock-data";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Helper to get services for a venue
const getVenueServices = (venueId: string) => {
    return servicesData.filter(service => service.venueId === venueId).slice(0, 3);
};

// Helper for total services count
const getTotalServicesCount = (venueId: string) => {
    return servicesData.filter(service => service.venueId === venueId).length;
};

export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";
    const [isMapVisible, setIsMapVisible] = useState(true);

    const filteredVenues = venuesData.filter(venue =>
        venue.name.toLowerCase().includes(query.toLowerCase()) ||
        venue.description.toLowerCase().includes(query.toLowerCase()) ||
        venue.address.toLowerCase().includes(query.toLowerCase()) ||
        venue.categoryId.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Filter Bar */}
            <div className="sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="text-sm text-gray-500 font-medium">
                    {filteredVenues.length} venues nearby
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="rounded-full border-gray-300 font-medium text-sm h-9 hover:bg-gray-50">
                        <i className="ri-equalizer-line mr-2"></i> Filters
                    </Button>
                    <Button
                        variant="outline"
                        className="rounded-full border-gray-300 font-medium text-sm h-9 hover:bg-gray-50"
                        onClick={() => setIsMapVisible(!isMapVisible)}
                    >
                        <i className={`ri-map-2-line mr-2`}></i>
                        {isMapVisible ? "Hide map" : "Show map"}
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Results List */}
                <div className={cn(
                    "h-full overflow-y-auto p-4 md:p-6 space-y-8 transition-all duration-300",
                    isMapVisible ? "w-full lg:w-[60%]" : "w-full max-w-5xl mx-auto"
                )}>
                    {filteredVenues.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-lg font-bold text-gray-900">No venues found</h3>
                            <p className="text-gray-500">Try adjusting your search or filters</p>
                        </div>
                    ) : (
                        filteredVenues.map((venue) => (
                            <VenueCard key={venue.id} venue={venue} />
                        ))
                    )}
                </div>

                {/* Map Section */}
                {isMapVisible && (
                    <div className="hidden lg:block w-[40%] bg-gray-100 relative border-l">
                        {/* Placeholder Map - In a real app, integrate Google Maps / Mapbox here */}
                        <div className="absolute inset-0 flex items-center justify-center bg-[#E5E9EC]">
                            <div className="text-center">
                                <i className="ri-map-pin-2-fill text-4xl text-gray-400 mb-2 block"></i>
                                <p className="text-gray-500 font-medium">Map View</p>
                                <p className="text-xs text-gray-400 mt-1">Interactive map would load here</p>
                            </div>

                            {/* Simulated Pins */}
                            <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black">
                                    5.0
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black">
                                    4.8
                                </div>
                            </div>
                            <div className="absolute bottom-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="bg-black text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg relative after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-black">
                                    4.9
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function VenueCard({ venue }: { venue: any }) {
    const services = getVenueServices(venue.id);
    const totalServices = getTotalServicesCount(venue.id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    return (
        <div className="bg-white group">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Image Carousel */}
                <div className="w-full md:w-[280px] shrink-0">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                        {/* Images */}
                        <div
                            className="flex transition-transform duration-300 ease-in-out h-full"
                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                        >
                            {venue.images.map((img: string, i: number) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`${venue.name} ${i + 1}`}
                                    className="w-full h-full object-cover shrink-0"
                                />
                            ))}
                        </div>

                        {/* Navigation Dots (Only show on hover) */}
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {venue.images.map((_: any, i: number) => (
                                <button
                                    key={i}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentImageIndex(i);
                                    }}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full shadow-sm transition-all",
                                        i === currentImageIndex ? "bg-white scale-110" : "bg-white/50 hover:bg-white/80"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Hover Overlay Arrows */}
                        <button
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentImageIndex(prev => Math.max(0, prev - 1));
                            }}
                            disabled={currentImageIndex === 0}
                        >
                            <i className="ri-arrow-left-s-line text-lg"></i>
                        </button>
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentImageIndex(prev => Math.min(venue.images.length - 1, prev + 1));
                            }}
                            disabled={currentImageIndex === venue.images.length - 1}
                        >
                            <i className="ri-arrow-right-s-line text-lg"></i>
                        </button>
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <div className="mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1 leading-tight group-hover:underline decoration-2 underline-offset-4 decoration-gray-900 cursor-pointer">
                                    <Link href={`/venues/${venue.id}`}>{venue.name}</Link>
                                </h3>
                                <p className="text-sm text-gray-500 mb-2 truncate">{venue.address}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 bg-gray-50 px-2 py-1 rounded-md">
                                <span className="font-bold text-gray-900">{venue.rating}</span>
                                <i className="ri-star-fill text-yellow-500 text-xs"></i>
                                <span className="text-gray-400 text-xs">({venue.reviews})</span>
                            </div>
                        </div>
                    </div>

                    {/* Services Preview */}
                    <div className="space-y-1 mb-4">
                        {services.map(service => (
                            <Link key={service.id} href={`/venues/${venue.id}`} className="block">
                                <div className="flex items-center justify-between py-2 border-b border-gray-50 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{service.name}</p>
                                        <p className="text-xs text-gray-500">{service.duration}</p>
                                    </div>
                                    <div className="pl-4 font-semibold text-gray-900 text-sm">
                                        RM {service.price}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Link
                        href={`/venues/${venue.id}`}
                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        See all {totalServices} services
                    </Link>
                </div>
            </div>
        </div>
    );
}
