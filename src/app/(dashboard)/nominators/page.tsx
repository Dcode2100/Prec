'use client'
import React, { useState } from 'react'
import { NominatorResponse, NominatorsParams } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { DownloadIcon, FilterIcon, PlusIcon, RotateCcw } from 'lucide-react'

import { columnsForNominators } from './components/table/columns'
import { CSVLink } from 'react-csv'
import { nominatorHeaders } from '@/constants/headers'
import { getNominatorData } from '@/lib/api/nominatorApi'
import FilterDrawer from './components/filterDrawer'
import NominatorSheet from './components/NominatorDrawer'
import { useRouter } from 'next/navigation'
import { selectOptions } from './components/table/data'

const NominatorsPage = () => {
  const router = useRouter()
  const [nominator, setNominator] = useState<NominatorResponse | null>(null)
  const [openNominator, setOpenNominator] = useState(false)
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
    return nominators?.nominators || []
  }

  const getColumns = () => {
    return columnsForNominators(ActionButton)
  }
  const fetchOrder = async () => {
    const params: NominatorsParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    if (search !== '') {
      params.search = search
    }
    const data = await getNominatorData(params)
    return data
  }
  const handleDateSelect = (
    startDate: Moment | null,
    endDate: Moment | null
  ) => {
    setDateFilter({ startDate, endDate })
  }
  const { data: nominators, isLoading } = useQuery({
    queryKey: ['all-nominators', pagination, dateFilter, search],
    queryFn: () => fetchOrder(),
  })

  const resetFilters = () => {
    setSearch('')
    setDateFilter({ startDate: null, endDate: null })
    // Optionally reset pagination if needed
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null

  const ActionButton = ({ row }: { row: NominatorResponse }) => {
    return (
      <Button
        size="sm"
        className="h-8"
        onClick={(e) => {
          e.stopPropagation()
          setNominator(row)
          setOpenNominator(true)
        }}
      >
        Update
      </Button>
    )
  }

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-center justify-start">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        onDateSelect={handleDateSelect}
      />
      <NominatorSheet
        open={openNominator}
        onOpenChange={setOpenNominator}
        isLoading={isLoading}
        initialData={nominator}
      />
      <h1 className="w-full px-6 mt-5 text-left font-semibold text-3xl ">
        Nominators
      </h1>
      <div className="w-full flex justify-end items-center gap-4 px-6 ">
        <div className="flex items-center gap-3">
          <CSVLink
            data={getFilteredData() as NominatorResponse[]}
            headers={nominatorHeaders}
            filename="wishlist.csv"
          >
            <Button size="sm" className="h-8 flex items-center gap-2">
              <DownloadIcon size={16} />
              Export
            </Button>
          </CSVLink>
          <Button
            size="sm"
            onClick={() => {
              setNominator(null)
              setOpenNominator(true)
            }}
            className="h-8 flex items-center gap-2"
          >
            <PlusIcon size={16} />
            Create Nominator
          </Button>
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
          columns={getColumns() as ColumnDef<NominatorResponse>[]}
          data={getFilteredData()}
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
          total={nominators?.total || 0}
          isLoading={isLoading}
          onRowClick={(row) => {
            router.push(`/nominators/${row.nominator_id}`)
          }}
        />
      </div>
    </div>
  )
}

export default NominatorsPage
