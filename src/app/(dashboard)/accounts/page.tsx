'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AccountTable } from '@/components/accountTable/AccountTable'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { getAccounts } from '@/lib/api/accountApi'
import {
  AccountResponse,
  AccountsParams,
  AccountStatus,
} from '@/lib/types/types'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { getGlobalItem } from '@/utils/utils'
import { useDebounce } from '@/hooks/useDebounce'
import { usePagination } from '@/hooks/usePagination'
import { useQuery } from '@tanstack/react-query'
import FilterDateSelect from '@/components/accountTable/FilterDateSelect'
import { DatePicker } from '@/components/DatePicker'
import { FilterIcon, X } from 'lucide-react' // Add this import
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const AccountsPage = () => {
  const [selectedTab, setSelectedTab] = useState('all')
  const router = useRouter()
  const { toast } = useToast()

  const [statusFilter, setStatusFilter] = useState('All')
  const [exportData, setExportData] = useState<AccountResponse[]>([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const isAffiliate = getGlobalItem('isAffiliate')
  const isAdminUser = getGlobalItem('type') === 'ADMIN'

  const { currentPage, itemsPerPage, onPageChange } = usePagination({
    initialPage: 1,
    initialLimit: 10,
  })

  const [createdAtRange, setCreatedAtRange] = useState<[Date | null, Date | null]>([null, null])
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [dobDate, setDobDate] = useState<Date | undefined>(undefined)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const [tempCreatedAtRange, setTempCreatedAtRange] = useState<[Date | null, Date | null]>([null, null])
  const [tempExpiryDate, setTempExpiryDate] = useState<Date | undefined>(undefined)
  const [tempDobDate, setTempDobDate] = useState<Date | undefined>(undefined)

  const fetchAccounts = useMemo(
    () => async () => {
      const params: AccountsParams = {
        status: statusFilter !== 'All' ? statusFilter : undefined,
        page: currentPage,
        limit: itemsPerPage,
        search: debouncedSearch || undefined,
        createdAfter: createdAtRange[0] ? moment(createdAtRange[0]).toISOString() : undefined,
        createdBefore: createdAtRange[1] ? moment(createdAtRange[1]).toISOString() : undefined,
        evaluationExpiryDate: expiryDate ? moment(expiryDate).toISOString() : undefined,
        dob: dobDate ? moment(dobDate).toISOString() : undefined,
      }
      return await getAccounts(params)
    },
    [statusFilter, currentPage, itemsPerPage, debouncedSearch, createdAtRange, expiryDate, dobDate]
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
    select: (data) => ({
      ...data,
      accounts: data?.accounts?.map((account: AccountResponse) => ({
        ...account,
        created_at: moment(account.created_at).format('YYYY-MM-DD HH:mm:ss'),
        evaluation_expiry_date: moment(account.evaluation_expiry_date).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
      })),
    }),
  })

  const accounts = useMemo(
    () => data?.accounts || ([] as AccountResponse[]),
    [data]
  )

  useEffect(() => {
    setExportData(
      accounts.map((row: AccountResponse) => ({
        ...row,
        created_at: moment(row?.created_at).format('YYYY-MM-DD HH:mm:ss'),
        evaluation_expiry_date: moment(row?.evaluation_expiry_date).format(
          'YYYY-MM-DD HH:mm:ss'
        ),
      }))
    )
  }, [accounts])

  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    let status = 'All'
    if (value === 'active') status = AccountStatus.ACTIVE
    else if (value === 'completed') status = AccountStatus.COMPLETE
    else if (value === 'pending') status = AccountStatus.PENDING
    else if (value === 'pc-active') status = AccountStatus.PC_ACTIVE
    else if (value === 'pc-inactive') status = AccountStatus.PC_INACTIVE
    onPageChange(1) // Reset to first page when changing tabs
    setStatusFilter(status)
  }
  interface column<T> {
    header: string
    accessorKey: keyof T
    cell?: (value: any, row: T) => React.ReactNode
    sortable?: boolean
  }

  const columns :column<AccountResponse>[] = [
        { header: 'Account ID', accessorKey: 'gui_account_id' },
        { header: 'Name', accessorKey: 'first_name' ,sortable: true},
        { header: 'Mobile', accessorKey: 'mobile'},
        { header: 'Email', accessorKey: 'email' },
        { header: 'Balance', accessorKey: 'wallet_balance' ,sortable: true},
        { header: 'Withdraw', accessorKey: 'withdraw_balance' ,sortable: true},
        { header: 'Tracker', accessorKey: 'onboarding_tracker' ,sortable: true},
        { header: 'Status', accessorKey: 'status' ,sortable: true},
        { header: 'Created At', accessorKey: 'created_at' ,sortable: true},
      ]

  const handleSearch = (value: string) => {
    setSearch(value)
    onPageChange(1) // Reset to first page when searching
  }

  const handleApplyFilters = () => {
    setCreatedAtRange(tempCreatedAtRange)
    setExpiryDate(tempExpiryDate)
    setDobDate(tempDobDate)
    setIsFilterOpen(false) // Close the sheet
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

  const isFiltersApplied = createdAtRange[0] !== null || createdAtRange[1] !== null || expiryDate !== undefined || dobDate !== undefined

  return (
    <div className="container min-w-full relative w-full bg-background rounded-lg p-4 mb-2">
      <h3 className="mb-4 ">Accounts</h3>
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="pc-active">PC Active</TabsTrigger>
            <TabsTrigger value="pc-inactive">PC Inactive</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            {accounts.length > 0 && (
              <CSVLink
                data={exportData}
                filename={`AccountsData_${moment().format(
                  'MMMM Do YYYY, h:mm:ss a'
                )}.csv`}
              >
                <Button>Export</Button>
              </CSVLink>
            )}
            {isFiltersApplied && (
              <Button variant="outline" onClick={handleRemoveFilters}>
                <X className="w-4 h-4 mr-2" />
                Remove Filters
              </Button>
            )}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button onClick={() => setIsFilterOpen(true)}>
                  <FilterIcon className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <FilterDateSelect
                    header="Created Date Range"
                    onDateSelect={(start, end) => {
                      setTempCreatedAtRange([start?.toDate() || null, end?.toDate() || null])
                    }}
                  />
                  <div className="space-y-2">
                    <h4>Expiry Date</h4>
                    <DatePicker
                      date={tempExpiryDate}
                      setDate={(date) => setTempExpiryDate(date)}
                      placeholder="Select expiry date"
                      showTime={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <h4>Date of Birth</h4>
                    <DatePicker
                      date={tempDobDate}
                      setDate={(date) => setTempDobDate(date)}
                      placeholder="Select date of birth"
                    />
                  </div>
                  <Button onClick={handleApplyFilters} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <TabsContent value={selectedTab}>
          <AccountTable
            columns={columns}
            data={accounts}
            totalItems={data?.total || 0}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={onPageChange}
            isLoading={isLoading || isFetching}
            onRowClick={(row) => {
              const accountType =
                row.type === 'PE'
              router.push(`/accounts/${accountType}-${row.account_id}`)
            }}
            isSearchable={true}
            onSearch={handleSearch}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AccountsPage