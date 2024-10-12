'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { SESWebhook } from '@/lib/types/webhooksType'
import { ReactNode } from 'react'

// Helper function to copy text to clipboard

export const columnsForSESWebhooks = (
  ActionButton: (props: { row: SESWebhook }) => ReactNode
): ColumnDef<SESWebhook>[] => [
  {
    id: 'serialNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="S No." />
    ),
    cell: ({ row }) => <div className="text-xs">{row.index + 1}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <CopyableCell value={row.getValue('id')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="text-xs w-[100px] overflow-hidden truncate">
        {row.getValue('email')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'vendor_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor Id" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <CopyableCell value={row.getValue('vendor_id')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'vendor_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vendor Name" />
    ),
    cell: ({ row }) => (
      <div className="text-xs">{row.getValue('vendor_name')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div className="text-xs">{row.getValue('type')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="text-xs w-[100px] overflow-hidden truncate">
        {row.getValue('status')}
      </div>
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
  {
    accessorKey: 'response',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Response Message" />
    ),
    cell: ({ row }) => <ActionButton row={row.original} />,
    enableSorting: false,
  },
]
