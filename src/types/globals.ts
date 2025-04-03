// Typings for NPM Package List
export type PackageList = {
    name: string; // Name of the package
    version: string; // Version of the package
    description: string; // Description of the package
    downloads: string; // Number of downloads (formatted as string)
    stars: number; // Number of stars the package has
    docsUrl: string; // URL to the documentation
    npmUrl: string; // NPM registry URL for the package
    tags?: string[];
};

// Typings for GitHub Repository
export type Theme = {
    name: string; // Name of the theme
    description: string; // Short description
    framework: string | string[]; // Framework used (React, Next.js, Vue.js, etc.)
    style: string; // Design style (Minimalist, Classic, Futuristic, etc.)
    image: string; // Image URL
    demoUrl: string; // Link to demo page
}

// Typings for Whitebox Solutions
export type WhiteboxSolution = {
    name: string; // Name of the whitebox solution
    slug: string; // Slug for routing or identification
    description: string; // Description of the solution
    image: string; // URL to the solution's image
    features: string[]; // List of features for the solution
    managementFee: number;
    installationPrice: number;
    demoUrl: string;
};