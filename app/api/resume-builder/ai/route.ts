import { NextRequest, NextResponse } from 'next/server'
import {
  generateSummaryByRole,
  rewriteBulletPoint,
  enhanceProjectDescription,
  suggestAchievementWording,
  TargetRole,
  WritingTone
} from '@/lib/resume-builder/ai-assistant'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, payload } = body

    if (!action) {
      return NextResponse.json({ error: 'Action type is required' }, { status: 400 })
    }

    switch (action) {
      case 'generate-summary': {
        const { role, tone, skills, title } = payload as {
          role: TargetRole
          tone?: WritingTone
          skills?: string[]
          title?: string
        }
        const summary = generateSummaryByRole(role, tone || 'Professional', skills || [], title)
        return NextResponse.json({ success: true, summary })
      }

      case 'rewrite-bullet': {
        const { bullet, mode } = payload as {
          bullet: string
          mode: 'improve' | 'star' | 'metrics' | 'shorter' | 'longer' | 'technical' | 'executive'
        }
        const rewritten = rewriteBulletPoint(bullet, mode)
        return NextResponse.json({ success: true, rewritten })
      }

      case 'enhance-project': {
        const { name, techStack, currentDesc, mode } = payload as {
          name: string
          techStack: string[]
          currentDesc: string
          mode: 'enhance' | 'architecture' | 'achievements'
        }
        const enhanced = enhanceProjectDescription(name, techStack || [], currentDesc || '', mode)
        return NextResponse.json({ success: true, enhanced })
      }

      case 'suggest-achievement': {
        const { title, description } = payload as { title: string; description: string }
        const suggested = suggestAchievementWording(title, description)
        return NextResponse.json({ success: true, ...suggested })
      }

      default:
        return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
    }
  } catch (err: any) {
    console.error('[AI Resume Builder API Error]:', err)
    return NextResponse.json({ error: err?.message || 'Internal AI error' }, { status: 500 })
  }
}
