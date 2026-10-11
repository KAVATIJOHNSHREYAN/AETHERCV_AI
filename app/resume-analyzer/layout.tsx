import { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'AI Resume Analyzer & ATS Score Checker | AETHERCV AI',
  description: 'Self-contained AI Resume Analyzer, ATS Scoring Engine, Skills Detection, Action Verb Audit, Job Description Matcher, and Executive AI Rewriter.',
  keywords: [
    'Resume Analyzer',
    'ATS Score Checker',
    'Resume Parser',
    'Job Description Matcher',
    'AI Resume Builder',
    'AETHERCV AI',
    'KL University'
  ],
  alternates: {
    canonical: '/resume-analyzer',
  }
}

export default function ResumeAnalyzerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
