'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Sparkles,
  Download,
  Copy,
  Check,
  FileText,
  Upload,
  RefreshCw,
  Eye,
  Sliders,
  Award,
  Layers,
  ChevronRight,
  TrendingUp,
  Share2,
  FileCode,
  FileDown
} from 'lucide-react'
import { LinkedInProfileData, TargetRole } from '@/types/linkedin'
import { DEFAULT_LINKEDIN_PROFILE, TARGET_ROLES, ROLE_LABELS } from '@/lib/linkedin/default-data'
import { calculateLinkedInScore } from '@/lib/linkedin/optimizer-engine'
import {
  exportToLinkedInPlainText,
  exportToMarkdown,
  exportLinkedInToPdf,
  downloadFile
} from '@/lib/linkedin/import-export'
import { EditorTabs } from '@/components/linkedin/editor-tabs'
import { ProfilePreview } from '@/components/linkedin/profile-preview'
import { ScoreDashboard } from '@/components/linkedin/score-dashboard'
import { ImportModal } from '@/components/linkedin/import-modal'

export default function LinkedInOptimizerPage() {
  const [profileData, setProfileData] = useState<LinkedInProfileData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('aethercv_linkedin_profile_v1')
        if (cached) return JSON.parse(cached)
      } catch {
        // fallback to default
      }
    }
    return DEFAULT_LINKEDIN_PROFILE
  })

  const [targetRole, setTargetRole] = useState<TargetRole>('software-engineer')
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [copiedAll, setCopiedAll] = useState(false)
  const [activeMobileView, setActiveMobileView] = useState<'editor' | 'preview' | 'score'>('editor')
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aethercv_linkedin_profile_v1', JSON.stringify(profileData))
    } catch {
      // ignore
    }
  }, [profileData])

  // Recalculate score reactively
  const scoreReport = useMemo(() => {
    return calculateLinkedInScore(profileData, targetRole)
  }, [profileData, targetRole])

  // Section copy helper
  const handleCopySection = (text: string, _label: string) => {
    navigator.clipboard.writeText(text)
  }

  // Copy full profile specification
  const handleCopyAll = () => {
    const text = exportToLinkedInPlainText(profileData)
    navigator.clipboard.writeText(text)
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2500)
  }

  // Exports
  const handleExportTxt = () => {
    const text = exportToLinkedInPlainText(profileData)
    downloadFile(
      text,
      `${profileData.fullName.replace(/\s+/g, '_')}_LinkedIn_Profile.txt`,
      'text/plain;charset=utf-8'
    )
    setExportMenuOpen(false)
  }

  const handleExportMd = () => {
    const md = exportToMarkdown(profileData)
    downloadFile(
      md,
      `${profileData.fullName.replace(/\s+/g, '_')}_LinkedIn_Profile.md`,
      'text/markdown;charset=utf-8'
    )
    setExportMenuOpen(false)
  }

  const handleExportPdf = async () => {
    setExportMenuOpen(false)
    await exportLinkedInToPdf(profileData)
  }

  // Keyword adder from dashboard
  const handleAddKeyword = (keyword: string) => {
    if (!profileData.skills.includes(keyword)) {
      setProfileData((prev) => ({
        ...prev,
        skills: [...prev.skills, keyword]
      }))
    }
  }

  // Reset to default
  const handleResetDemo = () => {
    if (confirm('Reset to default recruiter-tested demo profile?')) {
      setProfileData(DEFAULT_LINKEDIN_PROFILE)
    }
  }

  return (
    <div className="min-h-screen bg-[#07101F] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Banner / Breadcrumb & Status */}
      <header className="border-b border-white/10 bg-[#0A1322]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  LinkedIn Profile Optimizer
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <Award className="w-3 h-3" /> Recruiter AI
                </span>
                {scoreReport.allStarBadge && (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    ⭐ All-Star
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Recruiter search ranking, STAR rewrites & live real-time preview
              </p>
            </div>
          </div>

          {/* Target Role & Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Target Role Selector */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#07101F] border border-white/10 text-xs">
              <span className="text-slate-400 font-medium hidden sm:inline">Role:</span>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as TargetRole)}
                className="bg-transparent text-blue-300 font-semibold focus:outline-none cursor-pointer"
              >
                {TARGET_ROLES.map((role) => (
                  <option key={role} value={role} className="bg-[#0B1528] text-white">
                    {ROLE_LABELS[role] || role}
                  </option>
                ))}
              </select>
            </div>

            {/* Import Button */}
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition"
              title="Import from Resume Builder, Paste text, or Upload PDF"
            >
              <Upload className="w-3.5 h-3.5 text-blue-400" />
              <span>Import</span>
            </button>

            {/* Copy Full Profile */}
            <button
              onClick={handleCopyAll}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-sm ${
                copiedAll
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied All!' : 'Copy Profile'}</span>
            </button>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#162440] hover:bg-[#1C2F52] border border-blue-500/30 text-xs font-semibold text-blue-200 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              {exportMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-[#0B1528] border border-blue-500/30 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setExportMenuOpen(false)}
                >
                  <button
                    onClick={handleExportPdf}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-blue-600/20 hover:text-white rounded-lg transition"
                  >
                    <FileDown className="w-4 h-4 text-red-400" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={handleExportMd}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-blue-600/20 hover:text-white rounded-lg transition"
                  >
                    <FileCode className="w-4 h-4 text-blue-400" />
                    <span>Markdown (.md)</span>
                  </button>
                  <button
                    onClick={handleExportTxt}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-blue-600/20 hover:text-white rounded-lg transition"
                  >
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>LinkedIn Text (.txt)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Reset */}
            <button
              onClick={handleResetDemo}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
              title="Reset Demo Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile View Switcher (Tab toggle for screens < lg) */}
        <div className="lg:hidden flex border-t border-white/5 bg-[#07101F] px-4 py-1.5 gap-2">
          {[
            { id: 'editor', label: 'Editor & AI Tools', icon: Sliders },
            { id: 'preview', label: 'Live Preview', icon: Eye },
            { id: 'score', label: `Score (${scoreReport.overallScore})`, icon: TrendingUp }
          ].map((v) => {
            const Icon = v.icon
            const isActive = activeMobileView === v.id
            return (
              <button
                key={v.id}
                onClick={() => setActiveMobileView(v.id as any)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{v.label}</span>
              </button>
            )
          })}
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Editor & Score Dashboard */}
          <div
            className={`space-y-6 lg:col-span-7 ${
              activeMobileView === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
            {/* Recruiter Score Dashboard */}
            <div className={activeMobileView === 'editor' ? 'block' : activeMobileView === 'score' ? 'block' : 'hidden lg:block'}>
              <ScoreDashboard
                report={scoreReport}
                targetRole={targetRole}
                onAddKeyword={handleAddKeyword}
              />
            </div>

            {/* 6-Tab Studio Editor */}
            <div className={activeMobileView === 'score' ? 'hidden lg:block' : 'block'}>
              <EditorTabs
                data={profileData}
                onChange={setProfileData}
                targetRole={targetRole}
                onRoleChange={setTargetRole}
              />
            </div>
          </div>

          {/* Right Column: Live Sticky LinkedIn Profile Preview */}
          <div
            className={`lg:col-span-5 lg:sticky lg:top-20 space-y-4 ${
              activeMobileView !== 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Preview Header & Controls */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live LinkedIn Preview
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Real-Time Recruiter View
              </span>
            </div>

            {/* LinkedIn Card */}
            <ProfilePreview
              data={profileData}
              targetRole={targetRole}
              onCopySection={handleCopySection}
            />

            {/* Quick helper tip */}
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Recruiter Search Tip: </span>
                Click the <Copy className="w-3 h-3 inline mx-0.5 text-blue-400" /> icon beside any section to copy it directly into your live LinkedIn profile.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A1322] py-4 text-center text-xs text-slate-500">
        <p>AETHERCV AI LinkedIn Profile Optimizer • Recruiter Ranking Engine • Strict Character Limit Compliance</p>
      </footer>

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={(newData) => {
          setProfileData((prev) => ({
            ...prev,
            ...newData
          }))
        }}
      />
    </div>
  )
}
