"use client";

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export default function Pricing() {
    const sectionRef = useRef(null)
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
    const [hasStarted, setHasStarted] = useState(false)

    // Using 10000 as internal value to allow "decrease by 100" logic if we were stepping, 
    // but mapping it to 0-100 for display (10000/100 = 100).
    const count = useMotionValue(10000)
    const blur = useTransform(count, [10000, 0], [6, 0])
    const opacity = useTransform(count, [10000, 0], [1, 0])
    const roundedCount = useTransform(count, (latest) => Math.round(latest / 100))

    useEffect(() => {
        if (isInView && !hasStarted) {
            setHasStarted(true)

            const runAnimation = async () => {
                // Repeat 3 times
                for (let i = 0; i < 3; i++) {
                    count.set(10000) // Reset to start
                    await animate(count, 0, {
                        duration: 2,
                        ease: "linear",
                    })
                    // Small pause between cycles
                    if (i < 2) await new Promise(r => setTimeout(r, 200))
                }
                // Ensure it stays at 0 (unblurred) after 3rd time
                count.set(0)
            }

            runAnimation()
        }
    }, [isInView, count, hasStarted])

    return (
        <section ref={sectionRef} id="pricing" className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h1 className="text-center text-4xl font-semibold lg:text-5xl">Autonomous AI Pentesting</h1>
                    <p>Scale your security testing with AI-driven vulnerability detection and automated exploitation validation.</p>
                </div>

                <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
                    <div className="rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
                        <div className="space-y-4">
                            <div>
                                <h2 className="font-medium">Community</h2>
                                <span className="my-3 block text-2xl font-semibold">$0 / mo</span>
                                <p className="text-muted-foreground text-sm">For individuals & hobbyists</p>
                            </div>

                            <Button
                                asChild
                                variant="outline"
                                className="w-full">
                                <Link href="/waitlist">Start Scanning</Link>
                            </Button>

                            <hr className="border-dashed" />

                            <ul className="list-outside space-y-3 text-sm">
                                {['Basic Asset Discovery', 'OWASP Top 10 Scanning', 'Community Support', '1 Concurrent Scan'].map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center gap-2">
                                        <Check className="size-3" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="relative dark:bg-muted rounded-(--radius) border shadow-lg shadow-gray-950/5 md:col-span-3 dark:[--color-muted:var(--color-zinc-900)] overflow-hidden">
                        <motion.div
                            style={{ filter: useTransform(blur, (v) => `blur(${v}px)`) }}
                            className="p-6 lg:p-10 select-none pointer-events-none"
                        >
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="font-medium">Pro Pentester</h2>
                                        <span className="my-3 block text-2xl font-semibold">$49 / mo</span>
                                        <p className="text-muted-foreground text-sm">For professional security teams</p>
                                    </div>

                                    <Button
                                        asChild
                                        className="w-full">
                                        <Link href="/waitlist">Upgrade to Pro</Link>
                                    </Button>
                                </div>

                                <div>
                                    <div className="text-sm font-medium">Everything in Community plus :</div>

                                    <ul className="mt-4 list-outside space-y-3 text-sm">
                                        {['AI-Driven Exploit Verification', 'API & Cloud Security Testing', 'Automated Compliance Reports (PDF/CSV)', 'CI/CD Pipeline Integration', 'Zero-False-Positive Guarantee', 'Priority Email Support', 'Unlimited Concurrent Scans', 'JIRA/Slack Integration'].map((item, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2">
                                                <Check className="size-3" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            style={{ opacity }}
                            className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-[2px]"
                        >
                            <span className="flex items-center text-6xl font-bold tracking-tight text-white md:text-7xl">
                                <motion.span>{roundedCount}</motion.span>K
                            </span>
                            <span className="mt-2 text-sm text-white/90 font-medium">waitlist goal to unlock</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
