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
