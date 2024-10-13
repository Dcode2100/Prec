'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'

import { columnsForPennyDropTransactions } from './components/table/columns'
import FilterDrawer from './components/filterDrawer'
import { getAllPennyDropTransactions } from '@/lib/api/transactionsApi'
import { TransactionsParams } from '@/lib/types/types'
import { TransactionListObj } from '@/lib/types/types'

const PennyDropTransactionPage = () => {
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
    direction: 'Recent',
    status: [],
    amountRange: [null, null],
  })

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
    if (filters.direction !== 'Recent') {
      params.direction = filters.direction
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

    return await getAllPennyDropTransactions(params)
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

  const { data: transactions, isLoading } = useQuery({
    queryKey: [
      'penny-drop-transactions',
      pagination,
      dateFilter,
      search,
      filters,
    ],
    queryFn: fetchTransactions,
  })

  const resetFilters = () => {
    setSearch('')
    setFilters({ direction: 'Recent', status: [], amountRange: [null, null] })
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 20, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
    filters.direction !== 'Recent' ||
    filters.status.length > 0 ||
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
        onApplyFilter={handleApplyFilter}
      />
      <h1 className="text-3xl font-semibold">Penny Drop Transactions</h1>
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-3">
        <div className="w-64">
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
          total={transactions?.total || 0}
          isLoading={isLoading}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}

export default PennyDropTransactionPage
