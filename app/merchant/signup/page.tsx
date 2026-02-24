"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";

const schema = yup
    .object({
        ownerName: yup.string().required("Name is required"),
        phone: yup.string().required("Phone number is required"),
        email: yup.string().email("Invalid email").required("Email is required"),
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .required("Password is required"),
    })
    .required();

type FormData = yup.InferType<typeof schema>;

export default function MerchantSignupPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        // In a real app, you would submit to your backend here
        console.log("Signup Data:", data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Navigate to onboarding
        router.push("/merchant/onboarding");
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Left pane - Image */}
            <div className="hidden lg:flex w-1/2 bg-neutral-900 justify-center items-center relative overflow-hidden">
                {/* Placeholder for an actual beautiful salon image */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 opacity-90" />
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
                <div className="relative z-10 px-12 text-center max-w-lg">
                    <h1 className="text-4xl font-light text-white mb-6">Grow your salon business with us</h1>
                    <p className="text-neutral-400 text-lg font-light leading-relaxed">
                        Join thousands of professionals managing their bookings, clients, and growth all in one place.
                    </p>
                </div>
            </div>

            {/* Right pane - Form */}
            <div className="flex flex-col flex-1 px-8 py-12 sm:px-16 lg:px-24 justify-center">
                <div className="w-full max-w-md mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">Create your account</h2>
                        <p className="text-neutral-500">Sign up to get started as a merchant</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="ownerName">
                                    Full Name
                                </label>
                                <input
                                    {...register("ownerName")}
                                    id="ownerName"
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.ownerName ? 'border-red-500 outline-red-500' : 'border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'} transition-colors outline-none`}
                                    placeholder="John Doe"
                                />
                                {errors.ownerName && <p className="mt-1 text-sm text-red-500">{errors.ownerName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="phone">
                                    Phone Number
                                </label>
                                <input
                                    {...register("phone")}
                                    id="phone"
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 outline-red-500' : 'border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'} transition-colors outline-none`}
                                    placeholder="+1 (555) 000-0000"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 outline-red-500' : 'border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'} transition-colors outline-none`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-1" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    {...register("password")}
                                    id="password"
                                    type="password"
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500 outline-red-500' : 'border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'} transition-colors outline-none`}
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-neutral-900 text-white font-medium py-3 px-4 rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="ri-loader-4-line animate-spin"></i> Creating...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-sm text-neutral-500">
                        Already have an account?{" "}
                        <Link href="/merchant/login" className="font-medium text-neutral-900 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
