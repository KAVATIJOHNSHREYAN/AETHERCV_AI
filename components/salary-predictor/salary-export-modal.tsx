'use client'

import React, { useState } from 'react'
import { SalaryPredictionResult } from '@/types/salary-predictor'
import {
  downloadClientFile,
  generateSalaryTxtReport,
  generateSalaryMarkdownReport,
  generateSalaryJsonReport,
  printSalaryPdfReport
} from '@/lib/salary-predictor/export-engine'
import {
  Download,
  FileText,
  Printer,
  FileJson,
  Code2,
  Check,
  X,
  Share2
} from 'lucide-react'

interface SalaryExportModalProps {
  isOpen: boolean
  onClose: () => void
  result: SalaryPredictionResult | null
}

export function SalaryExportModal({ isOpen, onClose, result }: SalaryExportModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !result) return null

  const cleanRole = result.input.jobTitle.replace(/[^a-zA-Z0-9]/g, '_')
  const dateStr = new Date().toISOString().split('T')[0]

  const handleExportTxt = () => {
    const content = generateSalaryTxtReport(result)
    downloadClientFile(content, `Salary_Report_${cleanRole}_${dateStr}.txt`, 'text/plain')
  }

  const handleExportMd = () => {
    const content = generateSalaryMarkdownReport(result)
    downloadClientFile(content, `Salary_Report_${cleanRole}_${dateStr}.md`, 'text/markdown')
  }

  const handleExportJson = () => {
    const content = generateSalaryJsonReport(result)
    downloadClientFile(content, `Salary_Report_${cleanRole}_${dateStr}.json`, 'application/json')
  }

  const handlePrintPdf = () => {
    printSalaryPdfReport(result)
  }

  const handleCopySummary = () => {
    const summary = `AetherCV AI — Salary Estimate for ${result.input.jobTitle} at ${result.input.company || 'Market'} (${result.input.city}, ${result.input.country}):
Median TC: ${result.metrics.totalCompensation.median.toLocaleString()} ${result.primaryCurrency}
Range: ${result.metrics.totalCompensation.min.toLocaleString()} - ${result.metrics.totalCompensation.max.toLocaleString()} ${result.primaryCurrency}
Confidence: ${result.marketTrends.confidenceScore}%
Verified on: https://aethercv-ai.vercel.app/global-salary-predictor`

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
              <h3 className="text-base font-bold text-white">Export Compensation Dossier</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Download verified market salary estimates in standard formats.
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

        {/* Export Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* PDF Report */}
          <button
            type="button"
            onClick={handlePrintPdf}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition-all text-left group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Printable PDF Report</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Clean printable styling for executive reviews
              </span>
            </div>
          </button>

          {/* TXT Report */}
          <button
            type="button"
            onClick={handleExportTxt}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition-all text-left group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Plain Text (.TXT)</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Formatted ASCII breakdown
              </span>
            </div>
          </button>

          {/* Markdown Report */}
          <button
            type="button"
            onClick={handleExportMd}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition-all text-left group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Markdown (.MD)</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                GitHub-flavored tables & notes
              </span>
            </div>
          </button>

          {/* JSON Report */}
          <button
            type="button"
            onClick={handleExportJson}
            className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 transition-all text-left group flex items-start gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">JSON Payload</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">
                Structured raw dataset export
              </span>
            </div>
          </button>
        </div>

        {/* Quick Clipboard Copy */}
        <div className="pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-blue-400" />
                <span>Copy Quick Summary to Clipboard</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
