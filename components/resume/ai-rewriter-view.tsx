'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ParsedResume } from '@/lib/resume/types'
import { generateRewrittenResume } from '@/lib/resume/rewriter'
import { Button } from '@/components/ui/button'
import {
  Sparkles, Copy, Check, Download, FileText, UserCheck,
  Briefcase, Code2, Cpu
} from 'lucide-react'

interface AiRewriterViewProps {
  resume: ParsedResume
}

export function AiRewriterView({ resume }: AiRewriterViewProps) {
  const [activeTab, setActiveTab] = useState<'full' | 'summary' | 'experience' | 'projects' | 'skills'>('full')
  const [copied, setCopied] = useState(false)

  const rewritten = generateRewrittenResume(resume)

  const getActiveContent = (): string => {
    switch (activeTab) {
      case 'summary':
        return rewritten.summary
      case 'skills':
        return rewritten.skillsSection
      case 'experience':
        return rewritten.experience.map(e => e.content).join('\n\n')
      case 'projects':
        return rewritten.projects.map(p => p.content).join('\n\n')
      case 'full':
      default:
        return rewritten.fullResumeMarkdown
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveContent())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const content = getActiveContent()
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${(resume.contact.name || 'Candidate').replace(/\s+/g, '_')}_Improved_Resume.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const tabs = [
    { id: 'full' as const, label: 'Full Resume', icon: FileText },
    { id: 'summary' as const, label: 'Summary', icon: UserCheck },
    { id: 'experience' as const, label: 'Experience', icon: Briefcase },
    { id: 'projects' as const, label: 'Projects', icon: Code2 },
    { id: 'skills' as const, label: 'Skills Section', icon: Cpu }
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/40 gap-3">
        <div>
          <h3 className="text-base font-bold font-poppins text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Professional Resume Rewriter
          </h3>
          <p className="text-xs text-muted-foreground font-outfit">
            Generates polished executive wording with measurable metrics, active voice, and clean structure
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-1.5 text-xs font-outfit"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Copy Section'}
          </Button>

          <Button
            size="sm"
            onClick={handleDownload}
            className="gap-1.5 text-xs font-outfit shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Export Markdown
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => {
          const Icon = t.icon
          const isActive = activeTab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground border border-border/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Editor / Markdown Preview Area */}
      <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50">
        <textarea
          readOnly
          value={getActiveContent()}
          rows={16}
          className="w-full bg-background/80 rounded-xl p-4 font-mono text-xs text-foreground border border-border/50 focus:outline-none leading-relaxed resize-y select-text"
        />
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2 font-outfit">
          <span>✓ Ready to paste directly into your resume builder or Google Docs</span>
          <span>Formatted with standard Markdown headers & bullet hierarchies</span>
        </div>
      </div>
    </div>
  )
}
