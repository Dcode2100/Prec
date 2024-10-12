'use client'
import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { CSVLink } from 'react-csv'
import { Button } from '@/components/ui/button'
import AccountTable from '@/components/accountTable/AccountTable'
import { FilterNumber, FilterDateSelect } from '@/components/accountTable'
import FilterDrawer from '@/components/accountTable/FilterDrawer'
import { OrderResponse, OrdersParams } from '@/lib/types/types'
import { getSellOrders } from '@/lib/api/ordersApi'
import { ColumnTable } from '@/lib/types'
import FilterButton from '@/components/accountTable/FilterButton'

const headers = [
  { label: 'Order ID', key: 'gui_order_id' },
  { label: 'Account ID', key: 'gui_account_id' },
  { label: 'Side', key: 'side' },
  { label: 'Token', key: 'symbol' },
  { label: 'Quantity', key: 'quantity' },
  { label: 'Status', key: 'status' },
  { label: 'Created At', key: 'created_at' },
]

const SellOrders = (): React.ReactElement => {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [qtyFilter, setQtyFilter] = useState<Array<number | null>>([null, null])
  const [selectedDates, setSelectedDates] = useState<
    Array<moment.Moment | null>
  >([null, null])
  const [applyFilter, setApplyFilter] = useState(false)

  const fetchOrders = async () => {
    const params: OrdersParams = {
      page,
      limit,
      search,
      qtyStart: qtyFilter[0] ?? undefined,
      qtyEnd: qtyFilter[1] ?? undefined,
      createdAfter: selectedDates[0]?.utc().toISOString(),
      createdBefore: selectedDates[1]?.utc().toISOString(),
    }

    return await getSellOrders(params)
  }

  const ordersQuery = useQuery({
    queryKey: ['sell-orders', page, limit, search, qtyFilter, selectedDates],
    queryFn: fetchOrders,
  })

  const orders = useMemo(
    () => ordersQuery?.data?.orders || [],
    [ordersQuery?.data]
  )

  const columns: ColumnTable<OrderResponse>[] = [
    { header: 'Order ID', accessorKey: 'gui_order_id', sortable: true },
    { header: 'Account ID', accessorKey: 'gui_account_id', sortable: true },
    { header: 'Side', accessorKey: 'side', sortable: true },
    { header: 'Token', accessorKey: 'symbol', sortable: true },
    { header: 'Quantity', accessorKey: 'quantity', sortable: true },
    { header: 'Status', accessorKey: 'status', sortable: true },
    { header: 'Created At', accessorKey: 'created_at', sortable: true },
  ]

  const handlePageChange = (newPage: number, newLimit?: number) => {
    setPage(newPage)
    if (newLimit) setLimit(newLimit)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRowClick = (row: OrderResponse) => {
    router.push(`/orders/${row.order_id}`)
  }

  const filterPills = {
    qty: qtyFilter[0] !== null || qtyFilter[1] !== null
      ? `Quantity: ${qtyFilter[0] || ''} - ${qtyFilter[1] || ''}`
      : '',
    dates:
      selectedDates[0] && selectedDates[1]
        ? `${selectedDates[0].format('DD/MM/YYYY')} - ${selectedDates[1].format(
            'DD/MM/YYYY'
          )}`
        : '',
  }

  const removeFilter = (filterID: string) => {
    switch (filterID) {
      case 'qty':
        setQtyFilter([null, null])
        break
      case 'dates':
        setSelectedDates([null, null])
        break
    }
  }

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Orders - Sell</h1>

      <div className="flex justify-end items-center space-x-2">
        <CSVLink
          data={orders}
          filename={`OrderData_${moment(new Date()).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}.csv`}
          headers={headers}
        >
          <Button disabled={orders.length === 0} className='h-8'>
            Export
          </Button>
        </CSVLink>
        <FilterButton
          filterPills={filterPills}
          openFilter={() => setFilterOpen(true)}
          removeFilter={removeFilter}
        />
      </div>

      <AccountTable
        columns={columns}
        data={orders}
        totalItems={ordersQuery.data?.total || 0}
        itemsPerPage={limit}
        currentPage={page}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        isSearchable={true}
        isLoading={ordersQuery.isLoading}
        onRowClick={handleRowClick}
      />

      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => {
          setApplyFilter(true)
          setPage(1)
          setFilterOpen(false)
        }}
      >
        <div className="space-y-4">
          <FilterNumber
            header="Quantity"
            minRange={0}
            maxRange={10000}
            step={100}
            onChange={setQtyFilter}
          />

          <FilterDateSelect
            header="Created At"
            onDateSelect={(st, ed) => setSelectedDates([st, ed])}
          />
        </div>
      </FilterDrawer>
    </div>
  )
}

export default SellOrders
