"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/global-store/cart";
import { useState } from "react";

// Mock data fetcher
const fetchService = async (id: string) => {
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 500));
    const allServices = [
        { id: "1", name: "Haircut & Styling", price: 50, duration: "60 min", description: "Complete hair makeover including wash, cut, and style.", image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=400" },
        { id: "2", name: "Manicure & Pedicure", price: 40, duration: "45 min", description: "Relaxing hand and foot care with fresh polish.", image: "https://images.unsplash.com/photo-1632345031435-8727f68979a6?auto=format&fit=crop&q=80&w=400" },
        { id: "3", name: "Facial Treatment", price: 80, duration: "90 min", description: "Deep cleansing facial for glowing skin.", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400" },
    ];
    return allServices.find(s => s.id === id);
}

export default function ServicePage() {
    const params = useParams();
    const router = useRouter();
    const { addItem } = useCartStore();
    const [isAdding, setIsAdding] = useState(false);

    // params.serviceId can be string or string[]
    const serviceId = Array.isArray(params.serviceId) ? params.serviceId[0] : params.serviceId;

    const { data: service, isLoading } = useQuery({
        queryKey: ['service', serviceId],
        queryFn: () => fetchService(serviceId!)
    });

    if (isLoading) return <div className="text-center py-10">Loading service details...</div>;
    if (!service) return <div className="text-center py-10">Service not found</div>;

    const handleBook = () => {
        setIsAdding(true);
        // Simulate adding to cart
        setTimeout(() => {
            addItem({
                id: service.id,
                name: service.name,
                price: service.price,
                quantity: 1
            });
            setIsAdding(false);
            // Optionally redirect to cart or show success
            alert("Added to cart!");
            router.push("/");
        }, 500);
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square md:aspect-auto overflow-hidden rounded-lg bg-muted relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={service.image}
                    alt={service.name}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{service.name}</h1>
                    <p className="mt-2 text-xl text-primary font-semibold">${service.price}</p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <i className="ri-time-line"></i>
                        <span>{service.duration}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                        {service.description}
                    </p>
                </div>

                <div className="pt-6 border-t">
                    <Button size="lg" className="w-full md:w-auto" onClick={handleBook} disabled={isAdding}>
                        {isAdding ? "Adding..." : "Add to Cart"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
