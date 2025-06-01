"use client"

import { cx } from "@/lib/utils"
import { type VariantProps, cva } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      variant: {
        default: [
          "bg-blue-50 text-blue-900 ring-blue-500/30",
          "dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30",
        ],
        neutral: [
          "bg-gray-50 text-gray-900 ring-gray-500/30",
          "dark:bg-gray-400/10 dark:text-gray-400 dark:ring-gray-400/20",
        ],
        success: [
          "bg-emerald-50 text-emerald-900 ring-emerald-600/30",
          "dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
        ],
        error: [
          "bg-red-50 text-red-900 ring-red-600/20",
          "dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20",
        ],
        warning: [
          "bg-yellow-50 text-yellow-900 ring-yellow-600/30",
          "dark:bg-yellow-400/10 dark:text-yellow-500 dark:ring-yellow-400/20",
        ],
        indigo: [
          "bg-indigo-50 text-indigo-900 ring-indigo-600/30",
          "dark:bg-indigo-400/10 dark:text-indigo-400 dark:ring-indigo-400/30",
        ],
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cx(badgeVariants({ variant }), className)} {...props} />
  )
}
