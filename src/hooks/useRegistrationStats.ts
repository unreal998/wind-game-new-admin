import { createClient } from "@/utils/supabase/client";
import { startOfDay } from "date-fns";
import { useEffect, useState } from "react";

export function useRegistrationStats() {
    const [stats, setStats] = useState<{
        registrations: Array<{ date: Date; value: number }>;
    }>({
        registrations: [],
    });

    useEffect(() => {
        const fetchStats = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("users")
                .select("created_at")
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching registration stats:", error);
                return;
            }

            // Групуємо реєстрації по днях
            const dailyStats = data.reduce<Record<string, number>>(
                (acc, user) => {
                    const date = startOfDay(new Date(user.created_at));
                    const key = date.toISOString();
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                },
                {},
            );

            // Перетворюємо в масив об'єктів
            const registrations = Object.entries(dailyStats).map((
                [date, count],
            ) => ({
                date: new Date(date),
                value: count,
            }));

            setStats({ registrations });
        };

        fetchStats();
    }, []);

    return stats;
}
