'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, RotateCcw, Copy } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { columnsForDashboardEvents } from './components/table/columns'
import FilterDrawer from './components/filterDrawer'
import { useToast } from '@/hooks/use-toast'
import { copyToClipboard } from '@/components/CopyCell'
import { getDashboardEvents } from '@/lib/api/reportsApi'
import {
  DashboardEventsParams,
  DashboardUserEvent,
} from '@/lib/types/dashboardUserType'

export const ActionButton = ({ row }: { row: DashboardUserEvent }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const copyResponseToClipboard = (key: string) => {
    const jsonString = JSON.stringify(row[key])
    copyToClipboard(jsonString)
    toast({
      title: 'Copied to clipboard',
      description: `${key} has been copied to your clipboard.`,
      variant: 'success',
      duration: 3000,
    })
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="h-8 px-2 bg-highlight-blue flex items-center gap-1">
          <span className="sr-only">Open menu</span>
          <span className="text-xs">Copy</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2 mr-20">
        <div className="grid gap-1">
          <Button
            className="w-full justify-start text-xs py-1 group"
            variant="ghost"
            onClick={() => copyResponseToClipboard('device_info')}
          >
            Device info
            <Copy
              size={14}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Button>
          <Button
            className="w-full justify-start text-xs py-1 group"
            variant="ghost"
            onClick={() => copyResponseToClipboard('req')}
          >
            Request Info
            <Copy
              size={14}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Button>
          <Button
            className="w-full justify-start text-xs py-1 group"
            variant="ghost"
            onClick={() => copyResponseToClipboard('res')}
          >
            Response Info
            <Copy
              size={14}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const DashboardEventsPage = () => {
  const [search, setSearch] = useState('')
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
  const [filters, setFilters] = useState<{
    actions: string[]
  }>({
    actions: [],
  })

  const getFilteredData = () => {
    return dashboardEvents?.events || []
  }

  const getColumns = () => {
    return columnsForDashboardEvents(ActionButton)
  }
  const fetchOrder = async () => {
    const params: DashboardEventsParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    if (search !== '') {
      params.search = search
    }
    if (filters.actions.length > 0) {
      params.action = filters.actions
    }

    const data = await getDashboardEvents(params)
    return data
  }
  const handleApplyFilter = (
    startDate: Moment | null,
    endDate: Moment | null,
    actions: string[]
  ) => {
    setDateFilter({ startDate, endDate })
    setFilters({ actions })
  }
  const { data: dashboardEvents, isLoading } = useQuery({
    queryKey: ['all-dashboard-events', pagination, dateFilter, search, filters],
    queryFn: () => fetchOrder(),
  })

  const resetFilters = () => {
    setSearch('')
    setFilters({ actions: [] })
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
    filters.actions.length > 0 ||
    pagination.common.limit !== 10 ||
    pagination.common.page !== 1

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        onApplyFilter={handleApplyFilter}
        options={dashboardEvents?.filters.actions || []}
      />
      <h1 className="text-3xl font-semibold ">Dashboard Events</h1>
      <div className="w-full flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 ">
        <div className="flex flex-wrap items-center gap-3">
          {isFiltered && (
            <Button
              onClick={resetFilters}
              size="sm"
              variant="outline"
              className="h-8 flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenDrawer(true)}
            className="h-8 flex items-center gap-2"
          >
            <FilterIcon size={16} />
            Filter
          </Button>
        </div>
      </div>
      <div className="w-full">
        <DataTable
          columns={getColumns() as ColumnDef<DashboardUserEvent>[]}
          data={getFilteredData()}
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
          total={dashboardEvents?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}

export default DashboardEventsPage
