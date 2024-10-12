'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'

import { columnsForAccountingTransactions } from './components/columns'
import FilterDrawer from './components/filterDrawer'
import { getDailyWalletBalance } from '@/lib/api/transactionsApi'
import { TransactionsParams, DaywiseTransaction } from '@/lib/types/types'
import { Card } from '@/components/ui/card'
import { getNumberInRupee } from '@/utils/utils'
import Stat from '@/components/stat'
import moment from 'moment'

const AccountingTable = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [openDrawer, setOpenDrawer] = useState(false)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>({
    startDate: moment().subtract(9, 'days').startOf('day'),
    endDate: moment().subtract(1, 'days').endOf('day'),
  })
  const filters = 'All';
  
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
    if (filters !== 'All') {
      params.direction = filters
    }

    return await getDailyWalletBalance(params)
  }

  const handleApplyFilter = (
    startDate: Moment | null,
    endDate: Moment | null,
  ) => {
    setDateFilter({ startDate, endDate })
  }

  const { data: transactions, isLoading } = useQuery({
    queryKey: [
      'accounting-transactions',
      pagination,
      dateFilter,
      search,
      filters,
    ],
    queryFn: fetchTransactions,
  })

  const resetFilters = () => {
    setSearch('')
    setDateFilter({ startDate: moment().subtract(9, 'days').startOf('day'), endDate: moment().subtract(1, 'days').endOf('day') })
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
    pagination.common.limit !== 10 ||
    pagination.common.page !== 1

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        onApplyFilter={handleApplyFilter}
      />
      <h1 className="text-3xl font-semibold">Accounting</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-8 w-full">
        <Card>
          <Stat
            stat={getNumberInRupee(transactions?.wallet_balance)}
            statInfo="Wallet Balance"
          />
        </Card>
        <Card>
          <Stat
            stat={getNumberInRupee(transactions?.credit_amount)}
            statInfo="Credit Amount"
          />
        </Card>
        <Card>
          <Stat
            stat={getNumberInRupee(transactions?.debit_amount)}
            statInfo="Debit Amount"
          />
        </Card>
        <Card>
          <Stat
            stat={getNumberInRupee(transactions?.withdraw_amount)}
            statInfo="Withdraw Amount"
          />
        </Card>
        <Card>
          <Stat
            stat={getNumberInRupee(transactions?.order_amount)}
            statInfo="Order Amount"
          />
        </Card>
        <Card>
          <Stat
            stat={getNumberInRupee(transactions?.opening_balance)}
            statInfo="Opening Balance"
          />
        </Card>
      </div>
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
          columns={columnsForAccountingTransactions() as ColumnDef<DaywiseTransaction>[]}
          data={transactions?.daywise_transaction_data || []}
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
          total={transactions?.count || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}

export default AccountingTable