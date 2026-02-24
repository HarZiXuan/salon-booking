import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t py-12 mt-auto">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Salon Booking</h3>
                        <p className="text-gray-500 text-sm">
                            Discover top-rated salons, barbers, medspas, wellness studios and beauty experts near you.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Discover</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/" className="hover:text-black transition-colors">Treatments</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Venues</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Professionals</Link></li>
                            <li><Link href="/" className="hover:text-black transition-colors">Gift Cards</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
                            <li><Link href="/careers" className="hover:text-black transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/help" className="hover:text-black transition-colors">Help Center</Link></li>
                            <li><Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} Salon Booking. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link href="#" className="text-gray-400 hover:text-black transition-colors">
                            <i className="ri-instagram-line text-xl"></i>
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-black transition-colors">
                            <i className="ri-twitter-x-line text-xl"></i>
                        </Link>
                        <Link href="#" className="text-gray-400 hover:text-black transition-colors">
                            <i className="ri-facebook-circle-line text-xl"></i>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
