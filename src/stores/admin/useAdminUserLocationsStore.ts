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
                .from("users")
                .select(`
                    *
                `)

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
