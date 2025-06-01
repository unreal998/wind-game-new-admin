import { type Database } from "@/utils/supabase/database.types";

export type Location = Database["public"]["Tables"]["locations"]["Row"];
export type LocationType = Database["public"]["Enums"]["location_type"];

export const LOCATION_TYPES = [
    { value: "denmark", label: "Данія" },
    { value: "netherlands", label: "Нідерланди" },
    { value: "germany", label: "Німеччина" },
    { value: "usa", label: "США" },
] as const satisfies readonly {
    value: LocationType;
    label: string;
}[];
