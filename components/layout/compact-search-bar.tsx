"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";

// Utility for simple calendar logic
const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CompactSearchBar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);

    // Search States
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("Current location");
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("Any time");

    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const containerRef = useRef<HTMLDivElement>(null);

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

    const uiCategories = [
        { id: "all", label: "All treatments", icon: "ri-apps-2-line" },
        { id: "hair", label: "Hair", icon: "ri-scissors-fill" },
        { id: "nails", label: "Nails", icon: "ri-hand-coin-fill" },
        { id: "massage", label: "Massage", icon: "ri-user-heart-fill" },
        { id: "face", label: "Facial", icon: "ri-emotion-happy-fill" },
    ];

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery && searchQuery !== "All treatments") params.set("q", searchQuery);
        if (locationQuery && locationQuery !== "Current location") params.set("location", locationQuery);
        // We could add date/time params here too if the search page supported them
        router.push(`/search?${params.toString()}`);
    };



    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentYear, currentMonth, day);
        setSelectedDate(newDate);
    };

    const renderCalendar = () => {
        const days = daysInMonth(currentYear, currentMonth);
        const firstDay = firstDayOfMonth(currentYear, currentMonth);
        const slots = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            slots.push(<div key={`empty-${i}`} className="w-10 h-10" />);
        }

        // Days
        for (let day = 1; day <= days; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate.toDateString() === date.toDateString();

            slots.push(
                <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all hover:bg-gray-100",
                        isSelected ? "bg-black text-white hover:bg-black" : "",
                        isToday && !isSelected ? "text-blue-600 font-bold" : ""
                    )}
                >
                    {day}
                </button>
            );
        }

        return slots;
    };

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsTimeOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Only show on non-home pages (e.g. shop details)
    if (pathname === "/") return null;

    return (
        <div className="hidden lg:flex flex-1 max-w-2xl mx-auto items-center justify-center" ref={containerRef}>
            <div className="flex items-center bg-gray-100/50 border hover:bg-white hover:shadow-md transition-all rounded-full p-1 divide-x divide-gray-200 w-full relative group">
                {/* Treatment Input */}
                <Popover.Root open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                    <Popover.Trigger asChild>
                        <div className="flex-1 px-4 py-1.5 cursor-pointer hover:bg-gray-100 rounded-l-full transition-colors flex flex-col justify-center border-r border-gray-200">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 leading-none mb-0.5">Treatment or venue</label>
                            <input
                                type="text"
                                placeholder="All treatments"
                                className="bg-transparent border-none outline-none text-sm font-semibold text-gray-900 p-0 placeholder:text-gray-400 w-full truncate"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsSearchOpen(true);
                                }}
                            />
                        </div>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content className="z-50 bg-white p-2 rounded-xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 w-[280px]" align="start" sideOffset={10}>
                            <div className="p-2">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">Top Categories</h3>
                                <div className="space-y-1">
                                    {uiCategories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setSearchQuery(cat.label === "All treatments" ? "" : cat.label);
                                                setIsSearchOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-lg text-left transition-colors"
                                        >
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs">
                                                <i className={cat.icon}></i>
                                            </div>
                                            <span className="font-medium text-gray-900 text-sm">{cat.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>

                {/* Location Input */}
                <Popover.Root open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                    <Popover.Trigger asChild>
                        <div className="flex-1 px-4 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors flex flex-col justify-center border-r border-gray-200">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 leading-none mb-0.5">Location</label>
                            <div className="text-sm font-semibold text-gray-900 truncate">{locationQuery}</div>
                        </div>
                    </Popover.Trigger>
                    <Popover.Portal>
                        <Popover.Content className="z-50 bg-white p-2 rounded-xl shadow-xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200 w-[280px]" align="start" sideOffset={10}>
                            <div className="p-2">
                                <button
                                    onClick={() => {
                                        setLocationQuery("Current location");
                                        setIsLocationOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-lg text-left mb-2 text-blue-600 font-medium text-sm"
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
                                                setLocationQuery(loc);
                                                setIsLocationOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-2 py-2 hover:bg-gray-50 rounded-lg text-left"
                                        >
                                            <span className="text-gray-900 text-sm">{loc}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </Popover.Content>
                    </Popover.Portal>
                </Popover.Root>

                {/* Time Input Trigger */}
                <div
                    className={cn("flex-1 px-4 py-1.5 cursor-pointer hover:bg-gray-100 transition-colors flex flex-col justify-center relative", isTimeOpen ? "bg-white shadow-sm rounded-r-full" : "rounded-r-full")}
                    onClick={() => setIsTimeOpen(!isTimeOpen)}
                >
                    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 leading-none mb-0.5">Time</label>
                    <div className="text-sm font-semibold text-gray-900 truncate">{selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, {selectedTimeSlot}</div>
                </div>

                {/* Search Button */}
                <div className="pl-2 pr-1">
                    <Button
                        size="icon"
                        className="rounded-full w-9 h-9 bg-black text-white hover:bg-gray-800 shadow-sm"
                        onClick={handleSearch}
                    >
                        <i className="ri-search-line"></i>
                    </Button>
                </div>
            </div>

            {/* Time Popover */}
            {isTimeOpen && (
                <div className="absolute top-16 right-0 w-[600px] bg-white rounded-3xl shadow-xl border border-gray-100 p-6 z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="flex gap-8">
                        {/* Quick Select Sidebar */}
                        <div className="w-1/3 space-y-2">
                            <button
                                onClick={() => setSelectedDate(new Date())}
                                className={cn("w-full text-left p-4 rounded-xl border transition-all hover:border-black", new Date().toDateString() === selectedDate.toDateString() ? "border-black ring-1 ring-black bg-gray-50" : "border-gray-200")}
                            >
                                <div className="font-bold text-gray-900">Today</div>
                                <div className="text-xs text-gray-500 mt-1">{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
                            </button>
                            <button
                                onClick={() => {
                                    const tmzw = new Date();
                                    tmzw.setDate(tmzw.getDate() + 1);
                                    setSelectedDate(tmzw);
                                }}
                                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-black transition-all"
                            >
                                <div className="font-bold text-gray-900">Tomorrow</div>
                                <div className="text-xs text-gray-500 mt-1">
                                    {(() => {
                                        const d = new Date();
                                        d.setDate(d.getDate() + 1);
                                        return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
                                    })()}
                                </div>
                            </button>
                        </div>

                        {/* Calendar */}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-4">
                                <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full"><i className="ri-arrow-left-s-line text-xl"></i></button>
                                <span className="font-bold text-lg">{monthNames[currentMonth]} {currentYear}</span>
                                <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full"><i className="ri-arrow-right-s-line text-xl"></i></button>
                            </div>
                            <div className="grid grid-cols-7 text-center mb-2">
                                {dayNames.map(d => <div key={d} className="text-xs font-medium text-gray-400 py-1">{d}</div>)}
                            </div>
                            <div className="grid grid-cols-7 place-items-center gap-y-1">
                                {renderCalendar()}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {/* Time Slots */}
                        {["Any time", "Morning", "Afternoon", "Evening", "Custom"].map(slot => (
                            <button
                                key={slot}
                                onClick={() => setSelectedTimeSlot(slot)}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-all",
                                    selectedTimeSlot === slot
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-gray-700 border-gray-200 hover:border-black"
                                )}
                            >
                                {slot === "Morning" && <span className="block text-[10px] opacity-70 font-normal">9 am - 12 pm</span>}
                                {slot === "Afternoon" && <span className="block text-[10px] opacity-70 font-normal">12 pm - 5 pm</span>}
                                {slot === "Evening" && <span className="block text-[10px] opacity-70 font-normal">5 pm - 11 pm</span>}
                                {slot}
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 flex justify-end">
                        <Button className="rounded-full px-8 bg-black text-white hover:bg-gray-800" onClick={() => setIsTimeOpen(false)}>Apply</Button>
                    </div>
                </div>
            )}
        </div>
    );
}
