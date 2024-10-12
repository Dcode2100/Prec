'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import AccountTable from '@/components/accountTable/AccountTable'
import FilterDrawer from '@/components/accountTable/FilterDrawer'
import FilterSelect from '@/components/accountTable/FilterSelect'
import FilterDateSelect from '@/components/accountTable/FilterDateSelect'
import FilterButton from '@/components/accountTable/FilterButton'
import { getPCOrders } from '@/lib/api/ordersApi'
import { PCOrders as PCOrderType } from '@/lib/types/PcEnquiryType'
import { OrderStatus } from '@/lib/types/types'
import { capitalize } from '@/utils/utils'
import { CSVLink } from 'react-csv'
import { ColumnTable } from '@/lib/types'
import PCOrderDetails from '@/components/sheets/PCOrderDetails'

const statusOptions = [
  'All',
  OrderStatus.PAYMENT_PENDING,
  OrderStatus.SUBSCRIPTION_PROCESSING,
  OrderStatus.SUBSCRIPTION_PROCESSED,
  OrderStatus.FAILED,
]

const PCOrders: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | undefined>()
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selectedDates, setSelectedDates] = useState<
    Array<moment.Moment | null>
  >([null, null])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dataUpdate, setDataUpdate] = useState(false)

  const fetchOrders = async () => {
    const params = {
      page,
      limit,
      status: statusFilter !== 'All' ? statusFilter : undefined,
      search,
      created_after: selectedDates[0]?.utc().toISOString(),
      created_before: selectedDates[1]?.utc().toISOString(),
    }

    return await getPCOrders(params)
  }

  const ordersQuery = useQuery({
    queryKey: [
      'pcorders',
      page,
      limit,
      statusFilter,
      search,
      selectedDates,
      dataUpdate,
    ],
    queryFn: fetchOrders,
    enabled: search !== '', // Only fetch when search is not empty
  })

  const orders: PCOrderType[] = ordersQuery.data?.orders || []
  const totalItems = ordersQuery.data?.total || 0

  const columns: ColumnTable<PCOrderType>[] = [
    { header: 'Order ID', accessorKey: 'gui_id' },
    { header: 'Account ID', accessorKey: 'gui_account_id' },
    { header: 'Token', accessorKey: 'symbol' },
    { header: 'Quantity', accessorKey: 'quantity' },
    { header: 'Price', accessorKey: 'price_per_lot' },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Created At', accessorKey: 'created_at' },
  ]

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const filterPills = {
    status: capitalize(statusFilter),
    dates:
      selectedDates[0] && selectedDates[1]
        ? `${selectedDates[0].format('DD/MM/YYYY')} - ${selectedDates[1].format(
            'DD/MM/YYYY'
          )}`
        : '',
  }

  const removeFilter = (filterID: string) => {
    if (filterID === 'dates') {
      setSelectedDates([null, null])
    } else if (filterID === 'status') {
      setStatusFilter('All')
    }
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-end space-x-2 items-center">
        <div>
          <CSVLink
            data={orders}
            filename={`PCOrderData_${moment().format(
              'MMMM Do YYYY, h:mm:ss a'
            )}.csv`}
            headers={columns.map((col) => ({
              label: col.header,
              key: col.accessorKey,
            }))}
          >
            <Button disabled={orders.length === 0} className="h-8">
              Export
            </Button>
          </CSVLink>
        </div>
        <div className="flex items-center space-x-2">
          <FilterButton
            filterPills={filterPills}
            openFilter={() => setFilterOpen(true)}
            removeFilter={removeFilter}
          />
        </div>
      </div>

      <AccountTable
        columns={columns}
        data={orders}
        totalItems={totalItems}
        itemsPerPage={limit}
        currentPage={page}
        onPageChange={(newPage, newLimit) => {
          setPage(newPage)
          if (newLimit) setLimit(newLimit)
        }}
        onSearch={handleSearch}
        isSearchable={true}
        isLoading={ordersQuery.isLoading || isLoading}
        onRowClick={(row) => setSelectedOrder(row.id)}
      />

      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => {
          setPage(1)
          setFilterOpen(false)
        }}
      >
        <div className="space-y-6">
          <h2 className="text-lg font-semibold mb-4">Filter Options</h2>

          <FilterSelect
            header="Status"
            options={statusOptions}
            onSelect={setStatusFilter}
            selected={statusFilter}
          />

          <FilterDateSelect
            header="Created At"
            onDateSelect={(st, ed) => setSelectedDates([st, ed])}
          />
        </div>
      </FilterDrawer>

      {selectedOrder && (
        <PCOrderDetails
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(undefined)}
          order_id={selectedOrder}
          order={orders.find((order) => order.id === selectedOrder)}
          setLoading={setIsLoading}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
        />
      )}
    </div>
  )
}

export default PCOrders
