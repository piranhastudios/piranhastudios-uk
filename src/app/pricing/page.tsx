import React from 'react';
import {Container} from "@/components/Container";
import {FaCheck} from 'react-icons/fa';

const PricingCard = ({title, price, monthly, features}: {
    title: string,
    price: string,
    monthly: boolean,
    features: any
}) => (
    <div
        className="flex flex-col p-6 mx-auto w-full justify-between max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white">
        <div>
            <h3 className="mb-4 text-2xl font-semibold">{title}</h3>
            <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">£{price}</span>
                {monthly ? <span className={"text-xs"}>/month</span> : null}
            </div>
        </div>
        <ul role="list" className="mb-8 space-y-4 text-left">
            {features.map((feature: any, index: number) => (
                <li key={index} className="flex items-center space-x-3">
                    <FaCheck className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"/>
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        <a href="https://calendly.com/piranha-consultation/follow-up-meeting"
           className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-red-900">Get
            started</a>
    </div>
);

const PricingSection = ({title, items}: { title: string, items: any }) => (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{title}</h2>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
            {items.map((item: any, index: number) => (
                <PricingCard key={index} {...item} />
            ))}
        </div>
    </div>
);

const FeaturesList = ({features}: { features: any }) => (
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md">
            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Content
                + Features</h2>
            <ul className="space-y-4 text-left text-gray-500 dark:text-gray-400">
                {features.map((feature: any, index: number) => (
                    <li key={index} className="flex items-center space-x-3">
                        <FaCheck className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"/>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const PricingPage = () => {
    const websitePricing = [
        {
            title: "Starter",
            price: "250",
            features: [
                "Home page",
                "Navigation",
                "Contact form",
                "Fully licenced imagery"
            ]
        },
        {
            title: "Basic",
            price: "650",
            features: [
                "Home page",
                "Up to 4 additional pages",
                "Navigation",
                "Contact form",
                "Fully licenced imagery",
                "Flexible design"
            ]
        },
        {
            title: "Standard",
            price: "1000",
            features: [
                "Home page",
                "Up to 9 additional pages",
                "Up to 3 custom plugin integrations",
                "Navigation",
                "Contact form",
                "Fully licenced imagery",
                "Flexible design",
                "Tailored to your needs"
            ]
        }
    ];

    const hostingPricing = [
        {
            title: "Basic",
            price: "30",
            monthly: true,
            features: [
                "Hosting",
                "Security updates",
                "Backups",
                "Includes changes*",
                "Additional website support"
            ]
        },
        {
            title: "Standard",
            price: "70",
            monthly: true,
            features: [
                "Hosting",
                "Security updates",
                "Backups",
                "Content Updates"
            ]
        },
        {
            title: "Enterprise",
            price: "250",
            monthly: true,
            features: [
                "Hosting",
                "Security updates",
                "Backups",
                "Includes changes*",
                "Additional website support"
            ]
        }
    ];
    const consultingPricing = [
        {
            title: "Starter",
            price: "400",
            monthly: true,
            hours: 8,
            features: [
                "8 hours of expert consulting",
                "Monthly strategy session",
                "Email support",
                "Access to resource library"
            ]
        },
        {
            title: "Growth",
            price: "700",
            monthly: true,
            hours: 20,
            features: [
                "20 hours of expert consulting",
                "Bi-weekly strategy sessions",
                "Priority email and phone support",
                "Custom project planning",
                "Access to premium resources"
            ]
        },
        {
            title: "Pro",
            price: "1200",
            monthly: true,
            hours: 40,
            features: [
                "40 hours of expert consulting",
                "Weekly strategy sessions",
                "24/7 priority support",
                "Dedicated account manager",
                "Custom project planning and execution",
                "Exclusive workshops and training"
            ]
        },
        {
            title: "Custom",
            price: "Custom",
            monthly: true,
            hours: "Flexible",
            features: [
                "Tailored consulting package",
                "Flexible hours allocation",
                "Customized support and features",
                "Enterprise-level solutions"
            ]
        }
    ];
    const contentFeatures = [
        "£150 per page of content",
        "£60 per social media content post",
        "£500 per branding pack (Logo, Social media templates and brand story content)",
        "£350 App Plugin Integration - integrate your favourite apps e.g. sendgrid, stripe, calendly etc",
        "New Plugin development - Build custom functionality into your solution"
    ];

    const securityAuditPricing = [
        {
            title: "Basic",
            price: "35",
            features: ["Basic security audit"]
        },
        {
            title: "Standard",
            price: "100",
            features: ["Standard security audit"]
        },
        {
            title: "Advanced",
            price: "350",
            features: ["Advanced security audit"]
        }
    ];

    return (
        <Container>
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h1 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Our
                        Pricing Plans</h1>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">We offer a range of
                        services to meet your digital needs. Choose the plan that works best for you.</p>
                </div>
            </div>

            <PricingSection title="Website Packages" items={websitePricing}/>
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">Industry
                        Integrations</h2>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        £300 e-commerce functionality,<br/>
                        £950 healthcare booking and registration,<br/>
                        £250 restaurant ordering/delivery,<br/>
                    </p>
                </div>
            </div>
            <FeaturesList features={contentFeatures}/>
            <div className={"flex justify-center"}>
                <a href="https://calendly.com/piranha-consultation/follow-up-meeting"
                   className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-red-900">
                    Book a Consultation
                </a>
            </div>

            <PricingSection title="Hosting + Maintenance" items={hostingPricing}/>

            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">SEO
                        Services</h2>
                    <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        £60 per page<br/>
                        £100/month for monthly optimisation
                    </p>
                </div>
            </div>
            <div className={"flex justify-center"}>
                <a href="https://calendly.com/piranha-consultation/follow-up-meeting"
                   className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:text-white  dark:focus:ring-red-900">
                    Book a Consultation
                </a>
            </div>
            <PricingSection title="Security Audit" items={securityAuditPricing}/>
            <PricingSection title="Consulting Services" items={consultingPricing}/>
        </Container>
    );
};

export default PricingPage