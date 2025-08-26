import { createClient } from "@/utils/supabase/client"
import axios from "axios"

export const fetchTransactionsApi = async () => {
  const response = await axios.get(
    `https://60d211c58427.ngrok-free.app/transaction/all`,
    {
      headers: {
        "ngrok-skip-browser-warning": true,
      },
    },
  )
  return response.data.data
}

export async function getUsersByIds(user_ids: string[]) {
  const supabase = createClient()
  
  try {
    const { error, data } = await supabase
      .from('users')
      .select('*')
      .in("id", user_ids);
      
    if (error) throw error
    return data;
  } catch (error) {
    console.error('Error removing admin role:', error)
    throw error
  }
}
