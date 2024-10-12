export interface GetAllWebhooksData {
  webhooksResponse: WebhooksResponse[]
  total: number
}

export interface WebhookParams {
  search?: string
  status?: string
  direction?: string
  created_before?: string
  created_after?: string
  limit?: number
  page?: number
}

export interface SESWebhookParams {
  search?: string
  vendor_name?: string
  created_before?: string
  created_after?: string
  limit?: number
  page?: number
  status?: string
}

export interface InteraktWebhookParams {
  created_before?: string
  created_after?: string
  status?: string[]
  type?: string
  search?: string
  callback_data?: string
  limit?: number
  page?: number
}

export interface WebhooksResponse {
  webhook_reponse_id: string
  vendor_transaction_id: string
  vendor_order_id: string | null
  vendor_va_id: string
  bank_reference_number: string
  account_number: string | null
  reference_id: string | null
  balance: string
  amount: string
  status: string
  precize_status: string
  direction: string
  transfer_type: string
  transaction_type: string
  beneficiary_name: string | null
  payee_account_number: string | null
  payee_account_ifsc: string | null
  payer_vpa?: string
  payer_account_ifsc: string | null
  payer_account_number?: string
  payer_mobile_number: string | null
  payer_name: string
  va_name: string
  account_holder_name: string | null
  transaction_message: string | null
  provider_code: string | null
  is_virtual_account: boolean
  callback_transaction_id: string | null
  original_callback_transaction_id: string | null
  note: string | null
  precize_reason: string
  vendor_event: string
  response: ResponseData
  timestamp: string
  vendor_name: string
  provider_name: string
  count: number
  created_at: string
  updated_at: string
}
export interface ResponseData {
  utr: string
  note: string
  type: string
  amount: number
  vaName: string
  SubVaId: string
  createdAt: string
  settle_to: string
  created_by: string
  trx_status: string
  yetToSettle: string
  payment_mode: string
  remiter_ifsc: string
  remiter_name: string
  payment_remark: string
  transcation_id: string
  closing_balance: string
  isVirtualAccount: boolean
  transaction_type: string
  settlement_Amount: string
  SubVaAccountNumber: string
  remiter_account_number: string
}

export interface SESWebhooksResponse {
  statusCode: number
  message: string
  data: SESWebhookData
}

export interface SESWebhookData {
  webhooks: SESWebhook[]
  total: number
  limit: number
  page: number
}

export interface SESWebhook {
  id: string
  vendor_id: string
  type: string
  status?: string
  email?: string
  vendor_name: string
  response: SESResponse
  created_at: string
  updated_at: string
}

export interface SESResponse {
  Type: string
  TopicArn: string
  MessageId: string
  Timestamp: string
  Token?: string
  Signature?: string
  SubscribeURL?: string
  SigningCertURL?: string
  SignatureVersion?: string
}
export interface InteraktWebhooksResponse {
  statusCode: number
  message: string
  data: InteraktWebhookData
}

export interface InteraktWebhookData {
  webhooks: InteraktWebhook[]
  total: number
  limit: number
  page: number
}

export interface InteraktWebhook {
  sent_message_id: string
  vendor_id?: string
  country_code: string
  phone_number?: string
  message_status?: string
  webhook_data: InteraktWebhookDataDetails
  created_at?: string
  updated_at?: string
}

export interface InteraktWebhookDataDetails {
  data: InteraktMessageData
  type: string
  version: string
  timestamp: string
}

export interface InteraktMessageData {
  message: InteraktMessage
  customer: InteraktCustomer
}

export interface InteraktMessage {
  id: string
  message: string
  media_url?: string | null
  meta_data: InteraktMetaData
  campaign_id?: string | null
  seen_at_utc?: string | null
  raw_template: string
  message_status: string
  received_at_utc: string
  delivered_at_utc?: string | null
  chat_message_type: string
  channel_error_code?: string | null
  is_template_message: boolean
  message_content_type: string
  channel_failure_reason?: string | null
}

export interface InteraktMetaData {
  source: string
  source_data: {
    callback_data: string
  }
}

export interface InteraktCustomer {
  id: string
  traits: InteraktCustomerTraits
  country_code: string
  phone_number: string
  channel_phone_number: string
}

export interface InteraktCustomerTraits {
  name: string
  source_id?: string | null
  source_url?: string | null
  whatsapp_opted_in: boolean
}
