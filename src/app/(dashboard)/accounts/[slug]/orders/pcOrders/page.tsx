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
import { getPCOrders, getPCOrdersByAccountId } from '@/lib/api/ordersApi'
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
import { Label } from '@/components/ui/label'
import { DateRangePicker } from '@/components/DateRangePicker'
import { OrdersParams } from '@/lib/types/types'
import { DateRange } from 'react-day-picker'
import PCOrderDetails from '@/components/sheets/PCOrderDetails'
import { PCOrders } from '@/lib/types/PcEnquiryType'
import { ColumnTable } from '@/lib/types'

const headers = [
  { label: 'Order ID', key: 'gui_id' },
  { label: 'Account ID', key: 'gui_account_id' },
  { label: 'Symbol', key: 'symbol' },
  { label: 'Quantity', key: 'quantity' },
  { label: 'Price', key: 'price' },
  { label: 'Status', key: 'status' },
  { label: 'Created At', key: 'created_at' },
]

const PCOrdersTable = (): React.ReactElement => {
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const type = parts[0]
  const accountId = parts.slice(1).join('-')

  const [selectedOrder, setSelectedOrder] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [dataUpdate, setDataUpdate] = useState(false)
  const { toast } = useToast()

  const pcOrderStatus = {
    All: 'All',
    SUBSCRIPTION_PROCESSED: 'Subscription processed',
    FAILED: 'Failed',
    PAYMENT_PENDING: 'Payment pending',
    SUBSCRIPTION_PROCESSING: 'Subscription processing',
  }

  const fetchOrders = async () => {
    const params: OrdersParams = {
      page,
      limit,
      type: 'PC',
      status: statusFilter !== 'All' ? statusFilter : undefined,
      search,
      createdAfter: dateRange?.from
        ? moment(dateRange.from).format('YYYY-MM-DD')
        : undefined,
      createdBefore: dateRange?.to
        ? moment(dateRange.to).format('YYYY-MM-DD')
        : undefined,
    }

    return accountId
      ? await getPCOrdersByAccountId(accountId, params)
      : await getPCOrders(params)
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'pc-orders',
      accountId,
      page,
      limit,
      statusFilter,
      dateRange,
      search,
      dataUpdate,
    ],
    queryFn: fetchOrders,
  })

  const orders = data?.orders || []
  const totalItems = data?.total || 0

  const columns : ColumnTable<PCOrders>[] = [
    { header: 'Order ID', accessorKey: 'gui_id' },
    { header: 'Account ID', accessorKey: 'gui_account_id' },
    { header: 'Symbol', accessorKey: 'symbol' },
    { header: 'Quantity', accessorKey: 'quantity' },
    { header: 'Price', accessorKey: 'price' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ getValue }) => {
        const status = getValue() as keyof typeof pcOrderStatus;
        return pcOrderStatus[status] || status;
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
    setSelectedOrder(row.id)
  }

  const handleApplyFilters = () => {
    setDateRange(tempDateRange)
    setPage(1)
    setIsFilterOpen(false)
    refetch()
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
                  statusFilter,
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
              <Label>Status</Label>
              <Select onValueChange={setStatusFilter} value={statusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(pcOrderStatus).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <div className="absolute flex justify-end right-[280px]">
          <CSVLink
            data={orders}
            filename={`PCOrderData_${moment().format(
              'MMMM Do YYYY, h:mm:ss a'
            )}.csv`}
            headers={headers}
          >
            <Button variant="outline" disabled={orders.length === 0}>
              Export to CSV
            </Button>
          </CSVLink>
        </div>

        <AccountTable
          isSearchable={true}
          columns={columns }
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

      {selectedOrder && (
        <PCOrderDetails
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(undefined)}
          order_id={selectedOrder}
          setLoading={() => {}}
          order={orders.find((order) => order.id === selectedOrder)}
          dataUpdate={dataUpdate}
          setDataUpdate={setDataUpdate}
        />
      )}
    </>
  )
}

export default PCOrdersTable
