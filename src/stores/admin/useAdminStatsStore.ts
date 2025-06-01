import { type MetricsStats } from "@/types/stats";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface AdminStatsState {
    stats: MetricsStats[];
    isLoading: boolean;
    error: string | null;
    fetchStats: () => Promise<void>;
    subscribeToStats: () => Promise<() => void>;
}

const supabase = createClient();

export const useAdminStatsStore = create<AdminStatsState>((set) => ({
    stats: [],
    isLoading: true,
    error: null,

    fetchStats: async () => {
        try {
            set({ isLoading: true, error: null });

            // Виконуємо запити паралельно
            const [{ count: usersCount }, { data: transactions }] =
                await Promise.all([
                    supabase.from("users").select("*", {
                        count: "exact",
                        head: true,
                    }),
                    supabase.from("transactions").select("type, amount"),
                ]);

            if (!transactions) {
                throw new Error("Failed to fetch transactions");
            }

            // Обчислюємо суми транзакцій за один прохід
            const { deposits, withdrawals } = transactions.reduce(
                (acc, tx) => {
                    if (tx.type === "deposit") {
                        acc.deposits += Number(tx.amount);
                    } else if (tx.type === "withdrawal") {
                        acc.withdrawals += Number(tx.amount);
                    }
                    return acc;
                },
                { deposits: 0, withdrawals: 0 },
            );

            const stats = [
                {
                    metric: "referrals_count",
                    total: usersCount || 0,
                },
                {
                    metric: "total_deposits",
                    total: deposits,
                },
                {
                    metric: "total_withdrawals",
                    total: withdrawals,
                },
                {
                    metric: "current_revenue",
                    total: deposits - withdrawals,
                },
            ];

            set({ stats, isLoading: false });
        } catch (error) {
            console.error("Error fetching stats:", error);
            set({ error: "Failed to load stats", isLoading: false });
        }
    },

    subscribeToStats: async () => {
        const channels = [
            supabase
                .channel("users_changes")
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "users" },
                    () => {
                        set((state) => {
                            state.fetchStats();
                            return state;
                        });
                    },
                )
                .subscribe(),

            supabase
                .channel("transactions_changes")
                .on(
                    "postgres_changes",
                    { event: "*", schema: "public", table: "transactions" },
                    () => {
                        set((state) => {
                            state.fetchStats();
                            return state;
                        });
                    },
                )
                .subscribe(),
        ];

        return () => {
            channels.forEach((channel) => {
                supabase.removeChannel(channel);
            });
        };
    },
}));
