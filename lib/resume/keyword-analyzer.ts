import { KeywordAnalysisResult } from './types'

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself',
  'yourselves', 'also', 'using', 'used', 'well', 'etc', 'including', 'across', 'within', 'year', 'years'
])

const INDUSTRY_BENCHMARK_KEYWORDS = [
  'restful api', 'microservices', 'ci/cd', 'cloud', 'scalability', 'performance optimization',
  'unit testing', 'agile', 'git', 'full stack', 'backend', 'frontend', 'database', 'security',
  'docker', 'aws', 'kubernetes', 'system design', 'distributed systems', 'automation'
]

const WEAK_WORDS_MAP: Record<string, { reason: string; replacement: string }> = {
  'worked on': { reason: 'Passive and lacks ownership of outcome.', replacement: 'Engineered / Implemented' },
  'helped': { reason: 'Diminishes your individual contribution.', replacement: 'Spearheaded / Co-led' },
  'assisted': { reason: 'Sounds junior and secondary.', replacement: 'Collaborated on / Executed' },
  'responsible for': { reason: 'Describes job duty, not impact.', replacement: 'Managed / Delivered' },
  'handled': { reason: 'Vague operational phrase.', replacement: 'Orchestrated / Resolved' },
  'tried': { reason: 'Implies unverified result.', replacement: 'Pioneered / Validated' },
  'did': { reason: 'Unprofessional basic phrasing.', replacement: 'Constructed / Authored' },
  'participated in': { reason: 'Passive role attribution.', replacement: 'Contributed to / Partnered with' },
  'familiar with': { reason: 'Weak claim of expertise.', replacement: 'Proficient in / Certified in' },
  'hardworking': { reason: 'Cliché buzzword without proof.', replacement: 'Demonstrated consistent delivery in' },
  'team player': { reason: 'Overused vague buzzword.', replacement: 'Cross-functional collaborator' }
}

export function analyzeKeywords(rawText: string, identifiedSkills: string[]): KeywordAnalysisResult {
  const cleanText = rawText.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ')
  const tokens = cleanText.split(/\s+/).filter(t => t.length > 2 && !STOP_WORDS.has(t))

  // Word frequency map
  const frequencyMap: Record<string, number> = {}
  tokens.forEach(tok => {
    frequencyMap[tok] = (frequencyMap[tok] || 0) + 1
  })

  // Sort by frequency
  const sortedWords = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .filter(([word]) => !/^\d+$/.test(word))

  const mostFrequent = sortedWords.slice(0, 12).map(([word, count]) => ({ word, count }))

  // Overused duplicate words (> 5 times in a single page resume)
  const duplicateKeywords = sortedWords
    .filter(([word, count]) => count >= 6 && !identifiedSkills.some(s => s.toLowerCase() === word))
    .slice(0, 6)
    .map(([word, count]) => ({ word, count }))

  // Weak keywords detected
  const weakKeywords: { word: string; reason: string; replacement: string }[] = []
  const lowerText = rawText.toLowerCase()
  Object.entries(WEAK_WORDS_MAP).forEach(([phrase, info]) => {
    if (lowerText.includes(phrase)) {
      weakKeywords.push({
        word: phrase,
        reason: info.reason,
        replacement: info.replacement
      })
    }
  })

  // Missing important keywords
  const missingImportant = INDUSTRY_BENCHMARK_KEYWORDS.filter(kw => !lowerText.includes(kw))

  // Strong keywords detected
  const strongKeywords = INDUSTRY_BENCHMARK_KEYWORDS.filter(kw => lowerText.includes(kw))

  // Actionable suggestions
  const suggestions: string[] = []
  if (weakKeywords.length > 0) {
    suggestions.push(`Swap passive terms like "${weakKeywords.slice(0, 2).map(w => w.word).join(', ')}" for assertive, outcome-focused power verbs.`)
  }
  if (duplicateKeywords.length > 0) {
    suggestions.push(`The word "${duplicateKeywords[0].word}" is repeated ${duplicateKeywords[0].count} times. Vary your vocabulary using synonyms.`)
  }
  if (missingImportant.length > 0) {
    suggestions.push(`Integrate relevant high-value technical keywords such as: ${missingImportant.slice(0, 4).join(', ')}.`)
  }

  return {
    mostFrequent,
    missingImportant,
    duplicateKeywords,
    weakKeywords,
    strongKeywords,
    suggestions
  }
}
