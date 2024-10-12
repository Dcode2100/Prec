'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { TransactionsParams } from '@/lib/types/types'

export const columnsForPennyDropTransactions = (): ColumnDef<TransactionsParams>[] => [
  {
    id: 'serialNumber',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sr No."
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-center">{row.index + 1}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'account_id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Account ID"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <CopyableCell value={row.getValue('account_id')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'vendor_transaction_id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Vendor Transaction ID"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <CopyableCell value={row.getValue('vendor_transaction_id')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'payee_account_number',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Payee Bank Account No"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <CopyableCell value={row.getValue('payee_account_number')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'payee_account_ifsc',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Payee IFSC"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <CopyableCell value={row.getValue('payee_account_ifsc')} />
      </div>
    ),
    enableSorting: false,
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
      const status = row.getValue('status') as string
      let statusColor = 'text-highlight-yellow'

      if (status.toLowerCase() === 'completed') {
        statusColor = 'text-green-500'
      } else if (status.toLowerCase() === 'rejected') {
        statusColor = 'text-red-500'
      }
      return (
        <div className="w-[150px] overflow-hidden">
          <div className={`truncate text-sm ${statusColor} font-semibold`}>
            {status}
          </div>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        className="text-sm"
      />
    ),
    cell: ({ row }) => {
      const createdAt = moment(row.getValue('created_at'))
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
    enableSorting: false,
  }
]
