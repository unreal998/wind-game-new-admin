"use client"

import { Button } from "@/components/Button"
import { cx, focusRing } from "@/lib/utils"
import { useUserStore } from "@/stores/useUserStore"
import { Icon } from "@iconify/react"

import { DropdownAdminProfile } from "./DropdownAdminProfile"

interface AdminProfileDesktopProps {
  isCollapsed?: boolean
}

export const AdminProfileDesktop = ({
  isCollapsed,
}: AdminProfileDesktopProps) => {
  const { email } = useUserStore()

  return (
    <DropdownAdminProfile>
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          isCollapsed ? "justify-center py-0" : "justify-between py-2",
          focusRing,
          "group flex w-full items-center rounded-md px-1 text-sm font-medium text-gray-900 hover:bg-gray-200/50 data-[state=open]:bg-gray-200/50 hover:dark:bg-gray-800/50 data-[state=open]:dark:bg-gray-900",
        )}
      >
        {isCollapsed ? (
          <div className="flex h-8 items-center">
            <Icon
              icon="solar:settings-bold"
              aria-hidden="true"
              className="size-5 shrink-0 text-gray-500 group-hover:text-gray-700 dark:text-gray-500 group-hover:dark:text-gray-300"
            />
          </div>
        ) : (
          <span className="flex items-center truncate px-2">
            <span className={cx(isCollapsed ? "hidden" : "block")}>
              {email}
            </span>
          </span>
        )}
      </Button>
    </DropdownAdminProfile>
  )
}

export const AdminProfileMobile = () => {
  const { email } = useUserStore()

  return (
    <DropdownAdminProfile align="end">
      <Button
        aria-label="User profile"
        variant="ghost"
        className={cx(
          "group flex items-center rounded-md p-0.5 text-sm font-medium text-gray-900 hover:bg-gray-200/50 data-[state=open]:bg-gray-200/50 sm:p-1 hover:dark:bg-gray-800/50 data-[state=open]:dark:bg-gray-800/50",
        )}
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 sm:size-7 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
          aria-hidden="true"
        >
          {email}
        </span>
      </Button>
    </DropdownAdminProfile>
  )
}
