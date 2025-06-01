import { createClient } from "@/utils/supabase/client";
import { startOfDay } from "date-fns";
import { useEffect, useState } from "react";

export function useTransactionStats() {
    const [stats, setStats] = useState<{
        deposits: Array<{ date: Date; value: number }>;
        withdrawals: Array<{ date: Date; value: number }>;
    }>({
        deposits: [],
        withdrawals: [],
    });

    useEffect(() => {
        const fetchStats = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("transactions")
                .select("type, amount, created_at")
                .in("type", ["deposit", "withdrawal"])
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching transaction stats:", error);
                return;
            }

            // Групуємо транзакції по днях і типах
            const dailyStats = data.reduce<
                Record<string, Record<string, number>>
            >(
                (acc, tx) => {
                    const date = startOfDay(new Date(tx.created_at));
                    const key = date.toISOString();
                    if (!acc[key]) {
                        acc[key] = { deposit: 0, withdrawal: 0 };
                    }
                    acc[key][tx.type] += Number(tx.amount);
                    return acc;
                },
                {},
            );

            // Перетворюємо в масиви об'єктів
            const deposits = Object.entries(dailyStats).map((
                [date, stats],
            ) => ({
                date: new Date(date),
                value: stats.deposit,
            }));

            const withdrawals = Object.entries(dailyStats).map((
                [date, stats],
            ) => ({
                date: new Date(date),
                value: stats.withdrawal,
            }));

            setStats({ deposits, withdrawals });
        };

        fetchStats();
    }, []);

    return stats;
}
