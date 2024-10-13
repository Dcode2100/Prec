'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import moment from 'moment'
import AccountTable from '@/components/accountTable/AccountTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import OrderDetails from '@/components/sheets/OrderDetails'
import { getOrdersByAccountId } from '@/lib/api/ordersApi'
import { CSVLink } from 'react-csv'
import { getGlobalItem } from '@/utils/utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { FilterIcon } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { DateRangePicker } from '@/components/DateRangePicker'
import { OrderResponse, OrdersParams } from '@/lib/types/types'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'
import { ColumnTable } from '@/lib/types'

const headers = [
  { label: 'Order ID', key: 'gui_order_id' },
  { label: 'Account ID', key: 'gui_account_id' },
  { label: 'Side', key: 'side' },
  { label: 'Token', key: 'symbol' },
  { label: 'Quantity', key: 'quantity' },
  { label: 'Status', key: 'status' },
  { label: 'Created At', key: 'created_at' },
]

const assetIdsOptions: any[] = ['All']

const PeBuyOrdersTable = (): React.ReactElement => {
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const type = parts[0]
  const accountId = parts.slice(1).join('-')

  const [selectedOrder, setSelectedOrder] = useState<string | undefined>()
  const [dataUpdate, setDataUpdate] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [companyFilter, setCompanyFilter] = useState<string>('All')
  const [qtyFilterType, setQtyFilterType] = useState<string>('between')
  const [tempQtyStart, setTempQtyStart] = useState<number>(0)
  const [tempQtyEnd, setTempQtyEnd] = useState<number>(10000)
  const [qtyStart, setQtyStart] = useState<number>(0)
  const [qtyEnd, setQtyEnd] = useState<number>(10000)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')

  const isAffiliate = getGlobalItem('isAffiliate')

  const [tempStatusFilter, setTempStatusFilter] = useState<string>('All')
  const [tempCompanyFilter, setTempCompanyFilter] = useState<string>('All')
  const tempQtyFilterType = 'between'
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>()

  const fetchOrders = async () => {
    const params: OrdersParams = {
      page,
      limit,
      type: 'PE',
      status: statusFilter !== 'All' ? statusFilter : undefined,
      search,
      qtyStart: qtyStart !== 0 ? qtyStart : undefined,
      qtyEnd: qtyEnd !== 10000 ? qtyEnd : undefined,
      asset_id: companyFilter !== 'All' ? companyFilter : undefined,
      createdAfter: dateRange?.from
        ? moment(dateRange.from).format('YYYY-MM-DD')
        : undefined,
      createdBefore: dateRange?.to
        ? moment(dateRange.to).format('YYYY-MM-DD')
        : undefined,
    }

    return await getOrdersByAccountId(accountId, params, type)
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'orders',
      accountId,
      page,
      limit,
      statusFilter,
      companyFilter,
      qtyStart,
      qtyEnd,
      dateRange,
      search,
    ],
    queryFn: fetchOrders,
  })

  const orders = data?.orders || []
  const totalItems = data?.total || 0
  const transferable = false
  const peStatusOptions = !transferable
    ? {
        VERIFICATION_PENDING: 'Verification Pending',
        SIGN_AGREEMENT: 'Sign Agreement',
        ADD_IDENTITY_DETAILS: 'Add Identity Details',
        CONFIRM_IDENTITY_DETAILS: 'Confirm Identity Details',
        LOCKED: 'Locked',
        TRANSFER_PENDING: 'Transfer Pending',
        INVALID: 'Invalid',
        SUCCESS: 'Completed',
      }
    : {
        SUCCESS: 'Completed',
        TRANSFER_PENDING: 'Transfer Pending',
        INVALID: 'Invalid',
      }

  const columns: ColumnTable<OrderResponse>[] = [
    { header: 'Order ID', accessorKey: 'gui_order_id' },
    { header: 'Account ID', accessorKey: 'gui_account_id' },
    { header: 'Side', accessorKey: 'side' },
    { header: 'Token', accessorKey: 'symbol' },
    { header: 'Quantity', accessorKey: 'quantity' },
    { header: 'Price', accessorKey: 'price_per_lot' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue() as keyof typeof peStatusOptions
        return peStatusOptions[status] || status
      },
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      cell: ({ getValue }) =>
        moment(getValue() as string).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleFilter = (key: string, value: string) => {
    switch (key) {
      case 'status':
        setStatusFilter(value)
        break
      case 'company':
        setCompanyFilter(value)
        break
    }
    setPage(1)
    refetch()
  }

  const handleRowClick = (row: OrderResponse) => {
    setSelectedOrder(row.order_id)
  }

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleApplyFilters = () => {
    setStatusFilter(tempStatusFilter)
    setCompanyFilter(tempCompanyFilter)
    setQtyFilterType(tempQtyFilterType)
    setQtyStart(tempQtyStart)
    setQtyEnd(tempQtyEnd)
    setDateRange(tempDateRange)
    setPage(1)
    setIsFilterOpen(false)
    refetch()
  }

  const handleQtyFilterChange = (values: number[]) => {
    switch (qtyFilterType) {
      case 'greater_than_equal_to':
        setTempQtyStart(values[0])
        setTempQtyEnd(10000)
        break
      case 'less_than_equal_to':
        setTempQtyStart(0)
        setTempQtyEnd(values[0])
        break
      case 'equal':
        setTempQtyStart(values[0])
        setTempQtyEnd(values[0])
        break
      case 'between':
        setTempQtyStart(values[0])
        setTempQtyEnd(values[1])
        break
    }
  }

  const getSliderValue = () => {
    switch (qtyFilterType) {
      case 'greater_than_equal_to':
        return [tempQtyStart]
      case 'less_than_equal_to':
        return [tempQtyEnd]
      case 'equal':
        return [tempQtyStart]
      case 'between':
        return [tempQtyStart, tempQtyEnd]
    }
  }

  return (
    <>
      {/* {selectedOrder && (
        <OrderDetails
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(undefined)}
          order_id={selectedOrder}
          order={orders.find((order: OrderResponse) => order.order_id === selectedOrder)}
        />
      )} */}
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-min absolute right-[130px]">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
            <Badge variant="secondary" className="ml-2">
              {
                Object.values({
                  statusFilter,
                  companyFilter,
                  qtyFilterType,
                  qtyStart,
                  qtyEnd,
                  dateRange,
                }).filter(Boolean).length
              }
            </Badge>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filter Orders</SheetTitle>
            <SheetDescription>
              Apply filters to narrow down your order list.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Select
                onValueChange={setTempCompanyFilter}
                value={tempCompanyFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select company" />
                </SelectTrigger>
                <SelectContent>
                  {assetIdsOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantity Filter</Label>
              <Select onValueChange={setQtyFilterType} value={qtyFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater_than_equal_to">
                    Greater Than or Equal To
                  </SelectItem>
                  <SelectItem value="less_than_equal_to">
                    Less Than or Equal To
                  </SelectItem>
                  <SelectItem value="equal">Equal</SelectItem>
                  <SelectItem value="between">Between</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                {qtyFilterType !== 'less_than_equal_to' && (
                  <Input
                    type="number"
                    value={tempQtyStart}
                    onChange={(e) =>
                      handleQtyFilterChange([
                        parseInt(e.target.value),
                        tempQtyEnd,
                      ])
                    }
                    className="w-20"
                  />
                )}
                {qtyFilterType === 'between' && <span>to</span>}
                {(qtyFilterType === 'less_than_equal_to' ||
                  qtyFilterType === 'between') && (
                  <Input
                    type="number"
                    value={tempQtyEnd}
                    onChange={(e) =>
                      handleQtyFilterChange([
                        tempQtyStart,
                        parseInt(e.target.value),
                      ])
                    }
                    className="w-20"
                  />
                )}
              </div>
              <Slider
                min={0}
                max={10000}
                step={100}
                value={getSliderValue()}
                onValueChange={handleQtyFilterChange}
                className={cn(
                  qtyFilterType === 'less_than_equal_to' && 'direction-rtl'
                )}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>0</span>
                <span>10000</span>
              </div>
            </div>

            {!isAffiliate && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  onValueChange={setTempStatusFilter}
                  value={tempStatusFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {Object.entries(peStatusOptions).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Created At</Label>
              <DateRangePicker
                date={tempDateRange}
                onDateChange={(range) => {
                  setTempDateRange(range)
                }}
              />
            </div>

            <Button onClick={handleApplyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <AccountTable
        isSearchable={true}
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
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />

      {selectedOrder && (
        <OrderDetails
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(undefined)}
          order_id={selectedOrder}
          setLoading={() => {}}
          order={orders.find((order) => order.order_id === selectedOrder)}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
        />
      )}
    </>
  )
}

export default PeBuyOrdersTable
