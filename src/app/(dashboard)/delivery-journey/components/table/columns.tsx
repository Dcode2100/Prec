'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import {
  orderDetails,
  OrderResponse,
  UsersPanPendingResponse,
} from '@/lib/types/types'
import moment from 'moment'
import { capitalize } from '@/utils/helper'
import CopyableCell from '@/components/CopyCell'

export const columns: ColumnDef<orderDetails>[] = [
  {
    accessorKey: 'serialNumber',
    header: 'Sr No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'gui_order_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Id" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_order_id')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'gui_account_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Id" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_account_id')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'symbol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Token" />
    ),
    cell: ({ row }) => <div>{row.getValue('symbol')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => <div>{row.getValue('quantity')}</div>,

    enableSorting: false,
  },

  {
    accessorKey: 'status',
    accessorFn: (row) => {
      const asset = row
      return asset?.status === 'TRANSFER_PENDING'
        ? 'Transfer Pending'
        : asset?.status === 'VERIFICATION_PENDING'
        ? 'Verification Pending'
        : asset.status === 'FAILED'
        ? 'Failed'
        : 'NA'
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => <div>{row.getValue('status')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="createdAt" />
    ),
    cell: ({ row }) => {
      const createdAt = moment(row.getValue('created_at'))
      return (
        <div className="w-[120px] flex flex-col">
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
export const columnsForPanPending: ColumnDef<UsersPanPendingResponse>[] = [
  {
    accessorKey: 'serialNumber',
    header: 'Sr No',
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination
      const serialNumber = pageIndex * pageSize + row.index + 1
      return <div className="text-center">{serialNumber}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'gui_account_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Id" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_account_id')} />,
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
    accessorKey: 'orders_count',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Orders" />
    ),
    cell: ({ row }) => <div>{row.getValue('orders_count')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'portal_linked',
    accessorFn: (row) => {
      const asset = row
      return asset?.portal_linked === true ? 'TRUE' : 'FALSE'
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Linked" />
    ),

    cell: ({ row }) => <div>{row.getValue('portal_linked')}</div>,

    enableSorting: false,
  },
  {
    accessorKey: 'bo_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="BOID" />
    ),
    cell: ({ row }) => <div>{row.getValue('bo_id')}</div>,

    enableSorting: false,
  },
  {
    accessorKey: 'pan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Pan" />
    ),
    cell: ({ row }) => <div>{row.getValue('pan')}</div>,

    enableSorting: false,
  },

  {
    accessorKey: 'status',

    accessorFn: (row) => {
      const asset = row
      return asset.status !== 'SUCCESS'
        ? asset.status === 'PENDING'
          ? 'Payment' + ' ' + capitalize(asset.status.split('_').join(' '))
          : asset.status === 'ADD_BANK'
          ? "Didn't Add Bank"
          : asset?.status === 'CONFIRM_DEMAT'
          ? "Didn't Confirm Demat"
          : asset?.status === 'PLACE_ORDER'
          ? "Didn't Place Order"
          : capitalize(asset.status.split('_').join(' '))
        : 'Completed'
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div
        className={
          row.getValue('status') === 'Transfer Pending'
            ? 'text-highlight-yellow'
            : row.getValue('status') === 'Verification Pending'
            ? 'text-highlight-gray'
            : 'text-highlight-blue'
        }
      >
        {row.getValue('status')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="createdAt" />
    ),
    cell: ({ row }) => {
      const createdAt = moment(row.getValue('created_at'))
      return (
        <div className="w-[120px] flex flex-col">
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

export const shareDetailsColumns: ColumnDef<OrderResponse>[] = [
  {
    accessorKey: 'serialNumber',
    header: 'Sr. No',
    cell: ({ row }) => <div className="text-center">{row.index + 1}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'gui_order_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order ID" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_order_id')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'gui_account_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account ID" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_account_id')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'gui_transaction_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction ID" />
    ),
    cell: ({ row }) => (
      <CopyableCell value={row.getValue('gui_transaction_id')} />
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const firstName = row.original.first_name
      const lastName = row.original.last_name
      return <div>{`${firstName} ${lastName}`}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'symbol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Token" />
    ),
    cell: ({ row }) => <div>{row.getValue('symbol')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div>{row.getValue('status')}</div>,
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
        <div className="w-[120px] flex flex-col">
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
