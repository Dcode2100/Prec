/* eslint-disable */
import { BankDetail } from "./types";

export interface GetAllPCEnquiriesResponse {
  message: string;
  data: GetAllPCEnquiriesResponseData;
}

export interface GetAllPCEnquiriesResponseData {
  enquiries: Enquiry[];
  total: number;
  page: number;
  limit: number;
}

export interface Enquiry {
  user_id: string;
  gui_account_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  email: string;
  mobile: string;
  wallet_balance: string;
  no_of_paid_orders: number;
  total_paid_order_amount: number;
  no_of_holdings: number;
  total_holdings_amount: number;
  holdings: Holding[];
  button: string;
  created_at: string;
  pc_active: boolean;
  updated_at: string;
}

export interface Holding {
  holding_id: string;
  token: string;
  symbol: string;
  quantity: number;
  price: string;
  amount: string;
}

export interface PCOrderResponse {
  statusCode: number;
  message: string;
  data: PCOrderResponseData;
}

export interface PCOrderResponseData {
  orders: PCOrders[];
  total: number;
  page: number;
  limit: number;
}

export interface PCOrders {
  id: string;
  gui_id: string;
  user_id: string;
  gui_account_id: string;
  asset_id: string;
  symbol: string;
  side: string;
  quantity: number;
  lots: number;
  price_per_lot: string;
  price: string;
  transaction_fees: string;
  gst: string;
  subscription_amount: string;
  amount: string;
  returns: string;
  coins: number;
  status: string;
  reason: string;
  payment_id: any;
  payment_date?: string;
  subscription_confirmed_date?: string;
  subscription_processed_date?: string;
  payment_ip_address?: string;
  pan: string;
  ses_details: any;
  note: any;
  investment_slip: any;
  invoice: any;
  start_date: string;
  end_date: string;
  rate_of_returns: number;
  tds_charges: string;
  tenure: number;
  created_at: string;
  updated_at: string;
  bank_details: BankDetail[];
}

export interface PCOrdersDetailResponse {
  id: string;
  gui_id: string;
  user_id: string;
  gui_account_id: string;
  asset_id: string;
  symbol: string;
  side: string;
  quantity: number;
  lots: number;
  price_per_lot: string;
  price: string;
  transaction_fees: string;
  gst: string;
  subscription_amount: string;
  amount: string;
  returns: string;
  coins: number;
  status: string;
  reason: string;
  payment_id: any;
  payment_date: string;
  subscription_confirmed_date: string;
  subscription_processed_date: string;
  payment_ip_address: string;
  pan: string;
  ses_details: any;
  note: any;
  investment_slip: any;
  invoice: any;
  created_at: string;
  updated_at: string;
}
