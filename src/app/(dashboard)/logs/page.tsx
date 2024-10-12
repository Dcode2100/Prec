'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, RotateCcw } from 'lucide-react'

import FilterDrawer from './components/filterDrawer'
import { getLogs } from '@/lib/api/reportsApi'
import { Log, LogsParams } from '@/lib/types/getAllLogsType'
import { columnsForLogs } from './components/columns'
import LogModal from './components/CopyModal'

const LogsPage = () => {
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
    type: string
  }>({
    type: 'all',
  })
  const [selectedLog, setSelectedLog] = useState<Log | null>(null)

  const getFilteredData = () => {
    return logs?.logs || []
  }

  const getColumns = () => {
    return columnsForLogs()
  }
  const fetchOrder = async () => {
    const params: LogsParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      created_after: dateFilter.startDate?.toISOString(),
      created_before: dateFilter.endDate?.toISOString(),
    }
    if (search !== '') {
      params.search = search
    }
    if (filters.type !== 'all') {
      params.type = filters.type
    }

    const data = await getLogs(params)
    return data
  }
  const handleApplyFilter = (
    startDate: Moment | null,
    endDate: Moment | null,
    type: string
  ) => {
    setDateFilter({ startDate, endDate })
    setFilters({ type })
  }
  const { data: logs, isLoading } = useQuery({
    queryKey: ['all-error-logs', pagination, dateFilter, search, filters],
    queryFn: () => fetchOrder(),
  })

  const resetFilters = () => {
    setSearch('')
    setFilters({ type: 'all' })
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
    filters.type !== 'all' ||
    pagination.common.limit !== 10 ||
    pagination.common.page !== 1

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        onApplyFilter={handleApplyFilter}
      />
      <h1 className="text-3xl font-semibold ">Error Logs</h1>
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
          columns={getColumns() as ColumnDef<Log>[]}
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
          total={logs?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={(row) => setSelectedLog(row)}
        />
      </div>

      <LogModal
        log={selectedLog}
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  )
}

export default LogsPage
