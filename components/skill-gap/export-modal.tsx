'use client'

import React from 'react'
import { SkillGapAnalysisResult } from '@/types/skill-gap'
import {
  downloadClientFile,
  generateTxtReport,
  generateMarkdownReport,
  generateRoadmapMarkdown,
  generateChecklistMarkdown,
  printPdfReport
} from '@/lib/skill-gap/export-engine'
import {
  Download,
  X,
  FileText,
  FileCode,
  FileCheck2,
  Calendar,
  ListTodo,
  Printer
} from 'lucide-react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  data: SkillGapAnalysisResult
}

export function ExportModal({ isOpen, onClose, data }: ExportModalProps) {
  if (!isOpen) return null

  const sanitizeRole = (data.targetRole || 'Role').replace(/[^a-zA-Z0-9_-]/g, '_')

  const handleDownloadPdf = () => {
    printPdfReport(data)
  }

  const handleDownloadTxt = () => {
    const text = generateTxtReport(data)
    downloadClientFile(text, `Skill_Gap_Report_${sanitizeRole}.txt`, 'text/plain;charset=utf-8')
  }

  const handleDownloadMarkdown = () => {
    const md = generateMarkdownReport(data)
    downloadClientFile(md, `Skill_Gap_Report_${sanitizeRole}.md`, 'text/markdown;charset=utf-8')
  }

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(data, null, 2)
    downloadClientFile(jsonStr, `Skill_Gap_Data_${sanitizeRole}.json`, 'application/json;charset=utf-8')
  }

  const handleDownloadRoadmap = () => {
    const md = generateRoadmapMarkdown(data)
    downloadClientFile(md, `12_Week_Roadmap_${sanitizeRole}.md`, 'text/markdown;charset=utf-8')
  }

  const handleDownloadChecklist = () => {
    const md = generateChecklistMarkdown(data)
    downloadClientFile(md, `Employability_Checklist_${sanitizeRole}.md`, 'text/markdown;charset=utf-8')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-[#0C162B] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Analysis Report</h3>
              <p className="text-xs text-slate-400">
                Choose your desired export format for candidate report and action plan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* PDF Report */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                PDF Report
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Clean printable executive summary with circular charts.
              </p>
            </div>
          </button>

          {/* TXT Report */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                TXT Report
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Formatted ASCII plain-text document.
              </p>
            </div>
          </button>

          {/* Markdown Report */}
          <button
            type="button"
            onClick={handleDownloadMarkdown}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-sky-300 transition-colors">
                Markdown Report (.md)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                GitHub flavored markdown with tables and checklist blocks.
              </p>
            </div>
          </button>

          {/* JSON Report */}
          <button
            type="button"
            onClick={handleDownloadJson}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                JSON Data (.json)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Complete raw programmatic dataset with all metrics.
              </p>
            </div>
          </button>

          {/* Career Roadmap */}
          <button
            type="button"
            onClick={handleDownloadRoadmap}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                Career Roadmap (.md)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                12-week structured milestones and deliverable guides.
              </p>
            </div>
          </button>

          {/* Improvement Checklist */}
          <button
            type="button"
            onClick={handleDownloadChecklist}
            className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0 group-hover:scale-105 transition-transform">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                Improvement Checklist (.md)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Prioritized action items and ATS recruiter keyword checklist.
              </p>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
