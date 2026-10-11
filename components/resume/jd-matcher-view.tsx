'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ParsedResume, JDMatchResult } from '@/lib/resume/types'
import { matchJobDescription } from '@/lib/resume/jd-matcher'
import { Button } from '@/components/ui/button'
import {
  Briefcase, CheckCircle2, XCircle, Sparkles, Target,
  Zap, ArrowRight, FileText, Check, AlertCircle
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border/40 gap-3">
        <div>
          <h3 className="text-base font-bold font-poppins text-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Job Description Target Matcher & ATS Gap Analysis
          </h3>
          <p className="text-xs text-muted-foreground font-outfit">
            Paste any job posting to analyze skill alignment, match percentage, and missing keywords
          </p>
        </div>
      </div>

      {/* Input & Sample Buttons */}
      <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-primary" />
            Paste Target Job Description:
          </label>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground text-[11px]">Load Sample:</span>
            {SAMPLE_JOB_DESCRIPTIONS.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => loadSampleJD(s.content)}
                className="px-2 py-0.5 rounded-md bg-secondary hover:bg-secondary/80 text-foreground text-[11px] font-medium border border-border/40 transition-colors"
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
          className="w-full p-3.5 rounded-xl bg-background border border-border/60 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-y"
        />

        <div className="flex justify-end">
          <Button
            onClick={() => handleMatch()}
            disabled={!jdText.trim() || isMatching}
            className="gap-2 shadow-md font-outfit"
          >
            <Sparkles className="w-4 h-4" />
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
          <div className="p-6 rounded-2xl bg-card/70 backdrop-blur-md border border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Circular Mini Gauge */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted/30"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={matchResult.matchPercentage >= 75 ? '#10b981' : matchResult.matchPercentage >= 50 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - matchResult.matchPercentage / 100)}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-extrabold font-poppins text-foreground">
                    {matchResult.matchPercentage}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {matchResult.matchTier}
                </span>
                <h4 className="text-base font-bold font-poppins text-foreground mt-1">
                  Target Role: {matchResult.jobTitleDetected}
                </h4>
                <p className="text-xs text-muted-foreground font-outfit mt-0.5">
                  Alignment based on technical stack, skills, and industry terminology
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-center">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-xs text-muted-foreground block">Matched Skills</span>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-poppins">
                  {matchResult.matchedSkills.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <span className="text-xs text-muted-foreground block">Missing Skills</span>
                <span className="text-lg font-bold text-red-600 dark:text-red-400 font-poppins">
                  {matchResult.missingSkills.length}
                </span>
              </div>
            </div>
          </div>

          {/* Matched vs Missing Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Matched Skills */}
            <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-emerald-500/20">
              <h4 className="text-sm font-semibold text-foreground font-poppins mb-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Matched Skills & Tech ({matchResult.matchedSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.matchedSkills.length > 0 ? (
                  matchResult.matchedSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium"
                    >
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">None found</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="p-4 rounded-2xl bg-card/60 backdrop-blur-sm border border-red-500/20">
              <h4 className="text-sm font-semibold text-foreground font-poppins mb-2 flex items-center gap-1.5 text-red-600 dark:text-red-400">
                <XCircle className="w-4 h-4" />
                Missing Required Skills ({matchResult.missingSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.missingSkills.length > 0 ? (
                  matchResult.missingSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20 font-medium"
                    >
                      + {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    100% of requested skills matched!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Missing Keywords & Tailored Recommendations */}
          <div className="p-5 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/50 space-y-3">
            <h4 className="text-sm font-semibold text-foreground font-poppins flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Tailored ATS Optimization Recommendations
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-outfit">
              {matchResult.tailoredRecommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">•</span>
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
