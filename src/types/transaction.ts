import { type Database } from "@/utils/supabase/database.types";
import { type TransactionProfile } from "./profile";

export type Transaction =
  & Database["public"]["Tables"]["transactions"]["Row"]
  & {
    user?: TransactionProfile;
  };

export type TransactionType = Database["public"]["Enums"]["transaction_type"];

export type TransactionStatus =
  Database["public"]["Enums"]["transaction_status"];

export const TRANSACTION_STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

export const transactionStatusColors = {
  [TRANSACTION_STATUS.PENDING]: "bg-gray-500 text-white",
  [TRANSACTION_STATUS.COMPLETED]: "bg-green-500 text-white",
  [TRANSACTION_STATUS.FAILED]: "bg-yellow-500 text-white",
  [TRANSACTION_STATUS.CANCELLED]: "bg-red-500 text-white",
} as const;
