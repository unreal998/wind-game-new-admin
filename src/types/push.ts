import { type Database } from "@/utils/supabase/database.types";
import { type LocationType } from "./location";

export type Push =
    & Database["public"]["Tables"]["pushes"]["Row"]
    & {
        user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
        };
        location?: {
            id: LocationType;
            base_wind_speed: number;
            base_energy_per_hour: number;
            profit_multiplier: number;
        };
    };
