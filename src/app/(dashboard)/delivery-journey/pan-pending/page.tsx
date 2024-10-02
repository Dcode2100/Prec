'use client'
import React, { useState } from 'react'
import { getPanPendingUsersAnalyticsData } from '@/lib/api/deliveryApi'
import { OrdersParams, UsersPanPendingResponse } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '../components/table/data-table'
import { columnsForPanPending } from '../components/table/columns'
import FilterDateSelect from '../components/filterDrawer'
import moment, { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { CSVLink } from 'react-csv'
import { panPendingUserExportKeyLabels } from '@/constants/headers'
import UploadBulkPan from '@/components/BulkPanUpload'

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
    const data = await getPanPendingUsersAnalyticsData(params)
    return data
  }

  const { data: orderAnalytics, isLoading } = useQuery({
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
        <CSVLink
          data={orderAnalytics?.users || []}
          filename={`panPendingUsersData_${moment(new Date()).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}.csv`}
          headers={panPendingUserExportKeyLabels}
        >
          <Button size="sm" className="ml-auto h-8">
            Export CSV
          </Button>
        </CSVLink>
        <UploadBulkPan buttonText="Bulk Upload" />
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
        <h2 className="text-2xl font-semibold mb-4">Pan Pending</h2>
        <DataTable
          columns={columnsForPanPending as ColumnDef<UsersPanPendingResponse>[]}
          data={orderAnalytics?.users || []}
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
          refetch={() => {}}
        />
      </div>
    </div>
  )
}

export default PEDeliveryAnalytics
