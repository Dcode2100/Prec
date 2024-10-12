'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { Enquiry } from '@/lib/types/PcEnquiryType'

// Helper function to copy text to clipboard

export const columnsForPcEnquiries = (): ColumnDef<Enquiry>[] => [
  {
    id: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="pl-4" />
    ),
    cell: ({ row }) => (
      <div className="text-xs pl-4">
        {row.original.first_name} {row.original.last_name}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('email')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'mobile',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mobile" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('mobile')} />,
    enableSorting: true,
  },
  {
    accessorKey: 'wallet_balance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wallet Balance" />
    ),
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue('wallet_balance')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'no_of_holdings',
    header: () => <div className="text-xs">No. of Holdings</div>,
    cell: ({ row }) => <div>{row.getValue('no_of_holdings')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'no_of_paid_orders',
    header: () => <div className="text-xs">No. of Paid Orders</div>,
    cell: ({ row }) => <div>{row.getValue('no_of_paid_orders')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'total_holdings_amount',
    header: () => <div className="text-xs ">Total Holdings Amount</div>,
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue('total_holdings_amount')}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
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
  },
  {
    accessorKey: 'active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" className="pr-4" />
    ),
    cell: ({ row }) => {
      const active = row.getValue('active')
      return (
        <div
          className={`font-semibold pr-4 ${
            active ? 'text-highlight-green' : 'text-highlight-red'
          }`}
        >
          {active ? 'Yes' : 'No'}
        </div>
      )
    },
    enableSorting: false,
  },
]
