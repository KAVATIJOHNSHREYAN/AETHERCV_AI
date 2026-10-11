import { ParsedResume } from './types'

export interface DetailedProjectAudit {
  name: string
  techStackScore: number // 0-100
  metricScore: number // 0-100
  depthGrade: 'Advanced' | 'Intermediate' | 'Basic'
  missingMetrics: string[]
  strengths: string[]
  improvementRecommendations: string[]
}

export interface DetailedExperienceAudit {
  title: string
  company: string
  quantifiedCount: number
  actionVerbCount: number
  strengthScore: number // 0-100
  status: 'Strong Impact' | 'Solid Contribution' | 'Needs More Data'
  bulletRecommendations: string[]
}

export interface DetailedEducationAudit {
  degree: string
  institution: string
  year: string
  cgpa?: string
  isComplete: boolean
  auditRemarks: string[]
}

export function auditProjects(resume: ParsedResume): DetailedProjectAudit[] {
  return resume.projects.map(proj => {
    const techScore = Math.min(100, proj.technologies.length * 20)
    const metricCount = (proj.businessImpact ? 1 : 0) + proj.achievements.length
    const metricScore = Math.min(100, metricCount * 50)

    const strengths: string[] = []
    const recommendations: string[] = []

    if (proj.technologies.length >= 3) {
      strengths.push(`Covers modern stack (${proj.technologies.slice(0, 4).join(', ')}).`)
    } else {
      recommendations.push('Detail specific frameworks, database engines, and deployment environments.')
    }

    if (proj.businessImpact) {
      strengths.push(proj.businessImpact)
    } else {
      recommendations.push('Add quantitative benchmarks (e.g., "Reduced response latency by 40%", "Served 5,000+ active sessions").')
    }

    if (proj.description.length > 50) {
      strengths.push('Clear problem statement and scope defined.')
    } else {
      recommendations.push('Expand on the core engineering challenge solved.')
    }

    return {
      name: proj.name,
      techStackScore: techScore,
      metricScore,
      depthGrade: proj.technicalDepth,
      missingMetrics: proj.missingMetrics,
      strengths,
      improvementRecommendations: recommendations
    }
  })
}

export function auditExperience(resume: ParsedResume): DetailedExperienceAudit[] {
  return resume.experience.map(exp => {
    const quantifiedCount = exp.quantifiedMetrics.length
    const actionVerbCount = exp.actionVerbs.length
    const strengthScore = exp.strengthScore

    let status: 'Strong Impact' | 'Solid Contribution' | 'Needs More Data' = 'Needs More Data'
    if (strengthScore >= 80) status = 'Strong Impact'
    else if (strengthScore >= 55) status = 'Solid Contribution'

    const bulletRecommendations: string[] = []
    if (quantifiedCount === 0) {
      bulletRecommendations.push('Add percentage gains, revenue contribution, or team size managed to demonstrate measurable output.')
    }
    if (actionVerbCount < 3) {
      bulletRecommendations.push('Begin bullets with strong assertive verbs (e.g., Architected, Automated, Spearheaded).')
    }
    if (exp.responsibilities.length < 3) {
      bulletRecommendations.push('List 3-4 bullet points detailing distinct technical deliverables.')
    }

    return {
      title: exp.title,
      company: exp.company,
      quantifiedCount,
      actionVerbCount,
      strengthScore,
      status,
      bulletRecommendations
    }
  })
}

export function auditEducation(resume: ParsedResume): DetailedEducationAudit[] {
  return resume.education.map(edu => {
    const remarks: string[] = []
    if (!edu.cgpaOrGpa) remarks.push('Adding CGPA or graduation honors can strengthen entry-level candidate credibility.')
    if (edu.year.includes('not specified')) remarks.push('Specify expected or completed graduation year.')
    if (edu.missingDetails.length === 0) remarks.push('All key academic indicators provided.')

    return {
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year,
      cgpa: edu.cgpaOrGpa,
      isComplete: edu.isComplete,
      auditRemarks: remarks
    }
  })
}
