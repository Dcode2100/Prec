'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { DownloadIcon, FilterIcon, Loader2, RotateCcw } from 'lucide-react'

import { columnsForPcEnquiries } from './components/table/columns'
import { CSVLink } from 'react-csv'
import { pcEnquiryHeaders } from '@/constants/headers'
import FilterDrawer from './components/filterDrawer'
import { getAllPcEnquiries } from '@/lib/api/enquireApi'
import { Enquiry, PCEnquiryParams } from '@/lib/types/PcEnquiryType'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UploadCSV from '@/components/UploadCsv'

const PcEnquiriesPage = () => {
  const [search, setSearch] = useState('')
  const [tabValue, setTabValue] = useState('ALL')
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
    return pcEnquiries?.enquiries || []
  }

  const getColumns = () => {
    return columnsForPcEnquiries()
  }
  const fetchOrder = async () => {
    const params: PCEnquiryParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    if (search !== '') {
      params.search = search
    }
    if (tabValue !== 'ALL') {
      params.status = tabValue
    }
    const data = await getAllPcEnquiries(params)
    return data
  }
  const handleDateSelect = (
    startDate: Moment | null,
    endDate: Moment | null
  ) => {
    setDateFilter({ startDate, endDate })
  }
  const { data: pcEnquiries, isLoading } = useQuery({
    queryKey: ['all-pc-enquiries', pagination, dateFilter, search, tabValue],
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

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        onDateSelect={handleDateSelect}
      />
      <h1 className="text-3xl font-semibold mb-6">PC Enquiries</h1>
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Tabs defaultValue="ALL" onValueChange={(value) => setTabValue(value)}>
          <TabsList>
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value="ACTIVE">Active</TabsTrigger>
            <TabsTrigger value="INACTIVE">Inactive</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap items-center gap-3">
          <CSVLink
            data={getFilteredData() as Enquiry[]}
            headers={pcEnquiryHeaders}
            filename="pc-enquiries.csv"
          >
            <Button
              size="sm"
              className="h-8 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} />
                  Loading...
                </>
              ) : (
                <>
                  <DownloadIcon size={16} /> Export
                </>
              )}
            </Button>
          </CSVLink>
          <UploadCSV status={'PCACTIVE'} buttonText={'Upload CSV Doc.'} />
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
          columns={getColumns() as ColumnDef<Enquiry>[]}
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
          total={pcEnquiries?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}

export default PcEnquiriesPage
