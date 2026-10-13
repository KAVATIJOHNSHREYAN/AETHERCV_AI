'use client'

import React, { useState } from 'react'
import { OverallInterviewResult } from '@/types/interview-prep'
import {
  downloadInterviewFile,
  generateInterviewTxtReport,
  generateInterviewMarkdownReport,
  printInterviewPdfReport
} from '@/lib/interview-prep/export-engine'
import {
  Download,
  FileText,
  Printer,
  FileJson,
  X,
  Check,
  Share2
} from 'lucide-react'

interface InterviewExportModalProps {
  isOpen: boolean
  onClose: () => void
  result: OverallInterviewResult | null
}

export function InterviewExportModal({
  isOpen,
  onClose,
  result
}: InterviewExportModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !result) return null

  const cleanRole = result.input.jobRole.replace(/[^a-zA-Z0-9]/g, '_')
  const cleanCompany = result.input.company.replace(/[^a-zA-Z0-9]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]

  const handleExportTxt = () => {
    const content = generateInterviewTxtReport(result)
    downloadInterviewFile(content, `Interview_Report_${cleanCompany}_${cleanRole}_${dateStr}.txt`, 'text/plain')
  }

  const handleExportMd = () => {
    const content = generateInterviewMarkdownReport(result)
    downloadInterviewFile(content, `Interview_Report_${cleanCompany}_${cleanRole}_${dateStr}.md`, 'text/markdown')
  }

  const handleExportJson = () => {
    downloadInterviewFile(
      JSON.stringify(result, null, 2),
      `Interview_Report_${cleanCompany}_${cleanRole}_${dateStr}.json`,
      'application/json'
    )
  }

  const handlePrintPdf = () => {
    printInterviewPdfReport(result)
  }

  const handleCopySummary = () => {
    const summary = `AETHERCV AI — Interview Dossier for ${result.input.jobRole} at ${result.input.company} (${result.input.country}):
Overall Score: ${result.overallScore}/100 | Verdict: ${result.verdict}
Technical Accuracy: ${result.metrics.technicalAccuracy}/100 | Problem Solving: ${result.metrics.problemSolving}/100
Communication: ${result.metrics.communication}/100 | STAR Method: ${result.metrics.starMethod}/100
Impression: ${result.recruiterImpression}
Verified on: https://aethercv-ai.vercel.app/interview-prep`

    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0C162B] border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Interview Evaluation</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Download your official performance dossier in standard formats.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Printable PDF */}
          <button
            type="button"
            onClick={handlePrintPdf}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition text-left group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Printable PDF Dossier</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Formatted executive summary for review
              </span>
            </div>
          </button>

          {/* TXT Report */}
          <button
            type="button"
            onClick={handleExportTxt}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition text-left group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Plain Text (.txt)</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Standard ASCII transcript
              </span>
            </div>
          </button>

          {/* Markdown Report */}
          <button
            type="button"
            onClick={handleExportMd}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition text-left group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Markdown (.md)</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Formatted for Notion and GitHub
              </span>
            </div>
          </button>

          {/* JSON Report */}
          <button
            type="button"
            onClick={handleExportJson}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition text-left group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Raw JSON (.json)</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Full programmatic schema
              </span>
            </div>
          </button>
        </div>

        {/* Copy Share Summary */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied Executive Summary to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Copy Quick Summary to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
