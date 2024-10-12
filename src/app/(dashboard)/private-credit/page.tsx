'use client'
import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { DownloadIcon, Loader2, PlusIcon, RotateCcw } from 'lucide-react'

import { columnsForPrivateCredit } from './components/columns'
import { CSVLink } from 'react-csv'
import { privateCreditHeaders } from '@/constants/headers'
import { getAllPcAssets } from '@/lib/api/creditApi'
import { PcAsset } from '@/lib/types/types'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import UploadCSV from '@/components/UploadCsv'
import { useRouter } from 'next/navigation'
import { tokenTypes } from './data/data'
import { Input } from '@/components/ui/input'
import { debounce } from 'lodash'

interface getPcParams {
  page: number
  limit: number
  search?: string
  status?: string
}
const PrivateCreditPage = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [tabValue, setTabValue] = useState('LIVE')
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })

  const getFilteredData = () => {
    return pcAssets?.assets || []
  }

  const getColumns = () => {
    return columnsForPrivateCredit()
  }

  const fetchAssets = async () => {
    const params: getPcParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
    }
    if (search !== '') {
      params.search = search
    }
    if (tabValue !== 'ALL') {
      params.status = tabValue
    }
    const data = await getAllPcAssets(params)
    return data
  }

  const { data: pcAssets, isLoading } = useQuery({
    queryKey: ['all-pc-assets-' + tabValue, pagination, search, tabValue],
    queryFn: () => fetchAssets(),
  })

  const resetFilters = () => {
    setSearch('')
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    pagination.common.limit !== 10 ||
    pagination.common.page !== 1

  const handleRowClick = (value: string) => {
    if (!pcAssets) return
    router.push(`/private-credit/${value}`)
  }

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value)
    }, 300),
    []
  )

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <h1 className="text-3xl font-semibold mb-6">Private Credit</h1>
      <div className="w-full flex flex-col gap-4 mb-6">
        <Tabs
          defaultValue="LIVE"
          onValueChange={(value) => setTabValue(value)}
          className="w-full"
        >
          <TabsList className="justify-start">
            {tokenTypes.map((token) => (
              <TabsTrigger key={token.value} value={token.value}>
                {token.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full flex items-center justify-between gap-3">
            <Input
              placeholder="Search"
              defaultValue={search}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="h-8 w-full sm:w-[250px]"
            />
            <div className="flex items-center gap-3">
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
              <CSVLink
                data={getFilteredData() as PcAsset[]}
                headers={privateCreditHeaders}
                filename="private-credit-assets.csv"
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
              <Button
                onClick={() => router.push('/private-credit/create-asset')}
                size="sm"
                variant="outline"
                className="h-8 flex items-center gap-2"
              >
                <PlusIcon size={16} />
                Create Asset
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full">
        <DataTable
          columns={getColumns() as ColumnDef<PcAsset>[]}
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
          total={pcAssets?.total || 0}
          isLoading={isLoading}
          onRowClick={(row) => handleRowClick(row.id)}
        />
      </div>
    </div>
  )
}

export default PrivateCreditPage
