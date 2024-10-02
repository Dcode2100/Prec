'use client'
import React, { useState } from 'react'
import { getDeliveryByStatus } from '@/lib/api/deliveryApi'
import { OrderResponse, OrdersParams } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../components/table/data-table'
import { shareDetailsColumns } from '../components/table/columns'
import FilterDateSelect from '../components/filterDrawer'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import ExportCsv from '../components/ExportCsv'

const PEDeliveryAnalytics = () => {
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [search, setSearch] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>({
    startDate: null,
    endDate: null,
  })

  const fetchOrder = async () => {
    const params: OrdersParams = {
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
      limit: pagination.common.limit,
      page: pagination.common.page,
      search: search,
    }
    const data = await getDeliveryByStatus('VERIFICATION_PENDING', params)
    return data
  }

  const {
    data: orderAnalytics,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      'order-details',
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
        <ExportCsv
          orderAnalytics={orderAnalytics?.PE || []}
          status="VERIFICATION_PENDING"
          limit={pagination.common.limit}
          page={pagination.common.page}
        />
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
        <h2 className="text-2xl font-semibold mb-4">Verification Pending</h2>
        <DataTable
          columns={shareDetailsColumns as ColumnDef<OrderResponse>[]}
          data={orderAnalytics?.PE || []}
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

export default PEDeliveryAnalytics
