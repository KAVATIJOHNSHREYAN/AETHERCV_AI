import {
  ParsedResume,
  AtsScoreBreakdown,
  CategoryScore,
  FormattingAnalysisResult,
  ActionVerbAnalysisResult,
  KeywordAnalysisResult
} from './types'

export function calculateAtsScore(
  resume: ParsedResume,
  formatting: FormattingAnalysisResult,
  actionVerbs: ActionVerbAnalysisResult,
  keywords: KeywordAnalysisResult
): AtsScoreBreakdown {
  // 1. Contact Information (10 pts)
  let contactScore = 0
  const contactSuggestions: string[] = []
  if (resume.contact.email) contactScore += 3
  else contactSuggestions.push('Add a professional email address (e.g. name@gmail.com).')

  if (resume.contact.phone) contactScore += 3
  else contactSuggestions.push('Add a valid phone number with country code.')

  if (resume.contact.linkedin) contactScore += 2
  else contactSuggestions.push('Include a customized LinkedIn profile URL.')

  if (resume.contact.github || resume.contact.portfolio) contactScore += 2
  else contactSuggestions.push('Include a GitHub or portfolio website link to showcase projects.')

  const contactCategory: CategoryScore = {
    name: 'Contact Information',
    score: Math.min(10, contactScore),
    maxScore: 10,
    percentage: Math.round((contactScore / 10) * 100),
    status: contactScore >= 9 ? 'excellent' : contactScore >= 6 ? 'good' : 'needs-improvement',
    feedback: contactScore >= 9
      ? 'Comprehensive contact links found including email, phone, and professional profiles.'
      : 'Missing key contact links that recruiters require for vetting and interview scheduling.',
    suggestions: contactSuggestions
  }

  // 2. Professional Summary (10 pts)
  let summaryScore = 0
  const summarySuggestions: string[] = []
  const summaryLength = resume.summary.trim().split(/\s+/).length
  if (resume.summary.length > 20) {
    if (summaryLength >= 25 && summaryLength <= 80) {
      summaryScore = 10
    } else if (summaryLength > 80) {
      summaryScore = 7
      summarySuggestions.push('Summary is too long (>80 words). Condense into 3-4 impactful sentences.')
    } else {
      summaryScore = 6
      summarySuggestions.push('Summary is too brief (<25 words). Elaborate on your target domain and top tech stack.')
    }
  } else {
    summaryScore = 0
    summarySuggestions.push('Add an executive summary at the top outlining your background, core competencies, and career goals.')
  }

  const summaryCategory: CategoryScore = {
    name: 'Professional Summary',
    score: summaryScore,
    maxScore: 10,
    percentage: Math.round((summaryScore / 10) * 100),
    status: summaryScore >= 9 ? 'excellent' : summaryScore >= 6 ? 'good' : 'needs-improvement',
    feedback: summaryScore >= 9
      ? 'Crisp, impactful executive summary targeting relevant engineering roles.'
      : 'Summary needs enhancement to grab recruiter attention within the first 6 seconds.',
    suggestions: summarySuggestions
  }

  // 3. Education (10 pts)
  let eduScore = 0
  const eduSuggestions: string[] = []
  if (resume.education.length > 0) {
    const primary = resume.education[0]
    eduScore += 4 // degree present
    if (primary.institution && primary.institution.length > 3) eduScore += 3
    if (primary.year && primary.year !== 'Year not specified') eduScore += 2
    if (primary.cgpaOrGpa) eduScore += 1

    if (!primary.cgpaOrGpa) eduSuggestions.push('Add your CGPA or academic percentage if above 7.5 or 3.0.')
    if (primary.missingDetails.length > 0) {
      eduSuggestions.push(`Specify ${primary.missingDetails.join(' and ')} for complete verification.`)
    }
  } else {
    eduSuggestions.push('Add an Education section with degree name, university/college, and graduation year.')
  }

  const educationCategory: CategoryScore = {
    name: 'Education',
    score: Math.min(10, eduScore),
    maxScore: 10,
    percentage: Math.round((eduScore / 10) * 100),
    status: eduScore >= 8 ? 'excellent' : eduScore >= 5 ? 'good' : 'needs-improvement',
    feedback: eduScore >= 8
      ? 'Education credentials and graduation timeline are clearly stated.'
      : 'Ensure degree name, institution, and graduation year are explicitly formatted.',
    suggestions: eduSuggestions
  }

  // 4. Experience (20 pts)
  let expScore = 0
  const expSuggestions: string[] = []
  if (resume.experience.length > 0) {
    expScore += 6 // has experience section
    if (resume.experience.length >= 2) expScore += 3
    
    // Check quantified metrics in experience
    const totalMetrics = resume.experience.reduce((acc, e) => acc + e.quantifiedMetrics.length, 0)
    if (totalMetrics >= 4) expScore += 6
    else if (totalMetrics >= 2) expScore += 3
    else expSuggestions.push('Add quantifiable business metrics (e.g., % improvement, revenue growth, reduced latency).')

    // Check action verbs
    const totalVerbs = resume.experience.reduce((acc, e) => acc + e.actionVerbs.length, 0)
    if (totalVerbs >= 4) expScore += 5
    else if (totalVerbs >= 2) expScore += 3
    else expSuggestions.push('Start every experience bullet with strong past-tense action verbs.')
  } else {
    // If candidate has strong projects, give partial credit or prompt for internships
    if (resume.projects.length >= 2) {
      expScore = 8
      expSuggestions.push('If you lack full-time experience, include internships, open-source contributions, or freelance work.')
    } else {
      expScore = 4
      expSuggestions.push('Add internships, teaching assistant roles, or client work in an Experience section.')
    }
  }

  const experienceCategory: CategoryScore = {
    name: 'Experience',
    score: Math.min(20, expScore),
    maxScore: 20,
    percentage: Math.round((expScore / 20) * 100),
    status: expScore >= 16 ? 'excellent' : expScore >= 11 ? 'good' : 'needs-improvement',
    feedback: expScore >= 16
      ? 'Strong experience section backed by quantified achievements and leadership verbs.'
      : 'Experience bullets need more numbers, % metrics, and business outcomes.',
    suggestions: expSuggestions
  }

  // 5. Projects (15 pts)
  let projScore = 0
  const projSuggestions: string[] = []
  if (resume.projects.length >= 3) projScore += 6
  else if (resume.projects.length >= 1) projScore += 4
  else projSuggestions.push('Showcase at least 2-3 substantial projects to demonstrate hands-on expertise.')

  const projectsWithTech = resume.projects.filter(p => p.technologies.length >= 2).length
  if (projectsWithTech >= 2) projScore += 5
  else projSuggestions.push('Specify the modern tech stack and libraries used for every project.')

  const projectsWithImpact = resume.projects.filter(p => p.businessImpact || p.achievements.length > 0).length
  if (projectsWithImpact >= 1) projScore += 4
  else projSuggestions.push('Mention measurable results or deployment scale for each project (e.g., live users, API throughput).')

  const projectsCategory: CategoryScore = {
    name: 'Projects',
    score: Math.min(15, projScore),
    maxScore: 15,
    percentage: Math.round((projScore / 15) * 100),
    status: projScore >= 12 ? 'excellent' : projScore >= 8 ? 'good' : 'needs-improvement',
    feedback: projScore >= 12
      ? 'High-impact project portfolio with modern stack coverage and demonstrable depth.'
      : 'Expand project descriptions with architecture decisions and live deployment links.',
    suggestions: projSuggestions
  }

  // 6. Skills (15 pts)
  let skillsScore = 0
  const skillsSuggestions: string[] = []
  const cat = resume.skills
  const categoriesPresent = [
    cat.programmingLanguages.length > 0,
    cat.frameworks.length > 0,
    cat.databases.length > 0,
    cat.cloudPlatforms.length > 0,
    cat.devOpsTools.length > 0,
    cat.aiMlSkills.length > 0
  ].filter(Boolean).length

  if (resume.rawSkillsList.length >= 15) skillsScore += 7
  else if (resume.rawSkillsList.length >= 8) skillsScore += 4
  else skillsSuggestions.push('Increase your technical skill inventory to match modern job requirement keywords.')

  if (categoriesPresent >= 4) skillsScore += 5
  else if (categoriesPresent >= 2) skillsScore += 3
  else skillsSuggestions.push('Group skills into distinct categories: Languages, Frameworks, Cloud, Databases.')

  if (cat.softSkills.length >= 2) skillsScore += 3
  else skillsSuggestions.push('Include 2-3 demonstrated soft skills (e.g. Cross-functional Collaboration, Agile/Scrum).')

  const skillsCategory: CategoryScore = {
    name: 'Skills',
    score: Math.min(15, skillsScore),
    maxScore: 15,
    percentage: Math.round((skillsScore / 15) * 100),
    status: skillsScore >= 12 ? 'excellent' : skillsScore >= 8 ? 'good' : 'needs-improvement',
    feedback: skillsScore >= 12
      ? 'Broad, well-categorized skill profile aligned with industry standards.'
      : 'Skills section should be broadened across backend, frontend, and cloud tooling.',
    suggestions: skillsSuggestions
  }

  // 7. Certifications (5 pts)
  let certScore = 0
  const certSuggestions: string[] = []
  if (resume.certifications.length >= 2) certScore = 5
  else if (resume.certifications.length === 1) certScore = 3
  else {
    certScore = 1
    certSuggestions.push('Adding verified certifications (e.g. AWS Solutions Architect, Azure Developer, Kubernetes CKA) boosts ATS score.')
  }

  const certCategory: CategoryScore = {
    name: 'Certifications',
    score: certScore,
    maxScore: 5,
    percentage: Math.round((certScore / 5) * 100),
    status: certScore >= 4 ? 'excellent' : certScore >= 2 ? 'good' : 'needs-improvement',
    feedback: certScore >= 4 ? 'Relevant verified credentials provided.' : 'Consider adding cloud or security credentials.',
    suggestions: certSuggestions
  }

  // 8. Formatting (5 pts)
  let formatScore = 0
  const formatSuggestions: string[] = []
  if (formatting.wordCount >= 250 && formatting.wordCount <= 850) formatScore += 2
  else formatSuggestions.push('Target optimal length of 400-650 words (ideal single page format).')

  if (formatting.bulletPointCount >= 8) formatScore += 2
  else formatSuggestions.push('Use bulleted lists rather than long dense paragraphs for fast parsing.')

  if (!formatting.paragraphDensityWarning) formatScore += 1
  else formatSuggestions.push('Break large paragraphs (>4 lines) into bullet points.')

  const formatCategory: CategoryScore = {
    name: 'Formatting',
    score: Math.min(5, formatScore),
    maxScore: 5,
    percentage: Math.round((formatScore / 5) * 100),
    status: formatScore >= 4 ? 'excellent' : formatScore >= 2 ? 'good' : 'needs-improvement',
    feedback: formatScore >= 4 ? 'Clean structure, optimal length, and ATS-friendly parsing layout.' : 'Formatting needs bullet optimization.',
    suggestions: formatSuggestions
  }

  // 9. Action Verbs (5 pts)
  let actionScore = 0
  const actionSuggestions: string[] = []
  if (actionVerbs.uniqueVerbsFound.length >= 8) actionScore = 5
  else if (actionVerbs.uniqueVerbsFound.length >= 4) actionScore = 3
  else if (actionVerbs.uniqueVerbsFound.length >= 1) actionScore = 2
  else actionSuggestions.push('Infuse dynamic action verbs (Engineered, Architected, Accelerated, Spearheaded).')

  if (actionVerbs.weakVerbsUsed.length > 0) {
    actionSuggestions.push(`Replace passive words like "${actionVerbs.weakVerbsUsed.map(w => w.verb).slice(0, 3).join(', ')}" with stronger verbs.`)
  }

  const actionCategory: CategoryScore = {
    name: 'Action Verbs',
    score: actionScore,
    maxScore: 5,
    percentage: Math.round((actionScore / 5) * 100),
    status: actionScore >= 4 ? 'excellent' : actionScore >= 2 ? 'good' : 'needs-improvement',
    feedback: actionScore >= 4 ? 'Strong leadership verbs drive compelling resume narrative.' : 'Incorporate more assertive power verbs.',
    suggestions: actionSuggestions
  }

  // 10. Keyword Optimization (5 pts)
  let kwScore = 0
  const kwSuggestions: string[] = []
  if (keywords.strongKeywords.length >= 10) kwScore += 3
  else if (keywords.strongKeywords.length >= 5) kwScore += 2
  else kwSuggestions.push('Increase high-value technical keywords relevant to your specialization.')

  if (keywords.missingImportant.length <= 3) kwScore += 2
  else kwSuggestions.push(`Add trending domain keywords: ${keywords.missingImportant.slice(0, 4).join(', ')}.`)

  const kwCategory: CategoryScore = {
    name: 'Keyword Optimization',
    score: Math.min(5, kwScore),
    maxScore: 5,
    percentage: Math.round((kwScore / 5) * 100),
    status: kwScore >= 4 ? 'excellent' : kwScore >= 2 ? 'good' : 'needs-improvement',
    feedback: kwScore >= 4 ? 'Rich domain keyword density recognized by ATS bots.' : 'Resume is missing several high-frequency keywords.',
    suggestions: kwSuggestions
  }

  // Overall Total (100 pts)
  const overallScore = Math.round(
    contactCategory.score +
    summaryCategory.score +
    educationCategory.score +
    experienceCategory.score +
    projectsCategory.score +
    skillsCategory.score +
    certCategory.score +
    formatCategory.score +
    actionCategory.score +
    kwCategory.score
  )

  let overallGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C'
  if (overallScore >= 92) overallGrade = 'A+'
  else if (overallScore >= 85) overallGrade = 'A'
  else if (overallScore >= 75) overallGrade = 'B'
  else if (overallScore >= 65) overallGrade = 'C'
  else if (overallScore >= 50) overallGrade = 'D'
  else overallGrade = 'F'

  let overallSummary = ''
  if (overallScore >= 85) {
    overallSummary = 'Top Tier Resume! Your resume is strongly optimized for ATS screening algorithms and hiring manager scans.'
  } else if (overallScore >= 70) {
    overallSummary = 'Solid Foundation. Your resume will pass basic ATS filters, but adding quantified impact metrics and targeted keywords will elevate interview callback rates.'
  } else {
    overallSummary = 'Needs Optimization. Key sections, measurable achievements, or formatting elements require enhancement before applying to competitive positions.'
  }

  return {
    overallScore,
    overallGrade,
    overallSummary,
    categories: {
      contactInfo: contactCategory,
      professionalSummary: summaryCategory,
      education: educationCategory,
      experience: experienceCategory,
      projects: projectsCategory,
      skills: skillsCategory,
      certifications: certCategory,
      formatting: formatCategory,
      actionVerbs: actionCategory,
      keywordOptimization: kwCategory
    }
  }
}
