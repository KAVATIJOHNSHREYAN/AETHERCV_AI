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

### MODULE 4: GLOBAL DESIGN SYSTEM & ZERO-RED ARCHITECTURE

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
