'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Image as ImageIcon, X, Check, ShieldCheck, GraduationCap, Sparkles } from "lucide-react"
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'

export interface SummaryReportItem {
  label: string
  attended: number
  conducted: number
  weightage?: string
  percentage: number
}

export interface ExportSummaryModalProps {
  isOpen: boolean
  onClose: () => void
  reportTitle: string
  reportSubtitle?: string
  studentName?: string
  courseCode?: string
  overallPercentage: number
  statusLabel: string
  items?: SummaryReportItem[]
  bunkAnalysis?: string
  attendAnalysis?: string
}

export function ExportSummaryModal({
  isOpen,
  onClose,
  reportTitle,
  reportSubtitle = 'Official Attendance Health & Eligibility Report',
  studentName,
  courseCode,
  overallPercentage,
  statusLabel,
  items = [],
  bunkAnalysis,
  attendAnalysis
}: ExportSummaryModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)

  if (!isOpen) return null

  const getStatusBadge = () => {
    if (overallPercentage >= 85) {
      return {
        text: 'ELIGIBLE (>=85%)',
        bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        badgeBg: '#10b981',
        textColor: '#059669'
      }
    }
    if (overallPercentage >= 75) {
      return {
        text: 'CONDITIONAL (75%-85%)',
        bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
        badgeBg: '#f59e0b',
        textColor: '#d97706'
      }
    }
    return {
      text: 'NOT ELIGIBLE / DETAINED (<75%)',
      bg: 'bg-[#4D48E6]/15 text-[#818CF8] border-[#4D48E6]/30',
      badgeBg: '#4D48E6',
      textColor: '#818CF8'
    }
  }

  const status = getStatusBadge()
  const generatedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  const generateDataUrl = async () => {
    if (!cardRef.current) throw new Error('Card element not found')
    // Render at 2x scale for high crispness
    return await toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left'
      }
    })
  }

  const handleDownloadPng = async () => {
    try {
      setIsExporting(true)
      const dataUrl = await generateDataUrl()
      const link = document.createElement('a')
      const sanitizedTitle = reportTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')
      link.download = `klu_attendance_${sanitizedTitle}_${Date.now()}.png`
      link.href = dataUrl
      link.click()
      setExportSuccess('PNG')
      setTimeout(() => setExportSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to export PNG', err)
    } finally {
      setIsExporting(false)
    }
  }

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true)
      const dataUrl = await generateDataUrl()
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const imgProps = pdf.getImageProperties(dataUrl)
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20 // 10mm margins
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

      pdf.addImage(dataUrl, 'PNG', 10, 10, pdfWidth, pdfHeight)
      const sanitizedTitle = reportTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')
      pdf.save(`klu_attendance_${sanitizedTitle}_${Date.now()}.pdf`)
      setExportSuccess('PDF')
      setTimeout(() => setExportSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to export PDF', err)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-background border border-border/60 rounded-3xl shadow-2xl overflow-hidden my-8"
        >
          {/* Top Bar Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-muted/30">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              <h2 className="font-poppins font-bold text-lg text-foreground">Export Summary Card</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Export Preview Area */}
          <div className="p-6 bg-slate-900/5 dark:bg-slate-950/40 overflow-x-auto flex justify-center">
            {/* The printable Card ref */}
            <div
              ref={cardRef}
              className="w-full max-w-xl p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white shadow-2xl border border-blue-500/30 relative overflow-hidden font-outfit"
              style={{ minWidth: '480px' }}
            >
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[60px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full filter blur-[60px] pointer-events-none" />

              {/* Header Branding */}
              <div className="flex justify-between items-start border-b border-white/10 pb-5 mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <GraduationCap className="h-6 w-6 text-blue-400" />
                    <span className="font-poppins font-bold text-xl tracking-tight text-white">KL UNIVERSITY</span>
                  </div>
                  <h3 className="font-semibold text-lg text-blue-300">{reportTitle}</h3>
                  {courseCode && <p className="text-xs text-slate-400 font-mono mt-0.5">Course: {courseCode}</p>}
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-white/10 bg-white/5 text-slate-300">
                    {generatedDate}
                  </span>
                  {studentName && <p className="text-xs text-slate-300 mt-1 font-medium">{studentName}</p>}
                </div>
              </div>

              {/* Big Score Hero Box */}
              <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-6 relative z-10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">Overall Attendance</p>
                  <div className="text-5xl font-extrabold font-poppins tracking-tight" style={{ color: status.badgeBg }}>
                    {overallPercentage.toFixed(2)}%
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${status.bg}`}>
                    <ShieldCheck className="h-4 w-4" />
                    {status.text}
                  </span>
                  <p className="text-xs text-slate-400 mt-2 font-light">Threshold: 85% Exam / 75% Condonation</p>
                </div>
              </div>

              {/* Component breakdown table if items provided */}
              {items.length > 0 && (
                <div className="mb-6 relative z-10">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Attendance Breakdown</h4>
                  <div className="space-y-2.5">
                    {items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 text-sm">
                        <div>
                          <span className="font-semibold text-white">{item.label}</span>
                          {item.weightage && <span className="text-xs text-slate-400 ml-2">({item.weightage})</span>}
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-300 font-mono">{item.attended}/{item.conducted} hrs</span>
                          <span className="font-bold text-blue-300 min-w-[50px] text-right">{item.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Analysis Highlights */}
              {(bunkAnalysis || attendAnalysis) && (
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 mb-6 text-xs text-slate-300 relative z-10">
                  {bunkAnalysis && (
                    <div className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{bunkAnalysis}</span>
                    </div>
                  )}
                  {attendAnalysis && (
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{attendAnalysis}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer Verification Watermark */}
              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-[10px] text-slate-400 relative z-10">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
                  <span>Verified via KL Attendance Calculator</span>
                </div>
                <div className="italic text-slate-400">
                  Developed & modified by Kavati John Shreyan
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-border/40 bg-background flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground font-outfit">
              {exportSuccess ? (
                <span className="text-emerald-500 font-semibold flex items-center gap-1">
                  <Check className="h-4 w-4" /> Successfully saved as {exportSuccess}!
                </span>
              ) : (
                'Choose format to download your summary card:'
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={handleDownloadPng}
                disabled={isExporting}
                className="flex-1 sm:flex-initial"
              >
                <ImageIcon className="h-4 w-4 mr-2 text-blue-500" />
                Download PNG
              </Button>
              
              <Button
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="flex-1 sm:flex-initial"
              >
                <FileText className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
