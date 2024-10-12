'use client'
import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import { PcAsset } from '@/lib/types/types'
import CopyableCell from '@/components/CopyCell'

export const columnsForPrivateCredit = (): ColumnDef<PcAsset>[] => [
  {
    accessorKey: 'gui_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GUI ID" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_id')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('name')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => <div>{row.getValue('price')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'tentative_end_date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Est. Maturity date" />
    ),
    cell: ({ row }) => (
      <div>
        {moment(row.getValue('tentative_end_date')).format('DD-MM-YYYY')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'subscribed_value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscribe value" />
    ),
    cell: ({ row }) => <div>{row.getValue('subscribed_value')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'tenure',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tenure" />
    ),
    cell: ({ row }) => <div>{row.getValue('tenure')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'available_quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available Qty" />
    ),
    cell: ({ row }) => <div>{row.getValue('available_quantity')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'min_order_value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Min order value" />
    ),
    cell: ({ row }) => <div>{row.getValue('min_order_value')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'active',
    accessorFn: (row) => {
      const asset = row
      return asset?.active === true ? 'false' : 'False'
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => (
      <div
        className={
          row.getValue('active') === 'False'
            ? 'text-highlight-red'
            : row.getValue('active') === 'false'
            ? 'text-highlight-green'
            : ''
        }
      >
        {row.getValue('active')}
      </div>
    ),
    enableSorting: false,
  },

  {
    accessorKey: 'status',
    accessorFn: (row) => {
      const asset = row
      return asset?.status === 'LIVE'
        ? 'Live'
        : asset?.status === 'COMING_SOON'
        ? 'Coming soon'
        : asset?.status === 'DELAYED'
        ? 'Delayed'
        : asset?.status === 'ON_TIME'
        ? 'On Time'
        : asset?.status === 'ENDED'
        ? 'Ended'
        : asset?.status === 'REPAID' && 'Repaid'
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div
        className={
          row.getValue('status') === 'Coming soon'
            ? 'text-highlight-yellow'
            : row.getValue('status') === 'Ended'
            ? 'text-highlight-gray'
            : row.getValue('status') === 'Delayed'
            ? 'text-highlight-red'
            : row.getValue('status') === 'Live'
            ? 'text-highlight-green'
            : 'text-highlight-blue'
        }
      >
        {row.getValue('status')}
      </div>
    ),
    enableSorting: false,
  },
]
