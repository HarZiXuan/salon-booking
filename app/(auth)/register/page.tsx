"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/global-store/user";
import { registerCustomer, sendRegistrationOtp } from "@/app/actions/auth";

// ─── Country codes ────────────────────────────────────────────────────────────
const COUNTRY_CODES = [
    { label: "🇲🇾 +60", value: "+60" },
    { label: "🇸🇬 +65", value: "+65" },
];

// ─── Validation schema ────────────────────────────────────────────────────────
const schema = yup.object({
    name: yup.string().required("Name is required"),
    contact: yup
        .string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must contain only digits")
        .min(7, "Phone number is too short")
        .max(12, "Phone number is too long"),
    email: yup
        .string()
        .transform((curr, orig) => (orig === "" ? undefined : curr))
        .email("Invalid email")
        .defined()
        .default(undefined),
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    otp: yup
        .string()
        .required("OTP is required")
        .matches(/^[0-9]{4,8}$/, "OTP must be 4–8 digits"),
});

type FormData = yup.InferType<typeof schema>;

// ─── OTP countdown hook ───────────────────────────────────────────────────────
function useOtpCooldown(seconds = 30) {
    const [countdown, setCountdown] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const start = () => {
        setCountdown(seconds);
        timerRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    return { countdown, start, isActive: countdown > 0 };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RegisterPage() {
    const router = useRouter();
    const setUser = useUserStore((state) => state.setUser);

    const [countryCode, setCountryCode] = useState("+60");
    const [otpSending, setOtpSending] = useState(false);
    const [otpStatus, setOtpStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [apiError, setApiError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const { countdown, start: startCountdown, isActive: isCoolingDown } = useOtpCooldown(30);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({ resolver: yupResolver(schema) });

    // ── Send OTP ──────────────────────────────────────────────────────────────
    const handleSendOtp = async () => {
        const rawContact = getValues("contact");
        if (!rawContact || !/^[0-9]{7,12}$/.test(rawContact)) {
            setOtpStatus({ type: "error", message: "Please enter a valid phone number first." });
            return;
        }

        setOtpSending(true);
        setOtpStatus(null);

        const formattedContact = `${countryCode}${rawContact.replace(/^0/, "")}`;
        const res = await sendRegistrationOtp(formattedContact);

        setOtpSending(false);

        if (res.success) {
            setOtpStatus({ type: "success", message: "OTP sent! Please check your phone." });
            startCountdown();
        } else {
            setOtpStatus({ type: "error", message: res.error || "Failed to send OTP." });
        }
    };

    // ── Register submit ───────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSubmit = async (data: any) => {
        setApiError("");
        const formattedContact = `${countryCode}${data.contact.replace(/^0/, "")}`;

        const res = await registerCustomer({
            name: data.name,
            contact: formattedContact,
            ...(data.email ? { email: data.email } : {}),
            password: data.password,
            password_confirmation: data.confirmPassword,
            otp: data.otp,
        });

        if (res.success && res.data) {
            setShowSuccess(true);
            setTimeout(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const d = res.data as any;
                if (d.token || d.access_token) {
                    setUser({
                        id: String(d.customer?.id || d.id || ""),
                        name: data.name,
                        contact: formattedContact,
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
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 relative">
            {/* Back button */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
                >
                    <i className="ri-arrow-left-line text-[26px] font-normal text-black leading-none" />
                </button>
            </div>

            {/* Success overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full mx-4">
                        <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <i className="ri-check-line text-3xl text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
                        <p className="text-gray-600 text-center">Your account has been successfully created.</p>
                    </div>
                </div>
            )}

            <div className="w-full max-w-md space-y-8">
                {/* Header */}
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

                <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* API error */}
                    {apiError && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                            {apiError}
                        </div>
                    )}

                    {/* ── Full Name ── */}
                    <div>
                        <Input
                            id="reg-name"
                            type="text"
                            placeholder="Full Name"
                            {...register("name")}
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    {/* ── Phone + country code ── */}
                    <div>
                        <div className="flex gap-2">
                            {/* Country code toggle */}
                            <div className="relative">
                                <select
                                    id="reg-country-code"
                                    value={countryCode}
                                    onChange={(e) => setCountryCode(e.target.value)}
                                    className="h-10 rounded-md border border-input bg-background pl-3 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                                >
                                    {COUNTRY_CODES.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                                <i className="ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>

                            <Input
                                id="reg-contact"
                                type="tel"
                                placeholder="12345678"
                                {...register("contact")}
                                className={`flex-1 ${errors.contact ? "border-red-500" : ""}`}
                            />
                        </div>
                        {errors.contact && <p className="mt-1 text-sm text-red-500">{errors.contact.message}</p>}
                    </div>

                    {/* ── Email (optional) ── */}
                    <div>
                        <Input
                            id="reg-email"
                            type="email"
                            placeholder="Email address (optional)"
                            {...register("email")}
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    {/* ── Password ── */}
                    <div>
                        <Input
                            id="reg-password"
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    {/* ── Confirm Password ── */}
                    <div>
                        <Input
                            id="reg-confirm-password"
                            type="password"
                            placeholder="Confirm Password"
                            {...register("confirmPassword")}
                            className={errors.confirmPassword ? "border-red-500" : ""}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* ── OTP field ── */}
                    <div>
                        <div className="flex gap-2">
                            <Input
                                id="reg-otp"
                                type="text"
                                inputMode="numeric"
                                maxLength={8}
                                placeholder="Enter OTP"
                                {...register("otp")}
                                className={`flex-1 tracking-widest ${errors.otp ? "border-red-500" : ""}`}
                            />
                            <button
                                type="button"
                                id="reg-send-otp-btn"
                                onClick={handleSendOtp}
                                disabled={otpSending || isCoolingDown}
                                className="shrink-0 px-4 h-10 rounded-md border border-primary text-primary text-sm font-medium hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                            >
                                {otpSending
                                    ? "Sending…"
                                    : isCoolingDown
                                    ? `Resend in ${countdown}s`
                                    : "Send OTP"}
                            </button>
                        </div>

                        {/* OTP status message */}
                        {otpStatus && (
                            <p
                                className={`mt-1.5 text-sm flex items-center gap-1 ${
                                    otpStatus.type === "success" ? "text-green-600" : "text-red-500"
                                }`}
                            >
                                <i
                                    className={
                                        otpStatus.type === "success"
                                            ? "ri-checkbox-circle-line"
                                            : "ri-error-warning-line"
                                    }
                                />
                                {otpStatus.message}
                            </p>
                        )}

                        {errors.otp && !otpStatus && (
                            <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
                        )}
                    </div>

                    {/* ── Submit ── */}
                    <div>
                        <Button
                            id="reg-submit-btn"
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating account…" : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
