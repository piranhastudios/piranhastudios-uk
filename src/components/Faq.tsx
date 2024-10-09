"use client";
import React from "react";
import { Container } from "@/components/Container";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/solid";

export const Faq = () => {
  return (
    <Container className="!p-0">
      <div className="w-full max-w-2xl p-2 mx-auto rounded-2xl">
        {faqdata.map((item, index) => (
          <div key={item.question} className="mb-5">
            <Disclosure>
              {({ open }) => (
                <>
                  <DisclosureButton className="flex items-center justify-between w-full px-4 py-4 text-lg text-left text-gray-800 rounded-lg bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-red-100 focus-visible:ring-opacity-75 dark:bg-trueGray-800 dark:text-gray-200">
                    <span>{item.question}</span>
                    <ChevronUpIcon
                      className={`${
                        open ? "transform rotate-180" : ""
                      } w-5 h-5 text-red-500`}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-4 pt-4 pb-2 text-gray-500 dark:text-gray-300">
                    {item.answer}
                  </DisclosurePanel>
                </>
              )}
            </Disclosure>
          </div>
        ))}
      </div>
    </Container>
  );
}

const faqdata = [
  {
    question: 'What digital services does Piranha Studios provide?',
    answer: 'We specialize in creating tailored digital solutions including WordPress websites, mobile apps, SaaS platforms, AI chatbots, analytics dashboards, and custom software solutions. Our services are designed to support the full lifecycle of digital products from concept to deployment and ongoing support.'
  },
  {
    question: 'How does the consultation process work?',
    answer: 'Our consultation phase is free and aims to understand your needs and educate you on our services. It includes an initial meeting to discuss your requirements and an overview of our capabilities and previous work demos. Based on this, we provide a tailored proposal with estimated costs and a refined project scope.'
  },
  {
    question: 'Can you describe the different pricing packages?',
    answer: 'Piranha Studios offers several pricing tiers to cater to different client needs. These range from our Entry package at £400, suitable for startups, to our Enterprise package at £10,000+ for large-scale operations, including MVP delivery, user support, and extensive service hours.'
  },
  {
    question: 'What is the typical timeline for a project?',
    answer: 'Project timelines vary based on the chosen package: \n- Entry: 4 months MVP delivery \n- Basic: 2 months MVP delivery \n- Standard: 1 month MVP plus 3 months full product delivery \n- Enterprise: 1.5 months MVP plus up to 6 months full product delivery. These timelines ensure optimal development and deployment phases.'
  },
  {
    question: 'How does Piranha Studios engage with the community?',
    answer: 'We host a vibrant community on Discord and organize Tech Talk Tuesdays, monthly challenges, and workshops. This community platform is designed to facilitate networking, knowledge sharing, and direct interaction with our team, enhancing the collaborative experience.'
  },
  {
    question: 'What makes Piranha Studios unique in digital services?',
    answer: 'Our dual focus on delivering high-quality digital services and building a supportive community sets us apart. We offer solution templates for rapid deployment and a freelance community model for scalable, personalized services. This approach helps SMEs overcome barriers to accessing digital expertise.'
  },
  {
    question: 'How can I track the progress of my project?',
    answer: 'Clients can track project progress through our project management tools like ClickUp and direct communication channels. We ensure transparency and regular updates through these tools and our CRM system, maintaining open lines of communication throughout the project lifecycle.'
  },
];
