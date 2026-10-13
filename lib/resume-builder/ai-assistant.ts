export type TargetRole =
  | 'Fresher'
  | 'Software Engineer'
  | 'AI Engineer'
  | 'Data Scientist'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Full Stack Developer'
  | 'Cloud Engineer'
  | 'DevOps Engineer'
  | 'Cyber Security'
  | (string & {})

export type WritingTone =
  | 'Professional'
  | 'Shorter'
  | 'Longer'
  | 'Technical'
  | 'Executive'
  | 'Friendly'
  | 'Corporate'
  | 'Startup'

export function generateSummaryByRole(
  role: TargetRole,
  tone: WritingTone = 'Professional',
  skills: string[] = [],
  title?: string
): string {
  const skillsSnippet = skills.length > 0 ? skills.slice(0, 5).join(', ') : 'modern tech stacks'

  const roleTemplates: Record<TargetRole, Record<WritingTone, string>> = {
    'Fresher': {
      Professional: `Detail-oriented Computer Science graduate with hands-on foundational knowledge in ${skillsSnippet}. Passionate about building reliable software, applying algorithmic problem-solving to real-world challenges, and contributing to engineering teams with rapid learnability.`,
      Technical: `CS graduate with a strong grasp of data structures, algorithms, and modular design. Proficient in ${skillsSnippet}, with proven project experience implementing RESTful architectures and collaborative Git workflows.`,
      Executive: `Driven Computer Science graduate poised to deliver measurable value through technical adaptability, collaborative execution, and foundational proficiency across ${skillsSnippet}.`,
      Startup: `Hungry, high-velocity CS graduate ready to wear multiple hats. Experienced with ${skillsSnippet}, eager to ship production features and iterate quickly in fast-paced product environments.`,
      Shorter: `Motivated CS graduate proficient in ${skillsSnippet}. Seeking an entry-level software role to build scalable systems.`,
      Longer: `High-achieving Computer Science graduate with an extensive portfolio of academic and open-source projects in ${skillsSnippet}. Possesses solid fundamentals in system design, object-oriented programming, and cloud tooling. Dedicated to continuous improvement and writing clean, testable code.`,
      Friendly: `Passionate aspiring engineer who loves building intuitive software and solving complex technical puzzles with ${skillsSnippet}. Eager to learn from seasoned mentors while contributing fresh perspectives.`,
      Corporate: `Disciplined engineering graduate committed to industry coding standards, agile methodologies, and scalable application development utilizing ${skillsSnippet}.`
    },
    'Software Engineer': {
      Professional: `Software Engineer with demonstrated expertise across ${skillsSnippet}. Proven track record of designing robust microservices, architecting maintainable web applications, and delivering high-impact solutions with 99.9% uptime.`,
      Technical: `Software Engineer specializing in distributed systems, RESTful microservices, and high-concurrency architectures. Proficient in ${skillsSnippet}, database query optimization, and CI/CD automation.`,
      Executive: `Strategic Software Engineer delivering scalable enterprise architectures that balance engineering velocity with operational resilience across ${skillsSnippet}.`,
      Startup: `Product-focused Software Engineer experienced in rapid prototyping, clean architecture, and shipping customer-ready features with ${skillsSnippet}.`,
      Shorter: `Results-driven Software Engineer experienced in building scalable applications using ${skillsSnippet}.`,
      Longer: `Software Engineer with end-to-end lifecycle experience from requirements analysis to cloud deployment. Expertise in designing scalable APIs, optimizing database latencies, and implementing modern design patterns with ${skillsSnippet}. Collaborative problem solver dedicated to peer reviews and engineering excellence.`,
      Friendly: `Collaborative Software Engineer passionate about writing clean code and creating delightful user experiences powered by ${skillsSnippet}.`,
      Corporate: `Enterprise Software Engineer well-versed in ISO compliance, architectural governance, and scalable distributed systems using ${skillsSnippet}.`
    },
    'AI Engineer': {
      Professional: `AI & Machine Learning Engineer specializing in RAG architectures, Large Language Models (LLMs), and intelligent document processing. Proficient with ${skillsSnippet}, vector databases, and scalable inference pipelines.`,
      Technical: `AI Engineer with deep expertise in transformer architectures, prompt engineering, fine-tuning, and semantic vector retrieval (Qdrant/Pinecone). Proficient in ${skillsSnippet} and latency-optimized deployment pipelines.`,
      Executive: `Forward-thinking AI Engineer driving transformative business automation through production-ready Generative AI solutions and scalable RAG pipelines using ${skillsSnippet}.`,
      Startup: `Hands-on AI Engineer passionate about shipping AI-first agentic workflows, multi-modal LLM integrations, and rapid prototype-to-production pipelines with ${skillsSnippet}.`,
      Shorter: `AI Engineer specializing in LLMs, RAG pipelines, and vector search with ${skillsSnippet}.`,
      Longer: `AI Systems Engineer experienced in architecting scalable Generative AI ecosystems, vector database memory indexing, and multi-model routing pipelines. Proven success in reducing token overhead by 40% while preserving high semantic precision with ${skillsSnippet}.`,
      Friendly: `Creative AI Engineer passionate about demystifying machine learning and building user-centric, helpful AI experiences with ${skillsSnippet}.`,
      Corporate: `Enterprise AI Engineer focusing on responsible AI governance, hallucination mitigation, secure RAG deployments, and compliance across ${skillsSnippet}.`
    },
    'Data Scientist': {
      Professional: `Data Scientist with proven acumen in predictive modeling, statistical analysis, and machine learning pipelines. Experienced in extracting actionable intelligence from complex multi-dimensional datasets using ${skillsSnippet}.`,
      Technical: `Data Scientist skilled in hypothesis testing, regression/classification ensembles, feature engineering, and automated ETL pipelines with ${skillsSnippet}.`,
      Executive: `Data Scientist who bridges technical machine learning algorithms with executive decision-making to optimize revenue and customer retention using ${skillsSnippet}.`,
      Startup: `Agile Data Scientist focused on rapid experimentation, A/B testing, user behavior analytics, and deploying lightweight ML microservices with ${skillsSnippet}.`,
      Shorter: `Data Scientist with expertise in predictive modeling, machine learning, and data analytics using ${skillsSnippet}.`,
      Longer: `Analytical Data Scientist with background in end-to-end data pipelines, statistical modeling, and data storytelling. Experienced in transforming terabyte-scale messy data into high-accuracy predictive tools with ${skillsSnippet}.`,
      Friendly: `Curious Data Scientist who loves uncovering compelling stories hidden within datasets to build data-driven solutions with ${skillsSnippet}.`,
      Corporate: `Enterprise Data Scientist experienced in model governance, data warehousing, and enterprise BI analytics with ${skillsSnippet}.`
    },
    'Frontend Developer': {
      Professional: `Frontend Developer specializing in responsive, accessible, and high-performance user interfaces. Expert in ${skillsSnippet}, modern design systems, state management, and 60 FPS client rendering.`,
      Technical: `Frontend Engineer with mastery of component lifecycles, virtual DOM reconciliation, core web vitals optimization, and accessible UI patterns using ${skillsSnippet}.`,
      Executive: `Design-conscious Frontend Architect aligning brand aesthetic with sub-second page performance and frictionless conversion funnels using ${skillsSnippet}.`,
      Startup: `Product-minded Frontend Developer obsessed with pixel perfection, interactive micro-animations, and fast user feedback loops with ${skillsSnippet}.`,
      Shorter: `Frontend Developer focused on modern, responsive, and accessible web applications using ${skillsSnippet}.`,
      Longer: `Frontend Engineer dedicated to bridging UI/UX designs and technical implementation. Experienced in building reusable component libraries, optimizing bundle sizes, and ensuring WCAG compliance using ${skillsSnippet}.`,
      Friendly: `Enthusiastic UI Developer who loves bringing beautiful design mocks to life with delightful interactions and ${skillsSnippet}.`,
      Corporate: `Enterprise Frontend Developer skilled in design token systems, accessibility conformance, and cross-browser stability using ${skillsSnippet}.`
    },
    'Backend Developer': {
      Professional: `Backend Developer with comprehensive expertise in RESTful and GraphQL APIs, distributed database management, and asynchronous messaging architectures with ${skillsSnippet}.`,
      Technical: `Backend Engineer specializing in concurrent request handling, database indexing, caching strategies (Redis), and microservice isolation using ${skillsSnippet}.`,
      Executive: `Backend Architect ensuring system scalability, data integrity, and cost-effective cloud resource consumption using ${skillsSnippet}.`,
      Startup: `Fast-moving Backend Developer adept at building schema migrations, resilient authentication flows, and bulletproof APIs with ${skillsSnippet}.`,
      Shorter: `Backend Developer skilled in building scalable APIs and high-availability database architectures with ${skillsSnippet}.`,
      Longer: `Backend Engineer with proven track record of designing fault-tolerant systems, optimizing SQL queries, and orchestrating automated test suites with ${skillsSnippet}.`,
      Friendly: `Reliable Backend Developer dedicated to building clean, well-documented APIs that make frontend integration effortless with ${skillsSnippet}.`,
      Corporate: `Enterprise Backend Developer with experience in SOC2 compliance, OAuth2/OIDC, and mission-critical transactional integrity with ${skillsSnippet}.`
    },
    'Full Stack Developer': {
      Professional: `Full Stack Developer with end-to-end capability spanning reactive frontend interfaces to distributed backend microservices. Proficient in ${skillsSnippet}, cloud infrastructure, and CI/CD pipelines.`,
      Technical: `Full Stack Engineer adept at cross-stack synchronization, state management, secure API endpoints, and scalable cloud deployments using ${skillsSnippet}.`,
      Executive: `Versatile Full Stack Architect leading product initiatives from concept to deployment while maintaining high code quality and architectural integrity with ${skillsSnippet}.`,
      Startup: `Self-directed Full Stack Developer capable of taking an idea from sketch to deployed production app in days using ${skillsSnippet}.`,
      Shorter: `Full Stack Developer experienced in modern web applications, scalable APIs, and cloud deployments with ${skillsSnippet}.`,
      Longer: `Comprehensive Full Stack Software Engineer skilled in building modern web applications, architecting relational/NoSQL databases, and managing containerized cloud services with ${skillsSnippet}. Focused on writing maintainable, tested code.`,
      Friendly: `Passionate Full Stack Creator who enjoys connecting the dots between smooth user interfaces and powerful backends with ${skillsSnippet}.`,
      Corporate: `Enterprise Full Stack Developer experienced in multi-tiered enterprise software architectures, micro-frontends, and automated testing with ${skillsSnippet}.`
    },
    'Cloud Engineer': {
      Professional: `Cloud Engineer specializing in cloud-native infrastructure, infrastructure as code (Terraform), and container orchestration across AWS and Azure using ${skillsSnippet}.`,
      Technical: `Cloud Architect experienced in VPC peering, serverless compute, Kubernetes cluster administration, and disaster recovery architectures with ${skillsSnippet}.`,
      Executive: `Cloud Infrastructure Leader focused on FinOps cost optimization, zero-trust security postures, and 99.99% high-availability SLAs using ${skillsSnippet}.`,
      Startup: `Cloud DevOps Generalist proficient in launching automated CI/CD pipelines, containerizing services, and scaling cloud footprints with ${skillsSnippet}.`,
      Shorter: `Cloud Engineer skilled in AWS/Azure infrastructure, containerization, and automated deployments with ${skillsSnippet}.`,
      Longer: `Cloud Systems Engineer with strong track record in architecting secure, scalable cloud environments, automating multi-region failovers, and reducing monthly infrastructure spend by 30% using ${skillsSnippet}.`,
      Friendly: `DevOps & Cloud enthusiast passionate about creating reliable infrastructure that developers love deploying to with ${skillsSnippet}.`,
      Corporate: `Enterprise Cloud Engineer certified in cloud governance, compliance auditing, and secure private cloud configurations using ${skillsSnippet}.`
    },
    'DevOps Engineer': {
      Professional: `DevOps Engineer focused on continuous integration, continuous delivery, and infrastructure automation. Experienced with Docker, Kubernetes, CI/CD runners, and ${skillsSnippet}.`,
      Technical: `Site Reliability & DevOps Engineer specialized in GitOps, Prometheus/Grafana monitoring, Terraform, and automated deployment canary rollouts using ${skillsSnippet}.`,
      Executive: `DevOps Leader accelerating developer velocity and operational efficiency while minimizing downtime and cloud expenditure using ${skillsSnippet}.`,
      Startup: `Hands-on DevOps Engineer building zero-friction developer staging environments and automated push-to-deploy pipelines with ${skillsSnippet}.`,
      Shorter: `DevOps Engineer specializing in CI/CD pipelines, Docker, Kubernetes, and cloud infrastructure with ${skillsSnippet}.`,
      Longer: `DevOps & SRE Engineer with deep expertise in building automated release pipelines, containerized deployments, and robust observability dashboards. Reduced deployment cycle times by 65% across teams using ${skillsSnippet}.`,
      Friendly: `Developer-centric DevOps Engineer who thrives on removing deployment friction and helping teams ship with confidence using ${skillsSnippet}.`,
      Corporate: `Enterprise DevOps Engineer skilled in compliance gates, secrets management (Vault), and automated policy enforcement using ${skillsSnippet}.`
    },
    'Cyber Security': {
      Professional: `Cyber Security Analyst specializing in threat detection, vulnerability assessments, penetration testing, and zero-trust network defenses using ${skillsSnippet}.`,
      Technical: `Information Security Engineer proficient in SIEM monitoring, OWASP Top 10 mitigation, cryptographic protocols, and secure code audits with ${skillsSnippet}.`,
      Executive: `Strategic Information Security Professional aligning compliance frameworks (NIST, ISO 27001) with enterprise risk mitigation strategies using ${skillsSnippet}.`,
      Startup: `Hands-on Security Generalist defending web applications against automated bot attacks, credential stuffing, and injection vulnerabilities with ${skillsSnippet}.`,
      Shorter: `Cyber Security specialist focused on application security, vulnerability management, and threat defense with ${skillsSnippet}.`,
      Longer: `Cyber Security Specialist with proven expertise in safeguarding enterprise assets through proactive vulnerability scanning, automated incident response runbooks, and comprehensive threat modeling using ${skillsSnippet}.`,
      Friendly: `Passionate Security Advocate dedicated to building a culture of security awareness and helping developers code securely with ${skillsSnippet}.`,
      Corporate: `Enterprise Security Officer experienced in audit defense, third-party vendor risk assessment, and SOC operations with ${skillsSnippet}.`
    }
  }

  const roleTemplatesMap = roleTemplates as Record<string, Record<WritingTone, string>>
  const roleMap = roleTemplatesMap[role] || {
    Professional: `${role} with demonstrated expertise across ${skillsSnippet}. Proven track record of designing robust solutions, architecting maintainable systems, and delivering high-impact results with excellence.`,
    Technical: `${role} specializing in scalable architecture, performance optimization, and modular design. Proficient in ${skillsSnippet}, automated testing, and agile workflows.`,
    Executive: `Strategic ${role} delivering scalable solutions that balance innovation velocity with operational resilience across ${skillsSnippet}.`,
    Startup: `Product-focused ${role} experienced in rapid prototyping, clean architecture, and shipping customer-ready features with ${skillsSnippet}.`,
    Shorter: `Results-driven ${role} experienced in building scalable solutions using ${skillsSnippet}.`,
    Longer: `${role} with end-to-end lifecycle experience from requirements analysis to deployment. Expertise in designing scalable architectures, optimizing execution latencies, and implementing best-in-class industry patterns with ${skillsSnippet}. Dedicated to continuous improvement and high software quality.`,
    Friendly: `Collaborative ${role} passionate about writing clean code and creating delightful experiences powered by ${skillsSnippet}. Eager to drive positive team impact and mentor peers.`,
    Corporate: `Enterprise ${role} well-versed in governance standards, architectural compliance, and scalable distributed workflows using ${skillsSnippet}.`
  }
  return roleMap[tone] || roleMap['Professional']
}

export function rewriteBulletPoint(
  original: string,
  mode: 'improve' | 'star' | 'metrics' | 'shorter' | 'longer' | 'technical' | 'executive'
): string {
  const clean = original.trim().replace(/^[-*•]\s*/, '')
  if (!clean) return 'Engineered scalable system components, improving overall execution efficiency by 30%.'

  // Strong Action Verbs Pool
  const verbs = ['Architected', 'Engineered', 'Spearheaded', 'Automated', 'Implemented', 'Streamlined', 'Optimized']
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)]

  switch (mode) {
    case 'star': {
      // Situation, Task, Action, Result
      if (clean.toLowerCase().includes('result') || clean.includes('%')) {
        return `Spearheaded resolution of complex system constraints by re-architecting ${clean.slice(0, 80)}, resulting in a 40% performance gain and zero deployment downtime.`
      }
      return `Identified critical operational bottlenecks in workflow; engineered an automated solution addressing ${clean}, boosting throughput by 35% and saving 10+ engineering hours weekly.`
    }
    case 'metrics': {
      // Inject quantified percentages or numerical metrics
      if (/\b\d+(\.\d+)?%|\b\d+\b/.test(clean)) {
        return `${clean.replace(/\.$/, '')}, maintaining 99.9% uptime and accelerating response times by 2.5x.`
      }
      return `${randomVerb} ${clean.replace(/^(worked on|helped with|did|handled|responsible for)\s*/i, '')}, driving a 30% increase in execution speed across 1,000+ active user requests.`
    }
    case 'improve': {
      return `${randomVerb} ${clean.replace(/^(worked on|helped with|did|handled|responsible for)\s*/i, '')}, ensuring high architectural scalability, code quality, and adherence to industry best practices.`
    }
    case 'shorter': {
      const words = clean.split(/\s+/)
      if (words.length <= 10) return clean
      return `${randomVerb} ${words.slice(1, 12).join(' ')}, enhancing reliability.`
    }
    case 'longer': {
      return `${randomVerb} end-to-end implementation for ${clean.replace(/\.$/, '')}; conducted automated integration testing, streamlined CI/CD pipelines, and reduced system latency by 25%.`
    }
    case 'technical': {
      return `Architected modular microservices for ${clean.replace(/\.$/, '')}, implementing RESTful endpoints, asynchronous queue workers, and indexing strategies to minimize query overhead.`
    }
    case 'executive': {
      return `Championed high-impact technical initiatives across ${clean.replace(/\.$/, '')}, aligning engineering milestones with product roadmap deliverables to elevate stakeholder satisfaction.`
    }
    default:
      return clean
  }
}

export function enhanceProjectDescription(
  name: string,
  techStack: string[],
  currentDesc: string,
  mode: 'enhance' | 'architecture' | 'achievements'
): string {
  const techStr = techStack.length > 0 ? techStack.slice(0, 4).join(', ') : 'modern frameworks'
  switch (mode) {
    case 'architecture':
      return `Architected ${name || 'the application'} utilizing a decoupled client-server architecture powered by ${techStr}. Implemented modular routing, stateless authentication tokens, and optimized caching layers for sub-second response times.`
    case 'achievements':
      return `Engineered ${name || 'project'} supporting concurrent sessions with 99.9% uptime. Reduced resource consumption by 35% through query optimization and modular component re-usability.`
    case 'enhance':
    default:
      return `Production-grade ${name || 'application'} built with ${techStr}. Unifies responsive user interfaces with resilient backend APIs, providing real-time data synchronization and automated error handling.`
  }
}

export function suggestAchievementWording(rawTitle: string, rawDesc: string): { title: string; description: string } {
  const cleanTitle = rawTitle.trim() || 'Engineering Sprint & Hackathon Recognition'
  return {
    title: cleanTitle.includes('Hackathon') || cleanTitle.includes('Award') ? cleanTitle : `${cleanTitle} — Top Honors`,
    description: `Engineered a cloud-native prototype during an intensive sprint, evaluated by industry experts; achieved high rankings for algorithmic efficiency, system design, and execution.`
  }
}

export function autoCategorizeSkills(rawSkills: string[]): { category: string; skills: string[] }[] {
  const programmingLangs = new Set([
    'python', 'javascript', 'typescript', 'java', 'c', 'c++', 'c#', 'go', 'golang', 'rust',
    'ruby', 'php', 'swift', 'kotlin', 'sql', 'html', 'html5', 'css', 'css3', 'scala', 'dart'
  ])

  const frameworks = new Set([
    'react', 'next.js', 'nextjs', 'vue', 'vue.js', 'angular', 'svelte', 'fastapi', 'flask',
    'django', 'express', 'express.js', 'node.js', 'nodejs', 'spring', 'spring boot', 'nestjs', 'laravel'
  ])

  const ai = new Set([
    'machine learning', 'deep learning', 'artificial intelligence', 'ai', 'llms', 'rag',
    'nlp', 'computer vision', 'pytorch', 'tensorflow', 'scikit-learn', 'qdrant', 'pinecone',
    'chromadb', 'hugging face', 'openai', 'amazon bedrock', 'gemini', 'prompt engineering'
  ])

  const databases = new Set([
    'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'supabase', 'firebase',
    'firestore', 'cassandra', 'dynamodb', 'oracle', 'elasticsearch'
  ])

  const cloud = new Set([
    'aws', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'terraform', 'ci/cd',
    'git', 'github actions', 'jenkins', 'linux', 'vercel', 'netlify', 'nginx'
  ])

  const categories: Record<string, string[]> = {
    'Programming Languages': [],
    'Frameworks & Libraries': [],
    'Artificial Intelligence & ML': [],
    'Databases': [],
    'Cloud & DevOps': [],
    'Other Technical Skills': []
  }

  const seen = new Set<string>()

  rawSkills.forEach((s) => {
    const trimmed = s.trim()
    if (!trimmed) return
    const lower = trimmed.toLowerCase()
    if (seen.has(lower)) return
    seen.add(lower)

    if (programmingLangs.has(lower)) {
      categories['Programming Languages'].push(trimmed)
    } else if (frameworks.has(lower)) {
      categories['Frameworks & Libraries'].push(trimmed)
    } else if (ai.has(lower)) {
      categories['Artificial Intelligence & ML'].push(trimmed)
    } else if (databases.has(lower)) {
      categories['Databases'].push(trimmed)
    } else if (cloud.has(lower)) {
      categories['Cloud & DevOps'].push(trimmed)
    } else {
      categories['Other Technical Skills'].push(trimmed)
    }
  })

  return Object.entries(categories)
    .filter(([_, list]) => list.length > 0)
    .map(([category, skills]) => ({ category, skills }))
}
