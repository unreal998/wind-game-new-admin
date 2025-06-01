"use server"

import { createClient } from "@/utils/supabase/server"
import { Database } from "@/utils/supabase/database.types"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"]

export async function getTransaction(transactionId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error fetching transaction:", error)
    throw error
  }
}

export async function updateTransaction(
  transactionId: string,
  updates: Partial<Transaction>
) {
  const supabase = createClient()

  try {
    const { error } = await supabase
      .from("transactions")
      .update(updates)
      .eq("id", transactionId)

    if (error) throw error
  } catch (error) {
    console.error("Error updating transaction:", error)
    throw error
  }
} 