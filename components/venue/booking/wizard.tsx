"use client";

import { fetchServiceSpecialists, fetchAvailability, createBooking, fetchBookingDetails } from "@/app/actions/shop";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Steps
const steps = ["Services", "Professional", "Time", "Confirm", "Details"];

interface BookingWizardProps {
    onClose: () => void;
    initialServiceId?: string;
    venue: Record<string, unknown>; // Type this properly if possible, but any is fine for mock
    services: Record<string, unknown>[];
    categories: { id: string, label: string }[];
}

export function BookingWizard({ onClose, initialServiceId, venue: venueData, services: servicesData, categories }: BookingWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedServices, setSelectedServices] = useState<string[]>(initialServiceId ? [initialServiceId] : []);
    const [activeCategory, setActiveCategory] = useState("all");

    // State for Step 2 & 3
    const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);

    const [availableStaff, setAvailableStaff] = useState<Record<string, unknown>[]>([]);
    const [isLoadingStaff, setIsLoadingStaff] = useState(false);

    const [availableTimeslots, setAvailableTimeslots] = useState<string[]>([]);
    const [isLoadingTimeslots, setIsLoadingTimeslots] = useState(false);

    // State for Step 4 (Checkout form)
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerGender, setCustomerGender] = useState("Female");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingError, setBookingError] = useState("");
    const [bookingResult, setBookingResult] = useState<Record<string, unknown> | null>(null);

    // Fetch staff when moving to step 1
    useEffect(() => {
        if (currentStep === 1 && selectedServices.length > 0) {
            const loadStaff = async () => {
                setIsLoadingStaff(true);
                try {
                    const res = await fetchServiceSpecialists(selectedServices[0]);
                    if (res.success && res.data) {
                        setAvailableStaff(res.data as Record<string, unknown>[]);
                    } else {
                        setAvailableStaff([]);
                    }
                } catch (error) {
                    console.error("Failed to load staff", error);
                } finally {
                    setIsLoadingStaff(false);
                }
            };
            loadStaff();
        }
    }, [currentStep, selectedServices]);

    // Fetch timeslots when moving to step 2 and a date is selected
    useEffect(() => {
        if (currentStep === 2 && selectedServices.length > 0 && selectedStaff && selectedDate) {
            const loadTimeslots = async () => {
                setIsLoadingTimeslots(true);
                try {
                    const specialistId = selectedStaff === "any" ? "" : selectedStaff;
                    const res = await fetchAvailability(selectedServices[0], specialistId, selectedDate);
                    if (res.success && res.data) {
                        const dataObj = res.data as Record<string, unknown>;
                        if (Array.isArray(dataObj.timeslots)) {
                            const slots = dataObj.timeslots.map((slot: any) =>
                                typeof slot === 'string' ? slot : (slot.start_time || slot.time || JSON.stringify(slot))
                            );
                            setAvailableTimeslots(slots);
                        } else {
                            setAvailableTimeslots([]);
                        }
                    } else {
                        setAvailableTimeslots([]);
                    }
                } catch (error) {
                    console.error("Failed to load timeslots", error);
                    setAvailableTimeslots([]);
                } finally {
                    setIsLoadingTimeslots(false);
                }
            };
            loadTimeslots();
        }
    }, [currentStep, selectedServices, selectedStaff, selectedDate]);

    // Scroll to active category logic could be added here

    const selectedServiceObjects = servicesData.filter(s => selectedServices.includes(String(s.id)));
    const totalAmount = selectedServiceObjects.reduce((acc, s) => acc + Number(s.price || 0), 0);

    const toggleService = (id: string) => {
        setSelectedServices(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleNext = async () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else if (currentStep === 3) {
            // Submit booking
            setBookingError("");
            setIsSubmitting(true);
            try {
                const res = await createBooking({
                    service_id: selectedServices[0],
                    staff_id: selectedStaff === "any" ? "" : (selectedStaff || ""),
                    date: selectedDate || "",
                    start_time: selectedTime || "",
                    name: customerName,
                    number: customerPhone,
                    gender: customerGender,
                    email: customerEmail
                });

                if (res.success && res.data) {
                    const resData = res.data as any;
                    const bId = resData.id || resData.data?.id;
                    if (bId) {
                        try {
                            const detailsRes = await fetchBookingDetails(bId);
                            if (detailsRes.success && detailsRes.data) {
                                // Assume data or data.data holds the booking details
                                const detailData = detailsRes.data as any;
                                setBookingResult(detailData.data || detailData);
                            } else {
                                setBookingResult(resData.data || resData);
                            }
                        } catch (e) {
                            setBookingResult(resData.data || resData);
                        }
                    } else {
                        setBookingResult(resData.data || resData);
                    }
                    setCurrentStep(4);
                } else {
                    setBookingError(res.error || "Failed to create booking.");
                }
            } catch (err) {
                console.error(err);
                setBookingError("An unexpected error occurred.");
            } finally {
                setIsSubmitting(false);
            }
        } else if (currentStep === 4) {
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
        if (currentStep === 3) return customerName.trim() !== "" && customerPhone.trim() !== "";
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
                                <button
                                    onClick={() => setActiveCategory("all")}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors",
                                        activeCategory === "all"
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                    )}
                                >
                                    All services
                                </button>
                                {categories.map(cat => (
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
                                {categories.filter(cat => activeCategory === "all" || cat.id === activeCategory).map(cat => {
                                    const categoryServices = servicesData.filter(s => String(s.categoryId) === String(cat.id));
                                    if (categoryServices.length === 0) return null;
                                    return (
                                        <div key={cat.id} id={cat.id}>
                                            <h3 className="text-xl font-bold mb-4">{cat.label}</h3>
                                            <div className="space-y-4">
                                                {categoryServices.map(service => {
                                                    const isSelected = selectedServices.includes(String(service.id));
                                                    return (
                                                        <div
                                                            key={String(service.id)}
                                                            className={cn(
                                                                "border rounded-xl p-4 flex items-start justify-between hover:border-black transition-colors cursor-pointer group",
                                                                isSelected ? "border-black ring-1 ring-black" : "border-gray-200"
                                                            )}
                                                            onClick={() => toggleService(String(service.id))}
                                                        >
                                                            <div>
                                                                <h4 className="font-bold text-gray-900">{String(service.name)}</h4>
                                                                <p className="text-sm text-gray-500 mt-1">{String(service.duration)}</p>
                                                                <p className="text-sm text-gray-400">{String(service.description || "")}</p>
                                                                <p className="font-semibold text-gray-900 mt-2">RM {String(service.price)}</p>
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
                        <div className="space-y-4">
                            {isLoadingStaff ? (
                                <div className="text-center py-10">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                                    <p className="mt-4 text-gray-500 font-medium">Finding available professionals...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        key="any"
                                        onClick={() => setSelectedStaff("any")}
                                        className={cn(
                                            "p-4 border rounded-xl text-left hover:border-black transition-all flex items-center gap-4",
                                            selectedStaff === "any" ? "border-black ring-1 ring-black bg-gray-50" : ""
                                        )}
                                    >
                                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                            <i className="ri-team-line text-gray-500"></i>
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">Any Professional</div>
                                            <div className="text-sm text-gray-500">Maximum availability</div>
                                        </div>
                                        <div className={cn("ml-auto w-5 h-5 rounded-full border flex items-center justify-center", selectedStaff === "any" ? "bg-black border-black" : "border-gray-300")}>
                                            {selectedStaff === "any" && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </button>

                                    {availableStaff.map(staff => (
                                        <button
                                            key={String(staff.id)}
                                            onClick={() => setSelectedStaff(String(staff.id))}
                                            className={cn(
                                                "p-4 border rounded-xl text-left hover:border-black transition-all flex items-center gap-4",
                                                selectedStaff === String(staff.id) ? "border-black ring-1 ring-black bg-gray-50" : ""
                                            )}
                                        >
                                            <div className={cn("w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0", (!staff.image && !staff.avatar) && "flex items-center justify-center")}>
                                                {(staff.image || staff.avatar) ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img src={String(staff.avatar || staff.image)} alt={String(staff.name)} className="w-full h-full object-cover" />
                                                ) : (
                                                    <i className="ri-user-line text-gray-500"></i>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900">{String(staff.name)}</div>
                                                <div className="text-sm text-gray-500">{String(staff.role || "Specialist")}</div>
                                            </div>
                                            <div className={cn("ml-auto w-5 h-5 rounded-full border flex items-center justify-center", selectedStaff === String(staff.id) ? "bg-black border-black" : "border-gray-300")}>
                                                {selectedStaff === String(staff.id) && <div className="w-2 h-2 rounded-full bg-white" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
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

                            <h3 className="font-bold text-lg">Available Timeslots</h3>

                            {isLoadingTimeslots ? (
                                <div className="text-center py-10">
                                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                                    <p className="mt-4 text-gray-500 font-medium">Finding available times...</p>
                                </div>
                            ) : availableTimeslots.length === 0 ? (
                                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                    <i className="ri-calendar-close-line text-4xl text-gray-300 mb-2 block"></i>
                                    <p className="text-gray-500 font-medium tracking-tight">No availability found</p>
                                    <p className="text-xs text-gray-400 mt-1">Please select another date or professional.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {availableTimeslots.map((tItem: any, idx: number) => {
                                        const t = typeof tItem === 'string' ? tItem : (tItem.start_time || tItem.time || String(tItem));
                                        return (
                                            <button
                                                key={t + "_" + idx}
                                                onClick={() => setSelectedTime(t)}
                                                className={cn(
                                                    "py-2 px-4 rounded-lg border text-sm font-semibold hover:border-black transition-colors",
                                                    selectedTime === t ? "bg-black text-white border-black" : "bg-white text-gray-900 border-gray-200"
                                                )}
                                            >
                                                {t}
                                            </button>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 4: CONFIRM */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="bg-gray-50 p-6 rounded-xl space-y-4">
                                <div className="flex items-center gap-4 border-b pb-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={String(venueData.image || "")} className="w-16 h-16 rounded-lg object-cover" alt="Venue" />
                                    <div>
                                        <h3 className="font-bold">{String(venueData.name)}</h3>
                                        <p className="text-sm text-gray-500">{String(venueData.address)}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Date & Time</span>
                                        <span className="font-semibold">{selectedDate} at {selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Professional</span>
                                        <span className="font-semibold text-gray-900">
                                            {selectedStaff === "any" ? "Any Professional" : String(availableStaff.find(s => String(s.id) === selectedStaff)?.name || "Selected Professional")}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">Your Details</h3>

                                {bookingError && (
                                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                                        {bookingError}
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-black focus:border-black outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                        <input
                                            type="tel"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-black focus:border-black outline-none"
                                            placeholder="+60123456789"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
                                        <input
                                            type="email"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-black focus:border-black outline-none"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                        <select
                                            value={customerGender}
                                            onChange={(e) => setCustomerGender(e.target.value)}
                                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-black focus:border-black outline-none bg-white"
                                        >
                                            <option value="Female">Female</option>
                                            <option value="Male">Male</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg">Payment Method</h3>
                                <div className="p-4 border border-black ring-1 ring-black bg-gray-50 rounded-xl flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <i className="ri-bank-card-line text-xl"></i>
                                        <span className="font-medium">Pay at venue</span>
                                    </div>
                                    <i className="ri-check-line text-xl font-bold"></i>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 5: DETAILS / SUCCESS */}
                    {currentStep === 4 && (
                        <div className="space-y-6 text-center py-8">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="ri-check-line text-4xl"></i>
                            </div>
                            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                            <p className="text-gray-500">Your booking has been successfully created.</p>

                            {bookingResult && (
                                <div className="mt-8 text-left bg-gray-50 p-6 rounded-xl space-y-3">
                                    <h3 className="font-bold text-lg border-b pb-2 mb-4">Booking Details</h3>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Booking ID</span>
                                        <span className="font-semibold">{String(bookingResult.id || bookingResult.booking_number || "-")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Status</span>
                                        <span className="font-semibold capitalize">{String(bookingResult.status || "Pending")}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Date & Time</span>
                                        <span className="font-semibold">{String(bookingResult.date || selectedDate)} {String(bookingResult.start_time || selectedTime)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Customer</span>
                                        <span className="font-semibold">{String(bookingResult.name || customerName)}</span>
                                    </div>
                                    {Boolean(bookingResult.total_amount) && (
                                        <div className="flex justify-between border-t pt-2 mt-2">
                                            <span className="font-bold">Total Amount</span>
                                            <span className="font-bold">RM {String(bookingResult.total_amount)}</span>
                                        </div>
                                    )}
                                </div>
                            )}
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
                    <Button className="w-full h-14 text-lg font-bold" disabled={!isStepValid() || isSubmitting} onClick={handleNext}>
                        {isSubmitting ? "Processing..." : (currentStep === 3 ? "Confirm Booking" : (currentStep === 4 ? "Done" : "Continue"))}
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
                        <img src={String(venueData.image || "")} alt="Venue" className="w-16 h-16 rounded-md object-cover" />
                        <div>
                            <h3 className="font-bold text-sm leading-tight">{String(venueData.name)}</h3>
                            <div className="flex items-center gap-1 text-xs font-semibold mt-1">
                                <span>{String(venueData.rating || "5.0")}</span>
                                <i className="ri-star-fill text-yellow-500"></i>
                                <span className="text-gray-400 font-normal">({String(venueData.reviews || "0")})</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-[200px]">{String(venueData.address)}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {selectedServices.length === 0 ? (
                        <p className="text-gray-400 text-sm">No services selected</p>
                    ) : (
                        <div className="space-y-4">
                            {selectedServiceObjects.map(s => (
                                <div key={String(s.id)} className="flex justify-between items-start text-sm">
                                    <div>
                                        <div className="font-semibold">{String(s.name)}</div>
                                        <div className="text-gray-500 text-xs">{String(s.duration)}</div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">RM {String(s.price)}</span>
                                        {currentStep === 0 && (
                                            <button onClick={() => toggleService(String(s.id))}><i className="ri-close-circle-fill text-gray-300 hover:text-gray-500"></i></button>
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
                        disabled={!isStepValid() || isSubmitting}
                        onClick={handleNext}
                    >
                        {isSubmitting ? "Processing..." : (currentStep === 3 ? "Confirm" : (currentStep === 4 ? "Done" : "Continue"))}
                    </Button>
                </div>
            </div>
        </div>
    );
}
