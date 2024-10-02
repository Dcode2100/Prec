/* eslint-disable */
export interface WalletTransactionsResponse {
  message: string;
  data: Data;
}

export interface Data {
  PE: Pe[];
  credit_amount: string;
  debit_amount: string;
  order_amount: string;
  withdraw_amount: string;
  wallet_balance: string;
  total: number;
}

export interface Pe {
  wallet_transaction_id: string;
  vendor_wallet_transaction_id: string;
  vendor_wallet_id: number;
  vendor_transaction_id?: string;
  account_id: string;
  wallet_id: string;
  gui_wallet_transaction_id: string;
  order_id: string;
  amount?: string;
  charges_gst: any;
  settled_amount: any;
  account_balance: string;
  transaction_amount: string;
  transaction_type: string;
  status: string;
  payment_type: string;
  reference_number?: string;
  reference_id: any;
  credit_debit: string;
  bene_account_number?: string;
  bene_account_ifsc?: string;
  va_settler_id: any;
  upi_id: any;
  upi_transaction_id: any;
  vendor_order_id: any;
  upi_payer_name: any;
  upi_payer_mobile: any;
  sender_account_number?: string;
  sender_account_ifsc?: string;
  rmtr_full_name: any;
  rmtr_account_no: any;
  rmtr_account_ifsc: any;
  reason?: string;
  withdraw_amount: number;
  created_at: string;
  updated_at: string;
  transaction_time?: string;
  user_transaction_type: string;
  provider_code: any;
  portal: string;
  note?: string;
  credited_at: any;
  wallet: Wallet;
}

export interface Wallet {
  user: User;
}

export interface User {
  gui_account_id: string;
  email: string;
  mobile: string;
}


export interface CreateVirtualAccountResponse {
  statusCode: number
  message: string
  data: CreateVirtualAccountData
}

export interface CreateVirtualAccountData {
  wallet_id: string
  gui_wallet_id: string
  account_id: string
}
