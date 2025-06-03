import { type Location } from "@/types/location";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface AdminLocationsState {
    locations: Location[];
    isLoading: boolean;
    error: string | null;
    fetchLocations: () => Promise<void>;
    subscribeToLocations: () => Promise<() => void>;
}

const supabase = createClient();

export const useAdminLocationsStore = create<AdminLocationsState>((set) => ({
    locations: [],
    isLoading: true,
    error: null,

    fetchLocations: async () => {
        try {
            const { data, error } = await supabase
                .from("countries")
                .select()
                .order("id", { ascending: true });

            if (error) throw error;

            set({ locations: data || [], isLoading: false });
        } catch (error) {
            console.error("Error fetching locations:", error);
            set({ error: "Failed to load locations", isLoading: false });
        }
    },

    subscribeToLocations: async () => {
        const channel = supabase
            .channel("locations_channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "locations",
                },
                () => {
                    set((state) => {
                        state.fetchLocations();
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
