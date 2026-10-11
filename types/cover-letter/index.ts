export type WritingTone =
  | 'professional'
  | 'corporate'
  | 'startup'
  | 'modern'
  | 'creative'
  | 'technical'
  | 'formal'
  | 'confident'
  | 'friendly'
  | 'executive'

export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote'
export type WorkplaceType = 'remote' | 'hybrid' | 'on-site'

export interface JobDetails {
  companyName: string
  jobTitle: string
  hiringManager?: string
  jobDescription: string
  yearsOfExperience?: string
  location?: string
  employmentType?: string
  workplaceType?: WorkplaceType
  tone: WritingTone
}

export interface GeneratedCoverLetter {
  id: string
  candidateName: string
  candidateEmail?: string
  candidatePhone?: string
  candidateLocation?: string
  recipientName: string
  recipientTitle: string
  companyName: string
  jobTitle: string
  date: string
  greeting: string
  openingParagraph: string
  skillsParagraph: string
  experienceParagraph: string
  projectsParagraph: string
  whyCompanyParagraph: string
  closingParagraph: string
  signOff: string
  fullMarkdown: string
  fullPlainText: string
  matchedSkills: string[]
  missingSkillsHighlight: string[]
  extractedKeywords: string[]
  toneUsed: WritingTone
  createdAt: string
  updatedAt: string
}

export interface SavedCoverLetterRecord {
  id: string
  title: string
  companyName: string
  jobRole: string
  tone: WritingTone
  createdAt: string
  updatedAt: string
  letter: GeneratedCoverLetter
  resumeSummary?: {
    candidateName: string
    skillsCount: number
    experienceCount: number
  }
}
