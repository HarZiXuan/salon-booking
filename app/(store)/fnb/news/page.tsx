"use client";

import { useRouter } from "next/navigation";
import { fnbNews } from "@/lib/fnb-dummy-data";

export default function FnbNewsPage() {
    const router = useRouter();

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Featured Offers</h2>
            <div className="flex flex-col gap-4">
                {fnbNews.map((news) => (
                    <button
                        key={news.id}
                        onClick={() => router.push(`/fnb/news/${news.id}`)}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all flex flex-row min-h-[120px] text-left w-full"
                    >
                        <div
                            className="w-28 flex-shrink-0 bg-slate-200 bg-cover bg-center"
                            style={{ backgroundImage: `url(${news.image})` }}
                        />
                        <div className="py-4 pl-4 pr-2 flex flex-col flex-1 min-w-0 justify-center">
                            <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-tight">{news.title}</h3>
                            <p className="text-xs text-amber-600 font-medium mt-1">{news.date}</p>
                            <p className="text-[13px] text-slate-500 mt-1 line-clamp-2">{news.description}</p>
                        </div>
                        <div className="flex items-center pr-3 pl-1 text-slate-300 flex-shrink-0">
                            <i className="ri-arrow-right-s-line text-2xl" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
