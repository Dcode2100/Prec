'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { BulkPeTransaction } from '@/lib/types/bulkPeType'
import { getNumberInRupee, capitalize } from '@/utils/utils'

export const columnsForBulkPeTransactions = (): ColumnDef<BulkPeTransaction>[] => [
  {
    id: 'serialNumber',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sr No."
        className="text-sm "
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-center">{row.index + 1}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'transaction_id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Transaction ID"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] ">
        <CopyableCell value={row.getValue('transaction_id')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'reference_id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Reference ID"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] ">
        <CopyableCell value={row.getValue('reference_id')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'order_id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Order ID"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] ">
        <CopyableCell value={row.getValue('order_id') || '-'} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Amount"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">
        {getNumberInRupee(row.getValue('amount'), true)}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'charge',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Charge"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">
        {getNumberInRupee(row.getValue('charge'), true)}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'gst',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="GST"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">
        {getNumberInRupee(row.getValue('gst'), true)}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'payment_mode',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Payment Mode"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">
        {row.getValue('payment_mode') || '-'}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Type"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[100px]">
        {row.getValue('type')}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Status"
        className="text-sm"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status')?.toString().toLowerCase()
      const statusClass = status === 'success' ? 'text-[hsl(var(--highlight-green))]' :
                          status === 'failed' ? 'text-[hsl(var(--highlight-red))]' :
                          status === 'pending' ? 'text-[hsl(var(--highlight-yellow))]' :
                          'text-[hsl(var(--highlight-gray))]'
      return (
        <div className={`w-[120px] font-medium ${statusClass}`}>
          {capitalize(status?.split('_').join(' '))}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'transaction_created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        className="text-sm"
      />
    ),
    cell: ({ row }) => {
      const createdAt = moment(row.getValue('transaction_created_at'))
      return (
        <div className="w-[120px] flex flex-col text-xs">
          <span className="truncate font-bold text-muted-foreground">
            {createdAt.format('DD-MM-YYYY')}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {createdAt.format('h:mm A')}
          </span>
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'transaction_updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Updated At"
        className="text-sm"
      />
    ),
    cell: ({ row }) => {
      const updatedAt = moment(row.getValue('transaction_updated_at'))
      return (
        <div className="w-[120px] flex flex-col text-xs">
          <span className="truncate font-bold text-muted-foreground">
            {updatedAt.format('DD-MM-YYYY')}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {updatedAt.format('h:mm A')}
          </span>
        </div>
      )
    },
    enableSorting: true,
  },
]