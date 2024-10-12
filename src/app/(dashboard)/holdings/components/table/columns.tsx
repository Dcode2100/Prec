'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { AccountWiseHoldingData } from '@/lib/types/types'
import moment from 'moment'
import { capitalize } from '@/utils/helper'
import { useState } from 'react'
import { CopyIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { PcHolding } from '@/lib/types/getAllPCHoldingsType'
import { cn } from '@/lib/utils'

const tokenTypes = [
  { label: 'Live', value: 'LIVE' },
  { label: 'Coming soon', value: 'COMING_SOON' },
  { label: 'Yet to start', value: 'YET_TO_START' },
  { label: 'Delayed', value: 'DELAYED' },
  { label: 'On Time', value: 'ON_TIME' },
  { label: 'Ended', value: 'ENDED' },
  { label: 'Repaid', value: 'REPAID' },
]

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
      <span className="pr-6 truncate w-full font-semibold">{value}</span>
      {showCopyIcon && (
        <CopyIcon className="w-4 h-4 absolute right-1 top-1/2 transform -translate-y-1/2" />
      )}
    </div>
  )
}

export const accountWiseHoldingColumns: ColumnDef<AccountWiseHoldingData>[] = [
  {
    accessorKey: 'gui_account_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account ID" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_account_id')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      const account = row.original
      return (
        <div>
          {`${capitalize(account.first_name)} ${capitalize(
            account.last_name
          )}`.trim()}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'symbol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Token" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('symbol')} />,
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
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'mobile',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mobile" />
    ),
    cell: ({ row }) => <div>{row.getValue('mobile')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'sold',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sold" />
    ),
    cell: ({ row }) => {
      const isSold = row.getValue('sold')
      return (
        <div
          className={`font-semibold ${
            isSold ? 'text-highlight-green' : 'text-highlight-red'
          }`}
        >
          {isSold ? 'Yes' : 'No'}
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

export const pcHoldingColumns: ColumnDef<PcHolding>[] = [
  {
    accessorKey: 'gui_account_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account ID" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_account_id')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => {
      const holding = row.original
      return (
        <div>
          {`${capitalize(holding.first_name || '')} ${capitalize(
            holding.middle_name || ''
          )} ${capitalize(holding.last_name || '')}`.trim()}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'symbol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Symbol" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('symbol')} />,
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
    accessorKey: 'quantity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Quantity" />
    ),
    cell: ({ row }) => <div>{row.getValue('quantity')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'returns',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Returns" />
    ),
    cell: ({ row }) => <div>{row.getValue('returns')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'subscription_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subscription" />
    ),
    cell: ({ row }) => <div>{row.getValue('subscription_amount')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'min_repayment_amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Min Repayment" />
    ),
    cell: ({ row }) => <div>{row.getValue('min_repayment_amount')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      let statusClass = ''

      switch (status) {
        case 'LIVE':
          statusClass = 'text-highlight-green'
          break
        case 'COMING_SOON':
          statusClass = 'text-highlight-blue'
          break
        case 'YET_TO_START':
          statusClass = 'text-highlight-yellow'
          break
        case 'DELAYED':
          statusClass = 'text-highlight-red'
          break
        case 'ON_TIME':
          statusClass = 'text-highlight-green'
          break
        case 'ENDED':
          statusClass = 'text-highlight-gray'
          break
        case 'REPAID':
          statusClass = 'text-highlight-green'
          break
        default:
          statusClass = 'text-highlight-yellow'
      }

      const label =
        tokenTypes.find((type) => type.value === status)?.label || status

      return <div className={cn(statusClass, 'font-semibold')}>{label}</div>
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
