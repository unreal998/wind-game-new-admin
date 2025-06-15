"use client"

import { AdminSidebar } from "@/components/ui/navigation/AdminSidebar"
import { useAdminInitialization } from "@/hooks/admin/useAdminInitialization"
import { cx } from "@/lib/utils"
import React, { useEffect, useLayoutEffect } from "react"

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  useAdminInitialization()

  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [isHydrated, setIsHydrated] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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
          isMobile
            ? isCollapsed
              ? "ml-[65px]"
              : "hidden"
            : isCollapsed
              ? "ml-[65px]"
              : "ml-64",
        )}
      >
        {children}
      </main>
    </div>
  )
}
