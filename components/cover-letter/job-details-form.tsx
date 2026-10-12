'use client'

import React from 'react'
import { JobDetails, WritingTone, WorkplaceType } from '@/types/cover-letter'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Building2, Briefcase, User, MapPin, Clock, Globe,
  Sparkles, Sliders
} from 'lucide-react'
import { UniversalJobRoleSelector } from '@/components/shared/universal-job-role-selector'

interface JobDetailsFormProps {
  jobDetails: JobDetails
  onChange: (details: JobDetails) => void
  disabled?: boolean
}

const TONES: { id: WritingTone; label: string; desc: string }[] = [
  { id: 'professional', label: 'Professional', desc: 'Balanced, polished, industry-standard' },
  { id: 'corporate', label: 'Corporate', desc: 'Traditional, structured, protocol-aligned' },
  { id: 'startup', label: 'Startup', desc: 'Fast-paced, high ownership, agile' },
  { id: 'modern', label: 'Modern', desc: 'Punchy, conversational, contemporary' },
  { id: 'creative', label: 'Creative', desc: 'Expressive, narrative-driven, bold' },
  { id: 'technical', label: 'Technical', desc: 'Architecture-first, algorithmic, systems-level' },
  { id: 'formal', label: 'Formal', desc: 'Respectful, academic, institutional' },
  { id: 'confident', label: 'Confident', desc: 'Direct, assertive, results-driven' },
  { id: 'friendly', label: 'Friendly', desc: 'Warm, personable, team-first' },
  { id: 'executive', label: 'Executive', desc: 'Strategic, governance, leadership authority' }
]

export function JobDetailsForm({ jobDetails, onChange, disabled }: JobDetailsFormProps) {
  const updateField = <K extends keyof JobDetails>(field: K, value: JobDetails[K]) => {
    onChange({ ...jobDetails, [field]: value })
  }

  return (
    <div className="space-y-6">
      {/* Target Role Core Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-outfit">
            <Building2 className="w-3.5 h-3.5 text-[#818cf8]" />
            Company Name <span className="text-blue-400">*</span>
          </Label>
          <Input
            value={jobDetails.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            placeholder="e.g. Google, Microsoft, Stripe"
            disabled={disabled}
            className="bg-[#08111F] border-blue-500/25 text-white placeholder:text-slate-500 text-xs font-outfit rounded-xl focus:border-[#4D48E6]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-outfit">
            <Briefcase className="w-3.5 h-3.5 text-[#818cf8]" />
            Job Title / Target Role <span className="text-blue-400">*</span>
          </Label>
          <UniversalJobRoleSelector
            value={jobDetails.jobTitle}
            onChange={(role) => updateField('jobTitle', role)}
            placeholder="Select or search 200+ roles, or type custom..."
            id="cover-letter-job-title"
          />
        </div>
      </div>

      {/* Secondary Role Information */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-outfit">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Hiring Manager (Optional)
          </Label>
          <Input
            value={jobDetails.hiringManager || ''}
            onChange={(e) => updateField('hiringManager', e.target.value)}
            placeholder="e.g. Jane Doe or Team Lead"
            disabled={disabled}
            className="bg-[#08111F] border-blue-500/25 text-white placeholder:text-slate-500 text-xs font-outfit rounded-xl focus:border-[#4D48E6]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-outfit">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Years of Experience
          </Label>
          <Input
            value={jobDetails.yearsOfExperience || ''}
            onChange={(e) => updateField('yearsOfExperience', e.target.value)}
            placeholder="e.g. 2+ years / Entry-level"
            disabled={disabled}
            className="bg-[#08111F] border-blue-500/25 text-white placeholder:text-slate-500 text-xs font-outfit rounded-xl focus:border-[#4D48E6]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-outfit">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Location (Optional)
          </Label>
          <Input
            value={jobDetails.location || ''}
            onChange={(e) => updateField('location', e.target.value)}
            placeholder="e.g. San Francisco, CA / Hyderabad"
            disabled={disabled}
            className="bg-[#08111F] border-blue-500/25 text-white placeholder:text-slate-500 text-xs font-outfit rounded-xl focus:border-[#4D48E6]"
          />
        </div>
      </div>

      {/* Workplace Arrangement */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-outfit">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          Workplace Model
        </Label>
        <div className="grid grid-cols-3 gap-2.5">
          {(['remote', 'hybrid', 'on-site'] as WorkplaceType[]).map((type) => (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => updateField('workplaceType', type)}
              className={`py-2 px-3 rounded-xl text-xs font-medium capitalize transition-all border ${
                jobDetails.workplaceType === type
                  ? 'bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] text-white border-transparent shadow-[0_0_12px_rgba(77,72,230,0.35)]'
                  : 'bg-[#08111F] text-slate-300 border-blue-500/20 hover:border-blue-400/40 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Job Description Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-outfit">
            <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
            Job Description <span className="text-blue-400">*</span>
          </Label>
          <span className="text-[11px] text-slate-400 font-mono">
            {jobDetails.jobDescription.length} chars
          </span>
        </div>
        <textarea
          rows={6}
          value={jobDetails.jobDescription}
          onChange={(e) => updateField('jobDescription', e.target.value)}
          placeholder="Paste key responsibilities, qualifications, and tech stack from the job posting..."
          disabled={disabled}
          className="w-full p-3.5 rounded-2xl bg-[#08111F] border border-blue-500/25 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[#4D48E6] leading-relaxed resize-y"
        />
      </div>

      {/* Writing Tone Selector */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 font-outfit">
            <Sliders className="w-3.5 h-3.5 text-[#818cf8]" />
            Writing Tone &amp; Communication Style <span className="text-blue-400">*</span>
          </Label>
          <span className="text-[11px] text-[#818cf8] font-semibold capitalize font-outfit">
            {jobDetails.tone} Tone Selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TONES.map((t) => {
            const isSelected = jobDetails.tone === t.id
            return (
              <button
                key={t.id}
                type="button"
                disabled={disabled}
                onClick={() => updateField('tone', t.id)}
                className={`p-2.5 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] text-white border-transparent shadow-[0_0_15px_rgba(77,72,230,0.35)] scale-[1.02]'
                    : 'bg-[#08111F] text-slate-300 border-blue-500/20 hover:border-blue-400/40 hover:text-white'
                }`}
              >
                <span className="text-xs font-bold font-poppins">{t.label}</span>
                <span className={`text-[10px] mt-1 font-outfit leading-tight line-clamp-2 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {t.desc}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
