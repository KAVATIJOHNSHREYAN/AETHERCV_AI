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
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          <Upload className="w-4 h-4" />
          Upload Document (PDF / DOCX)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'paste'
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" />
          Direct Text Paste
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-2.5"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
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
          className={`relative p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center backdrop-blur-md group ${
            dragActive
              ? 'border-primary bg-primary/10 scale-[1.01]'
              : 'border-border/60 hover:border-primary/60 bg-card/40 hover:bg-card/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform mb-4 shadow-inner">
            <Upload className="w-8 h-8" />
          </div>

          <h3 className="text-base sm:text-lg font-bold font-poppins text-foreground mb-1">
            {isLoading ? 'Parsing and Auditing Resume...' : 'Drop your resume file here, or browse'}
          </h3>
          <p className="text-xs text-muted-foreground font-outfit max-w-sm mb-4">
            Supports <strong className="text-foreground">PDF</strong> and <strong className="text-foreground">DOCX</strong> documents up to 10MB. 100% private, self-contained processing.
          </p>

          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <span>Select File</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ) : (
        /* Text Paste Area */
        <div className="p-6 rounded-3xl bg-card/60 backdrop-blur-md border border-border/50 space-y-4">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste raw resume plain text here (including contact, experience, skills, education, projects)..."
            rows={10}
            className="w-full p-4 rounded-2xl bg-background border border-border/60 text-xs font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed resize-y"
          />
          <div className="flex justify-end">
            <Button
              onClick={handlePasteSubmit}
              disabled={isLoading || !pastedText.trim()}
              className="gap-2 shadow-md font-outfit"
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Analyzing...' : 'Analyze Pasted Resume'}
            </Button>
          </div>
        </div>
      )}

      {/* 1-Click Sample Resumes Shelf */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold font-poppins text-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Demo: Load Curated Industry Sample Resumes
          </span>
          <span className="text-[11px] text-muted-foreground">1-Click Immediate Scan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_RESUMES.map((sample) => (
            <motion.div
              key={sample.id}
              whileHover={{ y: -2 }}
              onClick={() => handleSampleSelect(sample.content, sample.title)}
              className="p-3.5 rounded-2xl bg-secondary/30 hover:bg-secondary/70 border border-border/40 hover:border-primary/50 cursor-pointer transition-all flex flex-col justify-between text-left group"
            >
              <div>
                <h4 className="text-xs font-bold font-poppins text-foreground group-hover:text-primary transition-colors">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-muted-foreground font-outfit mt-1 line-clamp-2">
                  {sample.description}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-primary">
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
