import { ResumeBuilderData } from '@/types/resume-builder'

/**
 * Intelligently compresses and optimizes resume content so it fits strictly on ONE A4 page.
 * Enforces ATS standards: single-column, compact margins, concise high-impact metric bullets.
 */
export function optimizeToOnePage(data: ResumeBuilderData): ResumeBuilderData {
  const cloned: ResumeBuilderData = JSON.parse(JSON.stringify(data))

  // 1. Optimize Professional Summary:
  // Shorten to 2-3 impactful lines (maximum 35-45 words) focusing on title, core stack, and metrics
  if (cloned.professionalSummary) {
    const sentences = cloned.professionalSummary.split(/(?<=[.!?])\s+/).filter(Boolean)
    if (sentences.length > 2) {
      cloned.professionalSummary = sentences.slice(0, 2).join(' ')
    }
    const words = cloned.professionalSummary.split(/\s+/)
    if (words.length > 45) {
      cloned.professionalSummary = words.slice(0, 42).join(' ') + '.'
    }
  }

  // 2. Compress Experience Bullets:
  // Keep maximum 2-3 top bullets per experience entry; shorten overly verbose bullets
  cloned.experience = cloned.experience.slice(0, 3).map((exp) => {
    const combined = [...(exp.responsibilities || []), ...(exp.achievements || [])]
    // Filter and pick highest impact bullets (preferring those with metrics %, numbers, action verbs)
    const sorted = combined.sort((a, b) => {
      const aMetric = /\b\d+(\.\d+)?%|\b\d+\b/.test(a) ? 1 : 0
      const bMetric = /\b\d+(\.\d+)?%|\b\d+\b/.test(b) ? 1 : 0
      return bMetric - aMetric
    })
    const selected = sorted.slice(0, 2).map((b) => {
      // Trim verbose lead-in phrases
      return b
        .replace(/^(responsible for|tasked with handling|worked actively on)\s*/i, 'Engineered ')
        .replace(/\s+/g, ' ')
        .trim()
    })
    return {
      ...exp,
      responsibilities: selected,
      achievements: []
    }
  })

  // 3. Compress Projects:
  // Limit to top 2 projects, maximum 2 bullets each
  cloned.projects = cloned.projects.slice(0, 2).map((p) => {
    const trimmedBullets = (p.bulletPoints || []).slice(0, 2).map((b) => b.replace(/\s+/g, ' ').trim())
    return {
      ...p,
      description: p.description ? p.description.slice(0, 110).trim() + (p.description.length > 110 ? '...' : '') : '',
      bulletPoints: trimmedBullets
    }
  })

  // 4. Compress Education:
  // Keep top 1-2 degrees, omit long descriptive coursework paragraphs
  cloned.education = cloned.education.slice(0, 2).map((edu) => ({
    ...edu,
    description: edu.description ? edu.description.slice(0, 80) : ''
  }))

  // 5. Consolidate Skills:
  // Keep top 4 categories with at most 6 skills each
  cloned.skills = cloned.skills.slice(0, 4).map((cat) => ({
    ...cat,
    skills: cat.skills.slice(0, 6)
  }))

  // 6. Limit Certifications & Achievements to top 1-2
  cloned.certifications = cloned.certifications.slice(0, 2)
  cloned.achievements = cloned.achievements.slice(0, 2).map((a) => ({
    ...a,
    description: a.description ? a.description.slice(0, 100) : ''
  }))

  // 7. Enforce Optimal Single-Page ATS Customization Settings:
  cloned.customization = {
    ...cloned.customization,
    fontSize: 'sm',
    lineHeight: 'tight',
    margins: 'compact',
    showIcons: false,
    showPhoto: false
  }

  return cloned
}
