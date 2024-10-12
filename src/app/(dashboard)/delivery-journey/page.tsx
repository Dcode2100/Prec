'use client'
import React, { useState } from 'react'
import { getDeliveryAnalyticsData } from '@/lib/api/deliveryApi'
import {
  orderDetails,
  OrdersParams,
  UsersPanPendingResponse,
} from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/CustomTable/data-table'
import { columns, columnsForPanPending } from './components/table/columns'
import { ColumnDef } from '@tanstack/react-table'
import FilterDateSelect from './components/filterDrawer'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import UploadCSV from '@/components/UploadCsv'
import { Loader2 } from 'lucide-react' // Add this import
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { selectOptions } from './components/table/data'

const DashboardStatCard = ({ title, value, onClick, isLoading }) => {
  return (
    <Card
      className="h-32 w-[300px] cursor-pointer hover:shadow-md transition-shadow duration-300"
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
    if (filter === 'recentPanLinkPendingAccounts') {
      return orderAnalytics?.recentPanLinkPendingAccounts.users || []
    }
    return orderAnalytics?.[filter]?.orders || []
  }
  const getFilteredTotal = () => {
    if (filter === 'recentPanLinkPendingAccounts') {
      return orderAnalytics?.recentPanLinkPendingAccounts.users || []
    }
    return orderAnalytics?.[filter]?.total || []
  }
  const getColumns = () => {
    if (filter === 'recentPanLinkPendingAccounts') {
      return columnsForPanPending
    }
    return columns
  }
  const [filter, setFilter] = useState('recentTransferPendingOrders')
  const fetchOrder = async () => {
    const params: OrdersParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    const data = await getDeliveryAnalyticsData(params)
    return data
  }

  const { data: orderAnalytics, isLoading } = useQuery({
    queryKey: ['order-analytics', dateFilter, pagination],
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
        <UploadCSV status={'LOCKED'} buttonText={'Upload Non Trans CSV Doc.'} />
        <UploadCSV status={'SUCCESS'} buttonText={'Upload CSV Doc.'} />
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
        Equity Delivery
      </h1>
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Shares Transfer Pending"
          value={orderAnalytics?.sharesTransferPendingCount || 0}
          onClick={() =>
            router.push(
              `/delivery-journey/transfer-pending?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Verification Pending"
          value={orderAnalytics?.verificationPendingOrdersCount || 0}
          onClick={() =>
            router.push(
              `/delivery-journey/verification-pending?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="NSE Paid Orders"
          value={orderAnalytics?.nsePaidOrdersCount || 0}
          onClick={() =>
            router.push(
              `/delivery-journey/nse-paid?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4  " />
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Shares Transfer Failed"
          value={orderAnalytics?.sharesTransferFailedCount || 0}
          onClick={() =>
            router.push(
              `/delivery-journey/transfer-failed?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="User Pan Link Pending"
          value={orderAnalytics?.userPanLinkPendingCount || 0}
          onClick={() =>
            router.push(
              `/delivery-journey/pan-pending?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4 " />
      <div className="w-full px-4 mt-4">
        <h2 className="text-2xl font-semibold mb-4">Recent orders</h2>
        <div className="mb-4">
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select filter" />
            </SelectTrigger>
            <SelectContent>
              {selectOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DataTable
          columns={
            getColumns() as ColumnDef<UsersPanPendingResponse, orderDetails>[]
          }
          data={getFilteredData()}
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
          total={getFilteredTotal()}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default PEDeliveryAnalytics
