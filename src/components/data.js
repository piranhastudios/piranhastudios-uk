import {
    FaceSmileIcon,
    ChartBarSquareIcon,
    CursorArrowRaysIcon,
    DevicePhoneMobileIcon,
    AdjustmentsHorizontalIcon,
    SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";
import {
    BugAntSolid,
    ChatBubbleLeftRight,
    CommandLineSolid,
    LightBulbSolid,
    Pencil,
    RocketLaunchSolid,
    SparklesSolid, Swatch
} from "@medusajs/icons";

const benefitOne = {
    title: "What makes us different?",
    desc: "Choose Piranha Studios for unparalleled digital expertise and personalized service. We don't just build websites—we craft digital experiences that drive growth. Our team combines technical prowess with business insight to deliver solutions that truly work for you.",
    image: <iframe width={521} height={521} style={{backgroundColor: "transparent"}} className={"object-cover rounded-2xl"}
                   src="https://lottie.host/embed/a45aecb6-8c8d-44af-b7a0-6e8d5f288ec8/huIqNpbmx7.json"></iframe>,
    bullets: [
        {
            title: "Expertise",
            desc: "Years of experience across various industries.",
            icon: <LightBulbSolid/>,
        },
        {
            title: "Customization",
            desc: " Tailored solutions that fit your specific needs.",
            icon: <Swatch/>,
        },
        {
            title: "Support",
            desc: "Ongoing assistance and updates to keep your digital assets running smoothly.",
            icon: <BugAntSolid/>,
        },
        {
            title: "Innovation",
            desc: "We stay ahead of the curve with the latest technologies and best practices.",
            icon: <SparklesSolid/>,
        },
    ],
};

const benefitTwo = {
    title: "Our Approach",
    desc: "Our approach blends listening, design, and development to create more than just products — we're your committed digital partner. With Piranha Studios, turn your vision into a results-driven online presence.",
    image: <iframe width={521} height={521} style={{backgroundColor: "transparent"}} className={"object-cover rounded-2xl"}
                   src="https://lottie.host/embed/5903e474-cb48-4877-abe5-a2ade8cddd05/ZeLNhobu0s.json"></iframe>,
    bullets: [
        {
            title: "Listen",
            desc: "First we aim to understand your pain points and what your barriers to growth are.",
            icon: <ChatBubbleLeftRight/>,
        },
        {
            title: "Design",
            desc: "We disign a solution to fit your needs.",
            icon: <Pencil/>,
        },
        {
            title: "Develop",
            desc: "Our specialists work tirelessly to bring your solution to life.",
            icon: <CommandLineSolid/>,
        },
        {
            title: "Deploy",
            desc: "Launch your solution and watch your business grow.",
            icon: <RocketLaunchSolid/>,
        },
    ],
};


export {benefitOne, benefitTwo};
