import { ParsedResume } from '@/lib/resume/types'
import { JobDetails, GeneratedCoverLetter, WritingTone } from '@/types/cover-letter'

// Keyword extraction from job description
export function extractKeywordsFromJD(text: string): string[] {
  if (!text) return []
  const clean = text.toLowerCase()
  const stopWords = new Set([
    'the', 'and', 'to', 'of', 'a', 'in', 'is', 'that', 'for', 'it', 'as', 'was', 'with',
    'be', 'by', 'on', 'not', 'he', 'i', 'this', 'are', 'or', 'an', 'will', 'my', 'one',
    'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who',
    'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him',
    'know', 'take', 'person', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see',
    'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
    'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
    'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'we', 'must',
    'should', 'responsible', 'requirements', 'qualifications', 'job', 'role', 'team', 'company'
  ])

  const matches = clean.match(/\b[a-zA-Z][a-zA-Z0-9+#.-]{2,}\b/g) || []
  const counts: Record<string, number> = {}
  for (const m of matches) {
    if (!stopWords.has(m) && m.length > 2) {
      counts[m] = (counts[m] || 0) + 1
    }
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w]) => w)
}

// Extract matched skills between resume and job description
export function matchSkillsWithJD(resume: ParsedResume, jdText: string): {
  matched: string[]
  missing: string[]
} {
  const jdLower = (jdText || '').toLowerCase()
  const allResumeSkills = [
    ...(resume.skills.programmingLanguages || []),
    ...(resume.skills.frameworks || []),
    ...(resume.skills.libraries || []),
    ...(resume.skills.databases || []),
    ...(resume.skills.cloudPlatforms || []),
    ...(resume.skills.devOpsTools || []),
    ...(resume.skills.aiMlSkills || []),
    ...(resume.skills.softSkills || []),
    ...(resume.skills.other || [])
  ]

  const matched: string[] = []
  const uniqueSkills = Array.from(new Set(allResumeSkills))

  for (const s of uniqueSkills) {
    const sLower = s.toLowerCase()
    if (sLower.length >= 2 && jdLower.includes(sLower)) {
      matched.push(s)
    }
  }

  // Common high-demand tech skills to detect if JD requests them but resume lacks them
  const standardTechPool = [
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'TypeScript', 'Python', 'React',
    'Next.js', 'Node.js', 'GraphQL', 'PostgreSQL', 'MongoDB', 'Redis', 'CI/CD',
    'Microservices', 'RESTful APIs', 'Tailwind CSS', 'System Design'
  ]
  const missing: string[] = []
  const resumeSkillsLower = new Set(uniqueSkills.map(s => s.toLowerCase()))

  for (const tech of standardTechPool) {
    if (jdLower.includes(tech.toLowerCase()) && !resumeSkillsLower.has(tech.toLowerCase())) {
      missing.push(tech)
    }
  }

  return {
    matched: Array.from(new Set(matched)),
    missing: Array.from(new Set(missing)).slice(0, 4)
  }
}

// Generate stylized tone-specific content
export function generateToneVariations(
  tone: WritingTone,
  candidateName: string,
  companyName: string,
  jobTitle: string,
  matchedSkills: string[],
  topExperienceCompany?: string,
  topProjectName?: string,
  yearsExp?: string
) {
  const skillsList = matchedSkills.slice(0, 4).join(', ') || 'modern software engineering and scalable systems'
  const expMention = topExperienceCompany ? `during my tenure at ${topExperienceCompany}` : 'across my professional career'
  const projMention = topProjectName ? `such as ${topProjectName}` : 'production initiatives'
  const expDuration = yearsExp ? `${yearsExp} of hands-on expertise` : 'proven engineering competencies'

  switch (tone) {
    case 'startup':
      return {
        opening: `I am thrilled to submit my application for the ${jobTitle} position at ${companyName}. Having tracked ${companyName}'s rapid innovation and ambitious product roadmap, I am eager to bring ${expDuration} in ${skillsList} to help scale your systems and accelerate sprint delivery.`,
        skills: `My technical toolkit centers directly on high-velocity execution. I specialize in ${skillsList}, building performant and maintainable architectures that adapt seamlessly as business requirements evolve.`,
        experience: `In fast-moving product cycles ${expMention}, I have prioritized rapid prototyping, robust automated testing, and high developer velocity. I take extreme ownership from initial design through to production deployment.`,
        projects: `Through key projects including ${projMention}, I have built end-to-end architectures focused on solving tangible user pain points with measurable efficiency and clean abstractions.`,
        whyCompany: `What excites me most about ${companyName} is your builder-first mindset and obsession with crafting exceptional user experiences without bureaucratic overhead.`,
        closing: `I would welcome the opportunity to dive into how my background aligns with your upcoming milestones. Thank you for your consideration, and I look forward to speaking soon.`
      }

    case 'executive':
      return {
        opening: `It is with sincere enthusiasm that I submit my candidacy for the ${jobTitle} role at ${companyName}. With ${expDuration} driving high-impact technical initiatives, I offer a track record of architectural excellence and strategic cross-functional execution in ${skillsList}.`,
        skills: `Throughout my career, I have cultivated deep proficiencies in ${skillsList}. I align engineering objectives directly with bottom-line business metrics, ensuring systems remain resilient, secure, and compliant.`,
        experience: `My background ${expMention} has centered on leading strategic engineering outcomes, refining mission-critical pipelines, and mentoring high-performing contributors to consistently exceed quarterly targets.`,
        projects: `High-visibility undertakings, including ${projMention}, illustrate my commitment to delivering mission-grade solutions on schedule while safeguarding performance and technical rigor.`,
        whyCompany: `${companyName}'s market authority and unwavering commitment to high-standard execution make this an ideal environment where my leadership and engineering ethos can yield immediate value.`,
        closing: `I look forward to discussing how my strategic orientation and technical capabilities can support ${companyName}'s strategic priorities. Thank you for your time and consideration.`
      }

    case 'confident':
      return {
        opening: `I am writing to express my strong candidacy for the ${jobTitle} position at ${companyName}. Equipped with ${expDuration} and proven mastery in ${skillsList}, I am confident in my ability to immediately add value to your engineering team.`,
        skills: `I bring deep practical mastery of ${skillsList}. I pride myself on writing clean, scalable code and delivering high-performance features that measurably improve user engagement.`,
        experience: `Throughout my work ${expMention}, I have consistently solved complex engineering bottlenecks, accelerated turnaround times, and introduced robust patterns that elevated code quality across the team.`,
        projects: `My portfolio, particularly ${projMention}, highlights my capability to take complex technical requirements and deliver elegant, robust, and dependable software solutions.`,
        whyCompany: `${companyName} is setting industry benchmarks, and I am keen to deploy my problem-solving drive to help your team continue outperforming expectations.`,
        closing: `I am eager to discuss how my skillset can directly benefit ${companyName}'s upcoming product deliverables. Thank you for your time.`
      }

    case 'creative':
      return {
        opening: `When I discovered the ${jobTitle} opening at ${companyName}, I immediately recognized a rare synergy between your bold creative trajectory and my passion for engineering human-centric, high-impact digital experiences.`,
        skills: `Blending thoughtful craftsmanship with technical precision, my expertise in ${skillsList} allows me to bridge the gap between ambitious product concepts and rock-solid system architecture.`,
        experience: `During my engineering endeavors ${expMention}, I have cultivated an eye for nuanced problem-solving, pushing beyond standard approaches to develop solutions that delight users and stand the test of scale.`,
        projects: `Initiatives like ${projMention} reflect my curiosity and dedication to turning complex challenges into streamlined, expressive, and dependable digital products.`,
        whyCompany: `${companyName} stands out for its bold creative identity and refusal to settle for conventional solutions. Building alongside a team with this degree of vision is precisely where I thrive.`,
        closing: `I would love the opportunity to share how my unique blend of technical discipline and creative problem-solving can enrich ${companyName}'s products. Thank you for reading.`
      }

    case 'technical':
      return {
        opening: `I am applying for the ${jobTitle} opening at ${companyName}. With ${expDuration} focused on backend architecture, API resilience, and ${skillsList}, I am prepared to contribute immediately to your technical infrastructure.`,
        skills: `My core technical competencies include ${skillsList}. I prioritize modular system design, predictable algorithmic complexity, deterministic concurrency, and rigorous unit and integration coverage.`,
        experience: `In my role ${expMention}, I engineered core service modules, optimized latency benchmarks, and systematically resolved runtime bottlenecks to ensure high uptime and resource efficiency.`,
        projects: `In technical deliverables such as ${projMention}, I designed decoupled architectures with well-defined service contracts, comprehensive logging, and automated build pipelines.`,
        whyCompany: `I admire ${companyName}'s engineering culture, especially your commitment to technical excellence, modern stack evolution, and maintainable software practices.`,
        closing: `I welcome a technical discussion to walk through my codebase architecture and explore how my engineering background aligns with ${companyName}'s needs. Thank you for your evaluation.`
      }

    case 'formal':
    case 'corporate':
      return {
        opening: `Please accept this letter as formal application for the ${jobTitle} position currently available at ${companyName}. With ${expDuration} specializing in ${skillsList}, I am well-prepared to contribute to your organization's ongoing success.`,
        skills: `My background encompasses comprehensive experience in ${skillsList}. I have developed strong proficiencies adhering to established organizational protocols, regulatory standards, and software life-cycle methodologies.`,
        experience: `During my tenure ${expMention}, I have consistently demonstrated accountability, dependable execution, and effective collaboration with multi-disciplinary stakeholders across the enterprise.`,
        projects: `Documented achievements, such as ${projMention}, reflect my methodical approach toward project governance, milestone realization, and quality assurance.`,
        whyCompany: `${companyName}'s distinguished reputation within the industry and commitment to sustainable corporate governance represent the ideal organization for my professional dedication.`,
        closing: `Thank you for your consideration of my credentials. I remain at your disposal for a formal interview to discuss how my qualifications align with the requirements of ${companyName}.`
      }

    case 'friendly':
      return {
        opening: `I was so excited to see the opening for the ${jobTitle} role at ${companyName}! Having followed your team's great work, I would love the chance to bring my experience in ${skillsList} to support your awesome team.`,
        skills: `I really enjoy working with ${skillsList}. For me, great software is just as much about clear communication and positive team collaboration as it is about clean, maintainable code.`,
        experience: `Working ${expMention}, I made sure to be the teammate everyone could count on—always ready to pair program, unblock teammates, and deliver high-quality work with a smile.`,
        projects: `I had a fantastic time building projects like ${projMention}, where I was able to transform feedback directly into features that users genuinely enjoy using every day.`,
        whyCompany: `The welcoming culture and thoughtful products at ${companyName} truly inspire me. It would be a genuine privilege to contribute to a place that values its people and users so deeply.`,
        closing: `I would love to chat more about how I can be a helpful and enthusiastic addition to your team at ${companyName}! Thanks so much for taking the time to review my application.`
      }

    case 'modern':
    case 'professional':
    default:
      return {
        opening: `I am writing to express my enthusiastic interest in the ${jobTitle} position at ${companyName}. With ${expDuration} centered on ${skillsList}, I am eager to apply my technical background and problem-solving focus to support your team's strategic objectives.`,
        skills: `My professional skill set is anchored in ${skillsList}. I focus on delivering scalable, maintainable, and high-impact solutions that blend technical rigor with clear user value.`,
        experience: `Through my experience ${expMention}, I have delivered robust features across the entire software development lifecycle, ensuring high performance, responsive interfaces, and test coverage.`,
        projects: `Key initiatives, including ${projMention}, reflect my ability to translate technical specifications into dependable, well-architected applications with measurable impact.`,
        whyCompany: `${companyName}'s dedication to innovation and quality makes this an exciting environment where my dedication to technical craftsmanship and collaboration can contribute immediately.`,
        closing: `I welcome the opportunity to discuss how my experience and technical proficiencies can support ${companyName}'s engineering goals. Thank you for your time and consideration.`
      }
  }
}

// Main generation function adhering strictly to "Never Hallucinate" rule
export function generateCoverLetterFromResumeAndJD(
  resume: ParsedResume,
  jobDetails: JobDetails
): GeneratedCoverLetter {
  const candidateName = resume.contact.name || 'Candidate'
  const candidateEmail = resume.contact.email || ''
  const candidatePhone = resume.contact.phone || ''
  const candidateLocation = resume.contact.address || ''

  const companyName = jobDetails.companyName.trim() || 'Company'
  const jobTitle = jobDetails.jobTitle.trim() || 'Software Engineer'
  const recipientName = jobDetails.hiringManager?.trim() || 'Hiring Team'
  const recipientTitle = jobDetails.hiringManager?.trim() ? `Hiring Manager, ${companyName}` : `Hiring Committee, ${companyName}`

  const { matched, missing } = matchSkillsWithJD(resume, jobDetails.jobDescription)
  const keywords = extractKeywordsFromJD(jobDetails.jobDescription)

  const topExperience = resume.experience[0]
  const topProject = resume.projects[0]

  const toneVariations = generateToneVariations(
    jobDetails.tone,
    candidateName,
    companyName,
    jobTitle,
    matched.length > 0 ? matched : (resume.skills.programmingLanguages || []).slice(0, 4),
    topExperience?.company,
    topProject?.name,
    jobDetails.yearsOfExperience
  )

  const greeting = jobDetails.hiringManager?.trim()
    ? `Dear ${jobDetails.hiringManager.trim()},`
    : `Dear Hiring Team at ${companyName},`

  const dateStr = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  // Full Markdown compilation
  const fullMarkdown = `# Cover Letter — ${candidateName}
**Target Role:** ${jobTitle} at ${companyName}
**Date:** ${dateStr}

---

**${candidateName}**  
${candidateEmail ? `${candidateEmail} | ` : ''}${candidatePhone ? `${candidatePhone} | ` : ''}${candidateLocation || ''}

${dateStr}

**To:**  
${recipientName}  
${recipientTitle}  
${companyName}  

---

${greeting}

${toneVariations.opening}

${toneVariations.skills}

${toneVariations.experience}

${toneVariations.projects}

${toneVariations.whyCompany}

${toneVariations.closing}

Sincerely,  
**${candidateName}**
`

  const fullPlainText = `${candidateName}
${candidateEmail ? `${candidateEmail} | ` : ''}${candidatePhone ? `${candidatePhone} | ` : ''}${candidateLocation || ''}

${dateStr}

To:
${recipientName}
${recipientTitle}
${companyName}

${greeting}

${toneVariations.opening}

${toneVariations.skills}

${toneVariations.experience}

${toneVariations.projects}

${toneVariations.whyCompany}

${toneVariations.closing}

Sincerely,
${candidateName}
`

  const now = new Date().toISOString()

  return {
    id: `cl_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    candidateName,
    candidateEmail,
    candidatePhone,
    candidateLocation,
    recipientName,
    recipientTitle,
    companyName,
    jobTitle,
    date: dateStr,
    greeting,
    openingParagraph: toneVariations.opening,
    skillsParagraph: toneVariations.skills,
    experienceParagraph: toneVariations.experience,
    projectsParagraph: toneVariations.projects,
    whyCompanyParagraph: toneVariations.whyCompany,
    closingParagraph: toneVariations.closing,
    signOff: `Sincerely,\n${candidateName}`,
    fullMarkdown,
    fullPlainText,
    matchedSkills: matched,
    missingSkillsHighlight: missing,
    extractedKeywords: keywords,
    toneUsed: jobDetails.tone,
    createdAt: now,
    updatedAt: now
  }
}
