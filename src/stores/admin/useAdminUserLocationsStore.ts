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
        const PAGE_SIZE = 1000
        let allData: any[] = []
        let hasMore = true
        try {
            while (hasMore) {
                const { data, error } = await supabase
                    .from("users")
                    .select(`*`)
                    .order("created_at", { ascending: false })
                    .range(from, from + PAGE_SIZE - 1);
        
                if (error) throw error;
                allData = allData.concat(data)
                hasMore = data?.length === PAGE_SIZE
                from += PAGE_SIZE
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
