"use server"

import { createClient } from "@/utils/supabase/server"
import { AdminRoles } from "@/types/config"
import { AdminUser } from "@/types/admin"
import { revalidatePath } from "next/cache"

export async function getAdminUsers(): Promise<AdminUser[]> {
  const supabase = createClient()
  
  try {
    const { data, error } = await supabase
      .rpc('get_admin_users')
    
    if (error) throw error

    return data
  } catch (error) {
    console.error('Error fetching admin users:', error)
    throw error
  }
}

export async function updateAdminRole(user_id: string, role: AdminRoles) {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .rpc('update_user_role', {
        user_id,
        new_role: role
      })
    
    if (error) throw error
    
    revalidatePath('/settings-admin/users')
  } catch (error) {
    console.error('Error updating admin role:', error)
    throw error
  }
}

export async function removeAdminRole(user_id: string) {
  const supabase = createClient()
  
  try {
    const { error } = await supabase
      .rpc('remove_user_role', {
        user_id
      })
    
    if (error) throw error
    
    revalidatePath('/settings-admin/users')
  } catch (error) {
    console.error('Error removing admin role:', error)
    throw error
  }
} 