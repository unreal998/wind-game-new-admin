import { AdminRoles } from "./config"

export interface AdminUser {
  id: string
  email: string
  raw_user_meta_data: {
    role: AdminRoles
    first_name?: string
    last_name?: string
  }
  created_at: string
  last_sign_in_at: string | null
}