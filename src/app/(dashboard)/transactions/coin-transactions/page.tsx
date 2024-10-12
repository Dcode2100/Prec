'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, RotateCcw } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'

import { columnsForCoinTransactions } from './components/columns'
import FilterDrawer from './components/filterDrawer'
import { getAllCoinTransactions } from '@/lib/api/transactionsApi'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { TransactionsParams } from '@/lib/types/types'
import { WalletTransactionsResponse } from '@/lib/types/walletType'

const CoinTransactionPage = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    common: { limit: 20, page: 1 },
  })
  const [openDrawer, setOpenDrawer] = useState(false)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>({
    startDate: null,
    endDate: null,
  })
  const [filters, setFilters] = useState<{
    direction: string
    status: string[]
    amountRange: [number | null, number | null]
  }>({
    direction: 'All',
    status: [],
    amountRange: [null, null],
  })

  const [activeTab, setActiveTab] = useState<'all' | 'credit' | 'debit'>('all')

  const fetchTransactions = async () => {
    const params: TransactionsParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }

    if (search !== '') {
      params.search = search
    }

    if (activeTab !== 'all') {
      params.direction = activeTab.toUpperCase()
    }

    if (filters.status.length > 0) {
      params.status = filters.status.join(',')
    }
    if (filters.amountRange[0] !== null) {
      params.amountAbove = filters.amountRange[0]
    }
    if (filters.amountRange[1] !== null) {
      params.amountBelow = filters.amountRange[1]
    }

    const data = await getAllCoinTransactions(params)
    return data
  }

  const handleApplyFilter = (
    startDate: Moment | null,
    endDate: Moment | null,
    direction: string,
    status: string[],
    amountRange: [number | null, number | null]
  ) => {
    setDateFilter({ startDate, endDate })
    setFilters({ direction, status, amountRange })
  }

  const { data: transactionsQuery, isLoading } = useQuery({
    queryKey: [
      'all-coin-transactions',
      pagination,
      dateFilter,
      search,
      filters,
      activeTab,
    ],
    queryFn: () => fetchTransactions(),
  })

  const resetFilters = () => {
    setSearch('')
    setFilters({ direction: 'All', status: [], amountRange: [null, null] })
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 20, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
    filters.direction !== 'All' ||
    filters.status.length > 0 ||
    filters.amountRange[0] !== null ||
    filters.amountRange[1] !== null ||
    pagination.common.limit !== 20 ||
    pagination.common.page !== 1

  const headers = [
    { label: 'Transaction ID', key: 'gui_transaction_id' },
    { label: 'Account ID', key: 'gui_account_id' },
    { label: 'First Name', key: 'first_name' },
    { label: 'Last name', key: 'last_name' },
    { label: 'Email', key: 'email' },
    { label: 'Mobile', key: 'mobile' },
    { label: 'Direction', key: 'direction' },
    { label: 'Coins', key: 'coins' },
    { label: 'Reward Type', key: 'reward_type' },
    { label: 'Status', key: 'status' },
    { label: 'Description', key: 'description' },
    { label: 'Created At', key: 'created_at' },
  ]

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        onApplyFilter={handleApplyFilter}
      />
      <h1 className="text-3xl font-semibold mb-6">Coin Transactions</h1>
      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as 'all' | 'credit' | 'debit')
        }
        className="w-full"
      >
        <TabsList className="mb-2 ml-1">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="credit">Credit</TabsTrigger>
          <TabsTrigger value="debit">Debit</TabsTrigger>
        </TabsList>
        <TabsContent value="all">{renderTableContent()}</TabsContent>
        <TabsContent value="credit">{renderTableContent()}</TabsContent>
        <TabsContent value="debit">{renderTableContent()}</TabsContent>
      </Tabs>
    </div>
  )

  function renderTableContent() {
    return (
      <>
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center px-1">
          <div className=" w-64 ">
            <Input
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
            {transactionsQuery?.PE && (
              <Button size="sm" variant="outline" className="h-8">
                <CSVLink
                  data={transactionsQuery?.PE || []}
                  filename={`CoinTransactionData_${moment(new Date()).format(
                    'MMMM Do YYYY, h:mm:ss a'
                  )}.csv`}
                  headers={headers}
                >
                  Export
                </CSVLink>
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
            columns={
              columnsForCoinTransactions() as ColumnDef<WalletTransactionsResponse>[]
            }
            data={transactionsQuery?.PE || []}
            enableSearch={false}
            enableDropdown={false}
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
            total={transactionsQuery?.total || 0}
            isLoading={isLoading}
            refetch={() => {}}
            onRowClick={() => {}}
          />
        </div>
      </>
    )
  }
}

export default CoinTransactionPage
