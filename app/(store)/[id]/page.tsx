"use client";

import { Button } from "@/components/ui/button/button";
import { VenueNav } from "@/components/venue/venue-nav";
import { TeamList } from "@/components/venue/team-list";
// import { ReviewList } from "@/components/venue/review-list";
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
        if (venue?.disableBookingCalendar) {
            const service = serviceId ? venueServices.find((s) => String(s.id) === serviceId) : null;
            const serviceName = service ? String(service.name) : "";
            const text = serviceName
                ? `Hi, I would like to book the service: ${serviceName}.`
                : "Hi, I would like to make a booking.";
            const phoneNumber = String(venue.phone || "").replace(/[^0-9]/g, '');
            // If phone is missing, it will just redirect to generic wa.me
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
            return;
        }
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

            {/* Desktop Hero Layout */}
            <div className="hidden md:block container py-6">
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden group shadow-lg">
                    {/* Background Banner */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={((venue.images as string[]) || [])[0]}
                        alt={String(venue.name || "Banner")}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Dark gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10"></div>

                    {/* Top Right Actions */}
                    <div className="absolute top-6 right-6 flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 border border-white/50 flex items-center justify-center text-white backdrop-blur-md transition-all">
                            <i className="ri-share-line text-lg"></i>
                        </button>
                    </div>

                    {/* Bottom Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                        <div className="flex flex-col gap-3">
                            {/* Logo */}
                            {Boolean(venue.image) && (
                                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-[3px] border-white overflow-hidden bg-white shadow-lg mb-2 flex-shrink-0">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={String(venue.image)}
                                        alt={String(venue.name || "Logo")}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            {/* Title & Address */}
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-2">
                                    {String(venue.name || "")}
                                </h1>
                                <div className="flex items-center text-white/90 text-sm md:text-base gap-1.5 font-medium">
                                    <i className="ri-map-pin-2-fill text-lg"></i>
                                    <span>{String(venue.address || "")}</span>
                                </div>
                            </div>

                            {/* Details Row */}
                            <div className="flex items-center text-sm text-white/90 gap-2 md:gap-3 font-medium mt-1">
                                <span className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded backdrop-blur-md">
                                    <i className="ri-star-fill text-yellow-400 mb-0.5 text-xs"></i>
                                    {String(venue.rating || "5.0")}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/40"></span>
                                <span className={cn(isOpenRightNow ? "text-green-400" : "text-red-500 font-bold")}>
                                    {isOpenRightNow ? "Open" : "Closed"}
                                </span>

                                {isOpenRightNow && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-white/40"></span>
                                        <span>{String(todaySchedule?.hours || openStatusText || "Hours unknown")}</span>
                                    </>
                                )}

                                {Boolean(venue.phone) && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-white/40 hidden md:block"></span>
                                        <a
                                            href={`https://wa.me/${String(venue.phone).replace(/[^0-9]/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 ml-2 md:ml-0 px-3 py-1 rounded-full text-white transition-colors border border-white/50 hover:bg-white/10"
                                        >
                                            <i className="ri-whatsapp-line text-lg text-green-400"></i>
                                            <span>{String(venue.phone)}</span>
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Bottom Right Actions */}
                        <div className="hidden md:flex gap-3 mt-auto mb-2">
                            <button className="px-5 py-2 rounded-xl bg-black/30 hover:bg-black/50 border border-white/50 text-white font-medium backdrop-blur-md transition-colors flex items-center gap-2">
                                See photos
                            </button>
                        </div>
                    </div>
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
                                                    {venue.disableBookingCalendar ? (
                                                        <span className="flex items-center gap-1"><i className="ri-whatsapp-line text-lg"></i> WhatsApp</span>
                                                    ) : "Book"}
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
                    {/* <section id="reviews" className="scroll-mt-32">
                        <ReviewList />
                    </section> */}
                    <section id="about" className="scroll-mt-32 pb-20">
                        <h2 className="text-xl font-bold mb-4">About</h2>
                        <p className="text-gray-600 leading-relaxed mb-8">
                            {String(venue.description || "")}
                        </p>

                        <div className="mb-10 mt-6 rounded-2xl overflow-hidden flex flex-col">
                            <div className="w-full h-[250px] relative bg-gray-200 rounded-2xl overflow-hidden mb-3">
                                <iframe
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(String(venue.address || ""))}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                    className="w-full h-full border-0 pointer-events-none"
                                    loading="lazy"
                                    allowFullScreen
                                ></iframe>
                                <a href={String(venue.googleMapUrl || `https://maps.google.com/?q=${encodeURIComponent(String(venue.address || ""))}`)} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 w-full h-full">
                                    {/* Invisible overlay link over map */}
                                </a>
                            </div>
                            <div className="flex items-center justify-between bg-white gap-2 mt-2">
                                <span className="text-sm md:text-base text-gray-900 font-medium line-clamp-2 pr-4 leading-snug">
                                    {String(venue.address || "")}
                                </span>
                                <a
                                    href={String(venue.googleMapUrl || `https://maps.google.com/?q=${encodeURIComponent(String(venue.address || ""))}`)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 px-4 py-1.5 rounded-lg border-2 border-black text-blue-600 font-semibold text-sm hover:bg-blue-50 transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap"
                                >
                                    Get directions
                                </a>
                            </div>
                        </div>

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
                            {venue.disableBookingCalendar ? (
                                <span className="flex items-center justify-center gap-2"><i className="ri-whatsapp-line text-xl"></i> Book via WhatsApp</span>
                            ) : "Book Now"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] bg-white border-t lg:hidden z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
                <Button className="w-full h-12 text-lg" onClick={() => handleBook()}>
                    {venue.disableBookingCalendar ? (
                        <span className="flex items-center justify-center gap-2"><i className="ri-whatsapp-line text-xl"></i> Book via WhatsApp</span>
                    ) : "Book Now"}
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
