import { type Database } from "@/utils/supabase/database.types";

export type ReferralEarning =
    & Database["public"]["Tables"]["referral_earnings"]["Row"]
    & {
        user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
        };
        referral_user?: {
            id: number;
            username?: string;
            first_name?: string;
            last_name?: string;
        };
    };
