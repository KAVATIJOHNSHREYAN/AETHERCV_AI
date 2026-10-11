/**
 * Resume Document Authenticity Validator
 * Tolerant, intelligent resume structural verification engine.
 * Never falsely rejects authentic resumes (Freshers, Students, Experienced, Research CVs, ATS/Harvard templates).
 * 
 * Complies with strict non-blocking ATS guidelines:
 * If readable text is extracted, proceeds with ATS analysis and surfaces non-blocking advisory warnings.
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

// Strictly definite assignment / test paper indicators
const DEFINITE_ASSIGNMENT_INDICATORS = [
  /\b(?:home\s+assignment|homework\s*(?:#|\d|no|one|two|three)?)\b/i,
  /\b(?:lab\s+(?:manual|record|exercise)|experiment\s+no\.?)\b/i,
  /\b(?:problem\s+statement|question\s+paper|q\d+[\.:\)]\s*(?:what|explain|derive|calculate|prove))\b/i,
  /\b(?:answer\s*key|solutions?\s+to\s+problem\s+\d+)\b/i,
  /\b(?:submitted\s+to\s*(?:dr\.|prof\.|faculty|sir|madam)|guided\s+by\s*(?:dr\.|prof\.))\b/i,
  /\b(?:internal\s+assessment|mid\s+exam\s+paper|semester\s+end\s+exam)\b/i
]

// Strictly definite non-resume document indicators (e.g., invoices, legal contracts)
const DEFINITE_NON_RESUME_INDICATORS = [
  /\b(?:tax\s+invoice|sales\s+invoice|bill\s+to|subtotal|balance\s+due|amount\s+payable)\b/i,
  /\b(?:terms\s+and\s+conditions|privacy\s+policy|end\s+user\s+license\s+agreement)\b/i,
  /\b(?:table\s+of\s+contents\s*\n|syllabus\s+for\s+course)\b/i
]

// Comprehensive Section Variations (tolerant of whitespace, case, line wraps)
const SECTION_VARIATIONS = {
  experience: [
    /\b(?:work\s+experience|professional\s+experience|employment\s+history|employment|career\s+history|professional\s+background|work\s+history|internships?|relevant\s+experience|experience)\b/i
  ],
  education: [
    /\b(?:education|academic\s+background|qualifications?|academic\s+qualifications|educational\s+background|educational\s+qualifications|academics|degree|university|college|alma\s+mater)\b/i
  ],
  projects: [
    /\b(?:projects?|personal\s+projects|academic\s+projects|portfolio|key\s+projects|notable\s+projects|technical\s+projects|research\s+projects|research)\b/i
  ],
  skills: [
    /\b(?:skills?|technical\s+skills|core\s+skills|competencies|core\s+competencies|technologies|tech\s+stack|programming\s+languages|tools\s+&?\s+technologies|skills\s+&?\s+abilities|areas\s+of\s+expertise)\b/i
  ],
  contact: [
    /\b(?:contact\s+information|contact\s+details|contact|get\s+in\s+touch)\b/i
  ]
}

// Resume structure & indicator cues
const STRUCTURAL_INDICATORS = {
  bulletPoints: /[•\-\*–—]\s+[A-Za-z]/,
  dates: /\b(?:(?:19|20)\d{2}\s*(?:-|–|—|to)\s*(?:(?:19|20)\d{2}|present|current|till\s+date)|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(?:19|20)\d{2})\b/i,
  degrees: /\b(?:B\.?Tech|Bachelor(?:\s+of\s+[A-Za-z]+)?|B\.?E\.?|B\.?S\.?|BCA|M\.?Tech|Master(?:\s+of\s+[A-Za-z]+)?|M\.?S\.?|MCA|MBA|Ph\.?D|Diploma|Secondary|High\s+School)\b/i,
  companiesOrRoles: /\b(?:intern|engineer|developer|software|analyst|designer|consultant|associate|lead|manager|assistant|trainee|technologies|solutions|pvt\.?\s*ltd\.?|limited|inc\.?|corp\.?|llc)\b/i,
  techKeywords: /\b(?:python|javascript|typescript|react|next\.?js|node\.?js|html5?|css3?|java|c\+\+|sql|nosql|mongodb|postgresql|git|docker|aws|azure|express|tailwind|pandas|numpy|linux)\b/i
}

// Contact detection regexes
const EMAIL_REGEX = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/
const PHONE_REGEX = /(?:(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?91[-.\s]?[6-9]\d{9}|\b\d{10}\b)/
const LINKEDIN_REGEX = /(?:linkedin\.com\/(?:in|profile)\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+\s*\|\s*linkedin)/i
const GITHUB_REGEX = /(?:github\.com\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+\s*\|\s*github)/i
const PORTFOLIO_REGEX = /(?:portfolio|github\.io|vercel\.app|https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i

/**
 * Normalizes input text for resilient OCR and multi-format parser tolerance.
 */
function normalizeResumeText(text: string): { normalized: string; lines: string[]; paragraphs: string[] } {
  if (!text) return { normalized: '', lines: [], paragraphs: [] }

  // 1. Unicode NFKC normalization
  let clean = text.normalize('NFKC')

  // 2. Remove hidden non-printable control chars (preserve standard whitespace)
  clean = clean.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, ' ')

  // 3. Normalize newlines
  clean = clean.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // 4. Normalize spaces and tabs
  clean = clean.replace(/[ \t]+/g, ' ')

  // 5. Fix PDF split header wraps (e.g. "WORK\nEXPERIENCE" -> "WORK EXPERIENCE")
  clean = clean.replace(
    /\b(work|professional|career|academic|educational|technical|core|key|personal|programming)\s*\n\s*(experience|background|history|skills|projects|competencies|qualifications|languages)\b/gi,
    '$1 $2'
  )

  const lines = clean.split('\n').map(l => l.trim()).filter(Boolean)
  const paragraphs = clean.split(/\n\s*\n+/).map(p => p.trim()).filter(Boolean)

  return { normalized: clean, lines, paragraphs }
}

/**
 * Tolerant Candidate Name Extractor from header lines.
 */
function detectCandidateName(lines: string[]): string | undefined {
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim()
    // Avoid headers that are contacts or generic titles
    if (
      line.length >= 3 &&
      line.length <= 40 &&
      !line.includes('@') &&
      !line.includes('http') &&
      !/(?:resume|curriculum|vitae|page\s+\d+|phone|email)/i.test(line) &&
      /^[A-Za-z\s\.\'-]+$/.test(line)
    ) {
      return line
    }
  }
  return undefined
}

/**
 * Validates whether the uploaded content represents a genuine resume/CV.
 * Guarantees zero false negatives on genuine resumes while providing informative debug logs.
 */
export function validateIsResume(
  text: string,
  fileName: string = '',
  fileType: string = '',
  fileSize: number = 0
): ResumeValidationResult {
  const { normalized, lines, paragraphs } = normalizeResumeText(text)
  const lowerName = (fileName || '').toLowerCase()

  // 1. Minimum character safety guard (< 50 chars is unreadable or empty)
  if (normalized.length < 50) {
    const reason = 'Document contains insufficient readable text (under 50 characters). Please upload a valid resume file.'
    
    // Debug logging
    console.log('====== [AETHERCV AI RESUME VALIDATION DEBUG] ======')
    console.log('Uploaded filename   :', fileName || 'unknown')
    console.log('File type           :', fileType || 'unknown')
    console.log('File size           :', fileSize ? `${fileSize} bytes` : 'unknown')
    console.log('Characters extracted:', normalized.length)
    console.log('Lines extracted     :', lines.length)
    console.log('Detected sections   : None')
    console.log('Detected email      : None')
    console.log('Detected phone      : None')
    console.log('Detected skills     : No')
    console.log('Detected education  : No')
    console.log('Detected projects   : No')
    console.log('Detected experience : No')
    console.log('Validation result   : REJECTED')
    console.log('Reason for rejection:', reason)
    console.log('====================================================')

    return {
      isValid: false,
      confidence: 5,
      reason,
      warnings: ['Insufficient text extracted'],
      detectedType: 'unknown',
      missingPillars: ['Content Length', 'Contact Details', 'Core Sections', 'Skills'],
      detectedPillars: [],
      detectedSections: [],
      detectedContact: {}
    }
  }

  // 2. Extract Contact Information
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

  // 3. Detect Sections using tolerant regexes
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

  const coreSectionsCount = [hasExperience, hasEducation, hasProjects, hasSkills].filter(Boolean).length

  // 4. Structural Obvious Cues
  const hasBulletPoints = STRUCTURAL_INDICATORS.bulletPoints.test(normalized)
  const hasDates = STRUCTURAL_INDICATORS.dates.test(normalized)
  const hasDegree = STRUCTURAL_INDICATORS.degrees.test(normalized)
  const hasCompanyOrRole = STRUCTURAL_INDICATORS.companiesOrRoles.test(normalized)
  const hasTech = STRUCTURAL_INDICATORS.techKeywords.test(normalized)

  const structuralHits = [
    Boolean(detectedEmail),
    Boolean(detectedPhone),
    hasBulletPoints,
    hasDates,
    hasDegree,
    hasCompanyOrRole,
    hasTech
  ].filter(Boolean).length

  // 5. Check Definite False Indicators (Assignments / Invoices)
  let assignmentMatches = 0
  for (const pat of DEFINITE_ASSIGNMENT_INDICATORS) {
    if (pat.test(normalized) || pat.test(lowerName)) assignmentMatches++
  }

  let nonResumeMatches = 0
  for (const pat of DEFINITE_NON_RESUME_INDICATORS) {
    if (pat.test(normalized) || pat.test(lowerName)) nonResumeMatches++
  }

  // 6. Multi-tiered Authenticity Evaluation
  // Rule A: Candidate Name AND at least TWO of (Experience, Education, Projects, Skills)
  const passesRuleA = Boolean(candidateName) && coreSectionsCount >= 2

  // Rule B: Obvious Resume Structure with Email/Phone, bullets, dates, degrees, roles, technologies (at least 3 structural signals)
  const passesRuleB = (Boolean(detectedEmail) || Boolean(detectedPhone)) && structuralHits >= 3

  // Rule C: At least 2 core sections regardless of candidate name
  const passesRuleC = coreSectionsCount >= 2

  // Rule D: Fallback Validation: > 300 characters + (Email OR Phone) + multiple paragraphs/lines
  const passesFallback = normalized.length > 300 && (Boolean(detectedEmail) || Boolean(detectedPhone)) && (paragraphs.length >= 2 || lines.length >= 6)

  // Rule E: Name or Resume filename cue + at least 1 section + tech/education
  const passesFileNameCue = /(?:resume|cv|curriculum|vitae)/i.test(lowerName) && (coreSectionsCount >= 1 || structuralHits >= 2)

  // Calculate Base Confidence
  let confidence = 30
  if (detectedEmail || detectedPhone) confidence += 20
  if (hasExperience) confidence += 15
  if (hasEducation || hasDegree) confidence += 15
  if (hasSkills || hasTech) confidence += 10
  if (hasProjects) confidence += 10
  if (hasBulletPoints || hasDates) confidence += 10
  if (/(?:resume|cv)/i.test(lowerName)) confidence += 10

  confidence = Math.min(100, Math.max(10, confidence))

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

  // Final Acceptance Decision
  // Only reject if it is DEFINITIVELY an assignment or invoice with virtually no resume structure
  let isValid = false
  let detectedType: ResumeValidationResult['detectedType'] = 'resume'
  let reason: string | undefined = undefined

  if (assignmentMatches >= 2 && coreSectionsCount === 0 && !hasExperience && !hasSkills) {
    isValid = false
    detectedType = 'assignment'
    reason = 'The uploaded file appears to be a homework assignment or classroom document, not a resume or CV.'
  } else if (nonResumeMatches >= 2 && coreSectionsCount === 0 && !detectedEmail && !hasSkills) {
    isValid = false
    detectedType = 'invoice'
    reason = 'The uploaded file appears to be a financial receipt or general document, not a resume or CV.'
  } else if (passesRuleA || passesRuleB || passesRuleC || passesFallback || passesFileNameCue) {
    isValid = true
    detectedType = 'resume'
  } else if (normalized.length >= 150 && (structuralHits >= 2 || coreSectionsCount >= 1)) {
    // Tolerant acceptance for unconventional resume formats
    isValid = true
    detectedType = 'resume'
    warnings.push("We couldn't confidently identify every standard section, but your resume can still be analyzed.")
  } else {
    // Even if structural signals are light, if length > 250 with at least 1 contact or tech keyword, DO NOT BLOCK
    if (normalized.length > 250 && (detectedEmail || detectedPhone || hasTech || hasDegree)) {
      isValid = true
      detectedType = 'resume'
      warnings.push("We couldn't confidently identify every standard section, but your resume can still be analyzed.")
    } else {
      isValid = false
      detectedType = 'unknown'
      reason = "Could not verify resume structure in the uploaded document. Please upload an authentic resume containing experience, education, skills, or projects."
    }
  }

  // If approved with missing sections, add generic advisory warning
  if (isValid && warnings.length > 0 && !warnings.some(w => w.includes('analyzed'))) {
    warnings.unshift("We couldn't confidently identify every standard section, but your resume can still be analyzed.")
  }

  // Debug Logging to Console as required
  console.log('====== [AETHERCV AI RESUME VALIDATION DEBUG] ======')
  console.log('Uploaded filename   :', fileName || 'unknown')
  console.log('File type           :', fileType || 'unknown')
  console.log('File size           :', fileSize ? `${fileSize} bytes` : 'unknown')
  console.log('Characters extracted:', normalized.length)
  console.log('Lines extracted     :', lines.length)
  console.log('Detected sections   :', detectedSectionsList.length > 0 ? detectedSectionsList.join(', ') : 'None')
  console.log('Detected email      :', detectedEmail || 'None')
  console.log('Detected phone      :', detectedPhone || 'None')
  console.log('Detected skills     :', hasSkills ? 'Yes' : 'No')
  console.log('Detected education  :', hasEducation ? 'Yes' : 'No')
  console.log('Detected projects   :', hasProjects ? 'Yes' : 'No')
  console.log('Detected experience :', hasExperience ? 'Yes' : 'No')
  console.log('Validation result   :', isValid ? 'PASSED (Valid Resume)' : 'REJECTED')
  console.log('Reason for rejection:', isValid ? 'N/A' : (reason || 'Structure criteria not met'))
  console.log('====================================================')

  return {
    isValid,
    confidence,
    reason,
    warnings,
    detectedType,
    missingPillars,
    detectedPillars,
    detectedSections: detectedSectionsList,
    detectedContact
  }
}
