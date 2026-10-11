/**
 * Resume Document Authenticity Validator
 * Verifies whether an uploaded document or text is an authentic Resume / CV
 * before allowing ATS scoring and analysis.
 * Rejects homework assignments, lecture notes, question papers, invoices, and generic documents.
 */

export interface ResumeValidationResult {
  isValid: boolean
  confidence: number // 0 to 100
  reason?: string
  detectedType?: 'resume' | 'assignment' | 'notes' | 'invoice' | 'paper' | 'unknown'
  missingPillars: string[]
  detectedPillars: string[]
}

const ASSIGNMENT_INDICATORS = [
  /\b(?:home\s+assignment|homework|assignment\s*(?:#|\d|no|one|two|three)?)\b/i,
  /\b(?:lab\s+(?:experiment|manual|record|exercise)|experiment\s+no\.?)\b/i,
  /\b(?:problem\s+statement|problem\s+\d+|question\s+\d+|q\d+[\.:\)])\b/i,
  /\b(?:answer\s*key|solutions?|solution\s+to\s+problem)\b/i,
  /\b(?:submitted\s+to\s*(?:dr\.|prof\.|faculty|sir|madam)?|guided\s+by)\b/i,
  /\b(?:course\s+(?:code|name|title)|subject\s+(?:code|name))\b/i,
  /\b(?:internal\s+assessment|mid\s+exam|semester\s+exam|hall\s+ticket)\b/i,
  /\b(?:register\s+no\.?|reg\s+no\.?|roll\s+no\.?|id\s+no\.?)\s*[:=]\s*[0-9A-Za-z]+/i
]

const NON_RESUME_INDICATORS = [
  /\b(?:tax\s+invoice|invoice\s+(?:#|no)|receipt|bill\s+to|subtotal|balance\s+due)\b/i,
  /\b(?:terms\s+(?:and|&)\s+conditions|privacy\s+policy|user\s+agreement|license\s+agreement)\b/i,
  /\b(?:abstract\s*[:\n]|ieee\s+transactions|proceedings\s+of\s+the|arxiv:\d+)\b/i,
  /\b(?:chapter\s+\d+|table\s+of\s+contents|syllabus|lecture\s+notes)\b/i
]

const RESUME_SECTION_PATTERNS = [
  { name: 'Experience', regex: /\b(?:work\s+experience|professional\s+experience|employment\s+history|experience|internships?)\b/i },
  { name: 'Education', regex: /\b(?:education|academic\s+background|qualifications?|academics|educational\s+qualifications)\b/i },
  { name: 'Skills', regex: /\b(?:technical\s+skills|core\s+competencies|key\s+skills|skills|technologies|tools\s+&?\s+technologies)\b/i },
  { name: 'Projects', regex: /\b(?:key\s+projects|academic\s+projects|personal\s+projects|projects)\b/i },
  { name: 'Summary', regex: /\b(?:professional\s+summary|executive\s+summary|summary|profile|about\s+me|career\s+objective|objective)\b/i },
  { name: 'Certifications', regex: /\b(?:certifications?|licenses?|certificates?|courses)\b/i },
  { name: 'Achievements', regex: /\b(?:achievements?|awards?|honors?|accomplishments?)\b/i }
]

const DEGREE_INDICATORS = [
  /\b(?:B\.?Tech|Bachelor\s+of\s+Technology|B\.?E\.?|B\.?S\.?|Bachelor\s+of\s+Science|BCA|M\.?Tech|Master\s+of\s+Technology|M\.?S\.?|MCA|MBA|Ph\.?D|Diploma|Intermediate|High\s+School)\b/i,
  /\b(?:CGPA|GPA|Percentage)\s*[:=]?\s*\d+(?:\.\d+)?/i,
  /\b(?:University|College|Institute|School|Academy)\b/i
]

const CONTACT_PATTERNS = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email
  /(?:(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?91[-.\s]?[6-9]\d{9})/, // Phone
  /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i, // LinkedIn
  /github\.com\/[a-zA-Z0-9_-]+/i // GitHub
]

/**
 * Validates whether the given text belongs to an authentic Resume/CV.
 */
export function validateIsResume(text: string, fileName: string = ''): ResumeValidationResult {
  const clean = text.trim()
  const lowerName = fileName.toLowerCase()

  // 1. Minimum character requirement
  if (clean.length < 150) {
    return {
      isValid: false,
      confidence: 10,
      detectedType: 'unknown',
      reason: 'The uploaded file contains insufficient content. Please upload a comprehensive resume or CV.',
      missingPillars: ['Content Length', 'Contact Info', 'Sections', 'Skills'],
      detectedPillars: []
    }
  }

  // 2. Check for strong assignment / homework indicators
  let assignmentMatches = 0
  for (const pattern of ASSIGNMENT_INDICATORS) {
    if (pattern.test(clean) || pattern.test(lowerName)) {
      assignmentMatches++
    }
  }

  // 3. Check for invoices, legal agreements, research papers
  let nonResumeMatches = 0
  for (const pattern of NON_RESUME_INDICATORS) {
    if (pattern.test(clean) || pattern.test(lowerName)) {
      nonResumeMatches++
    }
  }

  // 4. Check for Resume Pillars
  const detectedPillars: string[] = []
  const missingPillars: string[] = []

  // Pillar 1: Contact Information (Email, Phone, LinkedIn, GitHub)
  const hasContact = CONTACT_PATTERNS.some(p => p.test(clean))
  if (hasContact) {
    detectedPillars.push('Contact Information')
  } else {
    missingPillars.push('Contact Information (Email/Phone/LinkedIn)')
  }

  // Pillar 2: Core Section Headers
  const matchedSections: string[] = []
  for (const sec of RESUME_SECTION_PATTERNS) {
    if (sec.regex.test(clean)) {
      matchedSections.push(sec.name)
    }
  }

  if (matchedSections.length >= 2) {
    detectedPillars.push(`Resume Sections (${matchedSections.slice(0, 3).join(', ')})`)
  } else {
    missingPillars.push('Standard Resume Sections (Experience, Education, Skills, Projects)')
  }

  // Pillar 3: Educational Credentials / Degrees
  const hasEducation = DEGREE_INDICATORS.some(p => p.test(clean))
  if (hasEducation) {
    detectedPillars.push('Academic Credentials')
  } else {
    missingPillars.push('Education / Degree Credentials')
  }

  // Pillar 4: Action Verbs & Career Responsibilities
  const careerVerbs = /\b(?:developed|engineered|designed|implemented|spearheaded|architected|built|managed|led|optimized|deployed|automated|collaborated)\b/i
  const hasVerbs = careerVerbs.test(clean)
  if (hasVerbs) {
    detectedPillars.push('Professional Impact & Action Verbs')
  } else {
    missingPillars.push('Career Responsibilities & Action Verbs')
  }

  // 5. Score Calculation (0 - 100)
  let confidence = 0

  if (hasContact) confidence += 25
  if (matchedSections.length >= 3) confidence += 35
  else if (matchedSections.length >= 2) confidence += 20
  else if (matchedSections.length === 1) confidence += 10

  if (hasEducation) confidence += 20
  if (hasVerbs) confidence += 20

  // Penalties for non-resume flags
  if (assignmentMatches >= 2) {
    confidence -= 45
  } else if (assignmentMatches === 1) {
    confidence -= 25
  }

  if (nonResumeMatches >= 2) {
    confidence -= 50
  } else if (nonResumeMatches === 1) {
    confidence -= 30
  }

  // File name hints
  if (/(?:assignment|homework|lab|report|exercise|solution|question|test|exam)/i.test(lowerName)) {
    confidence -= 30
  }
  if (/(?:resume|cv|curriculum|vitae)/i.test(lowerName)) {
    confidence += 15
  }

  confidence = Math.max(0, Math.min(100, confidence))

  // 6. Decision & Explanation
  if (assignmentMatches >= 2 || (assignmentMatches >= 1 && matchedSections.length <= 1)) {
    return {
      isValid: false,
      confidence,
      detectedType: 'assignment',
      reason: 'The uploaded file appears to be a homework assignment, lab manual, or class document, not a resume or CV. Please upload an authentic resume containing your professional experience, education, and technical skills.',
      missingPillars,
      detectedPillars
    }
  }

  if (nonResumeMatches >= 2 || (nonResumeMatches >= 1 && matchedSections.length === 0)) {
    return {
      isValid: false,
      confidence,
      detectedType: 'invoice',
      reason: 'The uploaded file appears to be a general document, invoice, or paper, not a resume or CV. Please upload an authentic resume.',
      missingPillars,
      detectedPillars
    }
  }

  // Must have at least 2 key pillars and confidence >= 40
  const isAuthenticResume = confidence >= 40 && (
    (hasContact && matchedSections.length >= 1) ||
    matchedSections.length >= 2 ||
    (hasEducation && hasVerbs && matchedSections.length >= 1)
  )

  if (!isAuthenticResume) {
    return {
      isValid: false,
      confidence,
      detectedType: 'unknown',
      reason: 'Could not verify resume structure in the uploaded document. A valid resume must contain standard sections such as Work Experience, Education, Projects, and Skills, along with contact details.',
      missingPillars,
      detectedPillars
    }
  }

  return {
    isValid: true,
    confidence,
    detectedType: 'resume',
    missingPillars,
    detectedPillars
  }
}
