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
