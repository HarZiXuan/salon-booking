"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface Tab {
    id: string;
    label: string;
}

interface VenueNavProps {
    tabs?: Tab[];
    stickyTop?: string;
    className?: string;
    center?: boolean;
}

const defaultTabs = [
    { id: "services", label: "Services" },
    { id: "team", label: "Team" },
    // { id: "reviews", label: "Reviews" },
    { id: "about", label: "About" },
];

export function VenueNav({ 
    tabs = defaultTabs, 
    stickyTop = "top-20",
    className,
    center = false
}: VenueNavProps) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id || "");

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
        <div className={cn("sticky z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b", stickyTop, className)}>
            <div className="container overflow-x-auto no-scrollbar">
                <div className={cn("flex items-center gap-6 h-14", center && "justify-center")}>
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
