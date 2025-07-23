import type { SiteConfig } from "@/types/config"

export const siteConfig: SiteConfig = {
  name: "WIND",
  url: "https://app.wind.com",
  description:
    "Join the community that's bringing money earning opportunities like never before",
  adminLinks: {
    users: "/users",
    transactions: "/transactions",
    missions: "/missions",
    roadmap: "/roadmap",
    overview: "/overview",
    // total: "/total-admin",
    // deposits: "/deposits",
    withdrawals: "/withdrawals",
    // wallets: "/wallets",
    locations: "/locations",
    userLocations: "/user-locations",
    windMods: "/wind-mods",
    userMods: "/user-mods",
    // pushes: "/pushes",
    referralEarnings: "/referral-earnings",
    permissions: "/permissions",
  },
  adminAccess: {
    admin: [
      "users",
      "transactions",
      "roadmap",
      "missions",
      "overview",
      "withdrawals",
      "locations",
      "userLocations",
      "windMods",
      "userMods",
      "referralEarnings",
      "permissions",
    ],
    teamlead: [
      "users",
      "transactions",
      "roadmap",
      "missions",
      "overview",
      "withdrawals",
      "locations",
      // "userLocations",
      "windMods",
      // "userMods",
      "referralEarnings",
      //"permissions",
    ],
    guest: ["users", "transactions", "overview", "withdrawals"],
  },
} as const satisfies SiteConfig

export type {
  AdminAccessSections,
  AdminLinkKeys,
  AdminLinks,
  AdminRoles,
} from "@/types/config"
