'use client'

import React, { useState } from 'react'
import { SavedCoverLetterRecord } from '@/types/cover-letter'
import { Button } from '@/components/ui/button'
import {
  History, Trash2, Copy, Eye, Edit3, Download,
  Building2, Briefcase, Calendar, Sparkles, X
} from 'lucide-react'
import { exportCoverLetterToPdf } from '@/services/cover-letter/exporter'

interface CoverLetterHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  records: SavedCoverLetterRecord[]
  onSelectRecord: (record: SavedCoverLetterRecord) => void
  onDeleteRecord: (id: string) => void
  onDuplicateRecord: (id: string) => void
  onRenameRecord: (id: string, newTitle: string) => void
}

export function CoverLetterHistoryModal({
  isOpen,
  onClose,
  records,
  onSelectRecord,
  onDeleteRecord,
  onDuplicateRecord,
  onRenameRecord
}: CoverLetterHistoryModalProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  if (!isOpen) return null

  const handleStartRename = (record: SavedCoverLetterRecord) => {
    setEditingId(record.id)
    setEditingTitle(record.title)
  }

  const handleSaveRename = (id: string) => {
    if (editingTitle.trim()) {
      onRenameRecord(id, editingTitle.trim())
    }
    setEditingId(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#08111F]/80 backdrop-blur-md"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#0F172A] border border-blue-500/25 shadow-[0_0_50px_rgba(77,72,230,0.25)] rounded-3xl p-6 sm:p-7 z-10 space-y-6 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-blue-500/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#4D48E6]/15 border border-[#4D48E6]/30 text-[#818cf8]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-poppins text-white">Cover Letter History</h3>
              <p className="text-xs text-slate-400 font-outfit">
                {records.length} saved letter{records.length === 1 ? '' : 's'} stored locally in your browser
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-blue-600/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="overflow-y-auto space-y-3 pr-1 grow">
          {records.length > 0 ? (
            records.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-[#08111F]/90 border border-blue-500/20 hover:border-blue-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 grow">
                  {editingId === rec.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="bg-[#0F172A] border border-[#4D48E6] rounded-lg px-2.5 py-1 text-xs text-white"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleSaveRename(rec.id)}
                        className="h-7 text-xs bg-[#4D48E6] text-white"
                      >
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold font-poppins text-white">{rec.title}</h4>
                      <button
                        type="button"
                        onClick={() => handleStartRename(rec)}
                        className="text-slate-400 hover:text-white text-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-xs text-slate-400 font-outfit">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      {rec.companyName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="capitalize text-[#818cf8] font-medium">{rec.tone} Tone</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onSelectRecord(rec)
                      onClose()
                    }}
                    className="h-8 text-xs border-blue-500/30 text-sky-200 hover:bg-blue-600/20"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Load
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDuplicateRecord(rec.id)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-blue-600/20"
                    title="Duplicate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => exportCoverLetterToPdf(rec.letter)}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-blue-600/20"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteRecord(rec.id)}
                    className="h-8 w-8 p-0 text-slate-400 hover:bg-[#4D48E6]/20 hover:text-white"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-blue-500/20 rounded-2xl">
              No saved cover letters found. Once generated, your letters are automatically saved here for quick reference and re-downloading.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
