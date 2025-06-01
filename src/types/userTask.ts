import { type Database } from "@/utils/supabase/database.types";
import { type Task } from "./task";

export type UserTask = Database["public"]["Tables"]["user_tasks"]["Row"] & {
    user?: {
        id: number;
        username?: string;
        first_name?: string;
        last_name?: string;
    };
    task?: Task;
};

export type TaskCompletionStatus = Database["public"]["Enums"]["task_completion_status"];

export const TASK_COMPLETION_STATUSES = [
    { value: "in_progress", label: "В процесі" },
    { value: "completed", label: "Виконано" },
] as const satisfies readonly {
    value: TaskCompletionStatus;
    label: string;
}[]; 