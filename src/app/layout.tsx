import { ReactNode } from "react"

import { customMetaDataGenerator } from "@/lib/customMetaDataGenerator"
import type { Metadata } from "next"

import type { Viewport } from "next"

import "@/app/globals.css"
import Providers from "@/providers"
import { GeistSans } from "geist/font/sans"
import { siteConfig } from "./siteConfig"

export const metadata: Metadata = customMetaDataGenerator({
  canonicalUrl: siteConfig.url,
  title: `Welcome to ${siteConfig.name}`,
  description: siteConfig.description,
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
}

type Props = {
  children: ReactNode
  params: { locale: string }
}

export default async function LocaleLayout({
  children
}: Props) {

  return (
    <html lang="uk" suppressHydrationWarning>
      <body
        className={`${GeistSans.className} overflow-x-hidden overflow-y-scroll scroll-auto bg-gray-50 antialiased selection:bg-indigo-100 selection:text-indigo-700 dark:bg-gray-950`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
