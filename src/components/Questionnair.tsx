"use client";

import { useState } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface Questionnaire {
    businessName: string;
    industry: string;
    employees: string;
    digitalTools: string[];
    digitalChallenges: string[];
    email: string;
    budget: string; // New Budget Field
}

interface AdditionalAnswerFlag {
    otherIndustry: boolean;
    moreTools: string[] | null;
    additionalChallenges: string[] | null;
}

export default function QuestionnaireForm() {
    const router = useRouter();
    const [success, setSuccess] = useState<boolean>(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Questionnaire>({
        businessName: "",
        industry: "",
        employees: "",
        digitalTools: [],
        digitalChallenges: [],
        email: "",
        budget: "", // New Budget Field
    });
    const [additionalAnswerFlag, setAdditionalAnswerFlag] = useState<AdditionalAnswerFlag>({
        otherIndustry: false,
        moreTools: null,
        additionalChallenges: null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const totalSteps = 4;

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        switch (step) {
            case 1:
                if (!formData.businessName) newErrors.businessName = "Business name is required";
                if (!formData.industry) newErrors.industry = "Please select an industry";
                if (!formData.employees) newErrors.employees = "Please select employee count";
                break;
            case 2:
                if (formData.digitalTools.length === 0) newErrors.digitalTools = "Please select at least one digital tool";
                break;
            case 3:
                if (formData.digitalChallenges.length === 0) newErrors.digitalChallenges = "Please select at least one challenge";
                break;
            case 4:
                if (!formData.email) {
                    newErrors.email = "Email is required";
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    newErrors.email = "Please enter a valid email address";
                }
                if (!formData.budget) {
                    newErrors.budget = "Please specify your estimated budget";
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(step)) return;

        try {
            const payload = {
                businessName: formData.businessName,
                industry: formData.industry,
                employees: formData.employees,
                budget: formData.budget, // Include budget in submission
                digitalTools: formData.digitalTools,
                digitalChallenges: formData.digitalChallenges,
                email: formData.email,
            };

            const response = await fetch("/api/send-strategy-guide", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                console.log("✅ Email sent successfully:", data.message);
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error("❌ Error sending email:", error);
            alert("Something went wrong while sending the email. Please try again.");
        }
    };

    return (
        <div className="py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Digital Strategy Assessment</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-300">Assess your digital strategy and get a customized guide for improvement</p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div className="h-full bg-red-600 rounded-full transition-all duration-300" style={{ width: `${(step / totalSteps) * 100}%` }} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {step === 4 && (
                        <div className="space-y-6">
                            {success ? (
                                <div className="flex flex-col items-center text-center bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg shadow-md">
                                    <svg className="w-16 h-16 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-4">
                                        🎉 Success! Your Digital Strategy Guide is on the way.
                                    </h2>
                                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                                        Thank you for signing up! We've sent your guide to <strong>{formData.email}</strong>.
                                        Check your inbox (and spam folder) for the download link.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-semibold mb-4">📌 Final Step: Budget & Contact Info</h2>
                                    <div className="space-y-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Budget (per year)</label>
                                            <select
                                                value={formData.budget}
                                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                                className={`w-full px-3 py-2 border rounded-md ${
                                                    errors.budget ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                                                } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                            >
                                                <option value="">Select a range</option>
                                                <option value="Under £1,000">Under £1,000</option>
                                                <option value="£1,000 - £5,000">£1,000 - £5,000</option>
                                                <option value="£5,000 - £10,000">£5,000 - £10,000</option>
                                                <option value="Over £10,000">Over £10,000</option>
                                            </select>
                                            {errors.budget && (
                                                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                                                    <AlertCircle className="h-4 w-4" />
                                                    {errors.budget}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </form>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                    {step > 1 && (
                        <button type="button" onClick={handlePrevious} className="px-4 py-2 border rounded-md text-gray-600 dark:text-gray-300">
                            Previous
                        </button>
                    )}
                    <button type="button" onClick={step < totalSteps ? handleNext : handleSubmit} className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md">
                        {step < totalSteps ? "Next Step" : "Submit"}
                    </button>
                </div>
            </div>
        </div>
    );
}
