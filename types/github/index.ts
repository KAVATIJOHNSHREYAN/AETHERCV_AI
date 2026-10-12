export type GitHubReadmeStyle =
  | 'minimalist'
  | 'neon-developer'
  | 'corporate-engineer'
  | 'faang-sde'
  | 'open-source-hero'
  | 'student-fresher'

export interface GitHubRepoItem {
  id: string
  name: string
  description: string
  language: string
  stars: number
  forks: number
  topics: string[]
  isPinned: boolean
  hasReadme: boolean
  hasLicense: boolean
  hasLiveDemo: boolean
  demoUrl?: string
  githubUrl?: string
  license?: string
  healthScore: number // 0-100
  recommendations: string[]
}

export interface GitHubSocialLinks {
  twitter?: string
  linkedin?: string
  website?: string
  email?: string
  youtube?: string
  medium?: string
  devto?: string
}

export interface GitHubTechStack {
  languages: string[]
  frameworks: string[]
  databases: string[]
  cloudDevOps: string[]
  aiMl: string[]
  tools: string[]
}

export interface GitHubProfileData {
  username: string
  name: string
  avatarUrl: string
  bio: string
  company: string
  location: string
  website: string
  twitterUsername: string
  targetRole: string
  yearsOfExperience: string
  readmeContent: string
  readmeStyle: GitHubReadmeStyle
  socialLinks: GitHubSocialLinks
  techStack: GitHubTechStack
  repositories: GitHubRepoItem[]
  achievements: string[] // e.g. "Pull Shark", "Quickdraw", "Arctic Code Vault Contributor"
  contributionsLastYear: number
  streakDays: number
  openToWork: boolean
}

export interface GitHubCategoryScore {
  name: string
  score: number
  maxScore: number
  weight: number
  tips: string[]
}

export interface GitHubReadinessScores {
  portfolioScore: number // 0-100
  recruiterAppeal: number // 0-100
  internshipReadiness: number // 0-100
  placementReadiness: number // 0-100
  faangReadiness: number // 0-100
}

export interface GitHubScoreReport {
  overallScore: number // 0-100
  tier: 'Top 1% Elite' | 'Senior Ready' | 'Intermediate' | 'Needs Polish'
  readiness: GitHubReadinessScores
  categories: {
    profile: GitHubCategoryScore
    readme: GitHubCategoryScore
    repositories: GitHubCategoryScore
    projects: GitHubCategoryScore
    documentation: GitHubCategoryScore
    commitQuality: GitHubCategoryScore
    portfolio: GitHubCategoryScore
    recruiterAppeal: GitHubCategoryScore
    openSource: GitHubCategoryScore
  }
  missingTrendingSkills: string[]
  suggestedProjects: Array<{
    title: string
    description: string
    technologies: string[]
    difficulty: 'Intermediate' | 'Advanced' | 'Enterprise'
    recruiterValue: string
  }>
  aiImprovements: string[]
}
