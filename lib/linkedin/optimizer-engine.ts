import {
  LinkedInProfileData,
  LinkedInScoreReport,
  HeadlineStyle,
  AboutStyle,
  TargetRole
} from '@/types/linkedin'
import { defaultLinkedInData } from '@/lib/linkedin/default-data'

// Role keyword dictionary for Recruiter Search SEO
const ROLE_SEO_KEYWORDS: Record<TargetRole, string[]> = {
  'software-engineer': [
    'Python', 'TypeScript', 'Java', 'Data Structures', 'Algorithms', 'Distributed Systems',
    'Microservices', 'REST APIs', 'AWS', 'Docker', 'PostgreSQL', 'CI/CD', 'Git'
  ],
  'ai-engineer': [
    'Python', 'PyTorch', 'TensorFlow', 'LLMs', 'Prompt Engineering', 'LangChain',
    'Machine Learning', 'Deep Learning', 'Hugging Face', 'Vector DB', 'NLP', 'RAG'
  ],
  'full-stack': [
    'React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL',
    'GraphQL', 'REST APIs', 'Docker', 'MongoDB', 'AWS', 'Redux', 'System Architecture'
  ],
  'data-scientist': [
    'Python', 'SQL', 'R', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-Learn',
    'Data Modeling', 'Tableau', 'Power BI', 'Statistics', 'A/B Testing', 'BigQuery'
  ],
  'cloud-engineer': [
    'AWS', 'Azure', 'GCP', 'Kubernetes', 'Docker', 'Terraform', 'Infrastructure as Code',
    'CI/CD', 'Linux', 'Ansible', 'Cloud Security', 'Networking', 'Monitoring'
  ],
  'product-manager': [
    'Product Strategy', 'Roadmapping', 'Agile / Scrum', 'User Stories', 'A/B Testing',
    'Data Analytics', 'Cross-Functional Leadership', 'KPIs', 'Market Research', 'Jira'
  ],
  'devops-engineer': [
    'Kubernetes', 'Docker', 'Terraform', 'CI/CD Pipelines', 'GitHub Actions', 'Jenkins',
    'AWS', 'Linux', 'Prometheus', 'Grafana', 'GitOps', 'Helm', 'Bash Scripting'
  ],
  'cyber-security': [
    'Network Security', 'Penetration Testing', 'SIEM', 'SOC', 'Incident Response',
    'Vulnerability Assessment', 'Cryptography', 'OWASP', 'Firewalls', 'Compliance'
  ],
  'frontend-developer': [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS',
    'Redux', 'Web Performance', 'UI/UX', 'Accessibility (a11y)', 'Responsive Design'
  ],
  'backend-developer': [
    'Node.js', 'Python', 'Java', 'Go', 'PostgreSQL', 'Redis', 'Microservices',
    'REST APIs', 'GraphQL', 'Docker', 'System Design', 'Message Queues', 'Kafka'
  ]
}

export function calculateLinkedInScore(
  inputData?: LinkedInProfileData,
  targetRole?: TargetRole
): LinkedInScoreReport {
  const data = inputData || defaultLinkedInData
  // 1. Headline Score (0 - 10)
  const headlineLen = (data.headline || '').trim().length
  let headlineScore = 0
  const headlineTips: string[] = []
  if (headlineLen >= 60 && headlineLen <= 220) headlineScore += 5
  else if (headlineLen > 0) {
    headlineScore += 2
    headlineTips.push('Expand headline to 80-200 characters with skills and value proposition.')
  } else {
    headlineTips.push('Add a compelling headline containing your target role and core skills.')
  }

  if (/[|•/–-]/.test(data.headline)) headlineScore += 2
  else headlineTips.push('Use separator symbols (| or •) to organize your role, skills, and impact.')

  if (/\b(software|engineer|developer|architect|designer|lead|manager|analyst|specialist)\b/i.test(data.headline)) {
    headlineScore += 3
  } else {
    headlineTips.push('Include your primary job title (e.g. Software Engineer, AI Engineer) in the headline.')
  }

  // 2. About Score (0 - 10)
  const aboutLen = (data.about || '').trim().length
  let aboutScore = 0
  const aboutTips: string[] = []
  if (aboutLen >= 400 && aboutLen <= 2600) aboutScore += 5
  else if (aboutLen > 100) {
    aboutScore += 2
    aboutTips.push('Your About section is short. Aim for 400+ characters with your career story and achievements.')
  } else {
    aboutTips.push('Write a detailed About summary (up to 2,600 characters) to boost recruiter engagement.')
  }

  if (/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(let['’]?s connect)/i.test(data.about)) {
    aboutScore += 3
  } else {
    aboutTips.push('Include a clear call-to-action or email address in your About section so recruiters can reach you.')
  }

  if (/\b\d+%|\b\d+x|\b\d+\s*(users|clients|requests|projects|k|m)\b/i.test(data.about)) {
    aboutScore += 2
  } else {
    aboutTips.push('Add quantifiable achievements (e.g. "improved latency by 30%") to your About summary.')
  }

  // 3. Experience Score (0 - 10)
  let expScore = 0
  const expTips: string[] = []
  const exps = data.experience || []
  if (exps.length >= 2) expScore += 4
  else if (exps.length === 1) {
    expScore += 2
    expTips.push('Add past internships, student projects, or freelance roles to strengthen experience depth.')
  } else {
    expTips.push('Add at least 1-2 work experience or internship entries.')
  }

  const allBullets = exps.flatMap((e) => e.bulletPoints || [])
  const hasMetrics = allBullets.some((b) => /\b\d+%|\b\d+\b/i.test(b))
  if (hasMetrics) expScore += 3
  else expTips.push('Quantify role achievements using metrics (e.g. 40% speedup, 250k requests).')

  const hasTaggedSkills = exps.some((e) => e.skillsUsed && e.skillsUsed.length > 0)
  if (hasTaggedSkills) expScore += 3
  else expTips.push('Tag skills used under each work experience entry for LinkedIn algorithm weighting.')

  // 4. Projects Score (0 - 10)
  let projScore = 0
  const projTips: string[] = []
  const projs = data.projects || []
  if (projs.length >= 2) projScore += 5
  else if (projs.length === 1) {
    projScore += 3
    projTips.push('Add a second key project to showcase versatility.')
  } else {
    projTips.push('Add 2+ featured projects with Problem, Solution, and Technology breakdown.')
  }

  if (projs.some((p) => p.problem && p.solution)) projScore += 3
  else projTips.push('Structure project descriptions into Problem, Solution, and Technology impact.')

  if (projs.some((p) => p.url)) projScore += 2
  else projTips.push('Include GitHub or live URLs for your top projects.')

  // 5. Skills Score (0 - 10)
  let skillsScore = 0
  const skillsTips: string[] = []
  const skillsCount = (data.skills || []).length
  if (skillsCount >= 10) skillsScore = 10
  else if (skillsCount >= 5) {
    skillsScore = 7
    skillsTips.push('Add at least 10-15 skills to achieve LinkedIn "All-Star" ranking.')
  } else {
    skillsScore = 3
    skillsTips.push('LinkedIn profiles with 5+ skills receive up to 17x more profile views.')
  }

  // 6. Recruiter Search SEO (0 - 10)
  const combinedText = `${data.headline} ${data.about} ${allBullets.join(' ')} ${(data.skills || []).join(' ')}`.toLowerCase()
  const detectedRole: TargetRole = targetRole || 'software-engineer'
  const targetKeywords = ROLE_SEO_KEYWORDS[detectedRole] || ROLE_SEO_KEYWORDS['software-engineer']
  const matchedKeywords = targetKeywords.filter((kw) => combinedText.includes(kw.toLowerCase()))
  const missingKeywords = targetKeywords.filter((kw) => !combinedText.includes(kw.toLowerCase()))
  const seoScore = Math.min(10, Math.round((matchedKeywords.length / targetKeywords.length) * 10) + 1)

  // 7. Recruiter Appeal (0 - 10)
  let appealScore = 0
  const appealTips: string[] = []
  if (data.openToWork) appealScore += 4
  else appealTips.push('Enable "Open to Work" status to alert recruiters actively hiring for your target roles.')

  if (data.targetRoles && data.targetRoles.length > 0) appealScore += 3
  else appealTips.push('Specify 2-3 target job titles (e.g. Software Engineer, Full Stack) in your preferences.')

  if (data.location) appealScore += 3
  else appealTips.push('Set your primary metro location so local and hybrid recruiters can discover you.')

  // 8. Completeness Score (0 - 10)
  let compScore = 0
  if (data.fullName) compScore += 1
  if (data.headline) compScore += 1.5
  if (data.location) compScore += 1
  if (data.about) compScore += 1.5
  if (exps.length > 0) compScore += 1.5
  if ((data.education || []).length > 0) compScore += 1.5
  if (skillsCount >= 5) compScore += 1
  if ((data.certifications || []).length > 0) compScore += 1
  const completenessFinal = Math.min(10, Math.round(compScore))

  // 9. Networking Strength (0 - 10)
  let netScore = 0
  const netTips: string[] = []
  if ((data.recommendationsCount || 0) >= 2) netScore += 4
  else if ((data.recommendationsCount || 0) >= 1) netScore += 2
  else netTips.push('Request 1-2 LinkedIn recommendations from former managers, professors, or peers.')

  if ((data.featured || []).length > 0) netScore += 3
  else netTips.push('Pin an article, GitHub repository, or achievement post in your Featured section.')

  if ((data.languages || []).length >= 1) netScore += 3
  else netTips.push('List the languages you speak to expand global recruiter reach.')

  // 10. Personal Branding (0 - 10)
  let brandScore = 0
  const brandTips: string[] = []
  if (data.customUrl && !/-\d{8,}/.test(data.customUrl)) brandScore += 4
  else brandTips.push('Claim a custom clean LinkedIn URL (e.g. linkedin.com/in/yourname) without trailing numbers.')

  if (data.bannerGradient || data.profilePhoto) brandScore += 3
  else brandTips.push('Upload a branded header banner to make your profile stand out visually.')

  if (data.targetRoles && data.targetRoles.length > 0 && headlineLen > 40) brandScore += 3

  // Profile Checklist items
  const checklist: LinkedInScoreReport['checklist'] = [
    {
      id: 'photo',
      label: 'Professional Profile Photo',
      completed: !!data.profilePhoto || true, // Placeholder / detected
      weight: 10,
      tip: 'High-resolution headshot with natural lighting and smiling expression.'
    },
    {
      id: 'banner',
      label: 'Branded Header Banner',
      completed: !!data.bannerGradient,
      weight: 10,
      tip: 'Custom banner displaying your engineering focus or technology stack.'
    },
    {
      id: 'headline',
      label: 'Recruiter-Optimized Headline',
      completed: headlineScore >= 8,
      weight: 15,
      tip: 'Clear job title + core skills + unique value proposition.'
    },
    {
      id: 'custom_url',
      label: 'Custom Clean LinkedIn URL',
      completed: !!data.customUrl && !/-\d{8,}/.test(data.customUrl),
      weight: 5,
      tip: 'Remove random trailing digits from your public profile link.'
    },
    {
      id: 'about',
      label: 'Engaging About Summary',
      completed: aboutScore >= 7,
      weight: 15,
      tip: 'Tell your career story, highlight accomplishments, and share direct contact info.'
    },
    {
      id: 'experience',
      label: 'Work Experience with Metrics',
      completed: expScore >= 7,
      weight: 15,
      tip: 'STAR-formatted bullets with measurable impact and tagged technologies.'
    },
    {
      id: 'education',
      label: 'Academic Degrees & Honors',
      completed: (data.education || []).length > 0,
      weight: 10,
      tip: 'Degree, university, GPA, and relevant coursework or student societies.'
    },
    {
      id: 'skills',
      label: '10+ Endorsable Skills',
      completed: skillsCount >= 10,
      weight: 10,
      tip: 'Add minimum 10 core languages, frameworks, and developer tools.'
    },
    {
      id: 'featured',
      label: 'Featured Portfolio Items',
      completed: (data.featured || []).length > 0,
      weight: 5,
      tip: 'Link your GitHub repo, tech articles, or project demos.'
    },
    {
      id: 'open_to_work',
      label: 'Open to Work Status Active',
      completed: !!data.openToWork,
      weight: 5,
      tip: 'Allows recruiters with LinkedIn Recruiter subscriptions to contact you directly.'
    }
  ]

  const completionPercentage = Math.round(
    checklist.reduce((acc, item) => (item.completed ? acc + item.weight : acc), 0)
  )

  // Weighted overall calculation (out of 100)
  const overallScore = Math.min(
    100,
    Math.round(
      headlineScore * 1.5 +
        aboutScore * 1.5 +
        expScore * 1.5 +
        projScore * 1.0 +
        skillsScore * 1.0 +
        seoScore * 1.0 +
        appealScore * 1.0 +
        completenessFinal * 0.5 +
        netScore * 0.5 +
        brandScore * 0.5
    )
  )

  const tier: LinkedInScoreReport['tier'] =
    overallScore >= 88 ? 'All-Star' : overallScore >= 72 ? 'Advanced' : overallScore >= 55 ? 'Intermediate' : 'Beginner'

  const recruiterRating: LinkedInScoreReport['recruiterRating'] =
    overallScore >= 85
      ? 'Elite Tier'
      : overallScore >= 70
        ? 'High Visibility'
        : overallScore >= 50
          ? 'Moderate Reach'
          : 'Needs Optimization'

  // AI Suggestions compilation
  const aiSuggestions: LinkedInScoreReport['aiSuggestions'] = []
  if (headlineScore < 9) {
    aiSuggestions.push({
      section: 'Headline',
      title: 'Optimize Headline for Recruiter Search Algorithms',
      description: 'Recruiters search by role title and core technologies. Add keywords like "Python", "AWS", and "Distributed Systems".'
    })
  }
  if (aboutScore < 8) {
    aiSuggestions.push({
      section: 'About',
      title: 'Add a Strong Value Proposition & Contact Call-to-Action',
      description: 'End your summary with a direct email and brief bullet list of your technical stack.'
    })
  }
  if (missingKeywords.length > 0) {
    aiSuggestions.push({
      section: 'Skills & SEO',
      title: `Inject Top Recruiter Search Keywords: ${missingKeywords.slice(0, 4).join(', ')}`,
      description: `Adding these missing industry keywords can increase your recruiter search ranking by up to 35%.`
    })
  }
  if (expScore < 8) {
    aiSuggestions.push({
      section: 'Experience',
      title: 'Convert Experience Bullets to STAR Metric Format',
      description: 'Highlight measurable business outcomes (e.g. reduced latency by 42%, handled 250k daily requests).'
    })
  }

  return {
    overallScore,
    tier,
    recruiterRating,
    completionPercentage,
    categories: {
      headline: {
        name: 'Headline Impact',
        score: headlineScore,
        maxScore: 10,
        status: headlineScore >= 8 ? 'excellent' : headlineScore >= 6 ? 'good' : 'needs-improvement',
        tips: headlineTips
      },
      about: {
        name: 'About Section',
        score: aboutScore,
        maxScore: 10,
        status: aboutScore >= 8 ? 'excellent' : aboutScore >= 6 ? 'good' : 'needs-improvement',
        tips: aboutTips
      },
      experience: {
        name: 'Work Experience',
        score: expScore,
        maxScore: 10,
        status: expScore >= 8 ? 'excellent' : expScore >= 6 ? 'good' : 'needs-improvement',
        tips: expTips
      },
      projects: {
        name: 'Projects & Portfolio',
        score: projScore,
        maxScore: 10,
        status: projScore >= 8 ? 'excellent' : projScore >= 6 ? 'good' : 'needs-improvement',
        tips: projTips
      },
      skills: {
        name: 'Skills Coverage',
        score: skillsScore,
        maxScore: 10,
        status: skillsScore >= 8 ? 'excellent' : skillsScore >= 6 ? 'good' : 'needs-improvement',
        tips: skillsTips
      },
      seoKeywords: {
        name: 'Recruiter Search SEO',
        score: seoScore,
        maxScore: 10,
        status: seoScore >= 8 ? 'excellent' : seoScore >= 6 ? 'good' : 'needs-improvement',
        tips: missingKeywords.length > 0 ? [`Missing keywords: ${missingKeywords.slice(0, 5).join(', ')}`] : ['Strong SEO keywords profile']
      },
      recruiterAppeal: {
        name: 'Recruiter Appeal',
        score: appealScore,
        maxScore: 10,
        status: appealScore >= 8 ? 'excellent' : appealScore >= 6 ? 'good' : 'needs-improvement',
        tips: appealTips
      },
      completeness: {
        name: 'Profile Completeness',
        score: completenessFinal,
        maxScore: 10,
        status: completenessFinal >= 8 ? 'excellent' : completenessFinal >= 6 ? 'good' : 'needs-improvement',
        tips: []
      },
      networkingStrength: {
        name: 'Social Proof & Network',
        score: Math.min(10, netScore),
        maxScore: 10,
        status: netScore >= 8 ? 'excellent' : netScore >= 5 ? 'good' : 'needs-improvement',
        tips: netTips
      },
      personalBranding: {
        name: 'Personal Branding',
        score: Math.min(10, brandScore),
        maxScore: 10,
        status: brandScore >= 8 ? 'excellent' : brandScore >= 5 ? 'good' : 'needs-improvement',
        tips: brandTips
      }
    },
    checklist,
    seoMetrics: {
      densityScore: Math.round((matchedKeywords.length / targetKeywords.length) * 100),
      keywordMatches: matchedKeywords,
      missingKeywords,
      searchRankingEstimate:
        overallScore >= 85 ? 'Top 5% of candidate search results' : overallScore >= 70 ? 'Top 20% of search results' : 'Standard search tier'
    },
    aiSuggestions
  }
}

/**
 * Headline Generator supporting 10 Roles and 6 Styles
 */
export function generateHeadlines(
  role: TargetRole,
  style: HeadlineStyle,
  candidateName: string = 'Engineer',
  company: string = 'Tech'
): string[] {
  const roleTitles: Record<TargetRole, string> = {
    'software-engineer': 'Software Engineer',
    'ai-engineer': 'AI Engineer & LLM Specialist',
    'full-stack': 'Full Stack Developer',
    'data-scientist': 'Data Scientist & ML Engineer',
    'cloud-engineer': 'Cloud & DevOps Architect',
    'product-manager': 'Product Manager',
    'devops-engineer': 'DevOps & Site Reliability Engineer',
    'cyber-security': 'Cyber Security Specialist',
    'frontend-developer': 'Frontend Engineer',
    'backend-developer': 'Backend Distributed Systems Engineer'
  }

  const baseTitle = roleTitles[role] || 'Software Engineer'

  switch (style) {
    case 'corporate':
      return [
        `${baseTitle} at ${company} | Enterprise Scalability & Cloud Architecture | Driving Cross-Functional Efficiency`,
        `${baseTitle} | Building Resilient Enterprise Solutions | Cloud Security, Governance & Scalable APIs`,
        `Senior ${baseTitle} | Strategic Technology Delivery, Microservices & High-Availability Infrastructure`
      ]

    case 'startup':
      return [
        `${baseTitle} | 0 to 1 Product Builder | Fast-Paced Full Stack & Cloud Execution | Passionate about Growth`,
        `${baseTitle} @ High-Growth Tech | Turning Ideas into High-Scale Production Systems | TypeScript • Python • AWS`,
        `Product-Minded ${baseTitle} | Rapid Prototyping, Modern Architecture & Developer Velocity`
      ]

    case 'faang':
      return [
        `${baseTitle} | Designing High-Throughput Distributed Systems Handling Millions of Requests | Python • Go • AWS`,
        `${baseTitle} @ Scale | Low-Latency Microservices, Asynchronous Message Queues & Distributed Storage`,
        `${baseTitle} | System Design, Concurrency & High-Availability Cloud Platforms | Open Source Contributor`
      ]

    case 'student':
      return [
        `Aspiring ${baseTitle} | Computer Science Honors Student | Passionate about Distributed Systems & AI | Seeking 2025/2026 Opportunities`,
        `CS Student & Software Developer | Hackathon Winner | React • Python • TypeScript | Open to SDE Internships`,
        `Computer Science Undergraduate | Building Scalable Web Apps & Data Pipelines | Active Open Source Contributor`
      ]

    case 'experienced':
      return [
        `Senior ${baseTitle} | 5+ Years Designing Scalable Distributed Systems & High-Impact Cloud Architectures`,
        `Lead ${baseTitle} | Mentoring Engineering Teams, Modernizing Legacy Stacks & Delivering 99.99% Reliability`,
        `Principal ${baseTitle} | Cloud Infrastructure, Scalable Microservices & Strategic Engineering Leadership`
      ]

    case 'professional':
    default:
      return [
        `${baseTitle} at ${company} | Building Scalable Web Applications & Cloud Services | Python • TypeScript • AWS`,
        `${baseTitle} | Dedicated to Building Reliable, High-Performance Systems | React • Node.js • Cloud Architecture`,
        `${baseTitle} | Cloud Native Microservices, REST APIs & Distributed Pipelines | Let's Connect!`
      ]
  }
}

/**
 * About Section Generator supporting 6 Tones
 */
export function generateAboutSection(
  role: TargetRole,
  style: AboutStyle,
  profile: Partial<LinkedInProfileData> = {}
): string {
  const name = profile.fullName || 'Candidate'
  const skillsList = (profile.skills || ['Python', 'TypeScript', 'React', 'AWS', 'PostgreSQL']).slice(0, 8).join(', ')

  switch (style) {
    case 'executive':
      return `I am an experienced technology professional with a proven track record of engineering resilient cloud architectures, leading cross-functional delivery, and driving technical excellence.

Strategic Areas of Focus:
• Architecture & Scale: Designing highly available distributed microservices with automated failover and 99.99% reliability.
• Team Leadership: Mentoring engineers, standardizing modern CI/CD practices, and establishing clean code principles.
• Business Alignment: Translating business requirements into robust, high-throughput software solutions.

Core Competencies:
${skillsList}

Reach out via LinkedIn or at your business email to discuss technology strategy and high-impact engineering leadership.`

    case 'startup':
      return `I thrive in fast-paced environments turning ambitious product visions into production reality. As a product-minded engineer, I bridge the gap between user delight, business velocity, and clean technical architecture.

🚀 What I Bring:
• Speed & Quality: Shipping zero-to-one features rapidly without compromising system stability.
• Ownership Mindset: Taking full accountability from initial design and database schemas to deployment and telemetry.
• Modern Stack: Deep expertise across ${skillsList}.

If you are building something bold, I would love to connect and exchange ideas!`

    case 'corporate':
      return `Results-driven software professional experienced in building scalable, secure, and compliant enterprise applications. Proficient in delivering distributed cloud services with strict governance and automated testing.

Key Accomplishments:
• Standardized automated CI/CD deployment pipelines, cutting cycle time and human error rates significantly.
• Engineered high-concurrency microservice endpoints with comprehensive documentation and unit test coverage.
• Partnered closely with product, security, and operations teams to guarantee 99.9% system availability.

Technologies & Frameworks:
${skillsList}

Open to discussing enterprise software engineering and collaborative architecture.`

    case 'recruiter':
      return `Hi there! I am an active, impact-focused engineer seeking high-growth opportunities.

📌 Quick Snapshot:
• Primary Focus: Full lifecycle software engineering, cloud systems, and scalable API development.
• Key Skills: ${skillsList}
• Work Ethic: Analytical problem-solver with strong communication skills and passion for continuous learning.

🎯 Open To Opportunities:
Seeking roles as Software Engineer, Cloud Developer, or Full Stack Engineer.

📬 Let's Connect:
Feel free to send a connection request or email me directly to discuss relevant roles!`

    case 'student':
      return `I am an ambitious Computer Science student eager to apply academic foundations and hands-on coding experience to real-world engineering challenges.

🎓 Academic Focus:
• Coursework: Data Structures, Algorithms, Distributed Computing, Database Management, Cloud Systems.
• Projects: Built full-stack web applications and scalable data pipelines utilizing ${skillsList}.
• Extracurriculars: Active hackathon competitor and open-source contributor.

Seeking internship and full-time software engineering roles where I can contribute immediately while learning from world-class teams.`

    case 'professional':
    default:
      return `I am a dedicated software engineer specializing in building scalable web architectures, clean REST APIs, and dependable cloud services.

🚀 Technical Expertise:
• Microservices & Backend: Designing resilient APIs handling high request volumes with minimal latency.
• Frontend Engineering: Crafting responsive, accessible user interfaces using modern reactive frameworks.
• Cloud & DevOps: Implementing automated CI/CD pipelines, containerized deployments, and server telemetry.

Core Technical Stack:
${skillsList}

I am always interested in discussing technical challenges, distributed systems, and innovative engineering teams. Let's connect!`
  }
}

/**
 * STAR Method Experience Rewriter
 */
export function rewriteBulletToStar(originalBullet: string): { starBullet: string; metricAdded: string } {
  const trimmed = originalBullet.trim()
  if (/reduced|improved|increased|accelerated|delivered|architected/i.test(trimmed) && /\d+/.test(trimmed)) {
    return {
      starBullet: trimmed,
      metricAdded: 'Already contains STAR impact'
    }
  }

  const enhanced = `Architected and optimized ${trimmed.replace(/^(worked on|responsible for|helped in|managed)\s*/i, '')}, improving system throughput by 35% and reducing processing latency.`

  return {
    starBullet: enhanced,
    metricAdded: '35% throughput increase & latency reduction'
  }
}
