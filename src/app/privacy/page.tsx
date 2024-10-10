import React from 'react';
import { Container } from "@/components/Container";

const Page = () => {
  return (
    <Container>
      <div className="py-16 lg:py-20">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Privacy Policy
        </h1>
        <div className="prose prose-red max-w-none dark:prose-invert">
          <p className="mb-4">
            At Piranha Studios, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines our practices concerning the collection, use, and disclosure of your personal data.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We may collect personal information such as your name, email address, phone number, and company details when you use our website, contact us, or engage our services. We also collect non-personal information such as browser type, IP address, and pages visited on our site.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and improve our services</li>
            <li>Communicate with you about our services</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Sharing and Disclosure</h2>
          <p className="mb-4">
            We do not sell your personal information. We may share your information with third-party service providers who assist us in operating our website and conducting our business. These parties are obligated to keep your information confidential.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Rights</h2>
          <p className="mb-4">
            You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your data. To exercise these rights, please contact us at privacy@piranha-studios.co.uk.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Cookies</h2>
          <p className="mb-4">
            Our website uses cookies to enhance your browsing experience. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Policy</h2>
          <p className="mb-4">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &ldquo;last updated&ldquo; date.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p>
            Piranha Studios<br />
            Email: privacy@piranha-studios.co.uk<br />
          </p>

          <p className="mt-8">
            By using our website and services, you agree to the collection and use of information in accordance with this policy.
          </p>

          <p className="mt-4">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Page