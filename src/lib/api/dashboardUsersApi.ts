import {
  DashboardUsersResponse,
  DashboardUsersParams,
  PermissionRolesResponse,
  DashboardEventsParams,
  DashboardUserEventsResponseData,
  RolesParams,
} from '@/lib/types/dashboardUserType'
import axiosInstance from './axiosInstance'
import {
  GenericResponseWithMessage,
  LoginResponse,
  SignupResponse,
} from '../types/types'
import { RoleAccountsResponse } from '@/lib/types/dashboardUserType'

export const getAllRoles = async (
  params?: RolesParams
): Promise<PermissionRolesResponse> => {
  const response = await axiosInstance.get(`/dashboard/roles`, { params })

  return response.data.data
}
export const getAllDashboardUsers = async (
  params: DashboardUsersParams
): Promise<DashboardUsersResponse> => {
  const response = await axiosInstance.get(`/dashboard/users`, { params })

  return response.data.data
}
export const logoutDashboardUser = async (
  userId: string
): Promise<GenericResponseWithMessage> => {
  const response = await axiosInstance.get(`/dashboard/users/${userId}/logout`)

  return response.data
}

export const deleteDashboardUser = async (
  userId: string | undefined,
  params: { soft: boolean }
): Promise<GenericResponseWithMessage> => {
  const response = await axiosInstance.delete(`/dashboard/users/${userId}`, {
    params,
  })
  return response.data
}

export const updateDashboardUser = async (
  userId: string,
  payload: { role_id?: string; type?: string }
): Promise<GenericResponseWithMessage> => {
  const response = await axiosInstance.put(
    `/dashboard/users/${userId}`,
    payload
  )
  return response?.data
}

export const confirmSignUp = async (
  accountId: string,
  code: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post(
    `dashboard/auth/${accountId}/confirm`,
    {
      code,
    }
  )
  return response.data
}

export const resendCodeForSignup = async (
  accountId: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.put(
    `/dashboard/auth/${accountId}/resend`
  )
  return response.data
}
export const signup = async (data: {
  first_name: string
  last_name: string
  phone: string
  password: string
}): Promise<SignupResponse> => {
  const response = await axiosInstance.post('/dashboard/auth', {
    ...data,
  })
  return response.data
}

export const getEventByUserId = async (
  userId: string,
  params: DashboardEventsParams
): Promise<DashboardUserEventsResponseData> => {
  const response = await axiosInstance.get(
    `/dashboard/users/${userId}/events`,
    { params }
  )

  return response.data.data
}
export const getAllAccountsByRoleId = async (
  roleId: string,
  params: DashboardUsersParams
): Promise<RoleAccountsResponse | undefined> => {
  const response = await axiosInstance.get(
    `/dashboard/roles/${roleId}/accounts`,
    { params }
  )

  return response.data.data
}
export const createRole = async (payload: {
  name: string
  dashboard: boolean
  accounts: boolean
  manager: boolean
  journey: boolean
  orders: boolean
  transactions: boolean
  accounting: boolean
  reports: boolean
  cms: boolean
  dashboard_users: boolean
  config: boolean
  roles: boolean
}): Promise<GenericResponseWithMessage> => {
  const response = await axiosInstance.post(`/dashboard/roles`, payload)
  return response?.data
}

export const updateRole = async (
  roleId: string,
  payload: {
    name: string
    dashboard: boolean
    accounts: boolean
    manager: boolean
    journey: boolean
    orders: boolean
    transactions: boolean
    accounting: boolean
    reports: boolean
    cms: boolean
    config: boolean
    roles: boolean
  }
): Promise<GenericResponseWithMessage> => {
  const response = await axiosInstance.put(
    `/dashboard/roles/${roleId}`,
    payload
  )
  return response?.data
}

export const deleteRole = async (
  roleId: string
): Promise<GenericResponseWithMessage> => {
  const response = await axiosInstance.delete(`/dashboard/roles/${roleId}`)
  return response?.data
}
