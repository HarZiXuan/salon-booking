export const normalizeShopToVenue = (shopData: any) => {
    return {
        id: shopData.slug,
        name: shopData.name,
        address: shopData.address,
        rating: 5.0, // Hardcoded for now, or you can calculate if it exists
        reviews: 0,
        status: shopData.working_hours ? "Open" : "Closed",
        image: shopData.logo,
        images: shopData.banner ? [shopData.banner.image, shopData.logo] : [shopData.logo],
        categoryId: "all",
        description: shopData.banner?.description || "Welcome to our shop",
        openingHours: shopData.working_hours ? Object.entries(shopData.working_hours).map(([day, hours]: [string, any]) => ({
            day: day.charAt(0).toUpperCase() + day.slice(1),
            hours: hours.is_closed ? "Closed" : `${hours.open} - ${hours.close}`
        })) : [],
        disableBookingCalendar: shopData.disable_booking_calendar || false,
        phone: shopData.phone || "",
        googleMapUrl: shopData.google_map_url || ""
    };
};
