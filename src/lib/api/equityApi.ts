import { GenericResponse } from '../types'
import { BulkPeTransactionsResponse } from '../types/bulkPeType'
import {
  assetsPeResponse,
  createPeAssetType,
  GenericResponseWithMessage,
  getPeAssetsResponse,
} from '../types/types'
import axiosInstance, { setInstance } from './axiosInstance'

interface getPeParams {
  page: number
  limit: number
  search?: string
  state?: string
}
export const getPeAssets = async (
  params: getPeParams
): Promise<getPeAssetsResponse> => {
  const response = await axiosInstance.get(`/dashboard/assets`, { params })
  setInstance(axiosInstance)
  return response.data.data
}
export const getAssetById = async (
  token: string
): Promise<assetsPeResponse> => {
  setInstance(axiosInstance)

  const response = await axiosInstance.get<GenericResponse<assetsPeResponse>>(
    `/dashboard/assets/${token}`
  )
  return response.data?.data
}
export const createPeAsset = async (
  body: createPeAssetType
): Promise<GenericResponseWithMessage> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.post('/dashboard/assets', body)

  return response?.data
}
export const updateAnAsset = async (
  assetId: string,
  body: createPeAssetType
): Promise<GenericResponseWithMessage> => {
  setInstance(axiosInstance)

  const assetResponse = await axiosInstance.put(
    `/dashboard/assets/${assetId}/update`,
    body
  )
  return assetResponse.data
}

export const UploadBulkAssets = async (
  formData: FormData
): Promise<BulkPeTransactionsResponse> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.put(
    `/dashboard/assets/pe/bulk/upload`,
    formData
  )
  return response?.data
}
