export interface ReportsParams {
  type?: string[]
  page?: number
  limit?: number
  createdAfter?: string
  createdBefore?: string
  status?: string[]
  search?: string
}
export type ReportResponseType = {
  reports: Report[]
  total: number
  limit: number
  page: number
  filters: {
    types: FilterType[]
  }
}

export type Report = {
  report_id: string
  type: string
  start_time: string
  end_time: string
  number_of_records: number
  log_file: string
  status: string
  created_at: string
  updated_at: string
}

export type FilterType = {
  label: string
  value: string
  count: number
}
