'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ParsedResume, JDMatchResult } from '@/lib/resume/types'
import { matchJobDescription } from '@/lib/resume/jd-matcher'
import { Button } from '@/components/ui/button'
import {
  Briefcase, CheckCircle2, Sparkles, Target,
  Zap, ArrowRight, FileText, Check, PlusCircle, Layers
} from 'lucide-react'

interface JdMatcherViewProps {
  resume: ParsedResume
}

const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: 'Full Stack Engineer (React + Node.js)',
    content: `We are looking for a Full Stack Software Engineer to build scalable web applications.
Responsibilities:
- Build modern user interfaces using React, Next.js, TypeScript, and Tailwind CSS.
- Design high-performance RESTful APIs and microservices using Node.js, Express, and PostgreSQL.
- Deploy and monitor cloud applications on AWS (S3, EC2, Lambda) and Docker containers.
- Write automated unit tests using Jest, follow CI/CD pipelines with GitHub Actions.
Requirements:
- Bachelor's degree in Computer Science or related field.
- Strong proficiency in JavaScript, TypeScript, React, Node.js, Git, and Docker.
- Experience with Redis caching, SQL databases, and Agile/Scrum methodologies.
- AWS Certified Cloud Practitioner is a plus.`
  },
  {
    title: 'AI / Machine Learning Engineer',
    content: `Seeking an innovative AI / Machine Learning Engineer to design next-gen Generative AI platforms.
Requirements:
- Hands-on experience developing deep learning models with PyTorch or TensorFlow.
- Strong background in Natural Language Processing (NLP), Large Language Models (LLM), and RAG architectures.
- Experience with LangChain, LlamaIndex, vector databases (Pinecone, ChromaDB, Weaviate).
- Proficient in Python, FastAPI, Docker, and AWS SageMaker.
- Experience fine-tuning open-source models and optimizing inference latency.`
  }
]

export function JdMatcherView({ resume }: JdMatcherViewProps) {
  const [jdText, setJdText] = useState('')
  const [matchResult, setMatchResult] = useState<JDMatchResult | null>(null)
  const [isMatching, setIsMatching] = useState(false)

  const handleMatch = (textToMatch?: string) => {
    const text = textToMatch || jdText
    if (!text.trim()) return

    setIsMatching(true)
    setTimeout(() => {
      const result = matchJobDescription(text, resume)
      setMatchResult(result)
      setIsMatching(false)
    }, 300)
  }

  const loadSampleJD = (sampleContent: string) => {
    setJdText(sampleContent)
    handleMatch(sampleContent)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-blue-500/20 gap-3">
        <div>
          <h3 className="text-base font-bold font-poppins text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-sky-400" />
            Job Description Target Matcher &amp; ATS Gap Analysis
          </h3>
          <p className="text-xs text-slate-400 font-outfit">
            Paste any job posting to analyze skill alignment, match percentage, and missing keywords
          </p>
        </div>
      </div>

      {/* Input & Sample Buttons */}
      <div className="p-6 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_30px_rgba(37,99,235,0.08)] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            Paste Target Job Description:
          </label>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Load Sample:</span>
            {SAMPLE_JOB_DESCRIPTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSampleJD(s.content)}
                className="px-2.5 py-1 rounded-xl bg-blue-950/50 hover:bg-blue-900/50 text-sky-300 text-[11px] font-medium border border-blue-500/30 transition-all hover:border-sky-400/50"
              >
                {s.title.split(' ')[0]} {s.title.split(' ')[1]}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste job posting text here (including responsibilities and qualifications)..."
          rows={6}
          className="w-full p-4 rounded-2xl bg-[#08111F] border border-blue-500/25 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 leading-relaxed resize-y"
        />

        <div className="flex justify-end">
          <Button
            onClick={() => handleMatch()}
            disabled={!jdText.trim() || isMatching}
            className="gap-2 font-outfit text-xs bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            {isMatching ? 'Analyzing Alignment...' : 'Calculate ATS Match %'}
          </Button>
        </div>
      </div>

      {/* Match Results Display */}
      {matchResult && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Top Score Banner */}
          <div className="p-6 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_30px_rgba(37,99,235,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Circular Mini Gauge */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="jdMatchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#22D3EE" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(59, 130, 246, 0.15)"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#jdMatchGradient)"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - matchResult.matchPercentage / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold font-poppins text-white">
                    {matchResult.matchPercentage}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                  {matchResult.matchTier}
                </span>
                <h4 className="text-base font-bold font-poppins text-white mt-1">
                  Target Role: {matchResult.jobTitleDetected}
                </h4>
                <p className="text-xs text-slate-400 font-outfit mt-0.5">
                  Alignment based on technical stack, skills, and industry terminology
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 shadow-[0_0_15px_rgba(34,211,238,0.12)]">
                <span className="text-xs text-slate-400 block">Matched Skills</span>
                <span className="text-lg font-bold text-cyan-300 font-poppins">
                  {matchResult.matchedSkills.length}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 shadow-[0_0_15px_rgba(59,130,246,0.12)]">
                <span className="text-xs text-slate-400 block">Missing Skills</span>
                <span className="text-lg font-bold text-sky-300 font-poppins">
                  {matchResult.missingSkills.length}
                </span>
              </div>
            </div>
          </div>

          {/* Matched vs Missing Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Skills */}
            <div className="p-5 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-cyan-500/25 shadow-[0_4px_20px_rgba(34,211,238,0.06)]">
              <h4 className="text-sm font-semibold text-cyan-300 font-poppins mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                Matched Skills &amp; Tech ({matchResult.matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchResult.matchedSkills.length > 0 ? (
                  matchResult.matchedSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs bg-cyan-500/10 text-cyan-200 border border-cyan-500/25 font-medium shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                    >
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">None found</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-5 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/25 shadow-[0_4px_20px_rgba(59,130,246,0.06)]">
              <h4 className="text-sm font-semibold text-sky-300 font-poppins mb-3 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4 text-sky-400" />
                Missing Required Skills ({matchResult.missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {matchResult.missingSkills.length > 0 ? (
                  matchResult.missingSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl text-xs bg-blue-500/10 text-sky-200 border border-blue-500/25 font-medium shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                    >
                      + {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-cyan-300 font-medium">
                    100% of requested skills matched!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Missing Keywords & Tailored Recommendations */}
          <div className="p-6 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_25px_rgba(37,99,235,0.06)] space-y-3">
            <h4 className="text-sm font-semibold text-white font-poppins flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Tailored ATS Optimization Recommendations
            </h4>
            <ul className="space-y-2 text-xs text-slate-300 font-outfit">
              {matchResult.tailoredRecommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}
