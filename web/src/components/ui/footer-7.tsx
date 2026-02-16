import Link from "next/link";
import Image from "next/image";
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

const sections = [
    {
        title: "Product",
        links: [
            { name: "Features", href: "/#features" },
            { name: "Pricing", href: "/#pricing" },
            { name: "FAQ", href: "/#faq" },
            { name: "Download", href: "/download" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "About", href: "/company" },
            { name: "Download", href: "/download" },
        ],
    },
    {
        title: "Support",
        links: [
            { name: "Help Center", href: "/help-center" },
            { name: "Contact Support", href: "/help-center#contact" },
            { name: "Community", href: "/help-center#community" },
        ],
    },
];

const socialLinks = [
    { icon: TikTokIcon, href: "https://www.tiktok.com/@sast_tech", label: "TikTok" },
    { icon: Facebook, href: "https://www.facebook.com/profile.php?id=61588200480116", label: "Facebook" },
    { icon: XIcon, href: "https://x.com/sast_tech", label: "X (Twitter)" },
    { icon: Instagram, href: "https://www.instagram.com/sast.tech/", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/sast-tech", label: "LinkedIn" },
];

const legalLinks = [
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Cookie Policy", href: "#" },
];

export const Footer7 = () => {
    return (
        <section className="pt-16 pb-8 bg-background border-t">
            <div className="container mx-auto px-4">
                <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
                    <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/apple-touch-icon.png"
                                alt="Sast Logo"
                                width={32}
                                height={32}
                                className="size-8"
                            />
                            <span className="text-2xl font-bold tracking-tight">Sast</span>
                        </Link>
                        <p className="max-w-[70%] text-sm text-muted-foreground">
                            Securing your digital frontier with advanced penetration testing and comprehensive vulnerability assessments.
                        </p>
                        <ul className="flex items-center space-x-6 text-muted-foreground">
                            {socialLinks.map((social, idx) => (
                                <li key={idx} className="hover:text-primary transition-colors">
                                    <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}>
                                        <social.icon className="size-5" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid w-full gap-6 md:grid-cols-3 lg:gap-10">
                        {sections.map((section) => (
                            <div key={section.title}>
                                <h3 className="mb-4 font-bold text-base">{section.title}</h3>
                                <ul className="space-y-3 text-sm text-muted-foreground">
                                    {section.links.map((link) => (
                                        <li key={link.name} className="hover:text-primary transition-colors">
                                            <Link href={link.href}>{link.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-12 flex flex-col justify-between gap-4 border-t pt-8 text-xs font-medium text-muted-foreground md:flex-row md:items-center md:text-left">
                    <p className="order-2 lg:order-1">&copy; {new Date().getFullYear()} Sast. All rights reserved.</p>
                    <ul className="order-1 flex flex-col gap-4 md:order-2 md:flex-row">
                        {legalLinks.map((link) => (
                            <li key={link.name} className="hover:text-primary transition-colors">
                                <Link href={link.href}>{link.name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
