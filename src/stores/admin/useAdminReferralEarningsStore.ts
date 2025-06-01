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
                const { data, error } = await supabase
                    .from("referral_earnings")
                    .select(`
                    *,
                    user:users!referral_earnings_user_id_fkey (
                        id,
                        username,
                        first_name,
                        last_name
                    ),
                    referral_user:users!referral_earnings_referral_user_id_fkey (
                        id,
                        username,
                        first_name,
                        last_name
                    )
                `)
                    .order("created_at", { ascending: false });

                if (error) throw error;

                set({ referralEarnings: data || [], isLoading: false });
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
                        table: "referral_earnings",
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
