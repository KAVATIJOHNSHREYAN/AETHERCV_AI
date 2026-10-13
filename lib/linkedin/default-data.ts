import { LinkedInProfileData, TargetRole } from '@/types/linkedin'

export const defaultLinkedInData: LinkedInProfileData = {
  fullName: 'Alex Johnson',
  headline: 'Software Engineer @ Acme Cloud Systems | Building Resilient Distributed Systems & Cloud APIs | Python • TypeScript • AWS • React | Open Source Contributor',
  location: 'San Francisco Bay Area, CA',
  customUrl: 'linkedin.com/in/alexjohnson-cloud',
  openToWork: true,
  targetRoles: ['Software Engineer', 'Full Stack Developer', 'Cloud Architect', 'Backend Engineer'],
  profilePhoto: '',
  bannerGradient: 'linear-gradient(135deg, #07101F 0%, #162440 50%, #2662EB 100%)',
  about: `I am a results-driven Software Engineer with 3+ years of experience engineering high-concurrency cloud services, REST APIs, and modern web architectures. Passionate about distributed systems, developer productivity, and reliable cloud infrastructure.

🚀 What I Do:
• Architect scalable microservices using Python (FastAPI), TypeScript, and Node.js.
• Design responsive, enterprise-grade web applications with React and Next.js.
• Deploy production systems to AWS utilizing Docker, ECS, and automated CI/CD pipelines.

📈 Recent Impact:
• Reduced message queue latency by 42% by transitioning from polling to event-driven Redis streams.
• Scaled core API services handling 250,000+ daily requests with 99.98% uptime.
• Decreased automated build cycles from 35 minutes down to 8 minutes across 14 microservices.

Core Technical Competencies:
Languages: Python, TypeScript, JavaScript, SQL, Java, Go
Frameworks: React, Next.js, FastAPI, Node.js, Express, Tailwind CSS
Databases & Cloud: PostgreSQL, Redis, MongoDB, AWS (EC2, S3, RDS, Lambda), Docker, Git

Let's connect or discuss engineering at alex.johnson@example.com!`,
  experience: [
    {
      id: 'exp-li-1',
      company: 'Acme Cloud Systems',
      role: 'Software Engineer',
      location: 'San Francisco, CA',
      startDate: 'Jul 2024',
      endDate: 'Present',
      current: true,
      description: 'Core platform engineering focused on high-throughput asynchronous message queues, data pipelines, and external client API gateways.',
      bulletPoints: [
        'Architected asynchronous message processing pipeline using Python and Redis, reducing queue latency by 42%.',
        'Engineered 12+ RESTful microservice endpoints with automated OpenAPI schemas, handling 250,000+ daily API requests.',
        'Spearheaded CI/CD automated test suite optimization, reducing deployment cycle times from 35 minutes to 8 minutes.',
        'Received Engineering Excellence Award for zero-downtime database migration across 2M+ customer records.'
      ],
      skillsUsed: ['Python', 'FastAPI', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS', 'Redis']
    },
    {
      id: 'exp-li-2',
      company: 'TechFlow Labs',
      role: 'Software Engineering Intern',
      location: 'San Jose, CA',
      startDate: 'Jun 2023',
      endDate: 'Aug 2023',
      current: false,
      description: 'Built real-time telemetry dashboards and internal monitoring tools for enterprise client health tracking.',
      bulletPoints: [
        'Built real-time telemetry dashboard using React and TypeScript, accelerating customer issue triage by 30%.',
        'Optimized SQL queries and database indexes, improving report generation throughput by 25%.',
        'Delivered production-ready telemetry analytics component adopted across all enterprise client accounts.'
      ],
      skillsUsed: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git']
    }
  ],
  education: [
    {
      id: 'edu-li-1',
      school: 'State University of California',
      degree: 'Bachelor of Science (B.S.)',
      fieldOfStudy: 'Computer Science',
      startDate: '2020',
      endDate: '2024',
      grade: '3.85 / 4.0 GPA',
      activities: 'ACM Student Chapter, Open Source Hackathon Organizer, Dean’s Honor List'
    }
  ],
  projects: [
    {
      id: 'proj-li-1',
      title: 'Distributed Task Queue Engine',
      description: 'High-throughput distributed task scheduling framework supporting prioritization and retry backoff.',
      problem: 'Enterprise workloads experienced job starvation during peak spikes with legacy synchronous worker queues.',
      solution: 'Engineered an asynchronous task distribution cluster with worker prioritization and dead-letter routing.',
      technologies: ['Python', 'Redis', 'Docker', 'FastAPI'],
      impact: 'Processes 5,000+ tasks/second with sub-50ms execution delay and 99.98% delivery reliability.',
      url: 'https://github.com/alexjohnson/distributed-task-queue'
    },
    {
      id: 'proj-li-2',
      title: 'Enterprise Cloud Metrics Monitor',
      description: 'Full-stack infrastructure observability platform monitoring server health and resource bottlenecks.',
      problem: 'DevOps engineers lacked unified visual telemetry across hybrid cloud server instances.',
      solution: 'Constructed real-time WebSocket dashboard streaming CPU, memory, and disk I/O metrics.',
      technologies: ['TypeScript', 'Next.js', 'PostgreSQL', 'Tailwind CSS'],
      impact: 'Accelerated mean time to detect (MTTD) server degradation by 40% across 50+ monitored nodes.',
      url: 'https://github.com/alexjohnson/cloud-metrics-monitor'
    }
  ],
  skills: [
    'Python',
    'TypeScript',
    'JavaScript',
    'React',
    'Next.js',
    'FastAPI',
    'Node.js',
    'PostgreSQL',
    'Redis',
    'Docker',
    'AWS (Amazon Web Services)',
    'REST APIs',
    'Distributed Systems',
    'Microservices Architecture',
    'Git'
  ],
  certifications: [
    {
      id: 'cert-li-1',
      name: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services (AWS)',
      issueDate: 'May 2024',
      credentialUrl: 'https://aws.amazon.com/certification'
    }
  ],
  featured: [
    {
      id: 'feat-li-1',
      title: 'Deep Dive: Scaling Microservices with Redis Streams & Python',
      type: 'article',
      url: 'https://github.com/alexjohnson',
      description: 'A technical walkthrough on optimizing asynchronous task workers and avoiding message queue bottlenecks.'
    }
  ],
  volunteer: [
    {
      id: 'vol-li-1',
      organization: 'Code for Youth Foundation',
      role: 'Volunteer Programming Mentor',
      cause: 'Education'
    }
  ],
  languages: ['English (Native)', 'Spanish (Professional)'],
  recommendationsCount: 3
}

export const DEFAULT_LINKEDIN_PROFILE = defaultLinkedInData

export const TARGET_ROLES: TargetRole[] = [
  'software-engineer',
  'ai-engineer',
  'full-stack',
  'data-scientist',
  'cloud-engineer',
  'product-manager',
  'devops-engineer',
  'cyber-security',
  'frontend-developer',
  'backend-developer'
]

export const ROLE_LABELS: Record<string, string> = {
  'software-engineer': 'Software Engineer',
  'ai-engineer': 'AI Engineer',
  'full-stack': 'Full Stack Developer',
  'data-scientist': 'Data Scientist',
  'cloud-engineer': 'Cloud Engineer',
  'product-manager': 'Product Manager',
  'devops-engineer': 'DevOps Engineer',
  'cyber-security': 'Cyber Security Engineer',
  'frontend-developer': 'Frontend Developer',
  'backend-developer': 'Backend Developer'
}

export function getRoleLabel(role: string): string {
  if (!role) return 'Software Engineer'
  return ROLE_LABELS[role] || role
}
