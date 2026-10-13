import { NextRequest, NextResponse } from 'next/server'
import {
  getLiveTrendingInterviewData,
  getCompanyInterviewInsights
} from '@/lib/interview-prep/trends-database'
import {
  generateMockInterviewQuestions,
  evaluateAnswer,
  generateIntelligentFollowUp
} from '@/lib/interview-prep/interview-engine'
import { InterviewInput, InterviewQuestion } from '@/types/interview-prep'

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
    const body = await request.json()
    const action = body.action || (body.question && body.answer ? 'evaluate-answer' : 'generate-questions')

    // ACTION 1: Evaluate candidate answer & generate live follow-up
    if (action === 'evaluate-answer') {
      const { question, answer, input } = body as {
        question: InterviewQuestion
        answer: string
        input: InterviewInput
      }

      if (!question || !question.questionText) {
        return NextResponse.json(
          { success: false, error: 'Question data is required for evaluation' },
          { status: 400 }
        )
      }

      const safeAnswer = (answer || '').trim()
      if (!safeAnswer) {
        return NextResponse.json(
          { success: false, error: 'Answer content is required for evaluation' },
          { status: 400 }
        )
      }

      const safeInput: InterviewInput = input || {
        inputSource: 'manual',
        resumeText: '',
        jobDescription: '',
        company: 'Global Tech',
        jobRole: 'Software Engineer',
        country: 'United States',
        experienceLevel: 'mid',
        difficulty: 'medium',
        interviewType: 'complete',
        customFocusAreas: []
      }

      // Perform deep AI evaluation
      const evaluation = evaluateAnswer(question, safeAnswer, safeInput)

      // Generate context-aware live recruiter follow-up
      const followUpQuestion = generateIntelligentFollowUp(question, safeAnswer, safeInput)

      return NextResponse.json({
        success: true,
        evaluation,
        followUpQuestion,
        timestamp: new Date().toISOString()
      })
    }

    // ACTION 2: Generate mock interview questions
    const input = (body.input || body) as InterviewInput

    if (!input || (!input.jobRole && !input.company)) {
      return NextResponse.json(
        { success: false, error: 'Interview input is required' },
        { status: 400 }
      )
    }

    const questions = generateMockInterviewQuestions(input)
    const insights = getCompanyInterviewInsights(input.company || 'Global Tech')

    return NextResponse.json({
      success: true,
      questions,
      insights,
      timestamp: new Date().toISOString()
    })
  } catch (err: any) {
    console.error('Interview API error:', err)
    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Failed to process interview request'
      },
      { status: 500 }
    )
  }
}
