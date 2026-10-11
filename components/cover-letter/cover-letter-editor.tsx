'use client'

import React, { useState } from 'react'
import { GeneratedCoverLetter, WritingTone } from '@/types/cover-letter'
import { Button } from '@/components/ui/button'
import {
  exportCoverLetterToPdf,
  exportCoverLetterToDocx,
  exportCoverLetterToTxt
} from '@/services/cover-letter/exporter'
import {
  Copy, Check, Download, FileText, Sparkles, Undo2, Redo2,
  Bold, Italic, AlignLeft, AlignCenter, List, RefreshCw,
  Sliders, Wand2, ShieldCheck, CheckCircle2
} from 'lucide-react'

interface CoverLetterEditorProps {
  letter: GeneratedCoverLetter
  onUpdateText: (newText: string) => void
  onRegenerateWithTone: (tone: WritingTone) => void
  onAdjustLength: (direction: 'shorter' | 'longer') => void
  isRegenerating?: boolean
}

export function CoverLetterEditor({
  letter,
  onUpdateText,
  onRegenerateWithTone,
  onAdjustLength,
  isRegenerating
}: CoverLetterEditorProps) {
  const [copied, setCopied] = useState(false)
  const [content, setContent] = useState(letter.fullPlainText)
  const [history, setHistory] = useState<string[]>([letter.fullPlainText])
  const [historyIndex, setHistoryIndex] = useState(0)

  const handleTextChange = (text: string) => {
    setContent(text)
    onUpdateText(text)
    const newHist = history.slice(0, historyIndex + 1)
    newHist.push(text)
    setHistory(newHist)
    setHistoryIndex(newHist.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1]
      setHistoryIndex(historyIndex - 1)
      setContent(prev)
      onUpdateText(prev)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1]
      setHistoryIndex(historyIndex + 1)
      setContent(next)
      onUpdateText(next)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Count stats
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const charCount = content.length

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="p-4 rounded-2xl bg-[#08111F]/90 border border-blue-500/20 flex flex-wrap items-center justify-between gap-3 shadow-[0_4px_25px_rgba(77,72,230,0.1)]">
        {/* Editor Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-blue-600/20"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-blue-600/20"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </Button>

          <div className="h-4 w-px bg-blue-500/20 mx-1" />

          {/* Quick Tone Switcher */}
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-slate-400 hidden sm:inline font-outfit">Tone:</span>
            {(['professional', 'confident', 'startup', 'technical', 'friendly'] as WritingTone[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onRegenerateWithTone(t)}
                disabled={isRegenerating}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold capitalize transition-all ${
                  letter.toneUsed === t
                    ? 'bg-[#4D48E6] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-blue-600/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="text-xs font-outfit border-blue-500/30 text-sky-200 hover:bg-blue-600/20 hover:text-white"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => exportCoverLetterToTxt(letter)}
            className="text-xs font-outfit border-blue-500/30 text-sky-200 hover:bg-blue-600/20 hover:text-white"
          >
            TXT
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => exportCoverLetterToDocx(letter)}
            className="text-xs font-outfit border-blue-500/30 text-sky-200 hover:bg-blue-600/20 hover:text-white"
          >
            DOCX
          </Button>

          <Button
            size="sm"
            onClick={() => exportCoverLetterToPdf(letter)}
            className="text-xs font-outfit bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:opacity-95 text-white shadow-[0_0_15px_rgba(77,72,230,0.35)]"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Editor Main Canvas */}
      <div className="p-6 rounded-3xl bg-[#0F172A]/90 border border-blue-500/25 shadow-[0_4px_30px_rgba(0,0,0,0.3)] space-y-4">
        {/* Recruiter Header Preview */}
        <div className="pb-3 border-b border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold font-poppins text-white">
              {letter.jobTitle} Cover Letter
            </h4>
            <p className="text-xs text-slate-400 font-outfit">
              Tailored for <strong className="text-white">{letter.companyName}</strong> • {letter.date}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} chars</span>
          </div>
        </div>

        {/* Text Area */}
        <textarea
          rows={18}
          value={content}
          onChange={(e) => handleTextChange(e.target.value)}
          className="w-full bg-[#08111F] rounded-2xl p-5 font-outfit text-sm text-slate-100 border border-blue-500/25 focus:outline-none focus:border-[#4D48E6] leading-relaxed resize-y selection:bg-[#4D48E6]/40"
        />

        {/* Length Fine-tuning Bar */}
        <div className="flex flex-wrap items-center justify-between pt-2 gap-3 text-xs text-slate-400 font-outfit">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Quick Length Adjust:</span>
            <Button
              size="sm"
              variant="outline"
              disabled={isRegenerating}
              onClick={() => onAdjustLength('shorter')}
              className="h-7 text-xs border-blue-500/20 text-slate-300 hover:text-white"
            >
              Make Shorter
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={isRegenerating}
              onClick={() => onAdjustLength('longer')}
              className="h-7 text-xs border-blue-500/20 text-slate-300 hover:text-white"
            >
              Make More Detailed
            </Button>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Zero-Hallucination Guard Active</span>
          </div>
        </div>
      </div>

      {/* Matched Competency Badges */}
      {letter.matchedSkills.length > 0 && (
        <div className="p-4 rounded-2xl bg-[#08111F]/70 border border-blue-500/20 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 font-outfit">
            <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
            Matched Skills Integrated Naturally:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {letter.matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#4D48E6]/15 text-[#818cf8] border border-[#4D48E6]/30"
              >
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
