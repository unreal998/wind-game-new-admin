export type Usage = {
  owner: string;
  status: string;
  costs: number;
  region: string;
  stability: number;
  lastEdited: string;
};

export type OverviewData = {
  date: string;
  "Rows written": number;
  "Rows read": number;
  Queries: number;
  "Payments completed": number;
  "Sign ups": number;
  Logins: number;
  "Sign outs": number;
  "Support calls": number;
};

export interface TransactionStats {
  date: string;
  deposits: number;
  withdrawals: number;
  buy_funds: number;
  release_funds: number;
  referral_earnings: number;
  personal_earnings: number;
  investment_earnings: number;
  bonus: number;
}

export interface ChartData {
  date: Date;
  value: number;
}
