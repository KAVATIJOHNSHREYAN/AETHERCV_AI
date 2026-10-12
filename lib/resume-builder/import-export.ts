import { ResumeBuilderData, ProjectEntry } from '@/types/resume-builder'
import { ParsedResume } from '@/lib/resume/types'

// Converts ResumeBuilderData to plain text format
export function exportToPlainText(data: ResumeBuilderData): string {
  const p = data.personalInfo
  const lines: string[] = []

  // Header
  lines.push(`${p.firstName} ${p.lastName}`.toUpperCase())
  if (p.professionalTitle) lines.push(p.professionalTitle)
  const contactParts = [p.email, p.phone, p.location, p.linkedin, p.github, p.portfolio].filter(Boolean)
  lines.push(contactParts.join(' | '))
  lines.push('')

  // Summary
  if (data.professionalSummary) {
    lines.push('PROFESSIONAL SUMMARY')
    lines.push('--------------------')
    lines.push(data.professionalSummary)
    lines.push('')
  }

  // Skills
  if (data.skills.length > 0) {
    lines.push('TECHNICAL SKILLS')
    lines.push('----------------')
    data.skills.forEach((cat) => {
      lines.push(`${cat.category}: ${cat.skills.join(', ')}`)
    })
    lines.push('')
  }

  // Experience
  if (data.experience.length > 0) {
    lines.push('WORK EXPERIENCE')
    lines.push('---------------')
    data.experience.forEach((e) => {
      lines.push(`${e.role} | ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})`)
      if (e.location) lines.push(`Location: ${e.location}`)
      ;(e.responsibilities || []).forEach((r) => lines.push(`• ${r}`))
      ;(e.achievements || []).forEach((a) => lines.push(`• Achievement: ${a}`))
      if (e.technologiesUsed && e.technologiesUsed.length > 0) {
        lines.push(`Technologies: ${e.technologiesUsed.join(', ')}`)
      }
      lines.push('')
    })
  }

  // Projects
  if (data.projects.length > 0) {
    lines.push('KEY PROJECTS')
    lines.push('------------')
    data.projects.forEach((proj) => {
      const urls = [proj.githubUrl && `GitHub: ${proj.githubUrl}`, proj.liveUrl && `Demo: ${proj.liveUrl}`]
        .filter(Boolean)
        .join(' | ')
      lines.push(`${proj.name} ${urls ? `(${urls})` : ''}`)
      if (proj.technologies && proj.technologies.length > 0) {
        lines.push(`Tech Stack: ${proj.technologies.join(', ')}`)
      }
      if (proj.description) lines.push(proj.description)
      ;(proj.bulletPoints || []).forEach((bp) => lines.push(`• ${bp}`))
      lines.push('')
    })
  }

  // Education
  if (data.education.length > 0) {
    lines.push('EDUCATION')
    lines.push('---------')
    data.education.forEach((edu) => {
      lines.push(`${edu.degree} - ${edu.university} (${edu.startDate} - ${edu.endDate || 'Present'})`)
      if (edu.college) lines.push(edu.college)
      if (edu.cgpa) lines.push(`CGPA / GPA: ${edu.cgpa}`)
      if (edu.description) lines.push(edu.description)
      lines.push('')
    })
  }

  // Certifications
  if (data.certifications.length > 0) {
    lines.push('CERTIFICATIONS')
    lines.push('--------------')
    data.certifications.forEach((c) => {
      lines.push(`• ${c.name} — ${c.issuer} (${c.issueDate})${c.credentialUrl ? ` [${c.credentialUrl}]` : ''}`)
    })
    lines.push('')
  }

  // Achievements
  if (data.achievements.length > 0) {
    lines.push('ACHIEVEMENTS')
    lines.push('------------')
    data.achievements.forEach((a) => {
      lines.push(`• ${a.title}${a.date ? ` (${a.date})` : ''}: ${a.description}`)
    })
    lines.push('')
  }

  // Languages
  if (data.languages.length > 0) {
    lines.push('LANGUAGES')
    lines.push('---------')
    lines.push(data.languages.map((l) => `${l.language} (${l.proficiency})`).join(', '))
    lines.push('')
  }

  return lines.join('\n')
}

// Converts ResumeBuilderData to Markdown
export function exportToMarkdown(data: ResumeBuilderData): string {
  const p = data.personalInfo
  const lines: string[] = []

  lines.push(`# ${p.firstName} ${p.lastName}`)
  if (p.professionalTitle) lines.push(`**${p.professionalTitle}**\n`)
  const contacts = [
    p.email && `[${p.email}](mailto:${p.email})`,
    p.phone,
    p.location,
    p.linkedin && `[LinkedIn](${p.linkedin})`,
    p.github && `[GitHub](${p.github})`,
    p.portfolio && `[Portfolio](${p.portfolio})`
  ].filter(Boolean)
  lines.push(contacts.join(' • ') + '\n')

  if (data.professionalSummary) {
    lines.push('## Professional Summary')
    lines.push(data.professionalSummary + '\n')
  }

  if (data.skills.length > 0) {
    lines.push('## Technical Skills')
    data.skills.forEach((cat) => {
      lines.push(`- **${cat.category}:** ${cat.skills.join(', ')}`)
    })
    lines.push('')
  }

  if (data.experience.length > 0) {
    lines.push('## Experience')
    data.experience.forEach((e) => {
      lines.push(`### ${e.role} — ${e.company}`)
      lines.push(`*${e.startDate} – ${e.current ? 'Present' : e.endDate} | ${e.location}*\n`)
      ;(e.responsibilities || []).forEach((r) => lines.push(`- ${r}`))
      ;(e.achievements || []).forEach((a) => lines.push(`- **Impact:** ${a}`))
      if (e.technologiesUsed && e.technologiesUsed.length > 0) {
        lines.push(`- *Tech:* ${e.technologiesUsed.join(', ')}`)
      }
      lines.push('')
    })
  }

  if (data.projects.length > 0) {
    lines.push('## Projects')
    data.projects.forEach((proj) => {
      lines.push(`### ${proj.name}`)
      if (proj.technologies && proj.technologies.length > 0) {
        lines.push(`*Tech Stack: ${proj.technologies.join(', ')}*\n`)
      }
      if (proj.description) lines.push(proj.description + '\n')
      ;(proj.bulletPoints || []).forEach((bp) => lines.push(`- ${bp}`))
      lines.push('')
    })
  }

  if (data.education.length > 0) {
    lines.push('## Education')
    data.education.forEach((edu) => {
      lines.push(`### ${edu.degree}`)
      lines.push(`**${edu.university}** | *${edu.startDate} – ${edu.endDate || 'Present'}*`)
      if (edu.cgpa) lines.push(`- CGPA / GPA: ${edu.cgpa}`)
      if (edu.description) lines.push(`- ${edu.description}`)
      lines.push('')
    })
  }

  return lines.join('\n')
}

// Downloads generated content as file
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Converts ParsedResume from the analyzer into ResumeBuilderData format
export function convertParsedResumeToBuilder(parsed: ParsedResume): Partial<ResumeBuilderData> {
  const names = (parsed.contact.name || '').trim().split(' ')
  const firstName = names[0] || ''
  const lastName = names.slice(1).join(' ') || ''

  return {
    personalInfo: {
      firstName,
      lastName,
      professionalTitle: '',
      email: parsed.contact.email || '',
      phone: parsed.contact.phone || '',
      location: parsed.contact.address || '',
      linkedin: parsed.contact.linkedin || '',
      github: parsed.contact.github || '',
      portfolio: parsed.contact.portfolio || '',
      profilePhoto: ''
    },
    professionalSummary: parsed.summary || '',
    education: (parsed.education || []).map((e, idx) => ({
      id: `edu-imported-${idx}`,
      degree: e.degree || '',
      university: e.institution || '',
      college: e.fieldOfStudy || '',
      location: '',
      cgpa: e.cgpaOrGpa || '',
      startDate: '',
      endDate: e.year || '',
      current: false,
      description: ''
    })),
    experience: (parsed.experience || []).map((exp, idx) => ({
      id: `exp-imported-${idx}`,
      company: exp.company || '',
      role: exp.title || '',
      location: exp.location || '',
      employmentType: 'full-time',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: !!exp.isCurrent,
      responsibilities: exp.responsibilities || (exp.description ? [exp.description] : []),
      achievements: exp.achievements || [],
      technologiesUsed: []
    })),
    projects: (parsed.projects || []).map((p, idx) => ({
      id: `proj-imported-${idx}`,
      name: p.name || '',
      description: p.description || '',
      technologies: p.technologies || [],
      duration: '',
      bulletPoints: [...(p.responsibilities || []), ...(p.achievements || [])]
    })),
    skills: [
      { category: 'Programming Languages', skills: parsed.skills?.programmingLanguages || [] },
      { category: 'Frameworks & Libraries', skills: [...(parsed.skills?.frameworks || []), ...(parsed.skills?.libraries || [])] },
      { category: 'Databases & Cloud', skills: [...(parsed.skills?.databases || []), ...(parsed.skills?.cloudPlatforms || [])] },
      { category: 'DevOps & AI Tools', skills: [...(parsed.skills?.devOpsTools || []), ...(parsed.skills?.aiMlSkills || [])] },
      { category: 'Other Skills', skills: [...(parsed.skills?.softSkills || []), ...(parsed.skills?.other || [])] }
    ].filter((cat) => cat.skills.length > 0),
    certifications: (parsed.certifications || []).map((c, idx) => ({
      id: `cert-imported-${idx}`,
      name: c,
      issuer: '',
      issueDate: ''
    })),
    achievements: (parsed.achievements || []).map((a, idx) => ({
      id: `ach-imported-${idx}`,
      title: a,
      description: ''
    })),
    languages: (parsed.languages || []).map((l, idx) => ({
      id: `lang-imported-${idx}`,
      language: l,
      proficiency: 'Professional'
    }))
  }
}

// Portfolio Import: Fetch public GitHub repos
export async function importGitHubProjects(username: string): Promise<ProjectEntry[]> {
  const cleanUser = username.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '')
  if (!cleanUser) return []

  const response = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUser)}/repos?sort=updated&per_page=6`)
  if (!response.ok) {
    throw new Error(`Could not find GitHub user "${cleanUser}". Ensure the username is public.`)
  }

  const repos = await response.json()
  if (!Array.isArray(repos)) return []

  return repos
    .filter((r: any) => !r.fork)
    .slice(0, 4)
    .map((r: any, idx: number) => ({
      id: `proj-gh-${Date.now()}-${idx}`,
      name: r.name ? r.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'GitHub Project',
      description: r.description || `Open source project developed by ${cleanUser}.`,
      technologies: r.language ? [r.language] : ['Git', 'Open Source'],
      githubUrl: r.html_url,
      liveUrl: r.homepage || '',
      duration: 'Recent',
      role: 'Creator & Maintainer',
      bulletPoints: [
        `Architected repository with ${r.stargazers_count || 0} stars and ${r.forks_count || 0} forks.`,
        `Maintained modular codebase with Git version control and continuous integration workflows.`
      ]
    }))
}
