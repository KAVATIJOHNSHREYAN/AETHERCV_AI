export interface EducationItem {
  degree: string
  institution: string
  year: string
  cgpaOrGpa?: string
  fieldOfStudy?: string
  isComplete: boolean
  missingDetails: string[]
}

export interface ExperienceItem {
  title: string
  company: string
  location?: string
  startDate?: string
  endDate?: string
  isCurrent?: boolean
  description: string
  responsibilities: string[]
  achievements: string[]
  actionVerbs: string[]
  quantifiedMetrics: string[]
  strengthScore: number // 0 - 100
  suggestions: string[]
}

export interface ProjectItem {
  name: string
  description: string
  technologies: string[]
  responsibilities: string[]
  achievements: string[]
  businessImpact?: string
  technicalDepth: 'Basic' | 'Intermediate' | 'Advanced'
  missingMetrics: string[]
  suggestions: string[]
}

export interface CategorizedSkills {
  programmingLanguages: string[]
  frameworks: string[]
  libraries: string[]
  databases: string[]
  cloudPlatforms: string[]
  devOpsTools: string[]
  aiMlSkills: string[]
  softSkills: string[]
  other: string[]
}

export interface ContactInfo {
  name: string
  email: string
  phone: string
  address: string
  linkedin: string
  github: string
  portfolio: string
}

export interface ParsedResume {
  contact: ContactInfo
  summary: string
  education: EducationItem[]
  experience: ExperienceItem[]
  projects: ProjectItem[]
  skills: CategorizedSkills
  rawSkillsList: string[]
  certifications: string[]
  achievements: string[]
  languages: string[]
  interests: string[]
  rawText: string
}

export interface CategoryScore {
  name: string
  score: number
  maxScore: number
  percentage: number
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical'
  feedback: string
  suggestions: string[]
}

export interface AtsScoreBreakdown {
  overallScore: number
  overallGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
  overallSummary: string
  categories: {
    contactInfo: CategoryScore
    professionalSummary: CategoryScore
    education: CategoryScore
    experience: CategoryScore
    projects: CategoryScore
    skills: CategoryScore
    certifications: CategoryScore
    formatting: CategoryScore
    actionVerbs: CategoryScore
    keywordOptimization: CategoryScore
  }
}

export interface SectionDetectionResult {
  summary: { present: boolean; recommendation?: string }
  education: { present: boolean; recommendation?: string }
  skills: { present: boolean; recommendation?: string }
  experience: { present: boolean; recommendation?: string }
  projects: { present: boolean; recommendation?: string }
  certifications: { present: boolean; recommendation?: string }
  languages: { present: boolean; recommendation?: string }
  achievements: { present: boolean; recommendation?: string }
}

export interface KeywordAnalysisResult {
  mostFrequent: { word: string; count: number }[]
  missingImportant: string[]
  duplicateKeywords: { word: string; count: number }[]
  weakKeywords: { word: string; reason: string; replacement: string }[]
  strongKeywords: string[]
  suggestions: string[]
}

export interface ActionVerbAnalysisResult {
  totalCount: number
  uniqueVerbsFound: string[]
  frequencyMap: { [verb: string]: number }
  densityScore: number // percentage of sentences starting with or containing action verbs
  weakVerbsUsed: { verb: string; suggestedReplacement: string }[]
  suggestions: string[]
}

export interface FormattingAnalysisResult {
  estimatedPages: number
  wordCount: number
  characterCount: number
  readingTimeMinutes: number
  bulletPointCount: number
  bulletToParagraphRatio: number
  averageSentenceLength: number
  fleschReadingEase: number
  readabilityGrade: string
  sectionOrderOptimal: boolean
  paragraphDensityWarning: boolean
  whitespaceBalanceScore: number // 0-100
  warnings: string[]
  positives: string[]
}

export interface SentenceRewriteSuggestion {
  original: string
  improved: string
  improvementType: 'quantified_metrics' | 'stronger_action_verb' | 'conciseness' | 'impact_focus'
  explanation: string
}

export interface AIFeedbackReport {
  professionalReview: string
  recruiterPerspective: string
  grammarSuggestions: { original: string; suggested: string; note: string }[]
  readabilityImprovements: string[]
  projectImprovements: string[]
  experienceImprovements: string[]
  skillsSuggestions: string[]
  careerAdvice: string[]
  resumeSummary: string
  overallFeedback: string
  sentenceRewrites: SentenceRewriteSuggestion[]
}

export interface JDMatchResult {
  matchPercentage: number
  matchTier: 'Perfect Match' | 'Strong Match' | 'Moderate Match' | 'Low Match'
  jobTitleDetected?: string
  matchedKeywords: string[]
  missingKeywords: string[]
  matchedSkills: string[]
  missingSkills: string[]
  missingTechnologies: string[]
  missingCertifications: string[]
  tailoredRecommendations: string[]
  atsKeywordAlignmentScore: number
}

export interface RewrittenResumeContent {
  fullResumeMarkdown: string
  summary: string
  projects: { name: string; content: string }[]
  experience: { company: string; role: string; content: string }[]
  skillsSection: string
}

export interface ResumeAnalysisHistoryItem {
  id: string
  fileName: string
  fileSize: number
  fileType: string
  timestamp: string
  candidateName: string
  atsScore: number
  matchScore?: number
  parsedData: ParsedResume
  atsBreakdown: AtsScoreBreakdown
  aiFeedback: AIFeedbackReport
  formatting: FormattingAnalysisResult
}
