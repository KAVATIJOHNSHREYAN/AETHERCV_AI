import { NextRequest, NextResponse } from 'next/server'
import {
  getLiveTrendingInterviewData,
  getCompanyInterviewInsights
} from '@/lib/interview-prep/trends-database'
import { generateMockInterviewQuestions } from '@/lib/interview-prep/interview-engine'
import { InterviewInput } from '@/types/interview-prep'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const company = searchParams.get('company')

    if (company) {
      const insights = getCompanyInterviewInsights(company)
      return NextResponse.json({ success: true, insights })
    }

    const trends = getLiveTrendingInterviewData()
    return NextResponse.json({ success: true, trends })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { input: InterviewInput }

    if (!body?.input) {
      return NextResponse.json(
        { success: false, error: 'Interview input is required' },
        { status: 400 }
      )
    }

    const questions = generateMockInterviewQuestions(body.input)
    const insights = getCompanyInterviewInsights(body.input.company || 'Global Tech')

    return NextResponse.json({
      success: true,
      questions,
      insights,
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to generate interview' },
      { status: 500 }
    )
  }
}
