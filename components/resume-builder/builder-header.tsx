'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ResumeBuilderData, ResumeVersion } from '@/types/resume-builder'
import {
  FileText, ArrowLeft, Download, Upload, GitCompare, Palette,
  Copy, Edit3, Trash2, Plus, Sparkles, Check, RefreshCw, Printer,
  Save, RotateCcw, FilePlus, FolderOpen, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  exportToPlainText,
  exportToMarkdown,
  downloadFile
} from '@/lib/resume-builder/import-export'
import { getTemplateConfig } from '@/lib/resume-builder/templates'
import { downloadSinglePageA4Pdf } from '@/lib/resume-builder/pdf-exporter'

interface BuilderHeaderProps {
  data: ResumeBuilderData
  versions: ResumeVersion[]
  activeVersionId: string
  saveStatus: 'sample' | 'unsaved' | 'saved'
  isUserEdited?: boolean
  hasSavedResume?: boolean
  onSelectVersion: (id: string) => void
  onSaveNewVersion: (name: string) => void
  onDuplicateVersion: (id: string) => void
  onRenameVersion: (id: string, newName: string) => void
  onDeleteVersion: (id: string) => void
  onOpenImport: () => void
  onOpenCompare: () => void
  onOpenCustomize: () => void
  onOptimizeToOnePage?: () => void
  onResetToSample?: () => void
  onNewResume?: () => void
  onSaveResume?: () => void
  onLoadSavedResume?: () => void
}

export function BuilderHeader({
  data,
  versions,
  activeVersionId,
  saveStatus,
  isUserEdited = false,
  hasSavedResume = false,
  onSelectVersion,
  onSaveNewVersion,
  onDuplicateVersion,
  onRenameVersion,
  onDeleteVersion,
  onOpenImport,
  onOpenCompare,
  onOpenCustomize,
  onOptimizeToOnePage,
  onResetToSample,
  onNewResume,
  onSaveResume,
  onLoadSavedResume
}: BuilderHeaderProps) {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isNewVerModalOpen, setIsNewVerModalOpen] = useState(false)
  const [newVerName, setNewVerName] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleManualSave = () => {
    if (onSaveResume) {
      onSaveResume()
      showToast('✓ Resume saved to your browser storage!')
    }
  }

  const handleManualLoad = () => {
    if (onLoadSavedResume) {
      onLoadSavedResume()
      showToast('✓ Loaded your saved resume!')
    }
  }

  const handleResetSample = () => {
    if (onResetToSample) {
      onResetToSample()
      showToast('✓ Reset to official demo sample resume!')
    }
  }

  const handleNewResume = () => {
    if (onNewResume) {
      onNewResume()
      showToast('✓ Fresh resume started (Autosave OFF)!')
    }
  }

  const activeVersion = versions.find((v) => v.id === activeVersionId) || versions[0]

  // Export Handlers
  const handleExportTxt = () => {
    const text = exportToPlainText(data)
    downloadFile(text, `${data.personalInfo.firstName || 'Resume'}_ATS.txt`, 'text/plain')
    setIsExportOpen(false)
  }

  const handleExportMarkdown = () => {
    const md = exportToMarkdown(data)
    downloadFile(md, `${data.personalInfo.firstName || 'Resume'}.md`, 'text/markdown')
    setIsExportOpen(false)
  }

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2)
    downloadFile(jsonStr, `${data.personalInfo.firstName || 'Resume'}_data.json`, 'application/json')
    setIsExportOpen(false)
  }

  const handleExportDocx = () => {
    // Generate clean text-based Word document XML representation
    const text = exportToPlainText(data)
    const docxContent = `\uFEFF${text}`
    downloadFile(docxContent, `${data.personalInfo.firstName || 'Resume'}.doc`, 'application/msword')
    setIsExportOpen(false)
  }

  const handlePrintPdf = async () => {
    setIsExportOpen(false)
    const sheetEl = document.getElementById('resume-printable-sheet')
    const candidateName = `${data.personalInfo.firstName || 'Resume'} ${data.personalInfo.lastName || ''}`.trim()
    if (sheetEl) {
      await downloadSinglePageA4Pdf(sheetEl, candidateName)
    } else {
      window.print()
    }
  }

  const handleCreateNewVersion = () => {
    if (!newVerName.trim()) return
    onSaveNewVersion(newVerName)
    setNewVerName('')
    setIsNewVerModalOpen(false)
  }

  const handleSaveRename = () => {
    if (!renameValue.trim()) return
    onRenameVersion(activeVersionId, renameValue)
    setIsRenaming(false)
  }

  return (
    <div className="bg-[#0C162B]/90 backdrop-blur-md border-b border-blue-500/20 px-3 sm:px-6 py-3 sticky top-14 sm:top-16 z-30 font-outfit">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Branding & Version Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <Link
            href="/resume-analyzer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Career Suite</span>
          </Link>

          <div className="h-4 w-[1px] bg-blue-500/20 hidden sm:block" />

          {/* Version Switcher Pill */}
          <div className="flex items-center gap-2 bg-[#07101F] px-2.5 py-1.5 rounded-xl border border-blue-500/20">
            {isRenaming ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                  className="bg-[#0C162B] text-white text-xs px-2 py-0.5 rounded border border-blue-500/30 w-32 focus:outline-none"
                  autoFocus
                />
                <button onClick={handleSaveRename} className="text-emerald-400 p-0.5">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select
                  value={activeVersionId}
                  onChange={(e) => onSelectVersion(e.target.value)}
                  className="bg-transparent text-xs font-bold text-white font-poppins focus:outline-none cursor-pointer max-w-[140px] truncate"
                >
                  {versions.map((v) => (
                    <option key={v.id} value={v.id} className="bg-[#0C162B] text-white">
                      {v.name} ({v.atsScore} pts)
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setRenameValue(activeVersion?.name || '')
                    setIsRenaming(true)
                  }}
                  title="Rename version"
                  className="text-slate-500 hover:text-white"
                >
                  <Edit3 className="w-3 h-3" />
                </button>

                <button
                  type="button"
                  onClick={() => onDuplicateVersion(activeVersionId)}
                  title="Duplicate version"
                  className="text-slate-500 hover:text-white"
                >
                  <Copy className="w-3 h-3" />
                </button>

                {versions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onDeleteVersion(activeVersionId)}
                    title="Delete version"
                    className="text-slate-500 hover:text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsNewVerModalOpen(true)}
              className="text-[10px] text-sky-400 hover:text-sky-200 border-l border-blue-500/20 pl-2 font-semibold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" />
              <span>New</span>
            </button>
          </div>

          {/* State & Autosave Indicator */}
          <div className="hidden md:flex items-center gap-2">
            {!isUserEdited ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-sky-300 text-[11px] font-semibold">
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>Sample Resume (Autosave OFF)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-[11px] font-semibold">
                <span className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'saved' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
                <span>User Session {saveStatus === 'saved' ? '(Saved)' : '(Unsaved)'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions (Save, Load, Reset, Templates, Import, Export) */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-end flex-wrap">
          {/* Explicit Action: Save Resume */}
          <Button
            size="sm"
            onClick={handleManualSave}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all cursor-pointer h-8 px-2.5 sm:px-3"
            title="Save current resume to browser storage"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Resume</span>
          </Button>

          {/* Explicit Action: Load Saved Resume */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleManualLoad}
            disabled={!hasSavedResume}
            className={`text-xs gap-1.5 font-semibold transition-all h-8 px-2 sm:px-2.5 ${
              hasSavedResume
                ? 'text-sky-300 border-sky-500/40 hover:bg-sky-500/15 cursor-pointer'
                : 'text-slate-500 border-slate-700 opacity-50 cursor-not-allowed'
            }`}
            title={hasSavedResume ? 'Load manually saved resume' : 'No saved resume in browser'}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Load Saved</span>
          </Button>

          {/* Explicit Action: Reset to Sample */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleResetSample}
            className="text-xs text-slate-300 border-blue-500/25 hover:bg-blue-600/15 gap-1.5 font-semibold cursor-pointer h-8 px-2 sm:px-2.5"
            title="Restore original demo sample resume"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Reset to Sample</span>
            <span className="xl:hidden hidden sm:inline">Sample</span>
          </Button>

          {/* Explicit Action: New Resume */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleNewResume}
            className="text-xs text-slate-300 border-blue-500/25 hover:bg-blue-600/15 gap-1.5 font-semibold cursor-pointer h-8 px-2 sm:px-2.5"
            title="Clear all fields and restart with fresh sample"
          >
            <FilePlus className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">New Resume</span>
            <span className="xl:hidden hidden sm:inline">New</span>
          </Button>

          {onOptimizeToOnePage && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOptimizeToOnePage}
              className="text-xs text-amber-300 border-amber-500/40 hover:bg-amber-600/15 gap-1.5 font-bold h-8 px-2.5 sm:px-3"
              title="Ensure resume fits on 1 page"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">1-Page Fit</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCustomize}
            className="text-xs text-sky-300 border-blue-500/30 hover:bg-blue-600/15 gap-1.5 h-8 px-2.5 sm:px-3"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Templates</span>
            <span className="hidden 2xl:inline text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-sky-200 font-mono">
              {getTemplateConfig(data.customization.templateId).name}
            </span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenImport}
            className="text-xs text-slate-300 border-blue-500/30 hover:bg-blue-600/15 gap-1.5 h-8 px-2 sm:px-2.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCompare}
            className="text-xs text-slate-300 border-blue-500/30 hover:bg-blue-600/15 gap-1.5 hidden md:flex h-8 px-2 sm:px-2.5"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare</span>
          </Button>

          {/* Export Menu Dropdown */}
          <div className="relative">
            <Button
              size="sm"
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:brightness-110 text-white font-semibold text-xs gap-1.5 shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </Button>

            {isExportOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#0C162B] border border-blue-500/25 p-1.5 shadow-2xl z-50 text-xs space-y-0.5">
                <button
                  onClick={handlePrintPdf}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-white flex items-center justify-between"
                >
                  <span className="font-semibold">Print / PDF</span>
                  <span className="text-[10px] text-emerald-400 font-bold">A4 Ready</span>
                </button>
                <button
                  onClick={handleExportDocx}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-300 hover:text-white"
                >
                  Word Document (.doc)
                </button>
                <button
                  onClick={handleExportTxt}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-300 hover:text-white"
                >
                  ATS Plain Text (.txt)
                </button>
                <button
                  onClick={handleExportMarkdown}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-300 hover:text-white"
                >
                  Markdown (.md)
                </button>
                <button
                  onClick={handleExportJson}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-600/20 text-slate-300 hover:text-white border-t border-blue-500/10 pt-2"
                >
                  JSON Backup (.json)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification Banner */}
      {feedback && (
        <div className="container mx-auto px-2 pt-2">
          <div className="flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-lg animate-in fade-in duration-200">
            <span>{feedback}</span>
            <button onClick={() => setFeedback(null)} className="text-emerald-400 hover:text-white text-sm font-bold ml-3 cursor-pointer">×</button>
          </div>
        </div>
      )}

      {/* New Version Modal */}
      {isNewVerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-[#0C162B] border border-blue-500/25 p-5 space-y-4 shadow-2xl">
            <h4 className="text-sm font-bold text-white font-poppins">Create New Resume Version</h4>
            <input
              type="text"
              value={newVerName}
              onChange={(e) => setNewVerName(e.target.value)}
              placeholder="e.g. Google SDE Resume or Placement V2"
              className="w-full bg-[#07101F] border border-blue-500/20 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex items-center justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsNewVerModalOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button size="sm" onClick={handleCreateNewVersion} className="text-xs bg-[#2563EB]">
                Create Version
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
