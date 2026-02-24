"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TeamList({ specialists }: { specialists: Record<string, any>[] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Show 4 items by default, or all if expanded
    const displayedTeam = isExpanded ? specialists : specialists.slice(0, 4);

    if (!specialists || specialists.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Team</h2>
                {specialists.length > 4 && (
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
                isExpanded ? "max-h-[1000px] opacity-100" : "max-h-[500px] overflow-hidden"
            )}>
                {displayedTeam.map((member) => (
                    <div key={String(member.id)} className="flex flex-col items-center justify-center p-4 border rounded-xl hover:border-black transition-colors cursor-pointer group bg-white">
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-gray-100 border group-hover:border-black/10 transition-colors">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={String(member.avatar || member.image || "https://ui-avatars.com/api/?name=" + String(member.name))} alt={String(member.name)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{String(member.name)}</h3>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">{String(member.role || "Specialist")}</p>
                        <div className="mt-2 flex items-center text-xs text-black font-bold bg-gray-100 px-2 py-1 rounded-full">
                            <i className="ri-star-fill text-yellow-500 mr-1"></i>
                            {String(member.rating || "5.0")}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
