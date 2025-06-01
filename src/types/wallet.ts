import { type Database } from "@/utils/supabase/database.types"
import { type TransactionProfile } from "./profile"

export type Wallet =
  & Database["public"]["Tables"]["wallets"]["Row"]
  & {
    user?: TransactionProfile
  } 