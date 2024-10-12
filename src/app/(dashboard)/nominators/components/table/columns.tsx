'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import { useState } from 'react'
import { CopyIcon } from 'lucide-react'
import { ReactNode } from 'react'
import { useToast } from '@/hooks/use-toast'
import { NominatorAccountResponse, NominatorResponse } from '@/lib/types/types'
import moment from 'moment'

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

export const columnsForNominators = (
  ActionButton: (props: { row: NominatorResponse }) => ReactNode
): ColumnDef<NominatorResponse>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('name')} />,
    enableSorting: true,
  },
  {
    accessorKey: 'URL',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Link" />
    ),
    cell: ({ row }) => {
      const nominator = row.original
      const url =
        process.env.NEXT_PUBLIC_PORTAL_URL + `register/${nominator.code}` || ''
      return (
        <a href={url} target="_blank">
          {url}
        </a>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'code',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Code" />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('code')} />,
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status')
      return (
        <div
          className={`font-semibold ${
            status ? 'text-highlight-green' : 'text-highlight-red'
          }`}
        >
          {status ? 'Active' : 'Inactive'}
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'accounts',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No of Accounts" />
    ),
    cell: ({ row }) => <div>{row.getValue('accounts')}</div>,
    enableSorting: true,
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
    enableSorting: true,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionButton row={row.original} />,
    enableSorting: false,
  },
]

export const columnsForNominatorsAccounts: ColumnDef<NominatorAccountResponse>[] =
  [
    {
      accessorKey: 'gui_account_id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account ID" />
      ),
      cell: ({ row }) => (
        <CopyableCell value={row.getValue('gui_account_id')} />
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
      accessorKey: 'mobile',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mobile" />
      ),
      cell: ({ row }) => <div>{row.getValue('mobile')}</div>,
      enableSorting: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.getValue('email')}</div>,
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
