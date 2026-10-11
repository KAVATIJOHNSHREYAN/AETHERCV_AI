import { FormattingAnalysisResult } from './types'

function countSyllables(word: string): number {
  word = word.toLowerCase().trim()
  if (word.length <= 3) return 1
  word = word.replace(/(?:[^laeiouy]|ed|es|e)$/, '')
  word = word.replace(/^y/, '')
  const syllables = word.match(/[aeiouy]{1,2}/g)
  return syllables ? Math.max(1, syllables.length) : 1
}

export function analyzeFormatting(rawText: string): FormattingAnalysisResult {
  const words = rawText.split(/\s+/).filter(w => w.trim().length > 0)
  const wordCount = words.length
  const characterCount = rawText.length

  // Estimated page count (standard 450 words per single page)
  const estimatedPages = Math.max(1, Math.round((wordCount / 450) * 10) / 10)
  const readingTimeMinutes = Math.max(1, Math.round(wordCount / 200))

  // Sentences
  const sentences = rawText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5)
  const sentenceCount = Math.max(1, sentences.length)
  const averageSentenceLength = Math.round((wordCount / sentenceCount) * 10) / 10

  // Bullet point count
  const bulletMatches = rawText.match(/^[•\-\*]\s+|\n[•\-\*]\s+|\n\d+\.\s+/gm)
  const bulletPointCount = bulletMatches ? bulletMatches.length : 0

  // Paragraph density analysis
  const paragraphs = rawText.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  let largeParagraphCount = 0
  paragraphs.forEach(p => {
    const pWords = p.trim().split(/\s+/).length
    if (pWords > 65 && !/^[•\-\*]/m.test(p)) {
      largeParagraphCount++
    }
  })
  const paragraphDensityWarning = largeParagraphCount > 0

  // Flesch Reading Ease Formula: 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  let totalSyllables = 0
  words.forEach(w => {
    totalSyllables += countSyllables(w)
  })
  const syllablesPerWord = totalSyllables / Math.max(1, wordCount)
  const fleschReadingEase = Math.max(
    0,
    Math.min(100, Math.round(206.835 - 1.015 * averageSentenceLength - 84.6 * syllablesPerWord))
  )

  let readabilityGrade = 'College Level (Professional)'
  if (fleschReadingEase >= 60) readabilityGrade = 'Standard / Clean (Optimal for Quick Scan)'
  else if (fleschReadingEase >= 40) readabilityGrade = 'Technical / Dense'
  else readabilityGrade = 'Highly Complex / Academic'

  // Section order check (Optimal: Header -> Summary -> Education/Experience -> Skills -> Projects)
  const lowerText = rawText.toLowerCase()
  const summaryIdx = lowerText.indexOf('summary')
  const expIdx = lowerText.indexOf('experience')
  const skillIdx = lowerText.indexOf('skill')
  const eduIdx = lowerText.indexOf('education')

  let sectionOrderOptimal = true
  if (summaryIdx !== -1 && expIdx !== -1 && summaryIdx > expIdx) {
    sectionOrderOptimal = false
  }

  // Whitespace balance score (0-100)
  let whitespaceScore = 85
  if (paragraphDensityWarning) whitespaceScore -= 20
  if (bulletPointCount < 5) whitespaceScore -= 15
  if (wordCount < 250 || wordCount > 900) whitespaceScore -= 15
  const whitespaceBalanceScore = Math.max(20, Math.min(100, whitespaceScore))

  // Warnings & Positives
  const warnings: string[] = []
  const positives: string[] = []

  if (wordCount > 850) {
    warnings.push(`Resume word count (${wordCount} words) spans ~${estimatedPages} pages. For < 5 years experience, restrict to a clean 1-page format (under 600 words).`)
  } else if (wordCount < 250) {
    warnings.push(`Resume word count (${wordCount} words) is too sparse. Elaborate on project deliverables and technical achievements.`)
  } else {
    positives.push(`Optimal resume length (${wordCount} words, ~${estimatedPages} page format).`)
  }

  if (paragraphDensityWarning) {
    warnings.push(`Found ${largeParagraphCount} dense text block(s) exceeding 65 words. Convert lengthy narrative into structured bullet points.`)
  } else {
    positives.push('Well-balanced paragraph density and clean scannability.')
  }

  if (bulletPointCount < 6) {
    warnings.push(`Only ${bulletPointCount} bullet points detected. Recruiters prefer skimmable bullet points over block text.`)
  } else {
    positives.push(`Strong bullet usage (${bulletPointCount} bullet points) enhances human and ATS scannability.`)
  }

  if (!sectionOrderOptimal) {
    warnings.push('Consider moving your Professional Summary above your Work Experience for conventional hiring manager readability.')
  }

  const bulletToParagraphRatio = Math.round((bulletPointCount / Math.max(1, paragraphs.length)) * 10) / 10

  return {
    estimatedPages,
    wordCount,
    characterCount,
    readingTimeMinutes,
    bulletPointCount,
    bulletToParagraphRatio,
    averageSentenceLength,
    fleschReadingEase,
    readabilityGrade,
    sectionOrderOptimal,
    paragraphDensityWarning,
    whitespaceBalanceScore,
    warnings,
    positives
  }
}
