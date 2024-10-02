/* eslint-disable */
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
  Message: any
  TopicArn: string
  MessageId: string
  Timestamp: string
  Token?: string
  Signature?: string
  SubscribeURL?: string
  SigningCertURL?: string
  SignatureVersion?: string
}
