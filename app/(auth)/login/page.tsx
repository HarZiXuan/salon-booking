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
    contact: yup.string().required("Email address or phone number is required"),
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
            let contactValue = data.contact;

            if (!isEmail) {
                // If it's a phone number, prepend +60 and remove leading 0
                const numericOnly = data.contact.replace(/[^0-9]/g, ''); // strip out any spaces or + if user accidentally typed it
                contactValue = `+60${numericOnly.replace(/^60|^0/, '')}`;
            }

            const payload = isEmail
                ? { contact: contactValue, email: contactValue, password: data.password }
                : { contact: contactValue, password: data.password };

            const res = await loginCustomer(payload);
            if (res.success && res.data) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                setApiError("Authentication failed. " + (res.error || "Please check your credentials."));
            }
        } catch (err) {
            setApiError("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans overflow-hidden">
            {/* Left Side - Form Container */}
            <div className="w-full lg:w-1/2 flex flex-col relative h-screen overflow-y-auto pt-[60px] pb-6">
                <div className="absolute top-6 left-6">
                    <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors inline-flex items-center justify-center">
                        <i className="ri-arrow-left-line text-[26px] font-normal text-black leading-none"></i>
                    </button>
                </div>

                <div className="flex-1 px-6 flex flex-col justify-center items-center w-full max-w-[480px] mx-auto">
                    <div className="mb-8 w-full">
                        <h2 className="text-center text-[28px] font-bold tracking-tight text-black leading-tight">
                            Zaloon for customers
                        </h2>
                        <p className="mt-3 text-center text-[15px] text-gray-500 font-medium leading-snug">
                            Create an account or log in to book and manage your appointments.
                        </p>
                    </div>

                    <form className="space-y-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                        {apiError && (
                            <div className="p-3 bg-red-50 text-red-600 text-[14px] font-medium rounded-xl border border-red-200 text-center mb-4">
                                {apiError}
                            </div>
                        )}

                        <div className="space-y-1">
                            <Input
                                type="text"
                                placeholder="Email address or phone number"
                                {...register("contact")}
                                className={`h-[56px] bg-white border focus-visible:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors rounded-[12px] text-[16px] px-4 ${errors.contact ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-600" : "border-gray-300"}`}
                            />
                            {errors.contact && (
                                <p className="text-[13px] font-medium text-red-500 mt-1">{errors.contact.message}</p>
                            )}
                        </div>

                        <div className="space-y-1 relative">
                            <Input
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className={`h-[56px] bg-white border focus-visible:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors rounded-[12px] text-[16px] px-4 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500 text-red-600" : "border-gray-300"}`}
                            />
                            {errors.password && (
                                <p className="text-[13px] font-medium text-red-500 mt-1">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <Button
                                type="submit"
                                className="w-full h-[56px] rounded-full text-[17px] font-bold bg-black hover:bg-black/90 text-white transition-all shadow-md"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Please wait..." : "Continue"}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-8 text-center flex flex-col gap-4 w-full">
                        <Link href="/register" className="w-full h-[56px] rounded-full text-[17px] font-bold border border-gray-300 bg-white hover:bg-gray-50 text-black transition-all flex items-center justify-center shadow-sm">
                            Create an account
                        </Link>


                    </div>
                </div>


            </div>

            {/* Right Side - Hero Image */}
            <div className="hidden lg:block lg:w-1/2 relative bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80"
                    alt="Salon Lifestyle"
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>
        </div>
    );
}
