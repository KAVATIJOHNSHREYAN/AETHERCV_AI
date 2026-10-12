'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ResumeBuilderData, ResumeVersion } from '@/types/resume-builder'
import {
  FileText, ArrowLeft, Download, Upload, GitCompare, Palette,
  Copy, Edit3, Trash2, Plus, Sparkles, Check, RefreshCw, Printer
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  exportToPlainText,
  exportToMarkdown,
  downloadFile
} from '@/lib/resume-builder/import-export'
import { getTemplateConfig } from '@/lib/resume-builder/templates'

interface BuilderHeaderProps {
  data: ResumeBuilderData
  versions: ResumeVersion[]
  activeVersionId: string
  saveStatus: 'saved' | 'saving'
  onSelectVersion: (id: string) => void
  onSaveNewVersion: (name: string) => void
  onDuplicateVersion: (id: string) => void
  onRenameVersion: (id: string, newName: string) => void
  onDeleteVersion: (id: string) => void
  onOpenImport: () => void
  onOpenCompare: () => void
  onOpenCustomize: () => void
  onOptimizeToOnePage?: () => void
}

export function BuilderHeader({
  data,
  versions,
  activeVersionId,
  saveStatus,
  onSelectVersion,
  onSaveNewVersion,
  onDuplicateVersion,
  onRenameVersion,
  onDeleteVersion,
  onOpenImport,
  onOpenCompare,
  onOpenCustomize,
  onOptimizeToOnePage
}: BuilderHeaderProps) {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isNewVerModalOpen, setIsNewVerModalOpen] = useState(false)
  const [newVerName, setNewVerName] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)
  const [renameValue, setRenameValue] = useState('')

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

  const handlePrintPdf = () => {
    setIsExportOpen(false)
    window.print()
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

          {/* Auto-save status */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400">
            {saveStatus === 'saving' ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-sky-400" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Saved</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions (Customize, Import, Compare, Export) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end flex-wrap">
          {onOptimizeToOnePage && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOptimizeToOnePage}
              className="text-xs text-amber-300 border-amber-500/40 hover:bg-amber-600/15 gap-1.5 font-bold"
              title="Ensure resume fits on 1 page"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Optimize to 1 Page</span>
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCustomize}
            className="text-xs text-sky-300 border-blue-500/30 hover:bg-blue-600/15 gap-1.5"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Templates</span>
            <span className="hidden xl:inline text-[10px] px-1.5 py-0.5 rounded-md bg-blue-500/20 text-sky-200 font-mono">
              {getTemplateConfig(data.customization.templateId).name}
            </span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenImport}
            className="text-xs text-slate-300 border-blue-500/30 hover:bg-blue-600/15 gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOpenCompare}
            className="text-xs text-slate-300 border-blue-500/30 hover:bg-blue-600/15 gap-1.5 hidden sm:flex"
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
