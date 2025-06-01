import { type Push } from "@/types/push";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface AdminPushesState {
    pushes: Push[];
    isLoading: boolean;
    error: string | null;
    fetchPushes: () => Promise<void>;
    subscribeToPushes: () => Promise<() => void>;
}

const supabase = createClient();

export const useAdminPushesStore = create<AdminPushesState>((set) => ({
    pushes: [],
    isLoading: true,
    error: null,

    fetchPushes: async () => {
        try {
            const { data, error } = await supabase
                .from("pushes")
                .select(`
                    *,
                    user:users!pushes_user_id_fkey (
                        id,
                        username,
                        first_name,
                        last_name
                    ),
                    location:locations!pushes_location_id_fkey (
                        id,
                        base_wind_speed,
                        base_energy_per_hour,
                        profit_multiplier
                    )
                `)
                .order("started_at", { ascending: false });

            if (error) throw error;

            set({ pushes: data || [], isLoading: false });
        } catch (error) {
            console.error("Error fetching pushes:", error);
            set({ error: "Failed to load pushes", isLoading: false });
        }
    },

    subscribeToPushes: async () => {
        const channel = supabase
            .channel("pushes_channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "pushes",
                },
                () => {
                    set((state) => {
                        state.fetchPushes();
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
