import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/lib/redux/store'

interface Permissions {
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
}

export interface UserState {
  isAuthenticated: boolean
  account_id: string | null
  app_key: string | null
  auth_type: string | null
  type: string | null
  role_id: string | null
  role_name: string | null
  permissions: Permissions | null
}

const initialState: UserState = {
  isAuthenticated: false,
  account_id: null,
  app_key: null,
  auth_type: null,
  type: null,
  role_id: null,
  role_name: null,
  permissions: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<Omit<UserState, 'isAuthenticated'>>
    ) => {
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      }
    },
    logout: () => {
      return initialState
    },
    updatePermissions: (state, action: PayloadAction<Permissions>) => {
      state.permissions = action.payload
    },
  },
})

export const { login, logout, updatePermissions } = userSlice.actions

export const user = (state: RootState) => state

export default userSlice.reducer
