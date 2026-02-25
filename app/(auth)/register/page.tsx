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
    contact: yup.string().required("Phone number is required"),
    email: yup.string().email("Invalid email").default(""),
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

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setApiError("");
        try {
            const res = await registerCustomer({
                name: data.name,
                contact: data.contact,
                email: data.email,
                password: data.password,
                password_confirmation: data.confirmPassword
            });

            if (res.success && res.data) {
                const d = res.data as any;
                // Mock logging them in since registration typically either logs you in or asks to login
                // However the prompt says "returns bearer token for endpoints below", check docs:
                // If it doesn't return token, we should push to login page
                if (d.token || d.access_token) {
                    setUser({
                        id: String(d.user?.id || d.id || "2"),
                        name: data.name,
                        contact: data.contact,
                        email: data.email,
                        token: d.token || d.access_token,
                        role: "customer",
                    });
                    router.push("/");
                } else {
                    router.push("/login");
                }
            } else {
                setApiError(res.error || "Failed to register.");
            }
        } catch (err) {
            setApiError("An unexpected error occurred.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
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
                            <Input
                                type="tel"
                                placeholder="Phone number (required)"
                                {...register("contact")}
                                className={errors.contact ? "border-red-500" : ""}
                            />
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
