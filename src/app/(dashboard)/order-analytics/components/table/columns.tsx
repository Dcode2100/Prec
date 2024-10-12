'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import {
  orderDetails,
  PEOrderType,
  TransactionListObj,
  PEAccountType,
} from '@/lib/types/types'
import moment from 'moment'
import { capitalize } from '@/utils/helper'
import { useState } from 'react'
import { CopyIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

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

export const columnsOrders: ColumnDef<orderDetails>[] = [
  {
    accessorKey: 'serialNumber',
    header: 'Sr. No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
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
    accessorKey: 'side',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Side" />
    ),
    cell: ({ row }) => (
      <div
        className={cn(
          row.getValue('side') === 'Buy'
            ? 'text-highlight-green'
            : 'text-highlight-red'
        )}
      >
        {row.getValue('side')}
      </div>
    ),
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

export const columnsTransactions: ColumnDef<TransactionListObj>[] = [
  {
    accessorKey: 'serialNumber',
    header: 'Sr. No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
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
    accessorKey: 'gui_account_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account ID" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_account_id')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'direction',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Direction" />
    ),
    cell: ({ row }) => <div>{capitalize(row.getValue('direction'))}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => <div>{row.getValue('amount')}</div>,
    enableSorting: false,
  },

  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div>{capitalize(row.getValue('status'))}</div>,
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

export const columnsForOrderByStatus: ColumnDef<PEOrderType>[] = [
  {
    accessorKey: 'serialNumber',
    header: 'Sr. No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
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
    accessorKey: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Full Name" />
    ),
    cell: ({ row }) => {
      const order = row.original
      return <div>{`${order.firstName} ${order.lastName}`.trim() || ''}</div>
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
    cell: ({ row }) => {
      const quantity: number = row.getValue('quantity')
      return <div>{Number(quantity > 0 ? quantity : '0.00')}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      let displayStatus = ''

      if (status !== 'SUCCESS') {
        if (status === 'PENDING') {
          displayStatus = 'Payment ' + capitalize(status.split('_').join(' '))
        } else if (status === 'ADD_BANK') {
          displayStatus = "Didn't Add Bank"
        } else if (status === 'CONFIRM_DEMAT') {
          displayStatus = "Didn't Confirm Demat"
        } else if (status === 'PLACE_ORDER') {
          displayStatus = "Didn't Place Order"
        } else {
          displayStatus = capitalize(status.split('_').join(' '))
        }
      } else {
        displayStatus = 'Completed'
      }

      return <div>{displayStatus}</div>
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

export const columnsAccounts: ColumnDef<PEAccountType>[] = [
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
          {`${capitalize(account.firstName)} ${capitalize(
            account.lastName
          )}`.trim()}
        </div>
      )
    },
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
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('email')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'nominator',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nominator" />
    ),
    cell: ({ row }) => <div>{row.getValue('nominator') || 'NA'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'onBoardingTracker',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Onboarding Tracker" />
    ),
    cell: ({ row }) => <div>{row.getValue('onBoardingTracker') || 'NA'}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div>
        {capitalize((row.getValue('status') as string).split('_').join(' '))}
      </div>
    ),
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
