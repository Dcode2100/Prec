'use client'
import React, { useState, useMemo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import {
  AccountTable,
  FilterDrawer,
  FilterSelect,
  FilterButton,
  FilterNumber,
  FilterDateSelect,
} from '@/components/accountTable'
import { useQuery } from '@tanstack/react-query'
import {
  getTransactions
} from '@/lib/api/transactionsApi'
import {
  TransactionDirection,
  TransactionListObj,
  TransactionsParams,
  TransactionStatus,
} from '@/lib/types/types'
import TransactionDetails from '@/components/sheets/TransactionsDetails'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ColumnTable } from '@/lib/types'

const rangeToPill = (
  label: string,
  range: [number | null, number | null],
  isCurrency: boolean = false
): string => {
  const [min, max] = range
  if (min === null && max === null) return ''

  const formatValue = (value: number | null) => {
    if (value === null) return ''
    return isCurrency ? `₹${value.toLocaleString()}` : value.toString()
  }

  if (min !== null && max !== null) {
    return `${label}: ${formatValue(min)} - ${formatValue(max)}`
  } else if (min !== null) {
    return `${label}: ≥ ${formatValue(min)}`
  } else if (max !== null) {
    return `${label}: ≤ ${formatValue(max)}`
  }
  return ''
}

const dateRangeToPill = (
  dateRange: [moment.Moment | null, moment.Moment | null]
): string => {
  const [start, end] = dateRange
  if (!start || !end) return ''

  const formatDate = (date: moment.Moment) => date.format('MMM D, YYYY')
  return `Date: ${formatDate(start)} - ${formatDate(end)}`
}

const statusOptions = [
  'All',
  TransactionStatus.COMPLETED,
  TransactionStatus.PENDING,
  TransactionStatus.REJECTED,
  TransactionStatus.CANCELLED,
  TransactionStatus.REFUND_PENDING,
  TransactionStatus.REFUND_FAILED,
  TransactionStatus.REFUND_COMPLETED,
]

const TransactionsTable: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('recent')
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [amountFilter, setAmountFilter] = useState<
    [number | null, number | null]
  >([null, null])
  const [selectedDates, setSelectedDates] = useState<
    [moment.Moment | null, moment.Moment | null]
  >([null, null])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [selectedTransaction, setSelectedTransaction] = useState<
    string | undefined
  >(undefined)
  const [searchTerm, setSearchTerm] = useState('')

  const [loading, setLoading] = useState(false)

  const queryKeys = useMemo(
    () => [
      'transactions',
      selectedTab,
      amountFilter,
      statusFilter,
      selectedDates,
      page,
      limit,
      searchTerm,
    ],
    [
      selectedTab,
      amountFilter,
      statusFilter,
      selectedDates,
      page,
      limit,
      searchTerm,
    ]
  )

  const fetchTransactions = async () => {
    const params: TransactionsParams = {
      page,
      limit,
    }

    if (selectedTab === 'deposits') {
      params.direction = TransactionDirection.DEPOSIT
    }

    if (statusFilter && statusFilter !== 'All') {
      params.status = statusFilter
    }

    if (selectedDates[0] && selectedDates[1]) {
      params.createdAfter = selectedDates[0].utc().toISOString()
      params.createdBefore = selectedDates[1].utc().toISOString()
    }

    params.amountAbove = amountFilter[0] ?? undefined
    params.amountBelow = amountFilter[1] ?? undefined

    if (searchTerm) {
      params.search = searchTerm
    }

    return getTransactions(params)
  }

  const transactionsQuery = useQuery({
    queryKey: queryKeys,
    queryFn: fetchTransactions,
  })

  const transactions = useMemo(
    () => transactionsQuery.data?.transactions || ([] as TransactionListObj[]),
    [transactionsQuery.data]
  )

  const columns: ColumnTable<TransactionListObj>[] = [
    { header: 'Transaction ID', accessorKey: 'gui_transaction_id' },
    { header: 'Account ID', accessorKey: 'gui_account_id' },
    { header: 'Direction', accessorKey: 'direction' },
    { header: 'Amount', accessorKey: 'amount' , sortable:true},
    { header: 'Status', accessorKey: 'status' , sortable:true},
    { header: 'Created At', accessorKey: 'created_at' },
  ]

  const filterPills = {
    amount: rangeToPill('Amount', amountFilter, true),
    dates: dateRangeToPill(selectedDates),
    status: statusFilter !== 'All' ? statusFilter : '',
  }

  const removeFilter = (filterId: string) => {
    if (filterId === 'amount') {
      setAmountFilter([null, null])
    } else if (filterId === 'status') {
      setStatusFilter('All')
    } else if (filterId === 'dates') {
      setSelectedDates([null, null])
    }
  }

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setPage(1) 
  }, [])

  return (
    <>
      <TransactionDetails
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(undefined)}
        transaction_id={selectedTransaction as string}
        type={transactions.find(
          (t) => t.transaction_id === selectedTransaction
        )}
        setLoading={setLoading}
      />
      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => setFilterOpen(false)}
      >
        <FilterNumber
          header="Amount"
          minRange={0}
          maxRange={10000000}
          step={1000}
          prefix="₹"
          onChange={setAmountFilter}
        />
        <FilterSelect
          header="Status"
          options={statusOptions}
          onSelect={setStatusFilter}
          selected={statusFilter}
        />
        <FilterDateSelect
          header="Created At"
          onDateSelect={(start, end) => setSelectedDates([start, end])}
        />
      </FilterDrawer>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="deposits">Deposits</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center space-x-2">
            <CSVLink
              data={transactions}
              filename={`TransactionData_${moment().format(
                'MMMM Do YYYY, h:mm:ss a'
              )}.csv`}
            >
              <Button>Export</Button>
            </CSVLink>
            <FilterButton
              openFilter={() => setFilterOpen(true)}
              removeFilter={removeFilter}
            />
          </div>
        </div>

        <AccountTable
          columns={columns}
          data={transactions}
          totalItems={transactionsQuery.data?.total || 0}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={(newPage, newLimit) => {
            setPage(newPage)
            if (newLimit) setLimit(newLimit)
          }}
          isLoading={transactionsQuery.isLoading}
          onRowClick={(row) =>
            setSelectedTransaction(row.transaction_id as string)
          }
          isSearchable={true}
          onSearch={handleSearch}
        />
      </div>
    </>
  )
}

export default TransactionsTable
