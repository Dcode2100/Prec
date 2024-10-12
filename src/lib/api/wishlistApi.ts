import { getGlobalItem } from '@/utils/utils'
import {
  GenericResponse,
  GenericResponseWithMessage,
  GetAllPCWishlistsResponse,
  WishlistsParams,
  WishlistsResponse,
} from '../types/types'
import axiosInstance, { setInstance } from '../api/axiosInstance'

export const getWishlistData = async (
  params: WishlistsParams
): Promise<WishlistsResponse> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get('/dashboard/wishlists', {
    params,
  })
  return response?.data.data
}

export const updateWishlist = async (
  wishlistId: string,
  notified: boolean
): Promise<GenericResponseWithMessage> => {
  const wishlistResponse = await axiosInstance.put(
    `/dashboard/wishlists/${wishlistId}`,
    {
      notified,
    }
  )
  return wishlistResponse.data
}

export const UploadWishlistData = async (
  formData: FormData
): Promise<GenericResponse<{ status: boolean }>> => {
  const response = await axiosInstance.put(`dashboard/wishlists/bulk`, formData)
  return response.data
}

export const getAccountWishlist = async (
  accountId: string,
  type: string,
  params?: any
) => {
  const isAffiliate = getGlobalItem('isAffiliate')
  const res = isAffiliate
    ? await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/nominatorDashboard/accounts/${type}/${accountId}/wishlists`,
        {
          params,
        }
      )
    : await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/accounts/${type}/${accountId}/wishlists`,
        {
          params,
        }
      )
  return res.data?.data?.wishlists
}

export const getAccountPcWishlist = async (accountId: string, params: any) => {
  const res = await axiosInstance.get<GenericResponse<any>>(
    `/dashboard/pc/accounts/${accountId}/wishlists`,
    {
      params,
    }
  )
  return res.data?.data?.wishlists
}
export const getPCWishlistData = async (
  params: WishlistsParams
): Promise<GetAllPCWishlistsResponse> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get('/dashboard/pc/wishlists', {
    params,
  })
  return response?.data.data
}

export const updatePcWishlist = async (
  id: string,
  notified: boolean
): Promise<GenericResponseWithMessage> => {
  const wishlistResponse = await axiosInstance.put(
    `/dashboard/pc/wishlists/${id}`,
    {
      notified,
    }
  )
  return wishlistResponse.data
}

export const UploadPcWishlistData = async (
  formData: FormData
): Promise<GenericResponse<{ status: boolean }>> => {
  const response = await axiosInstance.put(
    `dashboard/pc/wishlists/bulk`,
    formData
  )
  return response.data
}
