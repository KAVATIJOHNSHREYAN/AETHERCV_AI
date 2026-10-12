import {
  GitHubProfileData,
  GitHubScoreReport,
  GitHubRepoItem
} from '@/types/github'
import { DEFAULT_GITHUB_PROFILE } from './default-data'

/**
 * Calculates a comprehensive 100-point GitHub audit report with category scores,
 * portfolio readiness, and AI-driven repository recommendations.
 */
export function calculateGitHubScore(input?: GitHubProfileData): GitHubScoreReport {
  const data = input || DEFAULT_GITHUB_PROFILE
  const repos = data.repositories || []
  const pinnedRepos = repos.filter((r) => r.isPinned)
  const readme = data.readmeContent || ''

  // 1. Profile Category (0 - 10)
  let profileScore = 0
  const profileTips: string[] = []
  if (data.bio && data.bio.length >= 40) profileScore += 3
  else if (data.bio) {
    profileScore += 1.5
    profileTips.push('Expand your bio to 60-120 characters highlighting your specialization.')
  } else {
    profileTips.push('Add an impactful developer bio with your focus areas and emojis.')
  }

  if (data.location) profileScore += 2
  else profileTips.push('Add your primary location/timezone for recruiter filtering.')

  if (data.website) profileScore += 2.5
  else profileTips.push('Link your live personal developer portfolio website.')

  if (data.socialLinks?.linkedin || data.socialLinks?.twitter) profileScore += 2.5
  else profileTips.push('Add your LinkedIn or Twitter profile to enable recruiter outreach.')

  // 2. README Category (0 - 15)
  let readmeScore = 0
  const readmeTips: string[] = []
  if (readme.length >= 500) readmeScore += 6
  else if (readme.length > 100) {
    readmeScore += 3
    readmeTips.push('Your profile README is brief. Expand with projects, skills, and stats.')
  } else {
    readmeTips.push('Create a rich profile README (username/username repo) to showcase your brand.')
  }

  if (/img\.shields\.io|badge/i.test(readme)) readmeScore += 3
  else readmeTips.push('Incorporate Shields.io tech badges for visual impact.')

  if (/github-readme-stats|streak/i.test(readme)) readmeScore += 3
  else readmeTips.push('Add animated GitHub Stats & Streak cards.')

  if (/portfolio|demo|live/i.test(readme)) readmeScore += 3
  else readmeTips.push('Include direct links to live running applications.')

  // 3. Repositories Category (0 - 15)
  let repoScore = 0
  const repoTips: string[] = []
  if (pinnedRepos.length >= 4) repoScore += 6
  else if (pinnedRepos.length >= 1) {
    repoScore += 3
    repoTips.push('Pin 4 to 6 of your best repositories to curate your showcase.')
  } else {
    repoTips.push('Pin your top 4-6 flagship projects to GitHub.')
  }

  const allHaveDesc = repos.every((r) => r.description && r.description.length >= 20)
  if (allHaveDesc && repos.length > 0) repoScore += 4
  else repoTips.push('Ensure every repository has a descriptive one-sentence summary.')

  const hasTopics = repos.some((r) => r.topics && r.topics.length >= 3)
  if (hasTopics) repoScore += 5
  else repoTips.push('Add 3-5 GitHub repository topics (e.g. #react, #distributed-systems) for SEO.')

  // 4. Projects Category (0 - 15)
  let projScore = 0
  const projTips: string[] = []
  const liveDemoCount = repos.filter((r) => r.hasLiveDemo || Boolean(r.demoUrl)).length
  if (liveDemoCount >= 2) projScore += 7
  else if (liveDemoCount === 1) {
    projScore += 4
    projTips.push('Deploy a live preview for at least one more pinned project.')
  } else {
    projTips.push('Deploy free live web demos on Vercel, Railway, or Hugging Face.')
  }

  const hasComplexRepos = repos.some(
    (r) => /engine|system|distributed|ai|rag|cloud|queue|microservice/i.test(r.name + ' ' + r.description)
  )
  if (hasComplexRepos) projScore += 8
  else projTips.push('Showcase architectural depth (e.g. distributed queues, RAG engines, caching).')

  // 5. Documentation Category (0 - 10)
  let docScore = 0
  const docTips: string[] = []
  const reposWithReadme = repos.filter((r) => r.hasReadme).length
  if (repos.length > 0 && reposWithReadme === repos.length) docScore += 5
  else docTips.push('Ensure 100% of your public repositories have a comprehensive README.')

  const reposWithLicense = repos.filter((r) => r.hasLicense).length
  if (repos.length > 0 && reposWithLicense >= repos.length * 0.8) docScore += 5
  else docTips.push('Add open-source licenses (MIT or Apache-2.0) to your codebases.')

  // 6. Commit Quality & Activity (0 - 10)
  let commitScore = 0
  const commitTips: string[] = []
  if ((data.contributionsLastYear || 0) >= 500) commitScore += 5
  else if ((data.contributionsLastYear || 0) >= 200) commitScore += 3
  else commitTips.push('Aim for regular weekly commits to establish green contribution streaks.')

  if ((data.streakDays || 0) >= 30) commitScore += 5
  else if ((data.streakDays || 0) >= 10) commitScore += 3
  else commitTips.push('Maintain consistent commit momentum across your primary projects.')

  // 7. Portfolio Readiness (0 - 10)
  let portScore = 0
  const portTips: string[] = []
  if (data.website) portScore += 5
  else portTips.push('Create a dedicated portfolio page displaying case studies.')

  const techCount = Object.values(data.techStack || {}).flat().length
  if (techCount >= 15) portScore += 5
  else portTips.push('Expand and tag your full modern stack across cloud, backend, and frontend.')

  // 8. Recruiter Appeal (0 - 10)
  let recruitScore = 0
  const recruitTips: string[] = []
  if (data.openToWork) recruitScore += 4
  else recruitTips.push('Explicitly state "Open to Work / Actively Interviewing" in your README.')

  if (data.targetRole) recruitScore += 3
  else recruitTips.push('Clarify your target job role in your GitHub bio and headers.')

  if (data.socialLinks?.email) recruitScore += 3
  else recruitTips.push('Provide a public contact email address in your profile.')

  // 9. Open Source Readiness (0 - 5)
  let ossScore = 0
  const ossTips: string[] = []
  if ((data.achievements || []).some((a) => /shark|vault|star/i.test(a))) ossScore += 3
  else ossTips.push('Contribute pull requests to open source repositories to earn GitHub badges.')

  if (repos.some((r) => r.forks > 5 || r.stars > 10)) ossScore += 2
  else ossTips.push('Promote your top developer tools to attract GitHub stars and forks.')

  // Compute Overall Score (0 - 100)
  const total =
    profileScore +
    readmeScore +
    repoScore +
    projScore +
    docScore +
    commitScore +
    portScore +
    recruitScore +
    ossScore

  const overall = Math.min(100, Math.max(10, Math.round(total)))

  let tier: GitHubScoreReport['tier'] = 'Needs Polish'
  if (overall >= 90) tier = 'Top 1% Elite'
  else if (overall >= 75) tier = 'Senior Ready'
  else if (overall >= 55) tier = 'Intermediate'

  // Readiness Scores
  const readiness = {
    portfolioScore: Math.min(100, Math.round((portScore / 10) * 100)),
    recruiterAppeal: Math.min(100, Math.round((recruitScore / 10) * 100)),
    internshipReadiness: Math.min(100, Math.round(overall * 0.95 + 5)),
    placementReadiness: Math.min(100, Math.round(overall * 0.9 + (liveDemoCount > 0 ? 10 : 0))),
    faangReadiness: Math.min(100, Math.round(overall * 0.85 + (pinnedRepos.length >= 4 ? 12 : 0)))
  }

  // Missing trending skills based on target role
  const allCurrentTech = Object.values(data.techStack || {}).flat().map((t) => t.toLowerCase())
  const trendingHighDemand = [
    'Docker',
    'Kubernetes',
    'PostgreSQL',
    'Redis',
    'FastAPI',
    'Next.js',
    'TypeScript',
    'AWS',
    'PyTorch',
    'LangChain',
    'Terraform',
    'Kafka'
  ]
  const missingTrending = trendingHighDemand.filter((t) => !allCurrentTech.includes(t.toLowerCase()))

  // Suggested high-impact projects for developers
  const suggestedProjects = [
    {
      title: 'Distributed Asynchronous Task Scheduler',
      description: 'Build a fault-tolerant message queue with worker pooling, Redis streams, and retry dead-letter queues.',
      technologies: ['Python', 'Redis', 'Docker', 'FastAPI'],
      difficulty: 'Advanced' as const,
      recruiterValue: 'Demonstrates distributed systems architecture and asynchronous throughput mastery.'
    },
    {
      title: 'Full-Stack Observability & Telemetry Platform',
      description: 'Stream server metrics (CPU, RAM, latency) using WebSockets and render a low-latency dashboard.',
      technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'WebSockets'],
      difficulty: 'Intermediate' as const,
      recruiterValue: 'Proves real-time full-stack engineering and data visualization capabilities.'
    },
    {
      title: 'Autonomous Retrieval-Augmented Generation (RAG) Agent',
      description: 'Multi-document knowledge search with hybrid vector embeddings, semantic reranking, and citation synthesis.',
      technologies: ['Python', 'Qdrant / Pinecone', 'LangChain', 'OpenAI'],
      difficulty: 'Enterprise' as const,
      recruiterValue: 'Signals current Generative AI and vector database expertise to modern engineering teams.'
    }
  ]

  // Consolidated AI improvements
  const aiImprovements = [
    ...profileTips,
    ...readmeTips,
    ...repoTips,
    ...projTips,
    ...docTips,
    ...commitTips
  ].slice(0, 8)

  return {
    overallScore: overall,
    tier,
    readiness,
    categories: {
      profile: { name: 'Profile Essentials', score: Math.round(profileScore), maxScore: 10, weight: 10, tips: profileTips },
      readme: { name: 'Profile README', score: Math.round(readmeScore), maxScore: 15, weight: 15, tips: readmeTips },
      repositories: { name: 'Repository Curation', score: Math.round(repoScore), maxScore: 15, weight: 15, tips: repoTips },
      projects: { name: 'Production Projects', score: Math.round(projScore), maxScore: 15, weight: 15, tips: projTips },
      documentation: { name: 'Documentation & Licenses', score: Math.round(docScore), maxScore: 10, weight: 10, tips: docTips },
      commitQuality: { name: 'Commit Activity & Streaks', score: Math.round(commitScore), maxScore: 10, weight: 10, tips: commitTips },
      portfolio: { name: 'Portfolio Readiness', score: Math.round(portScore), maxScore: 10, weight: 10, tips: portTips },
      recruiterAppeal: { name: 'Recruiter Appeal', score: Math.round(recruitScore), maxScore: 10, weight: 10, tips: recruitTips },
      openSource: { name: 'Open Source Engagement', score: Math.round(ossScore), maxScore: 5, weight: 5, tips: ossTips }
    },
    missingTrendingSkills: missingTrending,
    suggestedProjects,
    aiImprovements
  }
}

/**
 * Optimizes a specific project/repository with architectural recommendations
 */
export function optimizeRepository(repo: GitHubRepoItem): GitHubRepoItem {
  const recommendations: string[] = []

  if (!repo.hasReadme) {
    recommendations.push('Create a comprehensive README with setup instructions and architecture diagrams.')
  }
  if (!repo.hasLicense) {
    recommendations.push('Add an open-source MIT or Apache-2.0 license.')
  }
  if (!repo.hasLiveDemo && !repo.demoUrl) {
    recommendations.push('Deploy a live preview on Vercel, Netlify, or AWS and link it in the header.')
  }
  if ((repo.topics || []).length < 3) {
    recommendations.push('Add 4-6 specific GitHub topics (e.g. #microservices, #typescript) to boost search discovery.')
  }
  if (repo.description.length < 30) {
    recommendations.push('Expand description with problem solved, tech used, and measurable results.')
  }

  let score = 50
  if (repo.hasReadme) score += 20
  if (repo.hasLicense) score += 10
  if (repo.hasLiveDemo || repo.demoUrl) score += 10
  if ((repo.topics || []).length >= 3) score += 10

  return {
    ...repo,
    healthScore: Math.min(100, score),
    recommendations
  }
}
