"use client";

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

export default function Pricing() {
    const sectionRef = useRef(null)

    return (
        <section ref={sectionRef} id="pricing" className="py-16 md:py-32">
            {/* SVG pixelation filter */}
            <svg className="absolute size-0" aria-hidden="true">
                <filter id="pixelate">
                    <feFlood x="0" y="0" height="2" width="2" />
                    <feComposite width="4" height="4" />
                    <feTile result="a" />
                    <feComposite in="SourceGraphic" in2="a" operator="in" />
                    <feMorphology operator="dilate" radius="2" />
                </filter>
            </svg>
            <div className="mx-auto max-w-5xl px-6">
                <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <h2 className="text-center text-4xl font-semibold lg:text-5xl">Autonomous AI Pentesting</h2>
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
                        <div
                            style={{ filter: 'url(#pixelate)' }}
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
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
