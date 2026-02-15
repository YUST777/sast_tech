<p align="center">
  <a href="https://sast.tech">
    <img src="web/public/2.jpg" alt="sast Banner" width="100%">
  </a>
</p>

<div align="center">

# sast.tech

### Autonomous AI Cybersecurity Agent

<br/>

<a href="https://sast.tech"><img src="https://img.shields.io/badge/Website-sast.tech-ffffff?style=for-the-badge&logoColor=white" alt="Website"></a>
<a href="https://sast.tech/waitlist"><img src="https://img.shields.io/badge/Waitlist-Join%20Now-10B981?style=for-the-badge&logoColor=white" alt="Waitlist"></a>
<a href="https://github.com/YUST777/sast_tech/issues"><img src="https://img.shields.io/github/issues/YUST777/sast_tech?style=for-the-badge&logo=github&logoColor=white" alt="Issues"></a>

<a href="https://x.com/sast_tech"><img src="https://img.shields.io/badge/X-@sast__tech-000000?style=for-the-badge&logo=x&logoColor=white" alt="X"></a>
<a href="https://www.linkedin.com/company/sast-tech"><img src="https://img.shields.io/badge/LinkedIn-sast--tech-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
<a href="https://www.instagram.com/sast.tech"><img src="https://img.shields.io/badge/Instagram-@sast.tech-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram"></a>

</div>

<br/>

> [!NOTE]
> **sast is currently in development.** Join the [waitlist](https://sast.tech/waitlist) to get early access when we launch.

---

## What is sast?

sast is an autonomous AI agent that continuously scans, detects, and fixes security vulnerabilities in your codebase. No manual reviews. No false-positive fatigue. Just code that ships fast — and ships safe.

**The problem:** Security scanning tools flood you with alerts, most of which are noise. Developers ignore them. Vulnerabilities slip through. Breaches happen.

**Our solution:** An AI agent that understands your code contextually, identifies real threats, and opens fix PRs automatically — before attackers find what you missed.

---

## Key Capabilities

### Autonomous Scanning
Connect your repository and the agent works continuously in the background:
- **Deep code analysis** across your entire codebase
- **Contextual understanding** — not pattern matching, real comprehension
- **Zero configuration** — the agent learns your stack automatically

### Intelligent Detection
Not another alert cannon. sast prioritizes what actually matters:
- **Real vulnerabilities** ranked by exploitability and impact
- **Dependency chain analysis** — finds transitive risks others miss
- **Secret detection** — credentials, API keys, tokens buried in code

### Automated Fixes
Detection without remediation is just a to-do list. sast fixes what it finds:
- **Auto-generated PRs** with secure code replacements
- **Contextual fixes** that respect your codebase patterns
- **Explanation included** — every fix tells you why and how

### Continuous Protection
Security isn't a one-time scan. sast runs as long as your code evolves:
- **Every commit scanned** in real time
- **CI/CD integration** — block vulnerable code before it merges
- **Drift detection** — catch regressions as your codebase grows

---

## How It Works

```
1. Connect     →  Link your GitHub / GitLab repository
2. Scan        →  AI agent analyzes your entire codebase
3. Detect      →  Real vulnerabilities surfaced, noise filtered
4. Fix         →  Automated PRs with secure replacements
5. Protect     →  Continuous monitoring on every commit
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, TypeScript, Tailwind CSS v4 |
| **Backend** | Supabase (PostgreSQL), Server Actions |
| **Auth** | Supabase Auth |
| **Billing** | Stripe |
| **AI Engine** | Proprietary (separate service) |

---

## Project Structure

```
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── actions/          # Server Actions (waitlist, etc.)
│   │   ├── waitlist/         # Waitlist page
│   │   └── layout.tsx        # Root layout
│   ├── components/
│   │   ├── ui/               # Shared UI components
│   │   └── waitlist/         # Waitlist page components
│   └── lib/
│       ├── supabase/         # Supabase client utilities
│       └── utils.ts          # Helpers
├── supabase/
│   └── migrations/           # Database schema
└── public/                   # Static assets
```

---

## Getting Started

1. **Clone & Install**:
   ```bash
   git clone https://github.com/YUST777/sast_tech.git
   cd sast_tech
   npm install
   ```

2. **Environment Setup**:
   ```bash
   cp .env.example .env.local
   # Add your Supabase credentials
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

---

## Roadmap

### Phase 1 — Landing & Waitlist *(Current)*
Marketing site, waitlist with referral system, email normalization, and duplicate detection. Foundation is live.

### Phase 2 — Auth & Billing
User authentication, organization management, Stripe subscription integration, and user dashboard.

### Phase 3 — Agent Platform
The core product — autonomous AI security agent with repo integration, scanning engine, and automated fix generation.

### Phase 4 — CI/CD & Integrations
GitHub Actions, GitLab CI, and IDE plugins for seamless developer workflow integration.

---

## Community & Support

- **Bug Reports**: [Open an Issue](https://github.com/YUST777/sast_tech/issues/new)
- **Feature Requests**: [Request a Feature](https://github.com/YUST777/sast_tech/issues/new)
- **Waitlist**: [Join at sast.tech/waitlist](https://sast.tech/waitlist)

---

## Support the Project

Give us a star on GitHub — it helps us grow and keeps the momentum going.

<div align="center">
  <sub>Built for developers who ship fast and sleep well.</sub>
</div>
