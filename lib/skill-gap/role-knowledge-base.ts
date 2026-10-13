import {
  SkillCategory,
  ProjectRecommendation,
  CertificationRecommendation,
  RoadmapWeek,
  MarketDemand
} from '@/types/skill-gap'

export interface RoleKnowledgeProfile {
  title: string
  normalizedKey: string
  essentialSkills: { name: string; category: SkillCategory; weight: number }[]
  recruiterKeywords: string[]
  sampleJdText: string
  typicalYearsRequired: number
  projects: ProjectRecommendation[]
  certifications: CertificationRecommendation[]
  roadmap: RoadmapWeek[]
  market: MarketDemand
}

export const ROLE_KNOWLEDGE_BASE: Record<string, RoleKnowledgeProfile> = {
  'software-engineer': {
    title: 'Software Engineer',
    normalizedKey: 'software-engineer',
    typicalYearsRequired: 2,
    essentialSkills: [
      { name: 'Data Structures & Algorithms', category: 'Programming Languages', weight: 10 },
      { name: 'TypeScript', category: 'Programming Languages', weight: 9 },
      { name: 'Python', category: 'Programming Languages', weight: 9 },
      { name: 'RESTful APIs', category: 'Backend', weight: 9 },
      { name: 'Git & Version Control', category: 'Tools', weight: 9 },
      { name: 'PostgreSQL', category: 'Databases', weight: 8 },
      { name: 'Docker', category: 'DevOps', weight: 8 },
      { name: 'Microservices Architecture', category: 'Backend', weight: 8 },
      { name: 'React', category: 'Frontend', weight: 8 },
      { name: 'CI/CD Pipelines', category: 'DevOps', weight: 7 },
      { name: 'AWS Cloud Services', category: 'Cloud', weight: 7 },
      { name: 'Unit Testing (Jest/PyTest)', category: 'Tools', weight: 7 },
      { name: 'System Design', category: 'Backend', weight: 8 },
      { name: 'Agile & Scrum', category: 'Soft Skills', weight: 6 }
    ],
    recruiterKeywords: [
      'Microservices', 'Docker', 'PostgreSQL', 'RESTful APIs', 'CI/CD',
      'Kubernetes', 'AWS', 'Redis', 'Unit Testing', 'Scalability'
    ],
    sampleJdText: `We are looking for a Software Engineer to design, build, and maintain scalable software services.
Responsibilities:
- Build high-throughput REST APIs and microservices.
- Design database schemas and optimize query performance in PostgreSQL.
- Package services in Docker containers and deploy via automated CI/CD pipelines.
- Collaborate with frontend engineers and write robust unit and integration tests.
Requirements:
- Bachelor's degree in Computer Science or equivalent practical experience.
- Strong proficiency in Python, TypeScript, or Go.
- Experience with relational databases, Docker, and AWS.`,
    projects: [
      {
        id: 'se-proj-1',
        title: 'Distributed Asynchronous Task Queue',
        category: 'Backend & Systems',
        difficulty: 'Advanced',
        technologies: ['Python', 'Redis', 'FastAPI', 'Docker', 'PostgreSQL'],
        estimatedTime: '3–4 Weeks',
        resumeValue: 'Crucial',
        description: 'High-concurrency task processing pipeline with exponential backoff retries, dead-letter routing, and web telemetry.',
        keyDeliverables: ['Worker pool processing 5k tasks/sec', 'Redis Pub/Sub event bus', 'Grafana metrics dashboard'],
        githubArchitecture: 'Clean Onion Architecture with separated worker nodes, producer API, and Docker Compose orchestration.'
      },
      {
        id: 'se-proj-2',
        title: 'Enterprise API Gateway & Rate Limiter',
        category: 'Microservices & Networking',
        difficulty: 'Intermediate',
        technologies: ['Go', 'Node.js', 'Redis', 'JWT', 'Docker'],
        estimatedTime: '2–3 Weeks',
        resumeValue: 'Very High',
        description: 'Reverse proxy gateway implementing sliding-window rate limiting, token verification, and request logging.',
        keyDeliverables: ['Sub-5ms overhead latency', 'Sliding log algorithm in Redis', 'Automated OpenAPI 3.0 documentation'],
        githubArchitecture: 'Modular middleware pattern with dynamic upstream routing and health checks.'
      },
      {
        id: 'se-proj-3',
        title: 'Real-Time Collaborative Document Workspace',
        category: 'Full Stack Distributed',
        difficulty: 'Advanced',
        technologies: ['TypeScript', 'Next.js', 'WebSockets', 'PostgreSQL', 'Tailwind CSS'],
        estimatedTime: '4 Weeks',
        resumeValue: 'Crucial',
        description: 'Multiplayer markdown workspace with operational transformation (CRDT), user cursor tracking, and version history.',
        keyDeliverables: ['Conflict-free replicated data types', 'Live WebSocket syncing', 'Row-level security in PostgreSQL'],
        githubArchitecture: 'Client-server syncing engine with persistent PostgreSQL snapshots and WebSockets.'
      }
    ],
    certifications: [
      {
        id: 'se-cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        difficulty: 'Associate',
        duration: '6–8 Weeks',
        careerImpact: 'Essential',
        officialUrl: 'https://aws.amazon.com/certification/',
        description: 'Validates ability to design robust, cost-effective distributed systems and cloud microservices on AWS.'
      },
      {
        id: 'se-cert-2',
        name: 'Certified Kubernetes Application Developer (CKAD)',
        issuer: 'Linux Foundation / CNCF',
        difficulty: 'Professional',
        duration: '8–10 Weeks',
        careerImpact: 'Very High',
        officialUrl: 'https://www.cncf.io/certification/ckad/',
        description: 'Hands-on performance-based exam proving ability to design, build, and configure cloud-native container applications.'
      }
    ],
    roadmap: [
      {
        weekRange: 'Week 1–2',
        title: 'Advanced Data Structures & Modern Backend Fundamentals',
        goals: ['Master Big-O optimization, trees, graphs, and concurrency patterns in TypeScript/Python.'],
        milestones: ['Solve 25+ medium algorithmic problems', 'Implement custom LRU Cache and Thread Pool'],
        keySkills: ['Data Structures', 'TypeScript', 'Concurrency']
      },
      {
        weekRange: 'Week 3–4',
        title: 'Production RESTful Microservices & SQL Mastery',
        goals: ['Build modular REST APIs with strict input validation, database indexing, and connection pooling.'],
        milestones: ['Deploy 8+ endpoints with Swagger/OpenAPI', 'Optimize slow queries using EXPLAIN ANALYZE in PostgreSQL'],
        keySkills: ['REST APIs', 'PostgreSQL', 'Database Indexing']
      },
      {
        weekRange: 'Week 5–6',
        title: 'Containerization, Caching & Message Queues',
        goals: ['Dockerize backend services and introduce Redis caching and asynchronous job queues.'],
        milestones: ['Multi-stage Dockerfile reducing image size by 70%', 'Set up Redis cache with cache-invalidation strategies'],
        keySkills: ['Docker', 'Redis', 'Async Queues']
      },
      {
        weekRange: 'Week 7–8',
        title: 'CI/CD Pipelines, Cloud Hosting & Observability',
        goals: ['Automate testing and deployment to AWS via GitHub Actions with health check monitoring.'],
        milestones: ['Zero-downtime deployment pipeline', 'Set up Prometheus & Grafana alerting metrics'],
        keySkills: ['CI/CD', 'AWS', 'GitHub Actions', 'Monitoring']
      },
      {
        weekRange: 'Week 9–10',
        title: 'System Design & Distributed Scalability',
        goals: ['Study high-availability architectures: load balancers, database sharding, and idempotency.'],
        milestones: ['Design end-to-end architecture for URL shortener & notification system', 'Implement distributed rate limiter'],
        keySkills: ['System Design', 'Load Balancing', 'Scalability']
      },
      {
        weekRange: 'Week 11–12',
        title: 'Capstone Production Project & Portfolio Launch',
        goals: ['Finalize the Distributed Task Queue project, write a recruiter-ready README, and deploy live.'],
        milestones: ['Deploy live demo on AWS', 'Document architecture with Mermaid diagrams and test coverage > 85%'],
        keySkills: ['Portfolio', 'Technical Writing', 'Architecture Documentation'],
        projectDeliverable: 'Distributed Asynchronous Task Queue'
      }
    ],
    market: {
      role: 'Software Engineer',
      hiringDemand: 'Very High',
      averageSalary: '$118,000 / yr',
      salaryRange: '$85,000 – $165,000',
      topHiringCompanies: ['Google', 'Microsoft', 'Amazon', 'Stripe', 'Atlassian', 'Adobe', 'Uber'],
      experienceLevel: '0–3 Years (Junior to Mid)',
      remoteOpportunities: '64% Hybrid / Remote',
      growthTrend: '+17% YoY Growth',
      jobOpeningsEstimate: '185,000+ Active Roles'
    }
  },

  'ai-engineer': {
    title: 'AI Engineer & LLMs',
    normalizedKey: 'ai-engineer',
    typicalYearsRequired: 2,
    essentialSkills: [
      { name: 'Python', category: 'Programming Languages', weight: 10 },
      { name: 'Large Language Models (LLMs)', category: 'AI', weight: 10 },
      { name: 'RAG Architectures', category: 'AI', weight: 10 },
      { name: 'Vector Databases (Pinecone/Qdrant/Milvus)', category: 'Databases', weight: 9 },
      { name: 'LangChain & LlamaIndex', category: 'Frameworks', weight: 9 },
      { name: 'Prompt Engineering & Function Calling', category: 'AI', weight: 9 },
      { name: 'FastAPI', category: 'Backend', weight: 8 },
      { name: 'PyTorch & Hugging Face', category: 'Machine Learning', weight: 8 },
      { name: 'Docker & Containerization', category: 'DevOps', weight: 8 },
      { name: 'Fine-Tuning (LoRA / PEFT)', category: 'Machine Learning', weight: 7 },
      { name: 'Embeddings & Semantic Search', category: 'AI', weight: 9 },
      { name: 'Evaluation Frameworks (Ragas/TruLens)', category: 'Tools', weight: 7 },
      { name: 'Model Optimization & Quantization', category: 'AI', weight: 7 }
    ],
    recruiterKeywords: [
      'RAG', 'LLMs', 'Vector Databases', 'LangChain', 'LlamaIndex',
      'Embeddings', 'Fine-Tuning', 'FastAPI', 'Hugging Face', 'Prompt Engineering'
    ],
    sampleJdText: `Seeking an AI Engineer to design intelligent Generative AI agents and RAG platforms.
Responsibilities:
- Build low-latency Retrieval-Augmented Generation (RAG) pipelines over unstructured enterprise docs.
- Integrate vector databases (Qdrant, Pinecone) with hybrid keyword and semantic search.
- Develop production-grade APIs using FastAPI and orchestrate agentic workflows with LangGraph.
- Benchmark token costs, latency, and hallucinations using automated evaluation suites.
Requirements:
- Deep hands-on experience in Python, LLM APIs, and vector embeddings.
- Experience with PyTorch or Hugging Face transformers.
- Knowledge of Docker and cloud model deployment.`,
    projects: [
      {
        id: 'ai-proj-1',
        title: 'Enterprise Multi-Modal RAG Document Intelligence Engine',
        category: 'Generative AI & Search',
        difficulty: 'Advanced',
        technologies: ['Python', 'FastAPI', 'Qdrant', 'LangChain', 'LlamaIndex', 'React'],
        estimatedTime: '3–4 Weeks',
        resumeValue: 'Crucial',
        description: 'Semantic search and document synthesis engine with PDF table parsing, hybrid BM25 + dense vector retrieval, and hallucination guardrails.',
        keyDeliverables: ['Context-aware citations with page anchors', 'Token compression reducing latency by 45%', 'Ragas evaluation score > 0.88'],
        githubArchitecture: 'Decoupled ingestion worker for vectorization + FastAPI streaming endpoint with Server-Sent Events.'
      },
      {
        id: 'ai-proj-2',
        title: 'Autonomous Multi-Agent Workflow Orchestrator',
        category: 'Agentic AI',
        difficulty: 'Advanced',
        technologies: ['Python', 'LangGraph', 'OpenAI/Claude API', 'FastAPI', 'Docker'],
        estimatedTime: '3 Weeks',
        resumeValue: 'Crucial',
        description: 'Collaborative AI agent team (Researcher, Writer, Reviewer) utilizing tool calling, human-in-the-loop approvals, and state checkpointing.',
        keyDeliverables: ['Cyclic graph execution in LangGraph', 'Dynamic search & code execution sandbox', 'Persistent SQLite state store'],
        githubArchitecture: 'Graph-based state machine with retry strategies and deterministic structured outputs.'
      },
      {
        id: 'ai-proj-3',
        title: 'Domain-Specific LLM Fine-Tuning & Quantization Pipeline',
        category: 'Deep Learning & NLP',
        difficulty: 'Advanced',
        technologies: ['PyTorch', 'Hugging Face', 'LoRA/PEFT', 'vLLM', 'FastAPI'],
        estimatedTime: '3–4 Weeks',
        resumeValue: 'Very High',
        description: 'Fine-tuned Llama 3 / Mistral model on 5,000+ domain conversations with 4-bit AWQ quantization deployed on vLLM.',
        keyDeliverables: ['3x faster inference throughput via vLLM', 'Validation perplexity reduction by 32%', 'Dockerized GPU serving container'],
        githubArchitecture: 'Data preparation scripts, LoRA adapter merge pipeline, and low-latency inference endpoint.'
      }
    ],
    certifications: [
      {
        id: 'ai-cert-1',
        name: 'DeepLearning.AI Generative AI for Everyone / LLM Specialization',
        issuer: 'DeepLearning.AI / Coursera',
        difficulty: 'Associate',
        duration: '4–6 Weeks',
        careerImpact: 'Very High',
        officialUrl: 'https://www.deeplearning.ai/',
        description: 'Covers transformer foundations, attention mechanisms, fine-tuning methodologies, and production deployment.'
      },
      {
        id: 'ai-cert-2',
        name: 'AWS Certified AI Practitioner or Machine Learning Specialty',
        issuer: 'Amazon Web Services',
        difficulty: 'Professional',
        duration: '8 Weeks',
        careerImpact: 'Essential',
        officialUrl: 'https://aws.amazon.com/certification/',
        description: 'Validates ability to design, implement, and deploy AI/ML and Generative AI solutions using AWS Bedrock and SageMaker.'
      }
    ],
    roadmap: [
      {
        weekRange: 'Week 1–2',
        title: 'Transformer Architecture & Vector Embeddings Deep Dive',
        goals: ['Understand self-attention, tokenization, positional encodings, and dense vector distance metrics (Cosine, Dot Product).'],
        milestones: ['Implement custom dot-product attention in PyTorch', 'Benchmark sentence-transformers on text similarity'],
        keySkills: ['Python', 'Embeddings', 'Transformers']
      },
      {
        weekRange: 'Week 3–4',
        title: 'Vector Databases & Production RAG Pipelines',
        goals: ['Integrate Qdrant or Pinecone with chunking strategies (recursive, semantic, markdown).'],
        milestones: ['Build hybrid search combining dense vectors with BM25 keyword matching', 'Implement re-ranking with Cohere/BGE reranker'],
        keySkills: ['Vector Databases', 'Qdrant', 'RAG']
      },
      {
        weekRange: 'Week 5–6',
        title: 'Agentic Workflows, Tool Calling & State Management',
        goals: ['Master LangGraph, function calling, structured Pydantic outputs, and agent loops.'],
        milestones: ['Build multi-step agent with web search & calculator tools', 'Add human-in-the-loop approval workflows'],
        keySkills: ['LangGraph', 'Agentic AI', 'Function Calling']
      },
      {
        weekRange: 'Week 7–8',
        title: 'High-Performance API Serving & Streaming',
        goals: ['Expose AI pipelines through async FastAPI with token streaming and rate limiting.'],
        milestones: ['Implement Server-Sent Events (SSE) streaming for real-time response rendering', 'Dockerize AI backend with environment secrets'],
        keySkills: ['FastAPI', 'Streaming', 'Docker']
      },
      {
        weekRange: 'Week 9–10',
        title: 'Model Fine-Tuning & Quantization Techniques',
        goals: ['Fine-tune open-weights models using LoRA/QLoRA on custom datasets with Unsloth / Hugging Face.'],
        milestones: ['Fine-tune Mistral-7B on instruction dataset with sub-$5 GPU budget', 'Serve quantized weights with vLLM engine'],
        keySkills: ['LoRA', 'Fine-Tuning', 'Quantization']
      },
      {
        weekRange: 'Week 11–12',
        title: 'Evaluation, Guardrails & Capstone Launch',
        goals: ['Measure precision with Ragas, add guardrails with NeMo Guardrails, and deploy live showcase.'],
        milestones: ['Achieve > 0.85 faithfulness score on test suite', 'Publish open-source GitHub repository with architecture diagram'],
        keySkills: ['AI Evaluation', 'Ragas', 'Guardrails'],
        projectDeliverable: 'Enterprise Multi-Modal RAG Document Intelligence Engine'
      }
    ],
    market: {
      role: 'AI Engineer & LLMs',
      hiringDemand: 'Very High',
      averageSalary: '$145,000 / yr',
      salaryRange: '$110,000 – $210,000',
      topHiringCompanies: ['OpenAI', 'Anthropic', 'Microsoft', 'NVIDIA', 'Scale AI', 'Meta', 'Databricks'],
      experienceLevel: '1–4 Years',
      remoteOpportunities: '78% Remote / Flexible',
      growthTrend: '+48% YoY Growth (Top Tech Trend)',
      jobOpeningsEstimate: '92,000+ Active Roles'
    }
  },

  'full-stack-developer': {
    title: 'Full Stack Developer',
    normalizedKey: 'full-stack-developer',
    typicalYearsRequired: 2,
    essentialSkills: [
      { name: 'TypeScript', category: 'Programming Languages', weight: 10 },
      { name: 'React', category: 'Frontend', weight: 10 },
      { name: 'Next.js (App Router)', category: 'Frontend', weight: 9 },
      { name: 'Node.js & Express', category: 'Backend', weight: 9 },
      { name: 'PostgreSQL / Prisma ORM', category: 'Databases', weight: 9 },
      { name: 'Tailwind CSS', category: 'Frontend', weight: 8 },
      { name: 'REST APIs & GraphQL', category: 'Backend', weight: 8 },
      { name: 'Docker', category: 'DevOps', weight: 8 },
      { name: 'Authentication (OAuth/JWT)', category: 'Backend', weight: 8 },
      { name: 'State Management (Zustand/Redux)', category: 'Frontend', weight: 7 },
      { name: 'Git & Version Control', category: 'Tools', weight: 9 },
      { name: 'AWS / Vercel Deployment', category: 'Cloud', weight: 8 }
    ],
    recruiterKeywords: [
      'Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL',
      'Prisma', 'Tailwind CSS', 'Docker', 'REST APIs', 'Full Stack'
    ],
    sampleJdText: `Full Stack Developer needed to engineer modern web applications from database to UI.
Responsibilities:
- Build responsive, accessible frontends using React, Next.js, and Tailwind CSS.
- Design resilient backend services, authentication, and relational schemas in PostgreSQL.
- Integrate third-party APIs and deploy applications using Docker and cloud platforms.`,
    projects: [
      {
        id: 'fs-proj-1',
        title: 'Full Stack SaaS Subscription & Analytics Hub',
        category: 'Full Stack SaaS',
        difficulty: 'Advanced',
        technologies: ['Next.js 15', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'Tailwind CSS'],
        estimatedTime: '3–4 Weeks',
        resumeValue: 'Crucial',
        description: 'Multi-tenant SaaS boilerplate with role-based access control, Stripe recurring webhooks, and real-time revenue analytics charts.',
        keyDeliverables: ['End-to-end Stripe billing integration', 'Server Actions with optimistic UI updates', 'Prisma migration history'],
        githubArchitecture: 'Clean App Router modular structure with separate server actions, hooks, and database seeders.'
      },
      {
        id: 'fs-proj-2',
        title: 'Real-Time Team Project & Sprint Management Suite',
        category: 'Full Stack Productivity',
        difficulty: 'Intermediate',
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Tailwind CSS'],
        estimatedTime: '3 Weeks',
        resumeValue: 'Very High',
        description: 'Kanban board application with drag-and-drop task reordering, live team cursor presence, and automated sprint velocity burndown charts.',
        keyDeliverables: ['Real-time WebSocket event bus', 'Optimistic UI reordering', 'JWT auth with refresh tokens'],
        githubArchitecture: 'Express REST backend + Vite React frontend with shared TypeScript interfaces.'
      }
    ],
    certifications: [
      {
        id: 'fs-cert-1',
        name: 'Meta Front-End & Back-End Developer Professional Certificate',
        issuer: 'Meta / Coursera',
        difficulty: 'Associate',
        duration: '8–12 Weeks',
        careerImpact: 'Very High',
        officialUrl: 'https://www.coursera.org/professional-certificates/meta-front-end-developer',
        description: 'Industry certificate validating proficiency in React, JavaScript, APIs, database design, and version control.'
      }
    ],
    roadmap: [
      {
        weekRange: 'Week 1–2',
        title: 'Modern TypeScript & React Deep Dive',
        goals: ['Master TypeScript generics, custom hooks, and server components.'],
        milestones: ['Build reusable design system components with Tailwind CSS', 'Implement custom state management with Zustand'],
        keySkills: ['TypeScript', 'React', 'Tailwind CSS']
      },
      {
        weekRange: 'Week 3–4',
        title: 'Next.js 15 App Router & Server Actions',
        goals: ['Master Server Components, parallel routes, and mutation actions with caching control.'],
        milestones: ['Implement server actions with Zod schema validation', 'Configure dynamic metadata for 100% SEO scores'],
        keySkills: ['Next.js', 'Server Actions', 'Zod']
      },
      {
        weekRange: 'Week 5–6',
        title: 'Relational Database Architecture & Prisma ORM',
        goals: ['Design normalized database schemas, write complex migrations, and configure foreign key constraints.'],
        milestones: ['Set up PostgreSQL on Supabase or Neon', 'Build full CRUD operations with Prisma ORM'],
        keySkills: ['PostgreSQL', 'Prisma', 'Database Design']
      },
      {
        weekRange: 'Week 7–8',
        title: 'Secure Authentication & Payment Gateways',
        goals: ['Integrate OAuth 2.0 (Google/GitHub) and recurring billing with Stripe webhooks.'],
        milestones: ['Zero-leakage session handling with JWT/Cookies', 'Process test subscriptions and verify webhook signatures'],
        keySkills: ['OAuth', 'JWT', 'Stripe']
      },
      {
        weekRange: 'Week 9–10',
        title: 'Testing, Performance Optimization & Docker',
        goals: ['Write end-to-end tests with Playwright and containerize frontend and backend.'],
        milestones: ['Reach Lighthouse score > 95 on Performance & Accessibility', 'Containerize app using multi-stage Dockerfile'],
        keySkills: ['Playwright', 'Docker', 'Lighthouse']
      },
      {
        weekRange: 'Week 11–12',
        title: 'Production Deployment & SaaS Launch',
        goals: ['Deploy to Vercel and AWS, configure custom domain with SSL, and launch live demo.'],
        milestones: ['Zero runtime errors in production', 'Live portfolio showcase with responsive preview'],
        keySkills: ['Vercel', 'AWS', 'Production Launch'],
        projectDeliverable: 'Full Stack SaaS Subscription & Analytics Hub'
      }
    ],
    market: {
      role: 'Full Stack Developer',
      hiringDemand: 'Very High',
      averageSalary: '$112,000 / yr',
      salaryRange: '$80,000 – $155,000',
      topHiringCompanies: ['Shopify', 'HubSpot', 'Salesforce', 'Airbnb', 'Netflix', 'Brex'],
      experienceLevel: '1–3 Years',
      remoteOpportunities: '72% Remote / Hybrid',
      growthTrend: '+19% YoY Growth',
      jobOpeningsEstimate: '210,000+ Active Roles'
    }
  },

  'cloud-devops': {
    title: 'Cloud & DevOps Engineer',
    normalizedKey: 'cloud-devops',
    typicalYearsRequired: 2,
    essentialSkills: [
      { name: 'Docker & Containerization', category: 'DevOps', weight: 10 },
      { name: 'Kubernetes (K8s)', category: 'DevOps', weight: 10 },
      { name: 'Terraform (Infrastructure as Code)', category: 'DevOps', weight: 9 },
      { name: 'AWS Cloud Architecture', category: 'Cloud', weight: 9 },
      { name: 'CI/CD Pipelines (GitHub Actions / GitLab)', category: 'DevOps', weight: 9 },
      { name: 'Linux Administration & Bash', category: 'Tools', weight: 9 },
      { name: 'Monitoring (Prometheus & Grafana)', category: 'Tools', weight: 8 },
      { name: 'Python or Go for Tooling', category: 'Programming Languages', weight: 8 },
      { name: 'Networking (VPC, DNS, Subnets, TLS)', category: 'Cloud', weight: 8 },
      { name: 'Security & Secrets Management (Vault)', category: 'Cloud', weight: 7 }
    ],
    recruiterKeywords: [
      'Kubernetes', 'Docker', 'Terraform', 'AWS', 'CI/CD',
      'Prometheus', 'Grafana', 'Linux', 'Helm', 'IaC'
    ],
    sampleJdText: `DevOps & Cloud Engineer to build and maintain high-availability cloud infrastructure.
Responsibilities:
- Provision cloud resources on AWS using Terraform (IaC).
- Manage container workloads on Kubernetes clusters with Helm charts.
- Build automated CI/CD deployment pipelines with zero-downtime rolling updates.
- Monitor cluster telemetry and alert on SLO/SLA violations with Grafana.`,
    projects: [
      {
        id: 'devops-proj-1',
        title: 'GitOps Kubernetes Cluster with ArgoCD & Terraform',
        category: 'Cloud & Infrastructure',
        difficulty: 'Advanced',
        technologies: ['Terraform', 'Kubernetes', 'ArgoCD', 'AWS EKS', 'Helm'],
        estimatedTime: '3–4 Weeks',
        resumeValue: 'Crucial',
        description: 'Complete infrastructure as code provisioning an EKS cluster with GitOps continuous delivery and automatic rollbacks on failed health checks.',
        keyDeliverables: ['Multi-AZ VPC with public/private subnets', 'ArgoCD declarative sync repository', 'Zero downtime deployment verification'],
        githubArchitecture: 'Terraform modules directory + separate K8s manifest GitOps repo with Helm values.'
      },
      {
        id: 'devops-proj-2',
        title: 'Observability & Incident Telemetry Stack',
        category: 'Monitoring & Reliability',
        difficulty: 'Intermediate',
        technologies: ['Prometheus', 'Grafana', 'Loki', 'Docker', 'Alertmanager'],
        estimatedTime: '2–3 Weeks',
        resumeValue: 'Very High',
        description: 'Comprehensive cluster monitoring stack tracking CPU/memory pressure, HTTP error rates, and automated Slack alerting triggers.',
        keyDeliverables: ['PromQL dashboards for 4 Golden Signals', 'Centralized log aggregation with Loki', 'Alertmanager escalation policies'],
        githubArchitecture: 'Docker Compose and Helm templates with pre-configured dashboard JSONs.'
      }
    ],
    certifications: [
      {
        id: 'devops-cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        difficulty: 'Associate',
        duration: '6–8 Weeks',
        careerImpact: 'Essential',
        officialUrl: 'https://aws.amazon.com/certification/',
        description: 'Validates architectural fundamentals, resilient storage, compute tiers, and VPC security.'
      },
      {
        id: 'devops-cert-2',
        name: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'Linux Foundation / CNCF',
        difficulty: 'Professional',
        duration: '8–10 Weeks',
        careerImpact: 'Crucial',
        officialUrl: 'https://www.cncf.io/certification/cka/',
        description: 'Premier credential demonstrating production Kubernetes cluster management, storage, networking, and troubleshooting.'
      }
    ],
    roadmap: [
      {
        weekRange: 'Week 1–2',
        title: 'Linux Internals, Networking & Shell Scripting',
        goals: ['Master systemd, process signals, IP routing, iptables, and automated bash scripting.'],
        milestones: ['Automate system configuration using shell script', 'Configure secure SSH keys and firewall rules'],
        keySkills: ['Linux', 'Bash', 'Networking']
      },
      {
        weekRange: 'Week 3–4',
        title: 'Production Docker Containerization',
        goals: ['Build minimal, secure container images with non-root users and vulnerability scanning.'],
        milestones: ['Multi-stage Docker builds with alpine/distroless base images', 'Scan images with Trivy for zero CVEs'],
        keySkills: ['Docker', 'Containers', 'Security']
      },
      {
        weekRange: 'Week 5–6',
        title: 'Kubernetes Architecture & Helm Orchestration',
        goals: ['Deploy pods, services, ingress controllers, config maps, and secrets on Kubernetes.'],
        milestones: ['Deploy multi-tier application with StatefulSet and PersistentVolume', 'Package application with Helm chart'],
        keySkills: ['Kubernetes', 'Helm', 'Ingress']
      },
      {
        weekRange: 'Week 7–8',
        title: 'Infrastructure as Code (Terraform) on AWS',
        goals: ['Provision VPC, EC2, S3, RDS, and IAM roles declaratively using Terraform.'],
        milestones: ['Terraform remote state locking with S3 and DynamoDB', 'Write reusable Terraform modules with output variables'],
        keySkills: ['Terraform', 'AWS', 'IaC']
      },
      {
        weekRange: 'Week 9–10',
        title: 'CI/CD Pipelines & GitOps Automation',
        goals: ['Build end-to-end GitHub Actions pipelines with linting, testing, image push, and GitOps sync.'],
        milestones: ['Set up ArgoCD for automated declarative K8s deployments', 'Implement blue-green / canary release strategies'],
        keySkills: ['CI/CD', 'GitOps', 'ArgoCD']
      },
      {
        weekRange: 'Week 11–12',
        title: 'Telemetry, Incident Response & SRE Best Practices',
        goals: ['Set up Prometheus metrics, Grafana visualization, and SLO tracking for 99.9% uptime.'],
        milestones: ['Configure Alertmanager to trigger automated Slack incident alerts', 'Run chaos testing drill with simulated pod kill'],
        keySkills: ['Prometheus', 'Grafana', 'SRE'],
        projectDeliverable: 'GitOps Kubernetes Cluster with ArgoCD & Terraform'
      }
    ],
    market: {
      role: 'Cloud & DevOps Engineer',
      hiringDemand: 'Very High',
      averageSalary: '$126,000 / yr',
      salaryRange: '$92,000 – $175,000',
      topHiringCompanies: ['Red Hat', 'AWS', 'Microsoft', 'Cisco', 'Cloudflare', 'Oracle'],
      experienceLevel: '1–4 Years',
      remoteOpportunities: '80% Remote / Hybrid',
      growthTrend: '+24% YoY Growth',
      jobOpeningsEstimate: '115,000+ Active Roles'
    }
  },

  'data-scientist': {
    title: 'Data Scientist & Machine Learning',
    normalizedKey: 'data-scientist',
    typicalYearsRequired: 2,
    essentialSkills: [
      { name: 'Python', category: 'Programming Languages', weight: 10 },
      { name: 'SQL & Query Optimization', category: 'Databases', weight: 10 },
      { name: 'Pandas & NumPy', category: 'Machine Learning', weight: 9 },
      { name: 'Scikit-Learn', category: 'Machine Learning', weight: 9 },
      { name: 'Exploratory Data Analysis (EDA)', category: 'Machine Learning', weight: 9 },
      { name: 'Statistical Modeling & Hypothesis Testing', category: 'Machine Learning', weight: 8 },
      { name: 'Data Visualization (Seaborn/Plotly)', category: 'Tools', weight: 8 },
      { name: 'Feature Engineering', category: 'Machine Learning', weight: 8 },
      { name: 'Deep Learning (PyTorch/TensorFlow)', category: 'Machine Learning', weight: 7 },
      { name: 'Model Deployment (FastAPI/Streamlit)', category: 'Backend', weight: 7 }
    ],
    recruiterKeywords: [
      'Python', 'SQL', 'Machine Learning', 'Pandas', 'Scikit-Learn',
      'Statistics', 'PyTorch', 'EDA', 'Feature Engineering', 'Data Modeling'
    ],
    sampleJdText: `Data Scientist to extract predictive insights and build production machine learning models.
Responsibilities:
- Query large-scale transactional datasets with advanced SQL and perform EDA.
- Build supervised and unsupervised ML models (Random Forests, XGBoost, Neural Nets).
- Design A/B testing experiments and validate statistical hypothesis significance.
- Deploy real-time inference APIs and report findings to business leaders.`,
    projects: [
      {
        id: 'ds-proj-1',
        title: 'Customer Churn Prediction & Survival Analysis Platform',
        category: 'Machine Learning & Analytics',
        difficulty: 'Intermediate',
        technologies: ['Python', 'XGBoost', 'Scikit-Learn', 'SHAP', 'Streamlit'],
        estimatedTime: '3 Weeks',
        resumeValue: 'Very High',
        description: 'End-to-end predictive churn pipeline with SMOTE class balancing, SHAP feature explainability, and interactive risk dashboard.',
        keyDeliverables: ['ROC-AUC score > 0.89', 'SHAP waterfall plots explaining individual customer risk', 'Streamlit web interface'],
        githubArchitecture: 'Modular ETL notebook + packaged inference script with feature transformer.'
      },
      {
        id: 'ds-proj-2',
        title: 'Financial Fraud Detection Engine with Anomaly Detection',
        category: 'Deep Learning & Anomaly Detection',
        difficulty: 'Advanced',
        technologies: ['Python', 'PyTorch', 'Isolation Forest', 'FastAPI', 'PostgreSQL'],
        estimatedTime: '3–4 Weeks',
        resumeValue: 'Crucial',
        description: 'Real-time transaction fraud scorer handling highly imbalanced data (0.17% fraud rate) with sub-20ms inference latency.',
        keyDeliverables: ['Precision-Recall AUC optimization', 'FastAPI microservice handling 1,000 req/sec', 'Drift detection monitor'],
        githubArchitecture: 'Data preprocessing pipeline + PyTorch neural network + FastAPI inference endpoint.'
      }
    ],
    certifications: [
      {
        id: 'ds-cert-1',
        name: 'IBM Data Science Professional Certificate',
        issuer: 'IBM / Coursera',
        difficulty: 'Associate',
        duration: '8–10 Weeks',
        careerImpact: 'Very High',
        officialUrl: 'https://www.coursera.org/professional-certificates/ibm-data-science',
        description: 'Comprehensive certification in Python, SQL, data visualization, predictive modeling, and applied machine learning.'
      }
    ],
    roadmap: [
      {
        weekRange: 'Week 1–2',
        title: 'Advanced SQL & Data Manipulation with Pandas',
        goals: ['Master window functions, CTEs, self joins, and advanced Pandas aggregation methods.'],
        milestones: ['Solve 30 complex LeetCode SQL problems', 'Perform EDA on 1M+ row dataset with zero memory crashes'],
        keySkills: ['SQL', 'Pandas', 'NumPy']
      },
      {
        weekRange: 'Week 3–4',
        title: 'Applied Statistics, Probability & A/B Testing',
        goals: ['Master p-values, confidence intervals, sample size determination, and ANOVA tests.'],
        milestones: ['Design end-to-end A/B test simulation script', 'Calculate statistical power and minimum detectable effect'],
        keySkills: ['Statistics', 'Hypothesis Testing', 'A/B Testing']
      },
      {
        weekRange: 'Week 5–6',
        title: 'Supervised Learning (Regression & Classification)',
        goals: ['Train linear models, decision trees, Random Forests, and Gradient Boosting (XGBoost/LightGBM).'],
        milestones: ['Tune hyperparameters with Bayesian optimization (Optuna)', 'Address class imbalance with SMOTE and precision-recall curves'],
        keySkills: ['Scikit-Learn', 'XGBoost', 'Classification']
      },
      {
        weekRange: 'Week 7–8',
        title: 'Unsupervised Learning & Model Explainability',
        goals: ['Master K-Means clustering, PCA dimensionality reduction, and SHAP/LIME interpretability.'],
        milestones: ['Generate customer segmentation clusters', 'Produce SHAP global summary and local waterfall plots'],
        keySkills: ['Clustering', 'PCA', 'SHAP']
      },
      {
        weekRange: 'Week 9–10',
        title: 'Deep Learning Foundations with PyTorch',
        goals: ['Build multi-layer perceptrons (MLP), loss functions, and backpropagation loops in PyTorch.'],
        milestones: ['Train binary classification neural network on tabular data', 'Implement early stopping and learning rate scheduler'],
        keySkills: ['PyTorch', 'Deep Learning', 'Neural Networks']
      },
      {
        weekRange: 'Week 11–12',
        title: 'Production Model Serving & Portfolio Dashboard',
        goals: ['Deploy model as a FastAPI endpoint or interactive Streamlit web dashboard.'],
        milestones: ['Host live predictive demo on cloud platform', 'Document data pipeline methodology with markdown reports'],
        keySkills: ['FastAPI', 'Streamlit', 'Model Deployment'],
        projectDeliverable: 'Customer Churn Prediction & Survival Analysis Platform'
      }
    ],
    market: {
      role: 'Data Scientist',
      hiringDemand: 'High',
      averageSalary: '$124,000 / yr',
      salaryRange: '$90,000 – $168,000',
      topHiringCompanies: ['Meta', 'Amazon', 'Spotify', 'Uber', 'JPMorgan Chase', 'Pfizer'],
      experienceLevel: '1–4 Years',
      remoteOpportunities: '68% Remote / Hybrid',
      growthTrend: '+21% YoY Growth',
      jobOpeningsEstimate: '98,000+ Active Roles'
    }
  }
}

/**
 * Helper to fetch a profile by role title or fallback to intelligent dynamic generation
 */
export function getRoleKnowledgeProfile(roleName: string): RoleKnowledgeProfile {
  const normalized = (roleName || 'Software Engineer')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  if (ROLE_KNOWLEDGE_BASE[normalized]) {
    return ROLE_KNOWLEDGE_BASE[normalized]
  }

  // Check partial key matches
  for (const [key, profile] of Object.entries(ROLE_KNOWLEDGE_BASE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return profile
    }
  }

  // Dynamic fallback for any arbitrary role from the 200+ master library
  const cleanTitle = roleName || 'Software Engineer'
  return {
    title: cleanTitle,
    normalizedKey: normalized,
    typicalYearsRequired: 2,
    essentialSkills: [
      { name: `${cleanTitle} Architecture`, category: 'Backend', weight: 9 },
      { name: 'Core Programming & Data Structures', category: 'Programming Languages', weight: 9 },
      { name: 'REST APIs & Integration', category: 'Backend', weight: 8 },
      { name: 'Modern Frameworks', category: 'Frameworks', weight: 8 },
      { name: 'Database Management & SQL', category: 'Databases', weight: 8 },
      { name: 'Git & Agile Team Collaboration', category: 'Tools', weight: 8 },
      { name: 'Cloud Infrastructure & Deployments', category: 'Cloud', weight: 7 },
      { name: 'Automated Testing & Code Quality', category: 'Tools', weight: 7 },
      { name: 'Analytical Problem Solving', category: 'Soft Skills', weight: 8 }
    ],
    recruiterKeywords: [
      cleanTitle, 'Architecture', 'Agile', 'SQL', 'Git', 'APIs', 'Cloud', 'Testing', 'Scalability'
    ],
    sampleJdText: `Position: ${cleanTitle}
Overview:
We are seeking a talented ${cleanTitle} to contribute to our engineering and product solutions.
Responsibilities:
- Build and optimize scalable systems aligned with ${cleanTitle} industry best practices.
- Collaborate with engineering leads, product managers, and QA teams to deliver robust features.
- Participate in agile sprint planning, technical design reviews, and automated testing.
Requirements:
- Relevant technical background in computer science or related discipline.
- Hands-on proficiency in core tools and frameworks relevant to a ${cleanTitle}.
- Proven track record with version control, automated testing, and scalable solutions.`,
    projects: [
      {
        id: 'dyn-proj-1',
        title: `Enterprise ${cleanTitle} Core Platform`,
        category: 'Full Stack & Architecture',
        difficulty: 'Advanced',
        technologies: ['TypeScript', 'Python', 'Docker', 'PostgreSQL', 'Tailwind CSS'],
        estimatedTime: '3–4 Weeks',
        resumeValue: 'Crucial',
        description: `Production-ready application demonstrating end-to-end design patterns, automated testing, and scalable workflows tailored for a ${cleanTitle}.`,
        keyDeliverables: ['High availability architecture', 'Automated CI/CD test suite with >80% coverage', 'Interactive responsive interface'],
        githubArchitecture: 'Clean architecture separating core domain logic from adapters and external APIs.'
      },
      {
        id: 'dyn-proj-2',
        title: `Automated Telemetry & Workflow Automation Tool for ${cleanTitle}`,
        category: 'Automation & Productivity',
        difficulty: 'Intermediate',
        technologies: ['Python', 'FastAPI', 'Redis', 'Docker'],
        estimatedTime: '2–3 Weeks',
        resumeValue: 'Very High',
        description: 'Event-driven tool automating repetitive engineering pipelines, reducing manual overhead, and logging audit events.',
        keyDeliverables: ['Async worker queue with retry logic', 'RESTful API with OpenAPI docs', 'Dockerized deployment'],
        githubArchitecture: 'Modular service structure with asynchronous event handlers.'
      }
    ],
    certifications: [
      {
        id: 'dyn-cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        difficulty: 'Associate',
        duration: '6–8 Weeks',
        careerImpact: 'Essential',
        officialUrl: 'https://aws.amazon.com/certification/',
        description: 'Industry benchmark certification validating cloud architecture, security, and scalable distributed systems.'
      },
      {
        id: 'dyn-cert-2',
        name: `${cleanTitle} Professional Foundation Certificate`,
        issuer: 'Industry Standard Institute',
        difficulty: 'Professional',
        duration: '6 Weeks',
        careerImpact: 'Very High',
        description: `Proves practical competence in key workflows, modern design patterns, and engineering excellence for a ${cleanTitle}.`
      }
    ],
    roadmap: [
      {
        weekRange: 'Week 1–2',
        title: 'Core Fundamentals & Algorithmic Foundations',
        goals: [`Review fundamental principles, data modeling, and tooling required for ${cleanTitle}.`],
        milestones: ['Complete foundational coding exercises', 'Set up modern development environment and Git repository'],
        keySkills: ['Programming', 'Data Structures', 'Git']
      },
      {
        weekRange: 'Week 3–4',
        title: 'Modular Architecture & Relational Databases',
        goals: ['Build structured services with clean separation of concerns and normalized database schemas.'],
        milestones: ['Implement production database schema', 'Write clean API contracts with error handling'],
        keySkills: ['Architecture', 'SQL', 'Databases']
      },
      {
        weekRange: 'Week 5–6',
        title: 'Integration, Caching & Performance Tuning',
        goals: ['Optimize latencies, introduce caching layers, and handle edge case errors gracefully.'],
        milestones: ['Benchmark response times and reduce bottlenecks', 'Introduce automated unit tests'],
        keySkills: ['Performance', 'Caching', 'Testing']
      },
      {
        weekRange: 'Week 7–8',
        title: 'Containerization & Cloud Infrastructure',
        goals: ['Package the project inside Docker containers and configure cloud deployment pipelines.'],
        milestones: ['Multi-stage container deployment', 'Configure automated CI/CD pipeline on GitHub Actions'],
        keySkills: ['Docker', 'Cloud', 'CI/CD']
      },
      {
        weekRange: 'Week 9–10',
        title: 'Advanced System Design & Resilience',
        goals: ['Incorporate logging, authentication, and architectural resiliency best practices.'],
        milestones: ['Implement secure access control', 'Set up automated health checks and alerts'],
        keySkills: ['Security', 'System Design', 'Monitoring']
      },
      {
        weekRange: 'Week 11–12',
        title: 'Capstone Polish, Documentation & Portfolio Launch',
        goals: ['Finalize the core capstone project, write a recruiter-ready technical README, and launch.'],
        milestones: ['Publish project with live URL and clear documentation', 'Conduct mock technical interview practice'],
        keySkills: ['Portfolio', 'Technical Communication', 'Interview Readiness'],
        projectDeliverable: `Enterprise ${cleanTitle} Core Platform`
      }
    ],
    market: {
      role: cleanTitle,
      hiringDemand: 'High',
      averageSalary: '$108,000 / yr',
      salaryRange: '$75,000 – $150,000',
      topHiringCompanies: ['Tech Giants', 'Enterprise SaaS Leaders', 'High-Growth Startups'],
      experienceLevel: '1–3 Years',
      remoteOpportunities: '65% Remote / Hybrid',
      growthTrend: '+16% YoY Growth',
      jobOpeningsEstimate: '85,000+ Active Roles'
    }
  }
}
