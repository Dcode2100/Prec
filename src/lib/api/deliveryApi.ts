import { GenericResponseWithMessage } from '../types/auth'
import { GetPCDeliveryAnalyticsResponse } from '../types/pcDeliveryType'
import {
  AnalyticsDataResponse,
  OrderResponse,
  OrdersParams,
  UsersPanPendingResponse,
} from '../types/types'
import axiosInstance, { setInstance } from './axiosInstance'

export const getDeliveryAnalyticsData = async (
  params: OrdersParams
): Promise<AnalyticsDataResponse> => {
  const response = await axiosInstance.get('/dashboard/analytics/deliveries', {
    params,
  })
  return response.data?.data
}
export const getPCDeliveryAnalyticsData = async (
  params: OrdersParams
): Promise<GetPCDeliveryAnalyticsResponse> => {
  const response = await axiosInstance.get(
    '/dashboard/pc/analytics/deliveries',
    { params }
  )
  return response.data
}
export const getDeliveryByStatus = async (
  status: string,
  params: OrdersParams
): Promise<{ PE: OrderResponse[]; total: number }> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get(
    `/dashboard/analytics/deliveries/${status}`,
    { params }
  )
  return response.data?.data
}
export const getCDSLDeliveriesAnalyticsData = async (
  params: OrdersParams
): Promise<OrderResponse[]> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get(
    `/dashboard/analytics/deliveries/cdsl`,
    { params }
  )
  return response.data?.data.PE
}

export const getNSDLDeliveriesAnalyticsData = async (
  params: OrdersParams
): Promise<OrderResponse[]> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get(
    `/dashboard/analytics/deliveries/nsdl`,
    { params }
  )
  return response.data?.data.PE
}

export const getCdslData = async (
  fileName: string,
  token: string,
  type: string,
  params: OrdersParams
): Promise<OrderResponse> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get(
    `/dashboard/analytics/deliveries/${type}/export?token=${token}&fileName=${fileName}`,
    { params }
  )
  return response.data?.data
}

export const getPanPendingUsersAnalyticsData = async (
  params: OrdersParams
): Promise<{ users: UsersPanPendingResponse[]; total: number }> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get(
    `/dashboard/analytics/deliveries/pan`,
    { params }
  )
  return response.data?.data
}

export const UploadBulkPanDocument = async (
  formData: FormData
): Promise<GenericResponseWithMessage> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.put(
    `/dashboard/analytics/deliveries/pan/bulk`,
    formData
  )
  return response?.data
}
