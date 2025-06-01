import { ReactNode } from "react"

import { ThemeProvider } from "next-themes"

import { Toaster } from "@/components/Toaster"

import { Toaster as SonnerToaster } from 'sonner'

type Props = {
  children: ReactNode
}

export default async function Providers({ children }: Props) {
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
          {children}
          <Toaster />
          <SonnerToaster richColors />
      </ThemeProvider>
    </>
  )
}
