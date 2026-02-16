"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { serviceCategories, staffData } from "@/lib/mock-data";

// Steps
const steps = ["Services", "Professional", "Time", "Confirm"];

interface BookingWizardProps {
    onClose: () => void;
    initialServiceId?: string;
    venue: any; // Type this properly if possible, but any is fine for mock
    services: any[];
}

export function BookingWizard({ onClose, initialServiceId, venue: venueData, services: servicesData }: BookingWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedServices, setSelectedServices] = useState<string[]>(initialServiceId ? [initialServiceId] : []);
    const [activeCategory, setActiveCategory] = useState("featured");

    // State for Step 2 & 3
    const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Scroll to active category logic could be added here

    const selectedServiceObjects = servicesData.filter(s => selectedServices.includes(s.id));
    const totalAmount = selectedServiceObjects.reduce((acc, s) => acc + s.price, 0);

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            alert("Booking Confirmed!");
            onClose();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            onClose();
        }
    };

    const isStepValid = () => {
        if (currentStep === 0) return selectedServices.length > 0;
        if (currentStep === 1) return !!selectedStaff;
        if (currentStep === 2) return !!selectedTime; // Date typically selected
        return true;
    }

    return (
        <div className="fixed inset-0 z-50 bg-white flex flex-col md:flex-row animate-in fade-in duration-200">

            {/* TOP MOBILE BAR with Back & Close */}
            <div className="flex items-center justify-between p-4 border-b md:hidden">
                <button onClick={handleBack} className="p-2"><i className="ri-arrow-left-line text-xl"></i></button>
                <span className="font-semibold text-sm">
                    {currentStep === 0 ? "Select Services" : steps[currentStep]}
                </span>
                <button onClick={onClose} className="p-2"><i className="ri-close-line text-xl"></i></button>
            </div>

            {/* LEFT COLUMN: Main Content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

                {/* Desktop Header / Breadcrumbs */}
                <div className="hidden md:block pt-8 px-8 pb-4">
                    <button onClick={onClose} className="absolute top-6 left-6 p-2 rounded-full hover:bg-gray-100">
                        <i className="ri-arrow-left-line text-xl"></i>
                    </button>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 ml-10">
                        {steps.map((step, idx) => (
                            <div key={step} className="flex items-center gap-2">
                                <span className={cn(
                                    "cursor-pointer hover:text-black transition-colors",
                                    currentStep === idx ? "text-black font-bold" : (currentStep > idx ? "text-black" : "")
                                )} onClick={() => currentStep > idx && setCurrentStep(idx)}>
                                    {step}
                                </span>
                                {idx < steps.length - 1 && <i className="ri-arrow-right-s-line"></i>}
                            </div>
                        ))}
                    </div>
                    <h1 className="text-3xl font-bold ml-10">{steps[currentStep]}</h1>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="flex-1 overflow-y-auto px-4 py-4 md:px-12 md:py-4">

                    {/* STEP 1: SERVICES */}
                    {currentStep === 0 && (
                        <div className="space-y-6 pb-20 md:pb-0">
                            {/* Category Pills */}
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b md:border-none sticky top-0 bg-white z-10 py-2">
                                {serviceCategories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setActiveCategory(cat.id)}
                                        className={cn(
                                            "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                                            activeCategory === cat.id
                                                ? "bg-black text-white"
                                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        )}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>

                            {/* Service List */}
                            <div className="space-y-8">
                                {serviceCategories.map(cat => {
                                    const categoryServices = servicesData.filter(s => s.categoryId === cat.id);
                                    if (categoryServices.length === 0) return null;

                                    // Simple scroll spy logic would go here, for now just render all
                                    return (
                                        <div key={cat.id} id={cat.id}>
                                            <h3 className="text-xl font-bold mb-4">{cat.label}</h3>
                                            <div className="space-y-4">
                                                {categoryServices.map(service => {
                                                    const isSelected = selectedServices.includes(service.id);
                                                    return (
                                                        <div
                                                            key={service.id}
                                                            className={cn(
                                                                "border rounded-xl p-4 flex items-start justify-between hover:border-black transition-colors cursor-pointer group",
                                                                isSelected ? "border-black ring-1 ring-black" : "border-gray-200"
                                                            )}
                                                            onClick={() => toggleService(service.id)}
                                                        >
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">{service.name}</h4>
                                                                <p className="text-sm text-gray-500 mt-1">{service.duration}</p>
                                                                <p className="text-sm text-gray-400">{service.description}</p>
                                                                <p className="font-semibold text-gray-900 mt-2">RM {service.price}</p>
                                                            </div>
                                                            <button
                                                                className={cn(
                                                                    "w-8 h-8 rounded-full flex items-center justify-center border transition-all",
                                                                    isSelected
                                                                        ? "bg-black text-white border-black"
                                                                        : "bg-white text-black border-gray-300 group-hover:border-black"
                                                                )}
                                                            >
                                                                {isSelected ? <i className="ri-check-line"></i> : <i className="ri-add-line"></i>}
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PROFESSIONAL */}
                    {currentStep === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {staffData.map(staff => (
                                <button
                                    key={staff.id}
                                    onClick={() => setSelectedStaff(staff.id)}
                                    className={cn(
                                        "p-4 border rounded-xl text-left hover:border-black transition-all flex items-center gap-4",
                                        selectedStaff === staff.id ? "border-black ring-1 ring-black bg-gray-50" : ""
                                    )}
                                >
                                    <div className={cn("w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0", !staff.image && "flex items-center justify-center")}>
                                        {staff.image ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={staff.image} alt={staff.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <i className="ri-team-line text-gray-500"></i>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold">{staff.name}</div>
                                        <div className="text-sm text-gray-500">{staff.role}</div>
                                    </div>
                                    <div className={cn("ml-auto w-5 h-5 rounded-full border flex items-center justify-center", selectedStaff === staff.id ? "bg-black border-black" : "border-gray-300")}>
                                        {selectedStaff === staff.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* STEP 3: TIME */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            {/* Simple Date Strip */}
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {[0, 1, 2, 3, 4, 5, 6].map(offset => {
                                    const d = new Date();
                                    d.setDate(d.getDate() + offset);
                                    const isSelected = selectedDate === d.toISOString().split('T')[0];
                                    return (
                                        <button
                                            key={offset}
                                            onClick={() => setSelectedDate(d.toISOString().split('T')[0])}
                                            className={cn(
                                                "min-w-[70px] p-3 rounded-xl border flex flex-col items-center justify-center transition-all",
                                                isSelected ? "border-black bg-black text-white" : "border-gray-200 hover:border-gray-400"
                                            )}
                                        >
                                            <span className="text-xs uppercase font-medium opacity-60">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                            <span className="text-xl font-bold">{d.getDate()}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            <h3 className="font-bold text-lg">Morning</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {["10:00", "10:30", "11:00", "11:30"].map(t => (
                                    <button key={t} onClick={() => setSelectedTime(t)} className={cn("py-2 px-4 rounded-lg border text-sm font-semibold hover:border-black", selectedTime === t ? "bg-black text-white border-black" : "bg-white")}>{t}</button>
                                ))}
                            </div>

                            <h3 className="font-bold text-lg">Afternoon</h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {["12:00", "12:30", "13:00", "13:30", "14:00", "15:00"].map(t => (
                                    <button key={t} onClick={() => setSelectedTime(t)} className={cn("py-2 px-4 rounded-lg border text-sm font-semibold hover:border-black", selectedTime === t ? "bg-black text-white border-black" : "bg-white")}>{t}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: CONFIRM */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                <div className="flex items-center gap-4 border-b pb-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={venueData.image} className="w-16 h-16 rounded-lg object-cover" alt="Venue" />
                                    <div>
                                        <h3 className="font-bold">{venueData.name}</h3>
                                        <p className="text-sm text-gray-500">{venueData.address}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Date & Time</span>
                                        <span className="font-semibold">{selectedDate} at {selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Professional</span>
                                        <span className="font-semibold">{staffData.find(s => s.id === selectedStaff)?.name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">Payment Method</h3>
                                <div className="p-4 border rounded-xl flex items-center justify-between cursor-pointer hover:border-black">
                                    <div className="flex items-center gap-3">
                                        <i className="ri-bank-card-line text-xl"></i>
                                        <span className="font-medium">Pay at venue</span>
                                    </div>
                                    <i className="ri-check-line text-xl"></i>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* MOBILE STICKY FOOTER */}
                <div className="md:hidden border-t p-4 bg-white z-50">
                    {currentStep === 0 && selectedServices.length > 0 && (
                        <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="text-gray-500">{selectedServices.length} services selected</span>
                            <span className="font-bold">RM {totalAmount}</span>
                        </div>
                    )}
                    <Button className="w-full h-12 text-lg" disabled={!isStepValid()} onClick={handleNext}>
                        {currentStep === steps.length - 1 ? "Confirm Booking" : "Continue"}
                    </Button>
                </div>
            </div>

            {/* RIGHT COLUMN: Sidebar Summary (Desktop Only) */}
            <div className="hidden md:flex w-[400px] border-l flex-col bg-white h-full shadow-xl z-20">
                <div className="p-6 border-b">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black">
                        <i className="ri-close-line text-2xl"></i>
                    </button>
                    <div className="flex items-start gap-3 mt-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={venueData.image} alt="Venue" className="w-16 h-16 rounded-md object-cover" />
                        <div>
                            <h3 className="font-bold text-sm leading-tight">{venueData.name}</h3>
                            <div className="flex items-center gap-1 text-xs font-semibold mt-1">
                                <span>{venueData.rating}</span>
                                <i className="ri-star-fill text-yellow-500"></i>
                                <span className="text-gray-400 font-normal">({venueData.reviews})</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{venueData.address}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {selectedServices.length === 0 ? (
                        <p className="text-gray-400 text-sm">No services selected</p>
                    ) : (
                        <div className="space-y-4">
                            {selectedServiceObjects.map(s => (
                                <div key={s.id} className="flex justify-between items-start text-sm">
                                    <div>
                                        <div className="font-semibold">{s.name}</div>
                                        <div className="text-gray-500 text-xs">{s.duration}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">RM {s.price}</span>
                                        {currentStep === 0 && (
                                            <button onClick={() => toggleService(s.id)}><i className="ri-close-circle-fill text-gray-300 hover:text-gray-500"></i></button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t bg-gray-50">
                    <div className="flex justify-between items-center text-lg font-bold mb-4">
                        <span>Total</span>
                        <span>{totalAmount > 0 ? `RM ${totalAmount}` : 'free'}</span>
                    </div>
                    <Button
                        className="w-full h-12 text-lg rounded-full"
                        disabled={!isStepValid()}
                        onClick={handleNext}
                    >
                        {currentStep === steps.length - 1 ? "Confirm" : "Continue"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
