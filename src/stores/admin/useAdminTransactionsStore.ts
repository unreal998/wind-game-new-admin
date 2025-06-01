import { type Transaction, type TransactionType } from "@/types/transaction";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface AdminTransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  updateTransactionStatus: (
    id: string,
    status: "completed" | "cancelled",
  ) => Promise<void>;
  getTransactionsStats: () => {
    totalTransactions: number;
    totalAmount: number;
    pendingTransactions: number;
    pendingAmount: number;
    completedTransactions: number;
    completedAmount: number;
    failedTransactions: number;
    failedAmount: number;
  };
  getFilteredTransactions: (types: TransactionType[]) => Transaction[];
  getPendingTransactions: (types: TransactionType[]) => {
    pendingCount: number;
  };
  subscribeToTransactions: () => Promise<() => void>;
}

const supabase = createClient();

export const useAdminTransactionsStore = create<AdminTransactionsState>((
  set,
  get,
) => ({
  transactions: [],
  isLoading: true,
  error: null,

  fetchTransactions: async () => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(`
          *,
          user:users!transactions_user_id_fkey (
            id,
            first_name,
            last_name,
            username,
            status,
            wallet,
            wallet_ton
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ transactions: data || [], isLoading: false });
      console.log("Transactions fetched:", data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      set({ error: "Failed to load transactions", isLoading: false });
    }
  },

  updateTransactionStatus: async (id, status) => {
    try {
      const { error } = await supabase
        .from("transactions")
        .update({ status })
        .eq("id", id);

      if (error) throw error;

      set((state) => ({
        transactions: state.transactions.map((transaction) =>
          transaction.id === id ? { ...transaction, status } : transaction
        ),
      }));
    } catch (error) {
      console.error("Error updating transaction status:", error);
      throw error;
    }
  },

  getTransactionsStats: () => {
    const { transactions } = get();

    return transactions.reduce(
      (acc, transaction) => {
        const amount = transaction.amount || 0;

        switch (transaction.status) {
          case "pending":
            acc.pendingTransactions++;
            acc.pendingAmount += amount;
            break;
          case "completed":
            acc.completedTransactions++;
            acc.completedAmount += amount;
            break;
          case "failed":
            acc.failedTransactions++;
            acc.failedAmount += amount;
            break;
        }

        acc.totalTransactions++;
        acc.totalAmount += amount;

        return acc;
      },
      {
        totalTransactions: 0,
        totalAmount: 0,
        pendingTransactions: 0,
        pendingAmount: 0,
        completedTransactions: 0,
        completedAmount: 0,
        failedTransactions: 0,
        failedAmount: 0,
      },
    );
  },

  getFilteredTransactions: (types) => {
    const { transactions } = get();
    return transactions.filter((transaction) =>
      types.includes(transaction.type)
    );
  },

  getPendingTransactions: (types: TransactionType[]) => {
    const { transactions } = get();

    return transactions
      .filter((transaction) => types.includes(transaction.type))
      .reduce(
        (acc, transaction) => {
          if (transaction.status === "pending") {
            acc.pendingCount++;
          }
          return acc;
        },
        { pendingCount: 0 },
      );
  },

  subscribeToTransactions: async () => {
    const channel = supabase
      .channel("transactions_channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        (payload) => {
          console.log("Received change event:", payload);
          set((state) => {
            console.log("Fetching updated transactions...");
            state.fetchTransactions();
            return state;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
