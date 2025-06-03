import type { SiteConfig } from "@/types/config";

export const siteConfig: SiteConfig = {
  name: "WIND",
  url: "https://app.wind.com",
  description:
    "Join the community that's bringing money earning opportunities like never before",
  adminLinks: {
    overview: "/overview",
    total: "/total-admin",
    users: "/users",
    deposits: "/deposits",
    withdrawals: "/withdrawals",
    wallets: "/wallets",
    locations: "/locations",
    userLocations: "/user-locations",
    windMods: "/wind-mods",
    userMods: "/user-mods",
    // pushes: "/pushes",
    tasks: "/tasks",
    userTasks: "/user-tasks",
    referralEarnings: "/referral-earnings",
  },
  adminAccess: {
    admin: [
      "overview",
      "total",
      "users",
      "deposits",
      "withdrawals",
      "wallets",
      "locations",
      "userLocations",
      "windMods",
      "userMods",
      // "pushes",
      "tasks",
      "userTasks",
      "referralEarnings",
    ],
    manager: [],
    withdrawal: [],
    support: [],
    viewer: [],
  },
} as const satisfies SiteConfig;

export type {
  AdminAccessSections,
  AdminLinkKeys,
  AdminLinks,
  AdminRoles,
} from "@/types/config";
