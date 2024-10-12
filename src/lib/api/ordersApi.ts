import { getGlobalItem } from '@/utils/utils'
import {
  AnalyticsDataResponse,
  AssetsForPC,
  AssetsParams,
  GenericResponse,
  GenericResponseWithMessage,
  GetAllNominatorOrders,
  GetAllOrders,
  GetArohResponse,
  GetOrdersResponse,
  OrderDetailResponse,
  OrderResponse,
  OrdersParams,
  TokenResponse,
  UpdateHolding,
} from '../types/types'
import axiosInstance, { setInstance } from './axiosInstance'
import { PCOrderResponse, PCOrdersDetailResponse } from '../types/PcEnquiryType'

export const getOrders = async (
  params: OrdersParams
): Promise<GetOrdersResponse | undefined> => {
  setInstance(axiosInstance)
  const isAffiliate = getGlobalItem('isAffiliate')

  if (!isAffiliate) {
    const response = await axiosInstance.get<GenericResponse<GetAllOrders>>(
      `/dashboard/orders`,
      {
        params,
      }
    )

    const peOrders = response?.data?.data?.PE.map((order) => {
      return {
        ...order,
        type: 'PE',
      }
    })
    const orders: OrderResponse[] = [...peOrders].sort((a, b) => {
      return b.created_at.localeCompare(a.created_at)
    })

    return { orders, total: response?.data?.data?.total }
  } else {
    const response = await axiosInstance.get<
      GenericResponse<GetAllNominatorOrders>
    >(`/dashboard/nominatorDashboard/orders`, {
      params,
    })
    const peOrders = response?.data?.data?.PE.map((order) => {
      return {
        ...order,
        type: 'PE',
      }
    })
    const orders: OrderResponse[] = [...peOrders].sort((a, b) => {
      return b.created_at.localeCompare(a.created_at)
    })

    return { orders, total: response?.data?.data?.total }
  }
}

export const getPCOrders = async (params: OrdersParams) => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get<PCOrderResponse>(
    `/dashboard/pc/orders`,
    {
      params,
    }
  )

  return response?.data?.data
}

export const getSellOrders = async (
  params: OrdersParams
): Promise<GetOrdersResponse | undefined> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get<
    GenericResponse<GetAllNominatorOrders>
  >(`/dashboard/orders/sell`, {
    params,
  })
  const peOrders = response?.data?.data?.PE.map((order) => {
    return {
      ...order,
      type: 'PE',
    }
  })
  const orders: OrderResponse[] = [...peOrders].sort((a, b) => {
    return b.created_at.localeCompare(a.created_at)
  })

  return { orders, total: response?.data?.data?.total }
}

export const getArohOrders = async (
  params: OrdersParams
): Promise<GetOrdersResponse | undefined> => {
  setInstance(axiosInstance)

  const response = await axiosInstance.get<GenericResponse<GetAllOrders>>(
    `/dashboard/aroh/orders`,
    {
      params,
    }
  )

  const flOrders = response?.data?.data?.orders.map((order) => {
    return {
      ...order,
      type: 'FL',
    }
  })
  const orders: OrderResponse[] = [...flOrders].sort((a, b) => {
    return b.created_at.localeCompare(a.created_at)
  })
  return { orders, total: response?.data?.data?.total }
}

export const getOrdersByAccountId = async (
  accountId: string,
  params: OrdersParams,
  type: string
): Promise<GetOrdersResponse | undefined> => {
  setInstance(axiosInstance)
  const isAffiliate = getGlobalItem('isAffiliate')
  if (isAffiliate) {
    const response = await axiosInstance.get<GenericResponse<any>>(
      `/dashboard/nominatorDashboard/orders/${type}/account/${accountId}`,
      { params }
    )

    const peOrders = response.data.data.PE.map((order: any) => {
      return {
        ...order,
        type: 'PE',
      }
    })
    const orders = [...peOrders]

    return { orders, total: response?.data?.data?.total }
  } else {
    const response = await axiosInstance.get<GenericResponse<any>>(
      `/dashboard/orders/${type}/account/${accountId}`,
      { params }
    )

    const peOrders = response.data.data.PE.map((order: any) => {
      return {
        ...order,
        type: 'PE',
      }
    })
    const orders = [...peOrders]

    return { orders, total: response?.data?.data?.total }
  }
}

export const getPCOrdersByAccountId = async (
  accountId: string,
  params: OrdersParams
) => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get<PCOrderResponse>(
    `/dashboard/pc/accounts/${accountId}/orders`,
    {
      params,
    }
  )

  return response?.data?.data
}
export const getSellOrdersByAccountId = async (
  accountId: string,
  params: OrdersParams,
  type: string
): Promise<GetOrdersResponse | undefined> => {
  setInstance(axiosInstance)
  const isAffiliate = getGlobalItem('isAffiliate')
  if (isAffiliate) {
    const response = await axiosInstance.get<GenericResponse<any>>(
      `/dashboard/orders/sell/${type}/account/${accountId}`,
      { params }
    )

    const peOrders = response.data.data.PE.map((order: any) => {
      return {
        ...order,
        type: 'PE',
      }
    })
    const orders = [...peOrders]

    return { orders, total: response?.data?.data?.total }
  } else {
    const response = await axiosInstance.get<GenericResponse<any>>(
      `/dashboard/orders/sell/${type}/account/${accountId}`,
      { params }
    )

    const peOrders = response.data.data.PE.map((order: any) => {
      return {
        ...order,
        type: 'PE',
      }
    })
    const orders = [...peOrders]

    return { orders, total: response?.data?.data?.total }
  }
}
export const getArohOrdersByAccountId = async (
  accountId: string,
  params: OrdersParams,
  type: string
): Promise<GetArohResponse | undefined> => {
  setInstance(axiosInstance)
  const isAffiliate = getGlobalItem('isAffiliate')

  const response = isAffiliate
    ? await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/nominatorDashboard/orders/AROH/account/${accountId}`,
        { params }
      )
    : await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/orders/AROH/account/${accountId}`,
        { params }
      )

  const flOrders = response.data.data.AROH.map((order: any) => {
    return {
      ...order,
      type: 'FL',
    }
  })
  const AROH = [...flOrders]

  return { AROH, total: response?.data?.data?.total }
}

export const getOrdersById = async (
  order_id: string,
  type: any
): Promise<any> => {
  setInstance(axiosInstance)
  const isAffiliate = getGlobalItem('isAffiliate')

  const response = isAffiliate
    ? await axiosInstance.get<GenericResponse<OrderDetailResponse>>(
        `/dashboard/nominatorDashboard/orders/${type}/${order_id}`
      )
    : await axiosInstance.get<GenericResponse<OrderDetailResponse>>(
        `/dashboard/orders/${type}/${order_id}`
      )

  return response.data?.data
}

export const getPCOrdersById = async (order_id: string): Promise<any> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get<
    GenericResponse<PCOrdersDetailResponse>
  >(`/dashboard/pc/orders/${order_id}`)

  return response.data?.data
}

export const getSellOrdersById = async (
  order_id: string,
  type: any
): Promise<any> => {
  setInstance(axiosInstance)
  const isAffiliate = getGlobalItem('isAffiliate')

  const response = isAffiliate
    ? await axiosInstance.get<GenericResponse<OrderDetailResponse>>(
        `/dashboard/orders/sell/${type}/${order_id}`
      )
    : await axiosInstance.get<GenericResponse<OrderDetailResponse>>(
        `/dashboard/orders/sell/${type}/${order_id}`
      )
  return response.data?.data
}

export const getArohOrdersById = async (
  order_id: string,
  type: any
): Promise<any> => {
  setInstance(axiosInstance)

  const response = await axiosInstance.get<
    GenericResponse<OrderDetailResponse>
  >(`/dashboard/${type}/orders/${order_id}`)

  return response.data?.data
}

export const createManualOrder = async (body: any): Promise<any> => {
  setInstance(axiosInstance)
  try {
    const ordersResponse: any = await axiosInstance.post('/dashboard/orders/', {
      ...body,
    })
    return ordersResponse?.data
  } catch (error: any) {
    throw new Error(`${error?.response?.data?.message}`)
  }
}
export const createManualOrderForPC = async (body: any): Promise<any> => {
  setInstance(axiosInstance)
  try {
    const ordersResponse: any = await axiosInstance.post(
      'dashboard/pc/orders',
      {
        ...body,
      }
    )
    return ordersResponse?.data
  } catch (error: any) {
    throw new Error(`${error?.response?.data?.message}`)
  }
}

export const getOrdersByStatus = async (
  status: string,
  params: OrdersParams
): Promise<any> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get<
    GenericResponse<OrderDetailResponse>
  >(`/dashboard/analytics/orders/${status}`, { params })
  return response.data?.data
}
export const getArohOrdersByStatus = async (
  status: string,
  params: OrdersParams
): Promise<any> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get<
    GenericResponse<OrderDetailResponse>
  >(`/dashboard/analytics/orders/aroh/${status}`, { params })
  return response.data?.data
}

export const getOrderAnalyticsData = async (
  params: OrdersParams
): Promise<AnalyticsDataResponse> => {
  const response = await axiosInstance.get('/dashboard/analytics/orders', {
    params,
  })
  return response.data?.data
}

export const updateOrderStatusById = async (
  type: string,
  orderId: string,
  status: string,
  reason: string
) => {
  const body = {
    status: status,
    reason: reason,
  }
  try {
    const isAffiliate = getGlobalItem('isAffiliate')
    const response = isAffiliate
      ? await axiosInstance.put<GenericResponse<any>>(
          `/dashboard/nominatorDashboard/orders/updateStatus/${type}/${orderId}`,
          body
        )
      : await axiosInstance.put<GenericResponse<any>>(
          `/dashboard/orders/updateStatus/${type}/${orderId}`,
          body
        )
    return response.data?.data
  } catch (error) {
    return error
  }
}

export const updatePCOrderStatusById = async ({
  orderId,
  status,
}: {
  orderId: string
  status: string
}) => {
  const body = {
    status: status,
  }
  try {
    const response = await axiosInstance.put<GenericResponse<any>>(
      `/dashboard/pc/orders/${orderId}`,
      body
    )
    return response.data?.data
  } catch (error) {
    return error
  }
}

export const updateArohOrderStatusById = async (
  type: string,
  orderId: string,
  status: string,
  reason: string
) => {
  const body = {
    status: status,
    reason: reason,
  }
  try {
    const response = await axiosInstance.put<GenericResponse<any>>(
      `/dashboard/aroh/orders/updateStatus/${orderId}`,
      body
    )
    return response.data?.data
  } catch (error) {
    return error
  }
}

export const updateOrderById = async (
  orderId: string,
  body: any
): Promise<any> => {
  try {
    const response: any = await axiosInstance.put(
      `/dashboard/orders/PE/${orderId}`,
      { ...body }
    )
    return response
  } catch (error) {
    return error
  }
}

export const getConsolidatedOrdersByAccountId = async (
  accountId: string
): Promise<GetOrdersResponse | undefined> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get<GenericResponse<any>>(
    `dashboard/orders/PE/account/${accountId}/statement`
  )
  const peOrders = response.data.data.PE.map((order: any) => {
    return {
      ...order,
      type: 'PE',
    }
  })
  const orders = [...peOrders]
  return { orders, total: response?.data?.data?.total }
}

export const getTotalOrdersGraphData = async () => {
  const response = await axiosInstance.get<GenericResponse<any>>(
    '/dashboard/overview/graph/totalOrders'
  )

  return response.data?.data
}

export const getAssetsForPC = async (
  params?: AssetsParams
): Promise<{ assets: AssetsForPC[]; total: number }> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get(`/dashboard/pc/assets/options`, {
    params,
  })
  return response.data?.data
}

export const getTokens = async (): Promise<TokenResponse[]> => {
  setInstance(axiosInstance)
  const response = await axiosInstance.get(`/dashboard/assets/options`)
  return response.data?.data
}

export const processRefundAmount = async (
  order_id: string,
  refundAmount: string,
  note?: string
): Promise<GenericResponseWithMessage> => {
  const response = await axiosInstance.put(
    `dashboard/orders/refund/PE/${order_id}`,
    {
      refundAmount: refundAmount,
      note: note || undefined,
    }
  )
  return response.data
}
export const processRefundAmountPC = async (
  order_id: string,
  refund_amount: string,
  is_refund_amount_credited: boolean,
  wallet_transaction_id?: string,
  note?: string
) => {
  const response = await axiosInstance.put<UpdateHolding>(
    `dashboard/pc/orders/refund/${order_id}`,
    {
      refund_amount: refund_amount,
      is_refund_amount_credited: is_refund_amount_credited,
      wallet_transaction_id: wallet_transaction_id || null,
      note: note || null,
    }
  )
  return response
}

export const uploadPdf = async (
  orderId: String,
  formData: any
): Promise<any> => {
  setInstance(axiosInstance)
  const response: any = await axiosInstance.post(
    `/dashboard/orders/${orderId}`,
    formData
  )
  return response?.data
}
