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

    const [apiError, setApiError] = useState("");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setApiError("");

        try {
            // Determine if contact is email or phone for payload
            const isEmail = data.contact.includes("@");
            const payload = isEmail
                ? { contact: data.contact, email: data.contact, password: data.password }
                : { contact: data.contact, password: data.password };

            const res = await loginCustomer(payload);
            if (res.success && res.data) {
                const d = res.data as any;
                // Usually API returns token + user inside data
                // Depending on what is available we save it. Let's assume generic token map
                setUser({
                    id: String(d.customer?.id || d.id || "c1"),
                    name: d.customer?.name || d.name || "Customer",
                    contact: data.contact,
                    email: isEmail ? data.contact : (d.customer?.email || d.email),
                    token: d.token || d.access_token,
                    role: "customer"
                });
                router.back();
            } else {
                setApiError(res.error || "Login failed");
            }
        } catch (err) {
            setApiError("An unexpected error occurred.");
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


        </div>
    );
}
