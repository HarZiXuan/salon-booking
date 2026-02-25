"use client";

import { Button } from "@/components/ui/button/button";
import { VenueNav } from "@/components/venue/venue-nav";
import { TeamList } from "@/components/venue/team-list";
import { ReviewList } from "@/components/venue/review-list";
import { useState, useRef, useEffect } from "react";
import { BookingWizard } from "@/components/venue/booking/wizard";
import { fetchShopDetails, fetchServices, fetchCategories, fetchAllSpecialists } from "@/app/actions/shop";
import { normalizeShopToVenue } from "@/lib/normalize";
import { cn } from "@/lib/utils";
import { useParams, notFound, useRouter } from "next/navigation";

export default function StorePage() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [venue, setVenue] = useState<Record<string, unknown> | null>(null);
    const [venueServices, setVenueServices] = useState<Record<string, unknown>[]>([]);
    const [teamMembers, setTeamMembers] = useState<Record<string, unknown>[]>([]);
    const [availableCategories, setAvailableCategories] = useState<{ id: string, label: string }[]>([]);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [initialServiceId, setInitialServiceId] = useState<string | undefined>(undefined);
    const [activeCategory, setActiveCategory] = useState("all");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Update active index on scroll
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const newIndex = Math.round(scrollLeft / clientWidth);
            setCurrentImageIndex(newIndex);
        }
    };

    // Mouse Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        if (scrollContainerRef.current) {
            setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
            setScrollLeft(scrollContainerRef.current.scrollLeft);
        }
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        e.preventDefault();
        if (scrollContainerRef.current) {
            const x = e.pageX - scrollContainerRef.current.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast multiplier
            scrollContainerRef.current.scrollLeft = scrollLeft - walk;
        }
    };

    const venueId = params?.id as string;

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [shopRes, servicesRes, categoriesRes, specialistsRes] = await Promise.all([
                    fetchShopDetails(),
                    fetchServices(),
                    fetchCategories(),
                    fetchAllSpecialists()
                ]);

                if (shopRes.success && shopRes.data) {
                    setVenue(normalizeShopToVenue(shopRes.data));
                }

                if (servicesRes.success && servicesRes.data) {
                    const services = (servicesRes.data as Record<string, unknown>[]).map(s => ({
                        ...s,
                        categoryId: s.category || "uncategorized",
                        duration: s.duration ? `${s.duration} mins` : "Varies",
                    }));
                    setVenueServices(services);
                }

                if (categoriesRes.success && categoriesRes.data) {
                    const cats = (categoriesRes.data as Record<string, unknown>[]).map(c => ({
                        id: String(c.name),
                        label: String(c.name)
                    }));
                    cats.unshift({ id: "uncategorized", label: "Other Services" });
                    setAvailableCategories(cats);
                }

                if (specialistsRes.success && specialistsRes.data) {
                    setTeamMembers(specialistsRes.data as Record<string, unknown>[]);
                }
            } catch (error) {
                console.error("Failed to fetch venue details:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const handleBook = (serviceId?: string) => {
        setInitialServiceId(serviceId);
        setIsBookingOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-black animate-spin mb-4"></div>
                <p className="text-gray-500">Loading venue details...</p>
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Venue not found</h1>
                <p className="text-gray-500">The venue you are looking for does not exist.</p>
                <Button className="mt-4" onClick={() => window.location.href = '/'}>Go Home</Button>
            </div>
        );
    }

    const todayIndex = new Date().getDay();
    const daysArray = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayStr = daysArray[todayIndex];
    let isOpenRightNow = false;
    let openStatusText = "";

    const todaySchedule = ((venue?.openingHours as { day: string, hours: string }[]) || []).find(s => s.day === todayStr);

    if (todaySchedule) {
        if (todaySchedule.hours.toLowerCase().includes("closed")) {
            isOpenRightNow = false;
            openStatusText = "today";
        } else {
            const [openTime, closeTime] = todaySchedule.hours.split(" - ");
            if (openTime && closeTime) {
                const now = new Date();
                const [openH, openM] = openTime.split(":").map(Number);
                const [closeH, closeM] = closeTime.split(":").map(Number);

                const currentMinutes = now.getHours() * 60 + now.getMinutes();
                const openMinutes = openH * 60 + openM;
                const closeMinutes = closeH * 60 + closeM;

                const formatTime = (h: number, m: number) => {
                    const ampm = h >= 12 ? 'pm' : 'am';
                    const hour12 = h % 12 || 12;
                    return `${hour12}:${String(m).padStart(2, '0')}${ampm}`;
                };

                if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
                    isOpenRightNow = true;
                    openStatusText = `until ${formatTime(closeH, closeM)}`;
                } else if (currentMinutes < openMinutes) {
                    isOpenRightNow = false;
                    openStatusText = `Opens at ${formatTime(openH, openM)}`;
                } else {
                    isOpenRightNow = false;
                    openStatusText = `Closed now`;
                }
            } else {
                isOpenRightNow = true;
                openStatusText = "";
            }
        }
    } else {
        isOpenRightNow = true; // Fallback
        openStatusText = "";
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
                    <span className="truncate max-w-[150px]">{String(venue.name || "")}</span>
                </div>

                {/* Mobile Image Hero */}
                <div className="relative w-full aspect-[4/3] bg-gray-100">
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        className={cn(
                            "flex w-full h-full overflow-x-auto no-scrollbar",
                            isDragging ? "cursor-grabbing snap-none" : "cursor-grab snap-x snap-mandatory"
                        )}
                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                    >
                        {((venue.images as string[]) || []).map((img, index) => (
                            <div key={index} className="flex-shrink-0 w-full h-full snap-center">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={img} alt={`${String(venue.name || "")} - ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

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
                        {currentImageIndex + 1}/{((venue.images as string[]) || []).length}
                    </div>
                </div>

                {/* Mobile Info Section */}
                <div className="px-4 pt-4 space-y-3">
                    <h1 className="text-2xl font-bold leading-tight text-gray-900">{String(venue.name || "")}</h1>

                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                            {String(venue.rating || "5.0")} <i className="ri-star-fill text-yellow-500 text-xs"></i>
                        </span>
                        <span className="text-blue-600 text-sm font-semibold">({String(venue.reviews || "0")})</span>
                    </div>

                    <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>10.4km</span>
                        <span>•</span>
                        <span className="line-clamp-1">{String(venue.address || "")}</span>
                    </div>

                    <div className="text-sm">
                        <span className={cn("font-medium", isOpenRightNow ? "text-green-600" : "text-red-600")}>
                            {isOpenRightNow ? "Open" : "Closed"}
                        </span>
                        {openStatusText && <span className="text-gray-500 ml-1">{openStatusText}</span>}
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
                        <h1 className="text-3xl md:text-5xl font-bold leading-tight">{String(venue.name || "")}</h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-700">
                            <span className="flex items-center font-bold text-black bg-gray-100 px-2 py-0.5 rounded-md">
                                {String(venue.rating || "5.0")} <i className="ri-star-fill text-yellow-500 ml-1"></i>
                                <span className="text-gray-500 font-normal ml-1">({String(venue.reviews || "0")})</span>
                            </span>
                            <span className="hidden leading-none text-gray-300 md:inline">•</span>
                            <span className="break-words">{String(venue.address || "")}</span>
                            <span className="hidden leading-none text-gray-300 md:inline">•</span>
                            <span className={cn(
                                "font-medium px-2 py-0.5 rounded-md",
                                isOpenRightNow ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
                            )}>
                                {isOpenRightNow ? "Open" : "Closed"}
                                {openStatusText && <span className="font-normal opacity-75 ml-1">{openStatusText}</span>}
                            </span>
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
                        <img src={((venue.images as string[]) || [])[0]} alt="Salon Interior" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    {((venue.images as string[]) || []).slice(1).map((img, i) => (
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
                            <div className="sticky top-[8.5rem] z-30 bg-background py-4 -mx-4 px-4 overflow-x-auto no-scrollbar md:mx-0 md:px-0">
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
                                            key={String(service.id)}
                                            className="flex items-center justify-between py-4 md:p-4 hover:bg-gray-50 transition-colors group gap-4"
                                        >
                                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 truncate">{String(service.name)}</h3>
                                                <p className="text-sm text-gray-500 line-clamp-2">{String(service.description || "")}</p>
                                                <p className="text-sm text-gray-400 mt-1">{String(service.duration)}</p>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                                                <div className="text-right whitespace-nowrap">
                                                    <span className="block font-semibold text-gray-900">RM {String(service.price)}</span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="h-10 px-6 border-gray-300 hover:border-black hover:bg-transparent font-semibold"
                                                    onClick={() => handleBook(String(service.id))}
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
                        <TeamList specialists={teamMembers} />
                    </section>
                    <section id="reviews" className="scroll-mt-32">
                        <ReviewList />
                    </section>
                    <section id="about" className="scroll-mt-32 pb-20">
                        <h2 className="text-xl font-bold mb-4">About</h2>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            {String(venue.description || "")}
                        </p>

                        <h3 className="text-lg font-bold mb-4">Opening Hours</h3>
                        <div className="bg-gray-50 rounded-xl p-6 border">
                            <ul className="space-y-3">
                                {(venue.openingHours as { day: string, hours: string }[] | undefined)?.map((schedule: { day: string, hours: string }, index: number) => (
                                    <li key={index} className="flex justify-between text-sm">
                                        <span className="font-medium text-gray-900">{schedule.day}</span>
                                        <span className="text-gray-500">{schedule.hours}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>
                </div>

                {/* Desktop Sticky Sidebar */}
                <div className="hidden lg:block relative">
                    <div className="sticky top-40 border rounded-xl p-6 shadow-sm space-y-6">
                        <div className="text-center">
                            <h3 className="font-bold text-lg">{String(venue.name || "")}</h3>
                            <p className="text-sm text-gray-500">{String(venue.address || "")}</p>
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
                    categories={availableCategories}
                />
            )}
        </div>
    );
}
