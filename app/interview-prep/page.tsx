import { Metadata } from 'next'
import { InterviewPrepPage } from '@/components/interview-prep/interview-prep-page'

export const metadata: Metadata = {
  title: 'AI Interview Preparation Suite | AETHERCV AI',
  description:
    'Enterprise-grade personalized AI mock interviews calibrated to your resume, job description, target company, and candidate-reported live hiring trends. Features voice speech mode, live follow-ups, and recruiter evaluations.',
  keywords: [
    'AI mock interview',
    'interview preparation',
    'technical interview practice',
    'coding interview DSA',
    'system design interview',
    'STAR behavioral interview',
    'recruiter simulation',
    'Google interview prep',
    'Amazon interview questions'
  ],
  openGraph: {
    title: 'AI Interview Preparation Suite | AETHERCV AI',
    description:
      'Practice realistic mock interviews with recruiter personas, voice mode, live follow-ups, and instant feedback.',
    type: 'website'
  }
}

export default function Page() {
  return <InterviewPrepPage />
}
