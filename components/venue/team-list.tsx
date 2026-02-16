"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock data extended for expansion test
const FULL_TEAM = [
    { id: 1, name: "Azri", role: "Master Barber", image: "https://i.pravatar.cc/150?u=Azri" },
    { id: 2, name: "Danial", role: "Senior Barber", image: "https://i.pravatar.cc/150?u=Danial" },
    { id: 3, name: "Haziq", role: "Barber", image: "https://i.pravatar.cc/150?u=Haziq" },
    { id: 4, name: "Sarah", role: "Stylist", image: "https://i.pravatar.cc/150?u=Sarah" },
    { id: 5, name: "Mike", role: "Barber", image: "https://i.pravatar.cc/150?u=Mike" },
    { id: 6, name: "Jenny", role: "Colorist", image: "https://i.pravatar.cc/150?u=Jenny" },
    { id: 7, name: "Tom", role: "Junior Barber", image: "https://i.pravatar.cc/150?u=Tom" },
    { id: 8, name: "Lisa", role: "Manager", image: "https://i.pravatar.cc/150?u=Lisa" },
];

export function TeamList() {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Show 4 items by default, or all if expanded
    const displayedTeam = isExpanded ? FULL_TEAM : FULL_TEAM.slice(0, 4);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Team</h2>
                {FULL_TEAM.length > 4 && (
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            setIsExpanded(!isExpanded);
                        }} 
                        className="text-sm font-semibold text-gray-900 hover:underline"
                    >
                        {isExpanded ? "See less" : "See all"}
                    </button>
                )}
            </div>
            
            <div className={cn(
                "grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-500 ease-in-out",
                isExpanded ? "max-h-[1000px] opacity-100" : "max-h-[500px]"
            )}>
                {displayedTeam.map((member) => (
                    <div key={member.id} className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-black transition-colors cursor-pointer group bg-white">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-gray-100 border group-hover:border-black/10 transition-colors">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{member.name}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{member.role}</p>
                        <div className="mt-2 flex items-center text-xs text-black font-bold bg-gray-100 px-2 py-1 rounded-full">
                            <i className="ri-star-fill text-yellow-500 mr-1"></i>
                            5.0
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
