'use client'

import React, { useState, useMemo } from 'react'
import { AccountTable } from '@/components/accountTable/AccountTable'
import { ColumnDef } from '@tanstack/react-table'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangePicker } from '@/components/DateRangePicker'
import { getAccountWishlist, getAccountPcWishlist } from '@/lib/api/wishlistApi'
import { getTokens, getAssetsForPC } from '@/lib/api/ordersApi'
import { DateRange } from 'react-day-picker'

const WishlistTable = (): React.ReactElement => {
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const accountType = parts[0]
  const accountId = parts.slice(1).join('-')
  const [activeTab, setActiveTab] = useState('general')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)

  const [generalFilterOpen, setGeneralFilterOpen] = useState(false)
  const [pcFilterOpen, setPcFilterOpen] = useState(false)
  const [generalCompanyFilter, setGeneralCompanyFilter] =
    useState<string>('All')
  const [pcCompanyFilter, setPcCompanyFilter] = useState<string>('All')
  const [generalDateRange, setGeneralDateRange] = useState<
    DateRange | undefined
  >()
  const [pcDateRange, setPcDateRange] = useState<DateRange | undefined>()
  const [generalApplyFilter, setGeneralApplyFilter] = useState(false)
  const [pcApplyFilter, setPcApplyFilter] = useState(false)

  const { data: tokens } = useQuery({
    queryKey: ['tokens'],
    queryFn: getTokens,
  })
  const { data: pcAssets } = useQuery({
    queryKey: ['pcAssets'],
    queryFn: () => getAssetsForPC({ state: 'all', status: 'All' }),
  })

  const generalFilterParams = useMemo(() => {
    if (!generalApplyFilter) return {}
    const params: any = {}
    if (generalCompanyFilter !== 'All') params.token = generalCompanyFilter
    if (generalDateRange?.from)
      params.createdAfter = generalDateRange.from.toISOString()
    if (generalDateRange?.to)
      params.createdBefore = generalDateRange.to.toISOString()
    return params
  }, [generalApplyFilter, generalCompanyFilter, generalDateRange])

  const pcFilterParams = useMemo(() => {
    if (!pcApplyFilter) return {}
    const params: any = {}
    if (pcCompanyFilter !== 'All') params.name = pcCompanyFilter
    if (pcDateRange?.from) params.createdAfter = pcDateRange.from.toISOString()
    if (pcDateRange?.to) params.createdBefore = pcDateRange.to.toISOString()
    return params
  }, [pcApplyFilter, pcCompanyFilter, pcDateRange])
  const {
    data: peData,
    isLoading: peLoading,
    error: peError,
    refetch: peRefetch,
  } = useQuery({
    queryKey: ['pe-wishlists', accountId, page, limit],
    queryFn: () =>
      getAccountWishlist(accountId, accountType, {
        page,
        limit,
        ...generalFilterParams,
      }),
  })

  const {
    data: pcData,
    isLoading: pcLoading,
    error: pcError,
    refetch: pcRefetch,
  } = useQuery({
    queryKey: ['pc-wishlists', accountId, page, limit, pcFilterParams],
    queryFn: () =>
      getAccountPcWishlist(accountId, { page, limit, ...pcFilterParams }),
  })

  const PEColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'token',
      header: 'Token',
    },
    {
      accessorKey: 'name',
      header: 'Name',
    },
    { accessorKey: 'gui_account_id', header: 'Account Id' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'mobile', header: 'Mobile' },
    {
      accessorKey: 'notify',
      header: 'Notified',
      cell: (value) => (value ? 'Yes' : 'No'),
    },
  ]

  const PCColumns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Token',
    },
    {
      accessorKey: 'first_name',
      header: 'Name',
    },
    {
      accessorKey: 'gui_account_id',
      header: 'Account Id',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'mobile',
      header: 'Mobile',
    },
    {
      accessorKey: 'notify',
      header: 'Notified',
      cell: (value) => (value ? 'Yes' : 'No'),
    },
  ]

  const FilterDrawer = ({ isOpen, onClose, onApply, children }: any) => (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold mb-4">Filter Options</SheetTitle>
        </SheetHeader>
        <div className="space-y-6">
          {children}
          <div className="flex justify-end">
            <Button onClick={onApply} className="w-full sm:w-auto">Apply Filters</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
      <Tabs
        defaultValue="general"
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="flex justify-between">
          <TabsList className="mb-4">
            <TabsTrigger value="general">PE Wishlist</TabsTrigger>
            <TabsTrigger value="pc">PC Wishlist</TabsTrigger>
          </TabsList>
          {activeTab === 'general' && (
            <Button
              variant="outline"
              onClick={() => setGeneralFilterOpen(true)}
              className="mb-4"
            >
              Filter
            </Button>
          )}
          {activeTab === 'pc' && (
            <Button
              variant="outline"
              onClick={() => setPcFilterOpen(true)}
              className="mb-4"
            >
              Filter
            </Button>
          )}
        </div>
        <TabsContent value="general">
          <FilterDrawer
            isOpen={generalFilterOpen}
            onClose={() => setGeneralFilterOpen(false)}
            onApply={() => {
              setGeneralApplyFilter(true)
              setGeneralFilterOpen(false)
            }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="company-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Company
                </label>
                <Select
                  value={generalCompanyFilter}
                  onValueChange={setGeneralCompanyFilter}
                >
                  <SelectTrigger id="company-select" className="w-full">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {tokens?.data.map((token: any) => (
                      <SelectItem key={token.token} value={token.token}>
                        {token.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <DateRangePicker
                  date={generalDateRange}
                  onDateChange={setGeneralDateRange}
                />
              </div>
            </div>
          </FilterDrawer>
          {peError && (
            <p className="text-red-500 mb-4">
              Error loading general wishlist data
            </p>
          )}
          <AccountTable
            columns={PEColumns}
            data={peData || []}
            totalItems={peData?.total || 0}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={(newPage, newLimit) => {
              setPage(newPage)
              if (newLimit) setLimit(newLimit)
            }}
            isLoading={peLoading}
          />
        </TabsContent>

        <TabsContent value="pc">
          <FilterDrawer
            isOpen={pcFilterOpen}
            onClose={() => setPcFilterOpen(false)}
            onApply={() => {
              setPcApplyFilter(true)
              setPcFilterOpen(false)
            }}
          >
            <div className="space-y-4">
              <div>
                <label htmlFor="pc-company-select" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Company
                </label>
                <Select value={pcCompanyFilter} onValueChange={setPcCompanyFilter}>
                  <SelectTrigger id="pc-company-select" className="w-full">
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {pcAssets?.data?.assets?.map((asset: any) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <DateRangePicker date={pcDateRange} onDateChange={setPcDateRange} />
              </div>
            </div>
          </FilterDrawer>
          {pcError && (
            <p className="text-red-500 mb-4">Error loading PC wishlist data</p>
          )}
          <AccountTable
            columns={PCColumns}
            data={pcData || []}
            totalItems={pcData?.total || 0}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={(newPage, newLimit) => {
              setPage(newPage)
              if (newLimit) setLimit(newLimit)
            }}
            isLoading={pcLoading}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default WishlistTable