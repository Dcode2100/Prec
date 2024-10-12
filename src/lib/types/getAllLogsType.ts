export interface GetAllLogsData {
  statusCode: number
  message: string
  data: LogsData
}

export interface LogsData {
  logs: Log[]
  total: number
  limit: number
  page: number
}

export interface Log {
  id: string
  user_id: string
  url: string
  type: string
  log: string
  created_at: string
  updated_at: string
  gui_account_id: string
  email: string
  full_name: string
}

export interface LogsParams {
  page?: number
  limit?: number
  search?: string
  created_after?: string
  created_before?: string
  type?: string
}
