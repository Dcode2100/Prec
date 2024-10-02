export interface GetAllPCHoldingsResponse {
  message: string
  data: GetAllPCHoldingsData
}

export interface GetAllPCHoldingsData {
  holdings: PcHolding[]
  total: number
}

export interface PcHolding {
  id?: string
  gui_id?: string
  asset_id?: string
  symbol?: string
  status?: string
  quantity?: number
  price?: string
  amount?: string
  min_repayment_amount?: string
  subscription_amount?: string
  returns?: string
  charges?: string
  created_at?: string
  updated_at?: string
  account_id?: string
  gui_account_id?: string
  email?: string
  mobile?: string
  first_name?: string
  last_name?: string
  middle_name?: string
}
