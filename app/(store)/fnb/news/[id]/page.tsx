"use client";

import { useParams, useRouter } from "next/navigation";
import { fnbNews } from "@/lib/fnb-dummy-data";

export default function FnbNewsDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const news = fnbNews.find((n) => String(n.id) === id);

    if (!news) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-4">
                <i className="ri-newspaper-line text-5xl text-slate-300" />
                <p className="text-slate-500 font-medium">Promo not found.</p>
                <button onClick={() => router.push("/fnb/news")} className="text-sm font-semibold underline text-slate-700">
                    Back to Offers
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Hero image */}
            <div className="relative w-full aspect-video bg-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={news.fullImage} alt={news.title} className="w-full h-full object-cover" />
                <button
                    onClick={() => router.push("/fnb/news")}
                    className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
                    aria-label="Go back"
                >
                    <i className="ri-arrow-left-line text-lg" />
                </button>
            </div>

            {/* Content */}
            <div className="px-4 py-6 bg-white">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-2">{news.date}</p>
                <h2 className="text-2xl font-bold text-slate-900 mb-1 leading-tight">{news.title}</h2>
                <p className="text-xs text-slate-400 mb-4">Valid until: {news.validityEnd}</p>
                <p className="text-slate-600 text-[15px] leading-relaxed">{news.description}</p>

                {news.ctaLabel && news.ctaLink && (
                    <button
                        onClick={() => router.push(news.ctaLink!)}
                        className="mt-6 w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        {news.ctaLabel}
                    </button>
                )}

                {/* Share */}
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({ title: news.title, url: window.location.href }).catch(() => {});
                        }
                    }}
                    className="mt-3 w-full border border-slate-200 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                    <i className="ri-share-line" />
                    Share
                </button>
            </div>
        </div>
    );
}
