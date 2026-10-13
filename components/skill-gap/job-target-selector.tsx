'use client'

import React from 'react'
import { JobTargetInputMode } from '@/types/skill-gap'
import { UniversalJobRoleSelector } from '@/components/shared/universal-job-role-selector'
import { Briefcase, FileCode2, Sparkles, CheckCircle2 } from 'lucide-react'

interface JobTargetSelectorProps {
  mode: JobTargetInputMode
  onModeChange: (mode: JobTargetInputMode) => void
  selectedRole: string
  onRoleChange: (role: string) => void
  jobDescriptionText: string
  onJobDescriptionChange: (text: string) => void
}

const POPULAR_QUICK_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'AI Engineer',
  'Machine Learning Engineer',
  'Full Stack Developer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Cyber Security Engineer',
  'Data Scientist',
  'Data Analyst',
  'Business Analyst',
  'Product Manager',
  'UI UX Designer',
  'Android Developer',
  'iOS Developer',
  'QA Engineer',
  'Blockchain Developer',
  'Game Developer',
  'Embedded Engineer',
  'Prompt Engineer',
  'Generative AI Engineer',
  'RAG Engineer',
  'NLP Engineer',
  'MLOps Engineer',
  'Site Reliability Engineer',
  'Solution Architect',
  'Database Administrator',
  'Network Engineer',
  'SAP Consultant',
  'Oracle Developer',
  'Salesforce Developer'
]

export function JobTargetSelector({
  mode,
  onModeChange,
  selectedRole,
  onRoleChange,
  jobDescriptionText,
  onJobDescriptionChange
}: JobTargetSelectorProps) {
  const isTargetReady = mode === 'role' ? Boolean(selectedRole) : Boolean(jobDescriptionText.trim().length >= 20)

  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Step 2: Choose Target Role or Job Description
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare your resume against standard industry competencies or paste an exact vacancy.
          </p>
        </div>
        {isTargetReady && (
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 bg-indigo-500/10 border border-indigo-500/25 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Target Configured</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          type="button"
          onClick={() => onModeChange('role')}
          className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
            mode === 'role'
              ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 shadow-lg shadow-indigo-600/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Briefcase className="w-4 h-4 text-indigo-400" />
          <span>Option 1: Search Job Role</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange('jd')}
          className={`flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
            mode === 'jd'
              ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-lg shadow-blue-600/10'
              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <FileCode2 className="w-4 h-4 text-blue-400" />
          <span>Option 2: Paste Job Description</span>
        </button>
      </div>

      {/* Option 1: Search Job Role */}
      {mode === 'role' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Select or Search Role from 200+ Profiles
            </label>
            <UniversalJobRoleSelector
              value={selectedRole}
              onChange={onRoleChange}
              placeholder="Search target role (e.g. AI Engineer, Full Stack, SRE)..."
            />
          </div>

          {/* Quick Pill Suggestions */}
          <div>
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Popular Target Roles:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
              {POPULAR_QUICK_ROLES.map(role => {
                const isActive = selectedRole.toLowerCase() === role.toLowerCase()
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onRoleChange(role)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition border ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm'
                        : 'bg-slate-950/70 hover:bg-slate-800/80 text-slate-300 border-slate-800'
                    }`}
                  >
                    {role}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Option 2: Paste Job Description */}
      {mode === 'jd' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              Paste Complete Job Description & Requirements
            </label>
            <span className="text-[11px] text-slate-400">
              {jobDescriptionText.length} characters
            </span>
          </div>
          <textarea
            rows={7}
            value={jobDescriptionText}
            onChange={e => onJobDescriptionChange(e.target.value)}
            placeholder="Paste the target job description (Responsibilities, Technical Qualifications, Requirements, Nice-to-haves, Tech Stack)..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono leading-relaxed"
          />
          <p className="text-[11px] text-slate-400">
            Tip: Include both responsibilities and technical requirements for maximum keyword detection precision.
          </p>
        </div>
      )}
    </div>
  )
}
