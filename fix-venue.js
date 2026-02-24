const fs = require('fs');
let code = fs.readFileSync('app/(store)/venues/[id]/page.tsx', 'utf8');

// Replace imports
code = code.replace(
    /import \{ useState, useRef \} from "react";\nimport \{ BookingWizard \} from "@\/components\/venue\/booking\/wizard";\nimport \{ venuesData, serviceCategories, servicesData \} from "@\/lib\/mock-data";/,
    `import { useState, useRef, useEffect } from "react";
import { BookingWizard } from "@/components/venue/booking/wizard";
import { fetchShopDetails, fetchServices, fetchCategories } from "@/app/actions/shop";
import { normalizeShopToVenue } from "@/lib/normalize";`
);

// Replace state variables
code = code.replace(
    /export default function StorePage\(\) \{\n    const params \= useParams\(\);\n    const router \= useRouter\(\);\n    const \[isBookingOpen, setIsBookingOpen\] \= useState\(false\);\n    const \[initialServiceId, setInitialServiceId\] \= useState<string \| undefined>\(undefined\);/,
    `export default function StorePage() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [venue, setVenue] = useState<Record<string, unknown> | null>(null);
    const [venueServices, setVenueServices] = useState<Record<string, unknown>[]>([]);
    const [availableCategories, setAvailableCategories] = useState<{id: string, label: string}[]>([]);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    const [initialServiceId, setInitialServiceId] = useState<string | undefined>(undefined);`
);

// Replace fetch logic
code = code.replace(
    /\/\/ Fetch venue based on ID\n    const venueId \= params\?\.id as string;\n    const venue \= venuesData\.find\(v \=\> v\.id \=\=\= venueId\);\n\n    \/\/ Filter services for this venue\n    const venueServices \= servicesData\.filter\(s \=\> s\.venueId \=\=\= venueId\);\n\n    \/\/ Filter categories that have services for this venue\n    const availableCategories \= serviceCategories\.filter\(cat \=\>\n        cat\.id \=\=\= 'featured' \|\| venueServices\.some\(s \=\> s\.categoryId \=\=\= cat\.id\)\n    \);/,
    `const venueId = params?.id as string;

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [shopRes, servicesRes, categoriesRes] = await Promise.all([
                    fetchShopDetails(),
                    fetchServices(),
                    fetchCategories()
                ]);
                
                if (shopRes.success && shopRes.data) {
                    setVenue(normalizeShopToVenue(shopRes.data));
                }
                
                if (servicesRes.success && servicesRes.data) {
                    const services = (servicesRes.data as Record<string, unknown>[]).map(s => ({
                        ...s,
                        categoryId: s.category || "uncategorized",
                        duration: s.duration ? \`\${s.duration} mins\` : "Varies",
                    }));
                    setVenueServices(services);
                }
                
                if (categoriesRes.success && categoriesRes.data) {
                    const cats = (categoriesRes.data as Record<string, unknown>[]).map(c => ({
                        id: String(c.name),
                        label: String(c.name)
                    }));
                    cats.unshift({ id: "uncategorized", label: "Other Services" });
                    setAvailableCategories(cats);
                }
            } catch (error) {
                console.error("Failed to fetch venue details:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);`
);

// Replace template variables
code = code.replace(/\{venue\.name\}/g, '{String(venue.name || "")}');
code = code.replace(/\{venue\.rating\}/g, '{String(venue.rating || "5.0")}');
code = code.replace(/\{venue\.reviews\}/g, '{String(venue.reviews || "0")}');
code = code.replace(/\{venue\.address\}/g, '{String(venue.address || "")}');
code = code.replace(/\{venue\.status\}/g, '{String(venue.status || "Open")}');

// venue.images maps
code = code.replace(/venue\.images\.length/g, '((venue.images as string[]) || []).length');
code = code.replace(/venue\.images\.map/g, '((venue.images as string[]) || []).map');
code = code.replace(/venue\.images\[0\]/g, '((venue.images as string[]) || [])[0]');
code = code.replace(/venue\.images\.slice/g, '((venue.images as string[]) || []).slice');

// venueServices map
code = code.replace(/service\.name/g, 'String(service.name)');
code = code.replace(/service\.description/g, 'String(service.description || "")');
code = code.replace(/service\.duration/g, 'String(service.duration)');
code = code.replace(/service\.price/g, 'String(service.price)');
code = code.replace(/service\.id/g, 'String(service.id)');
code = code.replace(/service\.categoryId/g, 'String(service.categoryId || "")');


// Replace !venue loading block
code = code.replace(
    /if \(\!venue\) \{\n        return \(\n            <div className=\"flex flex-col items-center justify-center min-h-screen\">\n                <h1 className=\"text-2xl font-bold mb-4\">Venue not found<\/h1>\n                <p className=\"text-gray-500\">The venue you are looking for does not exist\.<\/p>\n                <Button className=\"mt-4\" onClick=\{\(\) \=\> window\.location\.href \= '\/'\}\>Go Home<\/Button>\n            <\/div>\n        \);\n    \}/,
    `if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-black animate-spin mb-4"></div>
                <p className="text-gray-500">Loading venue details...</p>
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">Venue not found</h1>
                <p className="text-gray-500">The venue you are looking for does not exist.</p>
                <Button className="mt-4" onClick={() => window.location.href = '/'}>Go Home</Button>
            </div>
        );
    }`
);

fs.writeFileSync('app/(store)/venues/[id]/page.tsx', code);
