import React from 'react';
import { Container } from "@/components/Container";
import {
  FaShoppingCart,
  FaTools,
  FaServer,
  FaRocket,
  FaChartLine,
  FaCheckCircle,
  FaArrowRight,
  FaGlobe,
  FaStore,
  FaBox
} from 'react-icons/fa';
import { IconType } from 'react-icons';

type ServiceItem = {
  title: string;
  description: string;
} | string;

type ServiceSectionProps = {
  icon: IconType;
  title: string;
  description: string;
  items: ServiceItem[];
};

const ServiceCard = ({ icon: Icon, title, description, items }: ServiceSectionProps) => (
  <div className="p-8 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3 mb-6">
      <div className="p-3 bg-red-50 rounded-lg">
        <Icon className="w-6 h-6 text-red-600"/>
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
    </div>
    <p className="mb-6 text-gray-600">{description}</p>
    <ul className="space-y-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-3">
          <FaCheckCircle className="w-5 h-5 mt-1 text-green-500 flex-shrink-0"/>
          {typeof item === 'object' ? (
            <div>
              <strong className="text-gray-900">{item.title}: </strong>
              <span className="text-gray-600">{item.description}</span>
            </div>
          ) : (
            <span className="text-gray-600">{item}</span>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const ValueCard = ({ title, description }: { title: string, description: string }) => (
  <div className="p-6 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3 mb-4">
      <FaCheckCircle className="w-5 h-5 text-green-500"/>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const SolutionsPage = () => {
  const services = [
    {
      icon: FaShoppingCart,
      title: "Complete Commerce Solutions",
      description: "Build your perfect online business with flexible solutions that adapt to your needs:",
      items: [
        {title: "Business Sales", description: "Custom portals for B2B with wholesale pricing and account management."},
        {title: "Online Marketplace", description: "Multi-seller platforms that bring vendors and customers together."},
        {title: "Subscription Services", description: "Recurring payment systems for predictable revenue."}
      ]
    },
    {
      icon: FaGlobe,
      title: "Global Growth",
      description: "Expand your business worldwide with ease:",
      items: [
        {title: "International Selling", description: "Serve different regions with local pricing and inventory."},
        {title: "Unified Commerce", description: "Sell everywhere - online, in-store, and through apps."},
        {title: "In-Store Integration", description: "Connect your physical and online stores seamlessly."}
      ]
    },
    {
      icon: FaBox,
      title: "Product Solutions",
      description: "Flexible systems for any type of product:",
      items: [
        {title: "Digital Products", description: "Sell software, content, or services online."},
        {title: "Custom Products", description: "Let customers personalize their purchases."},
        {title: "Smart Fulfillment", description: "Automated order processing and delivery."}
      ]
    },
    {
      icon: FaServer,
      title: "Business Integration",
      description: "Connect all your business tools seamlessly:",
      items: [
        {title: "Tool Connection", description: "Work with your favorite business apps and services."},
        {title: "Smart Automation", description: "Save time with automated business processes."},
        {title: "Easy Updates", description: "Change any part of your system without rebuilding everything."}
      ]
    },
    {
      icon: FaTools,
      title: "Support Services",
      description: "Expert help when you need it:",
      items: [
        "Custom feature building",
        "Speed and performance improvements",
        "Business technology consulting"
      ]
    },
    {
      icon: FaChartLine,
      title: "Growth Solutions",
      description: "Tools to help your business expand:",
      items: [
        "Business insights and reports",
        "Marketing tools",
        "Sales optimization"
      ]
    }
  ];

  const values = [
    {
      title: "Future-Ready Design",
      description: "Systems that grow and change with your business needs."
    },
    {
      title: "Built to Scale",
      description: "Solutions that handle your business from startup to enterprise."
    },
    {
      title: "Expert Team",
      description: "Experienced professionals who understand your business goals."
    },
    {
      title: "Reliable Support",
      description: "Ongoing assistance and regular updates to keep you running smoothly."
    }
  ];

  return (
    <Container>
      <div className="py-20 px-4">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-5xl font-extrabold mb-6">
            Modern Commerce Solutions
          </h1>
          <p className="text-xl text-gray-600">
            We build flexible, powerful online stores that adapt to your business needs.
            Whether you're selling to businesses or consumers, locally or globally,
            we'll help you create a solution that grows with your success.
          </p>
          <div className="mt-8">
            <a
              href="https://calendly.com/piranha-consultation/follow-up-meeting"
              className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-200"
            >
              Schedule a Consultation
              <FaArrowRight className="ml-2" />
            </a>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Solutions</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>

        {/* Why Work With Us Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why Work With Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto text-center bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's discuss how our modern commerce solutions can help you achieve your goals.
          </p>
          <a
            href="https://calendly.com/piranha-consultation/follow-up-meeting"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:ring-red-200"
          >
            Schedule a Consultation
            <FaArrowRight className="ml-2" />
          </a>
        </div>
      </div>
    </Container>
  );
};

export default SolutionsPage;