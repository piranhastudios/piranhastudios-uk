"use client"

import {useState} from "react"
import {AlertCircle, Plus} from "lucide-react"
import {useRouter} from "next/navigation";

interface Questionnair {
    businessName: string,
    industry: string,
    employees: string,
    digitalTools: string[],
    digitalChallenges: string[],
    budget: string;
    email: string,
}

interface AdditionalAnswerFlag {
    otherIndustry: boolean
    moreTools: string[] | null
    additionalChallenges: string[] | null
}

export default function QuestionnaireForm() {
    const router = useRouter()
    const [success, setSuccess] = useState<boolean>(false)
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        businessName: "",
        industry: "",
        employees: "",
        digitalTools: [] as string[],
        digitalChallenges: [] as string[],
        email: "",
        budget: "",
    })
    const [additionalAnswerFlag, setAdditionalAnswerFlag] = useState<AdditionalAnswerFlag>({
        otherIndustry: false,
        moreTools: null,
        additionalChallenges: null,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const totalSteps = 4

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {}

        switch (step) {
            case 1:
                if (!formData.businessName) newErrors.businessName = "Business name is required"
                if (!formData.industry) newErrors.industry = "Please select an industry"
                if (!formData.employees) newErrors.employees = "Please select employee count"
                break
            case 2:
                if (formData.digitalTools.length === 0) newErrors.digitalTools = "Please select at least one digital tool"
                break
            case 3:
                if (formData.digitalChallenges.length === 0) newErrors.digitalChallenges = "Please select at least one challenge"
                break
            case 4:
                if (!formData.email) {
                    newErrors.email = "Email is required"
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    newErrors.email = "Please enter a valid email address"
                }
                if (!formData.budget) {
                    newErrors.budget = "Please specify your estimated budget";
                }
                break
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, totalSteps))
        }
    }

    const handlePrevious = () => {
        setStep((prev) => Math.max(prev - 1, 1))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(step)) return;

        try {
            // Merge additional tools and challenges before submitting
            const allDigitalTools = [
                ...formData.digitalTools,
                ...(additionalAnswerFlag.moreTools?.filter(tool => tool.trim() !== "") || []), // Remove empty values
            ];

            const allDigitalChallenges = [
                ...formData.digitalChallenges,
                ...(additionalAnswerFlag.additionalChallenges?.filter(challenge => challenge.trim() !== "") || []), // Remove empty values
            ];

            const payload: Questionnair = {
                businessName: formData.businessName,
                industry: formData.industry,
                employees: formData.employees,
                budget: formData.budget,
                digitalTools: allDigitalTools,
                digitalChallenges: allDigitalChallenges,
                email: formData.email,
            };

            const response = await fetch("/api/send-strategy-guide", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
                console.log("✅ Email sent successfully:", data.message);
            } else {
                console.error(new Error(data.message));
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
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                        Digital Strategy Assessment
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-300">
                        Assess your digital strategy and get a customized guide for improvement
                    </p>
                    <div className="mt-4 h-2 bg-gray-200 rounded-full">
                        <div
                            className="h-full bg-red-600 rounded-full transition-all duration-300"
                            style={{width: `${(step / totalSteps) * 100}%`}}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-4">📌 Business Information</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        What is the name of your business?
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                                        className={`w-full px-3 py-2 border rounded-md ${
                                            errors.businessName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                        } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                    />
                                    {errors.businessName && (
                                        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                                            <AlertCircle className="h-4 w-4"/>
                                            {errors.businessName}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        What industry do you operate in?
                                    </label>
                                    <div className="space-y-2">
                                        {["Retail", "Professional Services", "Hospitality", "Manufacturing", "Other"].map(
                                            (industry) => (
                                                <label key={industry} className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        name="industry"
                                                        value={industry}
                                                        checked={formData.industry === industry || additionalAnswerFlag.otherIndustry && industry == "Other"}
                                                        onChange={(e) => {
                                                            if (e.target.value == "Other") {
                                                                setAdditionalAnswerFlag(prevState => ({
                                                                    ...prevState,
                                                                    otherIndustry: true
                                                                }));
                                                                setFormData({
                                                                    ...formData,
                                                                    industry: ""
                                                                })
                                                            } else {
                                                                if (additionalAnswerFlag.otherIndustry) {
                                                                    setAdditionalAnswerFlag(prevState => ({
                                                                        ...prevState,
                                                                        otherIndustry: false
                                                                    }));
                                                                }
                                                                setFormData({
                                                                    ...formData,
                                                                    industry: e.target.value
                                                                })
                                                            }
                                                        }}
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                    />
                                                    <span className="text-gray-700 dark:text-gray-300">{industry}</span>
                                                </label>
                                            )
                                        )}
                                    </div>
                                    {additionalAnswerFlag.otherIndustry ?
                                        <input
                                            type="text"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({...formData, industry: e.target.value})}
                                            className={`w-full px-3 py-2 border rounded-md ${
                                                errors.businessName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                            } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                        />
                                        : null}
                                    {errors.industry && (
                                        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                                            <AlertCircle className="h-4 w-4"/>
                                            {errors.industry}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        How many employees do you have?
                                    </label>
                                    <div className="space-y-2">
                                        {["1-5", "6-20", "21-50", "50+"].map((size) => (
                                            <label key={size} className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    name="employees"
                                                    value={size}
                                                    checked={formData.employees === size}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        employees: e.target.value
                                                    })}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <span className="text-gray-700 dark:text-gray-300">{size}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.employees && (
                                        <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                                            <AlertCircle className="h-4 w-4"/>
                                            {errors.employees}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-4">📌 Current Digital Strategy</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    What digital tools or platforms do you currently use?
                                </label>
                                <div className="space-y-2">
                                    {[
                                        "Website",
                                        "E-commerce platform",
                                        "POS system linked to online store",
                                        "CRM or customer management system",
                                        "ERP software",
                                        "Accounting software",
                                        "Content Management System",
                                    ].map((tool) => (
                                        <label key={tool} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.digitalTools.includes(tool)}
                                                onChange={(e) => {
                                                    const updatedTools = e.target.checked
                                                        ? [...formData.digitalTools, tool]
                                                        : formData.digitalTools.filter((t) => t !== tool)
                                                    setFormData({...formData, digitalTools: updatedTools})
                                                }}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">{tool}</span>
                                        </label>
                                    ))}
                                </div>
                                {additionalAnswerFlag.moreTools?.length && (
                                    additionalAnswerFlag.moreTools.map((tool: string, index: number) => (
                                        <input
                                            key={index}
                                            value={tool} // Ensure the input reflects the current state
                                            onChange={(e) => {
                                                const updatedTools = [...additionalAnswerFlag.moreTools as string[]]; // Copy the array
                                                updatedTools[index] = e.target.value; // Update the specific index
                                                setAdditionalAnswerFlag({
                                                    ...additionalAnswerFlag,
                                                    moreTools: updatedTools, // Update state with the new array
                                                });
                                            }}
                                            className="w-full px-3 py-2 border rounded-md my-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ))
                                )}

                                <button
                                    onClick={() => {
                                        setAdditionalAnswerFlag(prevState => ({
                                            ...prevState,
                                            moreTools: [...(prevState.moreTools || []), ""], // Ensure moreTools is always an array
                                        }));
                                    }}
                                    type="button"
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 my-2 rounded-md flex items-center"
                                >
                                    <Plus className="mr-2"/> More tools
                                </button>

                                {errors.digitalTools && (
                                    <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-4 w-4"/>
                                        {errors.digitalTools}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold mb-4">📌 Future Goals & Challenges</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    What are your biggest digital challenges right now?
                                </label>
                                <div className="space-y-2">
                                    {[
                                        "Generating more online sales",
                                        "Understanding and improving SEO",
                                        "Improving website performance",
                                        "Connecting in-store and online experiences",
                                        "Keeping up with new e-commerce trends",
                                    ].map((challenge) => (
                                        <label key={challenge} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.digitalChallenges.includes(challenge)}
                                                onChange={(e) => {
                                                    const updatedChallenges = e.target.checked
                                                        ? [...formData.digitalChallenges, challenge]
                                                        : formData.digitalChallenges.filter((c) => c !== challenge)
                                                    setFormData({...formData, digitalChallenges: updatedChallenges})
                                                }}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">{challenge}</span>
                                        </label>
                                    ))}
                                </div>
                                {additionalAnswerFlag.additionalChallenges?.length && (
                                    additionalAnswerFlag.additionalChallenges.map((tool: string, index: number) => (
                                        <input
                                            key={index}
                                            value={tool} // Ensure the input reflects the current state
                                            onChange={(e) => {
                                                const updatedChallenges = [...additionalAnswerFlag.additionalChallenges as string[]]; // Copy the array
                                                updatedChallenges[index] = e.target.value; // Update the specific index
                                                setAdditionalAnswerFlag({
                                                    ...additionalAnswerFlag,
                                                    additionalChallenges: updatedChallenges, // Update state with the new array
                                                });
                                            }}
                                            className="w-full px-3 py-2 border rounded-md my-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    ))
                                )}

                                <button
                                    onClick={() => {
                                        setAdditionalAnswerFlag(prevState => ({
                                            ...prevState,
                                            additionalChallenges: [...(prevState.additionalChallenges || []), ""], // Ensure moreTools is always an array
                                        }));
                                    }}
                                    type="button"
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 my-2 rounded-md flex items-center"
                                >
                                    <Plus className="mr-2"/> Other
                                </button>
                                {errors.digitalChallenges && (
                                    <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                                        <AlertCircle className="h-4 w-4"/>
                                        {errors.digitalChallenges}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            {success ? (
                                <div
                                    className="flex flex-col items-center text-center bg-emerald-50 dark:bg-emerald-900 p-6 rounded-lg shadow-md">
                                    <svg className="w-16 h-16 text-emerald-500 dark:text-emerald-400" fill="none"
                                         stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                    <h2 className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-4">
                                        🎉 Success! Your Digital Strategy Guide is on the way.
                                    </h2>
                                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                                        Thank you for signing up! We&apos;ve sent your guide
                                        to <strong>{formData.email}</strong>.
                                        Check your inbox (and spam folder) for the download link.
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 mt-4">
                                        Need further guidance? <a
                                        href="https://calendly.com/piranha-consultation/follow-up-meetingq"
                                        className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">Book
                                        a free consultation</a>.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-xl font-semibold mb-4">📌 How much would you look to spend on
                                        improving your digital experience?</h2>
                                    <div className="space-y-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                        <div>
                                            <label
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated
                                                Budget (per year)</label>
                                            <select
                                                value={formData.budget}
                                                onChange={(e) => setFormData({...formData, budget: e.target.value})}
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
                                                    <AlertCircle className="h-4 w-4"/>
                                                    {errors.budget}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-semibold mb-4">📌 Get Your Free Digital Strategy
                                        Guide!</h2>
                                    <div className="space-y-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                                        <h3 className="font-medium text-gray-800 dark:text-white">💡 As a thank-you,
                                            you&apos;ll
                                            receive:</h3>
                                        <ul className="space-y-2 list-none pl-6 text-gray-600 dark:text-gray-300">
                                            <li className="flex items-center space-x-2">
                                                <span className="text-emerald-500 dark:text-emerald-400">✓</span>
                                                <span>How to optimize your website for speed and security</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="text-emerald-500 dark:text-emerald-400">✓</span>
                                                <span>Understanding Google&apos;s AI-powered search and SEO</span>
                                            </li>
                                            <li className="flex items-center space-x-2">
                                                <span className="text-emerald-500 dark:text-emerald-400">✓</span>
                                                <span>The importance of omnichannel strategies</span>
                                            </li>
                                        </ul>
                                        <div className="mt-4">
                                            <label
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Email address
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className={`w-full px-3 py-2 border rounded-md ${
                                                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                } bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                                                placeholder="Enter your email"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm flex items-center gap-1 mt-1">
                                                    <AlertCircle className="h-4 w-4"/>
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </form>
                {success ? null :

                    <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                Previous
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={step < totalSteps ? handleNext : handleSubmit}
                            className="ml-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        >
                            {step < totalSteps ? "Next Step" : "Submit"}
                        </button>
                    </div>}
            </div>
        </div>
    )
}