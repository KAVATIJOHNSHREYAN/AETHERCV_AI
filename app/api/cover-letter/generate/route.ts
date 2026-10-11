import { NextRequest, NextResponse } from 'next/server'
import { generateCoverLetterFromResumeAndJD } from '@/lib/cover-letter/generator'
import { ParsedResume } from '@/lib/resume/types'
import { JobDetails } from '@/types/cover-letter'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { resume, jobDetails } = body as {
      resume: ParsedResume
      jobDetails: JobDetails
    }

    if (!resume) {
      return NextResponse.json(
        { error: 'Resume payload is required to generate a tailored cover letter.' },
        { status: 400 }
      )
    }

    if (!jobDetails?.companyName?.trim()) {
      return NextResponse.json(
        { error: 'Company Name is required.' },
        { status: 400 }
      )
    }

    if (!jobDetails?.jobTitle?.trim()) {
      return NextResponse.json(
        { error: 'Job Title is required.' },
        { status: 400 }
      )
    }

    if (!jobDetails?.jobDescription?.trim()) {
      return NextResponse.json(
        { error: 'Job Description is required to match keywords and skills.' },
        { status: 400 }
      )
    }

    const generated = generateCoverLetterFromResumeAndJD(resume, jobDetails)
    return NextResponse.json({ success: true, coverLetter: generated })
  } catch (error) {
    console.error('Cover letter generation API error:', error)
    return NextResponse.json(
      { error: 'Internal error generating tailored cover letter.' },
      { status: 500 }
    )
  }
}
