export type FnbNews = {
    id: number;
    title: string;
    date: string;
    image: string;
    fullImage: string;
    description: string;
};

export const fnbNews: FnbNews[] = [
    { 
        id: 1, 
        title: "Mid-Autumn Festival Dessert Set", 
        date: "Available till end of September", 
        image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&h=400&fit=crop", 
        fullImage: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&h=800&fit=crop",
        description: "Celebrate the Mid-Autumn Festival with our exclusive limited-edition dessert set! Featuring a combination of our signature classic traditional sweet soups paired carefully with handmade snowy mooncakes. Perfect for sharing with friends and loved ones."
    },
    { 
        id: 2, 
        title: "New Launch: Mango Pomelo Sago", 
        date: "Available Daily", 
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
        benefit: "Receive an instant RM10 deduction from your total dining or takeaway bill.",
        terms: [
            "Minimum spend of RM30 required to utilize this voucher.",
            "Valid for dine-in and takeaway orders.",
            "Not exchangeable for cash or refunds of any kind.",
            "Not valid with other discount vouchers."
        ],
        validUntil: "Valid for 30 days upon claiming.",
        howToRedeem: "1. Tap 'Confirm Claim Reward'.\n2. A unique QR code will be generated on your screen.\n3. Show the QR code to our staff at the ordering counter before making your final payment.\n4. The RM10 will be deducted from your total bill."
    }
];

export const fnbOutlet = {
    name: "YDT Dessert 苦中一点甜 (糖水铺)",
    description: "Indulge in authentic traditional Chinese sweet soups and modernized local desserts perfect for your late-night sweet cravings. From comforting warm pastes to refreshing ice-cold bowls, we pour our heart into every recipe.",
    hours: [
        { day: "Sunday - Wednesday", hours: "12:00 PM - 12:00 AM" },
        { day: "Thursday - Saturday", hours: "12:00 PM - 1:00 AM" },
        { day: "Tuesday", hours: "Closed" }
    ],
    address: "10, Jalan Tengah, Bandar Baru Petaling Jaya, 46200 Petaling Jaya, Selangor, Malaysia",
    phone: "60123456789",
    image: "https://placehold.co/200x200/ffffff/1e293b?text=YDT+Logo",
    images: [
        "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=1200&h=800&fit=crop", // Hero dummy 
        "https://images.unsplash.com/photo-1495147466023-e16194ddc4cb?w=1200&h=800&fit=crop"
    ]
};
