import { getGlobalItem } from '@/utils/utils'
import { GenericResponse, WishlistsResponse } from '../types/types'
import axiosInstance, { setInstance } from '../api/axiosInstance'

export const getWishlistData =
  async (params: {}): Promise<WishlistsResponse> => {
    setInstance(axiosInstance)
    const response: any = await axiosInstance.get('/dashboard/wishlists', {
      params,
    })
    return response?.data.data.wishlists
  }

export const updateWishlist = async (
  wishlistId: string,
  body: any
): Promise<any> => {
  try {
    const wishlistResponse: any = await axiosInstance.put(
      `/dashboard/wishlists/${wishlistId}`,
      body
    )
    return wishlistResponse
  } catch (err) {
    if (err instanceof Error) throw new Error(`Update failed. ${err?.message}`)
    return err
  }
}

export const UploadWishlistData = async (formData: any): Promise<any> => {
  const response: any = await axiosInstance.put(
    `dashboard/wishlists/bulk`,
    formData
  )
  return response
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
  );
  return res.data?.data?.wishlists;

}