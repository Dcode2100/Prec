'use client'
import React, { useState } from 'react'
import { OrdersParams } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../components/table/data-table'

import FilterDateSelect from '../components/filterDrawer'
import moment, { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { getPCOrders } from '@/lib/api/ordersApi'
import { CSVLink } from 'react-csv'
import { RecentSubscriptionProcessingOrder } from '@/lib/types/pcDeliveryType'
import { columnsForProcessingPage } from '../components/table/columns'
import { exportPcHoldingsHeaders } from '@/constants/headers'
import { useSearchParams } from 'next/navigation'

const PEPendingOrders = () => {
  const searchParams = useSearchParams()
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [search, setSearch] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>(() => {
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    return {
      startDate: startDate ? moment(startDate) : null,
      endDate: endDate ? moment(endDate) : null,
    }
  })
  const fetchOrder = async () => {
    const params: OrdersParams = {
      status: 'SUBSCRIPTION_PROCESSING',
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
      limit: pagination.common.limit,
      page: pagination.common.page,
      search: search,
    }
    const data = await getPCOrders(params)
    return data
  }

  const {
    data: orderAnalytics,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      'pc-order-pending',
      dateFilter,
      search,
      pagination.common.limit,
      pagination.common.page,
    ],
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
      <div className="w-full h-10 flex justify-end items-center gap-2">
        <CSVLink
          headers={exportPcHoldingsHeaders}
          data={orderAnalytics?.orders || []}
          filename="pending-orders.csv"
        >
          <Button variant="outline" size="sm" className="h-8">
            Export
          </Button>
        </CSVLink>
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
      <div className="w-full px-4 mt-4">
        <h2 className="text-2xl font-semibold mb-4">Orders Processing</h2>
        <DataTable
          columns={
            columnsForProcessingPage as ColumnDef<RecentSubscriptionProcessingOrder>[]
          }
          data={orderAnalytics?.orders || []}
          enableSearch={true}
          enableDropdown={false}
          search={search}
          onSearchChange={setSearch}
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
          filter={''}
          onChangeFilter={() => {}}
          total={orderAnalytics?.total || 0}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  )
}

export default PEPendingOrders
