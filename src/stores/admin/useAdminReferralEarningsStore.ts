import { type ReferralEarning } from "@/types/referralEarning";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface AdminReferralEarningsState {
    referralEarnings: ReferralEarning[];
    isLoading: boolean;
    error: string | null;
    fetchReferralEarnings: () => Promise<void>;
    subscribeToReferralEarnings: () => Promise<() => void>;
}

const supabase = createClient();

export const useAdminReferralEarningsStore = create<AdminReferralEarningsState>(
    (set) => ({
        referralEarnings: [],
        isLoading: true,
        error: null,

        fetchReferralEarnings: async () => {
            try {
                const { data: users, error } = await supabase
                    .from("users")
                    .select("*")
                    .filter("referals", "neq", "[]");

                if (error) throw error;

                const allReferalIds = Array.from(
                    new Set(users.flatMap((u) => u.referals))
                );
                const { data: referalUsers, error: refError } = await supabase
                    .from("users")
                    .select("telegramID, userName, created_at, WindBalance")
                    .in("telegramID", allReferalIds);

                
                if (refError) throw refError;
                const result: ReferralEarning[] = [];
                allReferalIds.forEach((id) => {
                    const user = users.find((u) => u.referals.includes(id));
                    if (user) {
                        result.push({
                            created_at: referalUsers.find(ru => ru.telegramID === id)?.created_at || new Date().toISOString(),
                            amount: referalUsers.find(ru => ru.telegramID === id)?.WindBalance / 10 || 0,
                            user: {
                                id: user.id,
                                username: user.userName || user.telegramID,
                            },
                            referral_user: {
                                id: id,
                                username: referalUsers.find(ru => ru.telegramID === id)?.userName || id,
                                first_name: "",
                                last_name: "",
                            },
                        });
                    }
                })
                set({ referralEarnings: result || [], isLoading: false });
            } catch (error) {
                console.error("Error fetching referral earnings:", error);
                set({
                    error: "Failed to load referral earnings",
                    isLoading: false,
                });
            }
        },

        subscribeToReferralEarnings: async () => {
            const channel = supabase
                .channel("referral_earnings_channel")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "users",
                    },
                    () => {
                        set((state) => {
                            state.fetchReferralEarnings();
                            return state;
                        });
                    },
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        },
    })
);
