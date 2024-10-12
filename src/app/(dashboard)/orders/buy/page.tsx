'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import AccountTable from '@/components/accountTable/AccountTable'
import FilterDrawer from '@/components/accountTable/FilterDrawer'
import FilterSelect from '@/components/accountTable/FilterSelect'
import FilterNumber from '@/components/accountTable/FilterNumber'
import FilterDateSelect from '@/components/accountTable/FilterDateSelect'
import { getOrders, getTokens } from '@/lib/api/ordersApi'
import { OrderResponse, OrderStatus } from '@/lib/types/types'
import { capitalize } from '@/utils/utils'
import { CSVLink } from 'react-csv'
import { ColumnTable } from '@/lib/types'
import { TokenResponse } from '@/lib/types/types'

const statusOptions = [
  'All',
  OrderStatus.COMPLETED,
  OrderStatus.PENDING,
  OrderStatus.CANCELLED,
  OrderStatus.TRANSFER_PENDING,
  OrderStatus.VERIFICATION_PENDING,
  OrderStatus.DISPATCHED,
  OrderStatus.REJECTED,
]

const BuyOrdersPage = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | undefined>()
  const [filterOpen, setFilterOpen] = useState(false)
  const [sideFilter, setSideFilter] = useState('Buy')
  const [companyToken, setCompanyToken] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [qtyFilter, setQtyFilter] = useState<Array<number | null>>([null, null])
  const [selectedDates, setSelectedDates] = useState<
    Array<moment.Moment | null>
  >([null, null])
  const [companyFilter, setCompanyFilter] = useState<string>('All')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  const [tokens, setTokens] = useState<TokenResponse[]>([])

  const fetchOrders = async () => {
    if (!search.trim()) {
      return { orders: [], total: 0 }
    }

    const params = {
      page,
      limit,
      side: sideFilter !== 'All' ? sideFilter : '',
      status: statusFilter !== 'All' ? statusFilter : undefined,
      search,
      qtyStart: qtyFilter[0] ?? undefined,
      qtyEnd: qtyFilter[1] ?? undefined,
      asset_id: companyFilter !== 'All' ? companyFilter : undefined,
      createdAfter: selectedDates[0]?.utc().toISOString(),
      createdBefore: selectedDates[1]?.utc().toISOString(),
    }

    return await getOrders(params)
  }

  const ordersQuery = useQuery({
    queryKey: [
      'orders',
      page,
      limit,
      sideFilter,
      statusFilter,
      search,
      qtyFilter,
      companyFilter,
      selectedDates,
    ],
    queryFn: fetchOrders,
    // Disable the query when search is empty
    enabled: !!search.trim(),
  })

  const getToken = async () => {
    const data = await getTokens()
    setTokens(data)
    setCompanyToken(data.map((token) => token.symbol))
    return data
  }
  const tokenQuery = useQuery({
    queryKey: ['tokens'],
    queryFn: getToken,
  })
  const orders = ordersQuery.data?.orders || []
  const totalItems = ordersQuery.data?.total || 0

  const columns: ColumnTable<OrderResponse>[] = [
    { header: 'Order ID', accessorKey: 'gui_order_id' },
    { header: 'Account ID', accessorKey: 'gui_account_id' },
    { header: 'Side', accessorKey: 'side' },
    { header: 'Token', accessorKey: 'symbol' },
    { header: 'Quantity', accessorKey: 'quantity' },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Created At', accessorKey: 'created_at' },
  ]

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleFilter = (key: string, value: string) => {
    setPage(1)
  }
  const companyOptions = [
    { asset_id: 'All', symbol: 'All' },
    ...tokens.map((token) => ({
      asset_id: token.asset_id,
      symbol: token.symbol,
    })),
  ]

  const filterPills = {
    asset_id:
      companyOptions.find((option) => option.asset_id === companyFilter)
        ?.symbol || 'All',
    status: capitalize(statusFilter),
    qty:
      qtyFilter[0] !== null || qtyFilter[1] !== null
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
      case 'asset_id':
        setCompanyFilter('All')
        break
      case 'status':
        setStatusFilter('All')
        break
      case 'qty':
        setQtyFilter([null, null])
        break
      case 'dates':
        setSelectedDates([null, null])
        break
    }
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">Orders - Buy</h1>
      <div className="flex justify-end items-center space-x-2">
        {orders.length > 0 && (
          <CSVLink
            data={orders}
            filename={`OrderData_${moment().format(
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
        )}
        {/* <FilterButton
          filterPills={filterPills}
          openFilter={() => setFilterOpen(true)}
          removeFilter={removeFilter}
        /> */}
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
        onFilter={handleFilter}
        isSearchable={true}
        isLoading={ordersQuery.isLoading}
        onRowClick={(row) => setSelectedOrder(row.order_id)}
      />

      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => {
          setPage(1)
          setFilterOpen(false)
        }}
      >
        <div className="space-y-4">
          <FilterSelect
            header="Company Name"
            options={companyOptions.map((option) => option.symbol)}
            onSelect={(value) => {
              const selectedToken = companyOptions.find(
                (option) => option.symbol === value
              )
              setCompanyFilter(selectedToken ? selectedToken.asset_id : 'All')
            }}
            selected={
              companyOptions.find((option) => option.asset_id === companyFilter)
                ?.symbol || 'All'
            }
          />

          <FilterNumber
            header="Quantity"
            minRange={0}
            maxRange={10000}
            step={100}
            onChange={setQtyFilter}
          />

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
    </div>
  )
}

export default BuyOrdersPage
