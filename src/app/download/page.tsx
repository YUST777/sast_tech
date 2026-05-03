import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Footer7 } from "@/components/ui/footer-7"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Download",
    description:
        "Download sast — the autonomous AI cybersecurity agent. Available for macOS, Linux, and Windows.",
    openGraph: {
        title: "Download sast — Autonomous AI Security Agent",
        description:
            "Get sast for your platform. Autonomous vulnerability scanning, exploit verification, and automated patching.",
        url: "https://sast.tech/download",
    },
    alternates: {
        canonical: "https://sast.tech/download",
    },
}

const platforms = [
    {
        name: "Windows",
        arch: "x86_64",
        icon: (
            <svg className="size-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
            </svg>
        ),
        command: "winget install sast-tech.sast",
        wingetAvailable: false,
        installerHref: "/api/installer/windows",
    },
]

export default function DownloadPage() {
    return (
        <>
            <main className="min-h-screen bg-background">
                {/* Nav */}
                <nav className="fixed top-0 z-20 w-full border-b border-white/5 bg-background/80 backdrop-blur-lg">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/apple-touch-icon.png"
                                alt="Sast Logo"
                                width={28}
                                height={28}
                                className="size-7"
                            />
                            <span className="text-lg font-bold tracking-tight">Sast</span>
                        </Link>
                        <Button asChild variant="ghost" size="sm">
                            <Link href="/">
                                <ArrowLeft className="mr-2 size-4" />
                                Back
                            </Link>
                        </Button>
                    </div>
                </nav>

                {/* Hero */}
                <section className="pt-32 pb-16 md:pt-40 md:pb-24">
                    <div className="mx-auto max-w-3xl px-6 text-center">
                        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                            Download sast
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Install the autonomous AI security agent on your platform.
                            <br className="hidden sm:block" />
                            Scan, detect, and fix vulnerabilities from your terminal.
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-muted-foreground">
                            <span className="relative flex size-2">
                                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                            </span>
                            Windows installer available below
                        </div>
                    </div>
                </section>

                {/* Platform cards */}
                <section className="pb-16 md:pb-24">
                    <div className="mx-auto max-w-xl px-6">
                        {platforms.map((platform) => (
                            <div
                                key={platform.name}
                                className="group relative flex flex-col rounded-xl border border-white/10 bg-white/[.02] p-6 transition-colors hover:border-white/20 hover:bg-white/[.04]"
                            >
                                <div className="mb-4 text-white/60">{platform.icon}</div>
                                <h2 className="text-xl font-semibold">{platform.name}</h2>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {platform.arch}
                                </p>

                                <div
                                    className={`mt-6 flex-1 ${!platform.wingetAvailable ? "opacity-50" : ""}`}
                                    aria-hidden={!platform.wingetAvailable}
                                >
                                    <p className="mb-2 text-xs text-muted-foreground">
                                        {platform.wingetAvailable
                                            ? "Or install with winget"
                                            : "Winget (coming soon)"}
                                    </p>
                                    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white/70">
                                        <Terminal className="size-4 shrink-0 text-white/40" />
                                        <code className="whitespace-pre overflow-x-auto scrollbar-hide">{platform.command}</code>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <Button asChild className="w-full">
                                        <Link href={platform.installerHref} prefetch={false}>
                                            Download installer (.exe)
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Requirements */}
                <section className="border-t border-white/5 py-16 md:py-24">
                    <div className="mx-auto max-w-3xl px-6">
                        <h2 className="text-2xl font-semibold">System Requirements</h2>
                        <div className="mt-8 grid gap-6 sm:grid-cols-2">
                            <div>
                                <h3 className="text-sm font-medium text-white/80">Minimum</h3>
                                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    <li>4 GB RAM</li>
                                    <li>2 CPU cores</li>
                                    <li>1 GB free disk space</li>
                                    <li>Internet connection</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-white/80">Recommended</h3>
                                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    <li>8 GB RAM</li>
                                    <li>4 CPU cores</li>
                                    <li>5 GB free disk space</li>
                                    <li>Docker installed</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer7 />
        </>
    )
}
