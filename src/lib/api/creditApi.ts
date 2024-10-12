import {
  createPcAssetType,
  GenericResponse,
  GenericResponseWithMessage,
  PcAsset,
  PcAssetsResponseData,
} from '../types/types'
import axiosInstance, { setInstance } from './axiosInstance'

interface getPcParams {
  page: number
  limit: number
  search?: string
  status?: string
}
export const createPcAsset = async (
  body: createPcAssetType
): Promise<GenericResponseWithMessage> => {
  setInstance(axiosInstance)
  const assetResponse = await axiosInstance.post(`/dashboard/pc/assets`, body)
  return assetResponse.data
}
export const updatePcAsset = async (
  assetId: string,
  body: createPcAssetType
): Promise<GenericResponseWithMessage> => {
  setInstance(axiosInstance)
  const assetResponse = await axiosInstance.put(
    `/dashboard/pc/assets/${assetId}`,
    body
  )
  return assetResponse.data
}
export const getAllPcAssets = async (
  params: getPcParams
): Promise<PcAssetsResponseData> => {
  setInstance(axiosInstance)
  const assetResponse = await axiosInstance.get('/dashboard/pc/assets', {
    params,
  })

  return assetResponse?.data?.data
}
export const getPcAssetById = async (assetId: string): Promise<PcAsset> => {
  setInstance(axiosInstance)
  const assetResponse = await axiosInstance.get(
    `/dashboard/pc/assets/${assetId}`
  )

  return assetResponse?.data?.data
}

export const getAllCategoriesOptionList =
  async (): Promise<GenericResponse> => {
    setInstance(axiosInstance)
    const response = await axiosInstance.get(`/dashboard/pc/categories/list`)
    return response?.data
  }
