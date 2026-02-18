"use client"

import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function BentoGrid() {
  return (
    <div className="container mx-auto flex flex-col px-4 sm:p-10">
      <h1 className="font-geistMono tracking-tight text-3xl md:text-5xl">
        Security
      </h1>
      <p className="max-w-3xl text-2xl/8 font-medium tracking-tight mt-2 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
        Autonomous protection that never sleeps.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
        <BentoCard
          eyebrow="Insight"
          title="Get perfect clarity"
          description="sast scans every line of your codebase in real time — surfacing vulnerabilities, misconfigurations, and exposed secrets before they ever reach production."
          graphic={
            <div className="absolute inset-0 bg-[url(https://framerusercontent.com/images/ghyfFEStl6BNusZl0ZQd5r7JpM.png)] bg-cover" />
          }
          className="max-lg:rounded-t-4xl lg:col-span-3 lg:rounded-tl-4xl"
        />
        <BentoCard
          eyebrow="Analysis"
          title="Understand every threat"
          description="Prioritized findings with full context — severity, exploit path, and blast radius — so your team fixes what actually matters first."
          graphic={
            <div className="absolute inset-0 bg-[url(https://framerusercontent.com/images/7CJtT0Pu3w1vNADktNltoMFC9J4.png)] bg-cover" />
          }
          className="lg:col-span-3 lg:rounded-tr-4xl"
        />
        <BentoCard
          eyebrow="Speed"
          title="Built for velocity"
          description="AI-generated patches applied in seconds, not sprints. Ship fast without sacrificing security posture."
          graphic={
            <div className="absolute inset-0 max-sm:bg-center sm:-top-20 sm:-left-60 bg-[url(https://framerusercontent.com/images/gR21e8Wh6l3pU6CciDrqt8wjHM.png)] bg-contain bg-no-repeat bg-black" />
          }
          className="lg:col-span-2 lg:rounded-bl-4xl"
        />
        <BentoCard
          eyebrow="Source"
          title="Total coverage"
          description="From dependencies to infrastructure-as-code — sast covers your entire attack surface across every repository."
          graphic={
            <div className="absolute inset-0 bg-[url(https://framerusercontent.com/images/PTO3RQ3S65zfZRFEGZGpiOom6aQ.png)] bg-contain bg-no-repeat" />
          }
          className="lg:col-span-2"
        />
        <BentoCard
          eyebrow="Limitless"
          title="Scale without limits"
          description="From a solo developer to a thousand-engineer org — sast adapts to your codebase size and complexity automatically."
          graphic={
            <div className="absolute inset-0 max-sm:bg-center sm:-top-44 sm:-left-60 bg-[url(https://framerusercontent.com/images/h496iPSwtSnGZwpJyErl6cLWdtE.png)] bg-contain bg-no-repeat" />
          }
          className="max-lg:rounded-b-4xl lg:col-span-2 lg:rounded-br-4xl"
        />
      </div>
    </div>
  )
}

export function BentoCard({
  className = "",
  eyebrow,
  title,
  description,
  graphic,
}: {
  className?: string
  eyebrow: React.ReactNode
  title: React.ReactNode
  description: React.ReactNode
  graphic?: React.ReactNode
}) {
  return (
    <motion.div
      initial="idle"
      whileHover="active"
      variants={{ idle: {}, active: {} }}
      className={cn(
        className,
        "group relative flex flex-col overflow-hidden rounded-lg",
        "bg-black dark:bg-transparent transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#8686f01f_inset] shadow-sm ring-1 ring-white/10",
      )}
    >
      <div className="relative h-[29rem] shrink-0">
        {graphic}
      </div>
      <div className="relative p-10 z-20 isolate mt-[-110px] h-[14rem] backdrop-blur-xl text-white">
        <h1>{eyebrow}</h1>
        <p className="mt-1 text-2xl/8 font-medium tracking-tight text-gray-100">
          {title}
        </p>
        <p className="mt-2 max-w-[600px] text-sm/6 text-gray-300">
          {description}
        </p>
      </div>
    </motion.div>
  )
}
