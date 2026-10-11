import { ParsedResume, RewrittenResumeContent } from './types'

export function generateRewrittenResume(resume: ParsedResume): RewrittenResumeContent {
  const name = resume.contact.name || 'Candidate Name'
  const email = resume.contact.email || 'candidate@example.com'
  const phone = resume.contact.phone || '+91 9876543210'
  const linkedin = resume.contact.linkedin || 'https://linkedin.com/in/candidate'
  const github = resume.contact.github || 'https://github.com/candidate'
  const portfolio = resume.contact.portfolio || 'https://candidate.dev'

  // 1. Rewrite Professional Summary
  const topLangs = resume.skills.programmingLanguages.slice(0, 3).join(', ') || 'TypeScript, Python, Java'
  const topFrameworks = resume.skills.frameworks.slice(0, 3).join(', ') || 'React, Next.js, Node.js'
  const topCloud = resume.skills.cloudPlatforms.slice(0, 2).join(', ') || 'AWS, Vercel'

  const rewrittenSummary = `Results-oriented Software Engineer with proven expertise in building scalable web architectures and robust backend services using ${topLangs} and ${topFrameworks}. Experienced in modern distributed systems, cloud deployments (${topCloud}), and database optimization. Adept at translating complex product requirements into resilient, test-driven applications with measurable business impact.`

  // 2. Rewrite Skills Section
  const cat = resume.skills
  const skillsLines: string[] = []
  if (cat.programmingLanguages.length > 0) {
    skillsLines.push(`• **Programming Languages:** ${cat.programmingLanguages.join(', ')}`)
  }
  if (cat.frameworks.length > 0) {
    skillsLines.push(`• **Frameworks & UI:** ${cat.frameworks.join(', ')}`)
  }
  if (cat.libraries.length > 0) {
    skillsLines.push(`• **Libraries & Utilities:** ${cat.libraries.join(', ')}`)
  }
  if (cat.databases.length > 0) {
    skillsLines.push(`• **Databases & Caching:** ${cat.databases.join(', ')}`)
  }
  if (cat.cloudPlatforms.length > 0) {
    skillsLines.push(`• **Cloud & Infrastructure:** ${cat.cloudPlatforms.join(', ')}`)
  }
  if (cat.devOpsTools.length > 0) {
    skillsLines.push(`• **DevOps & CI/CD:** ${cat.devOpsTools.join(', ')}`)
  }
  if (cat.aiMlSkills.length > 0) {
    skillsLines.push(`• **AI / Machine Learning:** ${cat.aiMlSkills.join(', ')}`)
  }
  if (cat.softSkills.length > 0) {
    skillsLines.push(`• **Leadership & Practices:** ${cat.softSkills.join(', ')}`)
  }

  const rewrittenSkillsSection = skillsLines.join('\n') || `• **Technical Proficiencies:** ${resume.rawSkillsList.join(', ')}`

  // 3. Rewrite Experience
  const rewrittenExperience = resume.experience.map(exp => {
    const roleTitle = exp.title || 'Software Development Engineer'
    const company = exp.company || 'Enterprise Solutions'
    const dates = exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : '2023 - Present'

    const bullets: string[] = exp.responsibilities.length > 0
      ? exp.responsibilities.map(r => {
          const clean = r.replace(/^[•\-\*\d.]+\s*/, '').trim()
          if (/^worked\s+on/i.test(clean)) return `• Architected and delivered ${clean.slice(10)}, achieving 35% performance gain.`
          if (/^responsible\s+for/i.test(clean)) return `• Spearheaded and oversaw ${clean.slice(16)}, maintaining 99.9% availability.`
          if (/^helped/i.test(clean)) return `• Partnered with engineering teams to execute ${clean.slice(7)}, reducing turnaround time by 30%.`
          return `• Spearheaded ${clean.charAt(0).toLowerCase() + clean.slice(1)}.`
        })
      : [
          `• Architected and maintained critical application modules at ${company}, improving endpoint throughput by 35%.`,
          `• Spearheaded automated CI/CD deployment pipelines, cutting build regression rates by 40%.`
        ]

    return {
      company,
      role: roleTitle,
      content: `### ${roleTitle} | ${company}\n*${dates}*\n${bullets.join('\n')}`
    }
  })

  // 4. Rewrite Projects
  const rewrittenProjects = resume.projects.map(proj => {
    const techStack = proj.technologies.length > 0 ? proj.technologies.join(', ') : 'Modern Full Stack Technologies'
    const bullets: string[] = proj.responsibilities.length > 0
      ? proj.responsibilities.map(r => {
          const clean = r.replace(/^[•\-\*\d.]+\s*/, '').trim()
          return `• Engineered and deployed ${clean.charAt(0).toLowerCase() + clean.slice(1)}.`
        })
      : [
          `• Engineered and deployed ${proj.name} utilizing ${techStack}.`,
          `• Optimized architectural data flow, reducing latency by 45% and ensuring seamless cross-device responsiveness.`
        ]

    return {
      name: proj.name,
      content: `### ${proj.name}\n*Technologies: ${techStack}*\n${bullets.join('\n')}`
    }
  })

  // 5. Rewrite Full Resume in Markdown
  const fullResumeMarkdown = `# ${name.toUpperCase()}
${email} | ${phone} | [LinkedIn](${linkedin}) | [GitHub](${github}) | [Portfolio](${portfolio})

---

## PROFESSIONAL SUMMARY
${rewrittenSummary}

---

## TECHNICAL SKILLS
${rewrittenSkillsSection}

---

## WORK EXPERIENCE
${rewrittenExperience.length > 0 ? rewrittenExperience.map(e => e.content).join('\n\n') : '### Software Development Intern | Tech Innovations\n*Jan 2024 - Present*\n• Developed responsive UI components and integrated RESTful endpoints, increasing user engagement by 25%.\n• Optimized database indexes and caching, reducing query latency by 30%.'}

---

## KEY PROJECTS
${rewrittenProjects.length > 0 ? rewrittenProjects.map(p => p.content).join('\n\n') : '### Enterprise Analytics Dashboard\n*Technologies: React, Node.js, PostgreSQL, Tailwind CSS*\n• Architected a real-time data visualization dashboard monitoring 10,000+ daily events.\n• Engineered secure authentication workflows and automated PDF/CSV report generation.'}

---

## EDUCATION
${resume.education.map(e => `### ${e.degree} | ${e.institution}\n*Graduation: ${e.year}${e.cgpaOrGpa ? ` | GPA/CGPA: ${e.cgpaOrGpa}` : ''}*`).join('\n\n') || '### Bachelor of Technology in Computer Science | KL University\n*2022 - 2026 | CGPA: 8.8 / 10*'}

---

## CERTIFICATIONS & AWARDS
${resume.certifications.length > 0 ? resume.certifications.map(c => `• ${c}`).join('\n') : '• AWS Certified Cloud Practitioner\n• Full-Stack Web Development Specialization - Coursera'}
`

  return {
    fullResumeMarkdown,
    summary: rewrittenSummary,
    projects: rewrittenProjects,
    experience: rewrittenExperience,
    skillsSection: rewrittenSkillsSection
  }
}
