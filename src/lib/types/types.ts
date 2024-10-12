import moment from 'moment'

type EnumDictionary<T extends string | number, U> = {
  [K in T]: U
}

// Used to map 'arbitrary' responses
// eslint-disable-next-line
export interface Generic {
  [key: string]: string | number | boolean | null | undefined
}

/*
 * TYPES
 */

export enum Role {
  Superuser = 'superuser',
  Developer = 'developer',
  Operations = 'operations',
}

export const RoleNames: EnumDictionary<string, string> = {
  [Role.Superuser]: 'Super User',
  [Role.Developer]: 'Developer (Admin)',
  [Role.Operations]: 'Operations',
}

export type MFAStatus = 'ENABLED' | 'VERIFY_PHONE' | 'PHONE_REQUIRED'

/*
 * REQUEST RESPONSES
 */

interface KeyValue {
  [index: string]: number | string
}

export interface GenericResponse<T = Record<string, unknown>> {
  AROH: Record<string, unknown>
  data: T
}

export interface GenericResponseWithMessage {
  statusCode: number
  message: string
  data: GenericResponseWithMessageData
}

export interface GenericResponseWithMessageData {}

export interface AccountContact {
  email: string
  mobile: string
  name: string
}

export interface AccountDisclosures {
  employment_status?: string
  employer_name?: string
  employer_address?: string
  employment_position?: string
  is_control_person: boolean
  is_affiliated_exchange_or_finra: boolean
  is_politically_exposed: boolean
  immediate_family_exposed: boolean
}

export interface Agreement {
  agreement: string
  ip_address: string
  signed_at: moment.Moment
}

interface Identity {
  annual_income_max?: string
  annual_income_min?: string
  country_of_birth?: string
  country_of_citizenship?: string
  country_of_tax_residence: string
  date_of_birth: string
  family_name: string
  funding_source: string[]
  given_name: string
  liquid_net_worth_max?: string
  liquid_net_worth_min?: string
  tax_id?: string
  tax_id_type?: string
  total_net_worth_max?: string
  total_net_worth_min?: string
  extra: Record<string, string | number>
  bo_id: string[]
}

export interface TrustedContact {
  city?: string
  country?: string
  email_address?: string
  family_name: string
  given_name: string
  phone_number?: string
  postal_code?: string
  state?: string
  street_address?: string[]
}

export interface AccountAddress {
  address: string
  pincode: string
  city: string
  state: string
}

export enum AccountStatus {
  ALL = 'ALL',
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETE = 'COMPLETE',
  PC_ACTIVE = 'PC_ACTIVE',
  PC_INACTIVE = 'PC_INACTIVE',
}

export enum WaitStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
}

export interface NominatorAccounts {
  accounts: NominatorAccountResponse[]
  nominatorName: string
  total: number
}

export interface PanAdharData {
  aadhaar_url: string
  pan_url: string
}
export interface Account {
  account_id: string
  gui_account_id: string
  contact: AccountContact
  whatsapp_notification: Account
  identity: Identity
  status: AccountStatus
  user_funds?: PeFundsDataInterface
  aroh_user_funds?: ArohFundsDataInterface
  address: string
  nominator?: NominatorResponse
  name?: string
  bank_details?: BankDetail[]
  upi_details?: UpiDetails
  account_number: string
  branch: string
  ifsc: string
  wallet_id?: string
  wallet_details: WalletDetails
  hypto_vendor_wallet_id?: number
  decentro_wallet_id: string
  wallet_balance?: number
  wallet_withdraw_amount?: number
  wallet_bank_details: {
    account_number: string
    ifsc: string
  }[]
  coins: number
  referral: Referral
  name_as_per_pan: string
  address_as_per_aadhaar: string
  pan: string
  pan_updated_at: string
  portal_linked: boolean
  aroh_details: PanAdharData
  created_at: moment.Moment
  updated_at: moment.Moment
}

export interface UpiDetails {
  upi_id: string
  status: string
}

export interface Referral {
  id: string
  code: string
  account_id: string
  referred_by: string
  referral_limit: number
}

export interface WalletDetails {
  vendor_name: string
  provider_name: string
  migrated: boolean
  acknowledged: boolean
  acknowledged_at: moment.Moment
}
export interface Activity {
  activity_type: string
  id?: string
  account_id: string
  order_id?: string
  date?: string
  transaction_time?: moment.Moment
  qty?: number
  price?: string
  side?: string
  symbol?: string
  net_amount?: number
  status?: string
}

export interface Order {
  account_id: string
  id: string
  filled_avg_price: number
  qty?: number
  notional?: number
  filled_qty: number
  side: string
  symbol: string
  status: string
  submitted_at: moment.Moment
  created_at: moment.Moment
  updated_at: moment.Moment
  filled_at?: moment.Moment
  expired_at?: moment.Moment
  cancelled_at?: moment.Moment
  failed_at?: moment.Moment
  type: string
  client_order_id: string
  asset_id: string
  asset_class: string
  commission?: number
  time_in_force: string
  limit_price?: number
  stop_price?: number
  order_type: string
}

export interface PositionDataInterface {
  buyQty: number
  isinId: string
  ltp: number
  netPrice: number
  productType: string
  netQty: number
  segment: number
  sellQty: number
  series: string
  symbol: string
  token: number
  expiry: string
  avgBuyPrice: number
  avgSellPrice: number
  marketLot: string
  transactionId: string
  aprQty: number
  exchangeScript: string
}

export interface Stats {
  aum: number
  active_accounts: number
  active_accounts_change_week: string
  active_accounts_change_last: number
  orders_count_week: number
  orders_count_week_change: number
  accounts_created_30d: KeyValue
}

export interface Transfer {
  id: string
  account_id: string
  type: string
  status: string
  amount: string
  direction: string
  created_at: moment.Moment
  updated_at: moment.Moment
  expires_at: moment.Moment
  additional_information?: string
}

export interface Journal {
  id: string
  entry_type: string
  from_account: string
  to_account: string
  symbol: string
  qty: number
  price: number
  status: string
  settle_date?: moment.Moment
  system_date?: moment.Moment
  net_amount: number
  description: string
}

export interface MemberAuthorization {
  user_id: string
  correspondent: string
  sandbox: boolean
  role: string
  created_at: moment.Moment
  updated_at: moment.Moment
}

export interface TeamMember {
  id: string
  email: string
  cognito_id?: string
  name?: string
  role?: string
  correspondents?: MemberAuthorization[]
  created_at: moment.Moment
  updated_at: moment.Moment
}

export interface ApiKey {
  id: string
  secret?: string
  status: string
  created_at: moment.Moment
}

export interface Document {
  id: string
  type: string
  date: string
  account_id: string
}

export interface CorrespondentResponse {
  correspondent: string
  name: string
  setup: string
  business_type?: BusinessType
}

/*
 * REQUEST PARAMS
 */
export interface ListActivitiesParams {
  page_token?: string
  date?: string
  until?: string
  after?: string
  direction?: 'asc' | 'desc'
  page_size?: number
  activity_type?: string
}

export interface OrdersParams {
  asset_id?: string
  type?: string
  page?: number
  limit?: number
  createdAfter?: string
  createdBefore?: string
  created_after?: string
  created_before?: string
  side?: string
  segment?: number
  symbol?: string
  qtyStart?: number
  qtyEnd?: number
  status?: string
  search?: string | undefined
  data?: Record<string, unknown>
  orders?: OrderResponse[]
  token?: string
}

export interface AssetsParams {
  state: string
  status: string
  limit?: number
  page?: number
  search?: number
}
export interface ReportsParams {
  type?: string
  page?: number
  limit?: number
  createdAfter?: string
  createdBefore?: string
  side?: string
  segment?: number
  symbol?: string
  qtyStart?: number
  qtyEnd?: number
  status?: string
  search?: string | undefined
  data?: Record<string, unknown>
  orders?: OrderResponse[]
  token?: string
}

export interface BlogsParams {
  type?: string
  page?: number
  limit?: number
  createdAfter?: string
  createdBefore?: string
  side?: string
  segment?: number
  symbol?: string
  qtyStart?: number
  qtyEnd?: number
  status?: string
  search?: string | undefined
  data?: Record<string, unknown>
  orders?: OrderResponse[]
  token?: string
}

export interface NewsParams {
  type?: string
  page?: number
  limit?: number
  createdAfter?: string
  createdBefore?: string
  side?: string
  segment?: number
  symbol?: string
  qtyStart?: number
  qtyEnd?: number
  status?: string
  search?: string | undefined
  data?: Record<string, unknown>
  orders?: OrderResponse[]
  token?: string
}

export interface BannerParams {
  status?: string
  page?: number
  limit?: number
  createdAfter?: string
  createdBefore?: string
  startedAfter?: string
  endedBefore?: string
  search?: string | undefined
}

export interface OrdersPara {
  type?: string
  page?: number
  createdAfter?: string
  createdBefore?: string
  side?: string
  segment?: number
  symbol?: string
  qtyStart?: number
  qtyEnd?: number
  status?: string
  search?: string | undefined
  data?: Record<string, unknown>
  orders?: OrderResponse[]
  token?: string
}

export interface AccountsByParams {
  page?: number
  limit?: number
}

export interface PositionsQuery {
  symbols?: string[] | string
  side?: string
  until?: string
  after?: string
}

export interface TransfersParams {
  transfer_type?: string
  limit?: number
  offset?: number
  direction?: string
  updated_after?: string
  updated_before?: string
  amount_above?: number
  amount_below?: number
}

export type JournalStatus =
  | 'pending'
  | 'canceled'
  | 'executed'
  | 'rejected'
  | 'all'
export type JournalType = 'JNLC' | 'JNLS'
export interface JournalsParams {
  after: string
  before: string
  entry_type: JournalType
  status?: JournalStatus
  to_account?: string
  from_account?: string
}

export interface DocumentsParams {
  type: string
  limit: number
  offset: number

  // YYYY-MM-DD
  start?: string
  end?: string
}

export interface DocumentDownloadParams {
  account_id: string
  document_id: string
}

export interface RegistrationRequest {
  name?: string
  email: string
  cognito_id: string
}

export interface ClaimInviteRequest {
  name: string
}

export interface EditTeamMemberRequest {
  name?: string
  role?: string
}

export interface UserInvitation {
  email: string
  role: string
}

export interface WaitlistsParams {
  page?: number
  limit?: number
}

export interface WishlistsParams {
  page?: number
  limit?: number
  asset?: string
  token?: string
  total?: number
  search?: string
  asset_id?: string[]
  createdAfter?: string
  createdBefore?: string
}

export interface LamfParams {
  page?: number
  limit?: number
}

export interface NominatorsParams {
  page?: number
  limit?: number
  search?: string
  createdAfter?: string
  createdBefore?: string
}

export interface AccountsParams {
  status?: string
  createdBefore?: string
  createdAfter?: string
  lastEquityBelow?: number
  lastEquityAbove?: number
  page?: number
  limit?: number
  search?: string
  evaluationExpiryDate?: string
  dob?: string
  pcActive?: boolean
}
export interface HoldingsParams {
  token?: string
  page?: number
  limit?: number
}

export interface blogsParams {
  slug?: string
  page?: number
  limit?: number
}

export interface newsParams {
  slug?: string
  page?: number
  limit?: number
}

export const activityTypes = [
  'JNLS',
  'DIVNRA',
  'INT',
  'CSW',
  'DIV',
  'JNLC',
  'CSD',
]

export enum BusinessType {
  BrokerDealer = 'broker_dealer',
  NeoBank = 'neobank',
  EstablishedFintech = 'established_fintech',
  RegisteredInvestmentAdvisor = 'registered_investment_advisor',
  SaaS = 'saas',
  Other = 'other',
}

export interface UpdateCorrespondentRequest {
  business_type?: BusinessType
  user_countries?: string[]
  name?: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  id: string
  auth_type?: 'MFA' | 'OTP'
  account_id: string
}
export interface ForgotOtpResponse {
  statusCode: number
}

export interface SignupResponse {
  statusCode: number
  message: string
  data: SignupResponseData
}

export interface SignupResponseData {
  account_id: string
}

export interface WaitlistResponse {
  id: string
  email: string
  code: string
  status: string
  registered: boolean
  createdAt: string
  updatedAt: string
  sentCode: boolean
}
export interface WishlistResponse {
  wishlist_id: string
  token: string
  name: string
  gui_account_id: string
  email: string
  mobile: string
  notified: boolean
  onclick: (a: string) => void
}

export interface PCWishlistResponse {
  id: string
  name: string
  gui_account_id: string
  email: string
  mobile: string
  first_name: string
  middle_name: string
  last_name: string
  notify: boolean
  created_at: string
}

export interface LamfResponse {
  gui_account_id: string
  account_id: string
  first_name: string
  last_name: string
  email: string
  mobile: string
  aadhaar: string
  pan: string
  loan_amount: string
  type?: string
  created_at: string
  updated_at: string
  onclick: (a: string) => void
}

export interface LamFResponse {
  inquiry: LamfResponse[]
  total: number
}

export interface NominatorResponse {
  name: string
  nominator_id: string
  logo: string
  code: string
  status: boolean
  accounts: string
  created_at?: string
  updated_at?: string
}

export interface AccountResponse {
  account_id: string
  created_at: string
  updated_at: string
  mobile: string
  email: string
  name: string
  orders_count: string
  first_name?: string
  last_name?: string
  status: AccountStatus
  type?: string
  gui_account_id: string
  nominator_id?: string
  nominator?: NominatorResponse
  registered: string
  PE: PEOrderType[]
  code: string
  onboarding_tracker: string
  referral?: Referral
  wallet_balance?: string
  withdraw_balance?: string
  evaluation_expiry_date?: string
  pe_holdings?: HoldingsResponse[]
  pc_holdings?: AccountWisePcHoldingData[]
  total_pe_holdings_value: string
  total_pc_holdings_value: string
}

export interface CoinTransactionResponse {
  transaction_id: string
  gui_transaction_id: string
  account_id: string
  gui_account_id: string
  referee_account_id: string | null
  referrer_account_id: string | null
  referee_order_id: string
  order_id: string | null
  coins: number
  direction: string
  status: string
  reward_type: string
  description: string
  note: string | null
  created_at: string
  updated_at: string
  mobile: string
  first_name: string
  last_name: string
  email: string
}

export interface PennyDropTransactionResponse {
  transaction_id: string
  vendor_transaction_id: string
  account_id: string
  account_number: string
  beneficiary_name: string
  payment_type: string
  transaction_type: string
  status: string
  payee_account_number: string
  payee_account_ifsc: string
  decentro_transaction_id: string
  reason: string
  reference_id: string
  bank_reference_number: string
  timestamp: string
  created_at: string
  updated_at: string
  email: string
  mobile: string
  gui_account_id: string
}

export interface NominatorAccountResponse {
  account_id: string
  created_at: string
  mobile: string
  email: string
  name: string
  orders_count: string
  first_name: string
  last_name: string
  status: AccountStatus
  type?: string
  gui_account_id: string
  nominator_id?: string
}

export interface WaitlistsResponse {
  waitlists: WaitlistResponse[]
  total: number
}
export interface WishlistsResponse {
  wishlists: WishlistResponse[]
  total: number
}

export interface GetAllPCWishlistsResponse {
  wishlists: PCWishlistResponse[]
  total: number
  page: number
  limit: number
}

export interface NominatorsResponse {
  nominators: NominatorResponse[]
  total: number
}

export interface AccountsResponse {
  accounts: AccountResponse[] | NominatorAccountResponse[]
  total: number
  nominatorName?: string
}

export interface PeFundsDataInterface {
  total_investment: number
  pnl: number
  pnl_percentage: number
  current_value: number
  balance: number
  total_amount_invested: number
  sell_quantity: number
  sell_price: number
  sell_amount: number
}

export interface ArohFundsDataInterface {
  total_investment: number
  current_value: number
  accrued_returns: number
}

export interface UpdateHolding {
  statusCode: number
  message: string
  data: {}
}

export interface FundDataPeInterface {
  totalInvestment: number
  pnl: number
  pnlPercentage: number
  currentValue: number
  balance: number
}

export interface GetAccountHoldingsResponse {
  holdings: HoldingsDataInterface[]
}

export interface HoldingsDataInterface {
  isinId: string
  segment: number
  token: number
  symbol: string
  secName: string
  ltp: number
  closePrice: number
  avgBuyPrice: number
  priceDivisor: number
  qty: number
  sellQty: number
  marketLot: number
  aprQty: number
  transactionId?: string
  exchangeScript?: string
}

export interface GetAccountPositionsResponse {
  positions: PositionDataInterface[]
}

export interface OrdersResponse {
  total: number
  orders: OrderListObj[]
}

export interface OrderListObj {
  account_id: string
  order_id: string
  side: string
  symbol: number
  quantity: number
  total: number
  segment: number
  createdAt: string
}

export interface OrderDetailResponse {
  order_id: string
  vendor_order_id: string
  account_id: string
  side: string
  symbol: string
  quantity: number
  segment: number
  total: number
  status: string | null
  PE: any[]
  data: OrderDetailResponse
}

export interface OrderResponse {
  id: string
  gui_id: string
  account_id: string
  gui_account_id: string
  gui_order_id: string
  created_at: string
  order_id: string
  quantity: number
  segment: number
  side: string
  symbol: number
  total: number
  status: string
  type?: string
  PE?: PEOrderType[]
  first_name: string
  last_name: string
  data: OrderDetailResponse
  gui_transaction_id: string
  orders: OrderResponse[]
  price?: string
  name_as_per_pan?: string
  email: string
  mobile: string
  bo_id?: string
  pan?: string
  payment_date?: string
  stampDuty?: string
  transactionFee?: string
  contactPerson?: string
  company_pan?: string
  total_investment_value?: string
  note?: string
  gst?: string
  documentation_charges?: string
  price_per_lot?: string
}

export interface TokenResponse {
  token: string
  price: number
  symbol: string
  asset_id: string
  transferable: string
}
export interface AssetsForPC {
  id: string
  name: string
  status: string
  available_quantity: number
  price: string
  transaction_fees: number
  gst: number
  active: boolean
}

export interface ReportResponse {
  start_time: string
  end_time: string
  status: string
  created_at: string
  updated_at: string
  log_file: string
}

export interface ArohResponse {
  account_id: string
  gui_account_id: string
  gui_order_id: string
  created_at: string
  order_id: string
  quantity: number
  segment: number
  symbol: number
  total: number
  status: string
  type?: string
  first_name: string
  last_name: string
  data: OrderDetailResponse
  gui_transaction_id: string
  aroh: ArohOrderStatus[]
}

export interface HoldingsResponse {
  token: string
  symbol: string
  quantity: number
  amount: number
  price: number
}

export interface GetAccountResponse {
  account_id: string
  first_name: string
  created_at: string
  last_name: string
}

export interface GetOrdersResponse {
  orders: OrderResponse[]
  total: number
}
export interface GetTokenResponse {
  data: TokenResponse[]
}
export interface GetAssetsResponse {
  assets: AssetsForPC[]
}

export interface GetNominatorOrdersResponse {
  orders: OrderResponse[]
  total: number
}

export interface GetArohResponse {
  AROH: ArohResponse[]
  total: number
}
export interface GetAccountsResponse {
  accounts: GetAccountResponse[]
  total: number
}

export interface DocumentsParams {
  type: string
  limit: number
  offset: number

  // YYYY-MM-DD
  start?: string
  end?: string
}

export interface DocumentDownloadParams {
  account_id: string
  document_id: string
}

export interface AssetResponse {
  name: string
  symbol: string
  id: string
}

export interface TimeResponse {
  timestamp: moment.Moment
  is_open: boolean
  next_open: moment.Moment
  next_close: moment.Moment
}

export interface CategoryResponse {
  category_id: string
  category_name: string
  category_tickers: string[]
}

export interface ChartResponse {
  t: string
  o: number
  h: number
  l: number
  c: number
  v: number
  n: number
  vw: number
}

export interface ChartValues {
  name: string
  value: number
}

export interface StockDetailsResponse {
  symbol: string
  name: string
  ceo: string
  description: string
  employees: number
  hq_country: string
  industry: string
  listdate: string
  marketcap: bigint
  similar: string[]
  url: string
}

export interface StockNewsResponse {
  id: string
  title: string
  author: string
  amp_url: string
  keywords: string[]
  image_url: string
  publisher: {
    name: string
    logo_url: string
    favicon_url: string
    homepage_url: string
  }
  article_url: string
  description: string
  published_utc: moment.Moment
}

export interface TransactionsParams {
  type?: string
  page?: number
  limit?: number
  asset_id?: string
  direction?: string
  status?: string
  callback_data?: string
  createdAfter?: string
  createdBefore?: string
  created_after?: string
  created_before?: string
  updatedBefore?: string
  updatedAfter?: string
  amountAbove?: number
  amountBelow?: number
  search?: string | undefined
  dateFilterBy?: string
  sortBy?: string
  sortOrder?: string
  transactionAfter?: string
  transactionBefore?: string
}

export interface InitializeWalletTransferParams {
  status: string
  walletTransactionId: string
}

export interface TransactionsResponse {
  total: number
  message: string
  BK: TransactionListObj[]
  MF: TransactionListObj[]
  PE: TransactionListObj[]
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
}

export interface WalletTransactionListObj {
  wallet_transaction_id: string
  vendor_wallet_transaction_id: string
  vendor_wallet_id: number
  vendor_transaction_id: string
  account_id: string
  wallet_id: string
  gui_wallet_transaction_id: string
  order_id: string
  amount: number
  charges_gst: number | null
  settled_amount: number | null
  account_balance: string
  transaction_amount: string
  transaction_type: string
  status: string
  payment_type: string
  reference_number: string
  reference_id: string | null
  credit_debit: string
  bene_account_number: string
  bene_account_ifsc: string
  va_settler_id: string | null
  upi_id: string | null
  upi_transaction_id: string | null
  vendor_order_id: string | null
  upi_payer_name: string | null
  upi_payer_mobile: string | null
  sender_account_number: string
  sender_account_ifsc: string
  rmtr_full_name: string | null
  rmtr_account_no: string | null
  rmtr_account_ifsc: string | null
  reason: string
  withdraw_amount: number
  created_at: string
  updated_at: string
  transaction_time: string
  user_transaction_type: string
  provider_code: string | null
  portal: string
  note: string
  credited_at: string | null
  wallet: Wallet
  credit_amount: number
  debit_amount: number
  order_amount: number
  wallet_balance: number
  debit_account_number: string
  currency: string
  precize_transaction_type: string
  order_value: string
  order_stamp_duty: string
  order_transaction_fees: string
  transaction_fee: string
  gst: string
}

export interface Wallet {
  user: User
}

export interface User {
  gui_account_id: string
  email: string
  mobile: string
  first_name: string
  last_name: string
  bank_details: BankDetail[]
}

export enum TransactionDirection {
  DEPOSIT = 'Deposit',
  WITHDRAW = 'Withdraw',
}
export enum WalletTransactionDirection {
  CREDIT = 'CREDIT',
  WITHDRAW = 'WITHDRAW',
  ORDER = 'ORDER',
  DEBIT = 'DEBIT',
  ALL = 'ALL',
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  FAILED = 'FAILED',
  REFUND_PENDING = 'refund_pending',
  REFUND_FAILED = 'refund_failed',
  REFUND_COMPLETED = 'refund_completed',
}

export enum OrderStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PAYMENT_PENDING',
  TRANSFER_PENDING = 'TRANSFER_PENDING',
  VERIFICATION_PENDING = 'VERIFICATION_PENDING',
  CANCELLED = 'CANCELLED',
  DISPATCHED = 'DISPATCHED',
  REJECTED = 'FAILED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  SUBSCRIPTION_PROCESSING = 'SUBSCRIPTION_PROCESSING',
  SUBSCRIPTION_PROCESSED = 'SUBSCRIPTION_PROCESSED',
  FAILED = 'FAILED',
}

export enum ArohOrderStatus {
  SUCCESS = 'COMPLETED',
  PENDING = 'PAYMENT_PENDING',
  PAYMENT_COMPLETE = 'PAYMENT_COMPLETE',
  BASIC_DETAILS = 'BASIC_DETAILS',
  CANCELLED = 'CANCELLED',
  SIGN_CONSENT = 'SIGN_CONSENT',
  FAILED = 'FAILED',
  UPLOAD_DOCUMENT = 'UPLOAD_DOCUMENT',
}

export enum ReportStatus {
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
}

export interface TransactionDetailResponse {
  type: string
  transaction_id: string
  vendor_transaction_id: string
  user_id: string
  account_id: string
  direction: string
  amount: string
  status: string
  created_at: string
  updated_at: string
  gui_account_id: string
  gui_transaction_id: string
}

interface BrokingandMutualFundsType {
  totalAccounts: number
  totalOrders: number
  totalCompleteAccounts: number
  totalTransferPendingOrders: number
  accounts: number
  accountsGrowth: number
  totalPendingAccounts: number
  totalPendingOrders: number
  marketStatus: Record<
    string,
    Record<string, { MktType: number; Status: '0' | '2' }>
  >
  orders: number
  ordersGrowth: string
  recentOrders: {
    orders: OrderResponse[]
  }
  recentSignups: {
    accounts: AccountResponse[]
  }
  recentTransactions: {
    transactions: TransactionListObj[]
  }
  signupsGraphData: Record<string, number>
  totalOrderValue: string
  totalTransactionValue: string
  totalCompletedOrders: number
  totalPendingWaitlistUsers: number
  totalWaitlistUsers: number
  totalActiveUsersGraphData: Record<string, number>
  totalPeOrdersGraphData: Record<string, number>
  totalPePaymentsGraphData: Record<string, number>
  todaysAccountCount: string
  todaysOrdersCount: string
  totalOrderAmount: string
  totalWithdrawAmount: string
  totalDebitAmount: string
  totalCreditAmount: string
  totalWalletBalance: string
  totalAccountBalance: string
  totalWithdrawableBalance: string
  totalWithdrawProcessPendingAmount: string
  differenceInBalance: string
}

export interface DashboardDataResponse {
  bk: BrokingandMutualFundsType
  mf: BrokingandMutualFundsType
  pe: BrokingandMutualFundsType
}

export interface orderDetails {
  account_id: string
  gui_account_id: string
  order_id: string
  token: string
  symbol: string
  company_pan: string | null
  price: string
  price_per_share_in_words: string
  stampDuty: string
  gst: string
  transactionFee: string
  quantity: number
  quantity_in_words: string
  amount: string
  lots: 0
  price_per_lot: string
  status: string
  pan: string
  aadhaar: string
  name_as_per_pan: string
  address_as_per_aadhaar: string
  current_date: string
  email: string
  mobile: string
  reason: string
  trade_time: string
  contactPerson: string
  gui_order_id: string
  side: string
  signature_image: string | null
  sign_agreement_ip_address: string | null
  sign_agreement_timestamp: string | null
  total: string
  created_at: string
  payment_date: string | null
  transfer_success_date: string | null
  bo_id: string
  transferable: boolean
}

export interface AnalyticsDataResponse {
  clickedOnInvestNow: number
  didNotAddBankDetails: number
  didNotAddDemat: number
  didNotConfirmDemat: number
  didNotClickPlaceOrder: number
  didNotAddUPI: number
  didNotClickPayNow: number
  paymentPendingCount: number
  userPanLinkPendingCount: number
  pendingOrderCount: number
  failedOrderCount: number
  cancelledOrderCount: number
  succesOrderCount: number
  transferPendingOrderCount: number
  dispatchedOrderCount: number
  recentOrders: { orders: orderDetails[]; total: number }
  recentTransactions: TransactionListObj[]
  sharesTransferPendingCount: number
  sharesTransferFailedCount: number
  recentTransferFailedOrders: { orders: orderDetails[]; total: number }
  recentPanLinkPendingAccounts: {
    users: UsersPanPendingResponse[]
    total: number
  }
  recentTransferPendingOrders: { orders: orderDetails[]; total: number }
  verificationPendingOrders: OrderResponse[]
  didNotLinkDemat: number
  linkedDemat: number
  linkedBank: number
  didNotAddBank: number
  arohUsers: ArohData
  verificationPendingOrdersCount: number
  nsePaidOrdersCount: number
  total_order_value: number
  average_order_value: number
}

export interface ArohData {
  didNotClickPayNow: number
  didNotUploadAadhaar: number
  didNotUploadPan: number
  didNotSignConsentLetter: number
  AROH: ArohOrderStatus[]
}
export type PEOrderType = {
  account_id: string
  gui_account_id: string
  order_id: string
  gui_order_id: string
  side: 'Buy' | 'Sell'
  quantity: number
  lots: number
  price_per_lot: string
  symbol: string
  total: string
  status: string
  created_at: string
  payment_date: string
  transfer_success_date: string
  firstName: string
  lastName: string
  mobile: string
  email: string
}

export type PEAccountType = {
  account_id: string
  gui_account_id: string
  email: string
  mobile: string
  firstName: string
  lastName: string
  status: string
  nominator: string | null
  orders_count: number
  whatsapp_notification: boolean
  created_at: string
  evaluationExpiryDate: string
  onBoardingTracker: string
  active: boolean
}

export type OrderAnalyticsByStatus = {
  total: number
  PE: PEOrderType[] | PEAccountType[]
}

export interface UserAnalyticsDataResponse {
  didNotAddPersonalDetails: number
  didNotEnterVerifyOtp: number
  didNotEnterAboutYouDetails: number
  didNotEnterBankDetails: number
  didNotAgreeToDisclaimer: number
  totalWaitlistUsersCount: number
  pendingWaitlistUsersCount: number
  recentPeSignups: Record<string, unknown>[]
  account: Record<string, unknown>[]
  recentWaitlists: Record<string, unknown>[]
  waitlists: Record<string, unknown>[]
  data: Record<string, unknown>
  didNotSendAccessCodeCount: number
  sentAccessCodeCount: number
}

export interface GetAllAccountsResponse {
  BK: AccountResponse[]
  MF: AccountResponse[]
  PE: AccountResponse[]
  message: string
  total: number
}

export interface GetAllNominatorAccountsResponse {
  PE: NominatorAccountResponse[]
  message: string
  total: number
}

export interface GetAllOrders {
  BK: OrderResponse[]
  MF: OrderResponse[]
  PE: OrderResponse[]
  orders: OrderResponse[]
  message: string
  total: number
}

export interface GetAllNominatorOrders {
  PE: OrderResponse[]
  orders: OrderResponse[]
  message: string
  total: number
}

export interface GetOrderByIdResponse {
  message: string
  data: {
    type: string
    data: Record<string, unknown>
  }
}

export interface getTransactionByIdResponse {
  type: string
  transactions: {
    transactionId: string
    vendor_transaction_id: string
    userId: string
    accountId: string
    direction: string
    amount: number
    status: string
    createdAt: string
    updatedAt: string
  }
}
export interface FinancialReportInterface {
  title: string
  link: string
}
export interface splitDetailsInterface {
  split_from: number
  split_to: number
  record_date: string
  split_documentation: string[] | []
}
export interface createPeAssetType {
  token: string
  symbol: string
  slug: string
  pan: string
  price: number
  documentationCharges: number

  availableQuantity: number
  inventoryQuantity: number
  minQuantity: number
  maxQuantity: number
  minOrderValue: number
  maxOrderValue: number

  info: string
  about: string
  sector: string
  hq: string
  link: string
  faceValue: number

  sequenceNo: number
  openSequenceNo: number

  nsdl: boolean
  cdsl: boolean
  soldOut: boolean
  onlyFewLeft: boolean
  comingSoon: boolean

  isListedOnExchange: boolean
  blockDeal: boolean
  transferable: boolean
  capitalReduction: boolean
  amalgamation: boolean
  manageInventory: boolean
  openActive: boolean
  openSpotlight: boolean
  active: boolean
  glanceReports: string[] | []
  fullReport: string
  financialReports: FinancialReportInterface[] | []
  splitDetails?: splitDetailsInterface[] | []
  logo: string
  logoMark: string
  mobileLogo: string
}

export interface mediaResponsePe {
  statusCode: number
  message: string
  data: {
    filePath: string
  }
}
export interface assetsPeResponse {
  about: string
  active: boolean
  availableLots?: number
  documentationCharges: number
  bod?: AssetsModelTypes.BodInterface[]
  cdsl: boolean
  faceValue: number
  financialReports: AssetsModelTypes.FinancialReportInterface[]
  fullReport: string
  glanceReports: string[]
  hq: string
  indicators?: AssetsModelTypes.IndicatorInterface[]
  info: string
  link: string
  logo: string
  logoMark: string
  maxQuantity: number
  minQuantity: number
  mobileLogo: string
  news?: AssetsModelTypes.NewsInterface[]
  nsdl: boolean
  onlyFewLeft: boolean
  price: number
  sector: string
  sequenceNo: number
  symbol: string
  slug: string
  token: string
  totalWishlistUsers?: number
  pan: string
  comingSoon: boolean
  soldOut: boolean
  availableQuantity: number
  revenue?: number
  netProfit?: number
  pendingOrderQuantity?: number
  transferPendingOrderQuantity?: number
  completeOrderQuantity?: number
  sourceQuantities?: number
  isListedOnExchange: boolean
  metaTitle?: string
  metaDescription?: string
  inventoryQuantity: number
  maxOrderValue: number
  minOrderValue: number
  openSequenceNo: number
  transferable: boolean
  capitalReduction: boolean
  blockDeal: boolean
  amalgamation: boolean
  manageInventory: boolean
  openActive: boolean
  openSpotlight: boolean
  splitDetails: splitDetailsInterface[] | []
}
export interface getPeAssetsResponse {
  assets: assetsPeResponse[]
  total: number
}

export interface PcAssetsResponse {
  statusCode: number
  message: string
  data: PcAssetsResponseData
}

export interface PcAssetsResponseData {
  assets: PcAsset[]
  total: number
  page: number
  limit: number
}

export interface createPcAssetType {
  slug: string
  category_id: string
  name: string
  highlights: string
  price: number
  transaction_fees: number
  rate_of_returns: number
  ui_rate_of_returns: number
  gst: number
  subscribed_value: number
  max_subscription_value: number
  from: string
  to: string
  start_date: string
  end_date: string
  tentative_start_date: string
  tentative_end_date: string
  trade_start_date: string
  trade_end_date: string
  repaid_date: string
  tenure: number
  tentative_tenure: number
  available_quantity: number
  min_quantity: number
  max_quantity: number
  min_order_value: number
  max_order_value: number
  active: boolean
  status: string
  sequence_number: number
  open_active: boolean
  open_spotlight: boolean
  open_sequence_no: number
  trade_reports?: TradeReport[] | []
}

export interface PcAsset {
  id: string
  gui_id: string
  slug: string
  category_id: string
  name: string
  highlights: string
  price: number
  transaction_fees: number
  rate_of_returns: number
  ui_rate_of_returns: number
  gst: number
  subscribed_value: number
  max_subscription_value: number
  from: string
  to: string
  start_date: string
  end_date: string
  tentative_start_date: string
  tentative_end_date: string
  trade_start_date: string
  trade_end_date: string
  repaid_date: string
  tenure: number
  tentative_tenure: number
  available_quantity: number
  min_quantity: number
  max_quantity: number
  min_order_value: number
  max_order_value: number
  active: boolean
  status: string
  sequence_number: number
  trade_reports: TradeReport[] | []
  open_active: boolean
  open_spotlight: boolean
  open_sequence_no: number
  created_at: string
  updated_at: string
}

export interface TradeReport {
  file: string
  file_name: string
}

export namespace AssetsModelTypes {
  export interface BodInterface {
    name: string
    title: string
  }

  export interface IndicatorInterface {
    year: string
    revenue: number
    otherIncome: number
    totalIncome: number
    totalExpenditure: number
    ebitda: number
    netProfit: number
    totalComprehensiveIncome: number
    epsBasic: number
    epsDiluted: number
    peRatio: number
    netProfitMargin: string
  }

  export interface NewsInterface {
    title: string
    date: string
    link: string
    publisher: string
  }

  export interface FinancialReportInterface {
    title: string
    link: string
  }
}
export interface createNewAsset {
  token: string
  symbol: string
  logo: string
  logoMark: string
  price: number
  sector: string
  hq: string
  link: string
  info: string
  about: string
  bod: AssetsModelTypes.BodInterface[]
  indicators: AssetsModelTypes.IndicatorInterface[]
  news: AssetsModelTypes.NewsInterface[]
  financialReports: AssetsModelTypes.FinancialReportInterface[]
  glanceReports: string[]
  fullReport: string
  active: boolean
}
export interface PeTransactionStatus {
  PENDING: string
  SUCCESS: string
  FAILED: string
  CANCELLED: string
}

export interface AccountWalletTransaction {
  guiTransactionId: string
  transactionId: string
  vendorWalletTransactionId: string
  vendorWalletId: string
  paymentType: string
  transactionAmount: number
  status: string
  creditDebit: string
  benefactorAccountNumber: string
  benefactorAccountIfsc: string
  senderAccountNumber: string
  senderAccountIfsc: string
  tradeTime: Date
  updatedAt: Date
  userTransactionType: string
  upiId: string
  charges_gst: number
  settled_amount: number
  accountBalance: string
  transactionType: string
  transactionTime: string
  portal: string
  note: string
  gui_wallet_transaction_id: string
  vendor_wallet_transaction_id: string
  vendor_wallet_id: string
  transaction_amount: string
  payment_type: string
  user_transaction_type: string
  credit_debit: string
  created_at: string
  wallet_transaction_id: string
}
export interface WalletTransactionsParams {
  type?: string
  page?: number
  limit?: number
  direction?: string
  status?: string
  createdAfter?: string
  createdBefore?: string
  search?: string | undefined
  amountAbove?: number
  amountBelow?: number
  updatedBefore?: string
  updatedAfter?: string
  dateFilterBy?: string
  transactionAfter?: string
  transactionBefore?: string
}

export interface OrderDetail {
  order_id: string
  gui_order_id: string
  razorpay_order_id: string
  token: string
  symbol: string
  side: string
  quantity: number
  lots: number
  price_per_lot: string
  price: string
  amount: number
  stampDuty: string
  transactionFee: string
  status: string
  reason: string
  payment_id: string | null
  bo_id: string
  upi: string | null
  ses_details: SesDetails
  created_at: string
  updated_at: string
  payment_date: string
  transfer_success_date: string
  paid_by: string
  note: string | null
  account_id: string
  email: string
  mobile: string
  total: string
  name: string
  bank_details: bankDetails[]
}

export interface UsersPanPendingResponse {
  account_id: string
  gui_account_id: string
  email: string
  mobile: string
  first_name: string
  middle_name: string
  last_name: string
  status: string
  onboarding_tracker: string
  bo_id: string[]
  pan: string
  portal_linked: boolean
  dob: string
  orders_count: number
  whatsapp_notification: boolean
  active: boolean
  wallet_balance: string
  withdraw_balance: string
  evaluation_expiry_date: string
  pan_updated_at: string
  created_at: string
  updated_at: string
}

export interface bankDetails {
  account_number: string
  ifsc: string
  bank_name: string
  branch: string
  status: string
}

export interface SesDetails {
  MessageId: string
  ResponseMetadata: ResponseMetadata
}

export interface ResponseMetadata {
  RequestId: string
}

export interface InitializeWalletTransferResponse {
  statusCode: number
  message: string
  data: WalletData
}

export interface WalletData {
  walletTransactionId: string
  status: string
}

export interface HoldingsData {
  PE: HoldingsResponse[]
  total: number
}

export interface BlogsData {
  map(
    arg0: (el: BlogResponse, idx: number) => React.ReactNode
  ): React.ReactNode[]
  blogs: BlogResponse[]
  total: number
}

export interface NewsData {
  map(
    arg0: (el: NewsResponse, idx: number) => React.ReactNode
  ): React.ReactNode[]
  blogs: NewsResponse[]
  total: number
}

export interface HoldingsResponse {
  holding_id: string
  token: string
  symbol: string
  quantity: number
  price: number
  amount: number
  sold: boolean
  created_at: string
  updated_at: string
  account_id: string
  gui_account_id: string
  email: string
  mobile: string
  first_name: string
  last_name: string
  middle_name?: string
}

export interface BlogResponse {
  id: string
  gui_blog_id: string
  title: string
  meta_title: string
  meta_description: string
  billboard: string
  billboard_type: string
  slug: string
  url: string
  content: string
  read_time: number
  active: boolean
  hashtags: string[]
  published_date: string
  description: string
  author: Author
  created_at: string
  updated_at: string
}
export interface Author {
  id: string
  name: string
  title: string
  description: string
  profile_picture: string
  hashtags: string[]
}

export interface GetAllAuthorsResponse {
  id: string
  gui_author_id: string
  name: string
  title: string
  profile_picture: string
  description: string
  hashtags: string[]
  active: boolean
  created_at: string
  updated_at: string
}

export interface NewsResponse {
  id?: string
  asset_id: string
  title: string
  slug: string
  symbol?: string
  token?: string
  publisher: string
  publisher_url: string
  read_time: number
  published_at: string
  content: string
  content_snippet: string
  takeaways: string
  takeaways_snippet: string
  trending?: boolean
  created_at?: string
  updated_at?: string
}

export interface FaqResponse {
  statusCode: number
  message: string
  data: FaqsResponseArray
}

export interface FaqsResponseArray {
  faqs: FaqsResponseData[]
  total: number
  page: number
  limit: number
}

export interface FaqsResponseData {
  id: string
  sequence_no: number
  active: boolean
  question: string
  answer: string
  created_at: string
  updated_at: string
}

export interface PcAssetCategoryResponse {
  statusCode: number
  message: string
  data: PcAssetCategoryResponseData
}
export interface PcAssetCategoryResponseData {
  id: string
  gui_id: string
  name: string
  logo: string
  logo_mark: string
  mobile_logo: string
  highlights: string
  created_at: string
  updated_at: string
}

export interface ConfigResponse {
  statusCode: number
  message: string
  data: ConfigResponseData
}
export interface ConfigResponseData {
  configs: ConfigData[]
  total: number
  limit: number
  page: number
}
export interface ConfigData {
  key: string
  value: string
}

export interface DailyWalletResponseBalance {
  statusCode: number
  message: string
  data: DailyWalletBalance
}

export interface DailyWalletBalance {
  daywise_transaction_data: DaywiseTransaction[]
  credit_amount: string
  order_amount: string
  withdraw_amount: string
  debit_amount: string
  wallet_balance: string
  count: number
  opening_balance: string
}

export interface DaywiseTransaction {
  date: string
  closing_balance: string
  credit: string
  debit: string
}

export interface Root {
  statusCode: number
  message: string
  data: AllWalletData
}

export interface AllWalletData {
  gui_account_id: string
  name: string
  first_name: string
  middle_name: string
  last_name: string
  email: string
  mobile: string
  created_at: string
  updated_at: string
  migrated: boolean
  acknowledged: boolean
  acknowledgedAt: string
  bankDetails: BankDetail[]
  walletDetails: WalletDetail[]
  total: number
}

export interface BankDetail {
  accountNumber: string
  ifsc: string
  bankName: string
  branch: string
  status: string
}

export interface WalletDetail {
  wallet_id: string
  vendor_wallet_id: string
  gui_wallet_id: string
  reference_number: string
  account_id: string
  account_number: string
  ifsc_code: string
  settle_to: string
  whitelist_remitters: WhitelistRemitter[]
  parent_id: string
  parent_type: string
  created_at: string
  updated_at: string
  status: string
  active: boolean
  account_balance: string
  withdraw_amount: string
  seller_account_balance: string
  seller_withdraw_amount: string
  link_upi: boolean
  upi_details: string
  va_lien_amount: number
  vendor_name: string
  provider_name: string
  wallet_bank_details: WalletBankDetail[]
}

export interface WhitelistRemitter {
  ifsc: string
  number: string
  created_at?: string
  updated_at?: string
}

export interface WalletBankDetail {
  account_ifsc: string
  payment_modes: string[]
  account_number: string
}

export interface ApplyRightIssueResponse {
  statusCode: number
  message: string
  data: ApplyRightIssueData
}

export interface ApplyRightIssueData {
  holding_id: string
  user_id: string
  token: string
  symbol: string
  quantity: number
  price: string
  amount: string
  sell_quantity: number
  sell_price: string
  sell_amount: string
  sold: boolean
  created_at: string
  updated_at: string
}

export interface ApplyRightIssueParams {
  investorId: string
  quantity: string
  price: string
  orderCreatedDate?: string
  paymentDate?: string
  sharesTransferredDate?: string
}

export interface AddFundsParams {
  transactionId?: string
  remitterName?: string
  remitterAccountNumber?: string
  remitterIfsc?: string
  depositAmount?: number
  utr?: string
  paymentMode?: string
  referenceId?: string
  paymentRemark?: string
  creditMethod: string
  amount?: string
  createdAt?: string
}

export interface ApproveDepositParams {
  accountId: string
  status: string
  transactionId?: string
  remitterName?: string
  remitterAccountNumber?: string
  remitterIfsc?: string
  depositAmount?: number
  utr?: string
  paymentMode?: string
  referenceId?: string
  paymentRemark?: string
  amount?: string
  createdAt?: string
}

export interface OptionList {
  value: string
  label: string
  id: string
}

export interface BannerResponse {
  statusCode: number
  message: string
  data: BannerResponseData
}

export interface BannerResponseData {
  banners: Banner[]
  total: number
  page: number
  limit: number
}

export interface Banner {
  id: string
  gui_banner_id: string
  name: string
  active: boolean
  default: boolean
  small_document_url: string
  small_thumbnail_url: string
  small_document_type: string
  medium_document_url: string
  medium_thumbnail_url: string
  medium_document_type: string
  large_document_url: string
  large_thumbnail_url: string
  large_document_type: string
  xl_document_url: string
  xl_thumbnail_url: string
  xl_document_type: string
  link: string
  start_time: string
  end_time: string
  created_at: string
  updated_at: string
  transaction_fees: string
  offer_text: string
  offer: boolean
  link_type: string
}

export interface GetAccountWalletTransactionsbyIdResponse {
  message: string
  data: GetAccountWalletTransactionsbyIdData
}

export interface GetAccountWalletTransactionsbyIdData {
  type: string
  transactions: GetAccountWalletTransactionsbyIdDataTransactions
}

export interface UpiLinks {
  upi: string
  amount: string
  status: string
  message: string
  reference_id: string
  transcation_id: string
}
export interface GetAccountWalletTransactionsbyIdDataTransactions {
  wallet_transaction_id: string
  vendor_wallet_transaction_id: string
  vendor_wallet_id: string
  vendor_transaction_id: string | null
  decentro_transaction_id: string | null
  account_id: string
  wallet_id: string
  gui_wallet_transaction_id: string
  order_id: string
  amount: string
  charges_gst: string
  settled_amount: string
  account_balance: string
  transaction_amount: string
  transaction_type: string
  status: string
  vendor_status: string
  precize_transaction_type: string
  payment_type: string
  reference_number: string | null
  reference_id: string
  credit_debit: string
  bene_account_number: string
  bene_account_ifsc: string
  bene_code: string | null
  bene_account_type: number
  va_settler_id: string | null
  upi_id: string | null
  upi_transaction_id: string | null
  vendor_order_id: string | null
  upi_payer_name: string | null
  upi_payer_mobile: string | null
  sender_account_number: string
  sender_account_ifsc: string
  rmtr_full_name: string | null
  rmtr_account_no: string | null
  rmtr_account_ifsc: string | null
  reason: string | null
  withdraw_amount: string
  created_by: string
  created_at: string
  updated_at: string
  transaction_time: string
  user_transaction_type: string
  vendor_name: string
  provider_name: string
  provider_code: string | null
  portal: string
  note: string
  credited_at: string | null
  upi_links?: UpiLinks
  wallet: Wallet
}

export interface Wallet {
  user: User
}

export interface User {
  gui_account_id: string
  email: string
  mobile: string
}

export interface LogoutResponse extends Omit<Root, 'data'> {}

export interface ActivateMfaResponse extends Omit<Root, 'data'> {
  data: ActivateMfaData
}

export interface ActivateMfaData {
  url: string
  account_id: string
}

export interface VerifyMfaResponse extends Omit<Root, 'data'> {
  data: VerifyMfaData
}

export interface VerifyMfaData {
  account_id: string
  mfa_active: boolean
}

export interface GetAllDashboardCounts {
  totalAccounts: number
  totalCompleteAccounts: number
  totalPendingAccounts: number
  totalOrders: number
  totalCompletedOrders: number
  totalTransferPendingOrders: number
  totalPendingOrders: number
  accounts: number
  todaysAccountCount: number
  todaysOrderCount: number
}

export interface GetAllDashboardOverview {
  totalOrderValue: string
  totalTransactionValue: string
  totalOrderAmount: string
  totalWithdrawAmount: string
  totalDebitAmount: string
  totalCreditAmount: string
  totalWalletBalance: string
  totalAccountBalance: string
  totalWithdrawableBalance: string
  totalWithdrawProcessPendingAmount: string
  differenceInBalance: string
}

export interface AccountWiseHoldingData {
  account_id: string
  gui_account_id: string
  holding_id: string
  asset_id: string
  token: string
  symbol: string
  company_pan: string | null
  quantity: number
  price: string
  amount: string
  buy_transaction_fees: string
  sell_quantity: number
  sell_price: string
  sell_amount: string
  sell_transaction_fees: string
  sold: boolean
  created_at: string
  updated_at: string
  email: string
  first_name: string
  middle_name: string
  last_name: string
  mobile: string
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

export interface TransferHoldingParams {
  from_investor_id: string
  to_investor_id: string
  holding_ids: string[]
}

export interface TransferHoldingResponse {
  statusCode: number
  message: string
  data: {
    transferredHoldings: string[]
  }
}

export interface CoinTransactionResponse {
  transaction_id: string
  gui_transaction_id: string
  account_id: string
  gui_account_id: string
  referee_account_id: string | null
  referrer_account_id: string | null
  referee_order_id: string
  order_id: string | null
  coins: number
  direction: string
  status: string
  reward_type: string
  description: string
  note: string | null
  created_at: string
  updated_at: string
  mobile: string
  first_name: string
  last_name: string
  email: string
}
