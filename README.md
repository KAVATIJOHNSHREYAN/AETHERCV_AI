# AETHERCV AI & Attendance Platform

> **Next-Generation Academic Attendance Analytics & Enterprise-Grade AI Resume Evaluation Suite**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-aethercv--ai.vercel.app-2662EB?style=for-the-badge&logo=vercel&logoColor=white)](https://aethercv-ai.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js%2015-App%20Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%203-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## 🌟 Overview

**AETHERCV AI** is an all-in-one productivity and career intelligence ecosystem built with Next.js 15, TypeScript, and modern UI engineering. It seamlessly combines:

1. **AI Resume Analyzer & ATS Score Checker** — Comprehensive ATS compliance evaluation, 8-pillar scoring breakdown, STAR-method bullet rewriting, job description matching, and keyword audit tailored with a sleek enterprise dual-color UI (`#4D48E6` &rarr; `#1E50DA`).
2. **KLU Attendance Calculator & Analytics** — Real-time academic tracking, LTPS component calculation, ERP attendance extraction via OCR, eligibility alerts (75% / 85%), and draft persistence.

---

## 🚀 Key Modules & Capabilities

### 1. 🤖 AI Resume Analyzer & ATS Score Suite (`/resume-analyzer`)

- **Multi-Format Document Ingestion**: Upload native `.pdf`, `.docx`, or `.txt` resumes, or paste plain text directly. Powered by an OCR and regex parser with zero cloud leakage.
- **Precision Dual-Color Theme**: Styled in an enterprise violet-to-electric-blue gradient (`#4D48E6` &rarr; `#2662EB` &rarr; `#1E50DA`) against a deep dark navy container (`#0E1729`).
- **Circular Neon ATS Gauge**: Dynamic SVG circular gauge calculating an overall qualification score (0–100) with grade classification (`Elite`, `Strong`, `Competitive`, `Needs Improvement`).
- **Comprehensive 8-Category Audit**:
  - Section Completeness (Header, Summary, Experience, Education, Projects, Skills)
  - Keyword & Hard Skills Density
  - Action Verbs & Power Phrasing
  - Quantifiable Metrics & STAR Results
  - Formatting & Structural Health (Flesch Reading Ease, paragraph density, page estimates)
  - Work Experience Impact
  - Technical & Soft Skills Balance
  - Education & Credentials Verification
- **STAR-Method Bullet Rewriter**: Generates before/after sentence optimizations transforming passive tasks into high-impact quantified achievements.
- **Interactive Job Description Matcher**: Paste any job description to instantly compute ATS Match %, identify matched competencies, and pinpoint missing requirements.
- **Export & Report Downloads**: One-click download of the optimized resume (`.md`), detailed ATS audit (`.txt`), or recruiter feedback memo.

---

### 2. 📊 Academic Attendance Platform

- **Simple Calculator (`/simple`)**: Rapid attendance tracking based on conducted vs. attended classes.
- **LTPS Calculator (`/ltps`)**: Advanced weighted calculation for Lecture, Tutorial, Practical, and Skilling course components.
- **Screenshot / OCR Calculator (`/screenshot`)**: Upload ERP portal screenshots for automated tabular data extraction via OCR.space API.
- **Eligibility Alerts**: Instant warnings and skippable class calculations to maintain 75% university eligibility or 85% distinction thresholds.
- **Draft Management**: Save, view, reload, or delete semester subject records locally in browser storage.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 15 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/), Custom Dual-Color CSS Variables (`#4D48E6` &rarr; `#1E50DA`), Glassmorphism |
| **UI Components** | [Radix UI](https://www.radix-ui.com/), [Shadcn UI](https://ui.shadcn.com/), Lucide Icons |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Parsing & OCR** | PDF parsing engine, Docx text extraction, OCR.space API, Cheerio |
| **Fonts** | Google Fonts (`Poppins`, `Outfit`) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🎨 Dual-Color Design System

The AI Resume Analyzer features a custom dual-color palette extracted directly from high-end SaaS designs:

| Element | Color Value | Representation |
|---|---|---|
| **Left Gradient Stop** | `#4D48E6` | Electric Violet / Deep Indigo |
| **Middle Accent** | `#2662EB` | Vibrant Enterprise Blue |
| **Right Gradient Stop** | `#1E50DA` | Deep Royal Blue |
| **Container Background**| `#0E1729` / `#08111F` | Obsidian Blue / Dark Navy |
| **Border Highlights** | `rgba(77, 72, 230, 0.35)` | Glowing Ambient Outline |

---

## 💻 Getting Started Locally

### Prerequisites
- **Node.js**: `v18.17.0` or later
- **Package Manager**: `npm`, `pnpm`, or `yarn`

### Setup Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KAVATIJOHNSHREYAN/AETHERCV_AI.git
   cd AETHERCV_AI
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

## 📁 Project Structure

```text
├── app/
│   ├── layout.tsx                 # Root layout, favicon & metadata
│   ├── page.tsx                   # Landing page
│   ├── resume-analyzer/           # AI Resume Analyzer & ATS suite
│   ├── simple/                    # Simple attendance calculator
│   ├── ltps/                      # LTPS component calculator
│   ├── screenshot/                # Screenshot OCR calculator
│   ├── dashboard/                 # Student analytics dashboard
│   └── api/
│       ├── resume/parse/          # Resume upload & parsing endpoint
│       ├── parse-ocr/             # OCR screenshot parser
│       └── login/                 # ERP authentication helper
├── components/
│   ├── header.tsx                 # Global header with logo & route links
│   ├── footer.tsx                 # Global footer
│   ├── resume/                    # Resume Analyzer sub-components
│   │   ├── ats-circular-score.tsx # Circular SVG score gauge
│   │   ├── category-breakdown.tsx # 8-category dual-color progress bars
│   │   ├── section-audit-view.tsx # Section detection & health check
│   │   ├── skills-radar-view.tsx  # Skill distribution breakdown
│   │   ├── keywords-actions-view.tsx # Action verbs & keyword audit
│   │   ├── jd-matcher-view.tsx    # Job Description matching tool
│   │   ├── ai-feedback-view.tsx   # STAR rewrites & recruiter review
│   │   ├── ai-rewriter-view.tsx   # Full resume rewriter & markdown export
│   │   ├── export-report-modal.tsx# Report & analysis download modal
│   │   └── resume-upload-zone.tsx # File dropzone & text input
├── lib/
│   ├── resume/                    # Core ATS & Resume analysis engines
│   │   ├── ats-calculator.ts      # Multi-dimensional ATS scoring logic
│   │   ├── parser.ts              # Document text normalization & regex
│   │   ├── keywords-db.ts         # Industry keywords & power verbs database
│   │   ├── rewriter.ts            # Markdown resume builder
│   │   └── jd-matcher.ts          # TF-IDF & keyword matcher
├── public/                        # Static assets, logos & favicons
└── README.md                      # Project documentation
```

---

## 🔒 Privacy & Security

- **Client-Side First**: Resume texts and sensitive academic data are processed securely in memory without persistent storage.
- **Zero Third-Party Model Selling**: Analysis engines evaluate documents on-demand without feeding personal career details into external generative model datasets.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE). Built with ❤️ for students and professionals by [KAVATI JOHN SHREYAN](https://github.com/KAVATIJOHNSHREYAN).
