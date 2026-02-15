"use client";

import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaTiktok } from "react-icons/fa";
import { ChevronDown } from "lucide-react";

interface Footer7Props {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    sections?: Array<{
        title: string;
        href?: string;
        links: Array<{ name: string; href: string }>;
    }>;
    description?: string;
    socialLinks?: Array<{
        icon: React.ReactElement;
        href: string;
        label: string;
    }>;
    copyright?: string;
    legalLinks?: Array<{
        name: string;
        href: string;
    }>;
}

const defaultSections = [
    {
        title: "Company",
        href: "/company",
        links: [],
    },
    {
        title: "Services",
        href: "/services",
        links: [
            { name: "AI Penetration Testing", href: "/services#ai-pentest" },
            { name: "Vulnerability Assessment", href: "/services#vulnerability-assessment" },
            { name: "Threat Intelligence", href: "/services#threat-intelligence" },
        ],
    },
    {
        title: "Help Center",
        links: [
            { name: "Contact Support", href: "/help-center#contact" },
            { name: "Help Center", href: "/help-center" },
            { name: "Sast Community", href: "/help-center#community" },
            { name: "Sast Tech Pros", href: "/help-center#tech-pros" },
        ],
    },
];

const defaultSocialLinks = [
    { icon: <FaTiktok className="size-5" />, href: "https://www.tiktok.com/@sast_tech", label: "TikTok" },
    { icon: <FaFacebook className="size-5" />, href: "https://www.facebook.com/profile.php?id=61588200480116", label: "Facebook" },
    { icon: <FaTwitter className="size-5" />, href: "https://x.com/sast_tech", label: "X (Twitter)" },
    { icon: <FaInstagram className="size-5" />, href: "https://www.instagram.com/sast.tech/", label: "Instagram" },
    { icon: <FaLinkedin className="size-5" />, href: "https://linkedin.com/company/sast-tech", label: "LinkedIn" },
];

const defaultLegalLinks = [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Cookie Policy", href: "#" },
];

export const Footer7 = ({
    logo = {
        url: "/",
        src: "https://www.shadcnblocks.com/images/block/logos/shadcnblockscom-icon.svg",
        alt: "Sast Logo",
        title: "Sast",
    },
    sections = defaultSections,
    description = "Securing your digital frontier with advanced penetration testing and comprehensive vulnerability assessments.",
    socialLinks = defaultSocialLinks,
    copyright = "© 2026 Sast. All rights reserved.",
    legalLinks = defaultLegalLinks,
}: Footer7Props) => {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);

    return (
        <section className="pt-16 pb-8 bg-background border-t">
            <div className="container mx-auto px-4">
                <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
                    <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
                        {/* Logo */}
                        <div className="flex items-center gap-2 lg:justify-start">
                            <a href={logo.url} className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold tracking-tight">{logo.title}</h2>
                            </a>
                        </div>
                        <p className="max-w-[70%] text-sm text-muted-foreground">
                            {description}
                        </p>
                        <ul className="flex items-center space-x-6 text-muted-foreground">
                            {socialLinks.map((social, idx) => (
                                <li key={idx} className="font-medium hover:text-primary transition-colors">
                                    <a href={social.href} aria-label={social.label}>
                                        {social.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-10">
                        {sections.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                {section.links.length > 0 ? (
                                    <div
                                        className="relative"
                                        onMouseEnter={() => setHoveredSection(section.title)}
                                        onMouseLeave={() => setHoveredSection(null)}
                                    >
                                        <div className="flex items-center gap-1 mb-4 cursor-pointer group">
                                            <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                                                {section.title}
                                            </h3>
                                            <ChevronDown
                                                className={`size-4 text-muted-foreground transition-transform duration-200 ${
                                                    hoveredSection === section.title ? "rotate-180" : ""
                                                }`}
                                            />
                                        </div>
                                        <div
                                            className={`absolute top-full left-0 mt-0 min-w-[200px] z-50 rounded-lg border bg-background shadow-lg max-h-48 overflow-y-auto transition-all duration-200 ${
                                                hoveredSection === section.title
                                                    ? "opacity-100 translate-y-0 pointer-events-auto"
                                                    : "opacity-0 -translate-y-1 pointer-events-none"
                                            }`}
                                        >
                                            <div className="py-1">
                                                {section.links.map((link, linkIdx) => (
                                                    <a
                                                        key={linkIdx}
                                                        href={link.href}
                                                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
                                                    >
                                                        {link.name}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : section.href ? (
                                    <a href={section.href} className="group flex items-center mb-4">
                                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">{section.title}</h3>
                                    </a>
                                ) : (
                                    <h3 className="mb-4 font-bold text-base">{section.title}</h3>
                                )}
                                {section.links.length === 0 && (
                                    <ul className="space-y-3 text-sm text-muted-foreground">
                                        {section.links.map((link, linkIdx) => (
                                            <li
                                                key={linkIdx}
                                                className="font-medium hover:text-primary transition-colors"
                                            >
                                                <a href={link.href}>{link.name}</a>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 flex flex-col justify-between gap-4 border-t pt-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
                    <p className="order-2 lg:order-1">{copyright}</p>
                    <ul className="order-1 flex flex-col gap-4 md:order-2 md:flex-row">
                        {legalLinks.map((link, idx) => (
                            <li key={idx} className="hover:text-primary transition-colors">
                                <a href={link.href}> {link.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
