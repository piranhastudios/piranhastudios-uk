import Image from "next/image";
import { Container } from "@/components/Container";
import { ArrowDown } from "@medusajs/icons";
import Link from "next/link";

export const Hero = () => {
    return (
        <>
            <Container className="flex min-h-screen flex-wrap ">
                <div className="flex items-center w-full lg:w-1/2">
                    <div className="max-w-2xl mb-8">
                        <h1 className="text-4xl font-bold leading-snug tracking-tight text-gray-800 lg:text-4xl lg:leading-tight xl:text-6xl xl:leading-tight dark:text-white">
                            Transform Your Business with Digital Solutions Built for You.
                        </h1>
                        <p className="py-5 text-xl leading-normal text-gray-500 lg:text-xl xl:text-2xl dark:text-gray-300">
                            Piranha Studios help small and growing businesses create powerful digital
                            experiences—whether it&apos;s a beautifully branded website, a custom online store, or a
                            streamlined business platform. No jargon, no headaches. Just results.
                        </p>

                        <div className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
                            <a
                                href="https://calendly.com/piranha-consultation/follow-up-meeting"
                                target="_blank"
                                rel="noopener"
                                className="px-8 py-4 text-lg font-medium text-center text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">
                                Bring your vision to life
                            </a>
                            <a
                                href="#benefits"
                                rel="noopener"
                                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                <ArrowDown/>
                                <span>Learn More</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center w-full lg:w-1/2">
                    <iframe
                        src="https://lottie.host/embed/7df4062f-b98a-4682-8843-ba12dea182ba/yzqTsY2u51.json"
                        className="object-cover rounded-2xl"
                        width="616"
                        height="617"
                        scrolling="no"
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
            </Container>
            {/*
            TODO: Uncomment this section when we have more clients
            <Container>
                <div className="flex flex-col justify-center mb-16">
                    <div className="text-xl text-center text-gray-700 dark:text-white">
                        Delivering <span className="text-red-600">exceptional results</span> for select clients
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
                        {[
                            { title: "Skeendeep", src: "https://skeendeep.co.uk", description: "E-commerce platform for skincare products", image: "/img/portfolio/skeendeep.png" },
                            { title: "Premier Health Centres", src: "https://premierhealthcentrescameroon.com", description: "Healthcare services website", image: "/img/portfolio/premierhealthcentres.png" },
                        ].map((project, index) => (
                            <a href={project.src} target={"_blank"} key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    width={400}
                                    height={300}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{project.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </Container>*/}
        </>
    );
}