export type InterviewType =
  | 'complete'
  | 'technical'
  | 'coding'
  | 'system_design'
  | 'behavioral'
  | 'hr'
  | 'managerial'
  | 'case_study'
  | 'final_hr'

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'company_level'

export type ExperienceLevel =
  | 'intern'
  | 'entry'
  | 'mid'
  | 'senior'
  | 'lead'
  | 'executive'

export interface InterviewInput {
  inputSource: 'manual' | 'resume' | 'builder'
  resumeText: string
  resumeFileName?: string
  jobDescription: string
  company: string
  jobRole: string
  country: string
  experienceLevel: ExperienceLevel
  difficulty: DifficultyLevel
  interviewType: InterviewType
  customFocusAreas: string[]
}

export interface QuestionEvaluation {
  score: number // 0-100
  communicationRating: number // 0-100
  technicalAccuracy: number // 0-100
  confidenceScore: number // 0-100
  problemSolvingScore: number // 0-100
  grammarProfessionalism: number // 0-100
  strengths: string[]
  weaknesses: string[]
  missingPoints: string[]
  betterAnswer: string
  idealRecruiterAnswer: string
  improvementTips: string[]
  starMethodAssessment?: {
    situation: boolean
    task: boolean
    action: boolean
    result: boolean
    notes: string
  }
}

export interface InterviewQuestion {
  id: string
  questionIndex: number
  roundType: InterviewType
  category:
    | 'technical'
    | 'dsa'
    | 'system_design'
    | 'behavioral'
    | 'hr'
    | 'project_deep_dive'
    | 'situational'
  questionText: string
  interviewerPersona: string
  interviewerTitle: string
  recruiterIntent: string
  suggestedKeyPoints: string[]
  followUps: string[]
  difficulty: DifficultyLevel
  codeTemplate?: string
  expectedComplexity?: string
  systemDesignConstraints?: string[]
  userAnswer?: string
  answeredAt?: string
  evaluation?: QuestionEvaluation
  isFollowUpActive?: boolean
  activeFollowUpQuestion?: string
  followUpAnswer?: string
}

export interface CompanyInterviewInsights {
  companyName: string
  interviewDifficulty: 'Moderate' | 'Hard' | 'Extreme' | 'Challenging'
  commonInterviewFlow: string[]
  hiringTrend: string
  frequentlyAskedTopics: string[]
  mostTestedSkills: string[]
  expectedPreparationAreas: string[]
  candidateReportDisclaimer: string
}

export interface OverallInterviewMetrics {
  technicalAccuracy: number
  communication: number
  problemSolving: number
  confidence: number
  starMethod: number
  leadership: number
  grammarProfessionalism: number
}

export type HireVerdict =
  | 'Strong Hire'
  | 'Hire'
  | 'Leaning Hire'
  | 'Needs Improvement'

export interface OverallInterviewResult {
  id: string
  createdAt: string
  input: InterviewInput
  overallScore: number // 0-100
  verdict: HireVerdict
  recruiterImpression: string
  metrics: OverallInterviewMetrics
  questions: InterviewQuestion[]
  companyInsights: CompanyInterviewInsights
  strengthsSummary: string[]
  weaknessesSummary: string[]
  actionableNextSteps: string[]
  durationMinutes: number
}

export interface TrendingDSAProblem {
  title: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  reportedCompanies: string[]
  frequencyScore: number
}

export interface TrendingInterviewData {
  trendingTechnicalQuestions: string[]
  trendingHRQuestions: string[]
  trendingDSAProblems: TrendingDSAProblem[]
  trendingBehavioralQuestions: string[]
  trendingSystemDesignQuestions: string[]
  lastRefreshedDate: string
  publicReportsSampleCount: number
}

export interface SavedInterviewSession {
  id: string
  date: string
  company: string
  role: string
  interviewType: InterviewType
  overallScore: number
  verdict: HireVerdict
  questionsCount: number
  result: OverallInterviewResult
}
