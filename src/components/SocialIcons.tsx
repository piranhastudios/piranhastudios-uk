'use client'
import {useTheme} from "next-themes";
import {FaGithub, FaGlobe, FaLinkedin} from "react-icons/fa";
import React from "react";

const SocialIcon = ({type}: { type: string }) => {
    const {theme, setTheme} = useTheme();
    switch (type) {
        case "linkedin":
            return <FaLinkedin className={theme && theme === 'dark' ? "text-white" : "text-black"}/>;
        case "github":
            return <FaGithub className={theme && theme === 'dark' ? "text-white" : "text-black"}/>;
        case "website":
            return <FaGlobe className={theme && theme === 'dark' ? "text-white" : "text-black"}/>;
        default:
            return null;
    }
};

export default SocialIcon