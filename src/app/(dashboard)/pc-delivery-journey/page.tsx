'use client'
import React, { useState } from 'react'
import { getPCDeliveryAnalyticsData } from '@/lib/api/deliveryApi'
import { OrdersParams } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { DataTable } from './components/table/data-table'
import {
  columnsForProcessed,
  columnsForProcessing,
} from './components/table/columns'
import { ColumnDef } from '@tanstack/react-table'
import FilterDateSelect from './components/filterDrawer'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import {
  RecentHoldings,
  RecentSubscriptionProcessingOrder,
} from '@/lib/types/pcDeliveryType'
import UploadCSV from '@/components/UploadCsv'
import { Loader2 } from 'lucide-react' // Add this import

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
const PCDeliveryAnalytics = () => {
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
    if (filter === 'recent_holdings_yet_to_start') {
      return orderAnalytics?.data?.recent_holdings_yet_to_start?.holdings || []
    } else if (filter === 'recent_holdings_started') {
      return orderAnalytics?.data?.recent_holdings_started?.holdings || []
    } else if (filter === 'recent_holdings_ended') {
      return orderAnalytics?.data?.recent_holdings_ended?.holdings || []
    } else if (filter === 'recent_holdings_repaid') {
      return orderAnalytics?.data?.recent_holdings_repaid?.holdings || []
    }
    return orderAnalytics?.data?.[filter]?.orders || []
  }
  const getColumns = () => {
    if (filter === 'recent_holdings_yet_to_start') {
      return columnsForProcessed
    } else if (filter === 'recent_holdings_started') {
      return columnsForProcessed
    } else if (filter === 'recent_holdings_ended') {
      return columnsForProcessed
    } else if (filter === 'recent_holdings_repaid') {
      return columnsForProcessed
    }
    return columnsForProcessing
  }
  const [filter, setFilter] = useState('recent_subscription_processing_orders')
  const fetchOrder = async () => {
    const params: OrdersParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    const data = await getPCDeliveryAnalyticsData(params)
    return data
  }

  const {
    data: orderAnalytics,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['pc-order-analytics', dateFilter, pagination],
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
        <UploadCSV
          status={'SUBSCRIPTION_PROCESSED'}
          buttonText={'Upload Orders CSV Doc.'}
          refetch={refetch}
        />
        <UploadCSV status={'repay'} buttonText={'Upload Holdings CSV Doc.'} />
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
        Credits Delivery
      </h1>
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Subscription Processing Pending"
          value={orderAnalytics?.data?.subscription_processing_count ?? 0}
          onClick={() =>
            router.push(
              `/pc-delivery-journey/pending?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Subscription Processed"
          value={orderAnalytics?.data?.subscription_processed_count ?? 0}
          onClick={() =>
            router.push(
              `/pc-delivery-journey/processed?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Holding Yet To Start"
          value={orderAnalytics?.data?.holdings_yet_to_start_count ?? 0}
          onClick={() =>
            router.push(
              `/pc-delivery-journey/yet-to-start?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4  " />
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Holding Started"
          value={orderAnalytics?.data?.holdings_started_count ?? 0}
          onClick={() =>
            router.push(
              `/pc-delivery-journey/started?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Holding Ended"
          value={orderAnalytics?.data?.holdings_ended_count ?? 0}
          onClick={() =>
            router.push(
              `/pc-delivery-journey/ended?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
            )
          }
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Holding Repaid"
          value={orderAnalytics?.data?.holdings_repaid_count ?? 0}
          onClick={() =>
            router.push(
              `/pc-delivery-journey/repaid?startDate=${dateFilter.startDate?.toISOString()}&endDate=${dateFilter.endDate?.toISOString()}`
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
            getColumns() as ColumnDef<
              RecentHoldings,
              RecentSubscriptionProcessingOrder
            >[]
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
          onChangeFilter={(filter) => setFilter(filter)}
          total={getFilteredData().length}
          isLoading={isLoading}
          refetch={() => {}}
        />
      </div>
    </div>
  )
}

export default PCDeliveryAnalytics
