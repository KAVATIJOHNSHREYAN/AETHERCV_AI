import { ActionVerbAnalysisResult } from './types'

export const POWER_ACTION_VERBS = [
  'developed', 'designed', 'implemented', 'optimized', 'built', 'created', 'managed',
  'improved', 'generated', 'engineered', 'architected', 'spearheaded', 'orchestrated',
  'deployed', 'refactored', 'streamlined', 'automated', 'integrated', 'delivered',
  'reduced', 'increased', 'accelerated', 'formulated', 'established', 'standardized',
  'programmed', 'debugged', 'configured', 'transformed', 'executed', 'championed',
  'pioneered', 'centralized', 'consolidated', 'modernized', 'authored', 'mentored'
]

const WEAK_VERB_ALTERNATIVES: Record<string, string> = {
  'made': 'Engineered / Constructed / Fabricated',
  'did': 'Executed / Implemented / Delivered',
  'helped': 'Spearheaded / Co-led / Accelerated',
  'worked': 'Collaborated / Developed / Architected',
  'handled': 'Orchestrated / Managed / Administered',
  'looked after': 'Oversaw / Directed / Supervised',
  'fixed': 'Resolved / Debugged / Rectified',
  'changed': 'Refactored / Revamped / Optimized',
  'used': 'Leveraged / Deployed / Utilized',
  'got': 'Secured / Attained / Generated'
}

export function analyzeActionVerbs(rawText: string): ActionVerbAnalysisResult {
  const sentences = rawText.split(/[.\n•\-*]+/).map(s => s.trim()).filter(s => s.length > 10)
  const lowerText = rawText.toLowerCase()
  
  const frequencyMap: Record<string, number> = {}
  let totalCount = 0

  POWER_ACTION_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'gi')
    const matches = lowerText.match(regex)
    if (matches && matches.length > 0) {
      frequencyMap[verb] = matches.length
      totalCount += matches.length
    }
  })

  const uniqueVerbsFound = Object.keys(frequencyMap)

  // Calculate density: percentage of bullet points/sentences that start with or contain a strong action verb
  let sentencesWithVerbs = 0
  sentences.forEach(s => {
    const sLower = s.toLowerCase()
    const hasVerb = POWER_ACTION_VERBS.some(v => new RegExp(`\\b${v}\\b`).test(sLower))
    if (hasVerb) sentencesWithVerbs++
  })

  const densityScore = sentences.length > 0 ? Math.round((sentencesWithVerbs / sentences.length) * 100) : 0

  // Detect weak verbs
  const weakVerbsUsed: { verb: string; suggestedReplacement: string }[] = []
  Object.entries(WEAK_VERB_ALTERNATIVES).forEach(([weakVerb, suggested]) => {
    const regex = new RegExp(`\\b${weakVerb}\\b`, 'i')
    if (regex.test(lowerText)) {
      weakVerbsUsed.push({
        verb: weakVerb,
        suggestedReplacement: suggested
      })
    }
  })

  const suggestions: string[] = []
  if (uniqueVerbsFound.length < 5) {
    suggestions.push('Elevate resume impact by using diverse power verbs like "Spearheaded", "Architected", and "Orchestrated".')
  }
  if (densityScore < 60) {
    suggestions.push(`Action verb density is ${densityScore}%. Aim for at least 75% of your bullet points starting with an active power verb.`)
  }
  if (weakVerbsUsed.length > 0) {
    weakVerbsUsed.slice(0, 3).forEach(w => {
      suggestions.push(`Replace "${w.verb}" with "${w.suggestedReplacement}".`)
    })
  }

  return {
    totalCount,
    uniqueVerbsFound,
    frequencyMap,
    densityScore,
    weakVerbsUsed,
    suggestions
  }
}
