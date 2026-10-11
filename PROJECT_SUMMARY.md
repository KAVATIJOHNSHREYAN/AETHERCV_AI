# PROJECT SUMMARY — AETHERCV AI & ATTENDANCE PLATFORM

## 📌 Executive Overview

**AETHERCV AI** is an intelligent, high-performance web platform that integrates two powerful software suites into a single unified application:
1. **AI Resume Analyzer & ATS Score Suite** — An enterprise-grade resume evaluator that scores documents for ATS compliance, provides actionable feedback, transforms bullet points via the STAR method, and compares qualifications against job descriptions.
2. **KLU Attendance Calculator & Academic Intelligence** — A real-time academic tracker designed for university students to calculate attendance percentages across various course structures, extract portal data using OCR, and monitor eligibility thresholds.

---

## 🚀 Key Modules & Feature Breakdown

### MODULE 1: AI RESUME ANALYZER & ATS SCORE SUITE

#### 1. Multi-Format Document Ingestion
- **Native Document Upload**: Supports `.pdf`, `.docx`, and `.txt` files with automated text extraction.
- **Direct Text Input**: Alternative raw text paste mode for fast evaluations without uploading files.
- **Pre-Loaded Sample Resumes**: Quick test profiles (Software Engineer, Data Analyst, Product Manager) for instant demonstration.
- **Privacy-First In-Memory Processing**: All document parsing is handled on-demand without third-party data retention.

#### 2. Dual-Color Visual Identity & Theme
- **Distinct Enterprise Palette**: Uses an electric violet-to-deep-blue gradient (`#4D48E6` &rarr; `#2662EB` &rarr; `#1E50DA`) over a sleek dark obsidian navy container (`#0E1729`).
- **Zero Red Aesthetic**: Clean status indicators and alerts without harsh red tones, maintaining an executive SaaS appearance.

#### 3. Circular Neon ATS Score Gauge
- **Dynamic Score Visualization**: An interactive circular SVG gauge displaying an overall ATS compatibility score from `0` to `100`.
- **Qualification Badges**: Real-time grade classifications including `Elite` (90+), `Strong` (75–89), `Competitive` (60–74), and `Needs Work` (<60).
- **Executive Summary Memo**: High-level recruiter verdict summarizing the candidate's core strengths and primary improvement areas.

#### 4. 8-Pillar ATS Category Breakdown
Every resume undergoes evaluation across 8 critical dimensions, each with individual progress bars, point scores, and contextual feedback:
1. **Section Presence**: Audits mandatory headers (Contact, Summary, Experience, Education, Projects, Skills).
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

#### 9. AI Full Resume Rewriter & Markdown Export
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

### MODULE 2: ACADEMIC ATTENDANCE PLATFORM

#### 1. Simple Attendance Calculator (`/simple`)
- Computes overall attendance percentage based on total classes held and attended.
- Determines whether a student meets the university minimum threshold (75% or 85%).
- Calculates the exact number of consecutive classes a student can skip without falling below the cutoff.
- Calculates how many consecutive classes must be attended to recover from a shortage.

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

#### 4. Eligibility Alerts & Threshold Rules
- **75% Mandatory Cutoff**: Flags courses at risk of detention or exam debarment.
- **85% Distinction Threshold**: Monitors qualification for honors and distinction privileges.
- Dynamic color indicators providing instant status feedback.

#### 5. Semester Drafts & Subject Management
- Save current calculation states as named drafts (e.g., "Semester 5 Mid-Term").
- Re-open, review, update, or remove saved course drafts from local storage at any time.

---

## 🎨 UI/UX & Design Highlights

- **Aesthetic Dual-Color System**: Premium violet-to-blue neon gradients (`#4D48E6` &rarr; `#2662EB` &rarr; `#1E50DA`).
- **Dark Mode Architecture**: Deep obsidian backgrounds (`#0E1729`, `#08111F`) with subtle ambient glow effects.
- **Glassmorphism**: Translucent backdrop blur panels with subtle borders.
- **Micro-Interactions**: Smooth Framer Motion transitions, animated gauges, scanning shimmer bars, and hover states.
- **Full Responsiveness**: Seamless experience across mobile screens, tablets, and desktop workstations.

---

## 📊 Summary Table

| Feature Area | Core Capabilities | Target Audience |
|---|---|---|
| **ATS Score Engine** | 0–100 score, grade classification, 8-pillar audit | Job seekers, students, professionals |
| **STAR Rewriter** | Passive bullet transformation, metrics injection | Resume builders & interview candidates |
| **JD Matcher** | ATS match %, missing keyword checklist | Job applicants tailoring per role |
| **Resume Export** | Markdown (.md) and Analysis Reports (.txt) | All resume analyzer users |
| **Simple Calculator** | Attendance %, skippable & required class counts | University students |
| **LTPS Calculator** | Lecture, Tutorial, Practical, Skilling weights | Students with multi-component courses |
| **Screenshot OCR** | ERP image upload, automatic table parsing | Students wanting instant attendance import |
| **Draft Manager** | Save, load, and manage semester calculations | Ongoing semester tracking |
