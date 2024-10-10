import React from 'react';
import { Container } from "@/components/Container";

const Page = () => {
  return (
    <Container>
      <div className="py-16 lg:py-20">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Terms and Conditions
        </h1>
        <div className="prose prose-red max-w-none dark:prose-invert">
          <p className="mb-4">
            Welcome to Piranha Studios. These terms and conditions outline the rules and regulations for the use of Piranha Studios&apos; website and services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing this website and using our services, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use our website or services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Services</h2>
          <p className="mb-4">
            Piranha Studios provides digital solutions including website development, e-commerce solutions, and digital strategy consulting. The specifics of each service will be agreed upon in a separate contract or statement of work.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Payment</h2>
          <p className="mb-4">
            Payment terms will be specified in the individual contract for services. Generally, we require a deposit before beginning work, with the balance due upon completion of the project.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property Rights</h2>
          <p className="mb-4">
            Upon full payment, the client will own the rights to the final deliverables. Piranha Studios retains the right to display the work in our portfolio unless otherwise agreed.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="mb-4">
            Piranha Studios shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Termination</h2>
          <p className="mb-4">
            Either party may terminate the service agreement with written notice. The client will be responsible for payment for all work completed up to the date of termination.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Governing Law</h2>
          <p className="mb-4">
            These terms and conditions are governed by and construed in accordance with the laws of the United Kingdom, and you submit to the non-exclusive jurisdiction of the courts located in the UK for the resolution of any disputes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
          <p className="mb-4">
            Piranha Studios reserves the right to modify these terms at any time. We will provide notice of significant changes by posting an announcement on our website.
          </p>

          <p className="mt-8">
            If you have any questions about these Terms and Conditions, please contact us at info@piranha-studios.co.uk.
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