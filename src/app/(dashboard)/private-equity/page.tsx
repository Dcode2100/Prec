'use client'
import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { Button } from '@/components/ui/button'
import { DownloadIcon, Loader2, PlusIcon, RotateCcw } from 'lucide-react'
import { Sheet } from '@/components/ui/sheet'
import { columnsForPrivateEquity } from './components/columns'
import { CSVLink } from 'react-csv'
import { privateCreditHeaders } from '@/constants/headers'
import { getPeAssets } from '@/lib/api/equityApi'
import { Input } from '@/components/ui/input'
import { debounce } from 'lodash'
import EquityDetailsForm from './side-drawer'
import UploadBulkAsset from './components/bulk-upload'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { tokenTypes } from './data/data'

interface getPeParams {
  page: number
  limit: number
  search?: string
  state?: string
}

const PrivateEquityPage = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [assetId, setAssetId] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [status, setStatus] = useState('ALL')
  const router = useRouter()

  const getFilteredData = () => {
    return peAssets?.assets || []
  }

  const getColumns = () => {
    return columnsForPrivateEquity()
  }

  const fetchAssets = async () => {
    const params: getPeParams = {
      limit,
      page,
    }
    if (search !== '') {
      params.search = search
    }
    if (status !== 'ALL') {
      params.state = status
    }
    const data = await getPeAssets(params)
    return data
  }

  const {
    data: peAssets,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['all-pe-assets', page, limit, search, status],
    queryFn: () => fetchAssets(),
  })

  const resetFilters = () => {
    setSearch('')
    setPage(1)
    setLimit(10)
    setStatus('ALL')
  }

  const isFiltered = search !== '' || limit !== 10 || page !== 1

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value)
    }, 300),
    []
  )

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <h1 className="text-3xl font-semibold mb-6">Private Equity</h1>
      <div className="w-full flex flex-col gap-4 mb-4">
        <Tabs value={status} onValueChange={setStatus}>
          <TabsList>
            {tokenTypes.map((type) => (
              <TabsTrigger key={type.value} value={type.value}>
                {type.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="w-full flex items-center justify-between gap-3">
          <Input
            placeholder="Search"
            defaultValue={search}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="h-8 w-[250px]"
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
              data={getFilteredData() as []}
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
            <UploadBulkAsset />
            <Button
              variant="outline"
              size="sm"
              className="h-8 items-center"
              onClick={() => router.push('/private-equity/create-asset')}
            >
              <PlusIcon className="mr-1 h-3 w-4" />
              Create Asset
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full">
        <DataTable
          columns={getColumns()}
          data={getFilteredData() as []}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onRowChange={setLimit}
          total={peAssets?.total || 0}
          isLoading={isLoading}
          onRowClick={(row) => {
            setAssetId(row.token)
            setIsSheetOpen(true)
          }}
        />
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        {isSheetOpen && assetId && (
          <EquityDetailsForm
            assetId={assetId}
            setIsSheetOpen={setIsSheetOpen}
            refetch={refetch}
          />
        )}
      </Sheet>
    </div>
  )
}

export default PrivateEquityPage
