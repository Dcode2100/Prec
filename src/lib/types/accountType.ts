interface Contact {
  name: string
  first_name: string
  middle_name: string
  last_name: string
  email: string
  mobile: string
  city: string
  dob: string
  gender: string
  student: boolean
  designation: string
  company_name: string
  income: string
}

interface Identity {
  aadhar: string
  bo_id: string[]
}

interface Disclaimer {
  risk: boolean
  limited_transfer: boolean
  diversification: boolean
  research: boolean
  terms_and_co: boolean
  timestamp: string
}

interface UserFunds {
  total_investment: string
  pnl: string
  pnl_percentage: string
  current_value: string
  balance: string
  total_amount_invested: string
  sell_quantity: number
  sell_price: string
  sell_amount: string
}

interface ArohUserFunds {
  total_investment: string
  current_value: string
  accrued_returns: string
}

interface Nominator {
  id: string
  name: string
  logo: string
  code: string
  status: boolean
}

interface Referral {
  id: string
  code: string
  account_id: string
  referred_by: string
  referral_limit: number
}

interface BankDetails {
  account_number: string
  ifsc: string
  bank_name: string
  branch: string
  status: string
}

interface WalletDetails {
  vendor_name: string
  provider_name: string
  migrated: boolean
  acknowledged: boolean
  acknowledged_at: string
  vendor_status: string
}

interface WalletBankDetails {
  accountNumber: string
  ifsc: string
}

interface AccountResponseById {
  type: string
  account_id: string
  address: string
  gui_account_id: string
  wallet_id: string
  dob: string
  created_at: string
  updated_at: string
  contact: Contact
  status: string
  identity: Identity
  disclaimer: Disclaimer
  user_funds: UserFunds
  aroh_user_funds: ArohUserFunds
  nominator: Nominator
  referral: Referral
  bank_details: BankDetails[]
  wallet_details: WalletDetails
  orders_count: number
  whatsapp_notification: boolean
  active: boolean
  pc_active: boolean
  evaluation_expiry_date: string
  hypto_vendor_wallet_id: string
  wallet_balance: string
  wallet_bank_details: WalletBankDetails[]
  wallet_withdraw_amount: string
  name_as_per_pan: string | null
  pan: string
  portal_linked: boolean
  coins: number
  aadhaar: string | null
  pan_updated_at: string
  address_as_per_aadhaar: string | null
  upi_details: Record<string, unknown>
  decentro_wallet_id: string
  onboarding_tracker: string
}

export type { AccountResponseById }


export interface AccountWiseHoldingData {
  id: string
  token: string
  asset_id: string
  symbol: string
  company_pan: string | null
  quantity: number
  price: string
  amount: string
  buy_quantity: number
  buy_amount: string
  sell_quantity: number
  sell_price: string
  sell_amount: string
  sold: boolean
  curr_price: string
  curr_value: string
  pnl: string
  pnl_percentage: string
  buy_transaction_fees: string
  sell_transaction_fees: string
  show_on_portal: boolean
}
export interface AccountWisePcHoldingData {
  asset_id: string
  gui_id: string
  symbol: string
  logo: string
  logo_mark: string
  mobile_logo: string
  status: string
  ui_rate_of_returns: number
  rate_of_returns: number
  tenure: number
  tentative_tenure: number
  subscription_amount: string
  min_repayment_amount: string
  start_date: string
  end_date: string
  trade_start_date: string
  trade_end_date: string
  tentative_start_date: string
  tentative_end_date: string
  returns: string
  charges: string
  to: string
  from: string
  buy_transaction_fees: string
  created_at: string
  updated_at: string
}