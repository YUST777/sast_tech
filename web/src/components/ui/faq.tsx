"use client";

import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const faqs = [
    {
        value: "item-1",
        question: "How does the AI verify vulnerabilities?",
        answer: "Our AI agents safely attempt to exploit detected vulnerabilities in a controlled manner to confirm their existence, significantly reducing false positives compared to traditional scanners.",
    },
    {
        value: "item-2",
        question: "Is it safe to run on production environments?",
        answer: "Yes. You can configure safety levels. By default, the AI creates non-destructive proofs-of-concept (PoCs) that demonstrate impact without altering data or causing downtime.",
    },
    {
        value: "item-3",
        question: "Can I integrate this into my CI/CD pipeline?",
        answer: "Absolutely. We provide a CLI tool and GitHub Actions / GitLab CI integrations to trigger scans automatically on every pull request or deployment.",
    },
    {
        value: "item-4",
        question: "What compliance standards do you cover?",
        answer: "We generate reports mapped to SOC2, ISO 27001, HIPAA, and GDPR controls, helping you streamline your compliance audits.",
    },
    {
        value: "item-5",
        question: "Do you support API and Single Page Applications?",
        answer: "Yes, our crawler is designed for modern tech stacks. It can authenticate, navigate SPAs, and fuzz REST/GraphQL APIs effectively.",
    },
];

export function Faq() {
    return (
        <section id="faq" className="container mx-auto py-24 sm:py-32">
            <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
                Frequently Asked Questions
            </motion.h2>
            <div className="mx-auto max-w-3xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq) => (
                            <motion.div key={faq.value} variants={itemVariants}>
                                <AccordionItem value={faq.value}>
                                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                                    <AccordionContent>{faq.answer}</AccordionContent>
                                </AccordionItem>
                            </motion.div>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    );
}
