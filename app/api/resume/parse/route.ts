import { NextRequest, NextResponse } from 'next/server'
import zlib from 'zlib'
import { parseRawResume } from '@/lib/resume/parser'
import { analyzeFormatting } from '@/lib/resume/formatting-analyzer'
import { analyzeActionVerbs } from '@/lib/resume/action-verb-analyzer'
import { analyzeKeywords } from '@/lib/resume/keyword-analyzer'
import { calculateAtsScore } from '@/lib/resume/ats-engine'
import { generateAIFeedback } from '@/lib/resume/ai-engine'
import { detectSectionsStatus } from '@/lib/resume/parser'
import { extractSections } from '@/lib/resume/parser'
import { validateIsResume } from '@/lib/resume/validator'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

/**
 * Extracts plain text from a PDF buffer using multiple fallback strategies.
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  console.log('[Resume Parse] [Stage 3: PDF] Initializing PDF text extraction pipeline...')

  // Strategy 1: pdf-parse v2 (PDFParse class instance)
  try {
    const pdfPkg = require('pdf-parse')
    if (typeof pdfPkg.PDFParse === 'function') {
      console.log('[Resume Parse] [Stage 3: PDF] Using PDFParse class strategy...')
      const parser = new pdfPkg.PDFParse({ data: buffer })
      const result = await parser.getText()
      if (typeof parser.destroy === 'function') {
        await parser.destroy()
      }
      if (result && result.text && result.text.trim().length > 0) {
        console.log(`[Resume Parse] [Stage 3: PDF] Strategy 1 success: extracted ${result.text.length} chars.`)
        return result.text.trim()
      }
    }
  } catch (err: any) {
    console.warn('[Resume Parse] [Stage 3: PDF] Strategy 1 (PDFParse class) failed:', err.message)
  }

  // Strategy 2: Legacy pdf-parse v1 function
  try {
    const pdfPkg = require('pdf-parse')
    const fn = typeof pdfPkg === 'function' ? pdfPkg : pdfPkg.default
    if (typeof fn === 'function') {
      console.log('[Resume Parse] [Stage 3: PDF] Using legacy pdf-parse function strategy...')
      const result = await fn(buffer)
      if (result && result.text && result.text.trim().length > 0) {
        console.log(`[Resume Parse] [Stage 3: PDF] Strategy 2 success: extracted ${result.text.length} chars.`)
        return result.text.trim()
      }
    }
  } catch (err: any) {
    console.warn('[Resume Parse] [Stage 3: PDF] Strategy 2 (legacy function) failed:', err.message)
  }

  // Strategy 3: FlateDecode Stream Decompressor
  try {
    console.log('[Resume Parse] [Stage 3: PDF] Running Strategy 3 (FlateDecode Stream Decompressor)...')
    const { decodePdfFlateStreams } = require('@/lib/resume/pdf-stream-decoder')
    const extracted = decodePdfFlateStreams(buffer)
    if (extracted && extracted.length > 20) {
      console.log(`[Resume Parse] [Stage 3: PDF] Strategy 3 success: extracted ${extracted.length} chars.`)
      return extracted
    }
  } catch (err: any) {
    console.warn('[Resume Parse] [Stage 3: PDF] Strategy 3 failed:', err.message)
  }

  // Strategy 4: Direct printable string extractor
  try {
    const raw = buffer.toString('latin1')
    const words = raw.match(/[A-Za-z0-9@.+#/-]{3,}/g) || []
    if (words.length > 30) {
      const candidateText = words.join(' ')
      if (candidateText.length > 80) {
        console.log(`[Resume Parse] [Stage 3: PDF] Strategy 4 (Printable strings) success: extracted ${candidateText.length} chars.`)
        return candidateText
      }
    }
  } catch (err: any) {
    console.warn('[Resume Parse] [Stage 3: PDF] Strategy 4 failed:', err.message)
  }

  throw new Error('Could not extract text from PDF. The document may be an image scan, encrypted, or password-protected.')
}

/**
 * Extracts plain text from a DOCX buffer using mammoth with a direct PKZip XML fallback.
 */
async function extractDocxText(buffer: Buffer): Promise<string> {
  console.log('[Resume Parse] [Stage 3: DOCX] Initializing DOCX text extraction pipeline...')

  // Strategy 1: Mammoth
  try {
    const mammoth = require('mammoth')
    const result = await mammoth.extractRawText({ buffer })
    if (result && result.value && result.value.trim().length > 0) {
      console.log(`[Resume Parse] [Stage 3: DOCX] Mammoth success: extracted ${result.value.length} chars.`)
      return result.value.trim()
    }
  } catch (err: any) {
    console.warn('[Resume Parse] [Stage 3: DOCX] Mammoth strategy error:', err.message)
  }

  // Strategy 2: Direct word/document.xml ZIP decompression fallback
  try {
    console.log('[Resume Parse] [Stage 3: DOCX] Running Strategy 2 (Direct ZIP document.xml extractor)...')
    let offset = 0
    while (offset < buffer.length - 30) {
      if (
        buffer[offset] === 0x50 &&
        buffer[offset + 1] === 0x4b &&
        buffer[offset + 2] === 0x03 &&
        buffer[offset + 3] === 0x04
      ) {
        const compMethod = buffer.readUInt16LE(offset + 8)
        const compSize = buffer.readUInt32LE(offset + 18)
        const nameLen = buffer.readUInt16LE(offset + 26)
        const extraLen = buffer.readUInt16LE(offset + 28)
        const filename = buffer.toString('utf-8', offset + 30, offset + 30 + nameLen)
        const dataStart = offset + 30 + nameLen + extraLen

        if (filename === 'word/document.xml') {
          const compressedData = buffer.subarray(dataStart, dataStart + compSize)
          let xml = ''
          if (compMethod === 8) {
            xml = zlib.inflateRawSync(compressedData).toString('utf-8')
          } else if (compMethod === 0) {
            xml = compressedData.toString('utf-8')
          }

          if (xml) {
            const cleanText = xml
              .replace(/<w:p[^>]*>/g, '\n')
              .replace(/<[^>]+>/g, '')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'")
              .trim()

            if (cleanText.length > 20) {
              console.log(`[Resume Parse] [Stage 3: DOCX] Strategy 2 success: extracted ${cleanText.length} chars.`)
              return cleanText
            }
          }
        }
        offset = dataStart + compSize
      } else {
        offset++
      }
    }
  } catch (err: any) {
    console.warn('[Resume Parse] [Stage 3: DOCX] Strategy 2 failed:', err.message)
  }

  throw new Error('Could not parse DOCX document. File might be corrupted or in an unsupported format.')
}

export async function POST(req: NextRequest) {
  const requestStartTime = Date.now()

  try {
    const contentType = req.headers.get('content-type') || ''
    console.log(`[Resume Parse] [Stage 1: Ingestion] Incoming request, contentType="${contentType}"`)

    let textContent = ''
    let fileName = 'resume.txt'
    let fileSize = 0
    let fileType = 'text/plain'

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      const directText = formData.get('text') as string | null

      if (directText && directText.trim().length > 0) {
        textContent = directText.trim()
        fileName = (formData.get('fileName') as string) || 'pasted-resume.txt'
        fileSize = Buffer.byteLength(textContent, 'utf-8')
        fileType = 'text/plain'
        console.log(`[Resume Parse] [Stage 1: Ingestion] Direct text submission, length=${textContent.length}`)
      } else if (file) {
        fileName = file.name || 'document.pdf'
        fileSize = file.size
        fileType = file.type || 'application/octet-stream'
        console.log(`[Resume Parse] [Stage 1: Ingestion] File upload received: name="${fileName}", size=${fileSize} bytes, type="${fileType}"`)

        // Validate File Size
        if (fileSize > MAX_FILE_SIZE) {
          return NextResponse.json(
            {
              error: `File size (${(fileSize / (1024 * 1024)).toFixed(2)}MB) exceeds 10MB limit.`,
              stage: 'file_validation'
            },
            { status: 400 }
          )
        }

        if (fileSize === 0) {
          return NextResponse.json(
            {
              error: 'Uploaded file is completely empty (0 bytes).',
              stage: 'file_validation'
            },
            { status: 400 }
          )
        }

        // Convert File to Buffer
        console.log('[Resume Parse] [Stage 2: Buffer] Converting arrayBuffer to Node Buffer...')
        const buffer = Buffer.from(await file.arrayBuffer())
        console.log(`[Resume Parse] [Stage 2: Buffer] Node Buffer ready: ${buffer.length} bytes.`)

        const lowerName = fileName.toLowerCase()

        if (lowerName.endsWith('.pdf')) {
          textContent = await extractPdfText(buffer)
        } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
          textContent = await extractDocxText(buffer)
        } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
          textContent = buffer.toString('utf-8')
        } else {
          // Attempt PDF detection via magic numbers (%PDF-)
          if (buffer.length > 5 && buffer.toString('ascii', 0, 5) === '%PDF-') {
            textContent = await extractPdfText(buffer)
          } else {
            return NextResponse.json(
              {
                error: `Unsupported format for "${fileName}". Please upload a PDF (.pdf) or Word (.docx) document.`,
                stage: 'format_validation'
              },
              { status: 400 }
            )
          }
        }
      } else {
        return NextResponse.json(
          {
            error: 'No file or resume text was found in the request.',
            stage: 'payload_validation'
          },
          { status: 400 }
        )
      }
    } else {
      // JSON body handling
      const body = await req.json().catch(() => ({}))
      textContent = body.text || ''
      fileName = body.fileName || 'resume.txt'
      fileSize = Buffer.byteLength(textContent, 'utf-8')
      fileType = 'text/plain'
      console.log(`[Resume Parse] [Stage 1: Ingestion] JSON payload parsed, textLength=${textContent.length}`)
    }

    // Verify extracted text length
    if (!textContent || textContent.trim().length < 25) {
      console.warn(`[Resume Parse] [Stage 3: Validation] Extracted text too short: "${textContent.slice(0, 30)}"`)
      return NextResponse.json(
        {
          error: 'Document text could not be extracted or contains insufficient readable text (under 25 characters). If uploading a scanned PDF, ensure it has selectable text.',
          stage: 'text_extraction',
          extractedSnippet: textContent.slice(0, 50)
        },
        { status: 422 }
      )
    }

    // Verify Document Authenticity as a Resume / CV
    const validation = validateIsResume(textContent, fileName, fileType, fileSize)
    if (!validation.isValid && (validation.detectedType === 'assignment' || validation.detectedType === 'invoice')) {
      console.warn(`[Resume Parse] [Stage 3: Validation Failed] Document rejected: ${validation.reason} (confidence: ${validation.confidence}%)`)
      return NextResponse.json(
        {
          error: validation.reason,
          stage: 'resume_authenticity_check',
          validation
        },
        { status: 400 }
      )
    }

    console.log(`[Resume Parse] [Stage 4: Pipeline] Document verified as authentic resume (confidence: ${validation.confidence}%). Commencing ATS analysis on ${textContent.length} characters...`)

    // Pipeline Execution
    const parsedData = parseRawResume(textContent)
    const formatting = analyzeFormatting(textContent)
    const actionVerbs = analyzeActionVerbs(textContent)
    const keywords = analyzeKeywords(textContent, parsedData.rawSkillsList)
    const atsBreakdown = calculateAtsScore(parsedData, formatting, actionVerbs, keywords)
    const aiFeedback = generateAIFeedback(parsedData, atsBreakdown)
    const sectionsRaw = extractSections(textContent)
    const sectionsDetection = detectSectionsStatus(sectionsRaw)

    const executionTimeMs = Date.now() - requestStartTime
    console.log(`[Resume Parse] [Stage 5: Success] Analysis complete in ${executionTimeMs}ms! Score=${atsBreakdown.overallScore}/100`)

    return NextResponse.json({
      success: true,
      meta: {
        fileName,
        fileSize,
        fileType,
        timestamp: new Date().toISOString(),
        executionTimeMs
      },
      validation,
      parsedData,
      atsBreakdown,
      formatting,
      actionVerbs,
      keywords,
      sectionsDetection,
      aiFeedback
    })
  } catch (error: any) {
    const executionTimeMs = Date.now() - requestStartTime
    console.error('[Resume Parse] [Failure] Error processing request:', error)

    return NextResponse.json(
      {
        error: error?.message || 'Unexpected error occurred during resume analysis.',
        stage: 'pipeline_execution',
        details: error?.toString(),
        stack: process.env.NODE_ENV !== 'production' ? error?.stack : undefined,
        executionTimeMs
      },
      { status: 500 }
    )
  }
}
