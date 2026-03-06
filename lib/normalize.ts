function resolveImageUrl(url: string | null | undefined): string | undefined {
    if (!url || typeof url !== "string") return undefined;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = typeof process !== "undefined" && process.env?.NEXT_PUBLIC_API_BASE_URL
        ? String(process.env.NEXT_PUBLIC_API_BASE_URL).replace(/\/$/, "")
        : "";
    return base ? `${base}${url.startsWith("/") ? url : `/${url}`}` : url;
}

export const normalizeShopToVenue = (shopData: any) => {
    const logo = resolveImageUrl(shopData.logo) ?? shopData.logo;
    const bannerImage = shopData.banner?.image != null ? resolveImageUrl(shopData.banner.image) ?? shopData.banner.image : null;
    const images = shopData.banner && bannerImage
        ? [bannerImage, logo].filter(Boolean)
        : logo ? [logo] : [];
    return {
        id: shopData.slug,
        name: shopData.name,
        address: shopData.address,
        rating: 5.0, // Hardcoded for now, or you can calculate if it exists
        reviews: 0,
        status: shopData.working_hours ? "Open" : "Closed",
        image: logo,
        images: images as string[],
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
