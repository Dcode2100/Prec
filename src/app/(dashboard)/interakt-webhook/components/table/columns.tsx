'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { InteraktWebhook } from '@/lib/types/webhooksType'
import { ReactNode } from 'react'

export const columnsForInteraktWebhooks = (
  ActionButton: (props: { row: InteraktWebhook }) => ReactNode
): ColumnDef<InteraktWebhook>[] => [
  {
    id: 'serialNumber',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sr No."
        className="text-sm "
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-center">{row.index + 1}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'phone_number',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Phone Number"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] ">
        <CopyableCell value={row.getValue('phone_number')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'chat',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Chat Message Type"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]  overflow-hidden">
        <div className="truncate text-sm text-highlight-yellow font-semibold">
          {row.original.webhook_data.data.message.chat_message_type}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'message_status',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Message Status"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]  overflow-hidden ">
        <div className="truncate text-sm text-highlight-red font-semibold">
          {row.getValue('message_status')}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        className="text-sm"
      />
    ),
    cell: ({ row }) => {
      const createdAt = moment(row.getValue('created_at'))
      return (
        <div className="w-[120px]  flex flex-col text-xs">
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
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Updated At"
        className="text-sm"
      />
    ),
    cell: ({ row }) => {
      const updatedAt = moment(row.getValue('updated_at'))
      return (
        <div className="w-[120px]  flex flex-col text-xs">
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
    accessorKey: 'Response',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Response Message" />
    ),
    cell: ({ row }) => <ActionButton row={row.original} />,
    enableSorting: false,
  },
]
