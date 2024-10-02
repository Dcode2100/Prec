import {
  GenericResponseWithMessage,
  mediaResponsePe,
  TradeReport,
} from '../types/types'
import axiosInstance, { setInstance } from './axiosInstance'

export const uploadDocumentByPcAssetId = async (
  accountId: string,
  body: FormData
): Promise<TradeReport> => {
  const response = await axiosInstance.post(
    `/dashboard/pc/assets/${accountId}/upload`,
    body
  )
  return response.data?.data
}
export const UploadAssetDocuments = async (
  token: string,
  formData: FormData
): Promise<mediaResponsePe> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.post(
    `/dashboard/assets/${token}/upload`,
    formData
  )
  return response?.data
}
export const UploadCSVDocuments = async (
  formData: FormData,
  status: string
): Promise<GenericResponseWithMessage> => {
  setInstance(axiosInstance)
  const response =
    status === 'PCACTIVE'
      ? await axiosInstance.put(`dashboard/accounts/pc-active/bulk`, formData)
      : status === 'repay'
      ? await axiosInstance.post(`dashboard/pc/holdings/repay`, formData)
      : status === 'SUBSCRIPTION_PROCESSED'
      ? await axiosInstance.put(
          `/dashboard/pc/orders/update/${status}`,
          formData
        )
      : status === 'LOCKED'
      ? await axiosInstance.put(`/dashboard/orders/PE/nse/${status}`, formData)
      : await axiosInstance.put(
          `/dashboard/orders/PE/update/${status}`,
          formData
        )
  return response?.data
}
export const uploadPdf = async (
  orderId: string,
  formData: FormData
): Promise<GenericResponseWithMessage> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.post(
    `/dashboard/orders/${orderId}`,
    formData
  )
  return response?.data
}
export const sendEmail = async (
  accountId: string
): Promise<GenericResponseWithMessage> => {
  setInstance(axiosInstance)
  const res = await axiosInstance.post(`/dashboard/waitlist/${accountId}`)
  return res.data
}
