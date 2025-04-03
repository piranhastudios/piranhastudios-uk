// This file simulates data fetching from an API or database

import {PackageList, Theme, WhiteboxSolution} from "@/types/globals";

export async function getNpmPackages(): Promise<PackageList[]> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: "medusav2-file-vercel-blob",
          version: "1.2.0",
          description: "Medusa file service plugin for Vercel Blob storage integration",
          downloads: "12K+",
          stars: 87,
          tags: ["medusa", "javascript", "e-commerce", "starter"],
          docsUrl: "#",
          npmUrl: "#",
        },
        {
          name: "medusav2-file-supabase-storage",
          version: "1.1.3",
          description: "Medusa file service plugin for Supabase storage integration",
          downloads: "8K+",
          stars: 64,
          tags: ["medusa", "javascript", "e-commerce", "starter"],
          docsUrl: "#",
          npmUrl: "#",
        },
      ])
    }, 500)
  })
}

export async function getThemes(): Promise<Theme[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        // {
        //   name: "Blog",
        //   description: "A sleek, mobile-first blog theme for high-converting stores.",
        //   framework: ["Next.js", "WordPress"],
        //   style: "Minimalist",
        //   image: "/themes/modern-commerce.png",
        //   demoUrl: "/demos/modern-commerce",
        // },
        // {
        //   name: "Classic Storefront",
        //   description: "A timeless, grid-based layout ideal for traditional online shops.",
        //   framework: "React",
        //   style: "Classic",
        //   image: "/themes/classic-storefront.png",
        //   demoUrl: "/demos/classic-storefront",
        // },
        // {
        //   name: "Luxury Boutique",
        //   description: "A high-end, premium design perfect for luxury brands.",
        //   framework: "Next.js",
        //   style: "Elegant",
        //   image: "/themes/luxury-boutique.png",
        //   demoUrl: "/demos/luxury-boutique",
        // },
        // {
        //   name: "Tech Marketplace",
        //   description: "A modern theme built for tech and digital product marketplaces.",
        //   framework: "Next.js",
        //   style: "Futuristic",
        //   image: "/themes/tech-marketplace.png",
        //   demoUrl: "/demos/tech-marketplace",
        // },
      ])
    }, 500)
  })
}

export async function getWhiteboxSolutions(): Promise<WhiteboxSolution[]> {
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          name: "Healthcare Commerce",
          slug: "healthcare-commerce",
          description: "Specialized e-commerce solution for healthcare products and services.",
          image: "/healthcare-demo-thumbnail.png",
          features: [
            "Compliant with healthcare regulations",
            "Prescription management",
            "Secure patient profiles",
            "Integration with OpenEMR",
            "Specialized checkout for medical products",
          ],
          installationPrice: 1499,
          managementFee: 200,
          demoUrl: "https://demo-eight-murex.vercel.app/gb",
        },
        {
          name: "Marketplace",
          slug: "marketplace",
          description: "A complete multivendor marketplace solution for online businesses.",
          image: "/ice-cold-lemon-demo.png",
          features: [
            "Vendor onboarding and management",
            "Commission and fee structure",
            "Multi-seller inventory system",
            "Vendor-specific analytics",
            "Marketplace-optimized checkout",
          ],
          installationPrice: 1999,
          managementFee: 200,
          demoUrl: "https://v0-medusa-resale-marketplace.vercel.app",
        },
        {
          name: "E-Commerce Solution",
          slug: "ecommerce-solution",
          description: "A customizable, full-featured online store solution with secure payment integration.",
          image: "/e-commerce-demo-thumbnail.png",
          features: [
            "Product and inventory management",
            "Customizable storefront design",
            "Secure payments (Stripe, PayPal, etc.)",
            "Order processing and fulfillment",
            "Multi-channel sales support",
          ],
          installationPrice: 999,
          managementFee: 75,
          demoUrl: "https://v0-high-end-fashion-website.vercel.app",
        },
      ]);
    }, 500);
  });
}

