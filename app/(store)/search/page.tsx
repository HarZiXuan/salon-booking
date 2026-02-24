"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button/button";
import { fetchShopDetails, fetchServices } from "@/app/actions/shop";
import { normalizeShopToVenue } from "@/lib/normalize";
import Link from "next/link";
import { cn } from "@/lib/utils";

function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";
    const [isMapVisible, setIsMapVisible] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [venuesData, setVenuesData] = useState<Record<string, unknown>[]>([]);
    const [servicesData, setServicesData] = useState<Record<string, unknown>[]>([]);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [shopRes, servicesRes] = await Promise.all([
                    fetchShopDetails(),
                    fetchServices()
                ]);

                if (shopRes.success && shopRes.data) {
                    setVenuesData([normalizeShopToVenue(shopRes.data)]);
                }

                if (servicesRes.success && servicesRes.data) {
                    const services = (servicesRes.data as Record<string, unknown>[]).map(s => ({
                        ...s,
                        categoryId: s.category || "uncategorized",
                        duration: s.duration ? `${s.duration} mins` : "Varies",
                    }));
                    setServicesData(services);
                }
            } catch (error) {
                console.error("Failed to fetch search data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredVenues = venuesData.filter(venue =>
        String(venue.name || "").toLowerCase().includes(query.toLowerCase()) ||
        String(venue.description || "").toLowerCase().includes(query.toLowerCase()) ||
        String(venue.address || "").toLowerCase().includes(query.toLowerCase()) ||
        String(venue.categoryId || "").toLowerCase().includes(query.toLowerCase())
    );

    if (isLoading) {
        return <SearchLoadingFallback />;
    }

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
                            <VenueCard key={String(venue.id)} venue={venue} servicesData={servicesData} />
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

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchLoadingFallback />}>
            <SearchResults />
        </Suspense>
    );
}

function SearchLoadingFallback() {
    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            <div className="sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="text-sm text-gray-500 font-medium">Loading...</div>
            </div>
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                    </div>
                    <p className="mt-4 text-gray-500">Searching venues...</p>
                </div>
            </div>
        </div>
    );
}

function VenueCard({ venue, servicesData }: { venue: Record<string, unknown>, servicesData: Record<string, unknown>[] }) {
    const services = servicesData.slice(0, 3);
    const totalServices = servicesData.length;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const venueId = String(venue.id);
    const images = (venue.images as string[]) || [];

    return (
        <div className="bg-white group">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Image Carousel */}
                <div className="w-full md:w-[280px] shrink-0">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                        {/* Images */}
                        <Link href={`/venues/${venueId}`} className="block w-full h-full">
                            <div
                                className="flex transition-transform duration-300 ease-in-out h-full"
                                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                            >
                                {images.map((img: string, i: number) => (
                                    <img
                                        key={i}
                                        src={img}
                                        alt={`${String(venue.name || "")} ${i + 1}`}
                                        className="w-full h-full object-cover shrink-0 cursor-pointer"
                                    />
                                ))}
                            </div>
                        </Link>

                        {/* Navigation Dots (Only show on hover) */}
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {images.map((_: unknown, i: number) => (
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
                                setCurrentImageIndex(prev => Math.min(images.length - 1, prev + 1));
                            }}
                            disabled={currentImageIndex === images.length - 1}
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
                                    <Link href={`/venues/${venueId}`}>{String(venue.name || "")}</Link>
                                </h3>
                                <p className="text-sm text-gray-500 mb-2 truncate">{String(venue.address || "")}</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 bg-gray-50 px-2 py-1 rounded-md">
                                <span className="font-bold text-gray-900">{String(venue.rating || "5.0")}</span>
                                <i className="ri-star-fill text-yellow-500 text-xs"></i>
                                <span className="text-gray-400 text-xs">({String(venue.reviews || "0")})</span>
                            </div>
                        </div>
                    </div>

                    {/* Services Preview */}
                    <div className="space-y-1 mb-4">
                        {services.map(service => (
                            <Link key={String(service.id)} href={`/venues/${venueId}`} className="block">
                                <div className="flex items-center justify-between py-2 border-b border-gray-50 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors">
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{String(service.name)}</p>
                                        <p className="text-xs text-gray-500">{String(service.duration)}</p>
                                    </div>
                                    <div className="pl-4 font-semibold text-gray-900 text-sm">
                                        RM {String(service.price)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    <Link
                        href={`/venues/${venueId}`}
                        className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        See all {totalServices} services
                    </Link>
                </div>
            </div>
        </div>
    );
}
