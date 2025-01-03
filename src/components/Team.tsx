import React from "react";
import Image from "next/image";
import {Container} from "@/components/Container";
import {FaLinkedin, FaGithub, FaGlobe} from "react-icons/fa";
import {useTheme} from "next-themes";
import SocialIcon from "@/components/SocialIcons";

const teamMembers = [
    {
        id: 1,
        name: 'Jake Ngatchu',
        role: 'Managing Director',
        imageUrl: '/img/team/jake.jpeg',
        bio: "Jake's technical and managerial experience with SMEs, start-ups, and large corporations drives our company's success.",
        links: [
            {type: "linkedin", link: "https://linkedin.com/in/jake-ngatchu-9a7868115/"},
            {type: "github", link: "https://github.com/greatgatchby/"},
            {type: "website", link: "https://linkedin.com/in/jake-ngatchu-9a7868115/"},
        ]
    },
    {
        id: 3,
        name: 'Ells Turner',
        role: 'Compliance Director',
        imageUrl: '/img/team/placeholder.jpg',
        bio: "Ells brings extensive legal and corporate governance experience, ensuring high standards of compliance and integrity.",
        links: []
    },
    {
        id: 4,
        name: 'Eddy Ankrett',
        role: 'Non-Executive Director',
        imageUrl: '/img/team/eddy.jpeg',
        bio: "Eddy's wealth of experience guides our directorate team in making sound business decisions.",
        links: [
            {type: "linkedin", link: "https://www.linkedin.com/in/eddyankrett/"},
            {type: "website", link: "https://www.eddyankrett.co.uk"},
        ]
    },
    {
        id: 5,
        name: 'Niamh Moran',
        role: 'Marketing Director',
        imageUrl: '/img/team/niamh.png',
        bio: 'Niamh, our communications maven, crafts our digital story to resonate with our community.',
        links: [
            {type: "linkedin", link: "https://www.linkedin.com/in/niamh-c-moran/"},
            {type: "website", link: "https://nimomedia.com"},
        ]
    },
    {
        id: 7,
        name: 'Navid Nami',
        role: 'Software Developer',
        imageUrl: '/img/team/placeholder.jpg',
        bio: "Navid is a MedusaJS specialist, known for his contributions and innovative plugins in the community.",
        links: []
    },
    {
        id: 8,
        name: 'Kiran Kotval',
        role: 'Designer',
        imageUrl: '/img/team/kiran.jpeg',
        bio: 'Kiran brings creative flair to our projects, ensuring visually appealing and user-friendly designs.',
        links: []
    },
];




const TeamMember = ({member}: { member: any }) => (
    <div className="flex flex-col items-center p-6 space-y-6 rounded-lg bg-gray-100 dark:bg-trueGray-800">
        <img
            src={member.imageUrl}
            alt={member.name}
            width={150}
            height={150}
            className="rounded-full"
        />
        <div className="text-center">
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-red-600 dark:text-red-400">{member.role}</p>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400">{member.bio}</p>
        <div className="flex space-x-4">
            {member.links.map((link: any, index: number) => (
                <a key={index} href={link.link} target="_blank" rel="noopener noreferrer"
                   className="text-2xl hover:text-red-600">
                    <SocialIcon type={link.type}/>
                </a>
            ))}
        </div>
    </div>
);

export const Team = () => {
    return (
        <Container>
            <h2 className="text-4xl font-bold text-center mb-12">Our Team</h2>
            <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-4">
                {teamMembers.map(member => (
                    <TeamMember key={member.id} member={member}/>
                ))}
            </div>
        </Container>
    );
};