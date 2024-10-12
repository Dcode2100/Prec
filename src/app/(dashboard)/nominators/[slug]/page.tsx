'use client'
import React, { useState } from 'react'
import { NominatorAccountResponse, NominatorsParams } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { DownloadIcon, FilterIcon, RotateCcw } from 'lucide-react'

import { columnsForNominatorsAccounts } from '../components/table/columns'
import { CSVLink } from 'react-csv'
import { nominatorAccountsHeaders } from '@/constants/headers'
import { getNominatorAccount } from '@/lib/api/nominatorApi'
import FilterDrawer from '../components/filterDrawer'
import { useParams, useRouter } from 'next/navigation'

const NominatorsPage = () => {
  const params = useParams()
  const router = useRouter()
  const accountId = params.slug
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
    return nominators?.accounts || []
  }

  const getColumns = () => {
    return columnsForNominatorsAccounts
  }
  const fetchOrder = async () => {
    const params: NominatorsParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    const data = await getNominatorAccount(accountId as string, params)
    return data
  }
  const handleDateSelect = (
    startDate: Moment | null,
    endDate: Moment | null
  ) => {
    setDateFilter({ startDate, endDate })
  }
  const { data: nominators, isLoading } = useQuery({
    queryKey: ['all-nominators-accoutns', pagination, dateFilter],
    queryFn: () => fetchOrder(),
  })

  const resetFilters = () => {
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    dateFilter.startDate !== null || dateFilter.endDate !== null

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-center justify-start">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        onDateSelect={handleDateSelect}
      />
      <h1 className="w-full px-6 mt-5 text-left font-semibold text-3xl ">
        {nominators?.nominatorName}
      </h1>
      <div className="w-full flex justify-end items-center gap-4 px-6 ">
        <div className="flex items-center gap-3">
          <CSVLink
            data={getFilteredData() as NominatorAccountResponse[]}
            headers={nominatorAccountsHeaders}
            filename={`${nominators?.nominatorName}-accounts.csv`}
          >
            <Button size="sm" className="h-8 flex items-center gap-2">
              <DownloadIcon size={16} />
              Export
            </Button>
          </CSVLink>
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
      <div className="w-full px-4">
        <DataTable
          columns={getColumns() as ColumnDef<NominatorAccountResponse>[]}
          data={getFilteredData()}
          enableSearch={false}
          enableDropdown={false}
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
          total={nominators?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={(row) => {
            router.push(`/accounts/PE-${row.account_id}`)
          }}
        />
      </div>
    </div>
  )
}

export default NominatorsPage
