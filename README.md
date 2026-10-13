# AETHERCV AI & Attendance Platform

> **Next-Generation Academic Attendance Analytics, Enterprise AI Resume Evaluation Suite & AI Cover Letter Generator**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-aethercv--ai.vercel.app-2662EB?style=for-the-badge&logo=vercel&logoColor=white)](https://aethercv-ai.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-AETHERCV__AI-4D48E6?style=for-the-badge&logo=github&logoColor=white)](https://github.com/KAVATIJOHNSHREYAN/AETHERCV_AI)
[![Next.js](https://img.shields.io/badge/Next.js%2015-App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 🌟 Overview

**AETHERCV AI** is a comprehensive, production-ready career intelligence and academic productivity ecosystem engineered with Next.js 15, TypeScript, and modern UI architectures. The platform integrates three core pillars into a unified enterprise SaaS experience:

1. **AI Global Salary Predictor** (`/global-salary-predictor`) — Comprehensive global compensation intelligence engine predicting base salary, performance bonuses, stock RSUs, signing bonuses, and hourly rates across 25+ countries, 100+ cities, and 40+ employers with local currencies, real-time conversion, experience curves, skill ROI impact matrix, and multi-format exports.
2. **AI Skill Gap Analyzer** (`/skill-gap-analyzer`) — Production-grade employability audit engine comparing resumes against 200+ roles or custom job descriptions with 0–100 animated match gauges, 11-category matched skills, prioritized missing skills, missing recruiter keywords, experience & architecture gap analysis, recommended portfolio projects, industry certifications, 12-week learning roadmaps, market demand salary data, STAR bullet improvements, prioritized action checklist, and multi-format exports.
3. **AI Resume Builder & ATS Template System** (`/resume-builder`) — Full-featured commercial split-screen builder with 15 recruiter-tested ATS templates, live 100-point ATS scoring on every keystroke, 11 certified ATS fonts, 10 recruiter accent colors, section reordering & visibility toggles, 1-click single-page A4 optimization, AI summary/STAR bullet rewriters, multi-channel import, and multi-format exports.
4. **AI Resume Analyzer & ATS Score Suite** (`/resume-analyzer`) — Intelligent, tolerant resume verification, 8-pillar ATS compliance scoring, STAR-method bullet rewriting, skill domain taxonomy, and interactive Job Description matching with role-based templates.
5. **AI Cover Letter Generator** (`/cover-letter`) — Tailored, recruiter-ready cover letter generator based on resume content, job description, company name, target role, and tone selection with `.docx` export and draft history.
6. **LinkedIn Profile Optimizer** (`/linkedin`) — Recruiter-focused LinkedIn optimization engine with 10-pillar audit, 6 headline styles, 6 summary tones, SEO scanner, multiple target roles management, and live desktop preview.
7. **GitHub Profile Optimizer** (`/github`) — Enterprise developer portfolio & open-source optimizer with 100-point engineering score, 5 readiness indicators, 6 README styles, pinned repository curation, health checks, and live GitHub desktop preview.
8. **Universal Job Roles & Careers Library** (`lib/job-roles/master-library.ts`) — Platform-wide 200+ roles catalog across 18 distinct categories with fuzzy search, instant category filtering, and "Others" custom role specification with persistent storage.
9. **Academic Attendance Intelligence & ERP Suite** (`/`, `/simple`, `/ltps`, `/screenshot`, `/login`, `/dashboard`) — Real-time attendance percentage tracking, LTPS credit weighting, automated screenshot OCR extraction, automated ERP portal authentication, and detention risk monitoring.

---

## 🎨 Global Enterprise Design System (Zero Red Dark Theme)

The entire application adopts a cohesive, high-end dark SaaS visual language:

- **Unified Palette**: Deep obsidian backgrounds (`#07101F`, `#0A1528`), enterprise dark navy cards (`#111D34`, `#162440`), and vibrant purple-blue dual shade accents (`#4D48E6` &rarr; `#2662EB` &rarr; `#1E50DA`).
- **Zero Red Aesthetic**: All harsh red elements are completely eliminated. Error states, critical alerts, and detention risks use sophisticated dark purple-blue mix borders (`#4D48E6`), glowing badges (`#818CF8`), and amber highlights.
- **Glassmorphism & Depth**: Multi-layer backdrop blur panels, subtle borders (`rgba(59, 130, 246, 0.18)`), glowing ambient highlights, and fluid Framer Motion micro-interactions.

---

## 🚀 Key Modules & Capabilities

### 1. 🎯 AI Skill Gap Analyzer (`/skill-gap-analyzer`)

- **Multi-Channel Resume Ingestion**: Upload documents (`.PDF`, `.DOCX`, `.TXT`), sync directly from Resume Builder, pull parsed history from Resume Analyzer, or paste raw resume text.
- **Strict Document Validation**: Authenticity verification rejecting homework assignments, lecture notes, and non-resumes with the prompt: *"This document does not appear to be a resume. Please upload a valid resume or use Resume Builder."*
- **Target Role or Job Description Flexibility**: Compare against 200+ indexed tech roles with fuzzy search and custom typing, or paste any full job description.
- **0–100 Animated Skill Match Gauge**: Dynamic SVG circular gauge with match tiers (*Excellent Match*, *Strong Match*, *Moderate Match*, *Needs Improvement*, *Poor Match*).
- **11-Domain Matched Skills Breakdown**: Categorized across Programming Languages, Frontend, Backend, Cloud, DevOps, AI, Machine Learning, Databases, Tools, Frameworks, and Soft Skills.
- **Prioritized Missing Skills**: High, Medium, and Low priority gaps with "Why each skill matters", learning difficulty, and estimated hours.
- **Recruiter Missing Keywords**: Identifies missing search terms (Docker, Redis, AWS Lambda, Terraform, REST APIs, GraphQL, FastAPI, Kafka, Microservices, LLMs, RAG, Kubernetes, etc.) with JD occurrence and natural addition tips.
- **Experience & Scale Gap Analysis**: Evaluates required vs demonstrated years, leadership signals, architecture score, and project scale assessment.
- **Recommended Portfolio Projects**: Tailored project suggestions with difficulty, tech stack, estimated time, deliverables, and GitHub architecture.
- **Industry Certifications**: Recommended credentials (AWS, Azure, GCP, NVIDIA, Cisco, etc.) with difficulty, duration, and career impact.
- **12-Week Strategic Roadmap**: Milestone-driven timeline from week 1 to 12 with deliverables.
- **Market Demand & Salary Benchmarks**: Realistic compensation ranges, hiring demand, remote flexibility, and top hiring companies.
- **Resume Improvements**: Before/after STAR bullet rewrites with metrics, missing sections, and recruiter tips.
- **Prioritized Action Plan**: Interactive checklist with completion tracking.
- **Multi-Format Exports**: PDF Report, TXT Report, Markdown Report, JSON Report, Career Roadmap, and Improvement Checklist.
- **Local History Management**: Save, view, rename, delete, compare side-by-side, and reopen past analyses.

### 2. 📄 AI Resume Builder (`/resume-builder`)

- **Interactive Split-Screen Workspace**: Instant live preview rendering alongside a comprehensive 10-step form editor with zero re-rendering delays.
- **Real-Time Continuous ATS Scoring**: Pinned live audit widget computing a 100-point ATS compliance score on every keystroke with categorized grade badges and AI recommendations.
- **15 Recruiter-Tested ATS Templates**:
  - `Modern ATS` (Recommended)
  - `Classic Corporate ATS`
  - `Harvard Ivy ATS`
  - `Stanford Tech ATS`
  - `Google SDE ATS`
  - `Minimalist Clean ATS`
  - `Executive Leadership ATS`
  - `Product Manager ATS`
  - `Software Engineer ATS`
  - `Data Scientist ATS`
  - `Consulting ATS`
  - `Creative Professional ATS` (ATS Safe)
  - `Finance ATS`
  - `Healthcare ATS`
  - `Student / Fresher ATS`
- **ATS Safe Typography & Color Controls**: 11 certified machine-readable fonts (Inter, Calibri, Arial, Helvetica, Lato, Roboto, Source Sans Pro, Open Sans, Georgia, Cambria, Times New Roman) and 10 ATS-safe accent palettes.
- **Section Order & Custom Visibility**: Drag/reorder section hierarchy and toggle visibility ON/OFF for optional sections (Summary, Projects, Certifications, Achievements, Internships, Research, Languages, Volunteer, References).
- **Strict One-Page A4 Guarantee & Direct PDF Download**:
  - Direct 1-Click single-page A4 `.pdf` file download using client-side vector-scale rasterization (`jsPDF` + `html-to-image`).
  - Isolated iframe print pipeline that eliminates multi-page spill, browser URL headers, and 7-page print errors.
  - Live page indicator (`1 / 1` vs `2 / 1`), overflow boundary guides, and 1-click AI optimizer.
  - Auto-generate professional summaries for 10 roles (*Fresher, Software Engineer, AI Engineer, Full Stack, Data Scientist, DevOps, etc.*) across 8 tones.
  - Transform responsibility bullets with *STAR Format*, *Add Metrics*, *Improve Action Verbs*, and *Technical Polish*.
  - Enhance project descriptions, suggest system architecture, and generate impact metrics.
- **Multi-Source Import & Multi-Format Export**:
  - One-click import from AI Resume Analyzer (`localStorage`), document file upload (PDF/DOCX/TXT/OCR), GitHub public portfolio repos, and JSON backups.
  - Export as strictly 1-page A4 PDF (`.pdf`), Word document (`.doc`), Markdown (`.md`), ATS Plain Text (`.txt`), and JSON.
- **Version Manager & Comparison**: Auto-save to browser storage, create custom versions (*e.g. Google SWE, Amazon SDE, Placement*), and compare versions side-by-side.

---

### 3. 🤖 AI Resume Analyzer & ATS Score Suite (`/resume-analyzer`)

- **Multi-Format Document Ingestion**: Upload native `.pdf`, `.docx`, or `.txt` resumes, or paste plain text directly. Handled in-browser and server-side with zero cloud leakage.
- **Intelligent Non-Blocking Validation Engine**:
  - Resilient to OCR noise, uppercase/lowercase variations, and PDF formatting quirks (e.g., `WORK\nEXPERIENCE` wrapped lines).
  - Recognizes wide synonyms for Experience, Education, Projects, Skills, and Contact details.
  - Zero false rejections: accepts Freshers, Students, Experienced Candidates, Academic CVs, Overleaf, Canva, and Word exports.
  - Diagnostic console debug logging for transparency.
- **Circular Neon ATS Gauge**: Dynamic SVG circular gauge calculating an overall qualification score (0–100) with tier badges (`Tier 1 / Elite`, `Strong Candidate`, `Developing Fit`).
- **8-Category Comprehensive Audit**:
  1. *Section Completeness* (Contact, Summary, Experience, Education, Projects, Skills)
  2. *Keywords & Hard Skills Density*
  3. *Action Verbs & Leadership Phrasing*
  4. *Quantifiable Metrics & Business Impact*
  5. *Formatting & Structural Health* (Flesch Reading Ease, paragraph balance, page counts)
  6. *Work Experience Depth & Timeline*
  7. *Technical & Soft Skills Balance*
  8. *Education Credentials Verification*
- **STAR-Method Bullet Rewriter**: Transforms passive job responsibilities into impact-driven Situation-Task-Action-Result statements with measurable metrics.
- **Interactive Job Description Matcher**: Paste any target job description to compute real-time Match %, matched keywords, and prioritized missing qualifications.
- **Full Resume Rewriter & Report Downloads**: One-click download of the rewritten resume (`.md`), detailed ATS audit report (`.txt`), or recruiter feedback memo.

---

### 4. ✍️ AI Cover Letter Generator (`/cover-letter`)

- **Context-Aware Generation**: Synthesizes uploaded resume data and target job requirements to generate bespoke, recruiter-ready cover letters.
- **Configurable Parameters**:
  - **Company Name & Job Role**: Personalized company context and target position.
  - **Tone Selection**: *Professional*, *Confident*, *Enthusiastic*, *Creative*, or *Executive*.
  - **Length Control**: Dynamic slider to adjust target word count (200 – 600 words).
- **Interactive Live Editor**: Full markdown editing and live preview mode.
- **Export Options**:
  - Download formatted Word document (`.docx`).
  - Download plain text (`.txt`).
  - One-click copy to clipboard.
- **Local History & Draft Management**: Automatically saves generated letters in browser storage with preview, re-load, download, and delete capabilities.

---

### 5. 💼 LinkedIn Profile Optimizer (`/linkedin`)

- **Multi-Method Ingestion**: 1-click sync from AI Resume Builder, paste raw profile text/bio, client-side PDF/DOCX resume upload, or manual starter template.
- **LinkedIn Recruiter Score Engine (0–100)**: Evaluates profile across 10 category scores (Headline, About, Experience, Projects, Skills, SEO Keywords, Recruiter Appeal, Completeness, Networking Strength, Personal Branding) with All-Star status indicator.
- **Headline Studio (6 Recruiter Styles)**: Generates high-impact headlines across Professional, Corporate, Startup, FAANG Style, Student/Fresher, and Experienced formats with real-time 220-character limit enforcement.
- **About Section Generator (6 Tones)**: Crafts storytelling summaries across Professional, Executive, Startup, Corporate, Recruiter-First, and Student styles within LinkedIn's 2,600-character boundary.
- **Experience STAR Rewriter & Project Matrix**: Converts passive roles into metric-driven Situation-Task-Action-Result bullets with leadership action verbs and structured Problem &rarr; Solution &rarr; Impact projects.
- **Recruiter Search SEO Scanner**: Target role keyword matching across 10 domains with missing keyword identification and 1-click inclusion.
- **Live Authentic LinkedIn Preview**: Real-time visual mockup featuring banner, avatar, `#OpenToWork` emerald frame, experience timeline, and 1-click copy buttons for each section.
- **Multi-Format Exports**: 1-click downloads for PDF specification documents, Markdown (`.md`), and plaintext (`.txt`).

---

### 6. 🐙 GitHub Profile Optimizer (`/github`)

- **Multi-Channel Ingestion**: 1-click instant import from AI Resume Builder (`localStorage`), resume PDF/DOCX upload via client-side PDF.js/mammoth parsers, paste profile/bio, or manual profile starter.
- **100-Point GitHub Engineering Score**: Real-time audit across 9 categories (Profile Info, README Quality, Repositories, Projects Depth, Documentation, Commit Quality, Portfolio Links, Recruiter Appeal, Open Source Readiness).
- **5 Developer Readiness Indicators**: Specialized percentage benchmarks for *Portfolio Score*, *Recruiter Appeal*, *Internship Readiness*, *Placement Readiness*, and *FAANG Readiness*.
- **Multi-Style README Generator (6 Visual Archetypes)**:
  - `Neon Developer` — Animated typing headers, dynamic GitHub Stats/Streak cards, Shield badges, quick links.
  - `Corporate Engineer` — High-trust enterprise architecture, systems design highlights, clean typography.
  - `FAANG SDE` — Distributed systems metrics, high-concurrency projects, algorithmic problem-solving credentials.
  - `Open Source Hero` — Maintainer badges, RFC contributions, community guidelines, sponsorship CTA.
  - `Student / Fresher` — Computer science fundamentals, academic hackathons, capstone projects, learning milestones.
  - `Minimalist Clean` — Distraction-free, scannable markdown with pure clean formatting.
- **Pinned Repository Curation & Health Checker**:
  - Automatically recommends top repositories based on stars, forks, and architectural complexity.
  - Audits 9 health metrics per repository: README, License, `.gitignore`, Topics, Releases, Issues, Contributing guide, Security policy, Code Quality.
  - 1-click action items: Add demo URL, attach screenshots, add topics, attach MIT/Apache license.
- **Categorized Tech Stack Visualizer**: Modern categorized shield badges across Languages, Frameworks, Cloud & DevOps, AI / ML, Databases, and Tools.
- **AI Improvement Engine**: Automated recommendations for missing trending skills, architecture enhancements, deployment strategies, and high-impact project ideas.
- **Authentic Live GitHub Profile Preview**: Real-time desktop mockup reproducing GitHub's profile layout: Overview, Repositories tab, standalone README view, contribution heatmap grid, sidebar bio, organizations, achievements, and social links.
- **Multi-Format Exports**: 1-click downloads for production `README.md`, developer resume text (`.txt`), and formatted Portfolio Summary.

---

### 5. 🎯 Universal Job Roles & Careers Library (Platform-Wide)

- **200+ Standardized Roles Across 18 Industry Categories**:
  - Full-text fuzzy search bar with instantaneous filtering across role names, categories, and keywords.
  - Category pill filters with visual icons:
    * 💻 **Software Engineering** (Full Stack, Backend, Frontend, Systems, Embedded, Compiler, etc.)
    * 🤖 **AI & Machine Learning** (AI Engineer, LLM Specialist, RAG Architect, Computer Vision, NLP, etc.)
    * 📊 **Data Science & Analytics** (Data Scientist, BI Analyst, Data Architect, ML Analyst, etc.)
    * ☁️ **Cloud & DevOps** (Cloud Architect, Site Reliability Engineer, Platform Engineer, DevSecOps, etc.)
    * 🛡️ **Cyber Security** (Security Analyst, Penetration Tester, Incident Responder, Cryptographer, etc.)
    * 📱 **Mobile Development** (iOS, Android, React Native, Flutter, Swift, Kotlin, etc.)
    * 🌐 **Web & Frontend** (Frontend Architect, UI Engineer, WebGL Specialist, React Engineer, etc.)
    * ⚙️ **Backend & Distributed Systems** (Microservices Architect, High-Concurrency Engineer, API Architect, etc.)
    * 🎯 **Product & Management** (Product Manager, Technical PM, Scrum Master, Agile Coach, etc.)
    * 🎨 **UI/UX Design** (Product Designer, UX Researcher, Interaction Designer, Design Systems Lead, etc.)
    * 🧪 **Quality Assurance & Testing** (SDET, QA Automation, Performance Tester, Security QA, etc.)
    * ⚡ **Hardware & Embedded Systems** (IoT Engineer, Firmware Developer, Robotics Engineer, FPGA, etc.)
    * 🗄️ **Database & Data Engineering** (Data Engineer, Database Administrator, ETL Developer, Big Data, etc.)
    * ⛓️ **Blockchain & Web3** (Smart Contract Auditor, Solidity Developer, Web3 Architect, etc.)
    * 🎮 **Game Development** (Unity Developer, Unreal Engine Programmer, Gameplay Engineer, etc.)
    * 🏢 **IT & Enterprise Systems** (SysAdmin, Solutions Architect, Network Engineer, IT Director, etc.)
    * 💼 **Business & Consulting** (Technology Consultant, Management Analyst, Solution Architect, etc.)
    * 🚀 **Emerging Technologies** (Quantum Computing Researcher, AR/VR Engineer, Autonomous Systems, etc.)
- **"Others" Custom Role Specification**:
  - Seamless inline entry to type any custom, specialized, or emergent title directly.
  - Automatically persists user-defined custom roles in Local Storage and Recent Roles.
- **Ubiquitous Integration Across All Platform Modules**:
  - **AI Resume Builder**: Step 1 Professional Title, Step 2 AI Summary Generator, Step 3 Work Experience Role / Title.
  - **AI Resume Analyzer**: Target Role Template in Job Description Matcher for automated role-specific JD generation and instant ATS gap analysis.
  - **AI Cover Letter Generator**: Target Role / Job Title selector.
  - **LinkedIn Profile Optimizer**: Global target role switcher, AI Recruiter Headline Generator, AI About Section Generator, Work Experience role title, and Open-To-Work multi-role management.
  - **GitHub Profile Optimizer**: Target Engineering Role for README and profile optimization.

---

### 6. 📊 Academic Attendance Platform & ERP Suite

- **Simple Attendance Calculator (`/simple`)**: Fast attendance calculation based on conducted vs. attended classes, displaying skippable or required recovery classes.
- **LTPS Calculator (`/ltps`)**: Weighted academic calculations across Lecture (L), Tutorial (T), Practical (P), and Skilling (S) components.
- **Screenshot / OCR Calculator (`/screenshot`)**: Upload ERP portal screenshots for automated tabular row parsing via OCR.space.
- **ERP Authentication Helper (`/login`)**: Secure university ERP credentials login with automated CAPTCHA solving, device token cookies, and live sync.
- **Student Analytics Dashboard (`/dashboard`)**: Comprehensive semester dashboard with course cards, status badges, and exportable consolidated semester summary cards.
- **Eligibility Alerts**: Instant visibility into university thresholds: 75% examination eligibility and 85% distinction qualifications.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), Dual-Color CSS Tokens (`#4D48E6` &rarr; `#2662EB` &rarr; `#1E50DA`), Glassmorphism |
| **UI Components** | [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/), Lucide Icons |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Document Processing**| PDF.js parser, Mammoth / Docx text extraction, docx file generator |
| **OCR & Scraping** | OCR.space API, Cheerio, Node Canvas |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 💻 Getting Started Locally

### Prerequisites
- **Node.js**: `v18.17.0` or later
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KAVATIJOHNSHREYAN/AETHERCV_AI.git
   cd Attendance-Calculator
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   # Optional: OCR Space API key for screenshot attendance extraction
   OCR_API_KEY=your_ocr_api_key_here
   ```

4. **Launch development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 📁 Project Directory Structure

```text
├── app/
│   ├── layout.tsx                 # Root layout, favicon & metadata
│   ├── page.tsx                   # Landing page
│   ├── globals.css                # Enterprise design tokens & global CSS
│   ├── resume-builder/            # Commercial 15-template ATS Resume Builder
│   ├── resume-analyzer/           # AI Resume Analyzer & ATS suite
│   ├── cover-letter/              # AI Cover Letter Generator
│   ├── linkedin/                  # LinkedIn Profile Optimizer & Recruiter Score
│   ├── github/                    # GitHub Developer Portfolio Optimizer
│   ├── simple/                    # Simple attendance calculator
│   ├── ltps/                      # LTPS component calculator
│   ├── screenshot/                # Screenshot OCR calculator
│   ├── login/                     # ERP portal authentication & captcha
│   ├── dashboard/                 # Student analytics dashboard
│   └── api/                       # OCR, Captcha, Resume AI, and Attendance APIs
├── components/
│   ├── header.tsx                 # Global navigation header with grouped sub-buttons
│   ├── footer.tsx                 # Global footer
│   ├── shared/
│   │   └── universal-job-role-selector.tsx # Universal 200+ roles categorized selector & custom input
│   ├── resume-builder/            # Form editor, 15 ATS templates, and export engines
│   ├── cover-letter/              # Cover Letter Generator sub-components
│   ├── linkedin/                  # LinkedIn Headline Studio, About, and STAR editors
│   ├── github/                    # GitHub README generator and metric cards
│   ├── resume/                    # Resume Analyzer sub-components
│   └── ui/                        # Accessible Shadcn / Radix primitives
├── lib/
│   ├── theme.ts                   # Unified enterprise design system tokens
│   ├── job-roles/
│   │   └── master-library.ts      # 200+ standardized roles, 18 categories, and search index
│   ├── resume-builder/            # AI assistant, templates, and PDF export logic
│   ├── linkedin/                  # Recruiter score engine, headline & about generators
│   ├── github/                    # Developer score engine, markdown templates
│   ├── resume/                    # Core ATS & Resume analysis engines
│   └── cover-letter/              # Cover letter generator templates & engine
├── public/                        # Optimized logo emblem, icons & favicons
├── PROJECT_SUMMARY.md             # High-level architecture & feature summary
└── README.md                      # Primary project documentation
```

---

## 🔒 Privacy & Security

- **In-Memory Analysis**: Uploaded resumes and academic files are analyzed ephemerally in memory without persistent backend storage.
- **Zero Third-Party Training**: Resume data is never sent to external training datasets.
- **Local Storage Isolation**: Cover letter histories and attendance drafts reside exclusively within the user's browser localStorage.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Built with ❤️ for students and professionals by [KAVATI JOHN SHREYAN](https://github.com/KAVATIJOHNSHREYAN).
