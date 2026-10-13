'use client'

import React, { useState } from 'react'
import { SkillGapHistoryItem, SkillGapAnalysisResult } from '@/types/skill-gap'
import {
  History,
  X,
  Trash2,
  Edit2,
  Check,
  FolderOpen,
  ArrowRight,
  Target,
  GitCompare,
  Calendar
} from 'lucide-react'

interface HistoryDrawerProps {
  isOpen: boolean
  onClose: () => void
  historyItems: SkillGapHistoryItem[]
  onSelect: (item: SkillGapAnalysisResult) => void
  onDelete: (id: string) => void
  onRename: (id: string, newTitle: string) => void
  onCompare: (itemA: SkillGapHistoryItem, itemB: SkillGapHistoryItem) => void
}

export function HistoryDrawer({
  isOpen,
  onClose,
  historyItems,
  onSelect,
  onDelete,
  onRename,
  onCompare
}: HistoryDrawerProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [compareSelectedIds, setCompareSelectedIds] = useState<string[]>([])

  if (!isOpen) return null

  const handleStartRename = (item: SkillGapHistoryItem) => {
    setEditingId(item.id)
    setEditTitle(item.title)
  }

  const handleSaveRename = (id: string) => {
    if (editTitle.trim()) {
      onRename(id, editTitle.trim())
    }
    setEditingId(null)
  }

  const toggleCompareSelect = (id: string) => {
    if (compareSelectedIds.includes(id)) {
      setCompareSelectedIds(prev => prev.filter(i => i !== id))
    } else {
      if (compareSelectedIds.length >= 2) {
        setCompareSelectedIds([compareSelectedIds[1], id])
      } else {
        setCompareSelectedIds(prev => [...prev, id])
      }
    }
  }

  const handleRunCompare = () => {
    if (compareSelectedIds.length === 2) {
      const itemA = historyItems.find(h => h.id === compareSelectedIds[0])
      const itemB = historyItems.find(h => h.id === compareSelectedIds[1])
      if (itemA && itemB) {
        onCompare(itemA, itemB)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0A1426] border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Analysis History</h3>
              <p className="text-[11px] text-slate-400">
                {historyItems.length} saved skill gap {historyItems.length === 1 ? 'record' : 'records'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compare Action Bar */}
        {compareSelectedIds.length > 0 && (
          <div className="bg-indigo-950/40 border-b border-indigo-500/30 p-3 flex items-center justify-between text-xs">
            <span className="text-indigo-300 font-semibold">
              {compareSelectedIds.length}/2 selected to compare
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCompareSelectedIds([])}
                className="text-slate-400 hover:text-white text-[11px]"
              >
                Clear
              </button>
              <button
                type="button"
                disabled={compareSelectedIds.length !== 2}
                onClick={handleRunCompare}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1"
              >
                <GitCompare className="w-3.5 h-3.5" />
                <span>Compare</span>
              </button>
            </div>
          </div>
        )}

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {historyItems.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs flex flex-col items-center">
              <History className="w-8 h-8 text-slate-600 mb-2" />
              <span>No previous analyses saved yet.</span>
              <span className="text-[11px] text-slate-500 mt-1">
                Completed skill gap checks will appear here automatically.
              </span>
            </div>
          ) : (
            historyItems.map(item => {
              const isCompareActive = compareSelectedIds.includes(item.id)

              return (
                <div
                  key={item.id}
                  className={`bg-slate-950/80 border rounded-xl p-3.5 transition-all ${
                    isCompareActive
                      ? 'border-indigo-500 shadow-lg shadow-indigo-500/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Title & Actions */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {editingId === item.id ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleSaveRename(item.id)
                          }}
                          className="flex-1 bg-slate-900 border border-blue-500 rounded px-2 py-1 text-xs text-white"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(item.id)}
                          className="p-1 text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <h4 className="text-xs font-bold text-white truncate flex-1">
                        {item.title}
                      </h4>
                    )}

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleStartRename(item)}
                        className="p-1 text-slate-400 hover:text-blue-400 transition"
                        title="Rename analysis"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-400 transition"
                        title="Delete analysis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-slate-400">
                      Role: <strong className="text-slate-200">{item.targetRole}</strong>
                    </span>
                    <span className="font-mono font-bold text-blue-400">
                      {item.overallScore}% ({item.matchLevel})
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-900 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleCompareSelect(item.id)}
                        className={`px-2 py-0.5 rounded text-[10.5px] font-semibold border transition ${
                          isCompareActive
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Select
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onSelect(item.data)
                          onClose()
                        }}
                        className="px-2.5 py-0.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[10.5px] flex items-center gap-1 transition"
                      >
                        <span>Reopen</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
