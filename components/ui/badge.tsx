"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        secondary: "bg-secondary text-secondary-foreground border-secondary",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive",
        outline: "border border-input bg-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)} {...props} />
  )
}

export { Badge, badgeVariants }
