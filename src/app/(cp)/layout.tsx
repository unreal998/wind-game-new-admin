"use client"

import { AdminSidebar } from "@/components/ui/navigation/AdminSidebar"
import { useAdminInitialization } from "@/hooks/admin/useAdminInitialization"
import { cx } from "@/lib/utils"
import React, { useLayoutEffect } from "react"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useAdminInitialization()

  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isHydrated, setIsHydrated] = React.useState(false)

  useLayoutEffect(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed")
    if (saved) {
      setIsCollapsed(saved === "true")
    }
    setIsHydrated(true)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  if (!isHydrated) {
    return null
  }

  return (
    <div className="relative mx-auto max-w-screen-2xl">
      <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />

      <main
        className={cx(
          "ease flex flex-col p-5 transition-all duration-100",
          isCollapsed ? "ml-[65px]" : "ml-64",
        )}
      >
        {children}
      </main>
    </div>
  )
}
