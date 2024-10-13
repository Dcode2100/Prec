'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { CSVLink } from 'react-csv'
import { FilterIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/CustomTable/data-table'
import { getAccounts } from '@/lib/api/accountApi'
import {
  AccountResponse,
  AccountsParams,
  AccountStatus,
} from '@/lib/types/types'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import { columnsForAccounts } from './components/columns'
import {
  getHeadersForCSV,
  accountsToTableRowsCSV,
} from './components/exportcsv'
import FilterDrawer from './components/FilterDrawer'
import { ColumnDef } from '@tanstack/react-table'

const AccountsPage = () => {
  const [selectedTab, setSelectedTab] = useState('all')
  const router = useRouter()

  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 600)

  const { currentPage, itemsPerPage, onPageChange } = usePagination({
    initialPage: 1,
    initialLimit: 10,
  })

  const [createdAtRange, setCreatedAtRange] = useState<
    [Date | null, Date | null]
  >([null, null])
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [dobDate, setDobDate] = useState<Date | undefined>(undefined)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [tempCreatedAtRange, setTempCreatedAtRange] = useState<
    [Date | null, Date | null]
  >([null, null])
  const [tempExpiryDate, setTempExpiryDate] = useState<Date | undefined>(
    undefined
  )
  const [tempDobDate, setTempDobDate] = useState<Date | undefined>(undefined)

  const fetchAccounts = useMemo(
    () => async () => {
      const params: AccountsParams = {
        status: statusFilter !== 'All' ? statusFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        createdAfter: createdAtRange[0]
          ? moment(createdAtRange[0]).toISOString()
          : undefined,
        createdBefore: createdAtRange[1]
          ? moment(createdAtRange[1]).toISOString()
          : undefined,
        evaluationExpiryDate: expiryDate
          ? moment(expiryDate).toISOString()
          : undefined,
        dob: dobDate ? moment(dobDate).toISOString() : undefined,
      }
      return await getAccounts(params)
    },
    [
      statusFilter,
      currentPage,
      itemsPerPage,
      debouncedSearch,
      createdAtRange,
      expiryDate,
      dobDate,
    ]
  )

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: [
      'accounts',
      statusFilter,
      currentPage,
      itemsPerPage,
      debouncedSearch,
      createdAtRange,
      expiryDate,
      dobDate,
    ],
    queryFn: fetchAccounts,
    enabled: !(
      ['All', 'ACTIVE', 'COMPLETE', 'PENDING'].includes(statusFilter) &&
      !debouncedSearch
    ),
  })

  const accounts = useMemo(
    () => data?.accounts || ([] as AccountResponse[]),
    [data]
  )

  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    let status = 'All'
    if (value === 'active') status = AccountStatus.ACTIVE
    else if (value === 'completed') status = AccountStatus.COMPLETE
    else if (value === 'pending') status = AccountStatus.PENDING
    else if (value === 'pc-active') status = AccountStatus.PC_ACTIVE
    else if (value === 'pc-inactive') status = AccountStatus.PC_INACTIVE
    onPageChange(1)
    setStatusFilter(status)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    onPageChange(1)
  }

  const handleApplyFilters = () => {
    setCreatedAtRange(tempCreatedAtRange)
    setExpiryDate(tempExpiryDate)
    setDobDate(tempDobDate)
    setIsFilterOpen(false)
    refetch()
  }

  const handleRemoveFilters = () => {
    setCreatedAtRange([null, null])
    setExpiryDate(undefined)
    setDobDate(undefined)
    setTempCreatedAtRange([null, null])
    setTempExpiryDate(undefined)
    setTempDobDate(undefined)
    refetch()
  }

  const isFiltersApplied =
    createdAtRange[0] !== null ||
    createdAtRange[1] !== null ||
    expiryDate !== undefined ||
    dobDate !== undefined

  return (
    <div className="container min-w-full relative w-full bg-background rounded-lg p-4">
      <h3 className="mb-4">Accounts</h3>
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="pc-active">PC Active</TabsTrigger>
            <TabsTrigger value="pc-inactive">PC Inactive</TabsTrigger>
          </TabsList>
        </div>
        <div className="flex items-center mt-3 justify-between">
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-64"
          />
          <div className="flex items-center space-x-2">
            {accounts.length > 0 && (
              <CSVLink
                data={accountsToTableRowsCSV(accounts as AccountResponse[])}
                filename={`AccountsData_${moment().format(
                  'MMMM Do YYYY, h:mm:ss a'
                )}.csv`}
                headers={getHeadersForCSV()}
              >
                <Button className="h-9 px-4">Export</Button>
              </CSVLink>
            )}
            {isFiltersApplied && (
              <Button
                variant="outline"
                className="h-9 px-4"
                onClick={handleRemoveFilters}
              >
                <X className="w-4 h-4 mr-2" />
                Remove Filters
              </Button>
            )}
            <Button className="h-9 px-4" onClick={() => setIsFilterOpen(true)}>
              <FilterIcon className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
        <TabsContent value={selectedTab}>
          <DataTable
            columns={columnsForAccounts() as ColumnDef<AccountResponse>[]}
            data={accounts as AccountResponse[]}
            total={data?.total || 0}
            limit={itemsPerPage}
            page={currentPage}
            onPageChange={onPageChange}
            onRowChange={() => onPageChange(1)}
            isLoading={isLoading || isFetching}
            onRowClick={(row) => {
              const accountType =
                row.type === 'Broking' ? 'BK' : row.type === 'MF' ? 'MF' : 'PE'
              router.push(`/accounts/${accountType}-${row.account_id}`)
            }}
          />
        </TabsContent>
      </Tabs>

      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        tempCreatedAtRange={tempCreatedAtRange}
        setTempCreatedAtRange={setTempCreatedAtRange}
        tempExpiryDate={tempExpiryDate}
        setTempExpiryDate={setTempExpiryDate}
        tempDobDate={tempDobDate}
        setTempDobDate={setTempDobDate}
      />
    </div>
  )
}

export default AccountsPage
