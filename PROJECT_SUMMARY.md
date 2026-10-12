# PROJECT SUMMARY — AETHERCV AI & ATTENDANCE PLATFORM

## 📌 Executive Overview

**AETHERCV AI** is an intelligent, high-performance web platform that integrates three powerful enterprise-grade suites into a single unified application:
1. **AI Resume Analyzer & ATS Score Suite** — An advanced resume evaluation engine that verifies document authenticity, scores ATS compliance across 8 distinct dimensions, provides STAR-method bullet optimizations, and benchmarks resumes against target job descriptions.
2. **AI Cover Letter Generator** — A tailored generator that synthesizes resume credentials with target job requirements to produce customized, recruiter-ready cover letters with Word (`.docx`) export and draft persistence.
3. **KLU Attendance Calculator & Academic Intelligence** — A real-time academic tracker designed for university students to calculate attendance percentages, compute weighted LTPS course credits, automate ERP portal login with CAPTCHA solving, extract screenshot tables via OCR, and monitor detention risks.

---

## 🚀 Detailed Feature & Module Breakdown

---

### MODULE 1: AI RESUME ANALYZER & ATS SCORE SUITE (`/resume-analyzer`)

#### 1. Multi-Format Document Ingestion
- **Native Document Upload**: Supports `.pdf`, `.docx`, and `.txt` files with automated text extraction.
- **Direct Text Input**: Alternative raw text paste mode for fast evaluations without uploading files.
- **Pre-Loaded Sample Resumes**: Quick test profiles (Software Engineer, Data Analyst, Product Manager) for instant demonstration.
- **Privacy-First In-Memory Processing**: All document parsing is handled on-demand without third-party data retention.

#### 2. Smart Resume Verification Engine (Zero False-Negative Validator)
- **Tolerant Multi-Variation Section Recognition**:
  - *Experience*: Work Experience, Professional Experience, Employment History, Internships, Career History, Professional Background.
  - *Education*: Academic Background, Educational Background, Qualifications, Academics, Degree, University, College.
  - *Projects*: Personal Projects, Academic Projects, Key Projects, Portfolio, Technical Projects, Research.
  - *Skills*: Technical Skills, Core Skills, Competencies, Technologies, Tech Stack, Programming Languages.
  - *Contact*: Email, Phone, LinkedIn, GitHub, Portfolio, Website, Location, Name.
- **OCR & Multi-Line Text Normalization**:
  - Automatically heals split headers caused by PDF line wraps (e.g., `WORK\nEXPERIENCE` $\rightarrow$ `WORK EXPERIENCE`).
  - Unicode normalization (`NFKC`), control character stripping, and whitespace consolidation.
- **Non-Blocking Architecture**:
  - Accepts authentic resumes across all career stages: Freshers, Students, Experienced Engineers, Research CVs, Overleaf, Canva, Word, and Google Docs exports.
  - Fallback rule: any document with $>300$ characters and Contact Info across paragraphs/lines is approved.
  - Emits non-blocking advisory warnings rather than stopping ATS analysis.
- **Diagnostic Console Debugging**:
  - Logs filename, size, characters extracted, lines extracted, detected sections, and contact info in the browser and server console.

#### 3. Circular Neon ATS Score Gauge
- **Dynamic Score Visualization**: An interactive circular SVG gauge displaying an overall ATS compatibility score from `0` to `100`.
- **Qualification Badges**: Real-time grade classifications including `Elite (Tier 1)` (85+), `Strong Candidate` (70–84), and `Developing Fit` (<70).
- **Executive Summary Memo**: High-level recruiter verdict summarizing the candidate's core strengths and primary improvement areas.

#### 4. 8-Pillar ATS Category Breakdown
Every resume undergoes evaluation across 8 critical dimensions, each with individual progress bars, point scores, and contextual feedback:
1. **Section Completeness**: Audits mandatory headers (Contact, Summary, Experience, Education, Projects, Skills).
2. **Keywords & Skills**: Evaluates keyword density and matching against an extensive database of technical competencies.
3. **Action Verbs & Impact**: Scans for strong, non-passive leadership verbs (e.g., *Spearheaded*, *Architected*, *Orchestrated*).
4. **Quantified Metrics**: Identifies numerical data, percentages, revenue figures, and measurable project outcomes.
5. **Formatting & Structure**: Measures word count, estimated page count, bullet point density, and Flesch Reading Ease score.
6. **Work Experience Depth**: Assesses role timelines, seniority indicators, and responsibility framing.
7. **Skill Distribution**: Analyzes the balance between core frameworks, languages, cloud tools, databases, and soft skills.
8. **Education & Credentials**: Verifies degree types, academic institutions, graduation dates, and GPA listings.

#### 5. Section-by-Section Audit & Contact Health Check
- Detects the presence or absence of standard resume sections.
- Identifies critical contact info including email address, phone number, LinkedIn URL, GitHub profile, and portfolio links.
- Flags missing essentials with recommendations.

#### 6. Skills Radar & Categorized Taxonomy
- Automatically categorizes identified skills into distinct domains:
  - Frontend Development (React, Next.js, Vue, TypeScript)
  - Backend & APIs (Node.js, Python, Go, REST, GraphQL)
  - Cloud & DevOps (AWS, Docker, Kubernetes, CI/CD)
  - Databases (PostgreSQL, MongoDB, Redis)
  - AI & Machine Learning (PyTorch, TensorFlow, LLMs)
  - Tools & Methodologies (Git, Agile, Jira)

#### 7. STAR-Method Bullet Point Rewriter
- **Before & After Comparisons**: Identifies weak, passive bullet points and converts them into structured STAR statements (Situation, Task, Action, Result).
- **Quantification Injection**: Suggests metric-driven formulations to demonstrate business impact.
- **Rationale Explanations**: Contextual advice detailing why each rewrite performs better with recruiters and ATS scanners.

#### 8. Job Description (JD) Keyword Matcher
- **Target Role Alignment**: Users can paste any job posting to calculate real-time alignment.
- **Match Percentage**: Displays an overall compatibility percentage score.
- **Matched Competencies**: Highlights keywords and requirements present in both the resume and the job description.
- **Missing Keyword Checklist**: Pinpoints high-priority qualifications from the job posting missing from the resume.

#### 9. Full Resume Rewriter & Markdown Export
- **Polished Executive Draft**: Generates an optimized, well-structured version of the entire resume in Markdown.
- **Section Tab Switcher**: Switch between Full Resume, Executive Summary, Work Experience, Projects, or Skills sections.
- **One-Click Clipboard Copy**: Fast copying directly into Google Docs or Word.
- **Markdown File Export**: Download the rewritten resume as an `.md` document.

#### 10. Multi-Format Report Export Modal
- Download the **Full ATS Analysis Report** (`.txt`).
- Download the **Recruiter Feedback Memo** (`.txt`).
- Download the **Optimized Markdown Resume** (`.md`).
- Completely offline and local browser download generation.

---

### MODULE 2: AI COVER LETTER GENERATOR (`/cover-letter`)

#### 1. Contextual Cover Letter Synthesis
- **Input Parameters**:
  - Uploaded Resume content (or direct paste).
  - Target Job Description.
  - Company Name.
  - Target Job Title / Role.
  - Writing Tone selection.
  - Desired word count target.
- **Recruiter Alignment**: Bridges candidate achievements directly to the prospective employer's key needs.

#### 2. Writing Tone Customization
Supports 5 tailored writing styles:
- **Professional**: Balanced, standard enterprise tone for corporate and traditional roles.
- **Confident**: Impact-driven, assertive phrasing emphasizing leadership and decisive wins.
- **Enthusiastic**: High-energy, mission-driven framing suited for fast-growing startups and creative teams.
- **Creative**: Storytelling and innovation-focused narrative.
- **Executive**: Strategic, vision-oriented voice designed for senior, director, and management positions.

#### 3. Dynamic Word Count Slider
- Intuitive length slider spanning **200 to 600 words** (Short, Medium, Long).
- Allows tailoring between succinct, one-page notes and comprehensive executive letters.

#### 4. Live Markdown Editor & Preview
- Real-time side-by-side editing mode.
- Formatted markdown preview with headers, bullet points, and clean typography.

#### 5. Multi-Format Export Options
- **Export to Word (`.docx`)**: Generates an official, beautifully formatted Microsoft Word document with proper headings, margins, and line spacing.
- **Export to Plain Text (`.txt`)**: Instant download for plain text job portals.
- **Copy to Clipboard**: Quick copy button with visual feedback.

#### 6. Local Cover Letter History Modal
- Automatically archives generated letters to browser localStorage.
- View previous creations, inspect word count and company details, re-load letters into the editor, re-download `.docx`, or delete entries.

---

### MODULE 3: ACADEMIC ATTENDANCE PLATFORM & ERP SUITE

#### 1. Simple Attendance Calculator (`/simple`)
- Computes overall attendance percentage based on total classes held and attended.
- Determines whether a student meets the university minimum threshold (75% or 85%).
- Calculates the exact number of consecutive classes a student can skip without falling below the cutoff.
- Calculates how many consecutive classes must be attended to recover from an attendance shortage.

#### 2. LTPS Multi-Component Calculator (`/ltps`)
- Handles complex academic course structures broken into:
  - **L** — Lecture component
  - **T** — Tutorial component
  - **P** — Practical / Lab component
  - **S** — Skilling / Workshop component
- Computes weighted overall percentages across different credit splits.

#### 3. Screenshot / OCR Calculator (`/screenshot`)
- Allows students to upload a screenshot of their university ERP attendance table.
- Automatically extracts subject codes, subject names, conducted hours, and attended hours using OCR.
- Eliminates manual typing by parsing tabular rows directly.

#### 4. ERP Authentication & Live Sync (`/login`)
- Directly interfaces with university student portals.
- **Automated CAPTCHA Solving**: Evaluates and submits CAPTCHA challenges seamlessly.
- **Device Cookie Authorization**: Persists signed device tokens for smooth subsequent logins.
- Securely pulls real-time course lists, component hours, and registered credits.

#### 5. Student Analytics Dashboard (`/dashboard`)
- Full semester overview with course-by-course attendance cards.
- Visual component breakdown showing conducted vs. attended hours for L, T, P, and S.
- **Full Semester Summary Card Export**: Download consolidated semester attendance reports.

#### 6. Eligibility Alerts & Detention Thresholds
- **75% Mandatory Cutoff**: Immediate alerts for subjects with detention risks (exam debarment).
- **85% Distinction Threshold**: Monitors qualification for honors and distinction privileges.

---

### MODULE 4: AI RESUME BUILDER (`/resume-builder`)

#### 1. Split-Screen Interactive Architecture
- **Dual Panel Workflow**: High-speed Form Editor on the left and Live Resume Preview on the right with instant updates and zero page refresh.
- **Responsive Workspace**: Seamless adaptation across Desktop, Tablet, and Mobile with quick tab switching between Editor, Preview, and ATS Audit.

#### 2. Comprehensive 10-Step Builder Engine
1. **Personal Information**: First/Last Name, Professional Title, Email, Phone, Location, LinkedIn, GitHub, Portfolio, Profile Photo.
2. **Professional Summary**: Manual editor + AI Generator with 10 target roles (*Fresher, Software Engineer, AI Engineer, Data Scientist, Frontend, Backend, Full Stack, Cloud, DevOps, Cyber Security*) and 8 writing tones.
3. **Work Experience**: Unlimited entries, company, role, dates, location, employment types, responsibilities, and impact points.
4. **Technical Projects**: Project name, technologies, GitHub link, live demo URL, architecture overview, and metric bullets.
5. **Education**: Degrees, universities, specializations, CGPA, graduation dates, and coursework.
6. **Skills & Competencies**: Auto-Categorize into Programming Languages, Frameworks, AI/ML, Databases, Cloud & DevOps, with popular tech tag picker and custom inputs.
7. **Certifications**: Certificate title, issuing organization, issue date, credential URL.
8. **Achievements**: Sprint, hackathon, and academic honors with AI Impact Wording suggestions.
9. **Languages**: Multiple languages with proficiency scales (*Beginner, Intermediate, Professional, Native*).
10. **Interests**: Personal passions and technical focus areas.

#### 3. Real-Time Continuous ATS Scoring (100-Point Scale)
- Scores contact completeness, summary strength, action verbs, quantified metrics, education, projects, skills diversity, and readability on every keystroke.
- Emits real-time suggestions and grade classification (*A+, A, B, C, D, F*).

#### 4. 15 Recruiter-Tested ATS Templates
- **Template Library (Gallery Cards with Previews)**:
  1. *Modern ATS* (Recommended) — Single-column layout with bold headers, subtle horizontal dividers, and crisp hierarchy.
  2. *Classic Corporate ATS* — Conservative linear format favored by Fortune 500 ATS systems and institutional employers.
  3. *Harvard Ivy ATS* — Formal academic serif typography with centered credentials, right-aligned dates, and classic Ivy prestige.
  4. *Stanford Tech ATS* — Streamlined Bay Area tech format emphasizing software stack, technical contributions, and rapid scaling.
  5. *Google SDE ATS* — Engineered for XYZ metric formula bullets (Accomplished [X] measured by [Y] through doing [Z]).
  6. *Minimalist Clean ATS* — Pure high-contrast text on white document with generous breathing room and zero parsing interference.
  7. *Executive Leadership ATS* — Dense leadership format highlighting executive summaries, board impact, P&L ownership, and strategic scale.
  8. *Product Manager ATS* — Tailored for Product Managers with focus on business metrics, product lifecycles, and user impact.
  9. *Software Engineer ATS* — Developer-first hierarchy featuring prominent Technical Skills grid followed by enterprise system projects.
  10. *Data Scientist ATS* — Structures statistical models, deep learning frameworks, analytical benchmarks, and quantitative results.
  11. *Consulting ATS* — Structured analytical format for McKinsey, BCG, and Bain recruiting emphasizing client ROI and rigor.
  12. *Creative Professional ATS (ATS Safe)* — Contemporary typography with slate styling for UX designers and creative leads while remaining 100% ATS text-safe.
  13. *Finance ATS* — Banking and private equity standard with rigorous deal transaction summaries, financial modeling, and valuations.
  14. *Healthcare ATS* — Clinical layout prioritizing medical licensures, clinical certifications, hospital experience, and patient care.
  15. *Student / Fresher ATS* — Optimized for university students and entry-level grads with Education, GPA, and Capstone projects upfront.
- **ATS Safe Typography**: 11 certified machine-readable fonts (Inter, Calibri, Arial, Helvetica, Lato, Roboto, Source Sans Pro, Open Sans, Georgia, Cambria, Times New Roman).
- **Recruiter Accent Palettes**: 10 ATS-safe accent tones affecting headings and dividers only (Pure ATS Charcoal, Enterprise Blue, Royal Indigo, Navy Professional, Slate Gray, Emerald Professional, Graphite Black, Steel Blue, Deep Violet, Classic Black).
- **Section Order & Custom Visibility**: Up/down reordering for all 14 standard sections and instant toggle visibility for optional sections.
- **Strict One-Page A4 Guarantee & AI Auto-Optimizer**: Live page counter (`1 / 1` vs `2 / 1`), overflow boundary guides, and 1-click optimization to compress spacing, summaries, and bullets to fit within A4 dimensions.

#### 5. Multi-Channel Import & Multi-Format Export
- **Import Channels**: Direct import from AI Resume Analyzer (`localStorage`), document upload (PDF, DOCX, TXT, OCR images), GitHub portfolio repos, and JSON backups.
- **Export Options**: Print-Ready A4 PDF (`@media print`), Word document (`.doc`), Markdown (`.md`), ATS Plain Text (`.txt`), and JSON backup.

#### 6. Version Manager & Side-by-Side Comparison
- Auto-saves changes every few seconds to prevent data loss.
- Create, duplicate, rename, delete, and restore named versions (*Google Resume, Placement Master, Amazon SDE*).
- Side-by-side version comparison inspecting score deltas, skills count, and word density.

---

### MODULE 6: LINKEDIN PROFILE OPTIMIZER (`/linkedin`)

#### 1. Multi-Channel Profile Ingestion
- **1-Click Sync from AI Resume Builder**: Detects local resume draft and populates headline, about, experiences, projects, and skills with a single click.
- **Paste LinkedIn Profile Text**: Parses bio, about text, past titles, and experiences directly from user pasteboard.
- **Upload Resume (PDF / DOCX)**: Client-side parsing without data upload, converting bullet points and responsibilities into LinkedIn structure.
- **Manual Starter Mode**: Pre-populates starter profile for quick editing and personalization.

#### 2. LinkedIn Recruiter Score Engine (0–100)
- **10 Evaluation Pillars**:
  1. *Headline Score*: Audits value proposition, title clarity, character length, and industry buzzwords.
  2. *About Section*: Checks storytelling depth, hook strength, STAR summaries, and contact availability.
  3. *Experience Optimization*: Measures bullet points, quantifiable metrics, and leadership verbs.
  4. *Featured Projects*: Inspects Problem $\rightarrow$ Solution $\rightarrow$ Impact structure.
  5. *Core Skills*: Assesses quantity ($\ge 5$ skills), role relevance, and breadth.
  6. *Recruiter Search SEO*: Scans targeted keywords for 10 roles (Software Engineer, AI Engineer, Full Stack, Data Scientist, Cloud, Product Manager, Cyber Security, DevOps, etc.).
  7. *Recruiter Appeal*: Evaluates readability, achievement focus, and absence of generic buzzwords.
  8. *Profile Completeness*: 10-point checklist (Photo, Banner, Custom URL, Headline, About, Experience, Education, Projects, Skills, OpenToWork).
  9. *Networking Strength*: Evaluates recommendation readiness and community engagement signals.
  10. *Personal Branding*: Checks unique differentiator, mission clarity, and domain authority.
- **All-Star Status Badge**: Awards All-Star status when profile completeness meets or exceeds 80%.

#### 3. Headline Studio (6 Recruiter Styles)
- Generates 6 distinct styles: *Professional*, *Corporate*, *Startup*, *FAANG Style*, *Student / Fresher*, *Experienced*.
- Real-time character counter enforcing LinkedIn's 220-character limit.
- 1-click apply and copy to clipboard.

#### 4. About Section Generator (6 Tones)
- Produces *Professional Summary*, *Executive Summary*, *Startup Style*, *Corporate Style*, *Recruiter-First Style*, and *Student / Entry-Level*.
- Live character counter enforcing LinkedIn's 2,600-character limit.
- 1-click apply and copy to clipboard.

#### 5. Experience STAR Optimizer & Project Matrix
- Rewrites past roles with Situation, Task, Action, and quantifiable Results using strong leadership action verbs.
- Enhances projects with Problem, Solution, Technology stack, and Business Impact.

#### 6. Authentic Live LinkedIn Preview
- Real-time visual replica of LinkedIn desktop profile with custom banner gradient, avatar, emerald `#OpenToWork` photo ring, experience timeline, featured projects grid, endorsed skills cloud, and education cards.
- Individual 1-click clipboard copy buttons for every profile section.

#### 7. Multi-Format Exports
- **Print-Ready PDF**: Clean multi-section PDF document export using jsPDF.
- **Markdown (.md)**: Recruiter-ready Markdown plan for documentation and portfolio repos.
- **Plain Text (.txt)**: Clean plaintext formatted for fast copying into LinkedIn fields.

---

### MODULE 7: GITHUB PROFILE OPTIMIZER (ENTERPRISE IMPLEMENTATION) (`/github`)

#### 1. Multi-Channel Ingestion & Universal Integration
- **1-Click AI Resume Builder Import**: Synchronizes developer projects, core skills, bio, and experience directly from `localStorage`.
- **Client-Side Document Ingestion**: In-browser PDF (Mozilla PDF.js) and DOCX (Mammoth) extraction with zero data leakage.
- **Direct Bio/Profile Paste**: Quick parser for extracting username, headline, repositories, and technical competencies.
- **Manual Starter Template**: Preloaded with a recruiter-tested software engineer portfolio (`alexjohnson-dev`).

#### 2. 100-Point GitHub Engineering Score Engine
Evaluates developer presence across 9 rigorous pillars:
1. *Profile Completeness*: Avatar, username, bio, company, location, blog/portfolio, and social handles.
2. *README Quality*: Animated headers, categorized skills, badges, and project highlights.
3. *Repository Quality*: Star/fork counts, descriptions, topics, and documentation.
4. *Project Depth*: Architecture explanations, deployment links, features, and screenshots.
5. *Documentation Health*: Presence of README, LICENSE, and setup guides.
6. *Commit Quality & Cadence*: Consistent commit cadence, meaningful messages, and active contribution streaks.
7. *Portfolio & Demo Links*: Live production deployments, interactive demos, and domain links.
8. *Recruiter Appeal*: Readability, clarity of impact, and strong technical keywords.
9. *Open Source Readiness*: Contributing guidelines, issue templates, security policy, and releases.

#### 3. 5 Developer Readiness Indicators
- **Portfolio Readiness**: Assesses portfolio depth, live URLs, and visual screenshots.
- **Recruiter Appeal**: Benchmarks keyword density, clarity of technical role, and contact ease.
- **Internship Readiness**: Evaluates fundamentals, student projects, and basic repository health.
- **Placement Readiness**: Measures campus placement standards, multi-stack fluency, and project metrics.
- **FAANG Readiness**: Scans for distributed systems, high concurrency, algorithmic complexity, and scalable architectures.

#### 4. 6-Style README Studio
- `Neon Developer` — Animated typing SVGs, Shields badges, streak stats cards, and social links.
- `Corporate Engineer` — Systems design architecture, clean markdown formatting, and high-trust enterprise summaries.
- `FAANG SDE` — Large-scale distributed systems projects, microservices, and concurrency metrics.
- `Open Source Hero` — Community badges, maintainer guidelines, RFC workflows, and GitHub Sponsors banner.
- `Student / Fresher` — Computer science fundamentals, capstone repositories, and coursework achievements.
- `Minimalist Clean` — Distraction-free, scannable markdown with pure clean formatting.

#### 5. Pinned Repository Curation & 9-Point Health Checker
- Analyzes every repository and scores individual repo health (0–100%).
- Audits 9 health attributes: README, License, `.gitignore`, Topics, Releases, Issues, Contributing guide, Security policy, Code Quality.
- Recommends optimal pinned repositories based on star count, forks, and architectural complexity.
- Suggests topics, badges, screenshots, and live demo links.

#### 6. Authentic Live GitHub Profile Preview
- Instant desktop replica featuring GitHub's signature dark navigation tabs (*Overview*, *Repositories*, *README.md*).
- Real-time contribution heatmap simulation with activity metrics and streaks.
- Profile sidebar with avatar, follower counters, social links, and organizations.

#### 7. Multi-Format Developer Exports
- **Production `README.md`**: Ready to commit directly to `<username>/<username>` repository.
- **Plain Text (`.txt`)**: Quick copy format for notes and application portals.
- **Portfolio Summary**: Structured project and stack brief for recruiters.

---

### MODULE 8: GLOBAL DESIGN SYSTEM & ZERO-RED ARCHITECTURE

- **Unified Color Palette**:
  - Primary Background: `#07101F`
  - Secondary Background: `#0A1528`
  - Card & Container Surface: `#111D34`
  - Secondary Card Surface: `#162440`
  - Navbar Surface: `#0C162B`
  - Dual Shade Accent: `#4D48E6` &rarr; `#2662EB` &rarr; `#1E50DA`
  - Typography: `#FFFFFF` (Primary), `#9CAEC9` (Secondary), `#64748B` (Muted)
- **Zero Red Aesthetic**:
  - Harsh red colors have been completely removed across the entire platform.
  - Critical alerts, detention badges, and validation messages use a cohesive dark purple-blue mix (`#4D48E6`, text `#818CF8`) and amber warning accents.
- **Glassmorphism & Micro-Interactions**:
  - Translucent backdrop blur panels, glowing border highlights (`rgba(59, 130, 246, 0.18)`), smooth Framer Motion transitions, and responsive mobile-first layouts.

---

## 📊 Feature Summary Matrix

| Feature Area | Module | Core Capabilities | Primary Deliverables |
|---|---|---|---|
| **GitHub Profile Optimizer** | `/github` | 100-pt engineering score, 5 readiness metrics, 6 README styles, repo health | Live GitHub preview, README.md, TXT, Portfolio Summary |
| **LinkedIn Profile Optimizer** | `/linkedin` | Recruiter score (0-100), 10 pillars, 6-style headlines, STAR rewriter, live preview | Live authentic preview, PDF, Markdown, TXT, 1-click copy |
| **AI Resume Builder** | `/resume-builder` | Split-screen editor, 13 templates, AI assistant, version manager | Live A4 preview, PDF, Word, Markdown, TXT, JSON |
| **Resume Authenticity Validator** | `/resume-analyzer` | Multi-synonym matching, PDF normalization, fallback tolerance | Non-blocking verification & console logs |
| **ATS Score Engine** | `/resume-analyzer` | 0–100 score, grade classification, 8-pillar audit | Circular neon gauge & category bars |
| **STAR Bullet Rewriter** | `/resume-analyzer` | Converts passive bullets to metric-driven STAR format | Before/After comparisons |
| **JD Matcher** | `/resume-analyzer` | Keyword matching, match % calculation, missing skills | Targeted application advice |
| **Resume Exports** | `/resume-analyzer` | Full resume rewriter, feedback memo, audit report | `.md` and `.txt` downloads |
| **AI Cover Letter Generator** | `/cover-letter` | Resume + JD synthesis, 5 tones, word count slider | Live markdown editor, Word `.docx`, `.txt` |
| **Cover Letter History** | `/cover-letter` | Local draft archive, preview, reload, download, delete | Persistent history drawer |
| **Simple Calculator** | `/simple` | Class count calculation, skippable/needed classes | 75% & 85% threshold metrics |
| **LTPS Calculator** | `/ltps` | Lecture, Tutorial, Practical, Skilling weighting | Multi-component weighted % |
| **Screenshot OCR** | `/screenshot` | ERP image table extraction via OCR.space | Automated row parsing |
| **ERP Portal Login** | `/login` | Automated CAPTCHA solving, device token cookies | Live ERP attendance sync |
| **Student Dashboard** | `/dashboard` | Semester subject cards, component breakdown | Consolidated semester card export |

---

## 🌐 Live Access

- **Production Deployment**: [https://aethercv-ai.vercel.app](https://aethercv-ai.vercel.app)
- **GitHub Repository**: [https://github.com/KAVATIJOHNSHREYAN/AETHERCV_AI](https://github.com/KAVATIJOHNSHREYAN/AETHERCV_AI)
