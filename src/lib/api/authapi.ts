
import { clearGlobalItem, getGlobalItem, setGlobalItem } from '@/utils/utils'
import axiosInstance, { setInstance } from './axiosInstance'


let appKey = getGlobalItem('chace-app-key')
let dashboardAccountId = getGlobalItem('dashboard-account-id')

const login = async (phone: string, password: string, platform: string) => {
  const response = await axiosInstance.post('/dashboard/auth/signIn', {
    phone,
    password,
    platform,
  })
  if (response.status === 200) {
    setGlobalItem('dashboard-account-id', response.data.data.account_id)
    setGlobalItem('phone', phone)
    setGlobalItem('platform', 'CHACE')
  }
  return response
}

const confirmOtp = async (
  verificationCode: string,
  password: string,
  platform: string
) => {
  dashboardAccountId = getGlobalItem('dashboard-account-id')
  const response = await axiosInstance.post(
    `/dashboard/auth/signIn/${dashboardAccountId}/confirm`,
    {
      verificationCode,
      password,
      platform,
    }
  )
  if (response.status === 200) {
    appKey = response?.data?.data?.app_key || process.env.CHACE_APP_KEY
    dashboardAccountId = response?.data?.data?.account_id

    setGlobalItem('chace-app-key', appKey)
    setGlobalItem('dashboard-account-id', dashboardAccountId)
    setInstance(axiosInstance)
  }
  return response
}

const refreshAccessToken = async () => {
  const dashboardAccountId = getGlobalItem('dashboard-account-id')
  const phone = getGlobalItem('phone')
  const platform = getGlobalItem('platform')
  const response = await axiosInstance.post(
    `/dashboard/auth/${dashboardAccountId}/refreshAccessToken`,
    {
      phone,
      platform,
    }
  )
  return response
}
const getAllAccounts = () => axiosInstance.get('/dashboard/assets')

const logout = async () => {
  const dashboardAccountId = getGlobalItem('dashboard-account-id')
  await axiosInstance.get(`/dashboard/auth/${dashboardAccountId}/logout`)
  clearGlobalItem()
}

const authApi = {
  login,
  confirmOtp,
  refreshAccessToken,
  getAllAccounts,
  logout,
}

export default authApi
