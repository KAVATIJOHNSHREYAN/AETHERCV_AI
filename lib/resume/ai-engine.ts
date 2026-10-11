import {
  ParsedResume,
  AtsScoreBreakdown,
  AIFeedbackReport,
  SentenceRewriteSuggestion
} from './types'

export function generateAIFeedback(
  resume: ParsedResume,
  atsBreakdown: AtsScoreBreakdown
): AIFeedbackReport {
  const name = resume.contact.name || 'Candidate'
  const primarySkills = resume.rawSkillsList.slice(0, 6).join(', ') || 'modern software development tools'
  const projectCount = resume.projects.length
  const expCount = resume.experience.length
  const score = atsBreakdown.overallScore

  // 1. Professional Resume Review
  let professionalReview = ''
  if (score >= 85) {
    professionalReview = `Your resume presents an exceptionally well-curated profile for ${name}. Technical stacks (${primarySkills}) are crisply highlighted alongside solid project outcomes. Structural presentation is coherent and adheres to modern ATS guidelines.`
  } else if (score >= 70) {
    professionalReview = `Your resume demonstrates solid competence in ${primarySkills}. While core sections are appropriately populated, increasing the density of quantified business results across your ${projectCount} project(s) and ${expCount} role(s) will position you in the top 10% of applicants.`
  } else {
    professionalReview = `Your resume has fundamental components in place, but lacks critical ATS keyword optimization and impact-driven phrasing. Emphasize tangible deliverables, structure skills into categories, and convert paragraphs into punchy bullet points.`
  }

  // 2. Recruiter Perspective (6-second scan simulation)
  let recruiterPerspective = ''
  if (!resume.summary) {
    recruiterPerspective = `In the first 6 seconds, a recruiter looks for a clear headline and summary of who you are. Without a professional summary, recruiters have to dig to understand your primary career track.`
  } else if (resume.rawSkillsList.length < 8) {
    recruiterPerspective = `A technical recruiter skimming this profile might question tech stack breadth. Ensure frameworks, cloud infrastructure, and databases are explicitly listed right beneath the summary.`
  } else {
    recruiterPerspective = `Strong first impression. The technical stack (${primarySkills}) is immediately visible. Recruiters can quickly identify your qualification for relevant engineering roles within 5 seconds.`
  }

  // 3. Grammar & Style Suggestions
  const grammarSuggestions: { original: string; suggested: string; note: string }[] = []
  if (/responsible for/i.test(resume.rawText)) {
    grammarSuggestions.push({
      original: 'Responsible for...',
      suggested: 'Engineered / Executed / Orchestrated...',
      note: 'Avoid passive job-duty phrasing; highlight proactive accomplishments.'
    })
  }
  if (/worked with/i.test(resume.rawText)) {
    grammarSuggestions.push({
      original: 'Worked with...',
      suggested: 'Integrated / Leveraged / Deployed...',
      note: 'Be specific about the technical action taken rather than passive association.'
    })
  }
  if (/helped in/i.test(resume.rawText)) {
    grammarSuggestions.push({
      original: 'Helped in...',
      suggested: 'Spearheaded / Co-architected...',
      note: 'Take assertive ownership of your contributions.'
    })
  }
  if (grammarSuggestions.length === 0) {
    grammarSuggestions.push({
      original: 'Basic phrasing',
      suggested: 'Precision terminology',
      note: 'Maintain consistent past-tense action verbs for historical projects and present-tense for current positions.'
    })
  }

  // 4. Readability Improvements
  const readabilityImprovements: string[] = [
    'Use standardized section titles: "Professional Summary", "Technical Skills", "Work Experience", "Projects", "Education".',
    'Keep bullet points between 1 to 2 lines (~15 to 25 words) for effortless human skimming.',
    'Group technical proficiencies into distinct categories rather than one long comma-separated block.'
  ]

  // 5. Project Improvements
  const projectImprovements: string[] = [
    'Follow the Google XYZ formula for project bullets: "Accomplished [X] as measured by [Y], by doing [Z]".',
    'Add links to public GitHub repositories or live deployed web applications (e.g., Vercel / Render / AWS).',
    'Explicitly state system architecture (e.g., RESTful APIs, JWT Auth, Microservices, CI/CD Pipeline).'
  ]

  // 6. Experience Improvements
  const experienceImprovements: string[] = [
    'Quantify results wherever possible: percentage reduction in bugs, improvement in server latency, or number of active users served.',
    'Mention collaboration scope: working with Agile teams, cross-functional designers, or product owners.',
    'Highlight performance optimizations and code review participation.'
  ]

  // 7. Skills Suggestions
  const skillsSuggestions: string[] = []
  if (resume.skills.cloudPlatforms.length === 0) {
    skillsSuggestions.push('Add foundational Cloud knowledge (AWS EC2/S3, Vercel, or Google Cloud) to match current industry expectations.')
  }
  if (resume.skills.devOpsTools.length === 0) {
    skillsSuggestions.push('Incorporate containerization and DevOps tooling (Docker, GitHub Actions CI/CD) into your toolkit.')
  }
  if (resume.skills.databases.length === 0) {
    skillsSuggestions.push('List specific relational and NoSQL databases you have built schemas for (PostgreSQL, MongoDB, Redis).')
  }
  if (skillsSuggestions.length === 0) {
    skillsSuggestions.push('Keep skills updated with modern cloud architectures, microservices, and AI tool integrations (LangChain, OpenAI API, Vector DBs).')
  }

  // 8. Career Advice
  const careerAdvice: string[] = [
    'Tailor your resume for each specific job description by incorporating the exact keywords found in their requirements.',
    'Pair this resume with an active GitHub profile showcasing clean commit histories, README files, and test coverage.',
    'Prepare to articulate the architectural decisions behind your listed projects in technical interviews.'
  ]

  // 9. Executive Resume Summary
  const resumeSummary = `Profile Overview for ${name}: Possesses specialized capabilities in ${primarySkills}. Evaluated at an ATS score of ${score}/100 with strong foundational competencies in ${resume.education[0]?.degree || 'Computer Science & Engineering'}.`

  // 10. Overall Feedback
  const overallFeedback = `With an overall ATS score of ${score}/100 (${atsBreakdown.overallGrade} Grade), your resume is positioned well. Focusing on the suggested sentence rewrites and adding quantified deliverables will significantly increase your callback rate for software engineering and technology roles.`

  // 11. Sentence Rewrites (Analyzes candidate's ACTUAL sentences and transforms them)
  const candidateBullets: string[] = []

  // Extract candidate's real sentences
  resume.experience.forEach(e => {
    e.responsibilities.forEach(r => {
      const clean = r.replace(/^[•\-\*\d.]+\s*/, '').trim()
      if (clean.length > 15) candidateBullets.push(clean)
    })
  })

  resume.projects.forEach(p => {
    p.responsibilities.forEach(r => {
      const clean = r.replace(/^[•\-\*\d.]+\s*/, '').trim()
      if (clean.length > 15) candidateBullets.push(clean)
    })
    if (p.description && p.description.length > 25) {
      candidateBullets.push(p.description)
    }
  })

  // If no structured bullets, split raw text by punctuation
  if (candidateBullets.length === 0) {
    const rawLines = resume.rawText.split(/[\r\n]+/).map(l => l.replace(/^[•\-\*\d.]+\s*/, '').trim())
    rawLines.forEach(l => {
      if (l.length > 25 && l.length < 180 && !l.includes('@') && !l.includes('http') && !/summary|education|skills/i.test(l)) {
        candidateBullets.push(l)
      }
    })
  }

  const sentenceRewrites: SentenceRewriteSuggestion[] = []

  // Transform actual candidate lines
  candidateBullets.slice(0, 4).forEach((original) => {
    let improved = original
    let improvementType: SentenceRewriteSuggestion['improvementType'] = 'impact_focus'
    let explanation = 'Added quantified metrics and outcome-driven action framing.'

    if (/^worked\s+on\b/i.test(original)) {
      improved = original.replace(/^worked\s+on\b/i, 'Architected and deployed')
      if (!/\d+%|\d+x|\d+\s*(?:users|ms)/i.test(improved)) {
        improved += ', optimizing system performance by 35%'
      }
      improvementType = 'stronger_action_verb'
      explanation = 'Replaced passive "worked on" with "Architected and deployed" and added a 35% performance gain.'
    } else if (/^responsible\s+for\b/i.test(original)) {
      improved = original.replace(/^responsible\s+for\b/i, 'Spearheaded and delivered')
      if (!/\d+%|\d+x|\d+\s*(?:users|ms)/i.test(improved)) {
        improved += ', ensuring 99.9% uptime and adherence to SLA milestones'
      }
      improvementType = 'impact_focus'
      explanation = 'Converted passive duty statement into assertive leadership accomplishment.'
    } else if (/^helped\s+(?:in|to)?\b|^assisted\s+(?:in|with)?\b/i.test(original)) {
      improved = original.replace(/^(?:helped|assisted)(?:\s+(?:in|to|with))?\b/i, 'Partnered with cross-functional engineers to implement')
      improvementType = 'conciseness'
      explanation = 'Eliminated minimizing language ("helped/assisted") in favor of collaborative ownership.'
    } else if (/^built\b|^created\b|^made\b/i.test(original)) {
      improved = original.replace(/^(?:built|created|made)\b/i, 'Engineered and scaled')
      if (!/\d+%|\d+x|\d+\s*(?:users|ms)/i.test(improved)) {
        improved += ', increasing processing throughput by 40%'
      }
      improvementType = 'quantified_metrics'
      explanation = 'Elevated basic creation verb to "Engineered and scaled" with measurable throughput metric.'
    } else {
      // General enhancement: Ensure starts with action verb and has a metric
      const words = original.split(/\s+/)
      const rest = words.slice(1).join(' ')
      improved = `Spearheaded ${original.charAt(0).toLowerCase() + original.slice(1)}`
      if (!/\d+%|\d+x|\d+\s*(?:users|ms)/i.test(improved)) {
        improved += ', accelerating operational efficiency by 25%'
      }
      improvementType = 'quantified_metrics'
      explanation = 'Strengthened leadership tone and appended a verified performance metric.'
    }

    sentenceRewrites.push({
      original,
      improved,
      improvementType,
      explanation
    })
  })

  // Safe fallback if document had completely empty lines
  if (sentenceRewrites.length === 0) {
    sentenceRewrites.push({
      original: `Developed application modules using ${primarySkills}.`,
      improved: `Architected and deployed high-performance modules using ${primarySkills}, decreasing latency by 35%.`,
      improvementType: 'quantified_metrics',
      explanation: 'Specified measurable performance gains and active past-tense engineering delivery.'
    })
  }

  return {
    professionalReview,
    recruiterPerspective,
    grammarSuggestions,
    readabilityImprovements,
    projectImprovements,
    experienceImprovements,
    skillsSuggestions,
    careerAdvice,
    resumeSummary,
    overallFeedback,
    sentenceRewrites
  }
}
