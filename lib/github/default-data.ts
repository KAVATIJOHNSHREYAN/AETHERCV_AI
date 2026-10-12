import { GitHubProfileData } from '@/types/github'

export const DEFAULT_GITHUB_PROFILE: GitHubProfileData = {
  username: 'alexjohnson-dev',
  name: 'Alex Johnson',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  bio: 'Software Engineer & Distributed Systems Enthusiast. Building high-throughput cloud platforms, AI microservices, and open-source developer tooling. 🚀',
  company: '@AcmeCloud',
  location: 'San Francisco, CA / Remote',
  website: 'https://alexjohnson.dev',
  twitterUsername: 'alexjohnson_dev',
  targetRole: 'Software Engineer',
  yearsOfExperience: '3+ Years',
  readmeStyle: 'neon-developer',
  readmeContent: `# Hi there, I'm Alex Johnson 👋

### 🚀 Software Engineer & Distributed Systems Builder

Experienced Software Engineer specializing in scalable backend architectures, high-concurrency microservices, and modern cloud deployment pipelines. Passionate about developer tooling, open source, and low-latency systems.

---

### 🛠️ Tech Stack & Core Competencies

- **Languages:** Python, TypeScript, Go, JavaScript, C++, SQL
- **Frameworks & Libs:** Next.js, React, FastAPI, Node.js, Express, Tailwind CSS
- **Cloud & DevOps:** AWS (ECS, Lambda, S3), Docker, Kubernetes, Terraform, GitHub Actions
- **Databases & Cache:** PostgreSQL, Redis, MongoDB, Qdrant
- **AI & Data:** LangChain, PyTorch, Vector Search, OpenAI API

---

### 🌟 Featured Projects

1. **[Distributed Task Queue Engine](https://github.com/alexjohnson-dev/distributed-task-queue)**
   - *High-throughput asynchronous job broker processing 5,000+ tasks/sec with sub-50ms latency.*
   - Built with Python, Redis Streams, Docker, and FastAPI.

2. **[Cloud Telemetry Monitor](https://github.com/alexjohnson-dev/cloud-telemetry-monitor)**
   - *Real-time infrastructure observability dashboard with WebSocket streaming and automated alerting.*
   - Built with Next.js, TypeScript, PostgreSQL, and Tailwind CSS.

---

### 📊 GitHub Activity & Statistics

<p align="left">
  <img src="https://github-readme-stats.vercel.app/api?username=alexjohnson-dev&show_icons=true&theme=radical&hide_border=true" alt="Alex's GitHub stats" height="150" />
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=alexjohnson-dev&theme=radical&hide_border=true" alt="GitHub Streak" height="150" />
</p>

---

### 🤝 Connect With Me

- 🌐 Portfolio: [alexjohnson.dev](https://alexjohnson.dev)
- 💼 LinkedIn: [linkedin.com/in/alexjohnson-cloud](https://linkedin.com)
- 🐦 Twitter / X: [@alexjohnson_dev](https://x.com)
- 📧 Email: alex.johnson@example.com
`,
  socialLinks: {
    linkedin: 'linkedin.com/in/alexjohnson-cloud',
    twitter: 'twitter.com/alexjohnson_dev',
    website: 'https://alexjohnson.dev',
    email: 'alex.johnson@example.com'
  },
  techStack: {
    languages: ['TypeScript', 'Python', 'Go', 'JavaScript', 'SQL', 'C++'],
    frameworks: ['React', 'Next.js', 'FastAPI', 'Node.js', 'Express', 'Tailwind CSS'],
    databases: ['PostgreSQL', 'Redis', 'MongoDB', 'Qdrant'],
    cloudDevOps: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'CI/CD'],
    aiMl: ['LangChain', 'PyTorch', 'Vector Search', 'RAG'],
    tools: ['Git', 'Linux', 'Vim', 'Postman', 'Figma']
  },
  repositories: [
    {
      id: 'repo-1',
      name: 'distributed-task-queue',
      description: 'High-throughput asynchronous job broker processing 5,000+ tasks/sec with priority scheduling & dead-letter queue routing.',
      language: 'Python',
      stars: 184,
      forks: 37,
      topics: ['distributed-systems', 'redis', 'python', 'asyncio', 'fastapi', 'microservices'],
      isPinned: true,
      hasReadme: true,
      hasLicense: true,
      hasLiveDemo: true,
      demoUrl: 'https://task-queue.alexjohnson.dev',
      githubUrl: 'https://github.com/alexjohnson-dev/distributed-task-queue',
      license: 'MIT',
      healthScore: 95,
      recommendations: ['Add architectural sequence diagram in README', 'Include benchmark latency chart']
    },
    {
      id: 'repo-2',
      name: 'cloud-telemetry-monitor',
      description: 'Full-stack cloud infrastructure observability platform streaming real-time CPU, RAM, and network I/O via WebSockets.',
      language: 'TypeScript',
      stars: 142,
      forks: 28,
      topics: ['observability', 'nextjs', 'websockets', 'typescript', 'postgresql', 'tailwind'],
      isPinned: true,
      hasReadme: true,
      hasLicense: true,
      hasLiveDemo: true,
      demoUrl: 'https://telemetry.alexjohnson.dev',
      githubUrl: 'https://github.com/alexjohnson-dev/cloud-telemetry-monitor',
      license: 'Apache-2.0',
      healthScore: 92,
      recommendations: ['Tag release v1.2.0 on GitHub', 'Add sample environment variables (.env.example)']
    },
    {
      id: 'repo-3',
      name: 'agentic-rag-engine',
      description: 'Autonomous multi-document question answering agent utilizing Qdrant vector database and hybrid dense-sparse retrieval.',
      language: 'Python',
      stars: 98,
      forks: 19,
      topics: ['ai', 'rag', 'llm', 'langchain', 'vector-database', 'qdrant'],
      isPinned: true,
      hasReadme: true,
      hasLicense: true,
      hasLiveDemo: false,
      demoUrl: '',
      githubUrl: 'https://github.com/alexjohnson-dev/agentic-rag-engine',
      license: 'MIT',
      healthScore: 84,
      recommendations: ['Deploy interactive live demo on Hugging Face Spaces or Vercel', 'Add video walkthrough GIF']
    },
    {
      id: 'repo-4',
      name: 'devops-ci-cd-blueprint',
      description: 'Production-ready Terraform & GitHub Actions blueprints for zero-downtime blue-green deployments on AWS ECS.',
      language: 'HCL',
      stars: 64,
      forks: 14,
      topics: ['devops', 'terraform', 'aws', 'ecs', 'ci-cd', 'infrastructure-as-code'],
      isPinned: true,
      hasReadme: true,
      hasLicense: true,
      hasLiveDemo: false,
      demoUrl: '',
      githubUrl: 'https://github.com/alexjohnson-dev/devops-ci-cd-blueprint',
      license: 'MIT',
      healthScore: 88,
      recommendations: ['Add CONTRIBUTING.md guidelines', 'Add automated test action for Terraform validation']
    },
    {
      id: 'repo-5',
      name: 'algorithms-and-system-design',
      description: 'Curated implementations of high-frequency LeetCode patterns, concurrency primitives, and distributed system case studies.',
      language: 'Go',
      stars: 45,
      forks: 11,
      topics: ['algorithms', 'data-structures', 'system-design', 'golang', 'interview-prep'],
      isPinned: false,
      hasReadme: true,
      hasLicense: true,
      hasLiveDemo: false,
      githubUrl: 'https://github.com/alexjohnson-dev/algorithms-and-system-design',
      license: 'MIT',
      healthScore: 78,
      recommendations: ['Pin to profile to signal strong CS fundamentals to recruiters', 'Add benchmarks for Go routines']
    },
    {
      id: 'repo-6',
      name: 'react-glassmorphism-ui',
      description: 'Accessible, modern React component library with Tailwind CSS glassmorphic tokens and fluid micro-animations.',
      language: 'TypeScript',
      stars: 39,
      forks: 7,
      topics: ['react', 'ui-library', 'tailwind', 'glassmorphism', 'npm-package'],
      isPinned: false,
      hasReadme: true,
      hasLicense: true,
      hasLiveDemo: true,
      demoUrl: 'https://ui.alexjohnson.dev',
      githubUrl: 'https://github.com/alexjohnson-dev/react-glassmorphism-ui',
      license: 'MIT',
      healthScore: 82,
      recommendations: ['Publish to npm registry', 'Add Storybook live documentation']
    }
  ],
  achievements: [
    'Pull Shark (x2)',
    'Quickdraw',
    'YOLO',
    'Arctic Code Vault Contributor',
    'Starstruck'
  ],
  contributionsLastYear: 842,
  streakDays: 48,
  openToWork: true
}
