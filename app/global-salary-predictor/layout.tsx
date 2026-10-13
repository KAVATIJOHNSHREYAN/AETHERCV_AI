import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Global Salary Predictor | Live Market Compensation Benchmarks | AetherCV AI',
  description:
    'Predict realistic salary ranges, bonus estimates, and stock equity compensation across 25+ countries, 100+ cities, and 40+ employers based on real-time market datasets and hiring demand.',
  keywords: [
    'Salary Predictor',
    'Tech Salary Calculator',
    'Software Engineer Salary',
    'Global Salary Benchmarks',
    'Compensation Predictor',
    'FAANG Salaries',
    'Indian Tech Salaries LPA',
    'AetherCV AI'
  ],
  openGraph: {
    title: 'AI Global Salary Predictor | AetherCV AI',
    description:
      'Predict realistic compensation ranges across 25+ countries and 40+ top employers based on current hiring market trends.',
    url: 'https://aethercv-ai.vercel.app/global-salary-predictor',
    siteName: 'AetherCV AI',
    locale: 'en_US',
    type: 'website'
  }
}

export default function GlobalSalaryPredictorLayout({
  children
}: {
  children: React.ReactNode
}) {
  return children
}
