import {
  InterviewInput,
  InterviewQuestion,
  QuestionEvaluation,
  OverallInterviewResult,
  HireVerdict,
  InterviewType,
  DifficultyLevel,
  ExperienceLevel
} from '@/types/interview-prep'
import {
  getCompanyInterviewInsights,
  PUBLIC_INTERVIEW_DISCLAIMER
} from './trends-database'

/**
 * Extracts skills, technologies, and project keywords from raw resume text
 */
export function extractResumeSignals(text: string): {
  skills: string[]
  projects: string[]
  highlights: string[]
} {
  if (!text || text.trim().length < 20) {
    return { skills: ['Full Stack', 'System Architecture', 'Problem Solving'], projects: [], highlights: [] }
  }

  const commonTech = [
    'React', 'Next.js', 'Vue', 'Angular', 'TypeScript', 'JavaScript', 'Python',
    'Java', 'C++', 'Go', 'Golang', 'Rust', 'Node.js', 'Express', 'Django',
    'FastAPI', 'Spring Boot', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
    'Kafka', 'RabbitMQ', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
    'GraphQL', 'REST API', 'Microservices', 'PyTorch', 'TensorFlow', 'LLM',
    'LangChain', 'OpenAI', 'RAG', 'Vector DB', 'CI/CD', 'Git', 'Linux'
  ]

  const lower = text.toLowerCase()
  const foundSkills = commonTech.filter(tech => {
    const regex = new RegExp(`\\b${tech.toLowerCase()}\\b`, 'i')
    return regex.test(lower)
  })

  // Extract lines that look like project titles or company achievements
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const projects: string[] = []
  const highlights: string[] = []

  lines.forEach(line => {
    if (line.length > 20 && line.length < 120) {
      if (/built|developed|designed|implemented|architected|led|optimized|migrated/i.test(line)) {
        if (projects.length < 4) {
          projects.push(line.replace(/^[•\-\*]\s*/, ''))
        }
      } else if (/\d+%\s*|\$\d+|\bscale\b|\blatency\b|\busers\b/i.test(line)) {
        if (highlights.length < 3) {
          highlights.push(line.replace(/^[•\-\*]\s*/, ''))
        }
      }
    }
  })

  return {
    skills: foundSkills.length > 0 ? foundSkills : ['JavaScript', 'Python', 'Cloud Services', 'System Design'],
    projects,
    highlights
  }
}

/**
 * Generates an enterprise-grade personalized mock interview
 */
export function generateMockInterviewQuestions(input: InterviewInput): InterviewQuestion[] {
  const company = input.company.trim() || 'Global Tech'
  const role = input.jobRole.trim() || 'Software Engineer'
  const level = input.experienceLevel || 'mid'
  const type = input.interviewType || 'complete'
  const country = input.country || 'Global'

  const resumeSignals = extractResumeSignals(input.resumeText)
  const primarySkill = resumeSignals.skills[0] || 'Modern Architecture'
  const secondarySkill = resumeSignals.skills[1] || 'Databases'
  const thirdSkill = resumeSignals.skills[2] || 'Cloud Infrastructure'
  const sampleProject = resumeSignals.projects[0] || `a scalable distributed platform for ${role}`

  const questions: InterviewQuestion[] = []

  // Question 1: Recruiter Icebreaker & High-Impact Project Walkthrough
  if (type === 'complete' || type === 'behavioral' || type === 'hr' || type === 'final_hr') {
    questions.push({
      id: 'q-1',
      questionIndex: 1,
      roundType: type,
      category: 'project_deep_dive',
      interviewerPersona: 'Alex Mercer',
      interviewerTitle: `Lead Recruiter & Talent Partner at ${company}`,
      questionText: `Welcome! To begin our interview for the ${role} position here at ${company} in ${country}, please give me a brief executive overview of your engineering journey, and walk me through the most technically challenging project on your resume—focusing specifically on the architecture trade-offs you made.`,
      recruiterIntent: 'Assessing communication clarity, executive presence, passion for technology, and how concisely the candidate articulates architectural ownership.',
      suggestedKeyPoints: [
        'High-level summary of your background and domain strengths',
        'Specific problem statement of the highlighted project',
        'Architecture components (Frontend, Backend, DB, Cloud)',
        'Quantifiable impact (latency reduction, user scale, revenue, uptime)'
      ],
      followUps: [
        'If you had another 3 months to iterate on that project, what fundamental architecture decision would you refactor?',
        'How did you measure production reliability and user satisfaction after deployment?'
      ],
      difficulty: input.difficulty
    })
  }

  // Question 2: Core Technical & Language/Framework Deep-Dive
  if (type === 'complete' || type === 'technical' || type === 'coding') {
    const isAi = /ai|ml|machine learning|data|nlp|vision/i.test(role)
    const isFrontend = /frontend|ui|react|web/i.test(role)
    const isDevOps = /devops|cloud|sre|infrastructure/i.test(role)

    let techQuestion = ''
    let intent = ''
    let keyPoints: string[] = []

    if (isAi) {
      techQuestion = `At ${company}, we handle massive data throughput. How do you design an end-to-end vector search retrieval pipeline (RAG) that guarantees sub-50ms latency while preventing hallucinations in LLM responses?`
      intent = 'Testing practical understanding of embeddings, vector indexing (HNSW, IVF), chunking strategies, and reranking pipelines.'
      keyPoints = ['Vector database indexing trade-offs', 'Chunking strategy with semantic boundaries', 'Reranking model integration (e.g. Cross-encoders)', 'Caching repeated prompt embeddings']
    } else if (isFrontend) {
      techQuestion = `In a high-scale application built with ${primarySkill}, how do you diagnose and eliminate client-side rendering bottlenecks, memory leaks, and large bundle execution delays during initial page load?`
      intent = 'Assessing mastery of browser performance profiling, code-splitting, tree-shaking, and state management optimization.'
      keyPoints = ['Chrome DevTools performance profiling and memory heap snapshots', 'Dynamic imports / lazy loading boundaries', 'Avoiding excessive component re-renders', 'Optimizing Core Web Vitals (LCP, INP, CLS)']
    } else if (isDevOps) {
      techQuestion = `How do you architect a zero-downtime, multi-region Kubernetes deployment with automated blue/green canary rollouts and instant automated rollbacks based on Prometheus/Datadog p99 latency spikes?`
      intent = 'Evaluating container orchestration, ingress traffic shifting, health checks, and automated reliability engineering.'
      keyPoints = ['Canary deployment controller (Argo Rollouts or Flagger)', 'Traffic shifting via Service Mesh or Ingress', 'Automated metrics analysis thresholds', 'Data migration backward compatibility during rollout']
    } else {
      techQuestion = `In your recent work with ${primarySkill} and ${secondarySkill}, explain how you handle database connection pooling, query concurrency, and deadlock resolution when traffic spikes by 10x unexpectedly.`
      intent = 'Evaluating backend engineering maturity, database internals, connection pool sizing, and locking mechanisms.'
      keyPoints = ['Connection pool configuration (e.g., HikariCP, PgBouncer)', 'Optimistic vs pessimistic locking trade-offs', 'Database indexing and slow query execution plans', 'Circuit breakers and graceful degradation under load']
    }

    questions.push({
      id: 'q-2',
      questionIndex: questions.length + 1,
      roundType: type,
      category: 'technical',
      interviewerPersona: 'Dr. Marcus Vance',
      interviewerTitle: `Senior Principal Engineer at ${company}`,
      questionText: techQuestion,
      recruiterIntent: intent,
      suggestedKeyPoints: keyPoints,
      followUps: [
        `Why did you prioritize that specific mitigation over an asynchronous queue buffer like Kafka?`,
        `How would this approach change if strict ACID consistency was required across two distinct microservices?`
      ],
      difficulty: input.difficulty
    })
  }

  // Question 3: Coding / Data Structures & Algorithms Problem
  if (type === 'complete' || type === 'coding') {
    questions.push({
      id: 'q-3',
      questionIndex: questions.length + 1,
      roundType: 'coding',
      category: 'dsa',
      interviewerPersona: 'Elena Rostova',
      interviewerTitle: `Staff Software Engineer at ${company}`,
      questionText: `Design and implement an in-memory Key-Value Cache with Time-To-Live (TTL) expiration and Least Recently Used (LRU) eviction when capacity limit K is reached. All get(key) and set(key, value, ttl) operations must operate in O(1) average time complexity. Please explain your approach before writing the solution.`,
      recruiterIntent: 'Evaluating algorithmic data structure design, time/space complexity guarantees, concurrency edge cases, and clean modular code.',
      suggestedKeyPoints: [
        'Hash Map for O(1) key-to-node lookup',
        'Doubly Linked List for O(1) node insertion, removal, and MRU update',
        'TTL eviction strategy (lazy eviction on access vs background cleanup daemon)',
        'Edge cases: capacity = 0, updating existing keys, expired keys access'
      ],
      followUps: [
        'How would you make this data structure thread-safe for thousands of concurrent reader and writer threads without global lock contention?',
        'What are the memory overheads of maintaining bidirectional pointers in the doubly linked list at 10 million keys scale?'
      ],
      difficulty: input.difficulty,
      codeTemplate: `class LRUCacheWithTTL {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.map = new Map(); // key -> { value, expiresAt, node }\n    // Initialize Doubly Linked List head & tail\n  }\n\n  get(key) {\n    // Return value if valid and not expired, update LRU order\n    // Return -1 if not found or expired\n  }\n\n  set(key, value, ttlMs) {\n    // Insert or update key, evict LRU if capacity exceeded\n  }\n}`,
      expectedComplexity: 'Time Complexity: O(1) for both get and set. Space Complexity: O(Capacity).'
    })
  }

  // Question 4: Scalable System Design Round
  if (type === 'complete' || type === 'system_design' || type === 'technical' || type === 'case_study') {
    questions.push({
      id: 'q-4',
      questionIndex: questions.length + 1,
      roundType: 'system_design',
      category: 'system_design',
      interviewerPersona: 'Vikram Sethi',
      interviewerTitle: `Director of Cloud Infrastructure at ${company}`,
      questionText: `Design a global, fault-tolerant Rate Limiter service for ${company}'s API gateway, capable of handling 500,000 requests per second across 3 continents with under 2ms verification latency per request. How do you handle distributed state, synchronization between regions, and network partition failures?`,
      recruiterIntent: 'Assessing high-level architecture decomposition, distributed algorithms (Token Bucket, Sliding Window Log, Leaky Bucket), caching strategies, and CAP theorem trade-offs.',
      suggestedKeyPoints: [
        'Algorithm selection (Token Bucket or Sliding Window Counter in Redis via Lua script)',
        'Decentralized in-memory local token cache with asynchronous batch synchronization',
        'Multi-region replication topology and eventual consistency strategy',
        'Graceful failure policy: Fail-Open vs Fail-Closed when rate limiter cluster is unreachable'
      ],
      followUps: [
        'If the Redis cluster in Region A suffers a network partition from Region B, do you prioritize strict rate limits or user availability?',
        'How do you prevent malicious burst attacks that try to flood the rate limiter itself?'
      ],
      difficulty: input.difficulty,
      systemDesignConstraints: [
        '500,000 requests per second total peak traffic',
        '< 2ms verification latency p99',
        'Multi-region active-active deployment (US, Europe, Asia)',
        'Granular rules: per IP, per User ID, per API Token'
      ]
    })
  }

  // Question 5: Behavioral & STAR Leadership Round
  if (type === 'complete' || type === 'behavioral' || type === 'managerial' || type === 'final_hr') {
    questions.push({
      id: 'q-5',
      questionIndex: questions.length + 1,
      roundType: 'behavioral',
      category: 'behavioral',
      interviewerPersona: 'Priya Nambiar',
      interviewerTitle: `Engineering Manager & Hiring Lead at ${company}`,
      questionText: `Tell me about a specific time when you discovered a critical architectural flaw or security vulnerability in a project that was scheduled to ship within 48 hours. How did you communicate this to your team and stakeholders, what trade-offs did you negotiate, and what was the quantifiable end result?`,
      recruiterIntent: 'Testing moral courage, stakeholder negotiation under tight pressure, STAR structured storytelling, and bias for calculated action.',
      suggestedKeyPoints: [
        'Situation: Context of the upcoming launch and nature of the vulnerability/flaw',
        'Task: Your responsibility and the risk to the business if released unnoticed',
        'Action: How you presented actionable options (hotfix vs delay vs partial rollout) to stakeholders calmly',
        'Result: Concrete outcome (zero customer downtime, clean post-mortem, team post-launch retrospective)'
      ],
      followUps: [
        'How did you prevent that category of issue from ever recurring in the development lifecycle?',
        'If a product manager insisted on shipping regardless of your warning, what would have been your exact next step?'
      ],
      difficulty: input.difficulty
    })
  }

  // Question 6: Cultural Alignment & Candidate Vision
  if (type === 'complete' || type === 'hr' || type === 'final_hr') {
    questions.push({
      id: 'q-6',
      questionIndex: questions.length + 1,
      roundType: 'final_hr',
      category: 'hr',
      interviewerPersona: 'Rachel Sterling',
      interviewerTitle: `Global Head of Engineering Talent at ${company}`,
      questionText: `We have thousands of applicants for this ${role} position. Why are you choosing to invest your career at ${company} specifically at this moment, what unique technical strength will you bring to our team on Day 30, and what questions do you have for us?`,
      recruiterIntent: 'Evaluating authentic motivation, company domain knowledge, self-awareness, and intellectual curiosity through reverse interview questions.',
      suggestedKeyPoints: [
        `Genuine knowledge of ${company}'s products, mission, and current engineering challenges`,
        'Immediate 30-day value: quick ramp-up, team unblocking, domain expertise',
        'Long-term growth aspiration aligned with the organization',
        'Thoughtful, strategic reverse questions for the interviewer'
      ],
      followUps: [
        'What kind of engineering management style brings out your highest creativity and performance?',
        'What are your primary criteria when choosing between multiple competing offers?'
      ],
      difficulty: input.difficulty
    })
  }

  return questions
}

/**
 * Generates an intelligent, context-aware recruiter follow-up question
 */
export function generateIntelligentFollowUp(
  question: InterviewQuestion,
  answer: string,
  input: InterviewInput
): string {
  const lower = answer.toLowerCase().trim()
  const company = input.company || 'our team'

  if (question.category === 'dsa') {
    if (/hash map|hashmap|map/i.test(lower)) {
      return `Good catch on using a hash map. But how do you handle hash collisions under adversarial inputs, and what is your resize reallocation policy when load factor crosses 0.75?`
    }
    if (/linked list|pointers/i.test(lower)) {
      return `In your doubly linked list node structure, how do you prevent memory fragmentation when nodes are continuously allocated and deallocated at scale?`
    }
    return `That works, but what is the exact worst-case space complexity if all keys expire at the exact same millisecond?`
  }

  if (question.category === 'system_design') {
    if (/redis/i.test(lower)) {
      return `You mentioned using Redis for rate limiting counters. How do you prevent the "Thundering Herd" problem if your primary Redis instance crashes and restarts?`
    }
    if (/kafka|queue/i.test(lower)) {
      return `When using a message queue, what is your dead-letter queue (DLQ) retry protocol if consumer nodes fail to acknowledge message processing within the timeout window?`
    }
    return `How does your design guarantee zero data loss if two geographic regions become completely partitioned by an undersea cable cut?`
  }

  if (question.category === 'behavioral') {
    if (!/result|metric|\$|%|increase|decrease|saved/i.test(lower)) {
      return `That covers the situation and actions well, but what was the measurable business result? Could you quantify the impact in terms of latency, team hours saved, or reliability?`
    }
    return `Looking back at that scenario with the wisdom of hindsight, what is one specific action you would execute differently today?`
  }

  // Default intelligent follow-up
  if (lower.length < 120) {
    return `Could you expand on the technical rationale behind that decision? What alternative approaches did you evaluate and reject before settling on this solution?`
  }

  return `That makes sense. How would your architecture adapt if ${company}'s user base suddenly grew from 100,000 to 10 million concurrent users next month?`
}

/**
 * Evaluates an individual candidate answer with enterprise precision
 */
export function evaluateAnswer(
  question: InterviewQuestion,
  answer: string,
  input: InterviewInput
): QuestionEvaluation {
  const trimmed = answer.trim()
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length

  // Base heuristics
  let score = 50
  let commScore = 50
  let techScore = 50
  let confScore = 50
  let probScore = 50
  let grammarScore = 70

  const strengths: string[] = []
  const weaknesses: string[] = []
  const missingPoints: string[] = []
  const tips: string[] = []

  // Length & depth scoring
  if (wordCount < 25) {
    weaknesses.push('Answer is too brief to demonstrate technical depth or clear engineering ownership.')
    score = Math.max(30, score - 20)
    commScore -= 20
    techScore -= 25
    tips.push('Aim for at least 100-200 words in technical and behavioral responses to adequately explain context and trade-offs.')
  } else if (wordCount >= 80 && wordCount <= 350) {
    strengths.push('Well-structured response length with balanced context and substantive details.')
    score += 15
    commScore += 15
    confScore += 15
  } else if (wordCount > 350) {
    strengths.push('Extremely thorough answer covering multiple architectural considerations.')
    score += 10
    commScore -= 5 // slightly verbose
    tips.push('Keep responses concise; senior interviewers value punchy, structured clarity over long monologues.')
  }

  // Technical keyword presence
  const techBuzzwords = [
    'latency', 'throughput', 'concurrency', 'scalability', 'cache', 'database',
    'index', 'asynchronous', 'trade-off', 'architecture', 'resilience',
    'monitoring', 'metrics', 'pipeline', 'sharding', 'consistency', 'acid'
  ]
  const matchedKeywords = techBuzzwords.filter(kw => answer.toLowerCase().includes(kw))
  if (matchedKeywords.length >= 3) {
    strengths.push(`Strong engineering vocabulary demonstrated (${matchedKeywords.slice(0, 4).join(', ')}).`)
    techScore += 20
    probScore += 15
    score += 10
  } else {
    weaknesses.push('Could incorporate more engineering terminology and system constraints.')
    techScore -= 10
    tips.push('Explicitly name system trade-offs (e.g. latency vs consistency, read vs write heavy).')
  }

  // STAR Method assessment for behavioral & project questions
  const isBehavioral = question.category === 'behavioral' || question.category === 'project_deep_dive'
  let starAssessment: QuestionEvaluation['starMethodAssessment'] = undefined

  if (isBehavioral) {
    const hasSituation = /situation|context|project was|company was|at that time|when i/i.test(answer)
    const hasTask = /task|goal|objective|challenge|my role|responsible for/i.test(answer)
    const hasAction = /i built|i designed|i implemented|i led|i decided|action|step/i.test(answer)
    const hasResult = /result|outcome|metric|improved|reduced|increased|\%|\$/i.test(answer)

    starAssessment = {
      situation: hasSituation,
      task: hasTask,
      action: hasAction,
      result: hasResult,
      notes: ''
    }

    const starCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length
    if (starCount >= 3) {
      strengths.push('Excellently structured response following the STAR (Situation, Task, Action, Result) methodology.')
      commScore += 20
      confScore += 15
      score += 15
    } else {
      weaknesses.push('Response lacks a distinct STAR structure—ensure you explicitly highlight the quantifiable Result.')
      commScore -= 10
      tips.push('Structure your answer: 1. Situation (15s) 2. Task (15s) 3. Action (60s) 4. Quantifiable Result (30s).')
    }
  }

  // Check suggested key points
  question.suggestedKeyPoints.forEach(point => {
    const keywords = point.toLowerCase().split(/\s+/).filter(w => w.length > 4)
    const matched = keywords.some(k => answer.toLowerCase().includes(k))
    if (!matched && missingPoints.length < 3) {
      missingPoints.push(point)
    }
  })

  // Normalize scores between 20 and 98
  score = Math.min(98, Math.max(25, score))
  commScore = Math.min(98, Math.max(25, commScore))
  techScore = Math.min(98, Math.max(25, techScore))
  confScore = Math.min(98, Math.max(25, confScore))
  probScore = Math.min(98, Math.max(25, probScore))
  grammarScore = Math.min(98, Math.max(50, grammarScore))

  // Generate Better Answer & Ideal Recruiter Answer
  const betterAnswer = `A stronger version of your answer should emphasize architectural trade-offs immediately: "When tackling ${question.suggestedKeyPoints[0] || 'this architecture'}, my primary focus was balancing low latency against operational resilience. Specifically, I prioritized ${question.suggestedKeyPoints[1] || 'modular components'} and verified the system under synthetic load testing to ensure high reliability."`

  const idealRecruiterAnswer = `“To solve this effectively at ${input.company}, I approach it through three systematic layers: First, ${question.suggestedKeyPoints[0] || 'clarifying requirements and setting SLA bounds'}. Second, ${question.suggestedKeyPoints[1] || 'designing a decoupled architecture with caching and failover mechanisms'}. Third, ${question.suggestedKeyPoints[2] || 'implementing automated monitoring metrics (p99 latency, error rates)'}. In my previous implementation, this approach reduced incident rates by 40% and maintained 99.99% availability during peak traffic spikes.”`

  if (tips.length === 0) {
    tips.push('Maintain an authoritative yet collaborative tone; emphasize why you chose this path over alternatives.')
  }

  return {
    score,
    communicationRating: commScore,
    technicalAccuracy: techScore,
    confidenceScore: confScore,
    problemSolvingScore: probScore,
    grammarProfessionalism: grammarScore,
    strengths: strengths.length > 0 ? strengths : ['Clear attempt at addressing the prompt with direct intent.'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['Could articulate specific production scale numbers and failure recovery protocols.'],
    missingPoints: missingPoints.length > 0 ? missingPoints : ['Operational metrics monitoring and SLA guarantees.'],
    betterAnswer,
    idealRecruiterAnswer,
    improvementTips: tips,
    starMethodAssessment: starAssessment
  }
}

/**
 * Aggregates all answered questions into a comprehensive overall interview evaluation
 */
export function compileOverallInterviewResult(
  input: InterviewInput,
  questions: InterviewQuestion[],
  durationMinutes: number = 25
): OverallInterviewResult {
  const answeredQuestions = questions.filter(q => q.evaluation && q.userAnswer)
  const count = answeredQuestions.length || 1

  const avgScore = Math.round(
    answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.score || 50), 0) / count
  )
  const avgTech = Math.round(
    answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.technicalAccuracy || 50), 0) / count
  )
  const avgComm = Math.round(
    answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.communicationRating || 50), 0) / count
  )
  const avgProb = Math.round(
    answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.problemSolvingScore || 50), 0) / count
  )
  const avgConf = Math.round(
    answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.confidenceScore || 50), 0) / count
  )
  const avgGrammar = Math.round(
    answeredQuestions.reduce((acc, q) => acc + (q.evaluation?.grammarProfessionalism || 70), 0) / count
  )

  let verdict: HireVerdict = 'Needs Improvement'
  let impression = ''

  if (avgScore >= 85) {
    verdict = 'Strong Hire'
    impression = `Exceptional candidate performance for ${input.jobRole} at ${input.company}. Demonstrated elite technical accuracy, concise executive communication, and deep architectural ownership.`
  } else if (avgScore >= 72) {
    verdict = 'Hire'
    impression = `Solid engineering fundamentals with strong domain fluency. The candidate meets the hiring bar for ${input.company} with sound problem-solving and good collaborative presence.`
  } else if (avgScore >= 58) {
    verdict = 'Leaning Hire'
    impression = `Promising candidate with good foundational instincts, though some answers lacked quantitative depth on scalability and edge-case resilience. Suitable for follow-up evaluation.`
  } else {
    verdict = 'Needs Improvement'
    impression = `Candidate struggled to provide detailed technical solutions or structured STAR examples under interview conditions. Recommend dedicated preparation on core DSA, system design, and communication.`
  }

  const allStrengths = answeredQuestions.flatMap(q => q.evaluation?.strengths || [])
  const allWeaknesses = answeredQuestions.flatMap(q => q.evaluation?.weaknesses || [])
  const companyInsights = getCompanyInterviewInsights(input.company)

  return {
    id: `interview-${Date.now()}`,
    createdAt: new Date().toISOString(),
    input,
    overallScore: avgScore,
    verdict,
    recruiterImpression: impression,
    metrics: {
      technicalAccuracy: avgTech,
      communication: avgComm,
      problemSolving: avgProb,
      confidence: avgConf,
      starMethod: Math.round((avgComm + avgConf) / 2),
      leadership: Math.round((avgProb + avgScore) / 2),
      grammarProfessionalism: avgGrammar
    },
    questions,
    companyInsights,
    strengthsSummary: Array.from(new Set(allStrengths)).slice(0, 5),
    weaknessesSummary: Array.from(new Set(allWeaknesses)).slice(0, 5),
    actionableNextSteps: [
      `Review ${companyInsights.mostTestedSkills.slice(0, 2).join(' and ')} frequently tested at ${input.company}.`,
      'Practice answers using the strict 4-part STAR structure (Situation, Task, Action, Measurable Result).',
      'For system design, always state throughput, storage estimations, and failure modes upfront.',
      'Re-attempt this mock session focusing on deeper follow-up explanations.'
    ],
    durationMinutes
  }
}
