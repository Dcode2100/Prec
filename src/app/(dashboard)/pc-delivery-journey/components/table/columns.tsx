'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import moment from 'moment'
import { useState } from 'react'
import { CopyIcon } from 'lucide-react'
import {
  RecentHoldings,
  RecentSubscriptionProcessingOrder,
} from '@/lib/types/pcDeliveryType'
import { useToast } from '@/hooks/use-toast'

// Helper function to copy text to clipboard
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

export const columnsForProcessing: ColumnDef<RecentSubscriptionProcessingOrder>[] =
  [
    {
      accessorKey: 'serialNumber',
      header: 'Sr No',
      cell: ({ row }) => {
        return <div className="text-center">{row.index + 1}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'gui_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order Id" />
      ),
      cell: ({ row }) => <CopyableCell value={row.getValue('gui_id')} />,
      enableSorting: false,
    },
    {
      accessorKey: 'gui_account_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account Id" />
      ),
      cell: ({ row }) => (
        <CopyableCell value={row.getValue('gui_account_id')} />
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
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => <div>{row.getValue('price')}</div>,

      enableSorting: false,
    },

    {
      accessorKey: 'status',
      accessorFn: (row) => {
        const asset = row
        switch (asset?.status) {
          case 'TRANSFER_PENDING':
            return 'Transfer Pending'
          case 'VERIFICATION_PENDING':
            return 'Verification Pending'
          case 'FAILED':
            return 'Failed'
          case 'SUBSCRIPTION_PROCESSING':
            return 'Subscription Processing'
          case 'SUBSCRIPTION_PROCESSED':
            return 'Subscription Processed'
          case 'YET_TO_START':
            return 'Yet to Start'
          case 'ON_TIME':
            return 'On Time'
          case 'ENDED':
            return 'Ended'
          case 'REPAID':
            return 'Repaid'
          default:
            return 'N/A'
        }
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
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
export const columnsForProcessed: ColumnDef<RecentHoldings>[] = [
  {
    accessorKey: 'serialNumber',
    header: 'Sr No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'gui_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Order Id" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('gui_id')} />,
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
    accessorKey: 'price',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ row }) => <div>{row.getValue('price')}</div>,

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
    accessorFn: (row) => {
      const asset = row
      switch (asset?.status) {
        case 'TRANSFER_PENDING':
          return 'Transfer Pending'
        case 'VERIFICATION_PENDING':
          return 'Verification Pending'
        case 'FAILED':
          return 'Failed'
        case 'SUBSCRIPTION_PROCESSING':
          return 'Subscription Processing'
        case 'SUBSCRIPTION_PROCESSED':
          return 'Subscription Processed'
        case 'YET_TO_START':
          return 'Yet to Start'
        case 'ON_TIME':
          return 'On Time'
        case 'ENDED':
          return 'Ended'
        case 'REPAID':
          return 'Repaid'
        default:
          return 'N/A'
      }
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
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
export const columnsForProcessingPage: ColumnDef<RecentSubscriptionProcessingOrder>[] =
  [
    {
      accessorKey: 'serialNumber',
      header: 'Sr No',
      cell: ({ row }) => {
        return <div className="text-center">{row.index + 1}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'gui_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Order Id" />
      ),
      cell: ({ row }) => <CopyableCell value={row.getValue('gui_id')} />,
      enableSorting: false,
    },
    {
      accessorKey: 'gui_account_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account Id" />
      ),
      cell: ({ row }) => (
        <CopyableCell value={row.getValue('gui_account_id')} />
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
      accessorKey: 'price',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Price" />
      ),
      cell: ({ row }) => <div>{row.getValue('price')}</div>,

      enableSorting: false,
    },

    {
      accessorKey: 'status',
      accessorFn: (row) => {
        const asset = row
        switch (asset?.status) {
          case 'TRANSFER_PENDING':
            return 'Transfer Pending'
          case 'VERIFICATION_PENDING':
            return 'Verification Pending'
          case 'FAILED':
            return 'Failed'
          case 'SUBSCRIPTION_PROCESSING':
            return 'Subscription Processing'
          case 'SUBSCRIPTION_PROCESSED':
            return 'Subscription Processed'
          case 'YET_TO_START':
            return 'Yet to Start'
          case 'ON_TIME':
            return 'On Time'
          case 'ENDED':
            return 'Ended'
          case 'REPAID':
            return 'Repaid'
          default:
            return 'N/A'
        }
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
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
export const columsForYetToStart: ColumnDef<RecentSubscriptionProcessingOrder>[] =
  [
    {
      accessorKey: 'gui_account_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account Id" />
      ),
      cell: ({ row }) => (
        <CopyableCell value={row.getValue('gui_account_id')} />
      ),
      enableSorting: false,
    },
    {
      id: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.first_name} {row.original.last_name}
        </div>
      ),
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
      accessorKey: 'quantity',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Quantity" />
      ),
      cell: ({ row }) => <div>{row.getValue('quantity')}</div>,

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
      accessorFn: (row) => {
        const asset = row
        switch (asset?.status) {
          case 'TRANSFER_PENDING':
            return 'Transfer Pending'
          case 'VERIFICATION_PENDING':
            return 'Verification Pending'
          case 'FAILED':
            return 'Failed'
          case 'SUBSCRIPTION_PROCESSING':
            return 'Subscription Processing'
          case 'SUBSCRIPTION_PROCESSED':
            return 'Subscription Processed'
          case 'YET_TO_START':
            return 'Yet to Start'
          case 'ON_TIME':
            return 'On Time'
          case 'ENDED':
            return 'Ended'
          case 'REPAID':
            return 'Repaid'
          default:
            return 'N/A'
        }
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
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
