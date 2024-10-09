import Image from "next/image";
import {Container} from "@/components/Container";
import heroImg from "../../public/img/hero.png";
import {ArrowDown} from "@medusajs/icons";

export const Hero = () => {
    return (
        <>
            <Container className="flex flex-wrap ">
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

                        <div
                            className="flex flex-col items-start space-y-3 sm:space-x-4 sm:space-y-0 sm:items-center sm:flex-row">
                            <a
                                href="https://calendly.com/piranha-consultation/follow-up-meeting"
                                target="_blank"
                                rel="noopener"
                                className="px-8 py-4 text-lg font-medium text-center text-white bg-red-600 rounded-md ">
                                Bring your vision to life
                            </a>
                            <a
                                href="#benefits"
                                rel="noopener"
                                className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                                <ArrowDown/>
                                <span>Learn More</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center w-full lg:w-1/2">
                    <iframe
                        src="https://lottie.host/embed/7df4062f-b98a-4682-8843-ba12dea182ba/yzqTsY2u51.json"
                        className={"object-cover rounded-2xl"}
                        width="616"
                        height="617"
                        scrolling={"no"}
                        frameBorder="0"
                        allowFullScreen
                    ></iframe>
                </div>
            </Container>
            <Container>
                <div className="flex flex-col justify-center">
                    <div className="text-xl text-center text-gray-700 dark:text-white">
                        Delivering <span className="text-red-600">exceptional results</span> for select clients
                    </div>

                    <div className="flex flex-wrap justify-center gap-5 mt-10 md:justify-around">
                        <div className="pt-2 text-gray-400 dark:text-gray-400">
                            <img width="210" height={"33"} src={"/img/brands/skeendeep.png"} />
                        </div>
                        <div className="text-gray-400 dark:text-gray-400">
                            <img width="210" height={"33"} src={"/img/brands/elite-oils.png"}/>
                        </div>
                        <div className="text-gray-400 dark:text-gray-400">
                            <img width="210" height={"33"} src={"/img/brands/digital-cyber-plus.png"}/>
                        </div>
                        <div className="pt-1 text-gray-400 dark:text-gray-400">
                            <img width="210" height={"33"} src={"/img/brands/phc.png"}/>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
}
