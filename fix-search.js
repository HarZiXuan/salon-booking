const fs = require('fs');
let code = fs.readFileSync('app/(store)/search/page.tsx', 'utf8');

// Replace imports and helpers
code = code.replace(
    /import \{ venuesData, servicesData \} from "@\/lib\/mock-data";\nimport Link from "next\/link";\nimport \{ cn \} from "@\/lib\/utils";\n\n\/\/ Helper to get services for a venue\nconst getVenueServices \= \(venueId: string\) \=\> \{\n    return servicesData\.filter\(service \=\> service\.venueId \=\=\= venueId\)\.slice\(0, 3\);\n\};\n\n\/\/ Helper for total services count\nconst getTotalServicesCount \= \(venueId: string\) \=\> \{\n    return servicesData\.filter\(service \=\> service\.venueId \=\=\= venueId\)\.length;\n\};/,
    `import { fetchShopDetails, fetchServices } from "@/app/actions/shop";
import { normalizeShopToVenue } from "@/lib/normalize";
import Link from "next/link";
import { cn } from "@/lib/utils";`
);

// SearchResults
code = code.replace(
    /function SearchResults\(\) \{\n    const searchParams \= useSearchParams\(\);\n    const router \= useRouter\(\);\n    const query \= searchParams\.get\("q"\) \|\| "";\n    const \[isMapVisible, setIsMapVisible\] \= useState\(true\);\n\n    const filteredVenues \= venuesData\.filter\(venue \=\>\n        venue\.name\.toLowerCase\(\)\.includes\(query\.toLowerCase\(\)\) \|\|\n        venue\.description\.toLowerCase\(\)\.includes\(query\.toLowerCase\(\)\) \|\|\n        venue\.address\.toLowerCase\(\)\.includes\(query\.toLowerCase\(\)\) \|\|\n        venue\.categoryId\.toLowerCase\(\)\.includes\(query\.toLowerCase\(\)\)\n    \);/,
    `function SearchResults() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const query = searchParams.get("q") || "";
    const [isMapVisible, setIsMapVisible] = useState(true);

    const [isLoading, setIsLoading] = useState(true);
    const [venuesData, setVenuesData] = useState<Record<string, unknown>[]>([]);
    const [servicesData, setServicesData] = useState<Record<string, unknown>[]>([]);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const [shopRes, servicesRes] = await Promise.all([
                    fetchShopDetails(),
                    fetchServices()
                ]);
                
                if (shopRes.success && shopRes.data) {
                    setVenuesData([normalizeShopToVenue(shopRes.data)]);
                }
                
                if (servicesRes.success && servicesRes.data) {
                    const services = (servicesRes.data as Record<string, unknown>[]).map(s => ({
                        ...s,
                        categoryId: s.category || "uncategorized",
                        duration: s.duration ? \`\${s.duration} mins\` : "Varies",
                    }));
                    setServicesData(services);
                }
            } catch (error) {
                console.error("Failed to fetch search data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredVenues = venuesData.filter(venue =>
        String(venue.name || "").toLowerCase().includes(query.toLowerCase()) ||
        String(venue.description || "").toLowerCase().includes(query.toLowerCase()) ||
        String(venue.address || "").toLowerCase().includes(query.toLowerCase()) ||
        String(venue.categoryId || "").toLowerCase().includes(query.toLowerCase())
    );

    if (isLoading) {
        return <SearchLoadingFallback />;
    }`
);

code = code.replace(
    /filteredVenues\.map\(\(venue\) \=\> \(\n                            \<VenueCard key=\{venue\.id\} venue=\{venue\} \/\>\n                        \)\)/,
    `filteredVenues.map((venue) => (
                            <VenueCard key={String(venue.id)} venue={venue} servicesData={servicesData} />
                        ))`
);

// VenueCard
code = code.replace(
    /function VenueCard\(\{ venue \}: \{ venue: any \}\) \{\n    const services \= getVenueServices\(venue\.id\);\n    const totalServices \= getTotalServicesCount\(venue\.id\);\n    const \[currentImageIndex, setCurrentImageIndex\] \= useState\(0\);/,
    `function VenueCard({ venue, servicesData }: { venue: any, servicesData: any[] }) {
    const services = servicesData.slice(0, 3);
    const totalServices = servicesData.length;
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const venueId = String(venue.id);
    const images = (venue.images as string[]) || [];`
);

// VenueCard Template Replacers
code = code.replace(/href\=\{\`\/venues\/\$\{venue\.id\}\`\}/g, 'href={`/venues/${venueId}`}');
code = code.replace(/venue\.images\.map/g, 'images.map');
code = code.replace(/venue\.images\.length/g, 'images.length');

code = code.replace(/\{venue\.name\}/g, '{String(venue.name || "")}');
code = code.replace(/\{venue\.address\}/g, '{String(venue.address || "")}');
code = code.replace(/\{venue\.rating\}/g, '{String(venue.rating || "5.0")}');
code = code.replace(/\{venue\.reviews\}/g, '{String(venue.reviews || "0")}');

code = code.replace(/\{service\.id\}/g, '{String(service.id)}');
code = code.replace(/\{service\.name\}/g, '{String(service.name)}');
code = code.replace(/\{service\.duration\}/g, '{String(service.duration)}');
code = code.replace(/\{service\.price\}/g, '{String(service.price)}');

fs.writeFileSync('app/(store)/search/page.tsx', code);
