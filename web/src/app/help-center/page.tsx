import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { HeroSection } from "@/components/ui/hero-section-1" // Reusing navbar from here if needed, or just page content

export default function HelpCenterPage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            {/* Navigation placeholder or reuse existing nav if available globally */}
            <div className="container mx-auto px-4 py-20 md:py-32">
                <div className="mx-auto max-w-4xl text-center">
                    <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                        Help is here when you need it
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
                        Support is available seven days a week. Contact our team, get on-demand
                        articles, hire a Sast Tech Pro, or get help from the Community.
                    </p>
                </div>

                <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Card 1 */}
                    <Link href="/contact" className="group block space-y-3">
                        <h3 className="flex items-center text-lg font-bold group-hover:text-primary">
                            Contact support <ArrowRight className="ml-2 h-4 w-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Whether you're stuck or just have a question, reach out anytime. We're
                            here for you 7 days a week.
                        </p>
                    </Link>

                    {/* Card 2 */}
                    <Link href="/help" className="group block space-y-3">
                        <h3 className="flex items-center text-lg font-bold group-hover:text-primary">
                            Help center <ArrowRight className="ml-2 h-4 w-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Search more than 400 articles created to answer every Sast Tech question
                            you can think of, 24/7.
                        </p>
                    </Link>

                    {/* Card 3 */}
                    <Link href="/community" className="group block space-y-3">
                        <h3 className="flex items-center text-lg font-bold group-hover:text-primary">
                            Sast Community <ArrowRight className="ml-2 h-4 w-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Ask for help, read discussions to learn more about security, and get
                            ideas to grow your business.
                        </p>
                    </Link>

                    {/* Card 4 */}
                    <Link href="/pros" className="group block space-y-3">
                        <h3 className="flex items-center text-lg font-bold group-hover:text-primary">
                            Sast Tech Pros <ArrowRight className="ml-2 h-4 w-4" />
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Certified independent experts you can hire to build out your security
                            infrastructure and testing pipelines.
                        </p>
                    </Link>
                </div>
            </div>
        </main>
    )
}
