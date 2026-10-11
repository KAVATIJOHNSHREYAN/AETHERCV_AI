import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-[14px] border border-blue-500/20 bg-[#111D34] px-3.5 py-2 text-sm text-white font-outfit shadow-inner placeholder:text-[#64748B] focus:border-[#3B82F6] focus:shadow-[0_0_15px_rgba(59,130,246,0.25)] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
