import { HeroSection } from "@/components/ui/hero-section-1"
import Pricing from '@/components/ui/pricing'
import { Faq } from '@/components/ui/faq'
import { Footer7 } from '@/components/ui/footer-7'

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://sast.tech/#organization',
        name: 'sast',
        url: 'https://sast.tech',
        logo: 'https://sast.tech/icon-512.png',
        sameAs: [
          'https://x.com/sast_tech',
          'https://www.tiktok.com/@sast_tech',
          'https://www.instagram.com/sast.tech/',
          'https://www.facebook.com/profile.php?id=61588200480116',
          'https://linkedin.com/company/sast-tech',
        ],
        description:
          'sast is an autonomous AI cybersecurity agent that continuously scans, detects, and fixes security vulnerabilities in your codebase.',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://sast.tech/#website',
        url: 'https://sast.tech',
        name: 'sast',
        publisher: { '@id': 'https://sast.tech/#organization' },
      },
      {
        '@type': 'WebPage',
        '@id': 'https://sast.tech/#webpage',
        url: 'https://sast.tech',
        name: 'sast — Autonomous AI Pentesting & Vulnerability Scanner',
        isPartOf: { '@id': 'https://sast.tech/#website' },
        about: { '@id': 'https://sast.tech/#organization' },
        description:
          'Continuously scan, detect, and fix security vulnerabilities in your codebase with an autonomous AI agent. OWASP Top 10 coverage, zero false positives.',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'sast',
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Web',
        offers: [
          {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            name: 'Community',
            description: 'Basic asset discovery, OWASP Top 10 scanning, community support, 1 concurrent scan.',
          },
          {
            '@type': 'Offer',
            price: '49',
            priceCurrency: 'USD',
            name: 'Pro Pentester',
            description: 'AI-driven exploit verification, API & cloud security testing, unlimited concurrent scans, CI/CD integration.',
          },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <HeroSection />
        <Pricing />
        <Faq />
        <Footer7 />
      </main>
    </>
  )
}
