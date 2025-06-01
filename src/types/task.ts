import { type Database } from "@/utils/supabase/database.types";

export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type TaskType = Database["public"]["Enums"]["task_type"];

export const TASK_TYPES = [
    { value: "default", label: "Звичайне" },
    { value: "telegram", label: "Telegram" },
    { value: "youtube", label: "YouTube" },
] as const satisfies readonly {
    value: TaskType;
    label: string;
}[];
