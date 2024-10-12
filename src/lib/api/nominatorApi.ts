import {
  AccountsParams,
  GenericResponseWithMessage,
  NominatorAccounts,
  NominatorsParams,
  NominatorsResponse,
} from '../types/types'
import axiosInstance, { setInstance } from './axiosInstance'

export const getNominatorData = async (
  params: NominatorsParams
): Promise<NominatorsResponse> => {
  setInstance(axiosInstance)
  const nominatorResponse = await axiosInstance.get('/dashboard/nominators/', {
    params,
  })
  return nominatorResponse?.data.data
}
export const createNominator = async (
  data: FormData
): Promise<GenericResponseWithMessage> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.post(`/dashboard/nominators`, data)
  return response?.data
}

export const updateNominator = async (
  nominatorId: string,
  data: FormData
): Promise<GenericResponseWithMessage> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.put(
    `/dashboard/nominators/${nominatorId}`,
    data
  )
  return response?.data
}
export const getNominatorAccount = async (
  accountId: string,
  params: AccountsParams
): Promise<NominatorAccounts> => {
  setInstance(axiosInstance)
  const res = await axiosInstance.get(
    `/dashboard/nominators/${accountId}/accounts`,
    { params }
  )
  return res.data?.data
}
