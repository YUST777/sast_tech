import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaTiktok } from "react-icons/fa"
import { Button } from "@/components/ui/button"

export default function CompanyPage() {
    const socialLinks = [
        { icon: <FaTiktok className="size-6" />, href: "https://www.tiktok.com/@sast_tech", label: "TikTok", name: "TikTok" },
        { icon: <FaFacebook className="size-6" />, href: "https://www.facebook.com/profile.php?id=61588200480116", label: "Facebook", name: "Facebook" },
        { icon: <FaTwitter className="size-6" />, href: "https://x.com/sast_tech", label: "X (Twitter)", name: "X (Twitter)" },
        { icon: <FaInstagram className="size-6" />, href: "https://www.instagram.com/sast.tech/", label: "Instagram", name: "Instagram" },
        { icon: <FaLinkedin className="size-6" />, href: "https://linkedin.com/company/sast-tech", label: "LinkedIn", name: "LinkedIn" },
    ]

    return (
        <main className="min-h-screen bg-background text-foreground relative">
            {/* Logo */}
            <Link href="/" className="absolute z-50 top-8 left-8 flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image
                    src="/apple-touch-icon.png"
                    alt="Sast Logo"
                    width={32}
                    height={32}
                    className="size-8"
                />
                <span className="text-xl font-bold tracking-tight">Sast</span>
            </Link>

            {/* Hero Section */}
            <div className="container mx-auto px-4 py-20 md:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                        About Sast
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                        Securing your digital frontier with advanced penetration testing and comprehensive vulnerability assessments.
                        At Sast, we are dedicated to providing top-tier security solutions to protect your business from evolving cyber threats.
                    </p>
                </div>

                {/* Social Links Section */}
                <div className="mt-20 mx-auto max-w-5xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Connect with us</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
                        {socialLinks.map((social, idx) => (
                            <Link
                                key={idx}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center space-x-4 p-6 w-full max-w-sm rounded-xl border bg-card hover:bg-accent/50 transition-colors"
                            >
                                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 text-primary transition-colors">
                                    {social.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{social.name}</h3>
                                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors flex items-center">
                                        Follow us <ArrowRight className="ml-1 size-3" />
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Return Button */}
            <div className="fixed bottom-8 left-8 z-50">
                <Button
                    asChild
                    variant="outline"
                    className="gap-2"
                >
                    <Link href="/">
                        <ArrowLeft className="size-4" />
                        Return Home
                    </Link>
                </Button>
            </div>
        </main>
    )
}
