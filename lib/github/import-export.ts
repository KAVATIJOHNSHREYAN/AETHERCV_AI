import { GitHubProfileData } from '@/types/github'
import { ResumeBuilderData } from '@/types/resume-builder'
import { generateProfileReadme } from './readme-generator'

/**
 * Converts ResumeBuilderData into GitHubProfileData
 */
export function convertResumeToGitHub(resume: ResumeBuilderData): GitHubProfileData {
  const p = resume.personalInfo
  const fullName = `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Developer'
  const targetRole = p.professionalTitle || 'Software Engineer'

  // Extract GitHub username if available
  let username = 'developer'
  if (p.github) {
    const match = p.github.match(/github\.com\/([a-zA-Z0-9_-]+)/)
    if (match && match[1]) {
      username = match[1]
    } else {
      username = p.github.replace(/^https?:\/\/(www\.)?github\.com\/?/, '').trim() || 'developer'
    }
  }

  // Group skills
  const allSkills = (resume.skills || []).flatMap((s) => s.skills)
  const languages = allSkills.filter((s) =>
    /python|javascript|typescript|java|c\+\+|golang|go|rust|c#|sql|ruby|php|kotlin|swift/i.test(s)
  )
  const frameworks = allSkills.filter((s) =>
    /react|next|node|fastapi|django|express|vue|angular|spring|flask|tailwind/i.test(s)
  )
  const databases = allSkills.filter((s) =>
    /postgres|mysql|redis|mongo|sqlite|cassandra|oracle|dynamodb/i.test(s)
  )
  const cloudDevOps = allSkills.filter((s) =>
    /aws|docker|kubernetes|terraform|gcp|azure|ci\/cd|git|linux|helm/i.test(s)
  )
  const aiMl = allSkills.filter((s) =>
    /pytorch|tensorflow|langchain|rag|llm|hugging|openai|vector|machine learning|deep learning/i.test(s)
  )

  // Map projects to repositories
  const repositories = (resume.projects || []).map((proj, idx) => ({
    id: proj.id || `repo-imp-${idx}`,
    name: proj.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
    description: proj.description || proj.bulletPoints?.[0] || 'High-impact software engineering project.',
    language: proj.technologies?.[0] || 'TypeScript',
    stars: Math.floor(Math.random() * 40) + 10,
    forks: Math.floor(Math.random() * 10) + 2,
    topics: (proj.technologies || []).map((t) => t.toLowerCase().replace(/[^a-z0-9_-]/g, '-')),
    isPinned: idx < 4,
    hasReadme: true,
    hasLicense: true,
    hasLiveDemo: Boolean(proj.liveUrl),
    demoUrl: proj.liveUrl || '',
    githubUrl: proj.githubUrl || `https://github.com/${username}/${proj.name.toLowerCase().replace(/[^a-z0-9_-]/g, '-')}`,
    license: 'MIT',
    healthScore: 88,
    recommendations: ['Add system architecture diagrams', 'Include sample API payloads']
  }))

  const result: GitHubProfileData = {
    username,
    name: fullName,
    avatarUrl: '',
    bio: resume.professionalSummary?.slice(0, 160) || `${targetRole} building high-impact software applications.`,
    company: resume.experience?.[0]?.company ? `@${resume.experience[0].company}` : '',
    location: p.location || 'Remote',
    website: p.portfolio || `https://${username}.dev`,
    twitterUsername: '',
    targetRole,
    yearsOfExperience: resume.experience?.length ? `${resume.experience.length * 2}+ Years` : '1+ Years',
    readmeStyle: 'neon-developer',
    readmeContent: '',
    socialLinks: {
      linkedin: p.linkedin || '',
      website: p.portfolio || '',
      email: p.email || ''
    },
    techStack: {
      languages: languages.length > 0 ? languages : ['TypeScript', 'Python', 'SQL'],
      frameworks: frameworks.length > 0 ? frameworks : ['React', 'Next.js', 'Node.js'],
      databases: databases.length > 0 ? databases : ['PostgreSQL', 'Redis'],
      cloudDevOps: cloudDevOps.length > 0 ? cloudDevOps : ['AWS', 'Docker', 'Git'],
      aiMl: aiMl.length > 0 ? aiMl : ['PyTorch', 'Vector Search'],
      tools: ['Git', 'Linux', 'VS Code']
    },
    repositories: repositories.length > 0 ? repositories : [],
    achievements: ['Pull Shark', 'Arctic Code Vault Contributor'],
    contributionsLastYear: 450,
    streakDays: 24,
    openToWork: true
  }

  // Generate initial README
  result.readmeContent = generateProfileReadme(result, 'neon-developer')
  return result
}

/**
 * Parses pasted raw text from a GitHub profile or bio
 */
export function parsePastedGitHubText(text: string): Partial<GitHubProfileData> {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return {}

  const result: Partial<GitHubProfileData> = {
    name: lines[0] || 'Developer',
    bio: lines.slice(1, 4).join(' '),
    targetRole: 'Software Engineer'
  }

  // Extract GitHub username if URL found
  const urlMatch = text.match(/github\.com\/([a-zA-Z0-9_-]+)/i)
  if (urlMatch && urlMatch[1]) {
    result.username = urlMatch[1]
  }

  // Extract email
  const emailMatch = text.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/)
  if (emailMatch && emailMatch[1]) {
    result.socialLinks = { email: emailMatch[1] }
  }

  return result
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
