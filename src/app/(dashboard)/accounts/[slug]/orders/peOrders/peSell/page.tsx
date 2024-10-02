'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import moment from 'moment'
import { AccountTable } from '@/components/accountTable/AccountTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { getSellOrders, getSellOrdersByAccountId } from '@/lib/api/ordersApi'
import { CSVLink } from 'react-csv'
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
import { OrdersParams } from '@/lib/types/types'
import { DateRange } from 'react-day-picker'
import { cn } from '@/lib/utils'

const headers = [
  { label: 'Order ID', key: 'gui_order_id' },
  { label: 'Account ID', key: 'gui_account_id' },
  { label: 'Side', key: 'side' },
  { label: 'Token', key: 'symbol' },
  { label: 'Quantity', key: 'quantity' },
  { label: 'Status', key: 'status' },
  { label: 'Created At', key: 'created_at' },
]

const SellOrdersTable = (): React.ReactElement => {
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const type = parts[0]
  const accountId = parts.slice(1).join('-')

  const [selectedOrder, setSelectedOrder] = useState<string | undefined>()
  const [qtyFilterType, setQtyFilterType] = useState<string>('between')
  const [tempQtyStart, setTempQtyStart] = useState<number>(0)
  const [tempQtyEnd, setTempQtyEnd] = useState<number>(10000)
  const [qtyStart, setQtyStart] = useState<number>(0)
  const [qtyEnd, setQtyEnd] = useState<number>(10000)
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  const { toast } = useToast()

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const fetchOrders = async () => {
    const params: OrdersParams = {
      page,
      limit,
      type: 'PE',
      side: 'Sell',
      search,
      qtyStart: qtyStart !== 0 ? qtyStart : undefined,
      qtyEnd: qtyEnd !== 10000 ? qtyEnd : undefined,
      createdAfter: dateRange?.from
        ? moment(dateRange.from).format('YYYY-MM-DD')
        : undefined,
      createdBefore: dateRange?.to
        ? moment(dateRange.to).format('YYYY-MM-DD')
        : undefined,
    }

    return accountId
      ? await getSellOrdersByAccountId(accountId, params, type)
      : await getSellOrders(params)
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'sell-orders',
      accountId,
      page,
      limit,
      qtyStart,
      qtyEnd,
      dateRange,
      search,
    ],
    queryFn: fetchOrders,
  })

  const orders = data?.orders || []
  const totalItems = data?.total || 0

  const peStatusOptions = {
    VERIFICATION_PENDING: 'Verification Pending',
    SIGN_AGREEMENT: 'Sign Agreement',
    ADD_IDENTITY_DETAILS: 'Add Identity Details',
    CONFIRM_IDENTITY_DETAILS: 'Confirm Identity Details',
    LOCKED: 'Locked',
    TRANSFER_PENDING: 'Transfer Pending',
    INVALID: 'Invalid',
    SUCCESS: 'Completed',
  }

  const columns = [
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
        const status = getValue() as keyof typeof peStatusOptions;
        return peStatusOptions[status] || status;
      },
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      cell: (value: string) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handleRowClick = (row: any) => {
    setSelectedOrder(row.order_id)
  }

  const handleApplyFilters = () => {
    setQtyFilterType(qtyFilterType)
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
      <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-min absolute right-[130px]">
            <FilterIcon className="mr-2 h-4 w-4" />
            Filters
            <Badge variant="secondary" className="ml-2">
              {
                Object.values({
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
              <Label>Quantity Filter</Label>
              <Select onValueChange={setQtyFilterType} value={qtyFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greater_than_equal_to">Greater Than or Equal To</SelectItem>
                  <SelectItem value="less_than_equal_to">Less Than or Equal To</SelectItem>
                  <SelectItem value="equal">Equal</SelectItem>
                  <SelectItem value="between">Between</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-2">
                {qtyFilterType !== 'less_than_equal_to' && (
                  <Input
                    type="number"
                    value={tempQtyStart}
                    onChange={(e) => handleQtyFilterChange([parseInt(e.target.value), tempQtyEnd])}
                    className="w-20"
                  />
                )}
                {qtyFilterType === 'between' && <span>to</span>}
                {(qtyFilterType === 'less_than_equal_to' || qtyFilterType === 'between') && (
                  <Input
                    type="number"
                    value={tempQtyEnd}
                    onChange={(e) => handleQtyFilterChange([tempQtyStart, parseInt(e.target.value)])}
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

      <div className="">
        <div className=" absolute flex justify-end right-[280px]">
          <CSVLink
            data={orders}
            filename={`SellOrderData_${moment().format(
              'MMMM Do YYYY, h:mm:ss a'
            )}.csv`}
            headers={headers}
          >
            <Button variant="outline" disabled={data?.orders.length === 0}>
              Export to CSV
            </Button>
          </CSVLink>
        </div>

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
          isLoading={isLoading}
          onRowClick={handleRowClick}
        />
      </div>
    </>
  )
}

export default SellOrdersTable
