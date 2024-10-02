'use client'
import React, { useMemo, useState } from 'react'
import { DataTable } from '@/app/(dashboard)/privateequity/components/data-table'
import { columns } from './components/columns'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import {
  setSearch,
  setTokenType,
  setPage,
  setLimit,
  setSelectedAssetToken,
} from '@/lib/redux/slices/equityslice'
import { Sheet } from '@/components/ui/sheet'
import { getPeAssets } from '@/lib/api/equityApi'
import AssetForm from './side-drawer'

interface paramsType {
  page: number
  limit: number
  search?: string
  state?: string
}
const fetchAccounts = async (
  search: string,
  tokenType: string,
  page: number,
  limit: number
) => {
  const params: paramsType = {
    page,
    limit,
  }
  params.search = search

  if (tokenType !== 'all') {
    params['state'] = tokenType.toUpperCase()
  }
  const data = await getPeAssets(params)
  return data
}

const Page = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const dispatch = useDispatch()
  const { search, tokenType, page, limit } = useSelector(
    (state: RootState) => state.equity
  )

  const queryKey = useMemo(
    () => ['tokensData', search, tokenType, page, limit],
    [search, tokenType, page, limit]
  )
  const {
    data: tokensData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => fetchAccounts(search, tokenType, page, limit),
  })

  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value))
  }

  const handleAccountTypeChange = (value: string) => {
    dispatch(setTokenType(value))
    dispatch(setSearch(''))
  }

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage))
  }

  const handleRowChange = (value: number) => {
    dispatch(setLimit(value))
  }
  const handleRowClick = (asset: string) => {
    dispatch(setSelectedAssetToken(asset))
    setIsSheetOpen(true)
  }

  if (error) return <div>Error fetching data</div>

  return (
    <div className="parent-wrapper w-full h-full flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Private Equity</h2>
          <p className="text-muted-foreground"></p>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <DataTable
          columns={columns}
          data={tokensData?.assets || []}
          fetchedAssets={tokensData?.assets || []}
          search={search}
          onSearchChange={handleSearchChange}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onRowChange={handleRowChange}
          total={tokensData?.total || 0}
          accountType={tokenType}
          onAccountTypeChange={handleAccountTypeChange}
          isLoading={isLoading}
          onRowClick={handleRowClick}
        />
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        {isSheetOpen && (
          <AssetForm setIsSheetOpen={setIsSheetOpen} refetch={refetch} />
        )}
      </Sheet>
    </div>
  )
}

export default Page
