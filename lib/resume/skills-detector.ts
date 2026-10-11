import { CategorizedSkills } from './types'

export const SKILL_TAXONOMY = {
  programmingLanguages: [
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'c', 'go', 'golang', 'rust',
    'ruby', 'php', 'swift', 'kotlin', 'dart', 'scala', 'r', 'matlab', 'bash', 'shell',
    'powershell', 'perl', 'haskell', 'lua', 'objective-c', 'assembly', 'solidity'
  ],
  frameworks: [
    'react', 'next.js', 'nextjs', 'angular', 'vue', 'vue.js', 'svelte', 'sveltekit',
    'express', 'express.js', 'nestjs', 'django', 'flask', 'fastapi', 'spring boot', 'spring',
    'asp.net', '.net core', 'laravel', 'ruby on rails', 'rails', 'flutter', 'react native',
    'electron', 'remix', 'gatsby', 'gin', 'fiber', 'symfony', 'codeigniter'
  ],
  libraries: [
    'redux', 'redux toolkit', 'zustand', 'recoil', 'tailwind', 'tailwind css', 'bootstrap',
    'material-ui', 'mui', 'shadcn', 'framer motion', 'three.js', 'd3.js', 'chart.js',
    'pandas', 'numpy', 'scipy', 'scikit-learn', 'pytorch', 'tensorflow', 'keras',
    'rxjs', 'axios', 'tanstack query', 'react-query', 'zod', 'prisma', 'typeorm', 'mongoose',
    'hibernate', 'sqlalchemy'
  ],
  databases: [
    'postgresql', 'postgres', 'mysql', 'mongodb', 'redis', 'sqlite', 'dynamodb',
    'cassandra', 'elasticsearch', 'couchdb', 'neo4j', 'oracle', 'sql server', 'mariadb',
    'supabase', 'firebase', 'firestore', 'faunadb', 'snowflake', 'bigquery', 'clickhouse'
  ],
  cloudPlatforms: [
    'aws', 'amazon web services', 'azure', 'microsoft azure', 'gcp', 'google cloud',
    'vercel', 'netlify', 'cloudflare', 'digitalocean', 'heroku', 'render', 'linode',
    'openstack', 'oracle cloud', 'ibm cloud'
  ],
  devOpsTools: [
    'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'github actions',
    'gitlab ci', 'circleci', 'helm', 'argocd', 'prometheus', 'grafana', 'datadog',
    'nginx', 'apache', 'linux', 'ubuntu', 'vagrant', 'packer', 'vault', 'consul',
    'splunk', 'elk stack', 'logstash', 'kibana'
  ],
  aiMlSkills: [
    'machine learning', 'deep learning', 'nlp', 'natural language processing',
    'computer vision', 'large language models', 'llm', 'generative ai', 'genai',
    'prompt engineering', 'langchain', 'llamaindex', 'rag', 'retrieval-augmented generation',
    'fine-tuning', 'transformers', 'hugging face', 'opencv', 'reinforcement learning',
    'vector databases', 'pinecone', 'weaviate', 'chromadb', 'milvus', 'whisper', 'stable diffusion'
  ],
  softSkills: [
    'leadership', 'team leadership', 'communication', 'problem solving', 'collaboration',
    'teamwork', 'agile', 'scrum', 'kanban', 'project management', 'critical thinking',
    'adaptability', 'mentorship', 'cross-functional collaboration', 'analytical skills',
    'stakeholder management', 'conflict resolution', 'time management', 'decision making'
  ]
}

const DISPLAY_NAMES: Record<string, string> = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'java': 'Java',
  'c++': 'C++',
  'c#': 'C#',
  'c': 'C',
  'golang': 'Go',
  'go': 'Go',
  'rust': 'Rust',
  'ruby': 'Ruby',
  'php': 'PHP',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'dart': 'Dart',
  'scala': 'Scala',
  'r': 'R',
  'react': 'React.js',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'angular': 'Angular',
  'vue': 'Vue.js',
  'vue.js': 'Vue.js',
  'svelte': 'Svelte',
  'express': 'Express.js',
  'express.js': 'Express.js',
  'nestjs': 'NestJS',
  'django': 'Django',
  'flask': 'Flask',
  'fastapi': 'FastAPI',
  'spring boot': 'Spring Boot',
  'spring': 'Spring Framework',
  'asp.net': 'ASP.NET',
  '.net core': '.NET Core',
  'flutter': 'Flutter',
  'react native': 'React Native',
  'redux': 'Redux',
  'tailwind css': 'Tailwind CSS',
  'tailwind': 'Tailwind CSS',
  'scikit-learn': 'Scikit-Learn',
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'mysql': 'MySQL',
  'mongodb': 'MongoDB',
  'redis': 'Redis',
  'elasticsearch': 'Elasticsearch',
  'aws': 'AWS',
  'amazon web services': 'AWS',
  'azure': 'Microsoft Azure',
  'microsoft azure': 'Microsoft Azure',
  'gcp': 'Google Cloud (GCP)',
  'google cloud': 'Google Cloud',
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'terraform': 'Terraform',
  'github actions': 'GitHub Actions',
  'jenkins': 'Jenkins',
  'machine learning': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'natural language processing': 'NLP',
  'nlp': 'NLP',
  'llm': 'Large Language Models (LLM)',
  'large language models': 'Large Language Models (LLM)',
  'generative ai': 'Generative AI',
  'langchain': 'LangChain',
  'rag': 'RAG (Retrieval-Augmented Generation)',
  'leadership': 'Leadership',
  'problem solving': 'Problem Solving',
  'agile': 'Agile / Scrum',
  'communication': 'Communication'
}

export function detectAndCategorizeSkills(text: string): { categorized: CategorizedSkills; allFound: string[] } {
  const normalizedText = ` ${text.toLowerCase().replace(/[\r\n\t,;•·|/\\]/g, ' ')} `
  const foundSet = new Set<string>()

  const categorized: CategorizedSkills = {
    programmingLanguages: [],
    frameworks: [],
    libraries: [],
    databases: [],
    cloudPlatforms: [],
    devOpsTools: [],
    aiMlSkills: [],
    softSkills: [],
    other: []
  }

  // Helper to match skill safely
  const matchSkill = (skill: string): boolean => {
    // Avoid false positives for single letters like 'c' or 'r'
    if (skill === 'c') {
      return /(?:\s|\/|\()(c)(?:\s|\/|,|\))/i.test(normalizedText) && !/c\+\+|c#/i.test(normalizedText)
    }
    if (skill === 'r') {
      return /(?:\s|\/|\()(r)(?:\s|\/|,|\))/i.test(normalizedText)
    }
    if (skill === 'go') {
      return /(?:\s)(go|golang)(?:\s|,|\.)/i.test(normalizedText)
    }
    // Word boundary regex with special char escapes
    const escaped = skill.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    const regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:[^a-zA-Z0-9_#+]|$)`, 'i')
    return regex.test(normalizedText)
  }

  (Object.keys(SKILL_TAXONOMY) as (keyof typeof SKILL_TAXONOMY)[]).forEach((categoryKey) => {
    SKILL_TAXONOMY[categoryKey].forEach((skillKeyword) => {
      if (matchSkill(skillKeyword)) {
        const canonicalName = DISPLAY_NAMES[skillKeyword] || (skillKeyword.charAt(0).toUpperCase() + skillKeyword.slice(1))
        if (!foundSet.has(canonicalName.toLowerCase())) {
          foundSet.add(canonicalName.toLowerCase())
          categorized[categoryKey].push(canonicalName)
        }
      }
    })
  })

  // Deduplicate each category
  const allFound = Array.from(foundSet)
  return { categorized, allFound }
}
