'use client'
import React, { useMemo } from 'react'
import { DataTable } from '@/app/(dashboard)/privatecredit/components/data-table'
import { columns } from './components/columns'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import {
  setSearch,
  setTokenType,
  setLimit,
  setPage,
  setSelectedAsset,
} from '@/lib/redux/slices/creditSlice'
import { getAllPcAssets } from '@/lib/api/creditApi'
import { useRouter } from 'next/navigation'

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
    params['status'] = tokenType.toUpperCase()
  }
  const data = await getAllPcAssets(params)
  return data
}

const Page = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { search, tokenType, page, limit } = useSelector(
    (state: RootState) => state.credit
  )

  const queryKey = useMemo(
    () => ['pcAssets', search, tokenType, page, limit],
    [search, tokenType, page, limit]
  )
  const {
    data: pcAssets,
    isLoading,
    error,
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
  const handleRowClick = (value: string) => {
    if (!pcAssets) return
    router.push(`/privatecredit/${value}`)
    dispatch(
      setSelectedAsset(
        pcAssets.assets?.filter((asset) => asset.id === value)[0]
      )
    )
  }

  if (error) return <div>Error fetching data</div>

  return (
    <div className="parent-wrapper w-full h-full flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Private Credit</h2>
          <p className="text-muted-foreground"></p>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <DataTable
          columns={columns}
          data={pcAssets?.assets || []}
          fetchedAssets={pcAssets?.assets || []}
          search={search}
          onSearchChange={handleSearchChange}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onRowChange={handleRowChange}
          total={pcAssets?.total || 0}
          accountType={tokenType}
          onAccountTypeChange={handleAccountTypeChange}
          isLoading={isLoading}
          handleRowClick={handleRowClick}
        />
      </div>
    </div>
  )
}

export default Page
