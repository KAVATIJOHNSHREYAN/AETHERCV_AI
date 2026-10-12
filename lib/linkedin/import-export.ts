import { LinkedInProfileData } from '@/types/linkedin'
import { ResumeBuilderData } from '@/types/resume-builder'

/**
 * Converts ResumeBuilderData into LinkedInProfileData
 */
export function convertResumeToLinkedIn(resume: ResumeBuilderData): LinkedInProfileData {
  const p = resume.personalInfo
  return {
    fullName: `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Professional',
    headline: `${p.professionalTitle || 'Software Engineer'} | Building High-Impact Solutions | ${resume.skills.flatMap((s) => s.skills).slice(0, 5).join(' • ')}`,
    location: p.location || 'San Francisco, CA',
    customUrl: p.linkedin ? p.linkedin.replace(/^https?:\/\/(www\.)?/, '') : 'linkedin.com/in/profile',
    openToWork: true,
    targetRoles: [p.professionalTitle || 'Software Engineer'],
    profilePhoto: '',
    bannerGradient: 'linear-gradient(135deg, #07101F 0%, #162440 50%, #2662EB 100%)',
    about: resume.professionalSummary || '',
    experience: (resume.experience || []).map((exp, idx) => ({
      id: exp.id || `exp-import-${idx}`,
      company: exp.company,
      role: exp.role,
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current,
      description: exp.responsibilities?.join(' ') || '',
      bulletPoints: [...(exp.responsibilities || []), ...(exp.achievements || [])],
      skillsUsed: exp.technologiesUsed || []
    })),
    education: (resume.education || []).map((edu, idx) => ({
      id: edu.id || `edu-import-${idx}`,
      school: edu.university,
      degree: edu.degree,
      fieldOfStudy: edu.college || 'Engineering',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      grade: edu.cgpa || '',
      activities: edu.description || ''
    })),
    projects: (resume.projects || []).map((proj, idx) => ({
      id: proj.id || `proj-import-${idx}`,
      title: proj.name,
      description: proj.description || '',
      problem: 'High complexity in distributed execution environment.',
      solution: proj.description || 'Architected a scalable solution.',
      technologies: proj.technologies || [],
      impact: proj.bulletPoints?.join(' ') || '',
      url: proj.githubUrl || proj.liveUrl || ''
    })),
    skills: resume.skills?.flatMap((s) => s.skills) || [],
    certifications: (resume.certifications || []).map((c, idx) => ({
      id: c.id || `cert-import-${idx}`,
      name: c.name,
      issuer: c.issuer,
      issueDate: c.issueDate,
      credentialUrl: c.credentialUrl || ''
    })),
    featured: [],
    volunteer: [],
    languages: (resume.languages || []).map((l) => `${l.language} (${l.proficiency})`),
    recommendationsCount: 2
  }
}

/**
 * Parses raw pasted LinkedIn profile text
 */
export function parsePastedLinkedInText(rawText: string): Partial<LinkedInProfileData> {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return {}

  const result: Partial<LinkedInProfileData> = {
    fullName: lines[0] || 'Professional',
    headline: lines[1] || 'Software Engineer',
    skills: [],
    targetRoles: []
  }

  // Look for About section
  const aboutIdx = lines.findIndex((l) => /^about\b/i.test(l))
  if (aboutIdx !== -1 && lines[aboutIdx + 1]) {
    result.about = lines.slice(aboutIdx + 1, aboutIdx + 6).join('\n\n')
  }

  // Look for skills keywords
  const popularKeywords = [
    'Python', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js',
    'AWS', 'Docker', 'PostgreSQL', 'SQL', 'FastAPI', 'Java', 'Git'
  ]
  const foundSkills = popularKeywords.filter((kw) =>
    new RegExp(`\\b${kw}\\b`, 'i').test(rawText)
  )
  if (foundSkills.length > 0) {
    result.skills = foundSkills
  }

  return result
}

/**
 * Exports profile to clean LinkedIn-ready plaintext
 */
export function exportToLinkedInPlainText(data: LinkedInProfileData): string {
  const parts: string[] = []

  parts.push(`=== LINKEDIN PROFILE OPTIMIZATION SPECIFICATION ===`)
  parts.push(`FULL NAME: ${data.fullName}`)
  parts.push(`HEADLINE: ${data.headline}`)
  parts.push(`LOCATION: ${data.location}`)
  parts.push(`CUSTOM URL: ${data.customUrl}`)
  parts.push(`OPEN TO WORK: ${data.openToWork ? 'YES' : 'NO'}`)
  if (data.targetRoles?.length > 0) {
    parts.push(`TARGET ROLES: ${data.targetRoles.join(', ')}`)
  }
  parts.push('')

  parts.push(`----------------------------------------`)
  parts.push(`ABOUT SECTION (Character Count: ${data.about.length} / 2,600)`)
  parts.push(`----------------------------------------`)
  parts.push(data.about)
  parts.push('')

  parts.push(`----------------------------------------`)
  parts.push(`WORK EXPERIENCE`)
  parts.push(`----------------------------------------`)
  data.experience.forEach((exp) => {
    parts.push(`${exp.role} | ${exp.company}`)
    parts.push(`${exp.startDate} – ${exp.current ? 'Present' : exp.endDate} | ${exp.location}`)
    if (exp.bulletPoints?.length > 0) {
      exp.bulletPoints.forEach((b) => parts.push(`• ${b}`))
    } else if (exp.description) {
      parts.push(exp.description)
    }
    if (exp.skillsUsed?.length > 0) {
      parts.push(`Skills: ${exp.skillsUsed.join(', ')}`)
    }
    parts.push('')
  })

  parts.push(`----------------------------------------`)
  parts.push(`FEATURED PROJECTS`)
  parts.push(`----------------------------------------`)
  data.projects.forEach((p) => {
    parts.push(`${p.title}`)
    if (p.technologies?.length > 0) {
      parts.push(`Technologies: ${p.technologies.join(', ')}`)
    }
    if (p.problem) parts.push(`Problem: ${p.problem}`)
    if (p.solution) parts.push(`Solution: ${p.solution}`)
    if (p.impact) parts.push(`Impact: ${p.impact}`)
    if (p.url) parts.push(`Link: ${p.url}`)
    parts.push('')
  })

  parts.push(`----------------------------------------`)
  parts.push(`CORE SKILLS & ENDORSEMENTS`)
  parts.push(`----------------------------------------`)
  parts.push((data.skills || []).join(' • '))
  parts.push('')

  parts.push(`----------------------------------------`)
  parts.push(`EDUCATION`)
  parts.push(`----------------------------------------`)
  data.education.forEach((edu) => {
    parts.push(`${edu.degree} in ${edu.fieldOfStudy}`)
    parts.push(`${edu.school} (${edu.startDate} – ${edu.endDate})`)
    if (edu.grade) parts.push(`Grade: ${edu.grade}`)
    parts.push('')
  })

  return parts.join('\n')
}

/**
 * Exports profile to Markdown format
 */
export function exportToMarkdown(data: LinkedInProfileData): string {
  const md: string[] = []
  md.push(`# LinkedIn Profile Optimization Plan: ${data.fullName}`)
  md.push(`> Optimized for Recruiter Discovery & SEO Search Ranking\n`)
  md.push(`## 📌 Headline\n\`\`\`\n${data.headline}\n\`\`\`\n`)
  md.push(`- **Location**: ${data.location}`)
  md.push(`- **Custom Profile URL**: [${data.customUrl}](https://${data.customUrl})`)
  md.push(`- **#OpenToWork**: ${data.openToWork ? 'Enabled (Visible to Recruiters & Network)' : 'Disabled'}`)
  if (data.targetRoles?.length) {
    md.push(`- **Target Roles**: ${data.targetRoles.join(', ')}`)
  }
  md.push(`\n---\n`)
  md.push(`## 📝 About / Summary (${data.about.length} / 2,600 characters)\n`)
  md.push(data.about)
  md.push(`\n---\n`)
  md.push(`## 💼 Experience (STAR Method)\n`)
  data.experience.forEach((exp) => {
    md.push(`### ${exp.role} — **${exp.company}**`)
    md.push(`*${exp.startDate} – ${exp.current ? 'Present' : exp.endDate} | ${exp.location}*\n`)
    if (exp.bulletPoints?.length) {
      exp.bulletPoints.forEach((b) => md.push(`- ${b}`))
    } else if (exp.description) {
      md.push(exp.description)
    }
    if (exp.skillsUsed?.length) {
      md.push(`\n**Skills Used**: ${exp.skillsUsed.join(', ')}`)
    }
    md.push('')
  })
  md.push(`---\n`)
  md.push(`## 🚀 Featured Projects\n`)
  data.projects.forEach((proj) => {
    md.push(`### ${proj.title}`)
    if (proj.technologies?.length) md.push(`**Tech**: \`${proj.technologies.join('`, `')}\``)
    if (proj.problem) md.push(`- **Problem**: ${proj.problem}`)
    if (proj.solution) md.push(`- **Solution**: ${proj.solution}`)
    if (proj.impact) md.push(`- **Impact**: ${proj.impact}`)
    if (proj.url) md.push(`- [View Project](${proj.url})`)
    md.push('')
  })
  md.push(`---\n`)
  md.push(`## 🛠️ Endorsed Skills\n`)
  md.push(data.skills.map((s) => `\`${s}\``).join(' • '))
  md.push(`\n\n---\n`)
  md.push(`## 🎓 Education\n`)
  data.education.forEach((edu) => {
    md.push(`- **${edu.degree} in ${edu.fieldOfStudy}** — ${edu.school} (${edu.startDate} – ${edu.endDate}) ${edu.grade ? `| GPA: ${edu.grade}` : ''}`)
  })
  return md.join('\n')
}

/**
 * Generates and downloads a clean, multi-section LinkedIn Profile PDF document
 */
export async function exportLinkedInToPdf(data: LinkedInProfileData): Promise<void> {
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF({
    unit: 'pt',
    format: 'a4'
  })

  const margin = 40
  let y = 50
  const pageWidth = doc.internal.pageSize.getWidth()
  const contentWidth = pageWidth - margin * 2

  // Header banner bar
  doc.setFillColor(7, 16, 31)
  doc.rect(0, 0, pageWidth, 40, 'F')
  doc.setTextColor(56, 189, 248)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('AETHERCV AI — LINKEDIN PROFILE OPTIMIZATION SPECIFICATION', margin, 25)

  // Name & Headline
  doc.setTextColor(15, 23, 42)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.text(data.fullName || 'Candidate Profile', margin, y)
  y += 20

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(38, 98, 235)
  const headlineLines = doc.splitTextToSize(data.headline, contentWidth)
  doc.text(headlineLines, margin, y)
  y += headlineLines.length * 14 + 10

  // Contact / Badges
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text(`Location: ${data.location}   |   URL: ${data.customUrl}   |   Open to Work: ${data.openToWork ? 'YES' : 'NO'}`, margin, y)
  y += 18

  // Divider
  doc.setDrawColor(226, 232, 240)
  doc.line(margin, y, pageWidth - margin, y)
  y += 18

  // Section helper
  const addSectionTitle = (title: string) => {
    if (y > 760) {
      doc.addPage()
      y = 50
    }
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text(title, margin, y)
    y += 14
  }

  // About Section
  addSectionTitle('ABOUT SECTION')
  doc.setFontSize(9.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(51, 65, 85)
  const aboutLines = doc.splitTextToSize(data.about, contentWidth)
  doc.text(aboutLines, margin, y)
  y += aboutLines.length * 13 + 18

  // Experience Section
  addSectionTitle('EXPERIENCE (STAR METHOD REWRITTEN)')
  data.experience.forEach((exp) => {
    if (y > 740) {
      doc.addPage()
      y = 50
    }
    doc.setFontSize(10.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text(`${exp.role} — ${exp.company}`, margin, y)
    y += 12

    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 116, 139)
    doc.text(`${exp.startDate} – ${exp.current ? 'Present' : exp.endDate} | ${exp.location}`, margin, y)
    y += 12

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(51, 65, 85)
    if (exp.bulletPoints?.length) {
      exp.bulletPoints.forEach((bp) => {
        const bpLines = doc.splitTextToSize(`• ${bp}`, contentWidth - 10)
        if (y + bpLines.length * 12 > 770) {
          doc.addPage()
          y = 50
        }
        doc.text(bpLines, margin + 8, y)
        y += bpLines.length * 12 + 2
      })
    }
    y += 8
  })

  // Skills
  addSectionTitle('RECRUITER-RANKED SKILLS')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(30, 41, 59)
  const skillsText = (data.skills || []).join('   •   ')
  const skillLines = doc.splitTextToSize(skillsText, contentWidth)
  doc.text(skillLines, margin, y)
  y += skillLines.length * 13 + 18

  // Projects
  addSectionTitle('FEATURED PROJECTS')
  data.projects.forEach((proj) => {
    if (y > 740) {
      doc.addPage()
      y = 50
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text(proj.title, margin, y)
    y += 12

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(71, 85, 105)
    if (proj.technologies?.length) {
      doc.text(`Tech: ${proj.technologies.join(', ')}`, margin, y)
      y += 12
    }
    if (proj.impact) {
      const pImpact = doc.splitTextToSize(`Impact: ${proj.impact}`, contentWidth)
      doc.text(pImpact, margin, y)
      y += pImpact.length * 12 + 4
    }
    y += 6
  })

  const filename = `${(data.fullName || 'Candidate').replace(/\s+/g, '_')}_LinkedIn_Optimization.pdf`
  doc.save(filename)
}

/**
 * Triggers file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
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
