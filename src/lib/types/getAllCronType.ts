export interface CronDetailsParams {
  page?: number
  limit?: number
  created_after?: string
  created_before?: string
  status?: 'Failed' | 'Started' | 'Completed' | ''
}

export interface GetAllCronData {
  statusCode: number
  message: string
  data: CronData
}

export interface CronData {
  records: CronRecord[]
  total: any
  page: number
  limit: number
}

export interface CronRecord {
  cron_id: string
  cron_name: string
  start_time: string
  end_time: string
  status: string
  reason: any
  statistics: any
}
