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
      const questionRaw = (body.question || {}) as any
      const rawText =
        questionRaw.questionText ||
        questionRaw.title ||
        questionRaw.question ||
        questionRaw.prompt ||
        'Standard Interview Question'

      const rawAnswer = (
        body.answer ||
        body.userAnswer ||
        body.response ||
        questionRaw.userAnswer ||
        ''
      ).toString().trim()

      if (!rawAnswer) {
        return NextResponse.json(
          {
            success: false,
            error: 'Answer content is required for evaluation. Please provide your response.'
          },
          { status: 400 }
        )
      }

      const safeQuestion: InterviewQuestion = {
        id: questionRaw.id || `q-${Date.now()}`,
        questionIndex: questionRaw.questionIndex ?? 1,
        roundType: questionRaw.roundType || 'technical',
        category: questionRaw.category || 'technical',
        questionText: rawText,
        interviewerPersona: questionRaw.interviewerPersona || 'Senior Technical Interviewer',
        interviewerTitle: questionRaw.interviewerTitle || 'Staff Hiring Specialist',
        recruiterIntent: questionRaw.recruiterIntent || 'Evaluate problem-solving depth and communication clarity.',
        suggestedKeyPoints: Array.isArray(questionRaw.suggestedKeyPoints) ? questionRaw.suggestedKeyPoints : [],
        followUps: Array.isArray(questionRaw.followUps) ? questionRaw.followUps : [],
        difficulty: questionRaw.difficulty || 'medium',
        codeTemplate: questionRaw.codeTemplate,
        expectedComplexity: questionRaw.expectedComplexity,
        systemDesignConstraints: questionRaw.systemDesignConstraints,
        userAnswer: rawAnswer,
        answeredAt: new Date().toISOString()
      }

      const rawInput = body.input || {}
      const safeInput: InterviewInput = {
        inputSource: rawInput.inputSource || 'manual',
        resumeText: rawInput.resumeText || '',
        jobDescription: rawInput.jobDescription || '',
        company: rawInput.company || 'Global Tech',
        jobRole: rawInput.jobRole || 'Software Engineer',
        country: rawInput.country || 'United States',
        experienceLevel: rawInput.experienceLevel || 'mid',
        difficulty: rawInput.difficulty || 'medium',
        interviewType: rawInput.interviewType || 'complete',
        customFocusAreas: Array.isArray(rawInput.customFocusAreas) ? rawInput.customFocusAreas : []
      }

      // Perform deep AI evaluation
      const evaluation = evaluateAnswer(safeQuestion, rawAnswer, safeInput)

      // Generate context-aware live recruiter follow-up
      const followUpQuestion = generateIntelligentFollowUp(safeQuestion, rawAnswer, safeInput)

      return NextResponse.json({
        success: true,
        evaluation,
        followUpQuestion,
        timestamp: new Date().toISOString()
      })
    }

    // ACTION 2: Generate mock interview questions
    const rawInput = (body.input || body || {}) as any
    const company = (rawInput.company || 'Global Tech').toString().trim()
    const jobRole = (rawInput.jobRole || rawInput.role || 'Software Engineer').toString().trim()

    const safeInput: InterviewInput = {
      inputSource: rawInput.inputSource || 'manual',
      resumeText: rawInput.resumeText || '',
      jobDescription: rawInput.jobDescription || '',
      company: company || 'Global Tech',
      jobRole: jobRole || 'Software Engineer',
      country: rawInput.country || 'Global',
      experienceLevel: rawInput.experienceLevel || 'mid',
      difficulty: rawInput.difficulty || 'medium',
      interviewType: rawInput.interviewType || 'complete',
      customFocusAreas: Array.isArray(rawInput.customFocusAreas) ? rawInput.customFocusAreas : []
    }

    const questions = generateMockInterviewQuestions(safeInput)
    const insights = getCompanyInterviewInsights(safeInput.company || 'Global Tech')

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
