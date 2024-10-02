export interface GetHoldingsByAccIdResponse {
  message: string;
  data: GetHoldingsByAccIdData;
}

export interface GetHoldingsByAccIdData {
  holdings: PCHoldingById[];
  total: number;
  current_invested: string;
  current_returns: string;
  overall_invested: string;
  overall_returns: string;
}

export interface PCHoldingById {
  id?: string;
  gui_id?: string;
  symbol?: string;
  logo?: string;
  logo_mark?: string;
  mobile_logo?: string;
  status?: string;
  rate_of_returns?: number;
  tenure?: number;
  tentative_tenure?: number;
  subscription_amount?: string;
  min_repayment_amount?: string;
  tentative_end_date?: string;
  pol?: string;
  pod?: string;
  created_at?: string;
  updated_at?: string;
}
