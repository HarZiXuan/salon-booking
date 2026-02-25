"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/global-store/user";

import { loginCustomer } from "@/app/actions/auth";

const schema = yup.object({
    contact: yup.string().required("Phone number or email is required"),
    password: yup.string().required("Password is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

export default function LoginPage() {
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);

    // Add state for role selection overlay
    const [showRoleSelection, setShowRoleSelection] = useState(false);
    const [loginData, setLoginData] = useState<FormData | null>(null);
    const [apiError, setApiError] = useState("");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data: FormData) => {
        // Instead of immediate login, show role selection first
        setLoginData(data);
        setShowRoleSelection(true);
    };

    const handleRoleSelection = async (role: "customer" | "merchant") => {
        if (!loginData) return;
        setApiError("");

        if (role === "merchant") {
            // Mock merchant login for now
            setUser({
                id: "m1",
                name: "Merchant User",
                email: loginData.contact,
                role: role,
            });
            router.push("/merchant");
        } else {
            // Real customer login
            try {
                // Determine if contact is email or phone for payload
                const isEmail = loginData.contact.includes("@");
                const payload = isEmail
                    ? { contact: loginData.contact, email: loginData.contact, password: loginData.password }
                    : { contact: loginData.contact, password: loginData.password };

                const res = await loginCustomer(payload);
                if (res.success && res.data) {
                    const d = res.data as any;
                    // Usually API returns token + user inside data
                    // Depending on what is available we save it. Let's assume generic token map
                    setUser({
                        id: String(d.user?.id || d.id || "c1"),
                        name: d.user?.name || d.name || "Customer",
                        contact: loginData.contact,
                        email: isEmail ? loginData.contact : (d.user?.email || d.email),
                        token: d.token || d.access_token,
                        role: "customer"
                    });
                    router.push("/");
                } else {
                    setApiError(res.error || "Login failed");
                    setShowRoleSelection(false);
                }
            } catch (err) {
                setApiError("An unexpected error occurred.");
                setShowRoleSelection(false);
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                <div className="mb-8">
                    <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-3 text-center text-sm text-gray-500 font-medium">
                        Please sign in to continue or{" "}
                        <Link href="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            create a new account
                        </Link>
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {apiError && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                            {apiError}
                        </div>
                    )}
                    <div className="space-y-5">
                        <div className="relative">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 block">Email Address or Phone</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="ri-user-line text-lg text-gray-400 group-focus-within:text-blue-600 transition-colors"></i>
                                </div>
                                <Input
                                    type="text"
                                    placeholder="Enter your email or phone"
                                    {...register("contact")}
                                    className={`pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white hover:bg-gray-100/50 transition-colors rounded-xl ${errors.contact ? "border-red-500 ring-1 ring-red-500" : ""}`}
                                />
                            </div>
                            {errors.contact && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500"><i className="ri-error-warning-line mr-1"></i>{errors.contact.message}</p>
                            )}
                        </div>

                        <div className="relative">
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block">Password</label>
                                <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot?</Link>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <i className="ri-lock-line text-lg text-gray-400 group-focus-within:text-blue-600 transition-colors"></i>
                                </div>
                                <Input
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    className={`pl-11 h-12 bg-gray-50 border-gray-200 focus:bg-white hover:bg-gray-100/50 transition-colors rounded-xl ${errors.password ? "border-red-500 ring-1 ring-red-500" : ""}`}
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs font-semibold text-red-500"><i className="ri-error-warning-line mr-1"></i>{errors.password.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full text-base font-bold bg-gray-900 hover:bg-black text-white shadow-lg shadow-gray-900/10 transition-all hover:scale-[1.02]"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Please wait..." : "Sign in to account"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Role Selection Overlay */}
            {showRoleSelection && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                                <i className="ri-user-smile-line text-3xl text-blue-600"></i>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Who are you?</h3>
                            <p className="text-sm text-gray-500 mt-2 font-medium">Select your account type to proceed to the appropriate dashboard.</p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => handleRoleSelection("customer")}
                                className="w-full group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-4 text-left transition-all hover:border-blue-600 hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors shrink-0">
                                        <i className="ri-user-line text-xl text-gray-500 group-hover:text-white transition-colors"></i>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">Customer</p>
                                        <p className="text-xs text-gray-500 font-medium">Book services & manage appts</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => handleRoleSelection("merchant")}
                                className="w-full group relative overflow-hidden rounded-2xl border-2 border-gray-100 bg-white p-4 text-left transition-all hover:border-gray-900 hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-gray-900 transition-colors shrink-0">
                                        <i className="ri-store-2-line text-xl text-gray-500 group-hover:text-white transition-colors"></i>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-lg group-hover:text-gray-900 transition-colors">Merchant</p>
                                        <p className="text-xs text-gray-500 font-medium">Manage your venue & team</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowRoleSelection(false)}
                                className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors py-2 px-4 rounded-full hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
