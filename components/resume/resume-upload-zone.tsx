'use client'

import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, AlertCircle, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { SAMPLE_RESUMES } from '@/lib/resume/sample-resumes'

interface ResumeUploadZoneProps {
  onAnalyze: (file: File | null, textContent: string, fileName: string) => Promise<void>
  isLoading: boolean
}

export function ResumeUploadZone({ onAnalyze, isLoading }: ResumeUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [pastedText, setPastedText] = useState('')
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload')
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    setErrorMsg(null)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      await processSelectedFile(file)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null)
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      await processSelectedFile(file)
    }
  }

  const processSelectedFile = async (file: File) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt', '.md', '.png', '.jpg', '.jpeg', '.webp']
    const hasValidExt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

    if (!hasValidExt) {
      setErrorMsg('Please upload a valid resume document (.pdf, .docx, .png, .jpg, .txt)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10MB limit.')
      return
    }

    try {
      await onAnalyze(file, '', file.name)
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error processing document.')
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
      {/* Tab Switcher with Exact Dual-Color Gradient */}
      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'upload'
              ? 'bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] text-white shadow-[0_0_15px_rgba(77,72,230,0.5)] border border-[#818cf8]/50'
              : 'bg-[#0F172A]/70 hover:bg-[#1E293B] text-slate-300 hover:text-white border border-blue-500/20'
          }`}
        >
          <Upload className="w-4 h-4 text-[#818cf8]" />
          Upload Document (PDF / DOCX / Image)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('paste')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
            activeTab === 'paste'
              ? 'bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] text-white shadow-[0_0_15px_rgba(77,72,230,0.5)] border border-[#818cf8]/50'
              : 'bg-[#0F172A]/70 hover:bg-[#1E293B] text-slate-300 hover:text-white border border-blue-500/20'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-300" />
          Direct Text Paste
        </button>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-[#0E1729]/90 border border-[#4D48E6]/40 text-blue-200 text-xs font-medium flex items-center gap-2.5 shadow-[0_0_20px_-3px_rgba(77,72,230,0.3)] backdrop-blur-md"
        >
          <AlertCircle className="w-4 h-4 text-[#818cf8] shrink-0" />
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
              ? 'border-[#4D48E6] bg-[#4D48E6]/15 scale-[1.01] shadow-[0_0_35px_rgba(77,72,230,0.5)]'
              : 'border-blue-500/30 hover:border-[#4D48E6]/70 bg-[#0F172A]/75 hover:bg-[#0F172A]/90 hover:shadow-[0_0_30px_-5px_rgba(77,72,230,0.3)]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt,.md,.png,.jpg,.jpeg,.webp"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="relative mb-4 group-hover:scale-105 transition-transform">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-[#4D48E6] via-[#2662EB] to-[#1E50DA] shadow-[0_0_25px_rgba(77,72,230,0.5)] flex items-center justify-center">
              <Image
                src="/aethercv-logo.png"
                alt="AETHERCV AI Upload"
                width={76}
                height={76}
                className="w-full h-full object-cover rounded-full"
                unoptimized
              />
            </div>
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#1E50DA] text-white shadow-md border border-[#818cf8]/50">
              <Upload className="w-3.5 h-3.5" />
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-poppins text-white mb-1">
            {isLoading ? 'Verifying & Auditing Resume...' : 'Drop your resume file here, or browse'}
          </h3>
          <p className="text-xs text-slate-400 font-outfit max-w-md mb-4 leading-relaxed">
            Supports <strong className="text-blue-300">PDF</strong>, <strong className="text-blue-300">DOCX</strong>, and <strong className="text-blue-300">Images (PNG/JPG)</strong> up to 10MB. Genuine resumes and CVs are analyzed immediately.
          </p>

          <div className="flex items-center gap-2 text-xs font-semibold text-[#818cf8] group-hover:text-white transition-colors">
            <span>Select File</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      ) : (
        /* Text Paste Area */
        <div className="p-6 rounded-3xl bg-[#0F172A]/85 backdrop-blur-xl border border-blue-500/20 shadow-[0_4px_25px_-5px_rgba(30,80,218,0.15)] space-y-4">
          <textarea
            value={pastedText}
            onChange={(e) => setPastedText(e.target.value)}
            placeholder="Paste raw resume plain text here (including contact, experience, skills, education, projects)..."
            rows={10}
            className="w-full p-4 rounded-2xl bg-[#08111F] border border-blue-500/25 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4D48E6]/50 leading-relaxed resize-y"
          />
          <div className="flex justify-end">
            <Button
              onClick={handlePasteSubmit}
              disabled={isLoading || !pastedText.trim()}
              className="gap-2 font-outfit text-xs bg-gradient-to-r from-[#4D48E6] via-[#2662EB] to-[#1E50DA] hover:from-[#3b37b3] hover:to-[#1e50da] text-white shadow-[0_0_15px_rgba(77,72,230,0.4)]"
            >
              <Sparkles className="w-4 h-4 text-[#818cf8]" />
              {isLoading ? 'Analyzing...' : 'Analyze Pasted Resume'}
            </Button>
          </div>
        </div>
      )}

      {/* 1-Click Sample Resumes Shelf */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold font-poppins text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#818cf8]" />
            Quick Demo: Load Curated Industry Sample Resumes
          </span>
          <span className="text-[11px] text-[#818cf8]">1-Click Immediate Scan</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_RESUMES.map((sample) => (
            <motion.div
              key={sample.id}
              whileHover={{ y: -2 }}
              onClick={() => handleSampleSelect(sample.content, sample.title)}
              className="p-3.5 rounded-2xl bg-[#0F172A]/70 hover:bg-[#131F37] border border-blue-500/20 hover:border-[#4D48E6]/60 cursor-pointer transition-all flex flex-col justify-between text-left group shadow-[0_4px_20px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_-3px_rgba(77,72,230,0.35)]"
            >
              <div>
                <h4 className="text-xs font-bold font-poppins text-white group-hover:text-[#818cf8] transition-colors">
                  {sample.title}
                </h4>
                <p className="text-[11px] text-slate-400 font-outfit mt-1 line-clamp-2">
                  {sample.description}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-blue-300 group-hover:text-[#818cf8] transition-colors">
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
