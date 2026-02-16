"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/global-store/cart";
import { cn } from "@/lib/utils";
import { useState } from "react";

// Mock Data
const categories = [
    { id: "featured", label: "Featured" },
    { id: "haircut", label: "Haircut" },
    { id: "beard", label: "Beard" },
    { id: "combo", label: "Combo" },
];

const services = [
    {
        id: "1",
        categoryId: "featured",
        name: "Senior Barber",
        description: "Haircut with Senior Barber",
        duration: "45 mins",
        price: 40,
    },
    {
        id: "2",
        categoryId: "featured",
        name: "Master Barber",
        description: "Haircut with Master Barber",
        duration: "45 mins",
        price: 50,
    },
    {
        id: "3",
        categoryId: "haircut",
        name: "Junior Barber",
        description: "Standard haircut",
        duration: "60 mins",
        price: 30,
    },
    {
        id: "4",
        categoryId: "beard",
        name: "Beard Trim",
        description: "Shape up and trim",
        duration: "30 mins",
        price: 25,
    },
];

export function ServiceList() {
    const [activeCategory, setActiveCategory] = useState("featured");
    const { addItem } = useCartStore();

    return (
        <div className="space-y-8">
            {/* Category Filter Pills - Sticky under main nav */}
            <div className="sticky top-14 z-30 bg-background py-4 -mx-4 px-4 overflow-x-auto no-scrollbar md:mx-0 md:px-0">
                <div className="flex gap-2">
                    {categories.map((cat) => (
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
                {services
                    .filter((s) => activeCategory === s.categoryId || activeCategory === 'all')
                    // For now just showing selected category, or we could show all grouped by category
                    // Fresha shows all grouped by category usually, scrolling to them. 
                    // Let's implement grouping for better fidelity if "All" or just filter for now.
                    // The reference had tabs. Let's stick to tabs filtering for simplicity first, or simpler: 
                    // Just list the active category items.
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
                                    onClick={() => addItem({ ...service, quantity: 1 })}
                                >
                                    Book
                                </Button>
                            </div>
                        </div>
                    ))}
                {services.filter(s => s.categoryId === activeCategory).length === 0 && (
                    <div className="p-8 text-center text-gray-500">No services in this category</div>
                )}
            </div>
        </div>
    );
}
