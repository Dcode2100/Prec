import {
  OrdersParams,
  UserAnalyticsDataResponse,
  WaitlistResponse,
} from '../types/types'
import axiosInstance from './axiosInstance'

export const getAquisitionAnalyticsData = async (
  params: OrdersParams
): Promise<UserAnalyticsDataResponse> => {
  const response = await axiosInstance.get('/dashboard/analytics/waitlists', {
    params,
  })
  return response.data?.data
}
export const getAquisitionAnalyticsDataByStatus = async (
  slug: string,
  params: OrdersParams
): Promise<{ PE: WaitlistResponse[]; total: number }> => {
  const response = await axiosInstance.get(
    `/dashboard/analytics/waitlists/${slug}`,
    {
      params,
    }
  )
  return response.data?.data
}
