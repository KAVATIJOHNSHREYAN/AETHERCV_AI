export type ResumeInputMode = 'upload' | 'builder' | 'analyzer' | 'paste'
export type JobTargetInputMode = 'role' | 'jd'

export type SkillMatchLevel =
  | 'Excellent Match'
  | 'Strong Match'
  | 'Moderate Match'
  | 'Needs Improvement'
  | 'Poor Match'

export type SkillCategory =
  | 'Programming Languages'
  | 'Frontend'
  | 'Backend'
  | 'Cloud'
  | 'DevOps'
  | 'AI'
  | 'Machine Learning'
  | 'Databases'
  | 'Tools'
  | 'Frameworks'
  | 'Soft Skills'

export interface MatchedSkill {
  name: string
  category: SkillCategory
  proficiencyEstimate: 'Proficient' | 'Advanced' | 'Demonstrated'
  matchedContext?: string
}

export interface MissingSkill {
  name: string
  category: SkillCategory
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority'
  reason: string
  learningDifficulty: 'Easy' | 'Moderate' | 'Challenging'
  estimatedHours?: number
}

export interface MissingKeyword {
  keyword: string
  importance: 'Critical' | 'High' | 'Medium'
  occurrenceInJd: string
  naturalAdditionTip: string
  targetSection: 'Summary' | 'Experience' | 'Projects' | 'Skills'
}

export interface ExperienceGap {
  yearsRequired: number
  yearsMentioned: number
  gapExplanation: string
  responsibilitiesGap: string[]
  leadershipScore: number // 0-100
  architectureScore: number // 0-100
  ownershipScore: number // 0-100
  projectScaleAssessment: string
}

export interface ProjectRecommendation {
  id: string
  title: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  technologies: string[]
  estimatedTime: string
  resumeValue: 'High' | 'Very High' | 'Crucial'
  description: string
  keyDeliverables: string[]
  githubArchitecture: string
}

export interface CertificationRecommendation {
  id: string
  name: string
  issuer: string
  difficulty: 'Foundational' | 'Associate' | 'Professional' | 'Expert'
  duration: string
  careerImpact: 'High' | 'Very High' | 'Essential'
  officialUrl?: string
  description: string
}

export interface RoadmapWeek {
  weekRange: string
  title: string
  goals: string[]
  milestones: string[]
  keySkills: string[]
  projectDeliverable?: string
}

export interface MarketDemand {
  role: string
  hiringDemand: 'Very High' | 'High' | 'Moderate'
  averageSalary: string
  salaryRange: string
  topHiringCompanies: string[]
  experienceLevel: string
  remoteOpportunities: string
  growthTrend: string
  jobOpeningsEstimate: string
}

export interface ResumeBulletImprovement {
  original: string
  improved: string
  reason: string
}

export interface ResumeImprovements {
  missingSections: string[]
  weakBulletPoints: ResumeBulletImprovement[]
  missingMetrics: string[]
  weakSummaryTips: string[]
  weakSkillsTips: string[]
  recruiterTips: string[]
}

export interface ActionPlanItem {
  id: string
  task: string
  category: string
  priority: 'High' | 'Medium' | 'Low'
  completed: boolean
  impact: string
}

export interface ReadinessMetrics {
  resumeReadiness: number
  technicalReadiness: number
  placementReadiness: number
  interviewReadiness: number
}

export interface SkillGapAnalysisResult {
  id: string
  timestamp: string
  candidateName: string
  targetRole: string
  overallScore: number
  matchLevel: SkillMatchLevel
  summaryHeadline: string
  matchedSkills: MatchedSkill[]
  missingSkills: MissingSkill[]
  missingKeywords: MissingKeyword[]
  experienceGap: ExperienceGap
  projectRecommendations: ProjectRecommendation[]
  certifications: CertificationRecommendation[]
  learningRoadmap: RoadmapWeek[]
  marketDemand: MarketDemand
  resumeImprovements: ResumeImprovements
  actionPlan: ActionPlanItem[]
  readinessMetrics: ReadinessMetrics
  parsedResumeSnippet: {
    textLength: number
    detectedRole?: string
    contactFound?: boolean
  }
  jdSnippet: string
}

export interface SkillGapHistoryItem {
  id: string
  title: string
  targetRole: string
  overallScore: number
  matchLevel: SkillMatchLevel
  timestamp: string
  candidateName: string
  data: SkillGapAnalysisResult
}
