'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'

import { getCronDetails } from '@/lib/api/reportsApi'
import { columnsForCronReport } from './components/columns'
import { CronDetailsParams, CronRecord } from '@/lib/types/getAllCronType'

const CronReportPage = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })

  const getFilteredData = () => {
    return cronDetails?.records || []
  }

  const getColumns = () => {
    return columnsForCronReport()
  }
  const fetchOrder = async () => {
    const params: CronDetailsParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
    }

    const data = await getCronDetails(params)
    return data
  }
  const { data: cronDetails, isLoading } = useQuery({
    queryKey: ['cron-report', pagination, search],
    queryFn: () => fetchOrder(),
  })

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <h1 className="text-3xl font-semibold ">Cron Report</h1>
      <div className="w-full flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 ">
        <div className="flex flex-wrap items-center gap-3"></div>
      </div>
      <div className="w-full">
        <DataTable
          columns={getColumns() as ColumnDef<CronRecord>[]}
          data={getFilteredData()}
          enableSearch={false}
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
          total={cronDetails?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}

export default CronReportPage
