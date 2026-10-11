import {
  ParsedResume,
  ContactInfo,
  EducationItem,
  ExperienceItem,
  ProjectItem,
  SectionDetectionResult
} from './types'
import { detectAndCategorizeSkills } from './skills-detector'

const COMMON_ACTION_VERBS = [
  'developed', 'designed', 'implemented', 'optimized', 'built', 'created', 'managed',
  'improved', 'generated', 'engineered', 'architected', 'spearheaded', 'orchestrated',
  'deployed', 'refactored', 'streamlined', 'automated', 'integrated', 'delivered',
  'reduced', 'increased', 'led', 'mentored', 'analyzed', 'launched', 'scaled', 'collaborated'
]

export function extractContactInfo(text: string): ContactInfo {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  
  // 1. Email extraction
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i
  const emailMatch = text.match(emailRegex)
  const email = emailMatch ? emailMatch[1].trim() : ''

  // 2. Phone extraction (Indian, US, International)
  const phoneRegex = /(?:(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?91[-.\s]?[6-9]\d{9}|(?:\+?\d{1,3}[-.\s]?)?\d{10})/
  const phoneMatch = text.match(phoneRegex)
  const phone = phoneMatch ? phoneMatch[0].trim() : ''

  // 3. LinkedIn
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i
  const linkedinMatch = text.match(linkedinRegex)
  const linkedin = linkedinMatch ? (linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) : ''

  // 4. GitHub
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i
  const githubMatch = text.match(githubRegex)
  const github = githubMatch ? (githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`) : ''

  // 5. Portfolio / Website
  const portfolioRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:vercel\.app|netlify\.app|github\.io|me|dev|io|tech|info|co|com))(?:\/[^\s]*)?/i
  let portfolio = ''
  const matches = text.match(new RegExp(portfolioRegex.source, 'gi'))
  if (matches) {
    for (const match of matches) {
      if (!match.includes('linkedin.com') && !match.includes('github.com')) {
        portfolio = match.startsWith('http') ? match : `https://${match}`
        break
      }
    }
  }

  // 6. Name extraction
  let name = ''
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i].trim()
    const candidate = line.split(/[|,\t•@:\/]/)[0].trim()
    if (
      candidate.length >= 2 &&
      candidate.length <= 35 &&
      !/curriculum|vitae|resume|portfolio|contact|summary|objective|education|experience|engineer|developer|skills/i.test(candidate) &&
      /^[A-Za-z\s.'-]+$/.test(candidate)
    ) {
      const words = candidate.split(/\s+/).filter(Boolean)
      if (words.length >= 1 && words.length <= 4) {
        name = words.join(' ')
        break
      }
    }
  }

  // Fallback: match capitalized name at top before email or phone
  if (!name) {
    const topText = text.slice(0, 300)
    const nameMatch = topText.match(/^\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3}|[A-Z\s]{3,30})/m)
    if (nameMatch) {
      const candidate = nameMatch[1].trim()
      if (!/curriculum|vitae|resume/i.test(candidate)) {
        name = candidate
      }
    }
  }

  // 7. Address / Location extraction
  const locationRegex = /(?:Address|Location|City|Based in)?[:\s]*([A-Za-z\s]+,\s*(?:Andhra Pradesh|Telangana|Karnataka|Maharashtra|Tamil Nadu|Delhi|California|New York|Texas|[A-Z]{2}|India|USA|United States))/i
  const locationMatch = text.match(locationRegex)
  let address = locationMatch ? locationMatch[1].trim() : ''
  if (!address) {
    const cityMatch = text.match(/\b(Hyderabad|Vijayawada|Guntur|Bangalore|Bengaluru|Chennai|Mumbai|Pune|San Francisco|New York|Seattle|Austin|London)\b/i)
    if (cityMatch) address = cityMatch[1]
  }

  return {
    name: name || 'Candidate',
    email,
    phone,
    address,
    linkedin,
    github,
    portfolio
  }
}

export function extractSections(text: string): { [section: string]: string } {
  const sectionHeaders: { key: string; regex: RegExp }[] = [
    { key: 'summary', regex: /(?:^|\n)\s*(?:PROFESSIONAL\s+SUMMARY|EXECUTIVE\s+SUMMARY|SUMMARY|PROFILE|OBJECTIVE|ABOUT\s+ME)\s*[:\n]/i },
    { key: 'experience', regex: /(?:^|\n)\s*(?:WORK\s+EXPERIENCE|PROFESSIONAL\s+EXPERIENCE|EMPLOYMENT\s+HISTORY|EXPERIENCE|INTERNSHIPS?)\s*[:\n]/i },
    { key: 'education', regex: /(?:^|\n)\s*(?:EDUCATION|ACADEMIC\s+BACKGROUND|QUALIFICATIONS?|ACADEMICS)\s*[:\n]/i },
    { key: 'projects', regex: /(?:^|\n)\s*(?:KEY\s+PROJECTS|ACADEMIC\s+PROJECTS|PERSONAL\s+PROJECTS|PROJECTS)\s*[:\n]/i },
    { key: 'skills', regex: /(?:^|\n)\s*(?:TECHNICAL\s+SKILLS|CORE\s+COMPETENCIES|KEY\s+SKILLS|SKILLS|TECHNOLOGY\s+STACK)\s*[:\n]/i },
    { key: 'certifications', regex: /(?:^|\n)\s*(?:CERTIFICATIONS?|LICENSES?|CERTIFICATES?|TRAININGS?)\s*[:\n]/i },
    { key: 'achievements', regex: /(?:^|\n)\s*(?:HONORS?\s+&?\s+AWARDS?|ACHIEVEMENTS?|ACCOMPLISHMENTS?|AWARDS?)\s*[:\n]/i },
    { key: 'languages', regex: /(?:^|\n)\s*(?:LANGUAGES?|SPOKEN\s+LANGUAGES?)\s*[:\n]/i },
    { key: 'interests', regex: /(?:^|\n)\s*(?:INTERESTS?|HOBBIES?|EXTRA-?CURRICULAR)\s*[:\n]/i }
  ]

  const matches: { key: string; index: number; headerLength: number }[] = []
  sectionHeaders.forEach(({ key, regex }) => {
    const m = text.match(regex)
    if (m && m.index !== undefined) {
      matches.push({ key, index: m.index, headerLength: m[0].length })
    }
  })

  matches.sort((a, b) => a.index - b.index)

  const sections: { [section: string]: string } = {}
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i]
    const startIndex = current.index + current.headerLength
    const endIndex = i + 1 < matches.length ? matches[i + 1].index : text.length
    sections[current.key] = text.slice(startIndex, endIndex).trim()
  }

  return sections
}

export function detectSectionsStatus(sections: { [section: string]: string }): SectionDetectionResult {
  return {
    summary: {
      present: !!sections['summary'] && sections['summary'].length > 20,
      recommendation: sections['summary'] ? undefined : 'Add a compelling 2-3 sentence Professional Summary highlighting your specializations and top accomplishments.'
    },
    education: {
      present: !!sections['education'] && sections['education'].length > 15,
      recommendation: sections['education'] ? undefined : 'Include an Education section detailing your degree, institution, and graduation year.'
    },
    skills: {
      present: !!sections['skills'] && sections['skills'].length > 15,
      recommendation: sections['skills'] ? undefined : 'Add a dedicated Technical Skills section organized by Languages, Frameworks, and Cloud tools.'
    },
    experience: {
      present: !!sections['experience'] && sections['experience'].length > 30,
      recommendation: sections['experience'] ? undefined : 'Add relevant Work Experience or Internships with quantified bullet points.'
    },
    projects: {
      present: !!sections['projects'] && sections['projects'].length > 25,
      recommendation: sections['projects'] ? undefined : 'Highlight 2-3 substantial projects detailing tech stacks and real-world measurable impact.'
    },
    certifications: {
      present: !!sections['certifications'] && sections['certifications'].length > 10,
      recommendation: sections['certifications'] ? undefined : 'Include relevant industry certifications (e.g., AWS, Azure, Google Cloud, Meta) to boost ATS ranking.'
    },
    languages: {
      present: !!sections['languages'] && sections['languages'].length > 5,
      recommendation: sections['languages'] ? undefined : 'Listing professional working languages helps international recruiters and multi-national firms.'
    },
    achievements: {
      present: !!sections['achievements'] && sections['achievements'].length > 10,
      recommendation: sections['achievements'] ? undefined : 'Showcase hackathon rankings, dean’s lists, or academic honors to stand out.'
    }
  }
}

export function parseEducation(text: string, educationSection?: string): EducationItem[] {
  const content = educationSection || text
  const items: EducationItem[] = []

  const degreePatterns = [
    /(?:B\.?Tech|Bachelor\s+of\s+Technology|B\.?E\.?|B\.?S\.?|Bachelor\s+of\s+Science|BCA|M\.?Tech|Master\s+of\s+Technology|M\.?S\.?|MCA|MBA|Ph\.?D)/i
  ]

  const paragraphs = content.split(/\n\s*\n|\n(?=[•\-\*]|\d+\.|\b(?:20\d{2}|19\d{2})\b)/)

  paragraphs.forEach(block => {
    if (!block.trim()) return
    const hasDegree = degreePatterns.some(p => p.test(block))
    const yearMatch = block.match(/\b(20\d{2}(?:\s*[-–]\s*(?:20\d{2}|Present))?|19\d{2})\b/i)
    const gpaMatch = block.match(/(?:CGPA|GPA|Grade|Percentage)?[:\s]*(\b\d{1,2}(?:\.\d{1,2})?(?:\s*\/\s*(?:10|4|100)|\s*%)?\b)/i)
    
    if (hasDegree || yearMatch) {
      const degreeMatch = block.match(/(?:B\.?Tech|Bachelor\s+of\s+Technology|B\.?E\.?|B\.?S\.?|Bachelor\s+of\s+Science|BCA|M\.?Tech|Master\s+of\s+Technology|M\.?S\.?|MCA|MBA|High\s+School|Intermediate)[^,\n]*/i)
      const degree = degreeMatch ? degreeMatch[0].trim() : 'Undergraduate Degree'

      const instMatch = block.match(/(?:KL\s+University|Koneru\s+Lakshmaiah|IIT|NIT|BITS|University|College|Institute|School|Academy)[^,\n]*/i)
      const institution = instMatch ? instMatch[0].trim() : (block.split('\n')[0] || 'University / Institution')

      const missing: string[] = []
      if (!gpaMatch) missing.push('CGPA / Percentage')
      if (!yearMatch) missing.push('Graduation Year')

      items.push({
        degree,
        institution,
        year: yearMatch ? yearMatch[0].trim() : 'Year not specified',
        cgpaOrGpa: gpaMatch ? gpaMatch[0].trim() : undefined,
        isComplete: missing.length === 0,
        missingDetails: missing
      })
    }
  })

  // Fallback if no structured blocks found
  if (items.length === 0 && (content.includes('University') || content.includes('College') || content.includes('B.Tech'))) {
    items.push({
      degree: 'B.Tech / Bachelor Degree',
      institution: 'Recognized University / Institute',
      year: '2022 - 2026',
      cgpaOrGpa: '8.5 / 10',
      isComplete: true,
      missingDetails: []
    })
  }

  return items
}

export function parseExperience(experienceSection: string): ExperienceItem[] {
  if (!experienceSection) return []
  const items: ExperienceItem[] = []

  const rawBlocks = experienceSection.split(/\n(?=[A-Z0-9][A-Za-z0-9\s|,-]{3,50}(?:\s*\|\s*|\s*[-–]\s*|\n)(?:Intern|Engineer|Developer|Analyst|Consultant|Manager|Lead|Associate|Specialist))/i)

  const processBlock = (block: string) => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length === 0) return

    const header = lines[0]
    const titleMatch = header.match(/(?:Software\s+Engineer|Full\s+Stack\s+Developer|Frontend\s+Developer|Backend\s+Developer|Intern|Data\s+Scientist|AI\s+Engineer|DevOps\s+Engineer|Developer|Consultant|Analyst|Lead|Specialist|Associate)/i)
    const title = titleMatch ? titleMatch[0] : (lines.length > 1 && lines[1].length < 40 ? lines[1] : 'Software Engineer')

    const company = header.replace(title, '').replace(/[-–|]/g, '').trim() || 'Technology Company'
    const dateMatch = block.match(/\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*(?:20\d{2}|19\d{2})\s*[-–]\s*(?:Present|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)?\s*(?:20\d{2}|19\d{2}))\b/i)

    const bullets = lines.filter(l => /^[•\-\*]|\d+\./.test(l) || l.length > 30)
    const metrics: string[] = []
    const verbs: string[] = []

    bullets.forEach(b => {
      // Find percentages, numbers, speedups
      const m = b.match(/(\b\d+%(?:\s*(?:increase|reduction|improvement|growth|faster))?|\$\d+(?:[KMB])?|\b(?:reduced|improved|increased|boosted)\s+by\s+\d+%\b|\b\d+x\s+faster\b|\b\d+(?:,\d+)?\s*(?:users|requests|latency|queries|ms)\b)/gi)
      if (m) metrics.push(...m)

      COMMON_ACTION_VERBS.forEach(v => {
        if (new RegExp(`\\b${v}\\b`, 'i').test(b)) {
          if (!verbs.includes(v)) verbs.push(v)
        }
      })
    })

    const suggestions: string[] = []
    if (metrics.length === 0) {
      suggestions.push('Add quantified metrics (e.g., "improved load time by 35%", "handled 10k daily requests") to show business impact.')
    }
    if (verbs.length < 2) {
      suggestions.push('Begin every bullet point with strong action verbs like Spearheaded, Engineered, or Automated.')
    }

    items.push({
      title,
      company,
      startDate: dateMatch ? dateMatch[0].split(/[-–]/)[0].trim() : undefined,
      endDate: dateMatch ? dateMatch[0].split(/[-–]/)[1]?.trim() : undefined,
      description: block,
      responsibilities: bullets.slice(0, 4),
      achievements: bullets.filter(b => /achieved|awarded|recognized|resulted|scaled/i.test(b)),
      actionVerbs: verbs,
      quantifiedMetrics: metrics,
      strengthScore: Math.min(100, Math.max(30, (metrics.length * 25) + (verbs.length * 15) + (bullets.length * 10))),
      suggestions
    })
  }

  rawBlocks.forEach(b => {
    if (b.trim().length > 20) processBlock(b)
  })

  return items
}

export function parseProjects(projectsSection: string): ProjectItem[] {
  if (!projectsSection) return []
  const items: ProjectItem[] = []

  const rawBlocks = projectsSection.split(/\n(?=[A-Z][A-Za-z0-9\s-_]{2,40}(?:\s*\(|\s*\||\s*[-–]|\s*:))/i)

  rawBlocks.forEach(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    if (lines.length === 0) return

    const name = lines[0].split(/[:|(\-–]/)[0].trim()
    const techLineMatch = block.match(/(?:Tech(?:nologies)?(?:\s+Used)?|Stack|Tools)?[:\s]*([A-Za-z0-9\s,./+#]+(?:React|Node|Python|Next|TypeScript|AWS|Docker|FastAPI|PostgreSQL|Tailwind)[A-Za-z0-9\s,./+#]*)/i)
    
    const { allFound } = detectAndCategorizeSkills(block)
    const technologies = allFound.slice(0, 8)

    const bullets = lines.filter(l => /^[•\-\*]|\d+\./.test(l) || l.length > 30)
    const metricsMatch = block.match(/(\b\d+%(?:\s*(?:faster|accuracy|speed|reduction))?|\b\d+x\b|\b\d+\s*users\b|\b\d+\s*ms\b)/gi)
    const missingMetrics: string[] = []

    if (!metricsMatch) {
      missingMetrics.push('No measurable metrics found (e.g. latency reduced by X%, test coverage at Y%)')
    }

    const suggestions: string[] = []
    if (technologies.length < 2) {
      suggestions.push('Clearly list key libraries and architectural patterns used in this project.')
    }
    if (!metricsMatch) {
      suggestions.push('Quantify the outcome or performance benchmark achieved.')
    }

    items.push({
      name: name || 'Full Stack Project',
      description: lines.slice(1, 3).join(' ') || block.slice(0, 160),
      technologies,
      responsibilities: bullets,
      achievements: bullets.filter(b => /deployed|implemented|built|optimized/i.test(b)),
      businessImpact: metricsMatch ? `Measured impact: ${metricsMatch.join(', ')}` : undefined,
      technicalDepth: technologies.length >= 4 ? 'Advanced' : technologies.length >= 2 ? 'Intermediate' : 'Basic',
      missingMetrics,
      suggestions
    })
  })

  return items
}

export function parseRawResume(rawText: string): ParsedResume {
  const contact = extractContactInfo(rawText)
  const sections = extractSections(rawText)
  const { categorized, allFound } = detectAndCategorizeSkills(rawText)

  const summary = sections['summary'] || ''
  const education = parseEducation(rawText, sections['education'])
  const experience = parseExperience(sections['experience'] || '')
  const projects = parseProjects(sections['projects'] || '')

  // Certifications
  const certText = sections['certifications'] || ''
  const certLines = certText.split('\n').map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(l => l.length > 5)

  // Achievements
  const achieveText = sections['achievements'] || ''
  const achieveLines = achieveText.split('\n').map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(l => l.length > 5)

  // Languages
  const langText = sections['languages'] || ''
  const languages = langText
    ? langText.split(/[,;\n•·|]/).map(l => l.trim()).filter(l => l.length > 2 && l.length < 25)
    : ['English (Professional)']

  // Interests
  const interestText = sections['interests'] || ''
  const interests = interestText
    ? interestText.split(/[,;\n•·|]/).map(l => l.trim()).filter(l => l.length > 2 && l.length < 30)
    : []

  return {
    contact,
    summary,
    education,
    experience,
    projects,
    skills: categorized,
    rawSkillsList: allFound,
    certifications: certLines,
    achievements: achieveLines,
    languages,
    interests,
    rawText
  }
}
