'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, AlertCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SAMPLE_RESUMES } from '@/lib/resume/sample-resumes'

interface ResumeUploadZoneProps {
  onAnalyze: (file: File | null, textContent: string, fileName: string) => Promise<void>
  isLoading: boolean
}

export function ResumeUploadZone({ onAnalyze, isLoading }: ResumeUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload')
  const [pastedText, setPastedText] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateAndProcessFile = async (file: File) => {
    setErrorMsg(null)

    // 1. Validate File Size (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File exceeds 10MB size limit. Please upload a smaller document.')
      return
    }

    // 2. Validate File Extension
    const name = file.name.toLowerCase()
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md']
    const hasValidExt = validExtensions.some(ext => name.endsWith(ext))

    if (!hasValidExt) {
      setErrorMsg('Invalid file format. Supported formats are PDF (.pdf) and Microsoft Word (.docx).')
      return
    }

    try {
      await onAnalyze(file, '', file.name)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error occurred while processing document.')
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await validateAndProcessFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await validateAndProcessFile(e.target.files[0])
    }
  }

  const handlePasteSubmit = async () => {
    setErrorMsg(null)
    if (!pastedText.trim() || pastedText.trim().length < 50) {
      setErrorMsg('Please paste at least 50 characters of resume content.')
      return
    }
    try {
      await onAnalyze(null, pastedText.trim(), 'pasted-resume.txt')
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error processing pasted resume.')
    }
  }

  const handleSampleSelect = async (content: string, title: string) => {
    setErrorMsg(null)
    try {
      await onAnalyze(null, content, `${title.replace(/\s+/g, '_')}_Sample.txt`)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error loading sample resume.')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-sky-400/40'
              : 'bg-[#0F172A]/70 hover:bg-[#1E293B] text-slate-300 hover:text-white border border-blue-500/20'
          }`}
        >
          <Upload className="w-4 h-4 text-sky-400" />
          Upload Document (PDF / DOCX)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'paste'
              ? 'bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] border border-sky-400/40'
              : 'bg-[#0F172A]/70 hover:bg-[#1E293B] text-slate-300 hover:text-white border border-blue-500/20'
          }`}
        >
          <FileText className="w-4 h-4 text-cyan-400" />
          Direct Text Paste
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-blue-950/60 border border-sky-500/40 text-sky-200 text-xs font-medium flex items-center gap-2.5 shadow-[0_0_20px_-3px_rgba(56,189,248,0.3)] backdrop-blur-md"
        >
          <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{errorMsg}</span>
        </motion.div>
      )}

      {/* Upload Zone */}
      {activeTab === 'upload' ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center backdrop-blur-xl group ${
            dragActive
              ? 'border-cyan-400 bg-blue-600/15 scale-[1.01] shadow-[0_0_35px_rgba(59,130,246,0.4)]'
              : 'border-blue-500/30 hover:border-sky-400/60 bg-[#0F172A]/75 hover:bg-[#0F172A]/90 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="p-4 rounded-2xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white group-hover:scale-110 transition-transform mb-4 shadow-[0_0_20px_rgba(59,130,246,0.45)]">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold font-poppins text-white mb-1">
            {isLoading ? 'Verifying & Auditing Resume...' : 'Drop your resume file here, or browse'}
          </h3>
          <p className="text-xs text-slate-400 font-outfit max-w-md mb-4 leading-relaxed">
            Supports <strong className="text-sky-300">PDF</strong> and <strong className="text-sky-300">DOCX</strong> resumes up to 10MB. Only authentic Resumes &amp; CVs are verified (homework assignments, class notes, and essays are automatically rejected).
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
            <span>Select File</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ) : (
        /* Text Paste Area */
        <div className="p-6 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_25px_-5px_rgba(37,99,235,0.15)] space-y-4">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste raw resume plain text here (including contact, experience, skills, education, projects)..."
            rows={10}
            className="w-full p-4 rounded-2xl bg-[#08111F] border border-blue-500/25 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/40 leading-relaxed resize-y"
          />
          <div className="flex justify-end">
            <Button
              onClick={handlePasteSubmit}
              disabled={isLoading || !pastedText.trim()}
              className="gap-2 font-outfit text-xs bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              {isLoading ? 'Analyzing...' : 'Analyze Pasted Resume'}
            </Button>
          </div>
        </div>
      )}

      {/* 1-Click Sample Resumes Shelf */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold font-poppins text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Quick Demo: Load Curated Industry Sample Resumes
          </span>
          <span className="text-[11px] text-sky-400">1-Click Immediate Scan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_RESUMES.map((sample) => (
            <motion.div
              key={sample.id}
              whileHover={{ y: -2 }}
              onClick={() => handleSampleSelect(sample.content, sample.title)}
              className="p-3.5 rounded-2xl bg-[#0F172A]/70 hover:bg-[#131F37] border border-blue-500/20 hover:border-sky-400/50 cursor-pointer transition-all flex flex-col justify-between text-left group shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.3)]"
            >
              <div>
                <h4 className="text-xs font-bold font-poppins text-white group-hover:text-cyan-300 transition-colors">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-outfit mt-1 line-clamp-2">
                  {sample.description}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-sky-400 group-hover:text-cyan-300 transition-colors">
                <span>Load Sample</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
