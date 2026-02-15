import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function Faq() {
    return (
        <section id="faq" className="container mx-auto py-24 sm:py-32">
            <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Frequently Asked Questions
            </h2>
            <div className="mx-auto max-w-3xl">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>How does the AI verify vulnerabilities?</AccordionTrigger>
                        <AccordionContent>
                            Our AI agents safely attempt to exploit detected vulnerabilities in a controlled manner to confirm their existence, significantly reducing false positives compared to traditional scanners.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>Is it safe to run on production environments?</AccordionTrigger>
                        <AccordionContent>
                            Yes. You can configure safety levels. By default, the AI creates non-destructive proofs-of-concept (PoCs) that demonstrate impact without altering data or causing downtime.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>Can I integrate this into my CI/CD pipeline?</AccordionTrigger>
                        <AccordionContent>
                            Absolutely. We provide a CLI tool and GitHub Actions / GitLab CI integrations to trigger scans automatically on every pull request or deployment.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>What compliance standards do you cover?</AccordionTrigger>
                        <AccordionContent>
                            We generate reports mapped to SOC2, ISO 27001, HIPAA, and GDPR controls, helping you streamline your compliance audits.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>Do you support API and Single Page Applications?</AccordionTrigger>
                        <AccordionContent>
                            Yes, our crawler is designed for modern tech stacks. It can authenticate, navigate SPAs, and fuzz REST/GraphQL APIs effectively.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </section>
    )
}
