'use client'

import React, { useState } from 'react'
import { LinkedInProfileData, TargetRole } from '@/types/linkedin'
import {
  Copy, Check, MapPin, Link as LinkIcon, Briefcase, GraduationCap,
  Sparkles, Award, Globe, Users, ExternalLink, CheckCircle2, ChevronDown,
  ChevronUp, HeartHandshake, Eye
} from 'lucide-react'

interface ProfilePreviewProps {
  data: LinkedInProfileData
  targetRole?: TargetRole
  onCopySection?: (text: string, label: string) => void
}

export function ProfilePreview({ data, targetRole: _targetRole, onCopySection }: ProfilePreviewProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isAboutExpanded, setIsAboutExpanded] = useState<boolean>(false)

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    if (onCopySection) onCopySection(text, key)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Get initials for avatar
  const initials = (data.fullName || 'User')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-4 font-outfit text-slate-100 select-text">
      {/* ── CARD 1: TOP INTRO & BANNER ── */}
      <div className="rounded-2xl bg-[#0C162B] border border-blue-500/25 overflow-hidden shadow-xl">
        {/* Banner */}
        <div
          className="h-32 sm:h-40 w-full relative"
          style={{ background: data.bannerGradient || 'linear-gradient(135deg, #07101F 0%, #162440 50%, #2662EB 100%)' }}
        >
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] text-sky-300 font-semibold border border-white/10">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Recruiter Optimized</span>
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-5 pb-5 pt-0 relative">
          {/* Avatar with optional Open to Work emerald ring */}
          <div className="flex items-end justify-between -mt-14 mb-3">
            <div className="relative">
              <div
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#111D34] text-white flex items-center justify-center font-bold text-2xl sm:text-3xl border-4 shadow-xl ${
                  data.openToWork ? 'border-emerald-500 ring-4 ring-emerald-500/30' : 'border-[#0C162B]'
                }`}
              >
                {initials}
              </div>

              {data.openToWork && (
                <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow-md">
                  #OpenToWork
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(data.headline, 'headline')}
                className="px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === 'headline' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'headline' ? 'Copied' : 'Copy Headline'}</span>
              </button>
            </div>
          </div>

          {/* Name & Headline */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold font-poppins text-white">
                {data.fullName || 'Your Full Name'}
              </h1>
              <span className="text-xs text-slate-400 font-medium">(He/Him/They)</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {data.headline || 'Your Recruiter-Optimized Headline'}
            </p>

            {/* Location & Connections */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{data.location || 'Location'}</span>
              </span>

              {data.customUrl && (
                <span className="flex items-center gap-1 text-sky-400 hover:underline">
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>{data.customUrl}</span>
                </span>
              )}

              <span className="text-sky-300 font-semibold">500+ connections</span>
            </div>
          </div>

          {/* Open to Work Recruiter Box */}
          {data.openToWork && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Open to work
                </span>
                <span className="text-[10px] text-slate-400">Recruiters Only</span>
              </div>
              <p className="text-slate-300 text-[11.5px]">
                Target Roles: <strong className="text-white">{(data.targetRoles || []).join(', ') || 'Software Engineer'}</strong>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── CARD 2: ABOUT SECTION ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-blue-500/15 pb-2.5">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold font-poppins text-white">About</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-sky-300 font-mono">
              {data.about.length} / 2,600 chars
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleCopy(data.about, 'about')}
            className="px-2.5 py-1 rounded-lg text-xs text-sky-400 hover:text-sky-200 bg-blue-500/15 flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copiedKey === 'about' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'about' ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="text-xs sm:text-[13px] text-slate-300 leading-relaxed whitespace-pre-wrap">
          {isAboutExpanded ? data.about : data.about.slice(0, 380) + (data.about.length > 380 ? '...' : '')}
        </div>

        {data.about.length > 380 && (
          <button
            type="button"
            onClick={() => setIsAboutExpanded(!isAboutExpanded)}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
          >
            {isAboutExpanded ? (
              <>
                <span>See less</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>...see more</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* ── CARD 3: EXPERIENCE ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-blue-500/15 pb-2.5">
          <h2 className="text-base font-bold font-poppins text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-sky-400" />
            <span>Experience</span>
          </h2>
          <span className="text-xs text-slate-400">{data.experience.length} Positions</span>
        </div>

        <div className="space-y-4">
          {data.experience.map((exp, idx) => (
            <div key={exp.id || idx} className="space-y-1.5 pb-3 border-b border-blue-500/10 last:border-0 last:pb-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white font-poppins">{exp.role}</h3>
                  <p className="text-xs text-sky-300 font-semibold">{exp.company}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-medium shrink-0">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>

              {exp.location && <p className="text-[11px] text-slate-400">{exp.location}</p>}

              {/* Bullet points */}
              {exp.bulletPoints && exp.bulletPoints.length > 0 ? (
                <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-300 pt-1">
                  {exp.bulletPoints.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              ) : exp.description ? (
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{exp.description}</p>
              ) : null}

              {/* Tagged skills */}
              {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                <div className="pt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400">Skills:</span>
                  {exp.skillsUsed.map((sk, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-sky-300 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CARD 4: FEATURED PROJECTS ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-blue-500/15 pb-2.5">
          <h2 className="text-base font-bold font-poppins text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-[#818cf8]" />
            <span>Featured Projects</span>
          </h2>
          <span className="text-xs text-slate-400">{data.projects.length} Projects</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {data.projects.map((proj, idx) => (
            <div key={proj.id || idx} className="p-3.5 rounded-xl bg-[#07101F] border border-blue-500/20 space-y-2">
              <div className="flex items-start justify-between gap-1.5">
                <h3 className="text-xs font-bold text-white font-poppins">{proj.title}</h3>
                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sky-400 hover:text-sky-300 p-1"
                    title="View Project Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {proj.problem && (
                <p className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Problem:</strong> {proj.problem}
                </p>
              )}

              {proj.solution && (
                <p className="text-[11px] text-slate-400">
                  <strong className="text-slate-300">Solution:</strong> {proj.solution}
                </p>
              )}

              {proj.impact && (
                <p className="text-[11px] text-emerald-300 bg-emerald-950/30 p-1.5 rounded-lg border border-emerald-500/20">
                  <strong>Impact:</strong> {proj.impact}
                </p>
              )}

              {proj.technologies && proj.technologies.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {proj.technologies.map((t, i) => (
                    <span key={i} className="text-[9.5px] px-1.5 py-0.5 rounded bg-blue-500/10 text-sky-400 font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── CARD 5: SKILLS & ENDORSEMENTS ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-blue-500/15 pb-2.5">
          <h2 className="text-base font-bold font-poppins text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Skills &amp; Endorsements</span>
          </h2>
          <span className="text-xs text-emerald-400 font-semibold">{data.skills.length} Skills</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {data.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-[#07101F] border border-blue-500/20 text-xs font-semibold text-slate-200 hover:border-blue-500/40 transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ── CARD 6: EDUCATION ── */}
      <div className="p-5 rounded-2xl bg-[#0C162B] border border-blue-500/25 space-y-3 shadow-xl">
        <div className="flex items-center justify-between border-b border-blue-500/15 pb-2.5">
          <h2 className="text-base font-bold font-poppins text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span>Education</span>
          </h2>
        </div>

        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div key={edu.id || idx} className="space-y-1">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-bold text-white font-poppins">{edu.school}</h3>
                <span className="text-[11px] text-slate-400">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <p className="text-xs text-sky-300 font-medium">
                {edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
              </p>
              {edu.grade && <p className="text-[11px] text-slate-400 font-semibold">{edu.grade}</p>}
              {edu.activities && <p className="text-[11px] text-slate-400">{edu.activities}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
