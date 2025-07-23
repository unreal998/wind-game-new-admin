"use server"

import { SignUpDto } from "@/stores/useAuthStore"
import { createAdminClient } from "@/utils/supabase/admin"
import { UserAttributes } from "@supabase/supabase-js"

const supabaseAdmin = createAdminClient()

export async function createUser(userData: SignUpDto) {
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
    user_metadata: userData.options?.data,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function updateUserByEmail(
  userEmail: string,
  updateAttributes: UserAttributes,
) {
  let updatePayload: UserAttributes = {
    email: updateAttributes.email,
    phone: updateAttributes.phone,
    password: updateAttributes.password,
    data: updateAttributes.data,
    nonce: updateAttributes.nonce,
  }

  // delete null fields
  updatePayload = Object.fromEntries(
    Object.entries(updatePayload).filter((arr) => !!arr[1]),
  )

  const { data: usersData, error: listUsersErr } =
    await supabaseAdmin.auth.admin.listUsers()
  if (listUsersErr) return { data: null, error: listUsersErr.message }

  const userToUpdate = usersData.users.find((u) => u.email === userEmail)
  if (!userToUpdate)
    return {
      data: null,
      error: `User with Email:${userEmail} does not exist`,
    }

  const { data, error: updateUserErr } =
    await supabaseAdmin.auth.admin.updateUserById(
      userToUpdate.id,
      updatePayload,
    )
  if (updateUserErr) return { data: null, error: updateUserErr.message }

  return { data, error: null }
}
