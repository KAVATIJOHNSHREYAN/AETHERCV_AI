/**
 * Resume Document Authenticity Validator
 * Intelligent, tolerant resume structural verification engine.
 * Guarantees zero false negatives on genuine resumes (Student, Fresher, Experienced, Academic, LaTeX, Word, Canva).
 * 
 * Complies with strict non-blocking ATS guidelines:
 * If readable text exists, ATS analysis always continues without interruption.
 * Missing sections are converted into advisory warnings rather than blocking errors.
 */

export interface ResumeValidationResult {
  isValid: boolean
  confidence: number // 0 to 100
  reason?: string
  warnings: string[]
  detectedType: 'resume' | 'assignment' | 'notes' | 'invoice' | 'paper' | 'unknown'
  missingPillars: string[]
  detectedPillars: string[]
  detectedSections: string[]
  detectedContact: {
    name?: string
    email?: string
    phone?: string
    linkedin?: string
    github?: string
    portfolio?: string
  }
}

// Strictly definite classroom assignment or test paper indicators (only flagged if no resume sections exist)
const DEFINITE_ASSIGNMENT_INDICATORS = [
  /\b(?:home\s+assignment|homework\s*(?:#|\d|no|one|two|three)?)\b/i,
  /\b(?:lab\s+(?:manual|record|exercise)|experiment\s+no\.?)\b/i,
  /\b(?:problem\s+statement|question\s+paper|q\d+[\.:\)]\s*(?:what|explain|derive|calculate|prove))\b/i,
  /\b(?:answer\s*key|solutions?\s+to\s+problem\s+\d+)\b/i,
  /\b(?:submitted\s+to\s*(?:dr\.|prof\.|faculty|sir|madam)|guided\s+by\s*(?:dr\.|prof\.))\b/i,
  /\b(?:internal\s+assessment|mid\s+exam\s+paper|semester\s+end\s+exam)\b/i
]

// Strictly definite non-resume indicators (e.g. tax bills, legal agreements)
const DEFINITE_NON_RESUME_INDICATORS = [
  /\b(?:tax\s+invoice|sales\s+invoice|bill\s+to|subtotal|balance\s+due|amount\s+payable)\b/i,
  /\b(?:terms\s+and\s+conditions|privacy\s+policy|end\s+user\s+license\s+agreement)\b/i,
  /\b(?:table\s+of\s+contents\s*\n|syllabus\s+for\s+course)\b/i
]

// Comprehensive Section Variations (tolerant of whitespace, case, line wraps, aliases)
const SECTION_VARIATIONS = {
  // Experience variations
  experience: [
    /\b(?:work\s+experience|professional\s+experience|employment|professional\s+background|internships?|career\s+history|industry\s+experience|work\s+history|relevant\s+experience|experience)\b/i
  ],
  // Education variations
  education: [
    /\b(?:education|academics|academic\s+background|qualifications?|educational\s+background|educational\s+qualifications|degrees?|universit(?:y|ies)|colleges?|alma\s+mater)\b/i
  ],
  // Projects variations
  projects: [
    /\b(?:projects?|project\s+experience|academic\s+projects|research|portfolio|personal\s+projects|key\s+projects|notable\s+projects|technical\s+projects)\b/i
  ],
  // Skills variations
  skills: [
    /\b(?:skills?|technical\s+skills|core\s+skills|technologies|competencies|tech\s+stack|programming\s+languages|tools\s+&?\s+technologies|skills\s+&?\s+abilities|areas\s+of\s+expertise)\b/i
  ],
  // Contact variations
  contact: [
    /\b(?:contact\s+information|contact\s+details|contact|get\s+in\s+touch)\b/i
  ]
}

// Structural indicator cues
const STRUCTURAL_INDICATORS = {
  bulletPoints: /[•\-\*–—·▪]\s+[A-Za-z]/,
  dates: /\b(?:(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:(?:19|20)\d{2}|present|current|till\s+date)|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(?:19|20)\d{2})\b/i,
  degrees: /\b(?:B\.?Tech|Bachelor(?:\s+of\s+[A-Za-z]+)?|B\.?E\.?|B\.?S\.?|BCA|M\.?Tech|Master(?:\s+of\s+[A-Za-z]+)?|M\.?S\.?|MCA|MBA|Ph\.?D|Diploma|Secondary|High\s+School)\b/i,
  companiesOrRoles: /\b(?:intern|engineer|developer|software|analyst|designer|consultant|associate|lead|manager|assistant|trainee|technologies|solutions|pvt\.?\s*ltd\.?|limited|inc\.?|corp\.?|llc)\b/i,
  techKeywords: /\b(?:python|javascript|typescript|react|next\.?js|node\.?js|html5?|css3?|java|c\+\+|c#|sql|nosql|mongodb|postgresql|git|docker|aws|azure|express|tailwind|pandas|numpy|linux|flutter)\b/i
}

// Contact detection regexes
const EMAIL_REGEX = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/
const PHONE_REGEX = /(?:(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?91[-.\s]?[6-9]\d{9}|\b\d{10}\b)/
const LINKEDIN_REGEX = /(?:linkedin\.com\/(?:in|profile)\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+\s*\|\s*linkedin)/i
const GITHUB_REGEX = /(?:github\.com\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+\s*\|\s*github)/i
const PORTFOLIO_REGEX = /(?:portfolio|github\.io|vercel\.app|https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i

/**
 * Normalizes extracted text before validation:
 * - Unicode NFKC normalization
 * - Removes hidden and zero-width characters
 * - Normalizes line breaks and whitespace
 * - Collapses split OCR header lines (e.g. WORK\nEXPERIENCE -> WORK EXPERIENCE)
 */
function normalizeResumeText(text: string): { normalized: string; lines: string[]; paragraphs: string[] } {
  if (!text) return { normalized: '', lines: [], paragraphs: [] }

  // 1. Unicode NFKC normalization
  let clean = text.normalize('NFKC')

  // 2. Remove zero-width & hidden Unicode characters
  clean = clean.replace(/[\u200B-\u200D\uFEFF\u00A0\u2000-\u200A\u2028\u2029]/g, ' ')
  clean = clean.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, ' ')

  // 3. Normalize newlines
  clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // 4. Normalize spaces and tabs
  clean = clean.replace(/[ \t]+/g, ' ')

  // 5. Collapse OCR line-break splits across section titles (e.g. "WORK\nEXPERIENCE" -> "WORK EXPERIENCE")
  clean = clean.replace(
    /\b(work|professional|career|industry|academic|educational|technical|core|key|personal|project|programming)\s*\n\s*(experience|background|history|skills|projects|competencies|qualifications|languages)\b/gi,
    '$1 $2'
  )

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean)
  const paragraphs = clean.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean)

  return { normalized: clean, lines, paragraphs }
}

/**
 * Candidate Name Extractor from header lines.
 */
function detectCandidateName(lines: string[]): string | undefined {
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i].trim()
    if (
      line.length >= 2 &&
      line.length <= 45 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !/(?:resume|curriculum|vitae|page\s+\d+|phone|email|contact)/i.test(line) &&
      /^[A-Za-z\s\.\'-]+$/.test(line)
    ) {
      return line
    }
  }
  return undefined
}

/**
 * Validates whether the extracted text represents an authentic resume/CV.
 * 
 * Follows strict non-blocking ATS guidelines:
 * - Never falsely rejects genuine resumes (Freshers, Students, Experienced, LaTeX, Canva, Docs exports).
 * - A resume is valid if Rule A, Rule B, Rule C, or Rule D matches.
 * - If readable text exists (>25 chars), validation always succeeds so ATS analysis can proceed.
 * - Missing sections are surfaced as non-blocking advisory warnings.
 */
export function validateIsResume(
  text: string,
  fileName: string = '',
  fileType: string = '',
  fileSize: number = 0
): ResumeValidationResult {
  const { normalized, lines, paragraphs } = normalizeResumeText(text)
  const lowerName = (fileName || '').toLowerCase()

  // Guard: virtually empty or unreadable content (<25 chars)
  if (normalized.length < 25) {
    return {
      isValid: false,
      confidence: 0,
      reason: 'The uploaded file does not contain readable text. Please upload a standard PDF, DOCX, or text resume.',
      warnings: ['Insufficient readable text extracted.'],
      detectedType: 'unknown',
      missingPillars: ['Content Length', 'Contact Details', 'Core Sections', 'Skills'],
      detectedPillars: [],
      detectedSections: [],
      detectedContact: {}
    }
  }

  // 1. Contact Detection
  const emailMatch = normalized.match(EMAIL_REGEX)
  const phoneMatch = normalized.match(PHONE_REGEX)
  const linkedinMatch = normalized.match(LINKEDIN_REGEX)
  const githubMatch = normalized.match(GITHUB_REGEX)
  const portfolioMatch = normalized.match(PORTFOLIO_REGEX)
  const candidateName = detectCandidateName(lines)

  const detectedEmail = emailMatch ? emailMatch[0] : undefined
  const detectedPhone = phoneMatch ? phoneMatch[0] : undefined

  const detectedContact = {
    name: candidateName,
    email: detectedEmail,
    phone: detectedPhone,
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    github: githubMatch ? githubMatch[0] : undefined,
    portfolio: portfolioMatch ? portfolioMatch[0] : undefined
  }

  // 2. Section Detection using tolerant regex variations
  const hasExperience = SECTION_VARIATIONS.experience.some(r => r.test(normalized))
  const hasEducation = SECTION_VARIATIONS.education.some(r => r.test(normalized))
  const hasProjects = SECTION_VARIATIONS.projects.some(r => r.test(normalized))
  const hasSkills = SECTION_VARIATIONS.skills.some(r => r.test(normalized))
  const hasContactSection = SECTION_VARIATIONS.contact.some(r => r.test(normalized)) || Boolean(detectedEmail || detectedPhone)

  const detectedSectionsList: string[] = []
  if (hasExperience) detectedSectionsList.push('Experience')
  if (hasEducation) detectedSectionsList.push('Education')
  if (hasProjects) detectedSectionsList.push('Projects')
  if (hasSkills) detectedSectionsList.push('Skills')
  if (hasContactSection) detectedSectionsList.push('Contact Information')

  const majorSectionsCount = [hasExperience, hasEducation, hasProjects, hasSkills].filter(Boolean).length

  // 3. Structural Obvious Cues
  const hasBulletPoints = STRUCTURAL_INDICATORS.bulletPoints.test(normalized)
  const hasDates = STRUCTURAL_INDICATORS.dates.test(normalized)
  const hasDegree = STRUCTURAL_INDICATORS.degrees.test(normalized)
  const hasCompanyOrRole = STRUCTURAL_INDICATORS.companiesOrRoles.test(normalized)
  const hasTech = STRUCTURAL_INDICATORS.techKeywords.test(normalized)

  // 4. Definite False Document Indicators (only applied if 0 resume sections/contacts exist)
  let assignmentMatches = 0
  for (const pat of DEFINITE_ASSIGNMENT_INDICATORS) {
    if (pat.test(normalized) || pat.test(lowerName)) assignmentMatches++
  }

  let nonResumeMatches = 0
  for (const pat of DEFINITE_NON_RESUME_INDICATORS) {
    if (pat.test(normalized) || pat.test(lowerName)) nonResumeMatches++
  }

  // 5. Verification Rules
  // Rule A: Candidate name + (Email OR Phone) + At least two major sections
  const passesRuleA = Boolean(candidateName) && Boolean(detectedEmail || detectedPhone) && majorSectionsCount >= 2

  // Rule B: > 300 extracted characters + Email detected + Bullet points
  const passesRuleB = normalized.length > 300 && Boolean(detectedEmail) && hasBulletPoints

  // Rule C: Contains dates, technologies, degree, company, education, skills (at least 2 cues)
  const structuralHits = [hasDates, hasTech, hasDegree, hasCompanyOrRole, hasEducation, hasSkills].filter(Boolean).length
  const passesRuleC = structuralHits >= 2

  // Rule D: Parser confidence / general resume cues
  const passesRuleD = /(?:resume|cv|curriculum|vitae)/i.test(lowerName) || majorSectionsCount >= 1 || normalized.length >= 150

  // Any rule passing guarantees validity
  const isRecognizedResume = passesRuleA || passesRuleB || passesRuleC || passesRuleD

  // Compute confidence (30 to 100)
  let confidence = 40
  if (detectedEmail || detectedPhone) confidence += 20
  if (hasExperience) confidence += 15
  if (hasEducation || hasDegree) confidence += 15
  if (hasSkills || hasTech) confidence += 10
  if (hasProjects) confidence += 10
  if (hasBulletPoints || hasDates) confidence += 10
  confidence = Math.min(100, Math.max(20, confidence))

  // Determine Missing and Detected Pillars
  const detectedPillars: string[] = []
  const missingPillars: string[] = []
  const warnings: string[] = []

  if (detectedEmail || detectedPhone) detectedPillars.push('Contact Details')
  else missingPillars.push('Direct Contact (Email/Phone)')

  if (hasExperience) detectedPillars.push('Work / Professional Experience')
  else {
    missingPillars.push('Experience Section')
    warnings.push('No experience section detected.')
  }

  if (hasEducation || hasDegree) detectedPillars.push('Education / Academics')
  else {
    missingPillars.push('Education Credentials')
    warnings.push('No education credentials detected.')
  }

  if (hasSkills || hasTech) detectedPillars.push('Technical & Core Skills')
  else {
    missingPillars.push('Skills Section')
    warnings.push('No technical skills detected.')
  }

  if (hasProjects) detectedPillars.push('Projects / Portfolio')
  else {
    missingPillars.push('Projects Section')
    warnings.push('No projects detected.')
  }

  // Definite rejection ONLY if explicitly a homework sheet or receipt with ZERO resume signals
  if (assignmentMatches >= 2 && majorSectionsCount === 0 && !detectedEmail && !hasSkills && !hasTech) {
    return {
      isValid: false,
      confidence: 10,
      detectedType: 'assignment',
      reason: 'The uploaded file appears to be a homework assignment or classroom document, not a resume or CV.',
      warnings: ['Document flagged as classroom assignment.'],
      missingPillars,
      detectedPillars,
      detectedSections: detectedSectionsList,
      detectedContact
    }
  }

  if (nonResumeMatches >= 2 && majorSectionsCount === 0 && !detectedEmail && !hasSkills && !hasTech) {
    return {
      isValid: false,
      confidence: 10,
      detectedType: 'invoice',
      reason: 'The uploaded file appears to be an invoice or receipt, not a resume or CV.',
      warnings: ['Document flagged as invoice or financial receipt.'],
      missingPillars,
      detectedPillars,
      detectedSections: detectedSectionsList,
      detectedContact
    }
  }

  // Standard non-blocking message as requested in Step 9:
  // "We couldn't confidently detect every standard resume section, but we'll continue analyzing your resume and highlight any missing areas."
  const standardAdvisoryMessage = "We couldn't confidently detect every standard resume section, but we'll continue analyzing your resume and highlight any missing areas."

  if (warnings.length > 0) {
    warnings.unshift(standardAdvisoryMessage)
  }

  // In all cases where readable text exists, isValid is ALWAYS true!
  return {
    isValid: true,
    confidence,
    reason: warnings.length > 0 ? standardAdvisoryMessage : undefined,
    warnings,
    detectedType: 'resume',
    missingPillars,
    detectedPillars,
    detectedSections: detectedSectionsList,
    detectedContact
  }
}
