import { GenericResponse } from '../types'

import axiosInstance from './axiosInstance'

export const createConfig = async (payload: any) => {
  const response = await axiosInstance.post<GenericResponse<any>>(
    `/dashboard/config`,
    payload
  )
  return response
}

export const updateConfig = async (payload: any) => {
  const response = await axiosInstance.put<GenericResponse<any>>(
    `/dashboard/config`,
    payload
  )
  return response
}

export const getAllConfig = async (params: {}): Promise<any> => {
  try {
    const response: any = await axiosInstance.get(`/dashboard/config`, {
      params,
    })
    return response?.data?.data
  } catch (err) {
    return err
  }
}
