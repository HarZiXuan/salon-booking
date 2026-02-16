export const serviceCategories = [
    { id: "featured", label: "Featured" },
    { id: "hair", label: "Hair" },
    { id: "nails", label: "Nails" },
    { id: "massage", label: "Massage" },
    { id: "face", label: "Facial" },
];

export const venuesData = [
    {
        id: "1",
        name: "Downsouth Barbershop Setia Tropika",
        address: "16 Jalan Setia Tropika 1/1, Johor Bahru",
        rating: 5.0,
        reviews: 128,
        status: "Open until 10:00pm",
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=600",
        images: [
            "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=1200",
        ],
        categoryId: "hair",
        description: "Downsouth Barbershop requires no introduction. A staple in the Johor Bahru grooming scene, we pride ourselves on delivering precision cuts, classic shaves, and a community atmosphere that keeps our clients coming back. Our team of master barbers specializes in both modern fades and traditional scissors-over-comb techniques.",
        openingHours: [
            { day: "Monday", hours: "10:00 AM - 10:00 PM" },
            { day: "Tuesday", hours: "10:00 AM - 10:00 PM" },
            { day: "Wednesday", hours: "10:00 AM - 10:00 PM" },
            { day: "Thursday", hours: "10:00 AM - 10:00 PM" },
            { day: "Friday", hours: "10:00 AM - 10:00 PM" },
            { day: "Saturday", hours: "09:00 AM - 11:00 PM" },
            { day: "Sunday", hours: "09:00 AM - 09:00 PM" },
        ]
    },
    {
        id: "2",
        name: "Luxe Nail & Spa",
        address: "88 Buntong Street, Kuala Lumpur",
        rating: 4.8,
        reviews: 85,
        status: "Open until 8:00pm",
        image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=1200",
        images: [
            "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1200",
        ],
        categoryId: "nails",
        description: "Escape the city bustle at Luxe Nail & Spa, your sanctuary for hand and foot care. We use only premium, non-toxic polishes and organic spa products. Our interior is designed to induce a state of complete relaxation, with private pods available for VIP treatments.",
        openingHours: [
            { day: "Monday", hours: "11:00 AM - 08:00 PM" },
            { day: "Tuesday", hours: "11:00 AM - 08:00 PM" },
            { day: "Wednesday", hours: "11:00 AM - 08:00 PM" },
            { day: "Thursday", hours: "11:00 AM - 08:00 PM" },
            { day: "Friday", hours: "10:00 AM - 09:00 PM" },
            { day: "Saturday", hours: "10:00 AM - 09:00 PM" },
            { day: "Sunday", hours: "11:00 AM - 07:00 PM" },
        ]
    },
    {
        id: "3",
        name: "Zen Massage Therapy",
        address: "12 Georgetown Road, Penang",
        rating: 4.9,
        reviews: 210,
        status: "Open until 11:00pm",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=600",
        images: [
            "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200",
        ],
        categoryId: "massage",
        description: "Zen Massage Therapy blends traditional Eastern healing arts with modern therapeutic techniques. Our certified therapists customize every session to address your specific tension points. Experience our signature hot stone massage in a tranquil, aromatic setting.",
        openingHours: [
            { day: "Monday", hours: "12:00 PM - 11:00 PM" },
            { day: "Tuesday", hours: "12:00 PM - 11:00 PM" },
            { day: "Wednesday", hours: "12:00 PM - 11:00 PM" },
            { day: "Thursday", hours: "12:00 PM - 11:00 PM" },
            { day: "Friday", hours: "12:00 PM - 12:00 AM" },
            { day: "Saturday", hours: "10:00 AM - 12:00 AM" },
            { day: "Sunday", hours: "10:00 AM - 10:00 PM" },
        ]
    },
    {
        id: "4",
        name: "Glow Facial Studio",
        address: "45 Orchard Road, Singapore",
        rating: 4.7,
        reviews: 95,
        status: "Open until 9:00pm",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600",
        images: [
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1505944270255-72b8c68c6a70?auto=format&fit=crop&q=80&w=1200",
            "https://images.unsplash.com/photo-1620331313174-87a8f9032242?auto=format&fit=crop&q=80&w=1200",
        ],
        categoryId: "face",
        description: "Glow Facial Studio is dedicated to skin health and radiance. We combine clinical-grade technology with luxurious pampering to deliver results you can see and feel. From acne treatments to anti-aging facials, our experts guide you to your best skin.",
        openingHours: [
            { day: "Monday", hours: "10:00 AM - 09:00 PM" },
            { day: "Tuesday", hours: "10:00 AM - 09:00 PM" },
            { day: "Wednesday", hours: "10:00 AM - 09:00 PM" },
            { day: "Thursday", hours: "10:00 AM - 09:00 PM" },
            { day: "Friday", hours: "10:00 AM - 09:00 PM" },
            { day: "Saturday", hours: "10:00 AM - 07:00 PM" },
            { day: "Sunday", hours: "Closed" },
        ]
    }
];

// Helper to keep the single export for backward compatibility relative to the previous file structure
// though we will likely update the consumers.
export const venueData = venuesData[0];

export const servicesData = [
    // Venue 1: Barber
    { id: "101", venueId: "1", categoryId: "featured", name: "Senior Barber Cut", description: "Experience 10yr+", duration: "45 mins", price: 40 },
    { id: "102", venueId: "1", categoryId: "featured", name: "Standard Cut", description: "Experience 3-7yr", duration: "45 mins", price: 35 },
    { id: "103", venueId: "1", categoryId: "hair", name: "Junior Cut", description: "Standard cut", duration: "60 mins", price: 30 },
    { id: "104", venueId: "1", categoryId: "featured", name: "Beard Trim", description: "Shape and sculpt", duration: "30 mins", price: 25 },

    // Venue 2: Nails
    { id: "201", venueId: "2", categoryId: "featured", name: "Gel Manicure", description: "Long lasting gel polish", duration: "60 mins", price: 85 },
    { id: "202", venueId: "2", categoryId: "nails", name: "Classic Pedicure", description: "Relaxing foot soak and polish", duration: "45 mins", price: 65 },
    { id: "203", venueId: "2", categoryId: "featured", name: "Nail Art Extension", description: "Custom design", duration: "90 mins", price: 150 },

    // Venue 3: Massage
    { id: "301", venueId: "3", categoryId: "featured", name: "Full Body Massage", description: "Swedish technique", duration: "60 mins", price: 120 },
    { id: "302", venueId: "3", categoryId: "massage", name: "Deep Tissue", description: "Muscle relief", duration: "60 mins", price: 140 },
    { id: "303", venueId: "3", categoryId: "featured", name: "Foot Reflexology", description: "Pressure points", duration: "30 mins", price: 55 },

    // Venue 4: Facial
    { id: "401", venueId: "4", categoryId: "featured", name: "Hydrating Facial", description: "Moisture boost", duration: "60 mins", price: 180 },
    { id: "402", venueId: "4", categoryId: "face", name: "Anti-Aging Treatment", description: "Collagen boost", duration: "75 mins", price: 250 },
];

export const staffData = [
    { id: "any", name: "Any Professional", role: "Maximum availability", image: "" },
    { id: "1", name: "Sarah", role: "Senior Stylist", image: "https://i.pravatar.cc/150?u=Sarah" },
    { id: "2", name: "Mike", role: "Barber", image: "https://i.pravatar.cc/150?u=Mike" },
    { id: "3", name: "Jessica", role: "Nail Artist", image: "https://i.pravatar.cc/150?u=Jessica" },
    { id: "4", name: "David", role: "Therapist", image: "https://i.pravatar.cc/150?u=David" },
];
