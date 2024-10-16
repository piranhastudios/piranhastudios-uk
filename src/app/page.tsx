import {Container} from "@/components/Container";
import {Hero} from "@/components/Hero";
import {SectionTitle} from "@/components/SectionTitle";
import {Benefits} from "@/components/Benefits";
import {Video} from "@/components/Video";
import {Testimonials} from "@/components/Testimonials";
import {Faq} from "@/components/Faq";
import {Cta} from "@/components/Cta";

import {benefitOne, benefitTwo} from "@/components/data";

export default function Home() {
    return (
        <Container>
            <Hero/>
            <span id={"benefits"}></span>
            <SectionTitle
                preTitle="Piranha Studios Benefits"
                title=" Why choose us?"
            >
                Choose Piranha Studios for digital solutions that propel your business forward. We blend technical
                expertise with business acumen to deliver custom websites, e-commerce platforms, and digital tools
                tailored to your unique needs.
            </SectionTitle>

            <Benefits data={benefitOne}/>
            <Benefits imgPos="right" data={benefitTwo}/>

            <SectionTitle
                preTitle="Our Process"
                title="How we deliver your vision"
            >
                At Piranha Studios, we&apos;re more than just developers—we&apos;re your digital partners. Our team of
                experts
                combines technical prowess with business acumen to deliver solutions that not only look great but drive
                real results for your business.
            </SectionTitle>

            <Video/>

            <SectionTitle
                preTitle="Testimonials"
                title="Here's what our customers said"
            >
                We empower businesses across diverse industries to revolutionize their technological approach. From
                healthcare to industrial retail and restaurants, our tailored solutions drive innovation and efficiency,
                helping our clients leverage technology to transform their operations and achieve remarkable growth.
            </SectionTitle>

            <Testimonials/>

            <SectionTitle preTitle="FAQ" title="Frequently Asked Questions">
                Answers to some of the common questions asked by our customers.
            </SectionTitle>

            <Faq/>
            <Cta/>
        </Container>
    );
}
