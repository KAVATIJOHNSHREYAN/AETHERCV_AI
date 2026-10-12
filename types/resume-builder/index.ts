export type EmploymentType = 'full-time' | 'part-time' | 'internship' | 'contract' | 'freelance'

export type LanguageProficiency = 'Beginner' | 'Intermediate' | 'Professional' | 'Native'

export type TemplateId =
  | 'modern-ats'
  | 'classic-ats'
  | 'harvard'
  | 'stanford'
  | 'google'
  | 'minimal'
  | 'executive'
  | 'product-manager'
  | 'software-engineer'
  | 'data-scientist'
  | 'consulting'
  | 'creative'
  | 'finance'
  | 'healthcare'
  | 'student-fresher'
  // Backward compatibility legacy IDs
  | 'microsoft'
  | 'amazon'
  | 'elegant'
  | 'academic-cv'
  | 'sidebar'
  | 'modern-professional'

export type FontFamily =
  | 'inter'
  | 'calibri'
  | 'arial'
  | 'helvetica'
  | 'lato'
  | 'roboto'
  | 'source-sans'
  | 'open-sans'
  | 'georgia'
  | 'cambria'
  | 'times-new-roman'
  // Backward compatibility legacy fonts
  | 'outfit'
  | 'poppins'
  | 'merriweather'
  | 'jetbrains'

export type FontSize = 'sm' | 'md' | 'lg'

export type LineHeight = 'tight' | 'normal' | 'relaxed'

export type Margins = 'compact' | 'normal' | 'spacious'

export type HeaderStyle = 'centered' | 'left' | 'banner' | 'minimal'

export type SectionKey =
  | 'personal'
  | 'summary'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'certifications'
  | 'achievements'
  | 'internships'
  | 'research'
  | 'publications'
  | 'languages'
  | 'volunteer'
  | 'references'
  | 'interests'

export interface PersonalInfo {
  firstName: string
  lastName: string
  professionalTitle: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
  profilePhoto?: string
}

export interface EducationEntry {
  id: string
  degree: string
  university: string
  college?: string
  location: string
  cgpa: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export interface ExperienceEntry {
  id: string
  company: string
  role: string
  location: string
  employmentType: EmploymentType
  startDate: string
  endDate: string
  current: boolean
  responsibilities: string[]
  achievements: string[]
  technologiesUsed: string[]
}

export interface ProjectEntry {
  id: string
  name: string
  description: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  duration?: string
  role?: string
  bulletPoints: string[]
}

export interface SkillCategory {
  category: string
  skills: string[]
}

export interface CertificationEntry {
  id: string
  name: string
  issuer: string
  issueDate: string
  credentialUrl?: string
}

export interface AchievementEntry {
  id: string
  title: string
  description: string
  date?: string
}

export interface LanguageEntry {
  id: string
  language: string
  proficiency: LanguageProficiency
}

export interface CustomizationSettings {
  templateId: TemplateId
  accentColor: string
  fontFamily: FontFamily
  fontSize: FontSize
  lineHeight: LineHeight
  margins: Margins
  showIcons: boolean
  showPhoto: boolean
  headerStyle: HeaderStyle
  sectionOrder: SectionKey[]
  hiddenSections?: SectionKey[]
}

export interface ResumeBuilderData {
  personalInfo: PersonalInfo
  professionalSummary: string
  education: EducationEntry[]
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
  skills: SkillCategory[]
  certifications: CertificationEntry[]
  achievements: AchievementEntry[]
  languages: LanguageEntry[]
  interests: string[]
  internships?: ExperienceEntry[]
  research?: AchievementEntry[]
  publications?: AchievementEntry[]
  volunteer?: AchievementEntry[]
  references?: string[]
  customization: CustomizationSettings
}

export interface AtsBuilderCategoryScore {
  name: string
  score: number
  maxScore: number
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical'
  suggestions: string[]
}

export interface AtsBuilderScore {
  overallScore: number
  overallGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
  categories: {
    contact: AtsBuilderCategoryScore
    summary: AtsBuilderCategoryScore
    experience: AtsBuilderCategoryScore
    education: AtsBuilderCategoryScore
    projects: AtsBuilderCategoryScore
    skills: AtsBuilderCategoryScore
    formatting: AtsBuilderCategoryScore
    metrics: AtsBuilderCategoryScore
  }
  suggestions: string[]
}

export interface ResumeVersion {
  id: string
  name: string
  updatedAt: string
  data: ResumeBuilderData
  atsScore: number
}
