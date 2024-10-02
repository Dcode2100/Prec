'use client'
import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from './data-table-column-header'
import moment from 'moment'
import { PcAsset } from '@/lib/types/types'
import { CopyIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const CopyableCell = ({ value }: { value: string }) => {
  const [showCopyIcon, setShowCopyIcon] = useState(false)
  const { toast } = useToast()

  const handleCopy = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    copyToClipboard(value)
    toast({
      title: 'Copied to clipboard',
      description: `"${value}" has been copied to your clipboard.`,
      variant: 'success',
      duration: 3000,
    })
  }

  return (
    <div
      onClick={(e) => handleCopy(e)}
      onMouseEnter={() => setShowCopyIcon(true)}
      onMouseLeave={() => setShowCopyIcon(false)}
      className="cursor-pointer flex items-center text-highlight-blue hover:bg-gray-100 p-1 rounded relative w-full"
      title="Click to copy"
    >
      <span className="pr-6 truncate w-full">{value}</span>
      {showCopyIcon && (
        <CopyIcon className="w-4 h-4 absolute right-1 top-1/2 transform -translate-y-1/2" />
      )}
    </div>
  )
}
export const columns: ColumnDef<PcAsset>[] = [
  {
    accessorKey: 'gui_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GUI ID" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_id')} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('name')} />,
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => <div>{row.getValue('price')}</div>,
    enableSorting: false,
    enableHiding: false,
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
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'subscribed_value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscribe value" />
    ),
    cell: ({ row }) => <div>{row.getValue('subscribed_value')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'tenure',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tenure" />
    ),
    cell: ({ row }) => <div>{row.getValue('tenure')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'available_quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available Qty" />
    ),
    cell: ({ row }) => <div>{row.getValue('available_quantity')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'min_order_value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Min order value" />
    ),
    cell: ({ row }) => <div>{row.getValue('min_order_value')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'active',
    accessorFn: (row) => {
      const asset = row
      return asset?.active === true ? 'True' : 'False'
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => (
      <div
        className={
          row.getValue('active') === 'False'
            ? 'text-highlight-red'
            : row.getValue('active') === 'True'
            ? 'text-highlight-green'
            : ''
        }
      >
        {row.getValue('active')}
      </div>
    ),
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
  },
]
