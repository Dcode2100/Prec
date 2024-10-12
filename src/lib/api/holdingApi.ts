import { PcHolding } from '../types/getAllPCHoldingsType'
import {
  AccountWiseHoldingData,
  OrdersParams,
  TransactionsParams,
  TransferHoldingParams,
  UpdateHolding,
} from '../types/types'
import axiosInstance, { setInstance } from './axiosInstance'

export const getAllHoldings = async (
  params: OrdersParams
): Promise<{ PE: AccountWiseHoldingData[]; total: number }> => {
  const response = await axiosInstance.get(`/dashboard/holdings/`, {
    params,
  })
  return response?.data?.data
}

export const getAllPcHoldings = async (
  params: TransactionsParams
): Promise<{ holdings: PcHolding[]; total: number }> => {
  const response = await axiosInstance.get(`/dashboard/pc/holdings`, {
    params,
  })
  return response.data.data
}
export const updateHolding = async (
  sold: boolean,
  holding_id: string,
  sellQuantity: string,
  sellPrice: string
) => {
  const response = await axiosInstance.put<UpdateHolding>(
    `dashboard/holdings/${holding_id}`,
    {
      sold: sold,
      sellQuantity: sellQuantity,
      sellPrice: sellPrice,
    }
  )
  return response
}

export const transferHolding = async (
  data: TransferHoldingParams
): Promise<any> => {
  setInstance(axiosInstance)
  try {
    const response = await axiosInstance.post(
      '/dashboard/holdings/transfer',
      data
    )
    return response.data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Transfer holding failed: ${error.message}`)
    }
    return error
  }
}
