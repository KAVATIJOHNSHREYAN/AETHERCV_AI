'use client'

import React, { useState } from 'react'
import { useResumeVersions } from '@/hooks/resume-builder/use-resume-versions'
import { calculateLiveAtsScore } from '@/lib/resume-builder/ats-calculator'
import { BuilderHeader } from '@/components/resume-builder/builder-header'
import { AtsScoreWidget } from '@/components/resume-builder/ats-score-widget'
import { FormEditor } from '@/components/resume-builder/form-editor'
import { ResumePreview } from '@/components/resume-builder/resume-preview'
import { CustomizationDrawer } from '@/components/resume-builder/customization-drawer'
import { ImportModal } from '@/components/resume-builder/import-modal'
import { ComparisonModal } from '@/components/resume-builder/comparison-modal'
import { optimizeToOnePage } from '@/lib/resume-builder/one-page-optimizer'
import { FileText, Eye, Sparkles, X, Palette, ShieldCheck } from 'lucide-react'

export default function ResumeBuilderPage() {
  const {
    resumeData,
    updateResumeData,
    versions,
    activeVersionId,
    saveStatus,
    loadVersion,
    saveAsNewVersion,
    duplicateVersion,
    renameVersion,
    deleteVersion
  } = useResumeVersions()

  // Mobile View Switcher: 'editor' | 'preview' | 'ats'
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview' | 'ats'>('editor')

  // Modals state
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isCompareOpen, setIsCompareOpen] = useState(false)

  // Real-time ATS Calculation
  const atsScore = calculateLiveAtsScore(resumeData)

  return (
    <div className="min-h-screen bg-[#07101F] text-foreground flex flex-col font-outfit pt-14">
      {/* 1. Header Toolbar */}
      <BuilderHeader
        data={resumeData}
        versions={versions}
        activeVersionId={activeVersionId}
        saveStatus={saveStatus}
        onSelectVersion={loadVersion}
        onSaveNewVersion={saveAsNewVersion}
        onDuplicateVersion={duplicateVersion}
        onRenameVersion={renameVersion}
        onDeleteVersion={deleteVersion}
        onOpenImport={() => setIsImportOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenCustomize={() => setIsCustomizeOpen(true)}
        onOptimizeToOnePage={() => updateResumeData((prev) => optimizeToOnePage(prev))}
      />

      {/* 2. Mobile Responsive Tab Switcher */}
      <div className="lg:hidden px-4 py-2.5 bg-[#0C162B] border-b border-blue-500/20 sticky top-28 z-20">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#07101F] border border-blue-500/20 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMobileTab('editor')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'editor' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Form Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'preview' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileTab('ats')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              mobileTab === 'ats' ? 'bg-[#2563EB] text-white shadow-sm' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATS ({atsScore.overallScore})</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace: Split-Screen Layout */}
      <main className="flex-1 container mx-auto px-3 sm:px-6 py-4 sm:py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ──────── LEFT PANEL: Form Editor (lg:col-span-6 or 7) ──────── */}
          <div
            className={`space-y-4 lg:col-span-6 ${
              mobileTab === 'editor' ? 'block' : mobileTab === 'ats' ? 'hidden' : 'hidden lg:block'
            }`}
          >
            {/* Real-time ATS score card above form on desktop */}
            <AtsScoreWidget score={atsScore} />

            {/* Form Editor with All 10 Steps */}
            <FormEditor
              data={resumeData}
              onChange={(updated) => updateResumeData(updated)}
            />
          </div>

          {/* ──────── MOBILE ATS TAB ──────── */}
          {mobileTab === 'ats' && (
            <div className="lg:hidden col-span-1 space-y-4">
              <AtsScoreWidget score={atsScore} />
              <div className="p-4 rounded-2xl bg-[#0C162B] border border-blue-500/20 space-y-3">
                <h4 className="text-sm font-bold text-white font-poppins flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ATS Optimization Checklist
                </h4>
                <ul className="space-y-2 text-xs text-slate-300">
                  {atsScore.suggestions.map((sug, i) => (
                    <li key={i} className="flex items-start gap-2 bg-[#07101F] p-2 rounded-xl border border-blue-500/15">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ──────── RIGHT PANEL: Live Resume Preview (lg:col-span-6 or 5) ──────── */}
          <div
            className={`lg:col-span-6 sticky top-28 self-start ${
              mobileTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="h-[calc(100vh-130px)]">
              <ResumePreview
                data={resumeData}
                onOptimizeToOnePage={() => updateResumeData((prev) => optimizeToOnePage(prev))}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 4. Customization Drawer Modal */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0C162B] border border-blue-500/25 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-blue-500/15 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-poppins text-white">Templates &amp; Customization</h3>
                  <p className="text-xs text-slate-400">13 recruiter-tested ATS designs, fonts, and accents</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CustomizationDrawer
              customization={resumeData.customization}
              onChange={(updated) =>
                updateResumeData((prev) => ({
                  ...prev,
                  customization: { ...prev.customization, ...updated }
                }))
              }
            />
          </div>
        </div>
      )}

      {/* 5. Import Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={(imported) => updateResumeData(imported)}
      />

      {/* 6. Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        versions={versions}
      />
    </div>
  )
}
