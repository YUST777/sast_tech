"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Facebook, Instagram, Linkedin } from "lucide-react";

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.18 8.18 0 004.76 1.52V6.84a4.84 4.84 0 01-1-.15z" />
    </svg>
);

const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

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
        title: "Services",
        href: "/services",
        links: [],
    },
    {
        title: "Company",
        href: "/company",
        links: [],
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
    { icon: <TikTokIcon className="size-5" />, href: "https://www.tiktok.com/@sast_tech", label: "TikTok" },
    { icon: <Facebook className="size-5" />, href: "https://www.facebook.com/profile.php?id=61588200480116", label: "Facebook" },
    { icon: <XIcon className="size-5" />, href: "https://x.com/sast_tech", label: "X (Twitter)" },
    { icon: <Instagram className="size-5" />, href: "https://www.instagram.com/sast.tech/", label: "Instagram" },
    { icon: <Linkedin className="size-5" />, href: "https://linkedin.com/company/sast-tech", label: "LinkedIn" },
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
