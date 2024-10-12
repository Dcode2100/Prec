export interface GetPCDeliveryAnalyticsResponse {
  statusCode: number
  message: string
  data: GetPCDeliveryAnalyticsData
}

export interface GetPCDeliveryAnalyticsData {
  subscription_processing_count: number
  subscription_processed_count: number
  holdings_yet_to_start_count: number
  holdings_started_count: number
  holdings_ended_count: number
  holdings_repaid_count: number
  recent_subscription_processing_orders: RecentSubscriptionProcessingOrders
  recent_subscription_processed_orders: RecentSubscriptionProcessedOrders
  recent_holdings_yet_to_start: RecentHoldingsYetToStart
  recent_holdings_started: RecentHoldingsStarted
  recent_holdings_ended: RecentHoldingsEnded
  recent_holdings_repaid: RecentHoldingsRepaid
}

export interface RecentSubscriptionProcessingOrders {
  orders: RecentSubscriptionProcessingOrder[]
}

export interface RecentSubscriptionProcessingOrder {
  id: string
  gui_id: string
  user_id: string
  gui_account_id: string
  first_name: string
  middle_name: string | null
  last_name: string
  email: string
  mobile: string
  asset_id: string
  symbol: string
  side: 'buy' | 'sell'
  quantity: number
  lots: number
  price_per_lot: string
  price: string
  transaction_fees: string
  gst: string
  subscription_amount: string
  amount: string
  returns: string
  coins: number
  status: string
  reason: string | null
  payment_id: string | null
  payment_date: string
  subscription_confirmed_date: string
  subscription_processed_date: string | null
  payment_ip_address: string
  pan: string
  ses_details: SEDetails | null
  note: string | null
  investment_slip: string | null
  invoice: string | null
  start_date: string
  end_date: string
  rate_of_returns: number
  tds_charges: string
  tenure: number
  created_at: string
  updated_at: string
}

export interface RecentSubscriptionProcessedOrders {
  orders: RecentSubscriptionProcessedOrder[]
}

export interface RecentSubscriptionProcessedOrder {
  id?: string
  gui_id?: string
  user_id?: string
  gui_account_id?: string
  first_name?: string
  middle_name?: string
  last_name?: string
  email?: string
  mobile?: string
  asset_id?: string
  symbol?: string
  side?: string
  quantity?: number
  lots?: number
  price_per_lot?: string
  price?: string
  transaction_fees?: string
  gst?: string
  subscription_amount?: string
  amount?: string
  returns?: string
  coins?: number
  status?: string
  reason?: string
  payment_id?: string | null
  payment_date?: string
  subscription_confirmed_date?: string
  subscription_processed_date?: string
  payment_ip_address?: string
  pan?: string
  ses_details?: SEDetails
  note?: string | null
  investment_slip?: string | null
  invoice?: string | null
  created_at?: string
  updated_at?: string
}

export interface RecentHoldingsYetToStart {
  holdings?: RecentHoldings[]
  total?: number
}

export interface RecentHoldings {
  id: string
  gui_id: string
  asset_id: string
  symbol: string
  status: string
  quantity: number
  price: string
  amount: string
  min_repayment_amount: string
  subscription_amount: string
  repaid_date: string | null
  returns: string
  charges: string
  created_at: string
  updated_at: string
  account_id: string
  gui_account_id: string
  email: string
  mobile: string
  first_name: string
  last_name: string
  middle_name: string | null
}

export interface RecentHoldingsStarted {
  holdings?: RecentHoldings[]
  total?: number
}

export interface RecentHoldingsEnded {
  holdings?: RecentHoldings[]
  total?: number
}

export interface RecentHoldingsRepaid {
  holdings?: RecentHoldings[]
  total?: number
}

interface SEDetails {
  id?: string
  name?: string
}
