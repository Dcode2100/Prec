'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { WebhooksResponse } from '@/lib/types/webhooksType'

// Helper function to copy text to clipboard

export const columnsForWebhooks = (): ColumnDef<WebhooksResponse>[] => [
  {
    id: 'serialNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="S No." />
    ),
    cell: ({ row }) => <div className="text-xs">{row.index + 1}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'reference_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ref. Id" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('reference_id')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'beneficiary_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Beneficiary Name" />
    ),
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue('beneficiary_name')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'bank_reference_number',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bank Ref. No." />
    ),
    cell: ({ row }) => (
      <CopyableCell value={row.getValue('bank_reference_number')} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => <div className="text-xs">{row.getValue('amount')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => <div className="text-xs">{row.getValue('balance')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div className="text-xs">{row.getValue('status')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'precize_status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Precize Status" />
    ),
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue('precize_status')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'direction',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Direction" />
    ),
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue('direction')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'provider_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Provider Name" />
    ),
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue('provider_name')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const updatedAt = moment(row.getValue('updated_at'))
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
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
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
]
