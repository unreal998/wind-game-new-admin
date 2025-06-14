// Визначаємо базові типи
export type AdminLinksConfig = {
  users: string
  transactions: string
}

export type AdminAccessConfig = {
  admin: ReadonlyArray<keyof AdminLinksConfig>
  manager: ReadonlyArray<keyof AdminLinksConfig>
  withdrawal: ReadonlyArray<keyof AdminLinksConfig>
  support: ReadonlyArray<keyof AdminLinksConfig>
  viewer: ReadonlyArray<keyof AdminLinksConfig>
}

export type SiteConfig = {
  name: string
  url: string
  description: string
  adminLinks: AdminLinksConfig
  adminAccess: AdminAccessConfig
}

// Експортуємо типи для використання
export type AdminLinks = AdminLinksConfig
export type AdminLinkKeys = keyof AdminLinks
export type AdminRoles = keyof AdminAccessConfig
export type AdminAccessSections<R extends AdminRoles> =
  AdminAccessConfig[R][number]
