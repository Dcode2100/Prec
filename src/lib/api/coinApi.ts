import axiosInstance from '@/lib/api/axiosInstance'
import { GenericResponse } from '@/lib/types'
import { TransactionsParams } from '@/lib/types/types'
import { Data, Pe, WalletTransactionsResponse } from '../types/walletType'

export const manualCoinTransfer = async (coins: number, accountId: string) => {
  const res = await axiosInstance.post(
    `/dashboard/coins/accounts/${accountId}`,
    {
      coins,
    }
  )
  return res
}

export const manualCoinWithdraw = async ({
  accountId,
  coins,
  note,
}: {
  accountId: string
  coins: number
  note: string
}) => {
  const res = await axiosInstance.post(
    `/dashboard/coins/debit/accounts/${accountId}`,
    {
      coins,
      note,
    }
  )
  return res
}

export const getCoinTransactionsById = async (
  accountId: string,
  type: string,
  params: TransactionsParams
) => {
  const res = await axiosInstance.get<GenericResponse>(
    `/dashboard/coins/PE/accounts/${accountId}`,
    {
      params,
    }
  )
  return res?.data?.data
}

export const getAllCoinTransactions = async (
  params: TransactionsParams
): Promise<Data | undefined> => {
  const response = await axiosInstance.get<WalletTransactionsResponse>(
    `/dashboard/coins`,
    {
      params,
    }
  )
  const peTransactions = response?.data?.data?.PE.map((transaction) => {
    return {
      ...transaction,
      type: 'PE',
    }
  })
  const transactions: Pe[] = [...peTransactions].sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  )
  return {
    PE: transactions,
    total: response?.data?.data?.total,
    credit_amount: '',
    debit_amount: '',
    order_amount: '',
    withdraw_amount: '',
    wallet_balance: '',
  }
}
