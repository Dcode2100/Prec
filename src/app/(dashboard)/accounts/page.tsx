'use client'
import React, { useMemo } from 'react'
import { DataTable } from '@/app/(dashboard)/accounts/components/data-table'
import { columns } from './components/columns'
import { useQuery } from '@tanstack/react-query'
import { getAccounts } from '@/lib/api/accountApi'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import {
  setSearch,
  setAccountType,
  setPage,
} from '@/lib/redux/slices/accountsSlice'
import { AccountResponse, NominatorAccountResponse } from '@/lib/types/types'
import { AccountTable } from '@/components/AccountTable'
import { AccountTable } from '@/components/accountTable/AccountTable'
interface AccountParams {
  page: number
  limit: number
  search?: string
  pcActive?: boolean
  status?: 'ACTIVE' | 'COMPLETE' | 'PENDING'
}

const fetchAccounts = async (
  search: string,
  accountType: string,
  page: number
) => {
  const params: AccountParams = {
    page,
    limit: 65,
  }

  if (search.length > 1) {
    params.search = search

    if (accountType !== 'all') {
      switch (accountType) {
        case 'true':
          params.pcActive = true
          break
        case 'false':
          params.pcActive = false
          break
        case 'ACTIVE':
        case 'COMPLETE':
        case 'PENDING':
          params.status = accountType as 'ACTIVE' | 'COMPLETE' | 'PENDING'
          break
      }
    }
    const data = await getAccounts(params)
    return data
  } else {
    if (accountType === 'true' || accountType === 'false') {
      params.pcActive = accountType === 'true'
      const data = await getAccounts(params)
      return data
    }
  }
  return { accounts: [], total: 0 }
}

const Page = () => {
  const dispatch = useDispatch()
  const { search, accountType, page } = useSelector(
    (state: RootState) => state.accounts
  )

  const queryKey = useMemo(
    () => ['accountData', search, accountType, page],
    [search, accountType, page]
  )
  const {
    data: accountDetails,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchAccounts(search, accountType, page),
  })
  const total = accountDetails?.total || 0

  const handleSearchChange = (value: string) => {
    dispatch(setSearch(value))
  }

  const handleAccountTypeChange = (value: string) => {
    dispatch(setAccountType(value))
    dispatch(setSearch(''))
  }

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage))
  }



  return (
    <div className="parent-wrapper w-full h-full flex flex-col">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <DataTable
          columns={columns}
          data={accountDetails?.accounts || []}
          search={search}
          onSearchChange={handleSearchChange}
          page={page}
          onPageChange={handlePageChange}
          total={total}
          accountType={accountType}
          onAccountTypeChange={handleAccountTypeChange}
          isLoading={isLoading}
          // dateRange={dateRange} 
          // onDateRangeChange={handleDateRangeChange} 
        />
      </div>
    </div>
  )
}

export default Page
