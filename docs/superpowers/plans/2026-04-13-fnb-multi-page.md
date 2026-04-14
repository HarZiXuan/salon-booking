# F&B Multi-Page Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the single `/fnb` page into a full multi-page module with dedicated routes for News, Rewards (with full claim flow), Reservation, Wallet, and About — all sharing a sticky layout header.

**Architecture:** A new `app/(store)/fnb/layout.tsx` wraps all sub-routes, providing the shared banner + merchant info + sticky tab nav. Each module lives at its own URL (`/fnb/news`, `/fnb/rewards`, etc.). All data is dummy, sourced from `lib/fnb-dummy-data.ts`.

**Tech Stack:** Next.js 14 App Router, TypeScript, Tailwind CSS, `qrcode.react` (already installed), `remixicon` (already installed).

---

## Context

- **Repo:** `/Users/zixuanhar/salon-booking`
- **Branch:** `superpowers`
- **Dev server:** Already running at `http://localhost:3000`
- **Existing file of note:** `app/(store)/fnb/page.tsx` — the current monolithic page. This will be refactored.
- **Dummy data file:** `lib/fnb-dummy-data.ts` — will be extended, not replaced.
- **Shared nav component:** `components/venue/venue-nav.tsx` — already supports `tabs`, `stickyTop`, `center`, and `className` props.
- **Store layout:** `app/(store)/layout.tsx` — has a sticky header `h-20` (80px). Tab nav sits below it.
- **Design notes:** Mobile-first. Banner uses `aspect-[21/9]`. Logo overlaid at bottom-left. Tab nav is sticky, centered on mobile.

---

## Task 1: Extend dummy data

**Files:**
- Modify: `lib/fnb-dummy-data.ts`

- [ ] **Step 1: Add missing fields to existing types and add new exports**

Replace the content of `lib/fnb-dummy-data.ts` with the following (adds fields to existing types and new exports):

```typescript
export type FnbNews = {
    id: number;
    title: string;
    date: string;
    validityEnd: string;
    image: string;
    fullImage: string;
    description: string;
    ctaLabel?: string;
    ctaLink?: string;
};

export const fnbNews: FnbNews[] = [
    { 
        id: 1, 
        title: "Mid-Autumn Festival Dessert Set", 
        date: "Available till end of September",
        validityEnd: "30 Sep 2025",
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop", 
        fullImage: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&h=800&fit=crop",
        description: "Celebrate the Mid-Autumn Festival with our exclusive limited-edition dessert set! Featuring a combination of our signature classic traditional sweet soups paired carefully with handmade snowy mooncakes. Perfect for sharing with friends and loved ones.",
        ctaLabel: "Reserve a Table",
        ctaLink: "/fnb/reservation"
    },
    { 
        id: 2, 
        title: "New Launch: Mango Pomelo Sago", 
        date: "Available Daily",
        validityEnd: "Ongoing",
        image: "https://images.unsplash.com/photo-1495147466023-e16194ddc4cb?w=600&h=400&fit=crop", 
        fullImage: "https://images.unsplash.com/photo-1495147466023-e16194ddc4cb?w=1200&h=800&fit=crop",
        description: "Introducing our latest creation! A refreshing bowl of Mango Pomelo Sago made with freshly pureed sweet mangoes, topped with juicy pomelo pulps and chewy sago pearls. A perfect treat to beat the tropical heat!"
    }
];

export type FnbReward = {
    id: string;
    name: string;
    points: number;
    isAvailable: boolean;
    availability: "available" | "unavailable";
    thumbnail: string;
    benefit: string;
    terms: string[];
    validUntil: string;
    howToRedeem: string;
};

export const fnbRewards: FnbReward[] = [
    { 
        id: "R1", 
        name: "Free Bowl of Traditional Sweet Soup", 
        points: 500, 
        isAvailable: true,
        availability: "available",
        thumbnail: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&h=300&fit=crop",
        benefit: "Enjoy 1 complimentary bowl of any classic traditional sweet soup of your choice (e.g., Red Bean, Mung Bean, Black Sesame Paste, or Peanut Paste).",
        terms: [
            "Valid for dine-in and takeaway orders.",
            "Not valid with other ongoing promotions or discounts.",
            "Limited to one redemption per receipt.",
            "Subject to daily availability of the sweet soup."
        ],
        validUntil: "Valid for 60 days upon claiming.",
        howToRedeem: "1. Tap 'Confirm Claim Reward'.\n2. A unique QR code will be generated on your screen.\n3. Present the QR code to our staff at the cashier before making your payment.\n4. Enjoy your free dessert!"
    },
    { 
        id: "R2", 
        name: "RM10 Off Total Bill", 
        points: 1200, 
        isAvailable: true,
        availability: "available",
        thumbnail: "https://images.unsplash.com/photo-1495147466023-e16194ddc4cb?w=400&h=300&fit=crop",
        benefit: "Receive an instant RM10 deduction from your total dining or takeaway bill.",
        terms: [
            "Minimum spend of RM30 required to utilize this voucher.",
            "Valid for dine-in and takeaway orders.",
            "Not exchangeable for cash or refunds of any kind.",
            "Not valid with other discount vouchers."
        ],
        validUntil: "Valid for 30 days upon claiming.",
        howToRedeem: "1. Tap 'Confirm Claim Reward'.\n2. A unique QR code will be generated on your screen.\n3. Show the QR code to our staff at the ordering counter before making your final payment.\n4. The RM10 will be deducted from your total bill."
    },
    { 
        id: "R3", 
        name: "Buy 2 Get 1 Free Dessert", 
        points: 800, 
        isAvailable: false,
        availability: "unavailable",
        thumbnail: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
        benefit: "Purchase any 2 desserts and get the lowest-priced one free.",
        terms: [
            "Valid for dine-in only.",
            "Cannot be combined with other promotions.",
            "Staff discretion applies to item selection."
        ],
        validUntil: "Valid for 14 days upon claiming.",
        howToRedeem: "Present QR code to staff before ordering."
    }
];

export const fnbOutlet = {
    name: "YDT Dessert 苦中一点甜 (糖水铺)",
    description: "Indulge in authentic traditional Chinese sweet soups and modernized local desserts perfect for your late-night sweet cravings. From comforting warm pastes to refreshing ice-cold bowls, we pour our heart into every recipe.",
    hours: [
        { day: "Sunday - Monday", hours: "12:00 PM - 12:00 AM" },
        { day: "Tuesday", hours: "Closed" },
        { day: "Wednesday - Thursday", hours: "12:00 PM - 12:00 AM" },
        { day: "Friday - Saturday", hours: "12:00 PM - 1:00 AM" }
    ],
    address: "10, Jalan Tengah, Bandar Baru Petaling Jaya, 46200 Petaling Jaya, Selangor, Malaysia",
    phone: "60123456789",
    instagram: "https://instagram.com/ydt.dessert",
    facebook: "https://facebook.com/ydtdessert",
    image: "https://placehold.co/200x200/ffffff/1e293b?text=YDT+Logo",
    images: [
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1495147466023-e16194ddc4cb?w=1200&h=800&fit=crop"
    ]
};

// --- Wallet / Loyalty dummy data ---

export const fnbUserPoints = 1200;
export const fnbUserTier = "Gold";

export type FnbEarnTransaction = {
    id: string;
    date: string;
    description: string;
    points: number;
};

export const fnbEarnHistory: FnbEarnTransaction[] = [
    { id: "E1", date: "12 Apr 2025", description: "Dined at YDT Dessert", points: 150 },
    { id: "E2", date: "5 Apr 2025", description: "Takeaway Order", points: 80 },
    { id: "E3", date: "28 Mar 2025", description: "Birthday Bonus", points: 300 },
    { id: "E4", date: "20 Mar 2025", description: "Dined at YDT Dessert", points: 120 },
    { id: "E5", date: "10 Mar 2025", description: "Referral Bonus", points: 200 }
];

export type FnbRedemptionTransaction = {
    id: string;
    date: string;
    rewardName: string;
    outlet: string;
    points: number;
};

export const fnbRedemptionHistory: FnbRedemptionTransaction[] = [
    { id: "D1", date: "1 Apr 2025", rewardName: "Free Bowl of Traditional Sweet Soup", outlet: "YDT Dessert PJ", points: 500 },
    { id: "D2", date: "15 Mar 2025", rewardName: "RM10 Off Total Bill", outlet: "YDT Dessert PJ", points: 1200 }
];

// --- Reservation dummy data ---

export const fnbAvailableTimeSlots = [
    "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
    "8:00 PM", "8:30 PM", "9:00 PM", "10:00 PM"
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/zixuanhar/salon-booking && npx tsc --noEmit 2>&1 | head -30
```

Expected: No errors related to `fnb-dummy-data.ts`. Any pre-existing errors in other files can be ignored.

- [ ] **Step 3: Commit**

```bash
cd /Users/zixuanhar/salon-booking && git add lib/fnb-dummy-data.ts && git commit -m "feat(fnb): extend dummy data with wallet, reservation, and reward fields"
```

---

## Task 2: Create shared FNB layout

**Files:**
- Create: `app/(store)/fnb/layout.tsx`

The layout wraps all `/fnb/*` pages. It renders the mobile banner + merchant info section once, then a sticky tab nav that uses `usePathname()` to detect the active tab. Desktop keeps the existing scrollable layout behaviour.

- [ ] **Step 1: Create `app/(store)/fnb/layout.tsx`**

```tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { fnbOutlet } from "@/lib/fnb-dummy-data";

const FNB_TABS = [
    { id: "news",        label: "News",    href: "/fnb/news" },
    { id: "rewards",     label: "Rewards", href: "/fnb/rewards" },
    { id: "reservation", label: "Reserve", href: "/fnb/reservation" },
    { id: "wallet",      label: "Wallet",  href: "/fnb/wallet" },
    { id: "about",       label: "About",   href: "/fnb/about" },
];

export default function FnbLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    const activeTab = FNB_TABS.find(tab => pathname.startsWith(tab.href))?.id ?? "news";

    const handleShare = () => {
        if (typeof navigator !== "undefined" && navigator.share) {
            navigator.share({ title: fnbOutlet.name, url: window.location.href }).catch(() => {});
        }
    };

    return (
        <div className="relative min-h-screen bg-gray-50">
            {/* Mobile Header — Banner + Info */}
            <div className="md:hidden">
                {/* Banner with overlaid logo */}
                <div className="relative w-full aspect-[21/9] bg-gray-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={fnbOutlet.images[0]}
                        alt={fnbOutlet.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />

                    {/* Logo overlay */}
                    <div className="absolute left-4 bottom-3 z-20">
                        <div className="w-[50px] h-[50px] rounded-full border-2 border-white overflow-hidden bg-white shadow-md flex items-center justify-center shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={fnbOutlet.image} alt="Logo" className="w-full h-full object-contain p-1" />
                        </div>
                    </div>

                    {/* Share button */}
                    <div className="absolute top-3 right-3 z-20">
                        <button
                            onClick={handleShare}
                            className="w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 border border-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all"
                            aria-label="Share"
                        >
                            <i className="ri-share-line text-lg" />
                        </button>
                    </div>
                </div>

                {/* Merchant info row */}
                <div className="pt-3 pb-2 px-4 bg-white">
                    <h1 className="text-lg font-bold leading-tight text-gray-900 truncate">{fnbOutlet.name}</h1>
                    <div className="flex items-center text-[12px] text-gray-500 gap-2 font-medium mt-0.5">
                        <span className="text-green-600 font-semibold">Open</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <span>{fnbOutlet.hours[0].hours}</span>
                    </div>
                </div>
            </div>

            {/* Desktop Hero — only shown on desktop */}
            <div className="hidden md:block container py-6">
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden group shadow-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={fnbOutlet.images[0]}
                        alt={fnbOutlet.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
                    <div className="absolute top-6 right-6 flex gap-3">
                        <button
                            onClick={handleShare}
                            className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 border border-white/50 flex items-center justify-center text-white backdrop-blur-md transition-all"
                            aria-label="Share"
                        >
                            <i className="ri-share-line text-lg" />
                        </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="w-20 h-20 rounded-full border-[3px] border-white overflow-hidden bg-white shadow-lg mb-3 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={fnbOutlet.image} alt="Logo" className="w-full h-full object-contain p-1" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-1">{fnbOutlet.name}</h1>
                        <div className="flex items-center text-white/90 text-sm gap-1.5 font-medium">
                            <i className="ri-map-pin-2-fill text-base" />
                            <span>{fnbOutlet.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-white/90 gap-2 font-medium mt-1">
                            <span className="text-green-400">Open</span>
                            <span className="w-1 h-1 rounded-full bg-white/40" />
                            <span>{fnbOutlet.hours[0].hours}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Tab Navigation */}
            <div className="sticky top-20 z-40 bg-white border-b shadow-sm">
                <div className="overflow-x-auto no-scrollbar">
                    <div className="flex items-center justify-center gap-6 md:gap-8 px-4 h-12 md:h-14 min-w-max mx-auto">
                        {FNB_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => router.push(tab.href)}
                                className={`relative flex flex-col items-center justify-center h-full text-[14px] md:text-[15px] font-semibold transition-all whitespace-nowrap ${
                                    activeTab === tab.id ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                                }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Page content */}
            <div className="pb-8">
                {children}
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Update `app/(store)/fnb/page.tsx` to redirect to `/fnb/news`**

Replace the entire content of `app/(store)/fnb/page.tsx` with:

```tsx
import { redirect } from "next/navigation";

export default function FnbHomePage() {
    redirect("/fnb/news");
}
```

- [ ] **Step 3: Verify dev server compiles (check terminal, no red errors)**

Visit `http://localhost:3000/fnb` — should redirect to `/fnb/news` (which will 404 until Task 3, that's fine).

- [ ] **Step 4: Commit**

```bash
cd /Users/zixuanhar/salon-booking && git add app/\(store\)/fnb/layout.tsx app/\(store\)/fnb/page.tsx && git commit -m "feat(fnb): add shared layout with sticky tab nav and redirect home to /fnb/news"
```

---

## Task 3: News list page + News detail page

**Files:**
- Create: `app/(store)/fnb/news/page.tsx` (news list)
- Create: `app/(store)/fnb/news/[id]/page.tsx` (news detail)

### News List

- [ ] **Step 1: Create `app/(store)/fnb/news/page.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { fnbNews } from "@/lib/fnb-dummy-data";

export default function FnbNewsPage() {
    const router = useRouter();

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">News &amp; Promos</h2>
            <div className="flex flex-col gap-4">
                {fnbNews.map((news) => (
                    <button
                        key={news.id}
                        onClick={() => router.push(`/fnb/news/${news.id}`)}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md hover:border-slate-300 transition-all flex flex-row h-32 text-left w-full"
                    >
                        <div
                            className="w-28 flex-shrink-0 bg-slate-200 bg-cover bg-center"
                            style={{ backgroundImage: `url(${news.image})` }}
                        />
                        <div className="p-4 flex flex-col flex-1 min-w-0 justify-center">
                            <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-snug">{news.title}</h3>
                            <p className="text-xs text-amber-600 font-medium mt-1">{news.date}</p>
                            <p className="text-[13px] text-slate-500 mt-1 line-clamp-2">{news.description}</p>
                        </div>
                        <div className="flex items-center pr-3 text-slate-300 flex-shrink-0">
                            <i className="ri-arrow-right-s-line text-2xl" />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
```

### News Detail

- [ ] **Step 2: Create `app/(store)/fnb/news/[id]/page.tsx`**

```tsx
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
                    Back to News
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
```

- [ ] **Step 3: Verify — visit `http://localhost:3000/fnb/news` and `http://localhost:3000/fnb/news/1`**

Check that: list shows 2 cards, clicking navigates to detail, Back button returns to list, CTA button on item 1 shows "Reserve a Table".

- [ ] **Step 4: Commit**

```bash
cd /Users/zixuanhar/salon-booking && git add app/\(store\)/fnb/news/ && git commit -m "feat(fnb): add news list and news detail pages"
```

---

## Task 4: Rewards list page

**Files:**
- Create: `app/(store)/fnb/rewards/page.tsx`

- [ ] **Step 1: Create rewards list page**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { fnbRewards, fnbUserPoints } from "@/lib/fnb-dummy-data";

export default function FnbRewardsPage() {
    const router = useRouter();

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4">
            {/* Points balance mini-card */}
            <div className="bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-sm">
                <div>
                    <p className="text-xs font-bold text-amber-900/70 uppercase tracking-wider">Your Points</p>
                    <p className="text-3xl font-bold text-amber-900 tabular-nums">{fnbUserPoints.toLocaleString()}</p>
                </div>
                <button
                    onClick={() => router.push("/fnb/wallet")}
                    className="text-xs font-semibold text-amber-900/80 underline"
                >
                    View Wallet
                </button>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-4">Available Rewards</h2>

            <div className="flex flex-col gap-4">
                {fnbRewards.map((reward) => (
                    <button
                        key={reward.id}
                        onClick={() => reward.availability === "available" && router.push(`/fnb/rewards/${reward.id}`)}
                        disabled={reward.availability === "unavailable"}
                        className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all text-left w-full flex flex-row h-28 ${
                            reward.availability === "available"
                                ? "border-slate-200 hover:shadow-md hover:border-slate-300 cursor-pointer"
                                : "border-slate-100 opacity-60 cursor-not-allowed"
                        }`}
                    >
                        <div
                            className="w-28 flex-shrink-0 bg-slate-200 bg-cover bg-center"
                            style={{ backgroundImage: `url(${reward.thumbnail})` }}
                        />
                        <div className="p-4 flex flex-col flex-1 min-w-0 justify-center">
                            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{reward.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full">
                                    {reward.points.toLocaleString()} pts
                                </span>
                                {reward.availability === "unavailable" && (
                                    <span className="bg-slate-100 text-slate-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                                        Out of stock
                                    </span>
                                )}
                            </div>
                        </div>
                        {reward.availability === "available" && (
                            <div className="flex items-center pr-3 text-slate-300 flex-shrink-0">
                                <i className="ri-arrow-right-s-line text-2xl" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Verify — visit `http://localhost:3000/fnb/rewards`**

Should show: points mini-card, 3 reward cards (2 available, 1 disabled/greyed out). Available cards link to detail.

- [ ] **Step 3: Commit**

```bash
cd /Users/zixuanhar/salon-booking && git add app/\(store\)/fnb/rewards/page.tsx && git commit -m "feat(fnb): add rewards list page"
```

---

## Task 5: Reward detail page with full claim flow

**Files:**
- Create: `app/(store)/fnb/rewards/[id]/page.tsx`

The page manages 5 steps using local `step` state: `"detail" | "insufficient" | "confirm" | "qr" | "done"`.

- [ ] **Step 1: Create `app/(store)/fnb/rewards/[id]/page.tsx`**

```tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { fnbRewards, fnbUserPoints } from "@/lib/fnb-dummy-data";

const QRCodeSVG = dynamic(() => import("qrcode.react").then((m) => m.QRCodeSVG), { ssr: false });

type Step = "detail" | "insufficient" | "confirm" | "qr" | "done";

export default function FnbRewardDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const reward = fnbRewards.find((r) => r.id === id);

    const [step, setStep] = useState<Step>("detail");
    const [qrData, setQrData] = useState("");
    const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
    const [currentPoints, setCurrentPoints] = useState(fnbUserPoints);
    const [termsOpen, setTermsOpen] = useState(false);

    // Countdown timer when on QR step
    useEffect(() => {
        if (step !== "qr") return;
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearInterval(timer);
    }, [step, timeLeft]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    if (!reward) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 px-4">
                <i className="ri-coupon-line text-5xl text-slate-300" />
                <p className="text-slate-500 font-medium">Reward not found.</p>
                <button onClick={() => router.push("/fnb/rewards")} className="text-sm font-semibold underline text-slate-700">
                    Back to Rewards
                </button>
            </div>
        );
    }

    const handleClaimTap = () => {
        if (currentPoints < reward.points) {
            setStep("insufficient");
        } else {
            setStep("confirm");
        }
    };

    const handleConfirm = () => {
        const qr = `REDEEM-${reward.id}-${Date.now()}`;
        setQrData(qr);
        setCurrentPoints((p) => p - reward.points);
        setTimeLeft(15 * 60);
        setStep("qr");
    };

    // ── Step: Detail ──────────────────────────────────────────────
    if (step === "detail") {
        return (
            <div className="max-w-2xl mx-auto">
                {/* Hero */}
                <div className="relative w-full aspect-video bg-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={reward.thumbnail} alt={reward.name} className="w-full h-full object-cover" />
                    <button
                        onClick={() => router.push("/fnb/rewards")}
                        className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white"
                        aria-label="Back"
                    >
                        <i className="ri-arrow-left-line text-lg" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-4 py-5 bg-white">
                    <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full">
                        {reward.points.toLocaleString()} Points
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 mt-3 mb-1 leading-tight">{reward.name}</h2>
                    <p className="text-xs text-slate-400 mb-4">{reward.validUntil}</p>

                    <h4 className="font-bold text-slate-800 mb-1">Benefits</h4>
                    <p className="text-slate-600 text-[15px] leading-relaxed mb-4">{reward.benefit}</p>

                    {/* Terms collapsible */}
                    <button
                        onClick={() => setTermsOpen((o) => !o)}
                        className="flex items-center justify-between w-full py-3 border-t border-slate-100 text-sm font-semibold text-slate-700"
                    >
                        <span>Terms &amp; Conditions</span>
                        <i className={`ri-arrow-${termsOpen ? "up" : "down"}-s-line text-lg`} />
                    </button>
                    {termsOpen && (
                        <ul className="list-disc pl-5 text-slate-500 text-sm space-y-1 pb-4">
                            {reward.terms.map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                    )}
                </div>

                {/* Sticky claim button */}
                <div className="sticky bottom-0 bg-white border-t px-4 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.07)]">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-500">Your balance</span>
                        <span className="font-bold text-slate-900">{currentPoints.toLocaleString()} pts</span>
                    </div>
                    <button
                        onClick={handleClaimTap}
                        className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                    >
                        Claim Reward
                    </button>
                </div>
            </div>
        );
    }

    // ── Step: Insufficient points ─────────────────────────────────
    if (step === "insufficient") {
        const shortfall = reward.points - currentPoints;
        return (
            <div className="max-w-md mx-auto px-4 py-10 flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                    <i className="ri-coin-line text-4xl text-red-400" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Not Enough Points</h3>
                    <p className="text-slate-500">You need <strong>{shortfall.toLocaleString()} more points</strong> to claim this reward.</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-5 w-full text-left space-y-2 border border-slate-200">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Your balance</span>
                        <span className="font-semibold text-slate-800">{currentPoints.toLocaleString()} pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Required</span>
                        <span className="font-semibold text-slate-800">{reward.points.toLocaleString()} pts</span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
                        <span className="text-red-500 font-semibold">Shortfall</span>
                        <span className="font-bold text-red-500">{shortfall.toLocaleString()} pts</span>
                    </div>
                </div>
                <div className="bg-amber-50 rounded-2xl p-4 w-full text-left border border-amber-200">
                    <p className="text-sm font-bold text-amber-800 mb-2">💡 How to earn more points</p>
                    <ul className="text-sm text-amber-700 space-y-1 list-disc pl-4">
                        <li>Dine in or order takeaway</li>
                        <li>Celebrate your birthday with us (+300 pts)</li>
                        <li>Refer a friend</li>
                    </ul>
                </div>
                <button
                    onClick={() => router.push("/fnb/rewards")}
                    className="w-full border border-slate-300 text-slate-700 font-bold py-4 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    Back to Rewards
                </button>
            </div>
        );
    }

    // ── Step: Confirm ─────────────────────────────────────────────
    if (step === "confirm") {
        const remaining = currentPoints - reward.points;
        return (
            <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
                <button onClick={() => setStep("detail")} className="flex items-center gap-1 text-sm text-slate-500 font-medium w-fit">
                    <i className="ri-arrow-left-line" /> Back
                </button>
                <h3 className="text-2xl font-bold text-slate-900">Confirm Claim</h3>

                {/* Reward summary card */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div
                        className="h-32 bg-slate-200 bg-cover bg-center"
                        style={{ backgroundImage: `url(${reward.thumbnail})` }}
                    />
                    <div className="p-4">
                        <h4 className="font-bold text-slate-900">{reward.name}</h4>
                        <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded-full mt-2 inline-block">
                            {reward.points.toLocaleString()} pts
                        </span>
                    </div>
                </div>

                {/* Points breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Current balance</span>
                        <span className="font-semibold">{currentPoints.toLocaleString()} pts</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Points to deduct</span>
                        <span className="font-semibold text-red-500">−{reward.points.toLocaleString()} pts</span>
                    </div>
                    <div className="border-t border-slate-200 pt-2 flex justify-between text-sm">
                        <span className="font-bold text-slate-700">Balance after</span>
                        <span className="font-bold text-slate-900">{remaining.toLocaleString()} pts</span>
                    </div>
                </div>

                <button
                    onClick={handleConfirm}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                >
                    Confirm &amp; Get QR Code
                </button>
                <button
                    onClick={() => setStep("detail")}
                    className="w-full border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    Cancel
                </button>
            </div>
        );
    }

    // ── Step: QR Code ─────────────────────────────────────────────
    if (step === "qr") {
        return (
            <div className="max-w-sm mx-auto px-4 py-8 flex flex-col items-center gap-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900">Scan to Redeem</h3>
                    <p className="text-slate-500 text-sm mt-1">Show this to our staff at the counter</p>
                </div>

                {/* QR code */}
                <div className="bg-white ring-8 ring-amber-100 p-4 rounded-2xl shadow-sm">
                    <QRCodeSVG value={qrData} size={220} />
                </div>

                {/* Timer */}
                <div className={`flex items-center gap-2 text-sm font-semibold ${timeLeft < 60 ? "text-red-500" : "text-slate-600"}`}>
                    <i className="ri-time-line" />
                    Expires in {formatTime(timeLeft)}
                </div>

                {/* 4-step guide */}
                <div className="bg-slate-50 rounded-2xl p-4 w-full border border-slate-200">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">How to redeem</p>
                    <div className="space-y-3">
                        {[
                            { step: 1, title: "Visit the Outlet", icon: "ri-store-2-line" },
                            { step: 2, title: "Tap Claims", icon: "ri-coupon-line" },
                            { step: 3, title: "Show QR Code", icon: "ri-qr-code-line" },
                            { step: 4, title: "Enjoy!", icon: "ri-emotion-happy-line" },
                        ].map((s) => (
                            <div key={s.step} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                    {s.step}
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className={`${s.icon} text-slate-400`} />
                                    <span className="text-sm font-medium text-slate-700">{s.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setStep("done")}
                    className="w-full bg-slate-100 text-slate-900 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-colors border border-slate-200"
                >
                    Done
                </button>
            </div>
        );
    }

    // ── Step: Done ────────────────────────────────────────────────
    return (
        <div className="max-w-sm mx-auto px-4 py-12 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-5xl text-green-500" />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Reward Claimed! 🎉</h3>
                <p className="text-slate-500">Enjoy your <strong>{reward.name}</strong>. Points updated.</p>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 w-full border border-slate-200">
                <p className="text-sm text-slate-500">Updated balance</p>
                <p className="text-3xl font-bold text-slate-900 tabular-nums">{currentPoints.toLocaleString()} pts</p>
            </div>
            <button
                onClick={() => router.push("/fnb/rewards")}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
            >
                Back to Rewards
            </button>
            <button
                onClick={() => router.push("/fnb/wallet")}
                className="text-sm text-slate-500 underline"
            >
                View my wallet
            </button>
        </div>
    );
}
```

- [ ] **Step 2: Verify — visit `http://localhost:3000/fnb/rewards/R1`**

Test the full flow:
1. Detail page shows correctly
2. "Claim Reward" with sufficient points (R1=500pts, balance=1200) → confirm screen
3. Confirm → QR code with countdown timer
4. Done → success screen with updated balance (700 pts shown)
5. Visit `/fnb/rewards/R2` (1200pts, exact match) → confirm flows
6. Manually test insufficient: temporarily note that R3 is disabled on list

- [ ] **Step 3: Commit**

```bash
cd /Users/zixuanhar/salon-booking && git add app/\(store\)/fnb/rewards/ && git commit -m "feat(fnb): add reward detail page with full 4-step claim flow"
```

---

## Task 6: Reservation page + success page

**Files:**
- Create: `app/(store)/fnb/reservation/page.tsx`
- Create: `app/(store)/fnb/reservation/success/page.tsx`

### Reservation Form

- [ ] **Step 1: Create `app/(store)/fnb/reservation/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { fnbAvailableTimeSlots, fnbOutlet } from "@/lib/fnb-dummy-data";

export default function FnbReservationPage() {
    const router = useRouter();
    const [date, setDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [pax, setPax] = useState(2);
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !selectedTime) {
            setError("Please select a date and time.");
            return;
        }
        setError("");
        const ref = `BK-${String(Date.now()).slice(-6)}`;
        router.push(`/fnb/reservation/success?ref=${ref}&date=${encodeURIComponent(date)}&time=${encodeURIComponent(selectedTime)}&pax=${pax}`);
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Reserve a Table</h2>
            <p className="text-sm text-slate-500 mb-6">at {fnbOutlet.name}</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Date */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Date</label>
                    <input
                        type="date"
                        min={today}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none bg-white"
                    />
                </div>

                {/* Time slots */}
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700">Time</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {fnbAvailableTimeSlots.map((slot) => (
                            <button
                                type="button"
                                key={slot}
                                onClick={() => setSelectedTime(slot)}
                                className={`py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                                    selectedTime === slot
                                        ? "bg-slate-900 text-white border-slate-900"
                                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Pax stepper */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Number of Guests</label>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setPax((p) => Math.max(1, p - 1))}
                            className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-xl font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            −
                        </button>
                        <span className="text-xl font-bold text-slate-900 w-8 text-center tabular-nums">{pax}</span>
                        <button
                            type="button"
                            onClick={() => setPax((p) => Math.min(20, p + 1))}
                            className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-xl font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Special notes */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700">Special Requests <span className="text-slate-400 font-normal">(optional)</span></label>
                    <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. allergies, high chair needed, anniversary..."
                        className="border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-slate-900 outline-none resize-none bg-white"
                    />
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
                >
                    Request Reservation
                </button>
            </form>
        </div>
    );
}
```

### Success Page

- [ ] **Step 2: Create `app/(store)/fnb/reservation/success/page.tsx`**

```tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { fnbOutlet } from "@/lib/fnb-dummy-data";

function SuccessContent() {
    const params = useSearchParams();
    const router = useRouter();
    const ref = params.get("ref") ?? "BK-000000";
    const date = params.get("date") ?? "";
    const time = params.get("time") ?? "";
    const pax = params.get("pax") ?? "1";

    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-MY", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        : "—";

    return (
        <div className="max-w-md mx-auto px-4 py-10 flex flex-col items-center text-center gap-6">
            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ri-checkbox-circle-line text-5xl text-green-500" />
            </div>

            <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">Booking Requested!</h3>
                <p className="text-slate-500 text-sm">The outlet will contact you shortly to confirm your reservation.</p>
            </div>

            {/* Booking ref */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-3 w-full">
                <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider mb-1">Booking Reference</p>
                <p className="text-2xl font-bold text-amber-900 tracking-widest">{ref}</p>
            </div>

            {/* Summary card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 w-full text-left space-y-3 shadow-sm">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Outlet</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[55%]">{fnbOutlet.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Date</span>
                    <span className="font-semibold text-slate-800 text-right max-w-[55%]">{formattedDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Time</span>
                    <span className="font-semibold text-slate-800">{time}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Guests</span>
                    <span className="font-semibold text-slate-800">{pax} pax</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
                <button
                    onClick={() => router.push("/fnb/wallet")}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors"
                >
                    View My Wallet
                </button>
                <button
                    onClick={() => router.push("/fnb/news")}
                    className="w-full border border-slate-200 text-slate-600 font-semibold py-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}

export default function FnbReservationSuccessPage() {
    return (
        <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
```

- [ ] **Step 3: Verify — visit `http://localhost:3000/fnb/reservation`**

Test:
1. Form renders with date picker, 12 time slot buttons, pax ±, notes field
2. Submit without selection → shows error
3. Fill in and submit → navigates to success page with ref, date, time, pax shown
4. "View My Wallet" and "Back to Home" buttons navigate correctly

- [ ] **Step 4: Commit**

```bash
cd /Users/zixuanhar/salon-booking && git add app/\(store\)/fnb/reservation/ && git commit -m "feat(fnb): add reservation form and success pages"
```

---

## Task 7: Wallet page

**Files:**
- Create: `app/(store)/fnb/wallet/page.tsx`

- [ ] **Step 1: Create `app/(store)/fnb/wallet/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    fnbUserPoints,
    fnbUserTier,
    fnbEarnHistory,
    fnbRedemptionHistory,
    fnbOutlet,
} from "@/lib/fnb-dummy-data";

type HistoryTab = "earn" | "redeem";

const TIER_CONFIG = {
    Bronze: { min: 0, max: 499, next: "Silver", nextMin: 500, color: "from-orange-700 to-orange-500" },
    Silver: { min: 500, max: 1199, next: "Gold", nextMin: 1200, color: "from-slate-500 to-slate-400" },
    Gold:   { min: 1200, max: 9999, next: null, nextMin: 9999, color: "from-amber-500 to-yellow-400" },
};

export default function FnbWalletPage() {
    const router = useRouter();
    const [tab, setTab] = useState<HistoryTab>("earn");

    const tierInfo = TIER_CONFIG[fnbUserTier as keyof typeof TIER_CONFIG] ?? TIER_CONFIG.Bronze;
    const progress = tierInfo.next
        ? Math.min(100, ((fnbUserPoints - tierInfo.min) / (tierInfo.nextMin - tierInfo.min)) * 100)
        : 100;
    const pointsToNext = tierInfo.next ? Math.max(0, tierInfo.nextMin - fnbUserPoints) : 0;

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4 flex flex-col gap-6">
            {/* Points card */}
            <div className={`rounded-3xl p-6 bg-gradient-to-br ${tierInfo.color} shadow-lg text-white relative overflow-hidden`}>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full pointer-events-none" />
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/70">{fnbUserTier} Member</p>
                            <p className="text-sm font-semibold text-white/90 mt-0.5">{fnbOutlet.name}</p>
                        </div>
                        <i className="ri-vip-crown-fill text-3xl text-white/40" />
                    </div>
                    <p className="text-5xl font-bold tabular-nums tracking-tight">{fnbUserPoints.toLocaleString()}</p>
                    <p className="text-sm text-white/70 mt-1">points</p>

                    {/* Progress bar */}
                    {tierInfo.next && (
                        <div className="mt-5">
                            <div className="flex justify-between text-xs text-white/70 mb-1.5">
                                <span>{fnbUserTier}</span>
                                <span>{tierInfo.next}</span>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-xs text-white/70 mt-1.5">
                                {pointsToNext.toLocaleString()} more points to {tierInfo.next}
                            </p>
                        </div>
                    )}
                    {!tierInfo.next && (
                        <p className="text-xs text-white/70 mt-3">✨ You&apos;re at our highest tier!</p>
                    )}
                </div>
            </div>

            {/* Reservation shortcut */}
            <button
                onClick={() => router.push("/fnb/reservation")}
                className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center justify-between shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <i className="ri-calendar-check-line text-xl text-slate-700" />
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-slate-800 text-sm">Make a Reservation</p>
                        <p className="text-xs text-slate-500">Book your table now</p>
                    </div>
                </div>
                <i className="ri-arrow-right-s-line text-slate-400 text-2xl" />
            </button>

            {/* History tabs */}
            <div>
                <div className="flex border-b border-slate-200 mb-4">
                    {(["earn", "redeem"] as HistoryTab[]).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex-1 pb-3 text-sm font-semibold transition-colors relative ${
                                tab === t ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                            }`}
                        >
                            {t === "earn" ? "Earn History" : "Redemption History"}
                            {tab === t && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-900 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Earn history */}
                {tab === "earn" && (
                    <div className="flex flex-col gap-3">
                        {fnbEarnHistory.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">{item.description}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{item.date}</p>
                                </div>
                                <span className="text-green-600 font-bold text-sm">+{item.points} pts</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Redemption history */}
                {tab === "redeem" && (
                    <div className="flex flex-col gap-3">
                        {fnbRedemptionHistory.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center justify-between shadow-sm">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-800 text-sm truncate">{item.rewardName}</p>
                                    <p className="text-xs text-slate-400 mt-0.5">{item.outlet} · {item.date}</p>
                                </div>
                                <span className="text-red-500 font-bold text-sm ml-3 flex-shrink-0">−{item.points} pts</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
```

- [ ] **Step 2: Verify — visit `http://localhost:3000/fnb/wallet`**

Check:
1. Gold gradient card with 1,200 pts and tier label shown
2. Progress bar at 100% (Gold is max tier, shows "You're at our highest tier!")
3. "Make a Reservation" shortcut card present
4. Earn History tab shows 5 transactions with green +pts
5. Redemption History tab shows 2 transactions with red -pts

- [ ] **Step 3: Commit**

```bash
cd /Users/zixuanhar/salon-booking && git add app/\(store\)/fnb/wallet/ && git commit -m "feat(fnb): add wallet page with points card, progress bar, and history tabs"
```

---

## Task 8: About page

**Files:**
- Create: `app/(store)/fnb/about/page.tsx`

- [ ] **Step 1: Create `app/(store)/fnb/about/page.tsx`**

```tsx
"use client";

import { useRouter } from "next/navigation";
import { fnbOutlet } from "@/lib/fnb-dummy-data";

export default function FnbAboutPage() {
    const router = useRouter();

    return (
        <div className="container py-6 max-w-2xl mx-auto px-4 flex flex-col gap-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-2">About Us</h2>
                <p className="text-slate-600 text-[15px] leading-relaxed">{fnbOutlet.description}</p>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="relative h-48">
                    <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(fnbOutlet.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        className="w-full h-full border-0 pointer-events-none"
                        loading="lazy"
                    />
                    <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(fnbOutlet.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 z-10"
                        aria-label="Open in Google Maps"
                    />
                </div>
                <div className="p-4 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2 flex-1">
                        <i className="ri-map-pin-fill text-slate-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700 leading-snug">{fnbOutlet.address}</span>
                    </div>
                    <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(fnbOutlet.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 px-4 py-2 rounded-xl border-2 border-slate-900 text-slate-900 font-semibold text-sm hover:bg-slate-50 transition-colors whitespace-nowrap"
                    >
                        Directions
                    </a>
                </div>
            </div>

            {/* Opening hours */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <i className="ri-time-line text-slate-400" /> Opening Hours
                </h3>
                <ul className="space-y-3">
                    {fnbOutlet.hours.map((schedule, idx) => (
                        <li key={idx} className="flex justify-between text-sm border-b border-slate-100 last:border-0 pb-2 last:pb-0">
                            <span className="font-medium text-slate-700">{schedule.day}</span>
                            <span className={schedule.hours === "Closed" ? "text-red-500 font-semibold" : "text-slate-500"}>
                                {schedule.hours}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Contact & socials */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <i className="ri-customer-service-2-line text-slate-400" /> Contact & Socials
                </h3>
                <div className="flex flex-col gap-3">
                    <a
                        href={`https://wa.me/${fnbOutlet.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-green-200 hover:bg-green-50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                            <i className="ri-whatsapp-line text-xl text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">WhatsApp Us</p>
                            <p className="text-xs text-slate-500">+{fnbOutlet.phone}</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-slate-300 text-xl ml-auto" />
                    </a>

                    <a
                        href={fnbOutlet.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                            <i className="ri-instagram-line text-xl text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">Instagram</p>
                            <p className="text-xs text-slate-500">@ydt.dessert</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-slate-300 text-xl ml-auto" />
                    </a>

                    <a
                        href={fnbOutlet.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 transition-colors"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                            <i className="ri-facebook-fill text-xl text-white" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-800 text-sm">Facebook</p>
                            <p className="text-xs text-slate-500">YDT Dessert</p>
                        </div>
                        <i className="ri-arrow-right-s-line text-slate-300 text-xl ml-auto" />
                    </a>
                </div>
            </div>

            {/* Reserve CTA */}
            <button
                onClick={() => router.push("/fnb/reservation")}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-md"
            >
                Reserve a Table
            </button>
        </div>
    );
}
```

- [ ] **Step 2: Verify — visit `http://localhost:3000/fnb/about`**

Check: description card, map iframe with directions link, opening hours table (Tuesday shows "Closed" in red), 3 contact/social link cards, Reserve CTA button.

- [ ] **Step 3: Commit**

```bash
cd /Users/zixuanhar/salon-booking && git add app/\(store\)/fnb/about/ && git commit -m "feat(fnb): add about page with map, hours, and social links"
```

---

## Task 9: Final TypeScript check + cleanup

**Files:**
- Check all new files compile

- [ ] **Step 1: Run TypeScript check across the FNB module**

```bash
cd /Users/zixuanhar/salon-booking && npx tsc --noEmit 2>&1 | grep "fnb"
```

Expected: No errors in any `/fnb/` file.

- [ ] **Step 2: Check all routes respond at the dev server**

Visit each route and confirm no red build errors in the terminal:
- `http://localhost:3000/fnb` → redirects to `/fnb/news`
- `http://localhost:3000/fnb/news`
- `http://localhost:3000/fnb/news/1`
- `http://localhost:3000/fnb/rewards`
- `http://localhost:3000/fnb/rewards/R1`
- `http://localhost:3000/fnb/reservation`
- `http://localhost:3000/fnb/wallet`
- `http://localhost:3000/fnb/about`

- [ ] **Step 3: Final commit**

```bash
cd /Users/zixuanhar/salon-booking && git add -A && git commit -m "feat(fnb): complete multi-page module - news, rewards, reservation, wallet, about"
```
