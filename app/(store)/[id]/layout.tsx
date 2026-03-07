import { Metadata } from "next";
import { fetchShopDetails } from "@/app/actions/shop";
import { getShopSlugFromMerchantUrl } from "@/lib/stores";
import { normalizeShopToVenue } from "@/lib/normalize";
import { getSafeImageSrc } from "@/lib/image-url";

type Props = {
    params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const merchantSlug = resolvedParams.id;
    const shopSlug = getShopSlugFromMerchantUrl(merchantSlug);

    if (!shopSlug) {
        return {
            title: "Venue Not Found | Zaloon",
        };
    }

    const res = await fetchShopDetails(shopSlug);

    if (res.success && res.data) {
        const venue = normalizeShopToVenue(res.data);
        const iconUrl = venue.image ? getSafeImageSrc(String(venue.image)) : undefined;

        return {
            title: String(venue.name || "Zaloon"),
            description: String(venue.description || "Book your favorite salon services"),
            icons: iconUrl ? {
                icon: iconUrl,
                apple: iconUrl,
            } : undefined,
            openGraph: {
                title: String(venue.name || "Zaloon"),
                description: String(venue.description || "Book your favorite salon services"),
                images: venue.images ? (venue.images as string[]).map(url => getSafeImageSrc(url)) : undefined,
            }
        };
    }

    return {
        title: "Zaloon",
    };
}

export default function StoreVenueLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
