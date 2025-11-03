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
        let from = 0
        let to = 999
        let allData: any[] = []
        try {

            while (true) {
            const { data, error } = await supabase
                .from("users")
                .select(`
                    *
                `)
                .range(from, to)
            allData = allData.concat(data)
            from += 1000
            to += 1000
            if (error) throw error;
            if (data.length < 1000) break

            from += 1000
            to += 1000
        }

        set({ userLocations: allData || [], isLoading: false });
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
