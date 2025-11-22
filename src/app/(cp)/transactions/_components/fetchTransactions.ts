import { createClient } from "@/utils/supabase/client"
import { endOfDay, startOfDay } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import { DateRange } from "react-day-picker"

export const fetchTransactionsApi = async (selectedDateRange: DateRange) => {
  const supabase = createClient()
  const fromDate = formatInTimeZone(startOfDay(selectedDateRange?.from || new Date()), 'Europe/Kiev', "yyyy-MM-dd HH:mm:ss")
  const toDate = formatInTimeZone(endOfDay(selectedDateRange?.to || new Date()), 'Europe/Kiev', "yyyy-MM-dd HH:mm:ss")
  let allData: any[] = [];
  let fromIndex = 0;
  let toIndex = 999;
  while (true) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', fromDate)
      .lte('created_at', toDate)
      .order('created_at', { ascending: false })
      .range(fromIndex, toIndex)
    if (error) throw error
    allData = allData.concat(data)
    if (data.length < 1000) break
    fromIndex += 1000
    toIndex += 1000
  }
  return allData
}

export const fetchTransactionsAllApi = async () => {
  const supabase = createClient()
  let allData: any[] = [];
  let fromIndex = 0;
  let toIndex = 999;
  while (true) {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .range(fromIndex, toIndex)
    if (error) throw error
    allData = allData.concat(data)
    if (data.length < 1000) break
    fromIndex += 1000
    toIndex += 1000
  }
  return allData
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
