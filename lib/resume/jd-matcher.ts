import { ParsedResume, JDMatchResult } from './types'
import { detectAndCategorizeSkills } from './skills-detector'

const COMMON_TECH_ROLES = [
  'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
  'Software Engineer', 'DevOps Engineer', 'Cloud Engineer',
  'Data Scientist', 'AI/ML Engineer', 'Mobile App Developer',
  'QA Automation Engineer', 'Systems Architect', 'Product Engineer'
]

export function matchJobDescription(jobDescription: string, resume: ParsedResume): JDMatchResult {
  const jdLower = jobDescription.toLowerCase()
  const resumeLower = resume.rawText.toLowerCase()

  // 1. Detect Job Title
  let jobTitleDetected = 'Software Engineer'
  for (const role of COMMON_TECH_ROLES) {
    if (new RegExp(role.replace('/', '\\/'), 'i').test(jobDescription)) {
      jobTitleDetected = role
      break
    }
  }

  // 2. Extract Skills from Job Description
  const { allFound: jdSkills } = detectAndCategorizeSkills(jobDescription)
  const resumeSkills = resume.rawSkillsList.map(s => s.toLowerCase())

  const matchedSkills: string[] = []
  const missingSkills: string[] = []

  jdSkills.forEach(skill => {
    const sLower = skill.toLowerCase()
    if (resumeSkills.includes(sLower) || resumeLower.includes(sLower)) {
      matchedSkills.push(skill)
    } else {
      missingSkills.push(skill)
    }
  })

  // 3. Extract Keywords from JD
  const jdWords = jobDescription
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3)

  const stopWords = new Set([
    'with', 'have', 'from', 'they', 'this', 'that', 'will', 'your', 'team',
    'work', 'years', 'experience', 'ability', 'skills', 'about', 'must',
    'good', 'strong', 'knowledge', 'understanding', 'working', 'responsibilities',
    'requirements', 'preferred', 'candidates', 'looking', 'equal', 'opportunity'
  ])

  const jdWordFreq: Record<string, number> = {}
  jdWords.forEach(w => {
    if (!stopWords.has(w) && !/^\d+$/.test(w)) {
      jdWordFreq[w] = (jdWordFreq[w] || 0) + 1
    }
  })

  const topJdKeywords = Object.entries(jdWordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w]) => w)

  const matchedKeywords: string[] = []
  const missingKeywords: string[] = []

  topJdKeywords.forEach(kw => {
    if (resumeLower.includes(kw)) {
      matchedKeywords.push(kw)
    } else {
      missingKeywords.push(kw)
    }
  })

  // 4. Missing Certifications detection
  const commonCerts = ['aws certified', 'azure', 'ckad', 'cka', 'gcp certified', 'cissp', 'scrum master', 'pmp']
  const missingCertifications: string[] = []
  commonCerts.forEach(cert => {
    if (jdLower.includes(cert) && !resumeLower.includes(cert)) {
      missingCertifications.push(cert.toUpperCase())
    }
  })

  // Missing technologies
  const missingTechnologies = missingSkills.filter(s =>
    !['leadership', 'communication', 'problem solving', 'agile', 'scrum'].includes(s.toLowerCase())
  )

  // 5. Match Percentage Calculation
  const totalSkillWeight = jdSkills.length > 0 ? (matchedSkills.length / jdSkills.length) * 70 : 50
  const totalKwWeight = topJdKeywords.length > 0 ? (matchedKeywords.length / topJdKeywords.length) * 30 : 25
  const rawMatch = Math.round(totalSkillWeight + totalKwWeight)
  const matchPercentage = Math.min(100, Math.max(15, rawMatch))

  let matchTier: 'Perfect Match' | 'Strong Match' | 'Moderate Match' | 'Low Match' = 'Moderate Match'
  if (matchPercentage >= 85) matchTier = 'Perfect Match'
  else if (matchPercentage >= 70) matchTier = 'Strong Match'
  else if (matchPercentage >= 50) matchTier = 'Moderate Match'
  else matchTier = 'Low Match'

  // 6. Tailored Recommendations
  const tailoredRecommendations: string[] = []
  if (missingSkills.length > 0) {
    tailoredRecommendations.push(
      `Incorporate missing required skills into your Skills and Project sections: ${missingSkills.slice(0, 4).join(', ')}.`
    )
  }
  if (missingKeywords.length > 0) {
    tailoredRecommendations.push(
      `Keywords from the job description not found in your resume: ${missingKeywords.slice(0, 5).join(', ')}. Use these in bullet descriptions.`
    )
  }
  if (missingCertifications.length > 0) {
    tailoredRecommendations.push(
      `The job posting emphasizes certifications like ${missingCertifications.join(', ')}. Mention relevant courses or active preparation if applicable.`
    )
  }
  if (matchPercentage < 70) {
    tailoredRecommendations.push(
      `Tailor your Professional Summary to mirror the job title: "${jobTitleDetected}" to immediately signal relevance to ATS parsers.`
    )
  } else {
    tailoredRecommendations.push(
      `Great keyword alignment! You possess over ${Math.round(matchPercentage)}% of target job competencies.`
    )
  }

  return {
    matchPercentage,
    matchTier,
    jobTitleDetected,
    matchedKeywords,
    missingKeywords,
    matchedSkills,
    missingSkills,
    missingTechnologies,
    missingCertifications,
    tailoredRecommendations,
    atsKeywordAlignmentScore: matchPercentage
  }
}
