export type SalaryInputMode = 'resume' | 'builder' | 'manual'

export type ExperienceBracket =
  | 'intern'
  | 'fresher'
  | '1-3'
  | '3-5'
  | '5-8'
  | '8-12'
  | '12+'

export type EducationLevel =
  | 'High School'
  | "Bachelor's Degree"
  | "Master's Degree"
  | 'Ph.D. / Doctorate'
  | 'Bootcamp Graduate'
  | 'Self-Taught / Associate'

export type EmploymentType = 'Full-time' | 'Contract' | 'Part-time' | 'Internship'

export type WorkplaceModel = 'Remote' | 'Hybrid' | 'On-site'

export interface SalaryPredictionInput {
  inputSource: SalaryInputMode
  resumeText?: string
  fileName?: string
  candidateName?: string
  jobTitle: string
  company: string
  country: string
  stateProvince: string
  city: string
  experienceBracket: ExperienceBracket
  yearsOfExperience: number
  education: EducationLevel
  skills: string[]
  industry: string
  employmentType: EmploymentType
  workModel: WorkplaceModel
  targetCurrency: string
}

export interface SalaryRangeValues {
  min: number
  max: number
  median: number
  average: number
}

export interface CompensationBreakdown {
  baseSalary: SalaryRangeValues
  annualSalary: SalaryRangeValues
  monthlySalary: SalaryRangeValues
  hourlyRate: SalaryRangeValues
  bonusEstimate: {
    min: number
    max: number
    average: number
    percentage: number
  }
  stockCompensation: {
    min: number
    max: number
    average: number
    grantYears: number
  }
  signingBonus: {
    min: number
    max: number
    average: number
  }
  totalCompensation: SalaryRangeValues
}

export interface ExperienceBracketSalary {
  bracket: string
  bracketKey: ExperienceBracket
  min: number
  median: number
  max: number
  average: number
  isCurrentLevel: boolean
  formattedMedian: string
}

export interface SkillImpactItem {
  skill: string
  currentStatus: 'possessed' | 'recommended'
  percentageBoost: number
  absoluteIncrease: number
  formattedIncrease: string
  demandLevel: 'Critical' | 'High' | 'Moderate'
  timeframe: string
  iconName?: string
}

export interface CompanyComparisonItem {
  companyName: string
  companyTier: string
  logoText: string
  baseSalary: number
  stockRSUs: number
  annualBonus: number
  totalCompensation: number
  formattedTotal: string
  rating: number
  diffVsCurrentPercent: number
  benefitsHighlights: string[]
  hiringStatus: 'Aggressive' | 'Selective' | 'Steady'
  isUserCompany?: boolean
}

export interface MarketTrendInsights {
  hiringDemand: 'Very High' | 'High' | 'Moderate' | 'Specialized'
  demandScore: number
  threeYearSalaryGrowthPercent: number
  topHiringCompanies: string[]
  highDemandSkills: string[]
  experienceDemandBreakdown: { bracket: string; percentage: number }[]
  industryGrowthRate: string
  dataSourceLabel: string
  dataSamplePeriod: string
  confidenceScore: number
  isLiveBenchmark: boolean
}

export interface CareerRecommendation {
  skillsToLearn: {
    name: string
    estimatedSalaryBoost: string
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  }[]
  certificationsToObtain: {
    name: string
    provider: string
    roi: string
  }[]
  recommendedProjects: {
    title: string
    tech: string[]
    marketAppeal: string
  }[]
  nextCareerRoles: {
    title: string
    timeframe: string
    expectedIncreasePercent: number
    salaryEst: number
    formattedSalary: string
  }[]
  salaryProgressionRoadmap: {
    year: string
    role: string
    projectedSalary: number
    formattedSalary: string
  }[]
}

export interface SalaryPredictionResult {
  id: string
  timestamp: string
  input: SalaryPredictionInput
  primaryCurrency: string
  currencySymbol: string
  exchangeRateToUSD: number
  metrics: CompensationBreakdown
  experienceProgression: ExperienceBracketSalary[]
  skillImpacts: SkillImpactItem[]
  companyComparisons: CompanyComparisonItem[]
  marketTrends: MarketTrendInsights
  careerInsights: CareerRecommendation
  locationCostOfLivingIndex: number
  disclaimerNotice: string
}

export interface SalaryHistoryItem {
  id: string
  title: string
  jobTitle: string
  company: string
  location: string
  totalCompensationFormatted: string
  timestamp: string
  data: SalaryPredictionResult
}
