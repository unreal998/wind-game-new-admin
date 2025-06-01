import { type UserLocation } from "@/types/userLocation";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface AdminUserLocationsState {
    userLocations: UserLocation[];
    isLoading: boolean;
    error: string | null;
    fetchUserLocations: () => Promise<void>;
    subscribeToUserLocations: () => Promise<() => void>;
}

const supabase = createClient();

export const useAdminUserLocationsStore = create<AdminUserLocationsState>((
    set,
) => ({
    userLocations: [],
    isLoading: true,
    error: null,

    fetchUserLocations: async () => {
        try {
            const { data, error } = await supabase
                .from("user_locations")
                .select(`
                    *,
                    user:users!user_locations_user_id_fkey (
                        id,
                        username,
                        first_name,
                        last_name
                    ),
                    location:locations!user_locations_location_id_fkey (
                        id,
                        base_wind_speed,
                        base_energy_per_hour,
                        profit_multiplier
                    )
                `)
                .order("unlocked_at", { ascending: false });

            if (error) throw error;

            set({ userLocations: data || [], isLoading: false });
        } catch (error) {
            console.error("Error fetching user locations:", error);
            set({ error: "Failed to load user locations", isLoading: false });
        }
    },

    subscribeToUserLocations: async () => {
        const channel = supabase
            .channel("user_locations_channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "user_locations",
                },
                () => {
                    set((state) => {
                        state.fetchUserLocations();
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
