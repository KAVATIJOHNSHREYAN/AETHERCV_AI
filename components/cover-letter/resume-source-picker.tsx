'use client'

import React, { useRef, useState } from 'react'
import { ParsedResume } from '@/lib/resume/types'
import { Button } from '@/components/ui/button'
import {
  Upload, FileText, CheckCircle2, AlertCircle, RefreshCw,
  UserCheck, Sparkles
} from 'lucide-react'

interface ResumeSourcePickerProps {
  analyzedResume: ParsedResume | null
  activeResume: ParsedResume | null
  onSelectResume: (resume: ParsedResume | null) => void
  onUploadNewResume: (file: File) => Promise<void>
  isUploading?: boolean
}

export function ResumeSourcePicker({
  analyzedResume,
  activeResume,
  onSelectResume,
  onUploadNewResume,
  isUploading
}: ResumeSourcePickerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [sourceMode, setSourceMode] = useState<'existing' | 'upload'>(
    analyzedResume ? 'existing' : 'upload'
  )

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await onUploadNewResume(file)
    }
  }

  return (
    <div className="space-y-4">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#08111F] border border-blue-500/20 w-fit">
        {analyzedResume && (
          <button
            type="button"
            onClick={() => {
              setSourceMode('existing')
              onSelectResume(analyzedResume)
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              sourceMode === 'existing'
                ? 'bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] text-white shadow-[0_0_12px_rgba(77,72,230,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Use Analyzed Resume
          </button>
        )}

        <button
          type="button"
          onClick={() => setSourceMode('upload')}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            sourceMode === 'upload'
              ? 'bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] text-white shadow-[0_0_12px_rgba(77,72,230,0.35)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Different Resume
        </button>
      </div>

      {/* Mode 1: Using Existing Resume */}
      {sourceMode === 'existing' && analyzedResume && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#08111F]/90 border border-[#4D48E6]/40 flex items-center justify-between gap-4 shadow-[0_4px_20px_rgba(77,72,230,0.12)]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4D48E6] via-[#2662EB] to-[#1E50DA] flex items-center justify-center text-white shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold font-poppins text-white">
                  {analyzedResume.contact.name || 'Current Candidate Profile'}
                </h4>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 font-outfit mt-0.5">
                {analyzedResume.contact.email || 'No email'} •{' '}
                {analyzedResume.experience.length} experience entries •{' '}
                {analyzedResume.projects.length} projects
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setSourceMode('upload')}
            className="text-xs font-outfit border-blue-500/30 text-sky-300 hover:bg-blue-600/15"
          >
            Change
          </Button>
        </div>
      )}

      {/* Mode 2: Upload New Resume Dropzone */}
      {sourceMode === 'upload' && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-blue-500/30 hover:border-[#4D48E6] transition-all rounded-2xl p-6 sm:p-8 text-center bg-[#08111F]/60 hover:bg-[#08111F]/90 space-y-3"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.webp"
            className="hidden"
          />
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-500/15 border border-blue-500/30 text-[#818cf8] flex items-center justify-center shadow-[0_0_15px_rgba(77,72,230,0.2)]">
            {isUploading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold font-poppins text-white">
              {isUploading ? 'Extracting Resume Data...' : 'Click to Upload Resume Document'}
            </h4>
            <p className="text-xs text-slate-400 font-outfit mt-1">
              Supports .PDF, .DOCX, Images (.PNG/.JPG), or .TXT up to 10MB
            </p>
          </div>
        </div>
      )}

      {/* Active Selection Indicator */}
      {activeResume && (
        <div className="flex items-center gap-2 text-xs text-slate-300 font-outfit bg-blue-950/30 p-2.5 rounded-xl border border-blue-500/20">
          <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
          <span>
            Candidate profile verified: <strong className="text-white">{activeResume.contact.name || 'Candidate'}</strong>. All experience points and competencies will be used without hallucination.
          </span>
        </div>
      )}
    </div>
  )
}
