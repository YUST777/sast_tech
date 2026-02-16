'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Menu, Star, X } from 'lucide-react'
import { useLenis } from 'lenis/react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { AppShowcase } from '@/components/ui/app-showcase'
import BentoGrid from '@/components/ui/bento'
import { cn } from '@/lib/utils'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none isolate overflow-hidden">
                    <div className="animate-drift w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(217,91%,60%,.12)_0,hsla(0,0%,55%,.06)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="animate-drift-slow h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(217,91%,60%,.08)_0,hsla(0,0%,45%,.04)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="animate-drift h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.1)_0,hsla(0,0%,45%,.04)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="/waitlist"
                                        className="hover:bg-background dark:hover:border-t-blue-500/20 bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">Now in Early Access — Join the Waitlist</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>

                                    <h1
                                        className="mt-8 max-w-4xl mx-auto text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                        Coded fast<br />Secured faster
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                        Code is generated instantly. Security is stuck in manual.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[14px] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="/download">
                                                <span className="text-nowrap">Download</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <Link href="#pricing">
                                            <span className="text-nowrap">View Pricing</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <AppShowcase />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <Link
                                href="/"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span>Powered by</span>

                                <ChevronRight className="ml-1 inline-block size-3" />
                            </Link>
                        </div>
                        <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                            <div className="flex items-center justify-center">
                                <GDGDeltaLogo className="h-6 w-auto" />
                            </div>
                            <div className="flex items-center justify-center">
                                <ToolLogo name="Nuclei" icon="nuclei" />
                            </div>
                            <div className="flex items-center justify-center">
                                <ToolLogo name="OWASP ZAP" icon="zap" />
                            </div>
                            <div className="flex items-center justify-center">
                                <ToolLogo name="Playwright" icon="playwright" />
                            </div>
                            <div className="flex items-center justify-center">
                                <ToolLogo name="Python" icon="python" />
                            </div>
                            <div className="flex items-center justify-center">
                                <ToolLogo name="FastAPI" icon="fastapi" />
                            </div>
                            <div className="flex items-center justify-center">
                                <ToolLogo name="Anthropic" icon="anthropic" />
                            </div>
                            <div className="flex items-center justify-center">
                                <ToolLogo name="Next.js" icon="nextjs" />
                            </div>
                        </div>
                    </div>
                </section>
                <section id="features" className="bg-background pb-16 pt-16 md:pb-32">
                    <BentoGrid />
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Download', href: '/download' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const lenis = useLenis()

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault()
            setMenuState(false)
            lenis?.scrollTo(href, { offset: -80 })
        } else {
            setMenuState(false)
        }
    }

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            onClick={(e) => handleAnchorClick(e, item.href)}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                onClick={(e) => handleAnchorClick(e, item.href)}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:items-center sm:gap-3 sm:space-y-0 md:w-fit">
                                <GitHubStars />
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="/download">
                                        <span>Download</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link
                                        href="#pricing"
                                        onClick={(e) => handleAnchorClick(e, '#pricing')}>
                                        <span>View Pricing</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link href="/download">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </nav>
        </header >
    )
}

const GitHubStars = () => {
    const [stars, setStars] = React.useState<number | null>(null)

    React.useEffect(() => {
        fetch('https://api.github.com/repos/YUST777/sast_tech')
            .then((res) => res.json())
            .then((data) => {
                if (typeof data.stargazers_count === 'number') {
                    setStars(data.stargazers_count)
                }
            })
            .catch(() => { })
    }, [])

    return (
        <Link
            href="https://github.com/YUST777/sast_tech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/10 hover:text-white">
            <Star className="size-3.5" />
            <span>Star</span>
            {stars !== null && (
                <>
                    <span className="h-3.5 w-px bg-white/20" />
                    <span className="text-xs font-medium">{stars}</span>
                </>
            )}
        </Link>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Image
                src="/apple-touch-icon.png"
                alt="Sast Logo"
                width={28}
                height={28}
                className="size-7"
            />
            <span className="text-lg font-bold tracking-tight">Sast</span>
        </div>
    )
}

const GDGDeltaLogo = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 500 220" xmlns="http://www.w3.org/2000/svg">
        <rect x="110" y="55" width="90" height="30" rx="15" fill="#EA4335" transform="rotate(-35 155 70)" />
        <rect x="110" y="95" width="90" height="30" rx="15" fill="#4285F4" transform="rotate(35 155 110)" />
        <rect x="260" y="55" width="90" height="30" rx="15" fill="#34A853" transform="rotate(35 305 70)" />
        <rect x="260" y="95" width="90" height="30" rx="15" fill="#FBBC05" transform="rotate(-35 305 110)" />
        <text x="50%" y="200" fontFamily="Arial, Helvetica, sans-serif" fontSize="36" fill="currentColor" textAnchor="middle">GDG Delta</text>
    </svg>
)

const toolIcons: Record<string, React.ReactNode> = {
    nuclei: (
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="8" />
            <line x1="12" y1="16" x2="12" y2="22" />
            <line x1="2" y1="12" x2="8" y2="12" />
            <line x1="16" y1="12" x2="22" y2="12" />
        </svg>
    ),
    zap: (
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    playwright: (
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect x="3" y="4" width="18" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 18v3" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
        </svg>
    ),
    python: (
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 2C6.5 2 6 4 6 5.5V8h6v1H5.5C3.5 9 2 10.5 2 13s1.5 4 3.5 4H8v-2.5C8 12.5 9.5 11 11.5 11h5c1.5 0 2.5-1 2.5-2.5v-5C19 2 17 2 12 2z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="5.5" r="0.8" fill="currentColor" />
            <path d="M12 22c5.5 0 6-2 6-3.5V16h-6v-1h6.5c2 0 3.5-1.5 3.5-4s-1.5-4-3.5-4H16v2.5c0 2-1.5 3.5-3.5 3.5h-5C6 13 5 14 5 15.5v5C5 22 7 22 12 22z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="15" cy="18.5" r="0.8" fill="currentColor" />
        </svg>
    ),
    fastapi: (
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ),
    anthropic: (
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path d="M12 3L2 21h20L12 3z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 10v5" strokeLinecap="round" />
            <circle cx="12" cy="17.5" r="0.5" fill="currentColor" />
        </svg>
    ),
    nextjs: (
        <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="10" />
            <path d="M7 16V8l10 12" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="17" y1="8" x2="17" y2="12" strokeLinecap="round" />
        </svg>
    ),
}

const ToolLogo = ({ name, icon }: { name: string; icon: string }) => (
    <div className="flex items-center gap-2 text-white/60">
        {toolIcons[icon]}
        <span className="text-sm font-medium tracking-tight whitespace-nowrap">{name}</span>
    </div>
)
