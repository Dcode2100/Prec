import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios'
import { clearGlobalItem, getGlobalItem } from '@/utils/utils'
import authApi from './authapi'

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'chace-app-key':
      getGlobalItem('chace-app-key') || process.env.CHACE_APP_KEY,
    'dashboard-account-id': getGlobalItem('dashboard-account-id'),
  },
})

// Request interceptor for adding auth headers and tokens
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Retrieve tokens and account information
    config.withCredentials = true
    const appKey =
      getGlobalItem('chace-app-key') || process.env.NEXT_PUBLIC_CHACE_APP_KEY
    const dashboardAccountId = getGlobalItem('dashboard-account-id')

    // Set headers if they are not already set
    config.headers = config.headers || {}
    config.headers['chace-app-key'] = appKey
    config.headers['dashboard-account-id'] = dashboardAccountId

    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

// function axiosToCurl(config: AxiosRequestConfig): string {
//   const { baseURL, url, headers, data, params } = config
//   const headerStrings = Object.entries(headers || {}).map(
//     ([key, value]) => `-H '${key}: ${value}'`
//   )
//   let curlCommand = `curl '${
//     (baseURL || '') +
//     (url || '') +
//     (params
//       ? `?${new URLSearchParams(params as Record<string, string>).toString()}`
//       : '')
//   }'\\ \n${headerStrings.join('\\ \n')}`
//   if (data) {
//     curlCommand += ` -d '${JSON.stringify(data)}'`
//   }
//   return curlCommand
// }

let isRefreshing = false
let refreshPromise: Promise<AxiosResponse<{ key: string }>> | null = null

axiosInstance.interceptors.response.use(
  undefined,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        refreshPromise = authApi.refreshAccessToken()
      }

      try {
        const newToken = await refreshPromise
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        clearGlobalItem()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
        refreshPromise = null
      }
    }

    // let info = 'Hey, something just broke'
    // if (error.config?.baseURL) {
    //   info += ` at ${error.config.baseURL}`
    // }
    // if (error.config?.url) {
    //   info += error.config.url
    // }
    // if (error.config?.params) {
    //   info += `?${new URLSearchParams(
    //     error.config.params as Record<string, string>
    //   ).toString()}`
    // }

    // const context = ``
    // const curlData = `${axiosToCurl(error.config as AxiosRequestConfig)}`
    // const responseData = `${JSON.stringify(error.response?.data)}`

    if (error.response?.status) {
    }

    return Promise.reject(error)
  }
)

export const setInstance = (instance: AxiosInstance): void => {
  instance.defaults.headers['chace-app-key'] =
    getGlobalItem('chace-app-key') || process.env.CHACE_APP_KEY
  instance.defaults.headers['dashboard-account-id'] = getGlobalItem(
    'dashboard-account-id'
  )
}

export default axiosInstance