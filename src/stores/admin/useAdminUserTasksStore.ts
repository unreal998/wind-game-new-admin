import { type UserTask } from "@/types/userTask";
import { createClient } from "@/utils/supabase/client";
import { create } from "zustand";

interface AdminUserTasksState {
    userTasks: UserTask[];
    isLoading: boolean;
    error: string | null;
    fetchUserTasks: () => Promise<void>;
    subscribeToUserTasks: () => Promise<() => void>;
}

const supabase = createClient();

export const useAdminUserTasksStore = create<AdminUserTasksState>((set) => ({
    userTasks: [],
    isLoading: true,
    error: null,

    fetchUserTasks: async () => {
        try {
            const { data, error } = await supabase
                .from("user_tasks")
                .select(`
                    *,
                    user:users!user_tasks_user_id_fkey (
                        id,
                        username,
                        first_name,
                        last_name
                    ),
                    task:tasks!user_tasks_task_id_fkey (
                        id,
                        type,
                        title,
                        url,
                        reward
                    )
                `)
                .order("created_at", { ascending: false });

            if (error) throw error;

            set({ userTasks: data || [], isLoading: false });
        } catch (error) {
            console.error("Error fetching user tasks:", error);
            set({ error: "Failed to load user tasks", isLoading: false });
        }
    },

    subscribeToUserTasks: async () => {
        const channel = supabase
            .channel("user_tasks_channel")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "user_tasks",
                },
                () => {
                    set((state) => {
                        state.fetchUserTasks();
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