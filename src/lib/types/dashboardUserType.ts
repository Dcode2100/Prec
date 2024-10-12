export interface DashboardEventsParams {
  action?: string[]
  account_id?: string[]
  search?: string
  createdBefore?: string
  createdAfter?: string
  limit?: number
  page?: number
}
export interface DashboardUserEventsResponseData {
  events: DashboardUserEvent[]
  filters: { actions: { label: string; value: string; count: number }[] }
  total: number
  page: number
  limit: number
}
export interface DashboardUserEvent {
  id: string
  account_id: string
  action: string
  phone: string
  first_name: string
  last_name: string
  device_info: DeviceInfo
  ip_address: string
  login: boolean
  created_at: string
  updated_at: string
}
export interface DeviceInfo {
  os: Os
  ua: string
  device: Device
  engine: Engine
  browser: Browser
}
export interface DeviceInfo {
  os: Os
  ua: string
  device: Device
  engine: Engine
  browser: Browser
}

export interface Os {
  name: string
  version: string
}

export interface Device {
  model: string
  vendor: string
}

export interface Engine {
  name: string
  version: string
}

export interface Browser {
  name: string
  major: string
  version: string
}
export interface RolesParams {
  search?: string
  limit?: number
  page?: number
  created_after?: string
  created_before?: string
}
export interface PermissionRolesResponse {
  roles: PermissionRole[]
  total: number
  limit: number
  page: number
}
export interface PermissionRole {
  id: string
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
  users: boolean
  roles: boolean
  access: number
  totalAccess: number
  totalAccounts: number
}

export interface DashboardUsersParams {
  search?: string
  verified?: boolean
  limit?: number
  page?: number
  createdAfter?: string
  createdBefore?: string
}
export interface DashboardUsersResponse {
  dashboard_users: DashboardUser[]
  total: number
  limit: number
  page: number
}
export interface DashboardUser {
  account_id: string
  role_id: string
  partner_key: string
  aws_account_id: string
  first_name: string
  last_name: string
  phone: string
  email: string
  verified: boolean
  platform: string
  created_at: string
  last_logged_in_at: string
  updated_at: string
  type: string
}
export interface DashboardUserConfigResponse {
  type: string
  role: string
  permissions: PermissionRole
}
export interface RoleAccountsResponse {
  accounts: RoleAccounts[]
  role: PermissionRole
  total: number
  limit: number
  page: number
}

export interface RoleAccounts {
  id: string
  account_id: string
  partner_key: string
  role_id: string
  role: string
  email: string
  phone: string
  user_name: string
  first_name: string
  last_name: string
  verified: string
  mfa_active: string
  type: string
  plateform: string
  delete: string
  last_logged_in_at: string
  created_at: string
  updated_at: string
}
