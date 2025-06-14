import type { SiteConfig } from "@/types/config"

export const siteConfig: SiteConfig = {
  name: "WIND",
  url: "https://app.wind.com",
  description:
    "Join the community that's bringing money earning opportunities like never before",
  adminLinks: {
    users: "/users",
    transactions: "/transactions",
  },
  adminAccess: {
    admin: ["users", "transactions"],
    manager: [],
    withdrawal: [],
    support: [],
    viewer: [],
  },
} as const satisfies SiteConfig

export type {
  AdminAccessSections,
  AdminLinkKeys,
  AdminLinks,
  AdminRoles,
} from "@/types/config"
