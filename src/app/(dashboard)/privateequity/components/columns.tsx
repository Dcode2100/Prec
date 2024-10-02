'use client'
import { ColumnDef } from '@tanstack/react-table'

import { DataTableColumnHeader } from './data-table-column-header'
import { CopyIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

interface AssetData {
  token: string
  symbol: string
  price: number | string
  totalWishlistUsers: number
  availableQuantity: number
  availableLots: number
  transferPendingOrderQuantity: number
  sourceQuantities: number
  comingSoon?: boolean
  soldOut?: boolean
  onlyFewLeft?: boolean
  isListedOnExchange?: boolean
}
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

export const columns: ColumnDef<AssetData>[] = [
  {
    accessorKey: 'token',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Token" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('token')} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'symbol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbol" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('symbol')} />,
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
    accessorKey: 'totalWishlistUsers',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Wishlist" />
    ),
    cell: ({ row }) => <div>{row.getValue('totalWishlistUsers')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'availableQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="DPQty" />
    ),
    cell: ({ row }) => <div>{row.getValue('availableQuantity')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'availableLots',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Available Lots" />
    ),
    cell: ({ row }) => <div>{row.getValue('availableLots')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'transferPendingOrderQuantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transfer Pending" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue('transferPendingOrderQuantity')}</div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'sourceQuantities',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source Qty" />
    ),
    cell: ({ row }) => <div>{row.getValue('sourceQuantities')}</div>,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'status',
    accessorFn: (row) => {
      const asset = row
      return asset?.comingSoon
        ? 'Coming soon'
        : asset?.soldOut
        ? 'Sold out'
        : asset?.onlyFewLeft
        ? 'Only few left'
        : asset?.isListedOnExchange
        ? 'Listed'
        : 'Available'
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="State" />
    ),
    cell: ({ row }) => (
      <div
        className={
          row.getValue('status') === 'Coming soon'
            ? 'text-highlight-yellow'
            : row.getValue('status') === 'Sold out'
            ? 'text-highlight-gray'
            : row.getValue('status') === 'Only few left'
            ? 'text-highlight-red'
            : row.getValue('status') === 'Listed'
            ? 'text-highlight-green'
            : 'text-highlight-blue'
        }
      >
        {row.getValue('status')}
      </div>
    ),
  },
]
