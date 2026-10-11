'use client'

import * as React from "react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="fixed inset-0 -z-[50] bg-[#07101F] pointer-events-none" />
  }

  return (
    <div className="fixed inset-0 -z-[50] overflow-hidden bg-[#07101F] pointer-events-none">
      {/* Unified Enterprise Blue Blobs */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full filter blur-[120px] animate-blob bg-[#2563EB]/15 pointer-events-none" 
      />
      <div 
        className="absolute top-[15%] -right-[10%] w-[60vw] h-[60vw] max-w-[650px] max-h-[650px] rounded-full filter blur-[120px] animate-blob animation-delay-2000 bg-[#4F7DFF]/12 pointer-events-none" 
      />
      <div 
        className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full filter blur-[120px] animate-blob animation-delay-4000 bg-[#162440]/40 pointer-events-none" 
      />
    </div>
  )
}
