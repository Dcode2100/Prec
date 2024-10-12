import {
  DashboardEventsParams,
  DashboardUserEventsResponseData,
} from '../types/dashboardUserType'
import { CronData, CronDetailsParams } from '../types/getAllCronType'
import { LogsData, LogsParams } from '../types/getAllLogsType'
import { ReportResponseType, ReportsParams } from '../types/reportType'
import {
  GetAllWebhooksData,
  InteraktWebhookData,
  InteraktWebhookParams,
  SESWebhookData,
  SESWebhookParams,
  WebhookParams,
} from '../types/webhooksType'
import axiosInstance, { setInstance } from './axiosInstance'

export const getAllWebhooks = async (
  params: WebhookParams
): Promise<GetAllWebhooksData> => {
  const response = await axiosInstance.get(`/dashboard/webhooks`, {
    params,
  })
  return response?.data?.data
}
export const getAllSESWebhooks = async (
  params: SESWebhookParams
): Promise<SESWebhookData> => {
  const response = await axiosInstance.get(`/dashboard/webhooks/ses`, {
    params,
  })

  return response?.data?.data
}
export const getAllInteraktWebhooks = async (
  params: InteraktWebhookParams
): Promise<InteraktWebhookData> => {
  const response = await axiosInstance.get(`/dashboard/webhooks/interakt`, {
    params,
  })
  return response?.data?.data
}

export const getCronDetails = async (
  params: CronDetailsParams
): Promise<CronData> => {
  const response = await axiosInstance.get(`dashboard/cron`, {
    params,
  })
  return response.data.data
}

export const getReports = async (
  params: ReportsParams
): Promise<ReportResponseType> => {
  setInstance(axiosInstance)
  const reportsResponse = await axiosInstance.get('/dashboard/reports', {
    params,
  })
  return reportsResponse.data.data
}

export const getDashboardEvents = async (
  params?: DashboardEventsParams
): Promise<DashboardUserEventsResponseData> => {
  const response = await axiosInstance.get(`/dashboard/events`, { params })

  return response.data.data
}
export const getLogs = async (params: LogsParams): Promise<LogsData> => {
  const response = await axiosInstance.get(`dashboard/logs`, {
    params,
  })
  return response.data.data
}
