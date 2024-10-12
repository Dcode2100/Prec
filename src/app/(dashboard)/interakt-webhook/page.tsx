'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, RotateCcw } from 'lucide-react'

import { columnsForInteraktWebhooks } from './components/table/columns'
import FilterDrawer from './components/filterDrawer'
import { getAllInteraktWebhooks } from '@/lib/api/reportsApi'
import {
  InteraktWebhookParams,
  InteraktWebhook,
} from '@/lib/types/webhooksType'
import { useToast } from '@/hooks/use-toast'
import { copyToClipboard } from '@/components/CopyCell'

export const ActionButton = ({ row }: { row: InteraktWebhook }) => {
  const { toast } = useToast()

  const copyResponseToClipboard = () => {
    const jsonString = JSON.stringify(row.webhook_data.data.message)
    copyToClipboard(jsonString)
    toast({
      title: 'Copied to clipboard',
      description: 'Response Message has been copied to your clipboard.',
      variant: 'success',
      duration: 3000,
    })
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        className="h-8 text-xs"
        onClick={copyResponseToClipboard}
        title="Copy full response"
      >
        Copy
      </Button>
    </div>
  )
}

const InteraktWebhookPage = () => {
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
    callbackData: string
    status: string[]
    messageType: string
  }>({
    callbackData: 'all',
    status: [],
    messageType: 'all',
  })

  const getFilteredData = () => {
    return webhooks?.webhooks || []
  }

  const getColumns = () => {
    return columnsForInteraktWebhooks(ActionButton)
  }
  const fetchOrder = async () => {
    const params: InteraktWebhookParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      created_after: dateFilter.startDate?.toISOString(),
      created_before: dateFilter.endDate?.toISOString(),
    }
    if (search !== '') {
      params.search = search
    }
    if (filters.status.length > 0) {
      params.status = filters.status
    }
    if (filters.messageType !== 'all') {
      params.type = filters.messageType
    }
    if (filters.callbackData !== 'all') {
      params.callback_data = filters.callbackData
    }

    const data = await getAllInteraktWebhooks(params)
    return data
  }
  const handleApplyFilter = (
    startDate: Moment | null,
    endDate: Moment | null,
    callbackData: string,
    status: string[],
    messageType: string
  ) => {
    setDateFilter({ startDate, endDate })
    setFilters({ callbackData, status, messageType })
  }
  const { data: webhooks, isLoading } = useQuery({
    queryKey: [
      'all-interakt-webhooks',
      pagination,
      dateFilter,
      search,
      filters,
    ],
    queryFn: () => fetchOrder(),
  })

  const resetFilters = () => {
    setSearch('')
    setFilters({ callbackData: 'all', status: [], messageType: 'all' })
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
    filters.callbackData !== 'all' ||
    filters.status.length > 0 ||
    filters.messageType !== 'all' ||
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
      <h1 className="text-3xl font-semibold ">Interakt Webhooks</h1>
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
          columns={getColumns() as ColumnDef<InteraktWebhook>[]}
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

export default InteraktWebhookPage
