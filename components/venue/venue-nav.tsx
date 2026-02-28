"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const tabs = [
    { id: "services", label: "Services" },
    { id: "team", label: "Team" },
    // { id: "reviews", label: "Reviews" },
    { id: "about", label: "About" },
];

export function VenueNav() {
    const [activeTab, setActiveTab] = useState("services");

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            // Offset for sticky header + nav
            const offset = 140;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
            setActiveTab(id);
        }
    };

    return (
        <div className="sticky top-20 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-6 h-14">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => scrollToSection(tab.id)}
                            className={cn(
                                "text-sm font-medium transition-colors whitespace-nowrap pb-4 mt-4 border-b-2 hover:text-black",
                                activeTab === tab.id
                                    ? "border-black text-black"
                                    : "border-transparent text-muted-foreground"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
