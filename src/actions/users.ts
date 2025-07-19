"use server"

import { SignUpDto } from "@/stores/useAuthStore"
import { createClient } from "@supabase/supabase-js"

export async function createUser(userData: SignUpDto) {
  console.log("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL!)
  console.log(
    "SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true, // Automatically confirm the user's email
    user_metadata: userData.options?.data,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}
