import { ResumeBuilderData, AtsBuilderScore } from '@/types/resume-builder'

const ACTION_VERBS = new Set([
  'engineered', 'architected', 'developed', 'built', 'implemented', 'designed', 'optimized',
  'automated', 'deployed', 'orchestrated', 'scaled', 'accelerated', 'reduced', 'increased',
  'enhanced', 'led', 'mentored', 'analyzed', 'created', 'established', 'integrated', 'delivered',
  'streamlined', 'transformed', 'executed', 'formulated', 'spearheaded', 'managed', 'configured'
])

export function calculateLiveAtsScore(data: ResumeBuilderData): AtsBuilderScore {
  const suggestions: string[] = []

  // 1. Contact Info (15 pts)
  let contactScore = 0
  const contactSuggestions: string[] = []
  if (data.personalInfo.firstName && data.personalInfo.lastName) contactScore += 3
  else contactSuggestions.push('Add both your first and last name')

  if (data.personalInfo.email && data.personalInfo.email.includes('@')) contactScore += 3
  else contactSuggestions.push('Add a valid professional email address')

  if (data.personalInfo.phone && data.personalInfo.phone.trim().length >= 8) contactScore += 3
  else contactSuggestions.push('Add your contact phone number with country code')

  if (data.personalInfo.location && data.personalInfo.location.trim().length > 2) contactScore += 2
  else contactSuggestions.push('Specify your city/state location')

  if (data.personalInfo.linkedin && data.personalInfo.linkedin.includes('linkedin')) contactScore += 2
  else contactSuggestions.push('Include your LinkedIn profile link')

  if (data.personalInfo.github || data.personalInfo.portfolio) contactScore += 2
  else contactSuggestions.push('Add your GitHub profile or online portfolio')

  // 2. Summary (10 pts)
  let summaryScore = 0
  const summarySuggestions: string[] = []
  const summaryWords = (data.professionalSummary || '').trim().split(/\s+/).filter(Boolean).length
  if (summaryWords >= 25 && summaryWords <= 90) {
    summaryScore = 10
  } else if (summaryWords > 90) {
    summaryScore = 7
    summarySuggestions.push('Summary is too lengthy; aim for 3-4 concise, impactful lines (30-70 words)')
  } else if (summaryWords > 10) {
    summaryScore = 6
    summarySuggestions.push('Expand your professional summary with key specializations & career focus')
  } else {
    summaryScore = 2
    summarySuggestions.push('Add an ATS-optimized professional summary outlining your domain expertise')
  }

  // 3. Experience (20 pts)
  let expScore = 0
  const expSuggestions: string[] = []
  if (data.experience.length === 0) {
    expScore = 4
    expSuggestions.push('Add at least one internship or work experience entry, or highlight practical projects')
  } else {
    expScore += 6
    let totalBullets = 0
    let hasActionVerb = false
    let hasMetric = false

    data.experience.forEach((e) => {
      const bullets = [...(e.responsibilities || []), ...(e.achievements || [])]
      totalBullets += bullets.length
      bullets.forEach((b) => {
        const words = b.toLowerCase().split(/\s+/)
        if (words.some((w) => ACTION_VERBS.has(w))) hasActionVerb = true
        if (/\b\d+(\.\d+)?%|\b\d+\b|\$\d+/.test(b)) hasMetric = true
      })
    })

    if (totalBullets >= 4) expScore += 5
    else {
      expScore += 2
      expSuggestions.push('Add at least 3-4 detailed bullet points per experience role')
    }

    if (hasActionVerb) expScore += 4
    else expSuggestions.push('Begin experience bullets with strong action verbs (e.g. Engineered, Automated, Deployed)')

    if (hasMetric) expScore += 5
    else expSuggestions.push('Quantify experience impact with measurable metrics (e.g. 40% latency reduction, 10k users)')
  }

  // 4. Education (10 pts)
  let eduScore = 0
  const eduSuggestions: string[] = []
  if (data.education.length > 0) {
    eduScore += 5
    const primary = data.education[0]
    if (primary.degree && primary.university) eduScore += 3
    else eduSuggestions.push('Ensure degree and university name are filled out')
    if (primary.cgpa || primary.endDate) eduScore += 2
    else eduSuggestions.push('Include your graduation year and CGPA / GPA')
  } else {
    eduSuggestions.push('Add your educational background (degree, university, CGPA)')
  }

  // 5. Projects (15 pts)
  let projScore = 0
  const projSuggestions: string[] = []
  if (data.projects.length >= 2) {
    projScore += 7
    let hasTech = false
    let hasLinks = false
    data.projects.forEach((p) => {
      if (p.technologies && p.technologies.length > 0) hasTech = true
      if (p.githubUrl || p.liveUrl) hasLinks = true
    })
    if (hasTech) projScore += 4
    else projSuggestions.push('List the tech stack used for each project')
    if (hasLinks) projScore += 4
    else projSuggestions.push('Include GitHub or Live Demo links for your featured projects')
  } else if (data.projects.length === 1) {
    projScore += 6
    projSuggestions.push('Recruiters look for at least 2 distinct technical projects demonstrating engineering depth')
  } else {
    projSuggestions.push('Add at least 2 hands-on technical projects with descriptions and tech stacks')
  }

  // 6. Skills (15 pts)
  let skillScore = 0
  const skillSuggestions: string[] = []
  const totalSkills = data.skills.reduce((acc, cat) => acc + (cat.skills ? cat.skills.length : 0), 0)
  if (totalSkills >= 12) {
    skillScore += 10
  } else if (totalSkills >= 6) {
    skillScore += 6
    skillSuggestions.push('Add more technical skills (aim for 12-20 core competencies)')
  } else {
    skillScore += 2
    skillSuggestions.push('List core programming languages, frameworks, databases, and developer tools')
  }

  if (data.skills.length >= 3) {
    skillScore += 5
  } else {
    skillScore += 2
    skillSuggestions.push('Organize skills into distinct categories (e.g. Languages, Frameworks, Cloud, Databases)')
  }

  // 7. Formatting & Sections (10 pts)
  let formatScore = 0
  const formatSuggestions: string[] = []
  if (data.certifications.length > 0) formatScore += 3
  else formatSuggestions.push('Add industry certifications (e.g. Azure, AWS, Coursera, HackerRank)')

  if (data.achievements.length > 0) formatScore += 3
  else formatSuggestions.push('Highlight hackathons, academic awards, or notable recognitions')

  if (data.languages.length > 0) formatScore += 2
  formatScore += 2 // Clean ATS template baseline

  // 8. Metrics & Quantification (5 pts)
  let metricsScore = 0
  const metricsSuggestions: string[] = []
  let allBulletsText = ''
  data.experience.forEach((e) => {
    allBulletsText += ' ' + (e.responsibilities || []).join(' ') + ' ' + (e.achievements || []).join(' ')
  })
  data.projects.forEach((p) => {
    allBulletsText += ' ' + (p.bulletPoints || []).join(' ') + ' ' + (p.description || '')
  })
  const metricsMatches = allBulletsText.match(/\b\d+(\.\d+)?%|\b\d+\+?|\$\d+/g) || []
  if (metricsMatches.length >= 3) {
    metricsScore = 5
  } else if (metricsMatches.length >= 1) {
    metricsScore = 3
    metricsSuggestions.push('Add more numbers, percentages, or scale metrics across projects and experience')
  } else {
    metricsScore = 1
    metricsSuggestions.push('Resumes with quantified metrics achieve 40% higher ATS shortlisting rates')
  }

  // Calculate Overall
  const overallScore = Math.min(
    100,
    contactScore + summaryScore + expScore + eduScore + projScore + skillScore + formatScore + metricsScore
  )

  let overallGrade: AtsBuilderScore['overallGrade'] = 'F'
  if (overallScore >= 90) overallGrade = 'A+'
  else if (overallScore >= 80) overallGrade = 'A'
  else if (overallScore >= 70) overallGrade = 'B'
  else if (overallScore >= 60) overallGrade = 'C'
  else if (overallScore >= 50) overallGrade = 'D'

  // Consolidate top suggestions
  const allSuggested = [
    ...contactSuggestions,
    ...expSuggestions,
    ...projSuggestions,
    ...metricsSuggestions,
    ...skillSuggestions,
    ...summarySuggestions,
    ...eduSuggestions,
    ...formatSuggestions
  ]

  const getStatus = (score: number, max: number): AtsBuilderCategoryScore['status'] => {
    const ratio = score / max
    if (ratio >= 0.85) return 'excellent'
    if (ratio >= 0.65) return 'good'
    if (ratio >= 0.45) return 'needs-improvement'
    return 'critical'
  }

  return {
    overallScore,
    overallGrade,
    categories: {
      contact: {
        name: 'Contact Information',
        score: contactScore,
        maxScore: 15,
        status: getStatus(contactScore, 15),
        suggestions: contactSuggestions
      },
      summary: {
        name: 'Professional Summary',
        score: summaryScore,
        maxScore: 10,
        status: getStatus(summaryScore, 10),
        suggestions: summarySuggestions
      },
      experience: {
        name: 'Work Experience',
        score: expScore,
        maxScore: 20,
        status: getStatus(expScore, 20),
        suggestions: expSuggestions
      },
      education: {
        name: 'Education Credentials',
        score: eduScore,
        maxScore: 10,
        status: getStatus(eduScore, 10),
        suggestions: eduSuggestions
      },
      projects: {
        name: 'Technical Projects',
        score: projScore,
        maxScore: 15,
        status: getStatus(projScore, 15),
        suggestions: projSuggestions
      },
      skills: {
        name: 'Skills Architecture',
        score: skillScore,
        maxScore: 15,
        status: getStatus(skillScore, 15),
        suggestions: skillSuggestions
      },
      formatting: {
        name: 'ATS Readability & Sections',
        score: formatScore,
        maxScore: 10,
        status: getStatus(formatScore, 10),
        suggestions: formatSuggestions
      },
      metrics: {
        name: 'Quantified Metrics',
        score: metricsScore,
        maxScore: 5,
        status: getStatus(metricsScore, 5),
        suggestions: metricsSuggestions
      }
    },
    suggestions: allSuggested.slice(0, 5)
  }
}
