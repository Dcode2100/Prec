export interface CoinTransactionParams {
  limit: number
  page: number
  createdAfter?: string
  createdBefore?: string
  search?: string
  direction?: string
  status?: string[]
  amountAbove?: number
  amountBelow?: number
}

export interface CoinTransactionResponse {
    transaction_id: string;
    gui_transaction_id: string;
    account_id: string;
    gui_account_id: string;
    referee_account_id: string;
    referrer_account_id: string;
    referee_order_id: string;
    order_id: string;
    coins: number;
    direction: string;
    status: string;
    reward_type: string;
    description: string;
    note: string | null;
    created_at: string;
    updated_at: string;
    mobile: string;
    first_name: string;
    last_name: string;
    email: string;
  }

  export enum WalletTransactionDirection {
    CREDIT = "CREDIT",
    WITHDRAW = "WITHDRAW",
    ORDER = "ORDER",
    DEBIT = "DEBIT",
    ALL = "ALL",
  }
export enum TransactionStatus {
  COMPLETED = "completed",
  PENDING = "pending",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
  FAILED = "FAILED",
  REFUND_PENDING = "refund_pending",
  REFUND_FAILED = "refund_failed",
  REFUND_COMPLETED = "refund_completed",
}

export enum TransactionDirectionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
}


export interface PennyDropTransactionResponse {
    transaction_id: string;
    vendor_transaction_id: string;
    account_id: string;
    account_number: string | null;
    beneficiary_name: string | null;
    payment_type: string;
    transaction_type: string;
    status: string;
    payee_account_number: string;
    payee_account_ifsc: string;
    decentro_transaction_id: string | null;
    reason: string;
    reference_id: string;
    bank_reference_number: string | null;
    timestamp: string | null;
    created_at: string;
    updated_at: string;
    email: string;
    mobile: string;
    gui_account_id: string;
  }

  export interface TransactionsResponseInterface {
    transactions: TransactionListObj[]
    total: number
  }
  export interface TransactionListObj {
    amount: string
    direction: string
    status: string
    transaction_id: string
    user_id: string
    account_id: string
    type: string
    vendor_transaction_id: string
    created_at: string
    updated_at: string
    gui_transaction_id: string
    gui_account_id: string
    data: Record<string, unknown>
    // mocking-------------
  }