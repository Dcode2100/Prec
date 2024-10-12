'use client'
import React, { useState } from 'react'
import {
  orderDetails,
  OrdersParams,
  TransactionListObj,
} from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { DataTable } from './components/table/data-table'
import { columnsOrders, columnsTransactions } from './components/table/columns'
import { ColumnDef } from '@tanstack/react-table'
import FilterDateSelect from './components/filterDrawer'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'

import { Loader2 } from 'lucide-react'
import { getOrderAnalyticsData } from '@/lib/api/ordersApi'

const DashboardStatCard = ({ title, value, onClick, isLoading }) => {
  return (
    <Card
      className="h-25 w-[300px] cursor-pointer hover:shadow-md transition-shadow duration-300"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </CardHeader>
      <CardContent className="pt-0 flex justify-between items-center">
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <span className="text-3xl font-bold">{value}</span>
        )}
        <ChevronRight className="h-6 w-6 text-muted-foreground" />
      </CardContent>
    </Card>
  )
}
const PEDeliveryAnalytics = () => {
  const router = useRouter()
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [openDrawer, setOpenDrawer] = useState(false)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>({
    startDate: null,
    endDate: null,
  })

  const getFilteredData = () => {
    if (filter === 'recentTransactions') {
      return orderAnalytics?.[filter]?.transactions || []
    }
    if (filter === 'recentOrders') {
      return orderAnalytics?.[filter]?.orders || []
    }
  }
  const getFilteredTotal = () => {
    if (filter === 'recentTransactions') {
      return orderAnalytics?.[filter]?.total || []
    }
    if (filter === 'recentOrders') {
      return orderAnalytics?.[filter]?.total || []
    }
  }
  const getColumns = () => {
    if (filter === 'recentTransactions') {
      return columnsTransactions
    }
    return columnsOrders
  }
  const [filter, setFilter] = useState('recentTransactions')
  const fetchOrder = async () => {
    const params: OrdersParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    const data = await getOrderAnalyticsData(params)
    return data
  }

  const { data: orderAnalytics, isLoading } = useQuery({
    queryKey: ['order-analytics', pagination, dateFilter, pagination],
    queryFn: () => fetchOrder(),
  })
  const handleDateSelect = (
    startDate: Moment | null,
    endDate: Moment | null
  ) => {
    setDateFilter({ startDate, endDate })
  }

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-center justify-start">
      <div className="w-full flex justify-end items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setOpenDrawer(true)}
        >
          Select Range
        </Button>
      </div>
      <FilterDateSelect
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Select Date Range"
        onDateSelect={handleDateSelect}
      />
      <h1 className="w-full px-5 text-left text-2xl text-muted-foreground">
        Order Analytics
      </h1>
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Didn't link Demat"
          value={orderAnalytics?.didNotLinkDemat || 0}
          onClick={() =>
            router.push(
              `/order-analytics/DID_NOT_LINK_DEMAT?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Linked Demat"
          value={orderAnalytics?.linkedDemat || 0}
          onClick={() =>
            router.push(
              `/order-analytics/LINKED_DEMAT?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Didn't Link bank"
          value={orderAnalytics?.didNotAddBank || 0}
          onClick={() =>
            router.push(
              `/order-analytics/DID_NOT_ADD_BANK?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Linked Bank"
          value={orderAnalytics?.linkedBank || 0}
          onClick={() =>
            router.push(
              `/order-analytics/LINKED_BANK?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4  " />
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Clicked on invest now"
          value={orderAnalytics?.clickedOnInvestNow || 0}
          onClick={() =>
            router.push(
              `/order-analytics/CLICKED_ON_INVEST_NOW?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Didn't Add Bank"
          value={orderAnalytics?.didNotAddBankDetails || 0}
          onClick={() =>
            router.push(
              `/order-analytics/DID_NOT_ADD_BANK_DETAILS?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Didn't add Demat"
          value={orderAnalytics?.didNotAddDemat || 0}
          onClick={() =>
            router.push(
              `/order-analytics/DID_NOT_ADD_DEMAT?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Didn't Confirm Demant"
          value={orderAnalytics?.didNotConfirmDemat || 0}
          onClick={() =>
            router.push(
              `/order-analytics/DID_NOT_CONFIRM_DEMAT?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4  " />
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Didn't click place order"
          value={orderAnalytics?.didNotClickPlaceOrder || 0}
          onClick={() =>
            router.push(
              `/order-analytics/DID_NOT_CLICK_PLACE_ORDER?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4  " />
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Didn't Add UPI"
          value={orderAnalytics?.didNotAddUPI || 0}
          onClick={() =>
            router.push(
              `/order-analytics/DID_NOT_ADD_UPI?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Didn't click Pay Now"
          value={orderAnalytics?.didNotClickPayNow || 0}
          onClick={() =>
            router.push(
              `/order-analytics/DID_NOT_CLICK_PAY_NOW?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4  " />
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Payment Failed/Declined"
          value={orderAnalytics?.paymentPendingCount || 0}
          onClick={() =>
            router.push(
              `/order-analytics/PAYMENT_FAILED_DECLINED?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Payment Cancelled"
          value={orderAnalytics?.cancelledOrderCount || 0}
          onClick={() =>
            router.push(
              `/order-analytics/CANCELLED?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4  " />
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="FL Payment completed"
          value={orderAnalytics?.arohUsers?.didNotClickPayNow || 0}
          onClick={() =>
            router.push(
              `/order-analytics/FL_PAYMENT_COMPLETED?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="FL upload PAN"
          value={orderAnalytics?.arohUsers?.didNotUploadPan || 0}
          onClick={() =>
            router.push(
              `/order-analytics/FL_UPLOAD_PAN?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Upload Aadhaar"
          value={orderAnalytics?.arohUsers?.didNotUploadAadhaar || 0}
          onClick={() =>
            router.push(
              `/order-analytics/FL_UPLOAD_AADHAAR?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Sign Consent"
          value={orderAnalytics?.arohUsers?.didNotSignConsentLetter || 0}
          onClick={() =>
            router.push(
              `/order-analytics/FL_SIGN_CONSENT?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4 " />
      <div className="w-full px-4 mt-4">
        <h2 className="text-2xl font-semibold mb-4">Recent orders</h2>
        <DataTable
          columns={
            getColumns() as ColumnDef<orderDetails, TransactionListObj>[]
          }
          data={getFilteredData()}
          enableSearch={false}
          enableDropdown={true}
          page={pagination.common.page}
          limit={pagination.common.limit}
          onPageChange={(page) => {
            setPagination((prev) => ({
              ...prev,
              common: { ...prev.common, page },
            }))
          }}
          onRowChange={(limit) => {
            setPagination((prev) => ({
              ...prev,
              common: { ...prev.common, limit },
            }))
          }}
          filter={filter}
          onChangeFilter={(filter: string) => setFilter(filter)}
          total={getFilteredTotal()}
          isLoading={isLoading}
          refetch={() => {}}
        />
      </div>
    </div>
  )
}

export default PEDeliveryAnalytics
