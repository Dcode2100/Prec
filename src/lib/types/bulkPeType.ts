export interface BulkPeTransactionsResponse {
  statusCode: number;
  message: string;
  data: BulkPeTransactionsData;
}

export interface BulkPeTransactionsData {
  transactions: BulkPeTransaction[];
  total: number;
  page: number;
  limit: number;
}

export interface BulkPeTransaction {
  id: string;
  transaction_id: string;
  reference_id: string;
  mode: string;
  vpa_reference_id: string;
  vpa_id: string;
  order_id: string;
  account_number: string;
  ifsc: string;
  upi: string;
  amount: number;
  payment_mode: string;
  payment_remark: string;
  status_description: string;
  status: string;
  utr: string;
  holder_name: string;
  type: string;
  charge: number;
  gst: number;
  transaction_created_at: string;
  transaction_updated_at: string;
  created_at: string;
  updated_at: string;
}

export interface BulkPeTransactionParams {
  limit: number
  page: number
  search?: string
  dateFilterBy?: string
  createdAfter?: string
  createdBefore?: string
  updatedAfter?: string
  updatedBefore?: string
  status?: string
  payment_mode?: string
  type?: string
}

export interface BulkPeTransactionResponse {
  transactions: BulkPeTransaction[]
  total: number
}