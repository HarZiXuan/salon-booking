"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";

// Define the schema for the entire wizard
const schema = yup.object({
    // Step 1
    businessName: yup.string().required("Business Name is required"),
    website: yup.string().url("Must be a valid URL").optional().default(""),

    // Step 2
    categories: yup
        .array()
        .of(yup.string().required())
        .min(1, "Select at least one category")
        .required("Select at least one category"),

    // Step 3
    address: yup.string().required("Address is required"),
    city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    zip: yup.string().required("Postal Code is required"),
}).required();

type FormData = yup.InferType<typeof schema>;

const CATEGORY_OPTIONS = [
    { id: "hair", label: "Hair Salon", icon: "ri-scissors-cut-line" },
    { id: "nails", label: "Nail Salon", icon: "ri-paint-brush-line" },
    { id: "spa", label: "Spa & Wellness", icon: "ri-leaf-line" },
    { id: "massage", label: "Massage", icon: "ri-user-smile-line" },
    { id: "barber", label: "Barbershop", icon: "ri-scissors-2-line" },
    { id: "makeup", label: "Makeup & Brows", icon: "ri-haze-line" },
    { id: "skincare", label: "Skincare", icon: "ri-drop-line" },
    { id: "tattoo", label: "Tattoo & Piercing", icon: "ri-ink-bottle-line" },
];

export default function MerchantOnboarding() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 3;

    const {
        register,
        handleSubmit,
        control,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            categories: [],
        },
        mode: "onTouched",
    });

    const handleNext = async () => {
        let isStepValid = false;

        if (step === 1) {
            isStepValid = await trigger(["businessName", "website"]);
        } else if (step === 2) {
            isStepValid = await trigger(["categories"]);
        }

        if (isStepValid) {
            setStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const handleBack = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const onSubmit = async (data: FormData) => {
        // In a real app, you would submit to your backend here
        console.log("Onboarding Data:", data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Navigate to dashboard
        router.push("/merchant");
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            {/* Header with Step Indicator */}
            <header className="bg-white border-b border-neutral-200 py-6 px-8 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-neutral-900">Account Setup</h1>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= i
                                        ? "bg-neutral-900 text-white"
                                        : "bg-neutral-200 text-neutral-500"
                                        }`}
                                >
                                    {step > i ? <i className="ri-check-line"></i> : i}
                                </div>
                                {i < 3 && (
                                    <div
                                        className={`w-12 h-1 mx-2 rounded-full transition-colors ${step > i ? "bg-neutral-900" : "bg-neutral-200"
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Form Content */}
            <main className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto px-6 py-12">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 sm:p-12">

                    {/* Step 1: Business Details */}
                    <div className={step === 1 ? "block" : "hidden"}>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Business Details</h2>
                            <p className="text-neutral-500">Let's start with the basics of your salon.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="businessName">
                                    Business Name *
                                </label>
                                <input
                                    {...register("businessName")}
                                    id="businessName"
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.businessName ? 'border-red-500 outline-red-500' : 'border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'} transition-colors outline-none`}
                                    placeholder="e.g. Bella Salon & Spa"
                                />
                                {errors.businessName && <p className="mt-1 text-sm text-red-500">{errors.businessName.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="website">
                                    Website <span className="text-neutral-400 font-normal">(Optional)</span>
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-neutral-200 bg-neutral-50 text-neutral-500 sm:text-sm">
                                        https://
                                    </span>
                                    <input
                                        {...register("website")}
                                        id="website"
                                        className={`flex-1 min-w-0 px-4 py-3 rounded-none rounded-r-xl border ${errors.website ? 'border-red-500 outline-red-500' : 'border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'} transition-colors outline-none`}
                                        placeholder="www.bellasalon.com"
                                    />
                                </div>
                                {errors.website && <p className="mt-1 text-sm text-red-500">{errors.website.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Categories */}
                    <div className={step === 2 ? "block" : "hidden"}>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">What services do you offer?</h2>
                            <p className="text-neutral-500">Select all categories that apply to your business.</p>
                        </div>

                        <Controller
                            control={control}
                            name="categories"
                            render={({ field }) => (
                                <div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {CATEGORY_OPTIONS.map((category) => {
                                            const isSelected = field.value?.includes(category.id);
                                            return (
                                                <button
                                                    key={category.id}
                                                    type="button"
                                                    onClick={() => {
                                                        const newValue = isSelected
                                                            ? field.value.filter((v: string) => v !== category.id)
                                                            : [...(field.value || []), category.id];
                                                        field.onChange(newValue);
                                                    }}
                                                    className={`flex flex-col items-center justify-center p-6 border rounded-2xl transition-all duration-200 ${isSelected
                                                        ? "border-neutral-900 bg-neutral-900 text-white shadow-md scale-[1.02]"
                                                        : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
                                                        }`}
                                                >
                                                    <i className={`${category.icon} text-3xl mb-3 ${isSelected ? "text-white" : "text-neutral-600"}`}></i>
                                                    <span className="text-sm font-medium text-center">{category.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.categories && <p className="mt-4 text-sm text-red-500 text-center">{errors.categories.message}</p>}
                                </div>
                            )}
                        />
                    </div>

                    {/* Step 3: Location */}
                    <div className={step === 3 ? "block" : "hidden"}>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Where are you located?</h2>
                            <p className="text-neutral-500">Clients will use this to find you.</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="address">
                                    Street Address *
                                </label>
                                <input
                                    {...register("address")}
                                    id="address"
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-red-500 outline-red-500' : 'border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'} transition-colors outline-none`}
                                    placeholder="123 Salon Street"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="city">
                                        City *
                                    </label>
                                    <input
                                        {...register("city")}
                                        id="city"
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-red-500 outline-red-500' : 'border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'} transition-colors outline-none`}
                                        placeholder="New York"
                                    />
                                    {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="state">
                                        State / Province *
                                    </label>
                                    <input
                                        {...register("state")}
                                        id="state"
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.state ? 'border-red-500 outline-red-500' : 'border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'} transition-colors outline-none`}
                                        placeholder="NY"
                                    />
                                    {errors.state && <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2" htmlFor="zip">
                                    Postal Code *
                                </label>
                                <input
                                    {...register("zip")}
                                    id="zip"
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.zip ? 'border-red-500 outline-red-500' : 'border-neutral-200 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900'} transition-colors outline-none`}
                                    placeholder="10001"
                                />
                                {errors.zip && <p className="mt-1 text-sm text-red-500">{errors.zip.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="mt-10 pt-6 border-t border-neutral-100 flex items-center justify-between">
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="px-6 py-3 rounded-xl font-medium text-neutral-600 hover:bg-neutral-100 transition-colors"
                            >
                                Back
                            </button>
                        ) : (
                            <div /> // Placeholder for spacing
                        )}

                        {step < totalSteps ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="px-8 py-3 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors shadow-sm"
                            >
                                Continue
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 rounded-xl bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <i className="ri-loader-4-line animate-spin"></i> Finishing...
                                    </>
                                ) : (
                                    "Complete Setup"
                                )}
                            </button>
                        )}
                    </div>
                </form>
            </main>
        </div>
    );
}
