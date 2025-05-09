"use client"

import * as React from "react"
import { Toaster as Sonner } from "sonner"
import { cn } from "@/lib/utils"

const Toaster = ({ className, options, ...props }: React.ComponentPropsWithoutRef<typeof Sonner> & { options?: any }) => (
  <Sonner
    className={cn("toaster", className)}
    position="top-right"
    toastOptions={options}
    {...props}
  />
)

export { Toaster }
