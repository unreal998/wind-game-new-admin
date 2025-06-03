import { type Task } from "@/types/task";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface AdminTasksState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
    fetchTasks: () => Promise<void>;
    subscribeToTasks: () => Promise<() => void>;
}

const supabase = createClient();

export const useAdminTasksStore = create<AdminTasksState>((set) => ({
    tasks: [],
    isLoading: true,
    error: null,

    fetchTasks: async () => {
        try {
            const { data, error } = await supabase
                .from("missions")
                .select()
                .order("created_at", { ascending: false });

            if (error) throw error;

            set({ tasks: data || [], isLoading: false });
        } catch (error) {
            console.error("Error fetching tasks:", error);
            set({ error: "Failed to load tasks", isLoading: false });
        }
    },

    subscribeToTasks: async () => {
        const channel = supabase
            .channel("tasks_channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "tasks",
                },
                () => {
                    set((state) => {
                        state.fetchTasks();
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