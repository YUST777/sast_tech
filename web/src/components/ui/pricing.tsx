import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import Link from 'next/link'

export default function Pricing() {
    return (
        <section id="pricing" className="py-16 md:py-32">
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

                    <div className="dark:bg-muted rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]">
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
        </section>
    )
}
