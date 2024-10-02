import axiosInstance, { setInstance } from '@/lib/api/axiosInstance'
import { getGlobalItem } from '@/utils/utils'
import {
  AccountResponse,
  GenericResponse,
  PeFundsDataInterface,
  WalletTransactionsParams,
} from '@/lib/types/types'
import {
  AccountsParams,
  AccountsResponse,
  GetAccountsResponse,
  GetAllAccountsResponse,
  GetAllNominatorAccountsResponse,
  GetAccountWalletTransactionsbyIdResponse,
} from '@/lib/types/types'
import { CreateVirtualAccountResponse } from '../types/walletType'

export const getAccount = async (type: string, accountId: string) => {
  if (accountId.length === 0 || type.length === 0) return
  setInstance(axiosInstance)
  const isAffiliate = getGlobalItem('isAffiliate')
  const res = isAffiliate
    ? await axiosInstance.get(
        `/dashboard/nominatorDashboard/accounts/${type}/${accountId}`
      )
    : await axiosInstance.get(`/dashboard/accounts/${type}/${accountId}`)

  return res.data?.data
}

export const getAccounts = async (
  params: AccountsParams
): Promise<AccountsResponse | undefined> => {
  setInstance(axiosInstance)
  const isAffiliate = getGlobalItem('isAffiliate')

  if (!isAffiliate) {
    const res = await axiosInstance.get<
      GenericResponse<GetAllAccountsResponse>
    >('/dashboard/accounts', { params })

    if (!res.data?.data) {
      return
    }

    const peAccounts = res.data.data.PE.map((account) => {
      return {
        ...account,
        type: 'PE',
      }
    })
    const accounts: AccountResponse[] = [...peAccounts].sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    )

    return { accounts, total: res?.data?.data?.total }
  } else {
    const res = await axiosInstance.get<
      GenericResponse<GetAllNominatorAccountsResponse>
    >(`/dashboard/nominatorDashboard/accounts`, { params })

    const peAccounts = res.data.data.PE.map((account) => {
      return {
        ...account,
        type: 'PE',
      }
    })

    const accounts: AccountResponse[] = [...peAccounts].sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    )

    return { accounts, total: res?.data?.data?.total }
  }
}

export const getAccountFunds = async (accountId: string) => {
  const isAffiliate = getGlobalItem('isAffiliate')
  const res = isAffiliate
    ? await axiosInstance.get<GenericResponse<PeFundsDataInterface>>(
        `/dashboard/nominatorDashboard/accounts/${accountId}/funds`
      )
    : await axiosInstance.get<GenericResponse<PeFundsDataInterface>>(
        `/dashboard/accounts/${accountId}/funds`
      )

  return res.data?.data
}

export const getAccountHoldings = async (accountId: string, type: string) => {
  const isAffiliate = getGlobalItem('isAffiliate')

  const res = isAffiliate
    ? await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/nominatorDashboard/accounts/${type}/${accountId}/holdings`
      )
    : await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/accounts/${type}/${accountId}/holdings`
      )

  return res.data?.data?.holdings
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

export const getAccountReferral = async (accountId: string, type: string) => {
  const isAffiliate = getGlobalItem('isAffiliate')
  const res = isAffiliate
    ? await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/nominatorDashboard/accounts/${accountId}/referrals`,
        { params: { page: 1, limit: 100 } }
      )
    : await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/accounts/${accountId}/referrals`,
        { params: { page: 1, limit: 100 } }
      )
  return res.data?.data
}

export const getAccountWalletTransactions = async (
  accountId: string,
  type: string,
  params: WalletTransactionsParams
) => {
  const isAffiliate = getGlobalItem('isAffiliate')
  const res = isAffiliate
    ? await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/nominatorDashboard/accounts/${accountId}/walletTransactions`,
        {
          params,
        }
      )
    : await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/accounts/${accountId}/walletTransactions`,
        {
          params,
        }
      )
  return res.data?.data
}

export const getAccountsByAccountId = async (
  accountId: string,
  params: { page: number; limit: number }
): Promise<GetAccountsResponse> => {
  setInstance(axiosInstance)
  const response: any = await axiosInstance.get(
    `/dashboard/nominators/${accountId}/account/`,
    { params }
  )
  return response
}

//   export const getAccountData = async (params: {}): Promise<AccountsResponse> => {
//     setInstance(axiosInstance);
//     const response: any = isAffiliate
//       ? await axiosInstance.get(`/dashboard/nominatorDashboard/accounts/`, { params })
//       : await axiosInstance.get("/dashboard/accounts", { params });
//     return response?.data.data.PE;
//   };

export const getAccountWalletTransactionsById = async (
  transaction_id: string
): Promise<any> => {
  const response = await axiosInstance.get<
    GenericResponse<GetAccountWalletTransactionsbyIdResponse>
  >(`/dashboard/wallets/transactions/PE/${transaction_id}`)
  return response.data.data
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

export const updateAnAccount = async (
  accountId: string,
  body: any
): Promise<any> => {
  setInstance(axiosInstance)
  const isAffiliate = getGlobalItem('isAffiliate')
  const response: any = isAffiliate
    ? await axiosInstance.put(
        `/dashboard/nominatorDashboard/accounts/${accountId}`,
        body
      )
    : await axiosInstance.put(`/dashboard/accounts/${accountId}`, body)
  return response?.data
}

export const getPCHoldingsByAccId = async (accountId: string) => {
  const res = await axiosInstance.get<GenericResponse<any>>(
    `/dashboard/pc/accounts/${accountId}/holdings`
  )

  return res.data?.data?.holdings
}


export const getWalletByAccountId = async (accountId: string, params: {}) => {
  return await axiosInstance.get(`/dashboard/wallets/accounts/${accountId}`, {
    params,
  });
};

export const createVirtualAccount = async (accountId: string): Promise<any> => {
  setInstance(axiosInstance);
  const createWalletResponse: CreateVirtualAccountResponse =
    await axiosInstance.post(`/dashboard/accounts/${accountId}/wallet`);
  return createWalletResponse?.data;
};