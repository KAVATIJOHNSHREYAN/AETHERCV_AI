import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Skill Gap Analyzer | Career Roadmap & Employability Audit | AetherCV AI',
  description:
    'Identify the exact gap between your resume and target job descriptions. Get personalized skill match scores, 12-week learning roadmaps, portfolio project suggestions, and missing recruiter keywords.',
  keywords: [
    'skill gap analyzer',
    'AI resume skill gap',
    'employability audit',
    'job description matcher',
    'career roadmap',
    'missing recruiter keywords',
    'tech interview readiness',
    'AetherCV AI'
  ],
  openGraph: {
    title: 'AI Skill Gap Analyzer | AetherCV AI',
    description:
      'Compare your resume against 200+ tech roles or any job description. Uncover missing skills, recruiter keywords, and 12-week learning roadmaps.',
    url: 'https://aethercv-ai.vercel.app/skill-gap-analyzer',
    siteName: 'AetherCV AI',
    type: 'website'
  }
}

export default function SkillGapAnalyzerLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
