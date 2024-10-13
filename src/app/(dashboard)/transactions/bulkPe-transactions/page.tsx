'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, RotateCcw, Sheet } from 'lucide-react'
import { columnsForBulkPeTransactions } from './components/columns'
import FilterDrawer from './components/filterDrawer'
import { getBulkPeTransactions } from '@/lib/api/transactionsApi'
import {
  BulkPeTransactionParams,
  BulkPeTransaction,
} from '@/lib/types/bulkPeType'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { Input } from '@/components/ui/input'

const BulkPeTransactionPage = () => {
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
    status: string
    paymentMode: string
    type: string
    dateFilterType: string
  }>({
    status: 'All',
    paymentMode: 'All',
    type: 'All',
    dateFilterType: 'createdAt',
  })

  const getFilteredData = () => {
    return transactions?.transactions || []
  }

  const getColumns = () => {
    return columnsForBulkPeTransactions()
  }

  const fetchTransactions = async () => {
    const params: BulkPeTransactionParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
    }

    if (search !== '') {
      params.search = search
    }

    if (dateFilter.startDate && dateFilter.endDate) {
      params.dateFilterBy = filters.dateFilterType
      params[
        filters.dateFilterType === 'updatedAt' ? 'updatedAfter' : 'createdAfter'
      ] = dateFilter.startDate.toISOString()
      params[
        filters.dateFilterType === 'updatedAt'
          ? 'updatedBefore'
          : 'createdBefore'
      ] = dateFilter.endDate.toISOString()
    }

    if (filters.status !== 'All') {
      params.status = filters.status
    }

    if (filters.paymentMode !== 'All') {
      params.payment_mode = filters.paymentMode
    }

    if (filters.type !== 'All') {
      params.type = filters.type
    }

    const data = await getBulkPeTransactions(params)
    return data
  }

  const handleApplyFilter = (
    startDate: Moment | null,
    endDate: Moment | null,
    status: string,
    paymentMode: string,
    type: string,
    dateFilterType: string
  ) => {
    setDateFilter({ startDate, endDate })
    setFilters({ status, paymentMode, type, dateFilterType })
  }

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['bulk-pe-transactions', pagination, dateFilter, search, filters],
    queryFn: () => fetchTransactions(),
  })

  const resetFilters = () => {
    setSearch('')
    setFilters({
      status: 'All',
      paymentMode: 'All',
      type: 'All',
      dateFilterType: 'createdAt',
    })
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 20, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
    filters.status !== 'All' ||
    filters.paymentMode !== 'All' ||
    filters.type !== 'All' ||
    pagination.common.limit !== 20 ||
    pagination.common.page !== 1

  const headers = [
    { label: 'Transaction ID', key: 'transaction_id' },
    { label: 'Reference ID', key: 'reference_id' },
    { label: 'Order ID', key: 'order_id' },
    { label: 'Amount', key: 'amount' },
    { label: 'Charge', key: 'charge' },
    { label: 'Gst', key: 'gst' },
    { label: 'Payment Mode', key: 'payment_mode' },
    { label: 'Type', key: 'type' },
    { label: 'Status', key: 'status' },
    { label: 'Created At', key: 'transaction_created_at' },
    { label: 'Updated At', key: 'transaction_updated_at' },
  ]

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-3">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        onApplyFilter={handleApplyFilter}
      />
      <h1 className="text-3xl font-semibold pl-1 mb-6">BulkPe Transactions</h1>
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div className="w-64">
          <Input
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {transactions && transactions.transactions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 flex items-center gap-2"
            >
              <Sheet size={16} />
              <CSVLink
                data={transactions.transactions}
                filename={`BulkPeTransactionData_${moment(new Date()).format(
                  'MMMM Do YYYY, h:mm:ss a'
                )}.csv`}
                headers={headers}
              >
                Export
              </CSVLink>
            </Button>
          )}
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
          columns={getColumns() as ColumnDef<BulkPeTransaction>[]}
          data={getFilteredData()}
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

export default BulkPeTransactionPage
