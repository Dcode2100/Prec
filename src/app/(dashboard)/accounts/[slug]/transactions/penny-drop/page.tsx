'use client'
import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'

import { columnsForPennyDropTransactions } from './components/columns'
import FilterDrawer from './components/FilterDrawer'
import { getAllPennyDropTransactions } from '@/lib/api/transactionsApi'
import {
    TransactionsParams,
    TransactionListObj,
    TransactionStatus,
} from '@/lib/types/types'

const PennyDropTransactionTable = () => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
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
    status: string
    amountRange: [number | null, number | null]
  }>({
    status: 'All',
    amountRange: [null, null],
  })

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

  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value)
    }, 300),
    []
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    debouncedSetSearch(value)
  }

  const fetchTransactions = async () => {
    const params: TransactionsParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    if (debouncedSearch !== '') {
      params.search = debouncedSearch
    }
    if (filters.status !== 'All') {
      params.status = filters.status
    }
    if (filters.amountRange[0] !== null) {
      params.amountAbove = filters.amountRange[0]
    }
    if (filters.amountRange[1] !== null) {
      params.amountBelow = filters.amountRange[1]
    }

    return await getAllPennyDropTransactions(params)
  }

  const handleApplyFilter = (
    amountRange: [number | null, number | null],
    status: string[],
    startDate: Moment | null,
    endDate: Moment | null
  ) => {
    setDateFilter({ startDate, endDate })
    setFilters({ status: status[0], amountRange })
  }

  const { data: transactions, isLoading } = useQuery({
    queryKey: [
      'penny-drop-transactions',
      pagination,
      dateFilter,
      debouncedSearch,
      filters,
    ],
    queryFn: fetchTransactions,
  })

  const resetFilters = () => {
    setSearch('')
    setFilters({ status: 'All', amountRange: [null, null] })
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 20, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
    filters.status !== 'All' ||
    filters.amountRange[0] !== null ||
    filters.amountRange[1] !== null ||
    pagination.common.limit !== 20 ||
    pagination.common.page !== 1

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        statusOptions={statusOptions}
        onApplyFilter={handleApplyFilter}
      />
      <h1 className="text-lg ">Penny Drop Transactions</h1>
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-3">
        <div className="w-64">
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={handleSearchChange}
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
            columnsForPennyDropTransactions() as ColumnDef<TransactionListObj>[]
          }
          data={transactions?.transactions || []}
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
          total={transactions?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}

export default PennyDropTransactionTable
