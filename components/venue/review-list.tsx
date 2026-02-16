"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Extended Mock Data
const ALL_REVIEWS = [
    { id: 1, user: "John D.", date: "2 days ago", rating: 5, text: "Best haircut I've had in years! Detailed and professional." },
    { id: 2, user: "Michael S.", date: "1 week ago", rating: 5, text: "Great vibes and excellent service. Highly recommend." },
    { id: 3, user: "Sarah L.", date: "2 weeks ago", rating: 4, text: "Good cut but had to wait 15 mins past my appointment time." },
    { id: 4, user: "David K.", date: "3 weeks ago", rating: 5, text: "Amazing beard trim. The hot towel treatment is a must." },
    { id: 5, user: "Emily R.", date: "1 month ago", rating: 5, text: "My son loves getting his hair cut here. Very kid friendly." },
    { id: 6, user: "Chris P.", date: "1 month ago", rating: 5, text: "Consistent quality every time. Been coming here for a year." },
];

export function ReviewList() {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayedReviews = isExpanded ? ALL_REVIEWS : ALL_REVIEWS.slice(0, 2);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Reviews</h2>
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        setIsExpanded(!isExpanded);
                    }}
                    className="text-sm font-semibold text-gray-900 hover:underline"
                >
                    {isExpanded ? "See less" : "See all"}
                </button>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-between border border-gray-100">
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-gray-900">5.0</span>
                        <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map(i => <i key={i} className="ri-star-fill text-xl"></i>)}
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 font-medium">Based on 128 reviews</p>
                </div>
                <div className="hidden sm:block text-right">
                    <div className="text-sm text-gray-500">98% of customers recommended</div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 transition-all">
                {displayedReviews.map((review) => (
                    <div key={review.id} className="border p-5 rounded-xl space-y-3 bg-white hover:border-black transition-colors cursor-default">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center text-sm font-bold border">
                                    {review.user.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{review.user}</p>
                                    <p className="text-xs text-gray-500">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex text-yellow-500 text-xs">
                                {[...Array(review.rating)].map((_, i) => <i key={i} className="ri-star-fill"></i>)}
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {review.text}
                        </p>
                    </div>
                ))}
            </div>
            
            {/* Show "Load More" button at bottom if list is long and not fully expanded */}
            {!isExpanded && (
                <div className="text-center pt-2">
                    <Button variant="outline" onClick={() => setIsExpanded(true)} className="rounded-full">
                        Read more reviews
                    </Button>
                </div>
            )}
        </div>
    );
}
