'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, RotateCcw } from 'lucide-react'

import { columnsForWebhooks } from './components/columns'
import FilterDrawer from './components/filterDrawer'
import { getAllWebhooks } from '@/lib/api/reportsApi'
import { WebhookParams, WebhooksResponse } from '@/lib/types/webhooksType'

const WebhookPage = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [status, setStatus] = useState<string | null>(null)
  const [direction, setDirection] = useState<string | null>(null)
  const [openDrawer, setOpenDrawer] = useState(false)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>({
    startDate: null,
    endDate: null,
  })

  const getFilteredData = () => {
    return webhooks?.webhooksResponse || []
  }

  const getColumns = () => {
    return columnsForWebhooks()
  }
  const fetchOrder = async () => {
    const params: WebhookParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      created_after: dateFilter.startDate?.toISOString(),
      created_before: dateFilter.endDate?.toISOString(),
    }
    if (search !== '') {
      params.search = search
    }
    if (status && status !== 'all') {
      params.status = status
    }
    if (direction && direction !== 'all') {
      params.direction = direction
    }

    const data = await getAllWebhooks(params)
    return data
  }
  const handleDateSelect = (
    startDate: Moment | null,
    endDate: Moment | null
  ) => {
    setDateFilter({ startDate, endDate })
  }
  const { data: webhooks, isLoading } = useQuery({
    queryKey: [
      'all-webhooks',
      pagination,
      dateFilter,
      search,
      status,
      direction,
    ],
    queryFn: () => fetchOrder(),
  })

  const resetFilters = () => {
    setSearch('')
    setStatus('all')
    setDirection('all')
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
    status !== 'all' ||
    direction !== 'all'

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        status={status}
        direction={direction}
        onDateSelect={handleDateSelect}
        onStatusSelect={setStatus}
        onDirectionSelect={setDirection}
      />
      <h1 className="text-3xl font-semibold ">Webhooks</h1>
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
          columns={getColumns() as ColumnDef<WebhooksResponse>[]}
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
          total={webhooks?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}

export default WebhookPage
