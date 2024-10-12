'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { useState } from 'react'
import { CopyIcon } from 'lucide-react'
import { WishlistResponse } from '@/lib/types/types'
import { ReactNode } from 'react'
import { useToast } from '@/hooks/use-toast'

// Helper function to copy text to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

const CopyableCell = ({ value }: { value: string }) => {
  const [showCopyIcon, setShowCopyIcon] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
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
      onClick={handleCopy}
      onMouseEnter={() => setShowCopyIcon(true)}
      onMouseLeave={() => setShowCopyIcon(false)}
      className="cursor-pointer flex items-center text-highlight-blue font-semibold hover:bg-gray-100 p-1 rounded relative w-full"
      title="Click to copy"
    >
      <span className="pr-6 truncate w-full">{value}</span>
      {showCopyIcon && (
        <CopyIcon className="w-4 h-4 absolute right-1 top-1/2 transform -translate-y-1/2" />
      )}
    </div>
  )
}

export const columnsForWishlist = (
  ActionButton: (props: { row: WishlistResponse }) => ReactNode
): ColumnDef<WishlistResponse>[] => [
  {
    accessorKey: 'gui_account_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account Id" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_account_id')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <div>{row.getValue('name')}</div>,
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
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionButton row={row.original} />,
    enableSorting: false,
  },
]
