import React from 'react';
import {Container} from "@/components/Container";

const Page = () => {
    return (
        <Container>
            <div className="py-16 lg:py-20">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                    Service Level Agreement (SLA)
                </h1>
                <div className="prose prose-red max-w-none dark:prose-invert">
                    <p className="mb-4">
                        <strong>Effective Date:</strong> 27/04/2023
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">1. Purpose</h2>
                    <p className="mb-4">
                        This Service Level Agreement (SLA) outlines the performance and service standards provided by
                        Piranha Studios to its clients. This SLA is designed to ensure a clear understanding of our
                        service commitments and quality standards.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">2. Scope of Services</h2>
                    <p className="mb-4">
                        Piranha Studios offers the following digital services:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>
                            <strong>Website Development:</strong>
                            <ul className="list-circle pl-6 mt-2">
                                <li>Custom website design and development</li>
                                <li>E-commerce solutions</li>
                                <li>Content Management System (CMS) integration</li>
                                <li>Responsive design for mobile compatibility</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Mobile Application Development:</strong>
                            <ul className="list-circle pl-6 mt-2">
                                <li>Native iOS and Android app development</li>
                                <li>Cross-platform app development</li>
                                <li>Progressive Web Apps (PWAs)</li>
                            </ul>
                        </li>
                        <li>
                            <strong>SAAS Solutions:</strong>
                            <ul className="list-circle pl-6 mt-2">
                                <li>Custom SAAS platform development</li>
                                <li>Cloud-based software solutions</li>
                                <li>API development and integration</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Custom AI Solutions:</strong>
                            <ul className="list-circle pl-6 mt-2">
                                <li>Machine Learning model development</li>
                                <li>Natural Language Processing (NLP) applications</li>
                                <li>Computer Vision solutions</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Analytics Dashboards:</strong>
                            <ul className="list-circle pl-6 mt-2">
                                <li>Custom data visualization dashboards</li>
                                <li>Business intelligence solutions</li>
                                <li>Real-time data analytics</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Ongoing Support and Maintenance:</strong>
                            <ul className="list-circle pl-6 mt-2">
                                <li>24/7 technical support</li>
                                <li>Regular software updates and security patches</li>
                                <li>Performance optimization</li>
                            </ul>
                        </li>
                        <li>
                            <strong>Digital Marketing and SEO:</strong>
                            <ul className="list-circle pl-6 mt-2">
                                <li>Search Engine Optimization (SEO)</li>
                                <li>Pay-Per-Click (PPC) advertising</li>
                                <li>Social media marketing strategies</li>
                                <li>Content marketing</li>
                            </ul>
                        </li>
                        <li>
                            <strong>UI/UX Design:</strong>
                            <ul className="list-circle pl-6 mt-2">
                                <li>User Interface (UI) design</li>
                                <li>User Experience (UX) research and design</li>
                                <li>Prototyping and wireframing</li>
                            </ul>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">3. Service Performance Standards</h2>
                    <h3 className="text-xl font-semibold mt-4 mb-2">3.1 Service Availability</h3>
                    <p className="mb-4">
                        Piranha Studios guarantees a service uptime of 99% excluding planned maintenance periods.
                    </p>

                    <h3 className="text-xl font-semibold mt-4 mb-2">3.2 Response Times</h3>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Critical Issues (e.g., service downtime): Response within 1 hour.</li>
                        <li>High Priority Issues (e.g., major functionality impairment): Response within 4 hours.</li>
                        <li>Normal Priority Issues (e.g., minor functionality issues, general inquiries): Response
                            within 1 business
                            day.
                        </li>
                    </ul>

                    <h3 className="text-xl font-semibold mt-4 mb-2">3.3 Resolution Times</h3>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Critical Issues: Resolution within 24 hours.</li>
                        <li>High Priority Issues: Resolution within 3 business days.</li>
                        <li>Normal Priority Issues: Resolution as per mutually agreed timelines based on the complexity
                            of the
                            issue.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">4. Client Responsibilities</h2>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Provide timely and detailed notifications of any service issues.</li>
                        <li>Ensure that all necessary information and access required for issue resolution are promptly
                            provided.
                        </li>
                        <li>Comply with payment terms as outlined in individual contracts or service agreements.</li>
                        <li>Maintain necessary software and hardware on the client side to access and use our
                            services.
                        </li>
                        <li>Ensure that only authorized personnel have access to the provided services and
                            administrative
                            interfaces.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">5. Performance Monitoring and Reporting</h2>
                    <p className="mb-4">
                        Piranha Studios will provide quarterly performance reports detailing service uptime, issue
                        resolution metrics, and client support activities. These reports will be made available through
                        a secure client portal or sent via email as per client preference.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">6. Service Management</h2>
                    <p className="mb-4">
                        A dedicated account manager will be assigned to each client, serving as the primary contact for
                        service management and escalation. The account manager will be responsible for regular
                        check-ins, addressing concerns, and ensuring client satisfaction.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">7. Amendments to the SLA</h2>
                    <p className="mb-4">
                        This SLA may be updated periodically to reflect the evolving nature of our services and market
                        needs. Current clients will be notified of any changes in advance, with a minimum notice period
                        of 30 days before the new terms take effect.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">8. Service Credits</h2>
                    <p className="mb-4">
                        In the event that Piranha Studios fails to meet the service uptime commitment, clients may be
                        eligible for service credits. The credit amount will be calculated as a percentage of the
                        monthly service fee, based on the duration and severity of the service interruption. Specific
                        terms will be detailed in individual client contracts.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">9. Limitation of Liability</h2>
                    <p className="mb-4">
                        Piranha Studios&apos; liability under this SLA is limited to the provision of service credits and
                        shall not exceed the service fees paid by the client for the month in which the failure
                        occurred. Piranha Studios is not liable for any indirect, consequential, or incidental damages
                        arising from the use of our services.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">10. Termination</h2>
                    <p className="mb-4">
                        This SLA remains effective until superseded by a revised agreement mutually endorsed by the
                        parties. Either party may terminate this agreement with 30 days written notice, subject to the
                        terms outlined in the master service agreement or contract.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">11. Dispute Resolution</h2>
                    <p className="mb-4">
                        Any disputes arising from this SLA will first be addressed through good-faith negotiations
                        between the parties. If a resolution cannot be reached, the dispute will be subject to mediation
                        or arbitration as specified in the master service agreement.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact Information</h2>
                    <p className="mb-4">
                        For any issues or inquiries related to this SLA or services provided, please contact:
                    </p>
                    <p>
                        Email: info@piranha-studios.co.uk<br/>
                    </p>

                    <p className="mt-8">
                        By engaging our services, you acknowledge that you have read, understood, and agree to the terms
                        outlined in this Service Level Agreement.
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