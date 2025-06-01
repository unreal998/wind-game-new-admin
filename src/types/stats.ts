export interface LevelStats {
    referrals_count: number;

    total_deposits: number;
    total_release_funds: number;
    total_income: number;

    total_withdrawals: number;
    withdrawal_from_bonus_balance: number;
    withdrawal_from_personal_earnings_balance: number;
    withdrawal_from_referral_earnings_balance: number;
    withdrawal_from_investment_earnings_balance: number;
    withdrawal_from_main_balance: number;
    total_withdrawal_commission: number;
    total_buy_funds: number;
    total_outcome: number;

    total_earnings: number;
    total_bonus: number;
    total_referral_earnings: number;
    total_personal_earnings: number;
    total_investment_earnings: number;

    total_balance: number;
    current_revenue: number;
    total_revenue: number;
    pending_withdrawals: number;
    available_after_pending: number;
}

export type Metric = {
    key: string;
    label: string;
    format: boolean;
    icon: any;
    info: string;
    secondary?: boolean;
};

export type MetricsStats = {
    metric: string;
    total: number;
};

export type BalanceStats = {
    metric: string;
    total: number;
};
