import { type Database } from "@/utils/supabase/database.types";
import { type LocationType } from "./location";
import { type WindMod } from "./windMod";

export type UserMod =
    & Database["public"]["Tables"]["user_mods"]["Row"]
    & {
        user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
        };
        mod?: WindMod;
        location?: {
            id: LocationType;
            base_wind_speed: number;
            base_energy_per_hour: number;
            profit_multiplier: number;
        };
    };
