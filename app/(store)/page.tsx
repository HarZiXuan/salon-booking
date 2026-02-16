"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useMemo } from "react";
import { venuesData, serviceCategories } from "@/lib/mock-data";
import { format, isToday, isTomorrow } from "date-fns";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import "react-day-picker/dist/style.css";

// Enhanced categories with icons for the UI
const uiCategories = [
    { id: "all", label: "All", icon: "ri-apps-2-line" },
    { id: "hair", label: "Hair", icon: "ri-scissors-fill" },
    { id: "nails", label: "Nails", icon: "ri-hand-coin-fill" },
    { id: "massage", label: "Massage", icon: "ri-user-heart-fill" },
    { id: "face", label: "Facial", icon: "ri-emotion-happy-fill" },
];

export default function HomePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("Current location");

    const malaysiaLocations = [
        "Kuala Lumpur",
        "Johor Bahru",
        "Penang",
        "Selangor",
        "Malacca",
        "Sabah",
        "Sarawak",
        "Perak",
        "Kedah"
    ];

    // Filter logic
    const filteredVenues = useMemo(() => {
        return venuesData.filter(venue => {
            const matchesCategory = selectedCategory === "all" || venue.categoryId === selectedCategory;
            const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                venue.address.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    const getDateLabel = () => {
        if (!selectedDate) return "Any time";
        if (isToday(selectedDate)) return "Today";
        if (isTomorrow(selectedDate)) return "Tomorrow";
        return format(selectedDate, "MMM d");
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative h-[650px] flex items-center justify-center text-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/images/hero-bg.jpg"
                        alt="Salon Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="container relative z-10 px-4 md:px-6">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6 drop-shadow-sm">
                        Book local selfcare services
                    </h1>
                    <p className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-sm font-medium">
                        Discover top-rated salons, barbers, medspas, wellness studios and beauty experts near you.
                    </p>

                    {/* Enhanced Search Bar */}
                    <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-2 transform transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <div className="flex flex-col md:flex-row md:items-center">

                            {/* Search Input */}
                            <Popover.Root open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                                <Popover.Trigger asChild>
                                    <div
                                        className="flex-1 px-6 py-4 md:py-3 flex items-center gap-4 group cursor-text border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50/50 rounded-xl transition-colors"
                                        onClick={() => setIsSearchOpen(true)}
                                    >
                                        <i className="ri-search-line text-2xl text-gray-400 group-hover:text-primary transition-colors"></i>
                                        <div className="flex-1 text-left">
                                            <label htmlFor="search" className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Search</label>
                                            <input
                                                id="search"
                                                type="text"
                                                placeholder="Treatment or venue"
                                                className="w-full text-base font-semibold text-gray-900 placeholder:text-gray-300 bg-transparent border-none outline-none p-0 focus:ring-0"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                </Popover.Trigger>
                                <Popover.Portal>
                                    <Popover.Content
                                        className="z-50 bg-white p-2 rounded-xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 w-[300px] md:w-[350px]"
                                        align="start"
                                        sideOffset={10}
                                        onOpenAutoFocus={(e) => e.preventDefault()}
                                    >
                                        <div className="p-2">
                                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Top Categories</h3>
                                            <div className="space-y-1">
                                                {uiCategories.map(cat => (
                                                    cat.id !== 'all' && (
                                                        <button
                                                            key={cat.id}
                                                            onClick={() => {
                                                                setSearchQuery(cat.label);
                                                                setSelectedCategory(cat.id);
                                                                setIsSearchOpen(false);
                                                            }}
                                                            className="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 rounded-lg text-left transition-colors"
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                                <i className={cat.icon}></i>
                                                            </div>
                                                            <span className="font-medium text-gray-900">{cat.label}</span>
                                                        </button>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>

                            {/* Location Input */}
                            <Popover.Root open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                                <Popover.Trigger asChild>
                                    <div className="flex-1 px-6 py-4 md:py-3 flex items-center gap-4 group cursor-pointer border-b md:border-b-0 md:border-r border-gray-100 hover:bg-gray-50/50 rounded-xl transition-colors">
                                        <i className="ri-map-pin-line text-2xl text-gray-400 group-hover:text-primary transition-colors"></i>
                                        <div className="flex-1 text-left">
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Location</label>
                                            <span className="block text-base font-semibold text-gray-900 truncate">{selectedLocation}</span>
                                        </div>
                                    </div>
                                </Popover.Trigger>
                                <Popover.Portal>
                                    <Popover.Content
                                        className="z-50 bg-white p-2 rounded-xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 w-[300px]"
                                        align="start"
                                        sideOffset={10}
                                    >
                                        <div className="p-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedLocation("Current location");
                                                    setIsLocationOpen(false);
                                                }}
                                                className="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-gray-50 rounded-lg text-left mb-2 text-blue-600 font-medium"
                                            >
                                                <i className="ri-map-pin-user-line text-lg"></i>
                                                Use current location
                                            </button>

                                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2 border-t pt-3">Malaysia</h3>
                                            <div className="max-h-[250px] overflow-y-auto no-scrollbar space-y-1">
                                                {malaysiaLocations.map(loc => (
                                                    <button
                                                        key={loc}
                                                        onClick={() => {
                                                            setSelectedLocation(loc);
                                                            setIsLocationOpen(false);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-lg text-left"
                                                    >
                                                        <span className="text-gray-900">{loc}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>

                            {/* Date Picker Input */}
                            <Popover.Root open={isDateOpen} onOpenChange={setIsDateOpen}>
                                <Popover.Trigger asChild>
                                    <div className="flex-[0.8] px-6 py-4 md:py-3 flex items-center gap-4 group cursor-pointer hover:bg-gray-50/50 rounded-xl transition-colors">
                                        <i className="ri-calendar-line text-2xl text-gray-400 group-hover:text-primary transition-colors"></i>
                                        <div className="flex-1 text-left">
                                            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-0.5">Date</label>
                                            <span className="block text-base font-semibold text-gray-900">{getDateLabel()}</span>
                                        </div>
                                    </div>
                                </Popover.Trigger>
                                <Popover.Portal>
                                    <Popover.Content className="z-50 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200" align="start" sideOffset={10}>
                                        <DayPicker
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                setIsDateOpen(false);
                                            }}
                                            disabled={{ before: new Date() }}
                                            modifiersClassNames={{
                                                selected: "bg-black text-white hover:bg-black rounded-full",
                                                today: "font-bold text-blue-600"
                                            }}
                                        />
                                    </Popover.Content>
                                </Popover.Portal>
                            </Popover.Root>

                            {/* Search Button */}
                            <div className="p-2">
                                <Button
                                    className="w-full md:w-auto h-14 md:h-12 px-8 rounded-full text-lg font-bold bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-900/10 transition-all hover:scale-[1.02]"
                                    onClick={() => router.push(`/search?q=${encodeURIComponent(searchQuery)}`)}
                                >
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section - Pill Design */}
            <section className="bg-white border-b sticky top-20 z-40 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] transition-all">
                <div className="container py-4">
                    <div className="flex gap-3 overflow-x-auto px-1 py-1 no-scrollbar md:justify-center">
                        {uiCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`
                                    inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 border
                                    ${selectedCategory === cat.id
                                        ? 'bg-gray-900 text-white border-gray-900 shadow-md scale-105'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-black'
                                    }
                                `}
                            >
                                <i className={`${cat.icon} text-lg ${selectedCategory === cat.id ? 'text-white' : 'text-gray-400'}`}></i>
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Recommended Venues */}
            <section className="py-16 bg-gray-50 flex-1">
                <div className="container space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {selectedCategory === 'all' ? 'Recommended for you' : `Top ${uiCategories.find(c => c.id === selectedCategory)?.label} in your area`}
                        </h2>
                        <Link href="/search" className="text-sm font-semibold text-gray-900 hover:underline">See all</Link>
                    </div>

                    {filteredVenues.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVenues.map(venue => (
                                <Link key={venue.id} href={`/venues/${venue.id}`} className="group block bg-white rounded-xl overflow-hidden border hover:shadow-lg transition-all duration-300">
                                    <div className="aspect-[4/3] bg-gray-200 relative overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={venue.image} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm uppercase tracking-wide">
                                            {venue.categoryId}
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{venue.name}</h3>
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className="flex items-center font-bold text-gray-900">
                                                {venue.rating} <i className="ri-star-fill text-yellow-500 ml-1"></i>
                                            </div>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-gray-500">{venue.reviews} reviews</span>
                                        </div>
                                        <p className="text-sm text-gray-500 truncate">{venue.address}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                <i className="ri-store-2-line text-2xl text-gray-400"></i>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No venues found</h3>
                            <p className="text-gray-500">Try adjusting your search or category filter</p>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setSearchQuery("");
                                }}
                            >
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
