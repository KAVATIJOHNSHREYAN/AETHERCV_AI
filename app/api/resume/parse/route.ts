import { NextRequest, NextResponse } from 'next/server'
import { parseRawResume } from '@/lib/resume/parser'
import { analyzeFormatting } from '@/lib/resume/formatting-analyzer'
import { analyzeActionVerbs } from '@/lib/resume/action-verb-analyzer'
import { analyzeKeywords } from '@/lib/resume/keyword-analyzer'
import { calculateAtsScore } from '@/lib/resume/ats-engine'
import { generateAIFeedback } from '@/lib/resume/ai-engine'
import { detectSectionsStatus } from '@/lib/resume/parser'
import { extractSections } from '@/lib/resume/parser'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''

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
      } else if (file) {
        fileName = file.name
        fileSize = file.size
        fileType = file.type || 'application/octet-stream'

        if (fileSize > MAX_FILE_SIZE) {
          return NextResponse.json(
            { error: 'File size exceeds 10MB limit. Please upload a smaller file.' },
            { status: 400 }
          )
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const lowerName = fileName.toLowerCase()

        if (lowerName.endsWith('.pdf')) {
          try {
            // pdf-parse import
            const pdfParse = require('pdf-parse')
            const pdfData = await pdfParse(buffer)
            textContent = pdfData.text
          } catch (pdfErr: any) {
            console.error('PDF parsing error:', pdfErr)
            return NextResponse.json(
              { error: 'Unable to extract text from PDF. The file may be password-protected, corrupted, or contains only scanned images.' },
              { status: 422 }
            )
          }
        } else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
          try {
            const mammoth = require('mammoth')
            const result = await mammoth.extractRawText({ buffer })
            textContent = result.value
          } catch (docxErr: any) {
            console.error('DOCX parsing error:', docxErr)
            return NextResponse.json(
              { error: 'Unable to parse DOCX file. The document might be corrupted or in an unsupported format.' },
              { status: 422 }
            )
          }
        } else if (lowerName.endsWith('.txt') || lowerName.endsWith('.md')) {
          textContent = buffer.toString('utf-8')
        } else {
          return NextResponse.json(
            { error: 'Unsupported file format. Please upload a PDF (.pdf) or Word (.docx) document.' },
            { status: 400 }
          )
        }
      } else {
        return NextResponse.json(
          { error: 'No file or resume text provided.' },
          { status: 400 }
        )
      }
    } else {
      // JSON body support
      const body = await req.json()
      textContent = body.text || ''
      fileName = body.fileName || 'resume.txt'
      fileSize = Buffer.byteLength(textContent, 'utf-8')
      fileType = 'text/plain'
    }

    if (!textContent || textContent.trim().length < 30) {
      return NextResponse.json(
        { error: 'The provided document is empty or contains insufficient text (minimum 30 characters required).' },
        { status: 422 }
      )
    }

    // Run Parsing & Analytical Pipeline
    const parsedData = parseRawResume(textContent)
    const formatting = analyzeFormatting(textContent)
    const actionVerbs = analyzeActionVerbs(textContent)
    const keywords = analyzeKeywords(textContent, parsedData.rawSkillsList)
    const atsBreakdown = calculateAtsScore(parsedData, formatting, actionVerbs, keywords)
    const aiFeedback = generateAIFeedback(parsedData, atsBreakdown)
    const sectionsRaw = extractSections(textContent)
    const sectionsDetection = detectSectionsStatus(sectionsRaw)

    return NextResponse.json({
      success: true,
      meta: {
        fileName,
        fileSize,
        fileType,
        timestamp: new Date().toISOString()
      },
      parsedData,
      atsBreakdown,
      formatting,
      actionVerbs,
      keywords,
      sectionsDetection,
      aiFeedback
    })
  } catch (error: any) {
    console.error('Resume analysis pipeline failure:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal error occurred during resume processing.' },
      { status: 500 }
    )
  }
}
