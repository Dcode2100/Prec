'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { DataTable } from './components/table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import FilterDateSelect from './components/filterDrawer'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'

import { getReports } from '@/lib/api/reportsApi'
import { columnsForOrderReports } from './components/table/columns'
import { Report, ReportsParams } from '@/lib/types/reportType'
import MultiFilter from '@/components/MultiFilter'
import { selectOptions } from './components/table/data'

const OrderReports = () => {
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
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

  const fetchOrder = async () => {
    const params: ReportsParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
      type: selectedTypes,
      status: selectedStatus,
    }
    const data = await getReports(params)
    return data
  }

  const { data: orderReports, isLoading } = useQuery({
    queryKey: [
      'order-reports',
      dateFilter,
      pagination,
      search,
      selectedTypes,
      selectedStatus,
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
      <div className="w-full flex justify-end items-center gap-2">
        <MultiFilter
          label="Status"
          filters={selectOptions}
          onFilterChange={setSelectedStatus}
        />
        <MultiFilter
          label="Type"
          filters={orderReports?.filters?.types || []}
          onFilterChange={setSelectedTypes}
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
        <h2 className="text-2xl font-semibold mb-4">Order Events</h2>
        <DataTable
          columns={columnsForOrderReports as ColumnDef<Report>[]}
          data={orderReports?.reports || []}
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
          total={orderReports?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
        />
      </div>
    </div>
  )
}

export default OrderReports
