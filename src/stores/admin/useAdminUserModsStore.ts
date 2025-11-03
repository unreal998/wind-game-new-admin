import { type UserMod } from "@/types/userMod";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface AdminUserModsState {
    userMods: UserMod[];
    isLoading: boolean;
    error: string | null;
    fetchUserMods: () => Promise<void>;
    subscribeToUserMods: () => Promise<() => void>;
}

const supabase = createClient();

export const useAdminUserModsStore = create<AdminUserModsState>((set) => ({
    userMods: [],
    isLoading: true,
    error: null,

    fetchUserMods: async () => {
        try {
            const { data } = await supabase.rpc('get_users_with_mods');

            set({ userMods: data || [], isLoading: false });
        } catch (error) {
            console.error("Error fetching user mods:", error);
            set({ error: "Failed to load user mods", isLoading: false });
        }
    },

    subscribeToUserMods: async () => {
        const channel = supabase
            .channel("user_mods_channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "user_mods",
                },
                () => {
                    set((state) => {
                        state.fetchUserMods();
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
