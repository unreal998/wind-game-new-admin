"use client"

import { AdminLinkKeys, siteConfig } from "@/app/siteConfig"
import { Badge } from "@/components/Badge"
import { Tooltip } from "@/components/Tooltip"
import { cx, focusRing } from "@/lib/utils"
import { useAdminTransactionsStore } from "@/stores/admin/useAdminTransactionsStore"
import { TransactionType } from "@/types/transaction"
import { Icon } from "@iconify/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AdminProfileDesktop } from "./AdminProfile"
import { useAdminWithdrawalsStore } from "@/stores/admin/useAdminWithdrawalsStore"
import { useUserStore } from "@/stores/useUserStore"
interface AdminSidebarProps {
  isCollapsed: boolean
  toggleSidebar: () => void
}

interface SectionConfig {
  title: string
  icon: string
  href: string
  badge?: {
    type: "transactions" | "funds"
    transactionTypes?: TransactionType[]
  }
}

const sectionConfigs: Record<AdminLinkKeys, SectionConfig> = {
  tonChanges: {
    title: "TON нарахування",
    icon: "solar:chat-round-dots-bold",
    href: siteConfig.adminLinks.tonChanges,
  },
  tgMsg: {
    title: "Tg повідомлення",
    icon: "solar:chat-round-dots-bold",
    href: siteConfig.adminLinks.tgMsg,
  },
  users: {
    title: "Користувачі",
    icon: "solar:expressionless-square-bold",
    href: siteConfig.adminLinks.users,
  },
  transactions: {
    title: "Поповнення",
    icon: "solar:card-transfer-bold",
    href: siteConfig.adminLinks.transactions,
  },
  missions: {
    title: "Місії",
    icon: "solar:checklist-minimalistic-bold",
    href: siteConfig.adminLinks.missions,
  },
  roadmap: {
    title: "Дорожня карта",
    icon: "solar:document-text-outline",
    href: siteConfig.adminLinks.roadmap,
  },
  overview: {
    title: "Динаміка",
    icon: "solar:chat-square-2-bold",
    href: siteConfig.adminLinks.overview,
  },
  withdrawals: {
    title: "Вивід",
    icon: "solar:minus-square-bold",
    href: siteConfig.adminLinks.withdrawals,
    badge: {
      type: "transactions",
      transactionTypes: ["withdrawal"],
    },
  },
  locations: {
    title: "Локації",
    icon: "solar:map-point-bold",
    href: siteConfig.adminLinks.locations,
  },
  userLocations: {
    title: "Локації користувачів",
    icon: "solar:map-arrow-square-bold",
    href: siteConfig.adminLinks.userLocations,
  },
  windMods: {
    title: "Моди",
    icon: "solar:wind-bold",
    href: siteConfig.adminLinks.windMods,
  },
  userMods: {
    title: "Моди придбані",
    icon: "solar:inbox-out-bold",
    href: siteConfig.adminLinks.userMods,
  },
  referralEarnings: {
    title: "Реферальні",
    icon: "solar:users-group-rounded-bold",
    href: siteConfig.adminLinks.referralEarnings,
  },
  permissions: {
    title: "Дозволи",
    icon: "solar:crown-minimalistic-bold",
    href: siteConfig.adminLinks.permissions,
  },
} as const

export function AdminSidebar({
  isCollapsed,
  toggleSidebar,
}: AdminSidebarProps) {
  const pathname = usePathname()
  const { getUserPermissions, role } = useUserStore()
  const { getPendingTransactions } = useAdminTransactionsStore()
  const { newWithdrawalsCount, fetchNewWithdrawalsCount } = useAdminWithdrawalsStore()
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setInterval(() => {
      fetchNewWithdrawalsCount()
    }, 10000)
  }, [fetchNewWithdrawalsCount])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getBadgeForSection = (config: SectionConfig) => {
    if (!config.badge) return null

    let stats = { pendingCount: 0 }

    if (config.badge.type === "transactions") {
      stats = getPendingTransactions(config.badge.transactionTypes || [])
    }

    if (stats.pendingCount > 0) {
      return (
        <Badge
          className={cx(
            "flex min-w-5 cursor-pointer items-center justify-center px-1.5 py-0.5 text-xs transition-colors",
            "hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500",
            isCollapsed ? "absolute -mt-6 ml-3" : "ml-auto",
          )}
          variant="indigo"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            router.push(config.href + `?filters={"status":"pending"}`)
          }}
        >
          {stats.pendingCount}
        </Badge>
      )
    }

    return null
  }

  useEffect(() => {
    getUserPermissions()
  }, [])

  const availableSections = siteConfig.adminAccess[role ?? "marketing"].map(
    (section) => {
      const link = siteConfig.adminLinks[section]
      return link
    },
  )

  const isActive = (itemHref: string) => {
    if (!pathname) return false
    return pathname === itemHref || pathname.startsWith(itemHref)
  }

  return (
    <div
      className={cx(
        isCollapsed ? "w-[65px]" : "w-64",
        "fixed inset-y-0 z-50 flex flex-col overflow-x-hidden",
        "ease transform-gpu transition-all duration-100 will-change-transform",
      )}
    >
      <aside className="flex grow flex-col gap-y-4 overflow-y-auto whitespace-nowrap border-r border-gray-200 px-3 py-4 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-x-3">
            <button
              className="group inline-flex rounded-md p-2 text-gray-400 dark:text-gray-700"
              onClick={toggleSidebar}
            >
              {isCollapsed ? (
                <Icon
                  icon="solar:square-alt-arrow-right-linear"
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              ) : (
                <Icon
                  icon="solar:square-alt-arrow-left-linear"
                  className="h-6 w-6"
                  aria-hidden="true"
                />
              )}
              <span
                className={cx(
                  "px-4 py-0.5 text-sm transition-opacity",
                  isCollapsed ? "opacity-0" : "opacity-0 hover:opacity-100",
                )}
              >
                згорнути
              </span>
            </button>
          </div>
        </div>

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="space-y-1">
            {availableSections.map((section) => {
              const sectionKey = Object.entries(siteConfig.adminLinks).find(
                ([_, path]) => path === section,
              )?.[0] as AdminLinkKeys | undefined

              if (!sectionKey) return null

              const config = sectionConfigs[sectionKey]
              if (!config) return null

              const badge = getBadgeForSection(config)

              return (
                <li key={sectionKey}>
                  {isCollapsed ? (
                    <Tooltip
                      side="right"
                      content={config.title}
                      sideOffset={6}
                      showArrow={false}
                      className="z-[999]"
                    >
                      <Link
                        href={config.href}
                        onClick={() => {
                          if (isMobile) toggleSidebar()
                        }}
                        className={cx(
                          isActive(siteConfig.adminLinks[sectionKey])
                            ? "bg-gray-100 text-indigo-600 dark:bg-gray-800 dark:text-indigo-500"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
                          "group flex items-center justify-center rounded-md p-2 text-base font-semibold",
                          focusRing,
                        )}
                      >
                        <Icon
                          icon={config.icon}
                          className={cx(
                            "h-6 w-6",
                            isActive(siteConfig.adminLinks[sectionKey])
                              ? "text-indigo-600 dark:text-indigo-500"
                              : "text-gray-400 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300",
                          )}
                          aria-hidden="true"
                        />
                        {badge}
                      </Link>
                    </Tooltip>
                  ) : (
                    <Link
                      href={config.href}
                      onClick={() => {
                        if (isMobile) toggleSidebar()
                      }}
                      className={cx(
                        isActive(siteConfig.adminLinks[sectionKey])
                          ? "bg-gray-100 text-indigo-600 dark:bg-gray-800 dark:text-indigo-500"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
                        "group flex items-center gap-x-3 rounded-md p-2 text-base font-semibold",
                        focusRing,
                      )}
                    >
                      <Icon
                        icon={config.icon}
                        className={cx(
                          "h-6 w-6",
                          isActive(siteConfig.adminLinks[sectionKey])
                            ? "text-indigo-600 dark:text-indigo-500"
                            : "text-gray-400 group-hover:text-gray-600 dark:text-gray-400 dark:group-hover:text-gray-300",
                        )}
                        aria-hidden="true"
                      />
                      {config.title}
                      {badge}
                      {config.title === "Вивід" && (
                        <div>{newWithdrawalsCount ?? ""}</div>
                      )}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-auto overflow-hidden">
          <AdminProfileDesktop isCollapsed={isCollapsed} />
        </div>
      </aside>
    </div>
  )
}
