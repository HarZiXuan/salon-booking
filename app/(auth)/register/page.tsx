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

import { registerCustomer } from "@/app/actions/auth";

const schema = yup.object({
    name: yup.string().required("Name is required"),
    contact: yup.string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must contain only numbers")
        .min(8, "Phone number is too short")
        .max(12, "Phone number is too long"),
    email: yup.string().transform((curr, orig) => orig === '' ? undefined : curr).email("Invalid email").optional(),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: yup.string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);
    const [apiError, setApiError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        setApiError("");
        try {
            const formattedPhone = `+60${data.contact.replace(/^0/, '')}`;
            const res = await registerCustomer({
                name: data.name,
                contact: formattedPhone,
                ...(data.email ? { email: data.email } : {}),
                password: data.password,
                password_confirmation: data.confirmPassword
            });

            if (res.success && res.data) {
                setShowSuccess(true);
                setTimeout(() => {
                    const d = res.data as any;
                    // Mock logging them in since registration typically either logs you in or asks to login
                    // However the prompt says "returns bearer token for endpoints below", check docs:
                    // If it doesn't return token, we should push to login page
                    if (d.token || d.access_token) {
                        setUser({
                            id: String(d.customer?.id || d.id || "2"),
                            name: data.name,
                            contact: data.contact,
                            email: data.email,
                            token: d.token || d.access_token,
                            role: "customer",
                        });
                        router.back();
                    } else {
                        router.push("/login");
                    }
                }, 2000);
            } else {
                setApiError(res.error || "Failed to register.");
            }
        } catch (err) {
            setApiError("An unexpected error occurred.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative">
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
                <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-200 transition-colors inline-flex items-center justify-center">
                    <i className="ri-arrow-left-line text-[26px] font-normal text-black leading-none"></i>
                </button>
            </div>
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full mx-4 transition-all transform scale-100">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <i className="ri-check-line text-3xl text-green-600"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                        <p className="text-gray-600 text-center mb-6">Your account has been successfully created.</p>
                    </div>
                </div>
            )}
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-primary hover:text-primary/90">
                            Sign in
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
                    {apiError && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                            {apiError}
                        </div>
                    )}
                    <div className="space-y-4 rounded-md shadow-sm">
                        <div>
                            <Input
                                type="text"
                                placeholder="Full Name"
                                {...register("name")}
                                className={errors.name ? "border-red-500" : ""}
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>
                        <div>
                            <div className="relative flex items-center">
                                <span className="absolute left-3 text-gray-500 font-medium">+60</span>
                                <Input
                                    type="tel"
                                    placeholder="12345678"
                                    {...register("contact")}
                                    className={`pl-11 ${errors.contact ? "border-red-500" : ""}`}
                                />
                            </div>
                            {errors.contact && (
                                <p className="mt-1 text-sm text-red-500">{errors.contact.message}</p>
                            )}
                        </div>
                        <div>
                            <Input
                                type="email"
                                placeholder="Email address (optional)"
                                {...register("email")}
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div>
                            <Input
                                type="password"
                                placeholder="Password"
                                {...register("password")}
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                        <div>
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                {...register("confirmPassword")}
                                className={errors.confirmPassword ? "border-red-500" : ""}
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account..." : "Sign up"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
