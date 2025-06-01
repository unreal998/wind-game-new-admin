"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu"
import { useToast } from "@/lib/useToast"
import { useAuthStore } from "@/stores/useAuthStore"
import { useUserStore } from "@/stores/useUserStore"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import * as React from "react"

export type DropdownAdminProfileProps = {
  children: React.ReactNode
  align?: "center" | "start" | "end"
}

export function DropdownAdminProfile({
  children,
  align = "start",
}: DropdownAdminProfileProps) {
  const { theme, setTheme } = useTheme()
  const { email } = useUserStore()
  const { signOutAsync } = useAuthStore()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    const result = await signOutAsync()
    if (result && result.error) {
      toast({
        variant: "error",
        title: "Помилка",
        description: result.error,
      })
    } else {
      router.push('/login')
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          align={align}
          className="!min-w-[calc(var(--radix-dropdown-menu-trigger-width))]"
        >
          <DropdownMenuLabel>
            {email && (
              <span className="block text-xs text-gray-500">{email}</span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSubMenu>
              <DropdownMenuSubMenuTrigger>
                Тема оформлення
              </DropdownMenuSubMenuTrigger>
              <DropdownMenuSubMenuContent>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(value) => {
                    setTheme(value)
                  }}
                >
                  <DropdownMenuRadioItem
                    aria-label="Світла"
                    value="light"
                  >
                    <Sun className="size-4 shrink-0" aria-hidden="true" />
                    Світла
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="Темна"
                    value="dark"
                  >
                    <Moon className="size-4 shrink-0" aria-hidden="true" />
                    Темна
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="Системна"
                    value="system"
                  >
                    <Monitor className="size-4 shrink-0" aria-hidden="true" />
                    Системна
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubMenuContent>
            </DropdownMenuSubMenu>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={handleSignOut}>
              Вийти
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
