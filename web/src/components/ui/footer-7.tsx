import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaTiktok } from "react-icons/fa";

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
        href: "/help-center",
        links: [],
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
    return (
        <section className="pt-16 pb-8 bg-background border-t">
            <div className="container mx-auto px-4">
                <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
                    <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
                        {/* Logo */}
                        <div className="flex items-center gap-2 lg:justify-start">
                            <a href={logo.url} className="flex items-center gap-2">
                                {/* Placeholder for logo icon if src is not replaced yet, or keep text dominant */}
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
                                {section.href ? (
                                    <a href={section.href} className="group flex items-center mb-4">
                                        <h3 className="font-bold text-base group-hover:text-primary transition-colors">{section.title}</h3>
                                    </a>
                                ) : (
                                    <h3 className="mb-4 font-bold text-base">{section.title}</h3>
                                )}
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
