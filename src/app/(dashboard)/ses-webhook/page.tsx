'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, RotateCcw } from 'lucide-react'

import { columnsForSESWebhooks } from './components/table/columns'
import FilterDrawer from './components/filterDrawer'
import { getAllSESWebhooks } from '@/lib/api/reportsApi'
import { SESWebhook, WebhookParams } from '@/lib/types/webhooksType'
import { useToast } from '@/hooks/use-toast'
import { copyToClipboard } from '@/components/CopyCell'

export const ActionButton = ({ row }: { row: SESWebhook }) => {
  const { toast } = useToast()

  const copyResponseToClipboard = () => {
    const jsonString = JSON.stringify(row.response)
    copyToClipboard(jsonString)
    toast({
      title: 'Copied to clipboard',
      description: 'Response Message has been copied to your clipboard.',
      variant: 'success',
      duration: 3000,
    })
  }

  return (
    <Button
      className="h-8 text-xs"
      onClick={copyResponseToClipboard}
      title="Copy full response"
    >
      Copy
    </Button>
  )
}

const WebhookPage = () => {
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

  const getFilteredData = () => {
    return webhooks?.webhooks || []
  }

  const getColumns = () => {
    return columnsForSESWebhooks(ActionButton)
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

    const data = await getAllSESWebhooks(params)
    return data
  }
  const handleDateSelect = (
    startDate: Moment | null,
    endDate: Moment | null
  ) => {
    setDateFilter({ startDate, endDate })
  }
  const { data: webhooks, isLoading } = useQuery({
    queryKey: ['all-ses-webhooks', pagination, dateFilter, search],
    queryFn: () => fetchOrder(),
  })

  const resetFilters = () => {
    setSearch('')
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        onDateSelect={handleDateSelect}
      />
      <h1 className="text-3xl font-semibold ">SES Webhooks</h1>
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
          columns={getColumns() as ColumnDef<SESWebhook>[]}
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
