'use client'
import React, { useState, useCallback } from 'react'
import { getPanPendingUsersAnalyticsData } from '@/lib/api/deliveryApi'
import { OrdersParams, UsersPanPendingResponse } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { columnsForPanPending } from '../components/table/columns'
import FilterDateSelect from '../components/filterDrawer'
import moment, { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { CSVLink } from 'react-csv'
import { panPendingUserExportKeyLabels } from '@/constants/headers'
import UploadBulkPan from '@/components/BulkPanUpload'
import { useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { debounce } from 'lodash'
import { RefreshCcw } from 'lucide-react'

const PanPending = () => {
  const searchParams = useSearchParams()
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
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

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value)
    }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    debouncedSetSearch(e.target.value)
  }

  const fetchOrder = async () => {
    const params: OrdersParams = {
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
      limit: pagination.common.limit,
      page: pagination.common.page,
      search: debouncedSearch,
    }
    const data = await getPanPendingUsersAnalyticsData(params)
    return data
  }

  const { data: orderAnalytics, isLoading } = useQuery({
    queryKey: [
      'pan-pending',
      dateFilter,
      debouncedSearch,
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

  const resetFilters = () => {
    setSearch('')
    setDebouncedSearch('')
    setDateFilter({ startDate: null, endDate: null })
  }

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-center justify-start">
      <div className="w-full px-4 mt-4">
        <h2 className="text-2xl font-semibold mb-4">Pan Pending</h2>
        <div className="w-full h-10 flex justify-between items-center gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
              className="w-64"
            />
          </div>
          <div className="flex gap-2">
            {(search || dateFilter.startDate || dateFilter.endDate) && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="h-8 flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Reset
              </Button>
            )}
            <CSVLink
              data={orderAnalytics?.users || []}
              filename={`panPendingUsersData_${moment(new Date()).format(
                'MMMM Do YYYY, h:mm:ss a'
              )}.csv`}
              headers={panPendingUserExportKeyLabels}
            >
              <Button size="sm" className="h-8">
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
        </div>
        <FilterDateSelect
          open={openDrawer}
          onOpenChange={setOpenDrawer}
          header="Select Date Range"
          onDateSelect={handleDateSelect}
        />
        <DataTable
          columns={columnsForPanPending as ColumnDef<UsersPanPendingResponse>[]}
          data={orderAnalytics?.users || []}
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
          total={orderAnalytics?.total || 0}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}

export default PanPending
