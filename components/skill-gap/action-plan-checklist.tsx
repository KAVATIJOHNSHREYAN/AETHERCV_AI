'use client'

import React, { useState } from 'react'
import { ActionPlanItem } from '@/types/skill-gap'
import { CheckSquare, Square, ListTodo, Flame, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react'

interface ActionPlanChecklistProps {
  initialItems: ActionPlanItem[]
}

export function ActionPlanChecklist({ initialItems }: ActionPlanChecklistProps) {
  const [items, setItems] = useState<ActionPlanItem[]>(initialItems)

  const toggleItem = (id: string) => {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  }

  const completedCount = items.filter(i => i.completed).length
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0

  return (
    <div className="bg-[#0C162B]/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 mb-5 gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-emerald-400" />
            Prioritized Employability Action Plan
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Step-by-step checklist to systematically close skill gaps and maximize interview callbacks.
          </p>
        </div>

        {/* Progress Bar Badge */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-xl">
          <div className="text-xs font-bold text-emerald-400">
            {completedCount}/{items.length} Completed ({progressPercent}%)
          </div>
          <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {items.map(item => {
          const isHigh = item.priority === 'High'
          const isMed = item.priority === 'Medium'

          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`cursor-pointer rounded-xl p-3.5 border transition-all flex items-start gap-3 select-none ${
                item.completed
                  ? 'bg-emerald-950/15 border-emerald-500/30 opacity-75'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <button
                type="button"
                className="mt-0.5 text-slate-400 hover:text-emerald-400 transition"
              >
                {item.completed ? (
                  <CheckSquare className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                ) : (
                  <Square className="w-5 h-5 text-slate-500 hover:text-slate-300" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-bold ${
                      item.completed ? 'line-through text-slate-400' : 'text-white'
                    }`}
                  >
                    {item.task}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {item.category}
                    </span>

                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                        isHigh
                          ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                          : isMed
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          : 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 mt-1">
                  <strong>Impact:</strong> {item.impact}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
