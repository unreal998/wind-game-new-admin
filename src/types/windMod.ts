import { type Database } from "@/utils/supabase/database.types";

export type WindMod = Database["public"]["Tables"]["wind_mods"]["Row"];
