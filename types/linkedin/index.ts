export type HeadlineStyle =
  | 'professional'
  | 'corporate'
  | 'startup'
  | 'faang'
  | 'student'
  | 'experienced'

export type AboutStyle =
  | 'professional'
  | 'executive'
  | 'startup'
  | 'corporate'
  | 'recruiter'
  | 'student'

export type TargetRole =
  | 'software-engineer'
  | 'ai-engineer'
  | 'full-stack'
  | 'data-scientist'
  | 'cloud-engineer'
  | 'product-manager'
  | 'devops-engineer'
  | 'cyber-security'
  | 'frontend-developer'
  | 'backend-developer'

export interface LinkedInExperience {
  id: string
  company: string
  role: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  bulletPoints: string[]
  skillsUsed: string[]
}

export interface LinkedInEducation {
  id: string
  school: string
  degree: string
  fieldOfStudy: string
  startDate: string
  endDate: string
  grade?: string
  activities?: string
}

export interface LinkedInProject {
  id: string
  title: string
  description: string
  problem?: string
  solution?: string
  technologies: string[]
  impact?: string
  url?: string
}

export interface LinkedInCertification {
  id: string
  name: string
  issuer: string
  issueDate: string
  credentialUrl?: string
}

export interface LinkedInFeatured {
  id: string
  title: string
  type: 'post' | 'article' | 'link' | 'media'
  url?: string
  description?: string
}

export interface LinkedInVolunteer {
  id: string
  organization: string
  role: string
  cause: string
}

export interface LinkedInProfileData {
  fullName: string
  headline: string
  location: string
  customUrl: string
  openToWork: boolean
  targetRoles: string[]
  profilePhoto?: string
  bannerGradient: string
  about: string
  experience: LinkedInExperience[]
  education: LinkedInEducation[]
  projects: LinkedInProject[]
  skills: string[]
  certifications: LinkedInCertification[]
  featured: LinkedInFeatured[]
  volunteer: LinkedInVolunteer[]
  languages: string[]
  recommendationsCount: number
}

export interface LinkedInCategoryScore {
  name: string
  score: number
  maxScore: number
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical'
  tips: string[]
}

export interface LinkedInChecklistItem {
  id: string
  label: string
  completed: boolean
  weight: number
  tip: string
}

export interface LinkedInScoreReport {
  overallScore: number
  tier: 'All-Star' | 'Advanced' | 'Intermediate' | 'Beginner'
  recruiterRating: 'Elite Tier' | 'High Visibility' | 'Moderate Reach' | 'Needs Optimization'
  completionPercentage: number
  categories: {
    headline: LinkedInCategoryScore
    about: LinkedInCategoryScore
    experience: LinkedInCategoryScore
    projects: LinkedInCategoryScore
    skills: LinkedInCategoryScore
    seoKeywords: LinkedInCategoryScore
    recruiterAppeal: LinkedInCategoryScore
    completeness: LinkedInCategoryScore
    networkingStrength: LinkedInCategoryScore
    personalBranding: LinkedInCategoryScore
  }
  checklist: LinkedInChecklistItem[]
  seoMetrics: {
    densityScore: number
    keywordMatches: string[]
    missingKeywords: string[]
    searchRankingEstimate: string
  }
  aiSuggestions: Array<{
    section: string
    title: string
    description: string
    suggestedText?: string
  }>
}
