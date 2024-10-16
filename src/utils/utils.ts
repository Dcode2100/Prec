'use client'

import { PCHoldingById } from '@/lib/types/getPCHoldingByIdType'
import { OrderResponse, PennyDropTransactionResponse } from '@/lib/types/types'
import moment from 'moment'
import numeral from 'numeral'

export const setGlobalItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value)) // No need to use optional chaining with JSON
  }
}

export const capitalize = (value: string | undefined, split = true): string => {
  if (!value) return ''
  if (split) value = value.split('_').join(' ')
  return value
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export const getGlobalItem = (key: string) => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(key)

    if (storedValue) {
      try {
        return JSON.parse(storedValue) // Parse the stored JSON string properly
      } catch (error) {
        return null // Handle parsing errors gracefully
      }
    }
  }
  return null
}

export const clearGlobalItem = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
  }
}

export const getNumberInRupee = (
  value: string | number,
  decimal: boolean = false
): string => `₹${numeral(value).format(`0,0${decimal ? '.00' : ''}`)}`

export const ordersToTableRows = (orders: OrderResponse[] | undefined): any => {
  if (!orders) return []
  return orders.map((order: OrderResponse, i) => {
    return [
      i + 1,
      order?.gui_order_id || '',
      order?.gui_account_id || '',
      order?.side || '',
      order?.symbol || '',
      Number(order?.quantity > 0 ? order?.quantity : '0.00'),
      order?.price!,
      order?.status !== 'SUCCESS'
        ? order?.status === 'PENDING'
          ? 'Payment' + ' ' + capitalize(order?.status.split('_').join(' '))
          : order?.status === 'PAYMENT_CONFIRMED'
          ? 'Payment Pending'
          : capitalize(order?.status.split('_').join(' '))
        : 'Completed',
      moment(order?.created_at || ''),
    ]
  })
}

export const pcHoldingsByIdToTableRows = (
  pcHoldings: PCHoldingById[] | undefined
): any => {
  if (!pcHoldings) return []
  return pcHoldings?.map((holding: PCHoldingById) => {
    return [
      holding.gui_id || '',
      capitalize(holding.symbol),
      holding.rate_of_returns,
      holding.tenure,
      holding.subscription_amount,
      holding.min_repayment_amount,
      capitalize(holding?.status?.split('_').join(' ')),
      moment(holding.tentative_end_date),
      moment(holding.created_at),
    ]
  })
}
export const pennyDropTransactionsToTableRows = (
  transactions: PennyDropTransactionResponse[] | undefined
): (any | moment.Moment)[][] => {
  return (transactions || []).map((transaction, i) => [
    i + 1,
    transaction?.gui_account_id,
    transaction?.vendor_transaction_id || '',
    transaction?.payee_account_number || '',
    transaction?.payee_account_ifsc || '',
    capitalize(transaction?.status?.split('_').join(' ')),
    moment(transaction?.created_at || ''),
    moment(transaction?.updated_at || ''),
  ])
}

export const unquotedKeysString = (data: any) => {
  return `[${data
    .map(
      (obj: any) =>
        '{' +
        Object.entries(obj)
          .map(
            ([key, value]) =>
              `${key}: ${value === null ? 'null' : `'${value}'`}`
          )
          .join(', ') +
        '}'
    )
    .join(', ')}]`
}
