import {
  SkillCategory,
  MatchedSkill,
  MissingSkill,
  MissingKeyword,
  ExperienceGap,
  SkillMatchLevel,
  SkillGapAnalysisResult,
  ResumeBulletImprovement,
  ResumeImprovements,
  ActionPlanItem,
  ReadinessMetrics
} from '@/types/skill-gap'
import { getRoleKnowledgeProfile, RoleKnowledgeProfile } from './role-knowledge-base'
import { validateIsResume } from '@/lib/resume/validator'

export const NON_RESUME_ERROR_MESSAGE =
  'This document does not appear to be a resume. Please upload a valid resume or use Resume Builder.'

export const EMPTY_JD_ERROR_MESSAGE =
  'Please provide a target job role or paste a job description before running the skill gap analysis.'

// Comprehensive taxonomy of industry skills and their primary category
export const MASTER_SKILL_TAXONOMY: { name: string; aliases: string[]; category: SkillCategory; weight: number }[] = [
  // Programming Languages
  { name: 'Python', aliases: ['python', 'python3', 'py'], category: 'Programming Languages', weight: 10 },
  { name: 'TypeScript', aliases: ['typescript', 'ts'], category: 'Programming Languages', weight: 9 },
  { name: 'JavaScript', aliases: ['javascript', 'js', 'es6', 'ecmascript'], category: 'Programming Languages', weight: 9 },
  { name: 'Java', aliases: ['java', 'core java', 'j2ee'], category: 'Programming Languages', weight: 9 },
  { name: 'C++', aliases: ['c++', 'cpp'], category: 'Programming Languages', weight: 8 },
  { name: 'C#', aliases: ['c#', 'csharp', '.net'], category: 'Programming Languages', weight: 8 },
  { name: 'Go', aliases: ['go', 'golang'], category: 'Programming Languages', weight: 9 },
  { name: 'Rust', aliases: ['rust'], category: 'Programming Languages', weight: 8 },
  { name: 'SQL', aliases: ['sql', 't-sql', 'pl/sql'], category: 'Programming Languages', weight: 9 },
  { name: 'Bash & Shell', aliases: ['bash', 'shell scripting', 'sh', 'zsh'], category: 'Programming Languages', weight: 7 },
  { name: 'PHP', aliases: ['php'], category: 'Programming Languages', weight: 6 },
  { name: 'Kotlin', aliases: ['kotlin'], category: 'Programming Languages', weight: 8 },
  { name: 'Swift', aliases: ['swift'], category: 'Programming Languages', weight: 8 },
  { name: 'Ruby', aliases: ['ruby'], category: 'Programming Languages', weight: 7 },

  // Frontend
  { name: 'React', aliases: ['react', 'react.js', 'reactjs'], category: 'Frontend', weight: 10 },
  { name: 'Next.js', aliases: ['next.js', 'nextjs', 'next 14', 'next 15', 'app router'], category: 'Frontend', weight: 9 },
  { name: 'Vue.js', aliases: ['vue', 'vue.js', 'vuejs', 'nuxt'], category: 'Frontend', weight: 8 },
  { name: 'Angular', aliases: ['angular', 'angularjs'], category: 'Frontend', weight: 8 },
  { name: 'Tailwind CSS', aliases: ['tailwind', 'tailwindcss'], category: 'Frontend', weight: 8 },
  { name: 'HTML5 & CSS3', aliases: ['html', 'html5', 'css', 'css3', 'sass', 'scss'], category: 'Frontend', weight: 7 },
  { name: 'Redux & Zustand', aliases: ['redux', 'redux toolkit', 'zustand', 'recoil'], category: 'Frontend', weight: 8 },
  { name: 'WebSockets', aliases: ['websocket', 'websockets', 'socket.io'], category: 'Frontend', weight: 7 },
  { name: 'Responsive UI Design', aliases: ['responsive design', 'mobile-first', 'flexbox', 'css grid'], category: 'Frontend', weight: 7 },

  // Backend
  { name: 'Node.js', aliases: ['node.js', 'nodejs', 'node'], category: 'Backend', weight: 9 },
  { name: 'Express.js', aliases: ['express', 'express.js', 'expressjs'], category: 'Backend', weight: 8 },
  { name: 'FastAPI', aliases: ['fastapi', 'fast api'], category: 'Backend', weight: 9 },
  { name: 'Django', aliases: ['django', 'django rest framework', 'drf'], category: 'Backend', weight: 8 },
  { name: 'Spring Boot', aliases: ['spring', 'spring boot', 'spring cloud'], category: 'Backend', weight: 9 },
  { name: 'RESTful APIs', aliases: ['rest api', 'rest apis', 'restful api', 'restful apis', 'rest'], category: 'Backend', weight: 9 },
  { name: 'GraphQL', aliases: ['graphql', 'apollo'], category: 'Backend', weight: 8 },
  { name: 'Microservices Architecture', aliases: ['microservices', 'microservice', 'distributed systems'], category: 'Backend', weight: 9 },
  { name: 'gRPC', aliases: ['grpc', 'protobuf', 'protocol buffers'], category: 'Backend', weight: 7 },
  { name: 'NestJS', aliases: ['nestjs', 'nest.js'], category: 'Backend', weight: 8 },

  // Cloud
  { name: 'AWS Cloud Services', aliases: ['aws', 'amazon web services', 's3', 'ec2', 'lambda', 'aws lambda', 'dynamodb', 'cloudwatch'], category: 'Cloud', weight: 9 },
  { name: 'Microsoft Azure', aliases: ['azure', 'azure devops', 'azure functions'], category: 'Cloud', weight: 8 },
  { name: 'Google Cloud Platform (GCP)', aliases: ['gcp', 'google cloud', 'bigquery', 'vertex ai'], category: 'Cloud', weight: 8 },
  { name: 'Serverless Architecture', aliases: ['serverless', 'lambda functions', 'edge functions'], category: 'Cloud', weight: 8 },
  { name: 'Cloudflare', aliases: ['cloudflare', 'workers', 'cdn'], category: 'Cloud', weight: 7 },

  // DevOps
  { name: 'Docker', aliases: ['docker', 'containerization', 'dockerfile', 'docker compose'], category: 'DevOps', weight: 10 },
  { name: 'Kubernetes (K8s)', aliases: ['kubernetes', 'k8s', 'helm', 'minikube', 'eks', 'gke'], category: 'DevOps', weight: 9 },
  { name: 'Terraform (IaC)', aliases: ['terraform', 'iac', 'infrastructure as code'], category: 'DevOps', weight: 8 },
  { name: 'CI/CD Pipelines', aliases: ['ci/cd', 'github actions', 'gitlab ci', 'jenkins', 'pipeline automation'], category: 'DevOps', weight: 9 },
  { name: 'Linux Administration', aliases: ['linux', 'ubuntu', 'debian', 'centos', 'redhat'], category: 'DevOps', weight: 8 },
  { name: 'Prometheus & Grafana', aliases: ['prometheus', 'grafana', 'datadog', 'monitoring', 'telemetry'], category: 'DevOps', weight: 7 },
  { name: 'ArgoCD', aliases: ['argocd', 'gitops'], category: 'DevOps', weight: 7 },

  // AI
  { name: 'Large Language Models (LLMs)', aliases: ['llm', 'llms', 'large language models', 'gpt-4', 'claude', 'gemini', 'llama'], category: 'AI', weight: 10 },
  { name: 'RAG Architectures', aliases: ['rag', 'retrieval-augmented generation', 'retrieval augmented generation'], category: 'AI', weight: 10 },
  { name: 'Prompt Engineering', aliases: ['prompt engineering', 'system prompts', 'few-shot', 'chain-of-thought'], category: 'AI', weight: 9 },
  { name: 'LangChain & LlamaIndex', aliases: ['langchain', 'llamaindex', 'langgraph'], category: 'AI', weight: 9 },
  { name: 'Vector Embeddings', aliases: ['embeddings', 'dense embeddings', 'semantic search', 'cosine similarity'], category: 'AI', weight: 9 },
  { name: 'Fine-Tuning & LoRA', aliases: ['fine-tuning', 'fine tuning', 'lora', 'qlora', 'peft'], category: 'AI', weight: 8 },
  { name: 'Agentic AI Workflows', aliases: ['ai agents', 'agentic', 'langgraph', 'autonomous agents', 'tool calling'], category: 'AI', weight: 9 },
  { name: 'Model Quantization & vLLM', aliases: ['vllm', 'quantization', 'gguf', 'awq', 'ollama'], category: 'AI', weight: 8 },

  // Machine Learning
  { name: 'PyTorch', aliases: ['pytorch', 'torch'], category: 'Machine Learning', weight: 9 },
  { name: 'TensorFlow & Keras', aliases: ['tensorflow', 'keras', 'tf'], category: 'Machine Learning', weight: 8 },
  { name: 'Scikit-Learn', aliases: ['scikit-learn', 'sklearn'], category: 'Machine Learning', weight: 9 },
  { name: 'Pandas & NumPy', aliases: ['pandas', 'numpy'], category: 'Machine Learning', weight: 9 },
  { name: 'Exploratory Data Analysis (EDA)', aliases: ['eda', 'data visualization', 'matplotlib', 'seaborn', 'plotly'], category: 'Machine Learning', weight: 8 },
  { name: 'Natural Language Processing (NLP)', aliases: ['nlp', 'transformers', 'hugging face', 'tokenization', 'bert'], category: 'Machine Learning', weight: 9 },
  { name: 'Computer Vision (CV)', aliases: ['computer vision', 'opencv', 'object detection', 'yolo'], category: 'Machine Learning', weight: 8 },
  { name: 'Gradient Boosting (XGBoost)', aliases: ['xgboost', 'lightgbm', 'catboost'], category: 'Machine Learning', weight: 8 },

  // Databases
  { name: 'PostgreSQL', aliases: ['postgresql', 'postgres'], category: 'Databases', weight: 9 },
  { name: 'MongoDB', aliases: ['mongodb', 'mongo', 'nosql'], category: 'Databases', weight: 8 },
  { name: 'MySQL', aliases: ['mysql'], category: 'Databases', weight: 8 },
  { name: 'Redis', aliases: ['redis', 'caching', 'in-memory database'], category: 'Databases', weight: 9 },
  { name: 'Vector Databases', aliases: ['vector database', 'vector db', 'pinecone', 'qdrant', 'milvus', 'weaviate', 'chromadb'], category: 'Databases', weight: 9 },
  { name: 'Prisma ORM', aliases: ['prisma', 'prisma orm', 'drizzle', 'typeorm', 'sqlalchemy'], category: 'Databases', weight: 8 },
  { name: 'Database Indexing & Optimization', aliases: ['indexing', 'query optimization', 'explain analyze', 'transactions'], category: 'Databases', weight: 8 },

  // Tools
  { name: 'Git & Version Control', aliases: ['git', 'github', 'gitlab', 'version control'], category: 'Tools', weight: 9 },
  { name: 'Unit & Integration Testing', aliases: ['unit testing', 'jest', 'pytest', 'vitest', 'testing library', 'cypress', 'playwright'], category: 'Tools', weight: 8 },
  { name: 'Postman & API Testing', aliases: ['postman', 'insomnia', 'api testing', 'swagger'], category: 'Tools', weight: 7 },
  { name: 'Jira & Agile Workflows', aliases: ['jira', 'agile', 'scrum', 'kanban', 'sprint'], category: 'Tools', weight: 7 },
  { name: 'Figma & UI Prototyping', aliases: ['figma', 'ui design', 'prototyping'], category: 'Tools', weight: 7 },

  // Frameworks
  { name: 'Spring Boot Framework', aliases: ['spring boot', 'spring framework'], category: 'Frameworks', weight: 8 },
  { name: 'Flask Framework', aliases: ['flask'], category: 'Frameworks', weight: 7 },
  { name: 'Flutter & Dart', aliases: ['flutter', 'dart'], category: 'Frameworks', weight: 8 },
  { name: 'React Native', aliases: ['react native'], category: 'Frameworks', weight: 8 },

  // Soft Skills
  { name: 'Problem Solving & Critical Thinking', aliases: ['problem solving', 'critical thinking', 'analytical thinking'], category: 'Soft Skills', weight: 8 },
  { name: 'Cross-functional Collaboration', aliases: ['collaboration', 'cross-functional', 'team player'], category: 'Soft Skills', weight: 8 },
  { name: 'System Design & Architecture', aliases: ['system design', 'architecture', 'software design'], category: 'Soft Skills', weight: 9 },
  { name: 'Mentorship & Code Reviews', aliases: ['mentorship', 'code reviews', 'code review', 'peer review'], category: 'Soft Skills', weight: 7 },
  { name: 'Technical Documentation', aliases: ['documentation', 'technical writing', 'readme'], category: 'Soft Skills', weight: 7 }
]

// Common Recruiter Keywords to detect
const RECRUITER_KEYWORD_CANDIDATES = [
  'Docker', 'Redis', 'AWS Lambda', 'Terraform', 'REST APIs', 'GraphQL',
  'FastAPI', 'Kafka', 'Microservices', 'LLMs', 'Prompt Engineering',
  'RAG', 'PyTorch', 'TensorFlow', 'Kubernetes', 'CI/CD', 'Next.js',
  'PostgreSQL', 'TypeScript', 'LangChain', 'Vector Databases', 'OAuth'
]

/**
 * Validates if the document is a resume.
 */
export function validateResumeInput(resumeText: string, fileName: string = ''): { isValid: boolean; errorMessage?: string } {
  if (!resumeText || resumeText.trim().length < 50) {
    return {
      isValid: false,
      errorMessage: NON_RESUME_ERROR_MESSAGE
    }
  }

  const valResult = validateIsResume(resumeText, fileName)
  if (
    !valResult.isValid ||
    valResult.detectedType === 'assignment' ||
    valResult.detectedType === 'invoice' ||
    valResult.detectedType === 'notes' ||
    valResult.detectedType === 'paper'
  ) {
    return {
      isValid: false,
      errorMessage: NON_RESUME_ERROR_MESSAGE
    }
  }

  return { isValid: true }
}

/**
 * Extracts skills from text using taxonomy
 */
function extractSkillsFromText(text: string): { matchedSkills: MatchedSkill[]; foundTaxonomyNames: Set<string> } {
  const lower = text.toLowerCase()
  const matchedSkills: MatchedSkill[] = []
  const foundTaxonomyNames = new Set<string>()

  for (const item of MASTER_SKILL_TAXONOMY) {
    const isPresent = item.aliases.some(alias => {
      // Word boundary match
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`(?:^|[\\s,;:.()/\\[\\]{}"'-])${escaped}(?:$|[\\s,;:.()/\\[\\]{}"'-])`, 'i')
      return regex.test(lower)
    })

    if (isPresent) {
      foundTaxonomyNames.add(item.name)
      // Extract matched snippet context
      let contextSnippet: string | undefined
      const firstAlias = item.aliases[0]
      const idx = lower.indexOf(firstAlias)
      if (idx !== -1) {
        const start = Math.max(0, idx - 30)
        const end = Math.min(text.length, idx + firstAlias.length + 40)
        contextSnippet = text.substring(start, end).trim()
      }

      matchedSkills.push({
        name: item.name,
        category: item.category,
        proficiencyEstimate: item.weight >= 9 ? 'Advanced' : item.weight >= 8 ? 'Proficient' : 'Demonstrated',
        matchedContext: contextSnippet
      })
    }
  }

  return { matchedSkills, foundTaxonomyNames }
}

/**
 * Estimates years of experience mentioned in resume text
 */
function estimateCandidateExperienceYears(text: string): number {
  let maxYears = 0

  // 1. Check explicit "X+ years of experience"
  const expRegex = /(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/gi
  let match: RegExpExecArray | null
  while ((match = expRegex.exec(text)) !== null) {
    const val = parseInt(match[1], 10)
    if (val > maxYears && val <= 30) {
      maxYears = val
    }
  }

  // 2. Check year date ranges (e.g., 2021 - 2024, 2022 - Present)
  const rangeRegex = /\b(20\d{2})\s*(?:-|–|—|to)\s*(20\d{2}|present|current)\b/gi
  let rangeYears = 0
  const currentYear = new Date().getFullYear()
  while ((match = rangeRegex.exec(text)) !== null) {
    const startY = parseInt(match[1], 10)
    const endY = match[2].toLowerCase() === 'present' || match[2].toLowerCase() === 'current'
      ? currentYear
      : parseInt(match[2], 10)
    if (endY >= startY) {
      rangeYears += (endY - startY)
    }
  }

  if (rangeYears > maxYears) {
    maxYears = Math.min(rangeYears, 15)
  }

  // Default to 1 if some experience cues exist, else 0.5 (fresher)
  if (maxYears === 0) {
    if (/intern|junior|graduate|student/i.test(text)) {
      maxYears = 1
    } else if (/senior|lead|architect/i.test(text)) {
      maxYears = 4
    } else {
      maxYears = 1.5
    }
  }

  return maxYears
}

/**
 * Estimates required years from JD text
 */
function estimateRequiredExperienceYears(jdText: string, fallback: number): number {
  const reqRegex = /(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+(?:hands-on|industry|professional|relevant))?\s+experience/gi
  const match = reqRegex.exec(jdText)
  if (match) {
    const val = parseInt(match[1], 10)
    if (val > 0 && val <= 20) return val
  }
  return fallback
}

/**
 * Main AI Skill Gap Analysis Engine
 */
export async function performSkillGapAnalysis(
  resumeText: string,
  targetInput: {
    mode: 'role' | 'jd'
    roleName: string
    jobDescriptionText?: string
  },
  fileName?: string
): Promise<SkillGapAnalysisResult> {
  // 1. Validation: Resume Authenticity
  const valCheck = validateResumeInput(resumeText, fileName)
  if (!valCheck.isValid) {
    throw new Error(valCheck.errorMessage || NON_RESUME_ERROR_MESSAGE)
  }

  // 2. Validation: Job Target Presence
  const jdText = targetInput.jobDescriptionText?.trim() || ''
  const roleName = targetInput.roleName?.trim() || ''

  if (targetInput.mode === 'jd' && !jdText) {
    throw new Error(EMPTY_JD_ERROR_MESSAGE)
  }
  if (targetInput.mode === 'role' && !roleName && !jdText) {
    throw new Error(EMPTY_JD_ERROR_MESSAGE)
  }

  // 3. Resolve Role Knowledge Profile
  const activeRoleName = roleName || 'Software Engineer'
  const profile: RoleKnowledgeProfile = getRoleKnowledgeProfile(activeRoleName)

  // Combined target JD context
  const fullTargetContext = jdText ? `${jdText}\n\n${profile.sampleJdText}` : profile.sampleJdText

  // 4. Extract Candidate Skills & Target Skills
  const { matchedSkills: candidateSkills, foundTaxonomyNames: candidateSkillSet } = extractSkillsFromText(resumeText)
  const { foundTaxonomyNames: targetSkillSet } = extractSkillsFromText(fullTargetContext)

  // Merge profile essential skills with target skills extracted from JD
  profile.essentialSkills.forEach(es => targetSkillSet.add(es.name))

  // 5. Categorize Matched Skills & Missing Skills
  const finalMatchedSkills: MatchedSkill[] = []
  const missingSkills: MissingSkill[] = []

  let totalTargetWeight = 0
  let achievedWeight = 0

  targetSkillSet.forEach(skillName => {
    // Find taxonomy or essential skill weight
    const taxItem = MASTER_SKILL_TAXONOMY.find(t => t.name.toLowerCase() === skillName.toLowerCase())
    const essential = profile.essentialSkills.find(e => e.name.toLowerCase() === skillName.toLowerCase())
    const weight = essential ? essential.weight : taxItem ? taxItem.weight : 7
    const category: SkillCategory = essential ? essential.category : taxItem ? taxItem.category : 'Backend'

    totalTargetWeight += weight

    if (candidateSkillSet.has(skillName)) {
      achievedWeight += weight
      // Check if already in candidateSkills
      const existing = candidateSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase())
      finalMatchedSkills.push(
        existing || {
          name: skillName,
          category,
          proficiencyEstimate: weight >= 9 ? 'Advanced' : 'Proficient'
        }
      )
    } else {
      // Missing Skill priority assignment
      const priority: 'High Priority' | 'Medium Priority' | 'Low Priority' =
        weight >= 9 ? 'High Priority' : weight >= 7 ? 'Medium Priority' : 'Low Priority'

      let reason = ''
      if (priority === 'High Priority') {
        reason = `Directly emphasized in core qualifications for ${profile.title}. Required for fundamental architecture and daily task delivery.`
      } else if (priority === 'Medium Priority') {
        reason = `Frequently utilized across modern ${profile.title} engineering stacks to ensure scalability, reliability, and code quality.`
      } else {
        reason = `Supporting competency that distinguishes competitive candidates and streamlines team workflows.`
      }

      missingSkills.push({
        name: skillName,
        category,
        priority,
        reason,
        learningDifficulty: weight >= 9 ? 'Challenging' : weight >= 7 ? 'Moderate' : 'Easy',
        estimatedHours: weight >= 9 ? 35 : weight >= 7 ? 20 : 10
      })
    }
  })

  // Sort missing skills by priority (High -> Medium -> Low)
  const priorityOrder = { 'High Priority': 0, 'Medium Priority': 1, 'Low Priority': 2 }
  missingSkills.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  // 6. Recruiter Missing Keywords Extraction
  const missingKeywords: MissingKeyword[] = []
  const lowerResume = resumeText.toLowerCase()
  const lowerJd = fullTargetContext.toLowerCase()

  const allKeywordCandidates = Array.from(new Set([...RECRUITER_KEYWORD_CANDIDATES, ...profile.recruiterKeywords]))

  allKeywordCandidates.forEach(kw => {
    const kwLower = kw.toLowerCase()
    const inJd = lowerJd.includes(kwLower)
    const inResume = lowerResume.includes(kwLower)

    if (inJd && !inResume) {
      let naturalTip = ''
      let targetSection: 'Summary' | 'Experience' | 'Projects' | 'Skills' = 'Projects'
      let importance: 'Critical' | 'High' | 'Medium' = 'High'

      if (['Docker', 'Kubernetes', 'AWS Lambda', 'Terraform', 'RAG', 'Microservices'].includes(kw)) {
        importance = 'Critical'
        targetSection = 'Experience'
        naturalTip = `Incorporate into your latest role: 'Architected scalable microservices containerized with ${kw}, reducing deployment cycles by 35%.'`
      } else if (['FastAPI', 'Redis', 'PostgreSQL', 'GraphQL', 'Next.js', 'PyTorch'].includes(kw)) {
        importance = 'High'
        targetSection = 'Projects'
        naturalTip = `Feature under project tech stack and bullet points: 'Engineered backend caching layer utilizing ${kw} to improve throughput by 40%.'`
      } else {
        importance = 'Medium'
        targetSection = 'Skills'
        naturalTip = `List ${kw} prominently under your Technical Skills section and reference its practical application in your project summary.`
      }

      missingKeywords.push({
        keyword: kw,
        importance,
        occurrenceInJd: `Required core term in ${profile.title} job specification`,
        naturalAdditionTip: naturalTip,
        targetSection
      })
    }
  })

  // 7. Calculate Skill Match Score (0–100)
  const rawRatio = totalTargetWeight > 0 ? achievedWeight / totalTargetWeight : 0.5
  let overallScore = Math.round(rawRatio * 100)

  // Experience and Scale adjustment
  const candidateYears = estimateCandidateExperienceYears(resumeText)
  const requiredYears = estimateRequiredExperienceYears(fullTargetContext, profile.typicalYearsRequired)

  if (candidateYears >= requiredYears) {
    overallScore = Math.min(100, overallScore + 5)
  } else {
    const expPenalty = Math.min(15, Math.round((requiredYears - candidateYears) * 4))
    overallScore = Math.max(15, overallScore - expPenalty)
  }

  // Determine Match Level
  let matchLevel: SkillMatchLevel = 'Moderate Match'
  if (overallScore >= 85) matchLevel = 'Excellent Match'
  else if (overallScore >= 70) matchLevel = 'Strong Match'
  else if (overallScore >= 55) matchLevel = 'Moderate Match'
  else if (overallScore >= 40) matchLevel = 'Needs Improvement'
  else matchLevel = 'Poor Match'

  // Summary Headline
  let summaryHeadline = ''
  if (matchLevel === 'Excellent Match') {
    summaryHeadline = `Exceptional technical alignment with ${profile.title} requirements. Demonstrates high readiness for technical interviews.`
  } else if (matchLevel === 'Strong Match') {
    summaryHeadline = `Strong foundation in core ${profile.title} domains with actionable minor skill gaps in specialized tooling.`
  } else if (matchLevel === 'Moderate Match') {
    summaryHeadline = `Solid general engineering baseline, but missing critical role-specific frameworks and cloud deployment competencies.`
  } else {
    summaryHeadline = `Substantial gap in required tech stack and demonstrated project scale. Targeted hands-on project building recommended.`
  }

  // 8. Experience Gap Analysis
  const expDiff = requiredYears - candidateYears
  let gapExplanation = ''
  if (expDiff <= 0) {
    gapExplanation = `Candidate has approximately ${candidateYears} years of demonstrated background, meeting or exceeding the standard ${requiredYears} years requirement for ${profile.title}.`
  } else {
    gapExplanation = `Role typically seeks ~${requiredYears} years of practical experience, while resume highlights ~${candidateYears} years. Bridge this gap by building high-scale portfolio projects with documented architecture.`
  }

  const responsibilitiesGap: string[] = []
  if (!lowerResume.includes('architecture') && !lowerResume.includes('design')) {
    responsibilitiesGap.push('System architecture and end-to-end technical design documentation')
  }
  if (!lowerResume.includes('lead') && !lowerResume.includes('mentor') && !lowerResume.includes('owned')) {
    responsibilitiesGap.push('Technical leadership, sprint ownership, or peer code review guidance')
  }
  if (!lowerResume.includes('production') && !lowerResume.includes('deploy')) {
    responsibilitiesGap.push('Hands-on production deployment and monitoring telemetry')
  }
  if (responsibilitiesGap.length === 0) {
    responsibilitiesGap.push('Optimization of distributed throughput under high concurrent load')
  }

  const leadershipScore = /lead|mentor|spearhead|guided|founded/i.test(resumeText) ? 78 : 42
  const architectureScore = /architecture|scalable|microservices|distributed|system design/i.test(resumeText) ? 82 : 48
  const ownershipScore = /owned|delivered|spearheaded|architected|initiated/i.test(resumeText) ? 85 : 54

  const experienceGap: ExperienceGap = {
    yearsRequired: requiredYears,
    yearsMentioned: candidateYears,
    gapExplanation,
    responsibilitiesGap,
    leadershipScore,
    architectureScore,
    ownershipScore,
    projectScaleAssessment:
      candidateYears >= 2
        ? 'Mid-tier enterprise applications with multi-tier architecture.'
        : 'Entry to junior tier projects with solid foundational functionality.'
  }

  // 9. Resume Improvements (Actionable before-and-after bullets)
  const weakBulletPoints: ResumeBulletImprovement[] = [
    {
      original: 'Worked on backend APIs and connected database.',
      improved: `Architected 12+ RESTful microservices in Node.js/FastAPI with PostgreSQL, cutting endpoint latency by 38% under 2,000 req/min load.`,
      reason: 'Replaces passive verbs with active ownership, specifies tech stack, and quantifies business impact.'
    },
    {
      original: 'Responsible for Docker containers and cloud deployment.',
      improved: `Containerized multi-service platform using Docker & automated CI/CD via GitHub Actions, accelerating release cycles from bi-weekly to daily.`,
      reason: 'Adds concrete metrics and highlights modern automation practices.'
    },
    {
      original: 'Developed responsive user interface using modern frontend frameworks.',
      improved: `Built modern responsive dashboard using React & Next.js, elevating Lighthouse performance scores to 96+ and supporting 10k+ monthly active users.`,
      reason: 'Includes measurable performance metrics and user scale.'
    }
  ]

  const resumeImprovements: ResumeImprovements = {
    missingSections: !lowerResume.includes('project') ? ['Dedicated Key Projects Section'] : [],
    weakBulletPoints,
    missingMetrics: [
      'Quantifiable impact (e.g., % latency reduction, $ cost saved, hours automated)',
      'Scale indicators (e.g., concurrent users, requests per second, database table sizes)',
      'Test coverage benchmarks (e.g., 85%+ unit test coverage with Jest/PyTest)'
    ],
    weakSummaryTips: [
      `Anchor your professional headline directly to '${profile.title}' instead of generic 'Aspiring Software Professional'.`,
      `Highlight your primary 3 tech specialties in the first 2 sentences.`
    ],
    weakSkillsTips: [
      'Group skills into clear logical categories (Languages, Frameworks, Cloud & DevOps, Databases) rather than a single comma-separated block.',
      'Remove outdated or non-relevant competencies to keep recruiters focused on high-demand skills.'
    ],
    recruiterTips: [
      'Recruiters spend an average of 6 seconds scanning: ensure target keywords are in the top half of page one.',
      'Always include live demo links and clean GitHub repositories with comprehensive README files.',
      'Format bullets using the Google XYZ formula: Accomplished [X] as measured by [Y] by doing [Z].'
    ]
  }

  // 10. Prioritized Action Plan
  const actionPlan: ActionPlanItem[] = [
    {
      id: 'act-1',
      task: `Master High-Priority Skill: ${missingSkills[0]?.name || 'Docker Containerization'}`,
      category: 'Technical Skills',
      priority: 'High',
      completed: false,
      impact: 'Closes primary technical requirement gap for screening filters.'
    },
    {
      id: 'act-2',
      task: `Build Portfolio Project: ${profile.projects[0]?.title || 'Distributed Systems Capstone'}`,
      category: 'Portfolio',
      priority: 'High',
      completed: false,
      impact: 'Provides undeniable tangible proof of practical engineering ability.'
    },
    {
      id: 'act-3',
      task: `Rewrite 3 Resume Bullets with Metrics & XYZ Formula`,
      category: 'Resume Optimization',
      priority: 'High',
      completed: false,
      impact: 'Boosts ATS match score and recruiter interview conversion rate.'
    },
    {
      id: 'act-4',
      task: `Incorporate Missing Keywords (${missingKeywords.slice(0, 3).map(k => k.keyword).join(', ')})`,
      category: 'ATS Keywords',
      priority: 'High',
      completed: false,
      impact: 'Passes automated Applicant Tracking System filtering algorithms.'
    },
    {
      id: 'act-5',
      task: `Pursue Certification: ${profile.certifications[0]?.name || 'Cloud Associate'}`,
      category: 'Credentials',
      priority: 'Medium',
      completed: false,
      impact: 'Industry validation that adds credibility to resume credentials.'
    },
    {
      id: 'act-6',
      task: 'Optimize LinkedIn Profile & Headline for Target Role',
      category: 'Branding',
      priority: 'Medium',
      completed: false,
      impact: 'Attracts inbound recruiter outreach for matching roles.'
    },
    {
      id: 'act-7',
      task: 'Practice System Design & Coding Interview Patterns',
      category: 'Interviews',
      priority: 'Medium',
      completed: false,
      impact: 'Ensures confidence and readiness during live technical screenings.'
    }
  ]

  // 11. Readiness Metrics
  const readinessMetrics: ReadinessMetrics = {
    resumeReadiness: Math.min(100, Math.round(overallScore * 0.95 + 5)),
    technicalReadiness: overallScore,
    placementReadiness: Math.min(100, Math.max(30, Math.round(overallScore * 0.88 + (candidateYears >= 2 ? 10 : 0)))),
    interviewReadiness: Math.min(100, Math.max(25, Math.round(overallScore * 0.82 + (architectureScore * 0.15))))
  }

  // Candidate Name extraction
  const nameMatch = resumeText.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/m)
  const candidateName = nameMatch ? nameMatch[1] : 'Candidate'

  return {
    id: `gap-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    candidateName,
    targetRole: profile.title,
    overallScore,
    matchLevel,
    summaryHeadline,
    matchedSkills: finalMatchedSkills,
    missingSkills,
    missingKeywords,
    experienceGap,
    projectRecommendations: profile.projects,
    certifications: profile.certifications,
    learningRoadmap: profile.roadmap,
    marketDemand: profile.market,
    resumeImprovements,
    actionPlan,
    readinessMetrics,
    parsedResumeSnippet: {
      textLength: resumeText.length,
      detectedRole: profile.title,
      contactFound: Boolean(resumeText.match(/@/))
    },
    jdSnippet: fullTargetContext.substring(0, 300)
  }
}
