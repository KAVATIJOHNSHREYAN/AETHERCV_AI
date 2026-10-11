import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[14px] text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#4F7DFF] to-[#2563EB] hover:from-[#5D8CFF] hover:to-[#3B82F6] text-white shadow-[0_0_20px_rgba(59,130,246,0.35)] border border-white/10",
        destructive:
          "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:shadow-lg hover:shadow-red-500/30 border border-white/10",
        outline:
          "border border-blue-500/25 bg-[#111D34]/80 backdrop-blur-md text-[#9CAEC9] hover:text-white hover:bg-[#162440] hover:border-[#3B82F6] hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]",
        secondary:
          "bg-[#162440] text-slate-200 hover:text-white hover:bg-[#1c2e52] border border-blue-500/15 shadow-sm",
        ghost:
          "shadow-none text-[#9CAEC9] hover:bg-blue-600/15 hover:text-white",
        link:
          "shadow-none text-[#4F7DFF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-3.5 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
