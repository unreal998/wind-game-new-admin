import { type WindMod } from "@/types/windMod";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface AdminWindModsState {
    windMods: WindMod[];
    isLoading: boolean;
    error: string | null;
    fetchWindMods: () => Promise<void>;
    subscribeToWindMods: () => Promise<() => void>;
}

const supabase = createClient();

export const useAdminWindModsStore = create<AdminWindModsState>((set) => ({
    windMods: [],
    isLoading: true,
    error: null,

    fetchWindMods: async () => {
        try {
            const { data, error } = await supabase
                .from("modifiers")
                .select()
                .order("area", { ascending: true });

            if (error) throw error;

            set({ windMods: data || [], isLoading: false });
        } catch (error) {
            console.error("Error fetching wind mods:", error);
            set({ error: "Failed to load wind mods", isLoading: false });
        }
    },

    subscribeToWindMods: async () => {
        const channel = supabase
            .channel("mdifiers")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "mdifiers",
                },
                () => {
                    set((state) => {
                        state.fetchWindMods();
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
